EkstepEditor.basePlugin.extend({
    type: "stage",
    thumbnail: undefined,
    onclick: undefined,
    currentObject: undefined,
    attributes: {
        x: 0,
        y: 0,
        w: 720,
        h: 405,
        scaleX: 1,
        scaleY: 1,
        visible: true
    },
    initialize: function() {
        EkstepEditorAPI.addEventListener("stage:create", this.createStage, this);
        EkstepEditorAPI.addEventListener("object:modified", this.modified, this);
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:removed", this.objectRemoved, this);
    },
    createStage: function(event, data) {
        EkstepEditorAPI.instantiatePlugin(this.manifest.id + '@' + this.manifest.ver, {});
    },
    newInstance: function(data) {
        this.onclick = { id: 'stage:select', data: { stageId: this.id } }
        EkstepEditorAPI.addStage(this);
        this.attributes = {
            x: 0,
            y: 0,
            w: 720,
            h: 405,
            scaleX: 1,
            scaleY: 1,
            visible: true
        };
    },
    addChild: function(plugin) {
        this.children.push(plugin);
        EkstepEditorAPI.getCanvas().add(plugin.editorObj);
        EkstepEditorAPI.getCanvas().setActiveObject(plugin.editorObj);
        EkstepEditorAPI.getCanvas().trigger('object:selected', { target: plugin.editorObj });
        EkstepEditorAPI.dispatchEvent('object:modified', { id: plugin.id });
    },
    render: function(canvas) {
        _.forEach(this.children, function(plugin) {
            canvas.add(plugin.editorObj);
        });
        canvas.renderAll();
        this.thumbnail = canvas.toDataURL('png');
    },
    editor: function() {

    },
    modified: function(event, data) {
        EkstepEditor.jQuery('#img-' + EkstepEditorAPI.getCurrentStage().id).attr('src', EkstepEditorAPI.getCanvas().toDataURL('png'));
    },
    objectSelected: function(event, data) {
        if(!_.isUndefined(this.currentObject) && this.currentObject !== data.id) {
            var plugin = EkstepEditorAPI.getPluginInstance(this.currentObject);
            EkstepEditorAPI.getCanvas().trigger("selection:cleared", { target: plugin.editorObj });
        }
        this.currentObject = data.id;
    },
    objectRemoved: function(event, data) {
        this.currentObject = undefined;
    }

});
