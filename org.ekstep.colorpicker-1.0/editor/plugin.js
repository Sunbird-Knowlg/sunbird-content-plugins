EkstepEditor.basePlugin.extend({
    type: "colorpicker",
    picker: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener("colorpicker:show", this.showColorPicker, this);
        EkstepEditorAPI.addEventListener("colorpicker:state", this.invoke, this);
        EkstepEditorAPI.addEventListener("colorpicker:update", this.updateColor, this);
    },
    showColorPicker: function() {
        this.picker.show();
    },
    invoke: function(event, data) {
        if (EkstepEditor.jQuery("#" + data.id).attr("colorpicker") != "added") {
            this.picker = new jscolor(document.getElementById(data.id), {
                valueElement: null,
                onFineChange: function() {
                    data.callback("color", this.toHEXString())
                }
            });
            EkstepEditor.jQuery("#" + data.id).attr("colorpicker", "added");
        }
        if (data && data.color) {
            this.picker.fromString(data.color);
        } else{
            this.picker.fromString("#000000"); // default color will be black
        }
    }
});
//# sourceURL=colorpickerplugin.js