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
        EkstepEditorAPI.dispatchEvent('object:modified', {id: pluginId});
    }

    function _commonBtnClickAction() {
        $cancelBtn.hide();
        $editor.hide();
        $doneBtn.hide();
        EkstepEditor.jQuery(".tool-container").show();
    }

    function showEditor(id) {
        pluginId = id;
        editorText = EkstepEditorAPI.getPluginInstance(pluginId).editorObj.text;
        if (!$editor.length) {
            EkstepEditor.jQuery(document.createElement("textarea"))
                .text(editorText)
                .attr({ "id": "authoringTextEditor", "placeholder": "Add text here" })
                .css({
                    "top": EkstepEditor.jQuery("canvas").offset().top,
                    "left": EkstepEditor.jQuery("canvas").offset().left,
                    "position": "absolute"
                })
                .appendTo(EkstepEditor.jQuery("body"));
            $editor = EkstepEditor.jQuery("#authoringTextEditor");
        } else {
            $editor.show().val(editorText);
        }

        if (!$doneBtn.length) {
            EkstepEditor.jQuery(document.createElement("button"))
                .attr("id", "authoringTextEditorBtn")
                .text("Done")
                .addClass("btn at-btn at-btn-ok")
                .css({
                    "top": $editor.offset().top + $editor.outerHeight() + 5,
                    "left": $editor.offset().left + $editor.outerWidth() - 75,
                    "position": "absolute"
                })
                .insertAfter("#authoringTextEditor")
                .click(function() {
                    _commonBtnClickAction();
                    if ($editor.val().trim().length) {
                        EkstepEditorAPI.getPluginInstance(pluginId).editorObj.text = $editor.val();
                        EkstepEditorAPI.render();
                        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getPluginInstance(pluginId).editorObj });
                        EkstepEditor.jQuery(".tool-container").show();
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
                .addClass("btn at-btn at-btn-lined")
                .css({
                    "top": $editor.offset().top + $editor.outerHeight() + 5,
                    "left": $editor.offset().left + $editor.outerWidth() - 165,
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
        EkstepEditor.jQuery(".tool-container").hide();
    }
    function hideEditor() {
        $editor.val("").hide();
        $doneBtn.hide();
        $cancelBtn.hide();
        EkstepEditor.jQuery(".tool-container").show();
    }
    return {
        showEditor: showEditor,
        hide: hideEditor
    }
})();
