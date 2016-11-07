EkstepEditor.basePlugin.extend({
    type: "colorpicker",
    picker: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener("colorpicker:show", this.showColorPicker, this);
        EkstepEditorAPI.addEventListener("colorpicker:state", this.updateState, this);
        EkstepEditorAPI.addEventListener("colorpicker:update", this.updateColor, this);
    },
    showColorPicker: function() {
        this.picker.show();
    },
    updateState: function(event, data) {
            this.picker = new jscolor(document.getElementById(this.manifest.editor.menu[0].id), {
                valueElement: null,
                onFineChange: function() {
                    EkstepEditorAPI.dispatchEvent("colorpicker:update", this.toHEXString());
                }
            });
        if (data && data.color)
            this.picker.fromString(data.color);
    },
    updateColor: function(event, data) {
        EkstepEditorAPI.getCurrentObject().updateColor(data);
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', {id: EkstepEditorAPI.getEditorObject().id});
    }
});
