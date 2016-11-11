EkstepEditor.basePlugin.extend({
    type: "hotspot",
    initialize: function() {
        EkstepEditorAPI.addEventListener("hotspot:create", this.addHotspot, this);
    },
    newInstance: function(data) {
        if (data.type && data.type === "hotspot") {
            this.editorObj = new fabric.Rect(data.props);
        }
        this.attributes.type = "roundrect";
        this.attributes.radius = 1;
        this.attributes.hitArea = true;
    },
    addHotspot: function(event, data) {
        this.create({ type: 'hotspot', props: data });
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
