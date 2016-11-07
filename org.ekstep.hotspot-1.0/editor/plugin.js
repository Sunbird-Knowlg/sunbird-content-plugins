EkstepEditor.basePlugin.extend({
    type: "hotspot",
    initialize: function() {
        EkstepEditorAPI.addEventListener("hotspot:create", this.addHotspot, this);
    },
    newInstance: function(data) {
        data.props.id = this.id;
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
    updateColor: function(color) {
        this.editorObj.fill = color;
        this.attributes.fill = color;
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
    updateContextMenu: function () {
        EkstepEditorAPI.updateContextMenu({ id: 'colorpicker', state: 'HIDE', data: { color: EkstepEditorAPI.getEditorObject().getFill() } });
    }
});
