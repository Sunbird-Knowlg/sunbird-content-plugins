EkstepEditor.basePlugin.extend({
    type: "hotspot",
    initialize: function() {},
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        if (this.attributes.type === 'rect') {
            this.editorObj = new fabric.Rect(props);
        }
    },
    onRemove: function(event) {

    },
    updateAttributes: function() {
        var instance = this;
        var dataList = { "stroke-width": "stroke-width", "scaleX": "scaleX", "scaleY": "scaleY" };
        if (this) {
            _.forEach(dataList, function(val, key) {
                instance.attributes[key] = instance.editorObj.get(val);
            })
            this.attributes.radius = this.editorObj.rx;
        }
    },
    resetConfig: function(data) {
        this.config = this.config || {};
        EkstepEditorAPI.dispatchEvent("colorpicker:state", { id: "colorpicker" });
    }
});
