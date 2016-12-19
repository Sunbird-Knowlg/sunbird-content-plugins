EkstepEditor.basePlugin.extend({
    type: "org.ekstep.hollowcircle",
    initialize: function() {
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this)
    },
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        this.editorObj = new fabric.Circle(props);
        if (this.editorObj) this.editorObj.setStroke(props.stroke);
    },
    renderConfig: function(event, data) {
        var instance = this;
        if (EkstepEditorAPI.jQuery("#hollowcircleconfigColor").length === 0) {
            EkstepEditorAPI.jQuery("#plugin-toolbar-container ul").first().append(EkstepEditorAPI.jQuery("<li>", { id: "hollowcircleconfigColor", class: "list-group-item" }));

            EkstepEditorAPI.jQuery("#hollowcircleconfigColor").append(EkstepEditorAPI.jQuery("<label>", { text: "color", style: "margin-right:10px" }));
            EkstepEditorAPI.jQuery("#hollowcircleconfigColor").append(EkstepEditorAPI.jQuery("<input>", { class: "hc-color-picker" }));
            EkstepEditorAPI.jQuery(".hc-color-picker").spectrum({
                color: EkstepEditorAPI.getCurrentObject().editorObj.getStroke(),
                showPalette: true,
                palette: [
                    ['black', 'white', 'blanchedalmond'],
                    ['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
                ],
                clickoutFiresChange: false,
                change: function(color) { instance.onConfigChange("color", color.toHexString()); }
            });
        } else {
            EkstepEditorAPI.jQuery(".hc-color-picker").spectrum("set", EkstepEditorAPI.getCurrentObject().editorObj.getStroke());
        }
        if (EkstepEditorAPI.jQuery("#hollowcircleconfigRadius").length === 0) {
            EkstepEditorAPI.jQuery("#plugin-toolbar-container ul").first().append(EkstepEditorAPI.jQuery("<li>", { id: "hollowcircleconfigRadius", class: "list-group-item" }));
            EkstepEditorAPI.jQuery("#hollowcircleconfigRadius").append(EkstepEditorAPI.jQuery("<label>", { text: "Radius", style: "margin-right:10px" }));
            EkstepEditorAPI.jQuery("#hollowcircleconfigRadius").append(EkstepEditorAPI.jQuery("<input>", { type: "number", id: "hsRadius", class: "hc-radius", value: EkstepEditorAPI.getCurrentObject().editorObj.radius }));
            EkstepEditorAPI.jQuery("#hsRadius").on("change keyup mouseup", function() {
                instance.onConfigChange("radius", parseInt(EkstepEditorAPI.jQuery(this).val()));
            })
        } else {
            EkstepEditorAPI.jQuery("#hsRadius").val(EkstepEditorAPI.getCurrentObject().editorObj.radius);
        }
        if (EkstepEditorAPI.jQuery("#hollowcircleconfigStrokeWidth").length === 0) {
            EkstepEditorAPI.jQuery("#plugin-toolbar-container ul").first().append(EkstepEditorAPI.jQuery("<li>", { id: "hollowcircleconfigStrokeWidth", class: "list-group-item" }));
            EkstepEditorAPI.jQuery("#hollowcircleconfigStrokeWidth").append(EkstepEditorAPI.jQuery("<label>", { text: "Thickness", style: "margin-right:10px" }));
            EkstepEditorAPI.jQuery("#hollowcircleconfigStrokeWidth").append(EkstepEditorAPI.jQuery("<input>", { type: "number", id: "hsStrokeWidth", class: "hc-stroke-width", value: EkstepEditorAPI.getCurrentObject().editorObj.strokeWidth }));
            EkstepEditorAPI.jQuery("#hsStrokeWidth").on("change keyup mouseup", function() {
                instance.onConfigChange("strokewidth", parseInt(EkstepEditorAPI.jQuery(this).val()));
            })
        } else {
            EkstepEditorAPI.jQuery("#hsStrokeWidth").val(EkstepEditorAPI.getCurrentObject().editorObj.strokeWidth);
        }
    },
    onConfigChange: function(key, value) {
        var instance = EkstepEditorAPI.getCurrentObject();
        var editorObj = instance.editorObj
        switch (key) {
            case "color":
                editorObj.setStroke(value);
                instance.attributes.stroke = value;
                break;
            case "radius":
                editorObj.setRadius(value);
                instance.attributes.radius = value;
                break;
            case "strokewidth":
                editorObj.setStrokeWidth(value);
                instance.attributes.strokeWidth = value;
                break;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    objectUnselected: function (event, data) {
        EkstepEditorAPI.jQuery("#hollowcircleconfigStrokeWidth").remove();
        EkstepEditorAPI.jQuery("#hollowcircleconfigRadius").remove();
        EkstepEditorAPI.jQuery("#hollowcircleconfigColor").remove();
    }
});
//# sourceURL=hollowcircleplugin.js
