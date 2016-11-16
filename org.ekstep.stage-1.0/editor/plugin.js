/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.basePlugin.extend({
    type: "stage",
    thumbnail: undefined,
    onclick: undefined,
    currentObject: undefined,
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
            id: this.id
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
        _.forEach(_.sortBy(this.children, [function(o) { return o.getAttribute('z-index'); }]), function(plugin) {
            plugin.render(canvas);
        });
        canvas.renderAll();
        this.thumbnail = canvas.toDataURL('png');
        EkstepEditorAPI.refreshStages();
    },
    modified: function(event, data) {
        _.forEach(EkstepEditorAPI.getCurrentStage().children, function(child) {
            if(child.editorObj) {
                child.attributes['z-index'] = EkstepEditorAPI.getCanvas().getObjects().indexOf(child.editorObj);
            } else {
                child.attributes['z-index'] = EkstepEditorAPI.getCanvas().getObjects().length;
            }
        });
        EkstepEditorAPI.getCurrentStage().thumbnail = EkstepEditorAPI.getCanvas().toDataURL('png');
        EkstepEditorAPI.refreshStages();
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
