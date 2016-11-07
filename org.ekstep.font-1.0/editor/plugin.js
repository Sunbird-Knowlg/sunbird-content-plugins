EkstepEditor.basePlugin.extend({
    type: "font",
    initialize: function() {
        EkstepEditorAPI.addEventListener("font:toggleBold", this.toggleBold, this);
        EkstepEditorAPI.addEventListener("font:toggleItalic", this.toggleItalic, this);
        EkstepEditorAPI.addEventListener("font:updateStyle", this.updateStyle, this);
        EkstepEditorAPI.addEventListener("font:updateSize", this.updateSize, this);
        EkstepEditorAPI.addEventListener("fontfamily:state", this.updateFontFamilyContextMenu, this);
        EkstepEditorAPI.addEventListener("fontsize:state", this.updateFontSizeContextMenu, this);
    },
    toggleBold: function(event, data) {
        EkstepEditorAPI.getCurrentObject().toggleBold();
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    toggleItalic: function(event, data) {
        EkstepEditorAPI.getCurrentObject().toggleItalic();
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    updateStyle: function(event, data) {
        EkstepEditorAPI.getCurrentObject().updateStyle(EkstepEditor.jQuery("#" + data.id).val().split(":")[1]);
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    updateSize: function(event, data) {
        EkstepEditorAPI.getCurrentObject().updateSize(EkstepEditor.jQuery("#" + data.id).val().split(":")[1]);
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    updateFontFamilyContextMenu: function(event, data) {
        if (data.fontfamily) {
            EkstepEditor.jQuery("#fontfamily").val("string:" + data.fontfamily)
        }
    },
    updateFontSizeContextMenu: function(event, data) {
        if (data.fontsize) {
            EkstepEditor.jQuery("#fontsize").val("number:" + data.fontsize)
        }
    },
});
