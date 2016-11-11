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
        if (EkstepEditor.jQuery("#" + data.id).attr("colorpicker") != "added") {
            this.picker = new jscolor(document.getElementById(data.id), {
                valueElement: null,
                onFineChange: function() {
                    EkstepEditorAPI.dispatchEvent("colorpicker:update", this.toHEXString());
                }
            });

            EkstepEditor.jQuery("#" + data.id).attr("colorpicker", "added");
        }
        if (data && data.color) {
            this.picker.fromString(data.color);
        } else {
            this.picker.fromString(EkstepEditorAPI.getCurrentObject().editorObj.getFill());
        }
    },
    updateColor: function(event, data) {
        EkstepEditorAPI.getCurrentObject().editorObj.setFill(data);
        EkstepEditorAPI.getCurrentObject().config.colorpicker = data;
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { id: EkstepEditorAPI.getEditorObject().id });
    }
});
