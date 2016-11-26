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
        if ($("#hollowcircleconfigColor").length === 0) {
            $("#plugin-toolbar-container ul").first().append($("<li>", { id: "hollowcircleconfigColor", class: "list-group-item" }));

            $("#hollowcircleconfigColor").append($("<label>", { text: "color", style: "margin-right:10px" }));
            $("#hollowcircleconfigColor").append($("<input>", { class: "hc-color-picker" }));
            $(".hc-color-picker").spectrum({
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
            $(".hc-color-picker").spectrum("set", EkstepEditorAPI.getCurrentObject().editorObj.getStroke());
        }
        if ($("#hollowcircleconfigRadius").length === 0) {
            $("#plugin-toolbar-container ul").first().append($("<li>", { id: "hollowcircleconfigRadius", class: "list-group-item" }));
            $("#hollowcircleconfigRadius").append($("<label>", { text: "Radius", style: "margin-right:10px" }));
            $("#hollowcircleconfigRadius").append($("<input>", { type: "number", id: "hsRadius", class: "hc-radius", value: EkstepEditorAPI.getCurrentObject().editorObj.radius }));
            $("#hsRadius").on("change keyup mouseup", function() {
                instance.onConfigChange("radius", parseInt($(this).val()));
            })
        } else {
            $("#hsRadius").val(EkstepEditorAPI.getCurrentObject().editorObj.radius);
        }
        if ($("#hollowcircleconfigStrokeWidth").length === 0) {
            $("#plugin-toolbar-container ul").first().append($("<li>", { id: "hollowcircleconfigStrokeWidth", class: "list-group-item" }));
            $("#hollowcircleconfigStrokeWidth").append($("<label>", { text: "Thickness", style: "margin-right:10px" }));
            $("#hollowcircleconfigStrokeWidth").append($("<input>", { type: "number", id: "hsStrokeWidth", class: "hc-stroke-width", value: EkstepEditorAPI.getCurrentObject().editorObj.strokeWidth }));
            $("#hsStrokeWidth").on("change keyup mouseup", function() {
                instance.onConfigChange("strokewidth", parseInt($(this).val()));
            })
        } else {
            $("#hsStrokeWidth").val(EkstepEditorAPI.getCurrentObject().editorObj.strokeWidth);
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
        $("#hollowcircleconfigStrokeWidth").remove();
        $("#hollowcircleconfigRadius").remove();
        $("#hollowcircleconfigColor").remove();
    }
});
//# sourceURL=hollowcircleplugin.js
