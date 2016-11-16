EkstepEditor.basePlugin.extend({
    type: "shape",
    initialize: function() {},
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        switch (this.attributes.type) {
            case 'ellipse':
                props.rx = props.r;
                props.ry = props.r;
                this.editorObj = new fabric.Ellipse(props);
                break;
            case 'roundrect':
            case 'rect':
                this.editorObj = new fabric.Rect(props);
                break;
            default:
        }
        if(this.editorObj) this.editorObj.setFill(props.fill);
    },
    onConfigChange: function(data) {
        if (data.color) {
            EkstepEditorAPI.getCurrentObject().editorObj.setFill(data.color);
            EkstepEditorAPI.getCurrentObject().attributes.color = data.color;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    }
});
