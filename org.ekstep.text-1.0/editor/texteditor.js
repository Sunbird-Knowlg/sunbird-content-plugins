fabric.ITextbox = fabric.util.createClass(fabric.Textbox, fabric.Observable, {
    type: "i-textbox",
    initialize: function(text, options) {
        this.ctx = fabric.util.createCanvasElement().getContext("2d");
        this.callSuper("initialize", text, options);
    },
    _measureText: function(ctx, text, lineIndex, charOffset) {
        return ctx.measureText(text).width;
    }
});
fabric.ITextbox.fromObject = function(object) {
    return new fabric.ITextbox(object.text, fabric.util.object.clone(object));
};
fabric.ITextbox.instances = [];

var textEditor = (function() {
    var $editor = EkstepEditor.jQuery("#authoringTextEditor"),
        $doneBtn = EkstepEditor.jQuery("#authoringTextEditorBtn"),
        $cancelBtn = EkstepEditor.jQuery("#authoringTextEditorCancel"),
        pluginId = undefined,
        editorText = undefined;

    function _removeObject() {
        EkstepEditorAPI.getPluginInstance(pluginId).editorObj.remove();
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { id: pluginId });
    }

    function _commonBtnClickAction() {
        $cancelBtn.hide();
        $editor.hide();
        $doneBtn.hide();
        EkstepEditor.jQuery("#toolbarOptions").show();
    }

    function showEditor(id) {
        pluginId = id;
        editorText = EkstepEditorAPI.getPluginInstance(pluginId).editorObj.text;
        if (!$editor.length) {
            var form = EkstepEditor.jQuery("<div>", { class: "ui form", id: "textEditorContainer" });
            form.css({
                "top": EkstepEditor.jQuery("canvas").offset().top,
                "left": EkstepEditor.jQuery("canvas").offset().left,
                "position": "absolute"
            });
            var field = EkstepEditor.jQuery("<div>", { class: "field" });
            form.appendTo("body");
            field.appendTo(form)
            EkstepEditor.jQuery(document.createElement("textarea"))
                .text(editorText)
                .attr({ "id": "authoringTextEditor", "placeholder": "Add text here", "rows": 12 })
                .css({ "width": "30.5em" })
                .appendTo(field);
            $editor = EkstepEditor.jQuery("#authoringTextEditor");
        } else {
            $editor.show().val(editorText);
        }

        if (!$doneBtn.length) {
            EkstepEditor.jQuery(document.createElement("button"))
                .attr("id", "authoringTextEditorBtn")
                .text("Done")
                .addClass("ui primary button")
                .css({
                    "top": $editor.offset().top + $editor.innerHeight() - 50,
                    "left": $editor.offset().left+100,
                    "position": "absolute"
                })
                .insertAfter("#authoringTextEditor")
                .click(function() {
                    _commonBtnClickAction();
                    if ($editor.val().trim().length) {
                        EkstepEditorAPI.getPluginInstance(pluginId).editorObj.text = $editor.val();
                        EkstepEditorAPI.render();
                        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getPluginInstance(pluginId).editorObj });
                        EkstepEditor.jQuery("#toolbarOptions").show();
                    } else {
                        _removeObject();
                    }
                    $editor.val("");
                });
            $doneBtn = EkstepEditor.jQuery("#authoringTextEditorBtn")
        } else {
            $doneBtn.show();
        }

        if (!$cancelBtn.length) {
            EkstepEditor.jQuery(document.createElement("button"))
                .attr("id", "authoringTextEditorCancel")
                .text("Cancel")
                .addClass("ui secondary button")
                .css({
                    "top": $editor.offset().top + $editor.innerHeight() - 50,
                    "left": $editor.offset().left,
                    "position": "absolute"
                })
                .insertAfter("#authoringTextEditor")
                .click(function() {
                    _commonBtnClickAction();
                    if (!editorText.trim().length) {
                        _removeObject();
                    }
                });
            $cancelBtn = EkstepEditor.jQuery("#authoringTextEditorCancel");
        } else {
            $cancelBtn.show();
        }
        setTimeout(function(){EkstepEditor.jQuery("#toolbarOptions").hide();},600);
    }

    function hideEditor() {
        $editor.val("").hide();
        $doneBtn.hide();
        $cancelBtn.hide();
        EkstepEditor.jQuery("#toolbarOptions").show();
    }
    return {
        showEditor: showEditor,
        hide: hideEditor
    }
})();
