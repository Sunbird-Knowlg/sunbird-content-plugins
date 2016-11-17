EkstepEditor.basePlugin.extend({
    type: "scribblepad",
    initialize: function() {},
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);        
        if(this.attributes.type === 'roundrect'){
            this.editorObj = new fabric.Rect(props);
        }
    },
    updateAttributes: function() {
        var instance = this;
        var dataList = { "radius": "radius", "opacity": "opacity", "stroke": "stroke", "stroke-width": "stroke-width", "scaleX": "scaleX", "scaleY": "scaleY" };
        if (instance) {
            _.forEach(dataList, function(val, key) {
                instance.attributes[key] = instance.editorObj.get(val);
            })
        }
    },
    resetConfig: function(data) {
        this.config = this.config || {};
        EkstepEditorAPI.dispatchEvent("colorpicker:state", { id: "colorpicker" });
    }
});
