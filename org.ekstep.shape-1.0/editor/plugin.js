EkstepEditor.basePlugin.extend({
    type: "shape",
    initialize: function() {
        EkstepEditorAPI.addEventListener("shape:createRectange", this.createRectange, this);
        EkstepEditorAPI.addEventListener("shape:createCircle", this.createCircle, this);
    },
    newInstance: function(data) {
        switch (data.type) {
            case 'rect':
                this.editorObj = new fabric.Rect(data.props);
                this.attributes = data.props;
                if(_.isUndefined(data.props.rx)) {
                    this.attributes.type = 'rect';
                } else {
                    this.attributes.type = 'roundrect';
                    this.attributes.radius = this.attributes.rx;
                }
                break;
            case 'circle':
                this.editorObj = new fabric.Ellipse(data.props);
                this.attributes = data.props;
                this.attributes.type = 'ellipse';
                break;
            default:
        }
    },
    createRectange: function(event, data) {
        this.create({ type: 'rect', props: data });
    },
    createCircle: function(event, data) {
        this.create({ type: 'circle', props: data });
    },
    updateAttributes: function() {
        var instance = this;
        var dataList = { "opacity": "opacity", "stroke": "stroke", "stroke-width": "stroke-width", "scaleX": "scaleX", "scaleY": "scaleY" };
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
