EkstepEditor.basePlugin.extend({
    type: "shape-text",
    thumbnail: undefined,
    onclick: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener("shape-text:createNew", this.createNew, this);
    },
    newInstance: function(data) {
        if (data && data.props) {
            data.props.invisibleShape.id = this.id;
            this.editorObj = new fabric.Rect(data.props.invisibleShape);
        }
    },
    createNew: function(event, data) {
        this.create({ type: "rect", props: data });
    },
    moving: function(options, event) {
        this.children[0].editorObj.set("left", this.children[0].data.props.left + (this.editorObj.left - this.data.props.invisibleShape.left));
        this.children[0].editorObj.set("top", this.children[0].data.props.top + (this.editorObj.top - this.data.props.invisibleShape.top));
        this.children[1].editorObj.set("left", this.children[1].data.props.left + (this.editorObj.left - this.data.props.invisibleShape.left));
        this.children[1].editorObj.set("top", this.children[1].data.props.top + (this.editorObj.top - this.data.props.invisibleShape.top));
        this.children[0].editorObj.setCoords();
        this.children[1].editorObj.setCoords();
    },
    added: function(instance, options, event) {
        if (instance.children.length === 0) {
            EkstepEditorAPI.instantiatePlugin('org.ekstep.text@1.0', { props: instance.data.props.text }, instance);
            EkstepEditorAPI.instantiatePlugin('org.ekstep.shape@1.0', { type: instance.data.props.rectangle.type, props: instance.data.props.rectangle }, instance);
        }
    },
    selected: function(instance, options, event) {
        EkstepEditorAPI.updateContextMenus([
            { id: 'colorpicker', state: 'HIDE', data: { color: instance.editorObj.getFill() } },
        ]);
    },
    deselected: function(instance, options, event) {
        EkstepEditorAPI.updateContextMenus([
            { id: 'colorpicker', state: 'HIDE', data: {} },
        ]);
    }
});
