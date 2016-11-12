EkstepEditor.basePlugin.extend({
    type: "shape-text",
    thumbnail: undefined,
    onclick: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener("shape-text:create", this.createNew, this);
    },
    newInstance: function() {
        this.editorObj = new fabric.Rect(this.manifest.editor.initdata.invisibleShape);
    },
    createNew: function(event, data) {
        this.create({});
    },
    moving: function(options, event) {
        this.children[0].editorObj.set("left", this.children[0].editorData.props.left + (this.editorObj.left - this.editorData.props.invisibleShape.left));
        this.children[0].editorObj.set("top", this.children[0].editorData.props.top + (this.editorObj.top - this.editorData.props.invisibleShape.top));
        this.children[1].editorObj.set("left", this.children[1].editorData.props.left + (this.editorObj.left - this.editorData.props.invisibleShape.left));
        this.children[1].editorObj.set("top", this.children[1].editorData.props.top + (this.editorObj.top - this.editorData.props.invisibleShape.top));
        this.children[0].editorObj.setCoords();
        this.children[1].editorObj.setCoords();
    },
    added: function(instance, options, event) {
        console.log('composite plugin added');
        if (instance.children.length === 0) {
            EkstepEditorAPI.instantiatePlugin('org.ekstep.text@1.0', { props: instance.manifest.editor.initdata.text }, instance);
            EkstepEditorAPI.instantiatePlugin('org.ekstep.shape@1.0', { type: instance.manifest.editor.initdata.rectangle.type, props: instance.manifest.editor.initdata.rectangle }, instance);
        }
    },
    render: function(canvas) {
        canvas.add(this.editorObj);
        canvas.add(this.children[0].editorObj);
        canvas.add(this.children[1].editorObj);
    }
});
