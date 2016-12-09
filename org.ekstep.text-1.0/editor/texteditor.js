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
        $btnGrpParent = EkstepEditor.jQuery('<div>',{style:"margin-top: 6px; margin-right: 6px;"}) 
        $buttonGrp = EkstepEditor.jQuery('<div>', { class: 'ui buttons', id: 'texteditorBtnGrp', style:"float: right;" });
    $orBtn = EkstepEditor.jQuery('<div>', { class: 'or' });
    pluginId = undefined,
        editorText = undefined;

    function _removeObject() {
        EkstepEditorAPI.getPluginInstance(pluginId).editorObj.remove();
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { id: pluginId });
    }

    function _commonBtnClickAction() {
        $buttonGrp.hide();
        $cancelBtn.hide();
        $editor.hide();
        $doneBtn.hide();
        EkstepEditor.jQuery("#toolbarOptions").show();
    }

    function showEditor(id) {
        pluginId = id;
        editorText = EkstepEditorAPI.getPluginInstance(pluginId).editorObj.text;
        if (!$editor.length) {
            var form = EkstepEditor.jQuery("<div>", { class: "ui form", id: "textEditorContainer", style:"margin-left: 10px; margin-top: 10px;" });
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
            $btnGrpParent.insertAfter($editor);
            $btnGrpParent.append($buttonGrp);
        } else {
            $editor.show().val(editorText);
        }

        if (!$doneBtn.length) {
            $doneBtn = EkstepEditor.jQuery("<button>",{text: 'Done',id: 'authoringTextEditorBtn', class: 'ui primary button'})
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
        } else {
            $doneBtn.show();
        }

        if (!$cancelBtn.length) {
            $cancelBtn = EkstepEditor.jQuery('<button>',{text: 'Cancel',id: 'authoringTextEditorCancel', class: 'ui secondary button'})
                .click(function() {
                    _commonBtnClickAction();
                    if (!editorText.trim().length) {
                        _removeObject();
                    }
                });
        } else {
            $cancelBtn.show();
        }
        $buttonGrp.append($cancelBtn);
        $buttonGrp.append($orBtn);
        $buttonGrp.append($doneBtn);
        //$buttonGrp.css({position:'absolute', 'top': $editor.offset().top+$editor.height()/2+64,'left': $editor.offset().left+22})
        $buttonGrp.show();
        setTimeout(function() { EkstepEditor.jQuery("#toolbarOptions").hide(); }, 600);
    }

    function hideEditor() {
        $editor.val("").hide();
        $buttonGrp.hide();
        $doneBtn.hide();
        $cancelBtn.hide();
    }
    return {
        showEditor: showEditor,
        hide: hideEditor
    }
})();
