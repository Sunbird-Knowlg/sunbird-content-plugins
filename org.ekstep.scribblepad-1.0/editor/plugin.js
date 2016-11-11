EkstepEditor.basePlugin.extend({
    type: "scribblepad",
    initialize: function() {
        EkstepEditorAPI.addEventListener("scribblepad:create", this.addScribblepad, this);
    },
    newInstance: function(data) {
        if (data && data.type === "scribblepad") this.editorObj = new fabric.Rect(data.props);
        this.attributes.type = 'roundrect';
        this.attributes.thickness = 2;
        this.attributes.color = '#000';
    },
    addScribblepad: function(event, data) {
        this.create({ type: "scribblepad", props: data });
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
