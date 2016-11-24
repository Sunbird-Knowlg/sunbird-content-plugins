EkstepEditor.basePlugin.extend({
    type: "org.ekstep.scribblepad",
    initialize: function() {},
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        props.stroke = 1;
        props.strokeWidth = 2;
        props.strokeDashArray = [5, 5];
        if (this.attributes.type === 'roundrect') {
            this.editorObj = new fabric.Rect(props);
            this.addMedia({
                id: "org.ekstep.scribblepad.eraser",
                src: "http://localhost:3000/plugins/org.ekstep.scribblepad-1.0/assets/Eraser.png",
                assetId: "org.ekstep.scribblepad.eraser",
                type: "image",
                preload: true
            });
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
    onConfigChange: function(key, value) {
        if (key === 'color') {
            this.editorObj.setFill(value);
            this.attributes.fill = value;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    getAttributes: function() {
        var attr = this._super();
        delete attr.strokeDashArray;
        attr['stroke-width'] = 1;
        attr['opacity'] = 0.3;
        attr.stroke = '#663300';
        attr.thickness = 2;
        return attr;
    },
    getConfig: function() {
        return { color: this.attributes.fill };
    }
});
//# sourceURL=scribblepadplugin.js
