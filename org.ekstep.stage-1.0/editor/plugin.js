/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
EkstepEditor.basePlugin.extend({
    type: "stage",
    thumbnail: undefined,
    onclick: undefined,
    currentObject: undefined,
    canvas: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener("stage:create", this.createStage, this);
        EkstepEditorAPI.addEventListener("object:modified", this.modified, this);
        EkstepEditorAPI.addEventListener("stage:modified", this.modified, this);
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:removed", this.objectRemoved, this);
    },
    createStage: function(event, data) {
        EkstepEditorAPI.instantiatePlugin(this.manifest.id, data);
    },
    newInstance: function() {
        this.onclick = { id: 'stage:select', data: { stageId: this.id } };
        this.ondelete = { id: 'stage:delete', data: { stageId: this.id } };
        this.duplicate = { id: 'stage:duplicate', data: { stageId: this.id } };
        EkstepEditorAPI.addStage(this);        
        this.attributes = {
            x: 0,
            y: 0,
            w: 720,
            h: 405,
            id: this.id
        };
        this.addConfig('instructions', this.getParam('instructions') || '');
    },
    getOnClick: function() {
        return { id: 'stage:select', data: { stageId: this.id, prevStageId: EkstepEditorAPI.getCurrentStage().id } };
    },
    setCanvas: function(canvas) {
        this.canvas = canvas;
    },
    addChild: function(plugin) {
        this.children.push(plugin);
        if(plugin.editorObj) {
            this.canvas.add(plugin.editorObj);
            this.canvas.setActiveObject(plugin.editorObj);
            this.setThumbnail();
            EkstepEditorAPI.dispatchEvent('stage:modified', { id: plugin.id });
        }
        this.enableSave();        
    },
    setThumbnail: function() {
        /*
        var thumbnailCanvas = document.getElementById("thumbnailCanvas");
        var ctx = thumbnailCanvas.getContext("2d");
        ctx.drawImage(this.canvas.getElement(), 0, 0, 160, 90);
        this.thumbnail = thumbnailCanvas.toDataURL({format: 'jpeg', quality: 0.8});
        */
        this.thumbnail = this.canvas.toDataURL({format: 'jpeg', quality: 0.1});
        
    },
    updateZIndex: function() {
        var instance = this;
        EkstepEditorAPI._.forEach(this.children, function(child) {
            if(child.editorObj) {
                child.attributes['z-index'] = instance.canvas.getObjects().indexOf(child.editorObj);
            } else {
                child.attributes['z-index'] = instance.canvas.getObjects().length;
            }
        });
    },
    render: function(canvas) {
        EkstepEditor.stageManager.clearCanvas(canvas);
        this.children = EkstepEditorAPI._.sortBy(this.children, [function(o) { return o.getAttribute('z-index'); }]);
        EkstepEditorAPI._.forEach(this.children, function(plugin) {
            plugin.render(canvas);
        });
        canvas.renderAll();
        EkstepEditorAPI.dispatchEvent('stage:render:complete', { stageId: this.id });
        this.thumbnail = canvas.toDataURL({format: 'jpeg', quality: 0.1});
        EkstepEditorAPI.refreshStages();
    },
    modified: function(event, data) {
        EkstepEditorAPI.getCurrentStage().updateZIndex(); 
        EkstepEditorAPI.getCurrentStage().setThumbnail();
        EkstepEditorAPI.refreshStages();
        this.enableSave();        
    },
    objectSelected: function(event, data) {
        if(!EkstepEditorAPI._.isUndefined(this.currentObject) && this.currentObject !== data.id) {
            var plugin = EkstepEditorAPI.getPluginInstance(this.currentObject);
            EkstepEditorAPI.getCanvas().trigger("selection:cleared", { target: plugin.editorObj });
        }
        this.currentObject = data.id;
    },
    objectRemoved: function(event, data) {
        this.currentObject = undefined;
    },
    destroyOnLoad: function(childCount, canvas, cb) {
        var instance = this;
        if(childCount == instance.children.length) {
            canvas.clear();
            instance.render(canvas);
            $('#' + instance.id).remove();
            cb();
        } else {
            setTimeout(function() {
                instance.destroyOnLoad(childCount, canvas, cb);
            }, 1000);
        }
    },
    enableSave: function() {
        EkstepEditorAPI.getAngularScope().enableSave();        
    },
    getConfigManifest: function() {
        return this.manifest.editor.configManifest;
    },
    getConfig: function() {
        var config = this._super();
        config.genieControls = EkstepEditorAPI.getAngularScope().showGenieControls;
        return config;
    },
    onConfigChange: function(key, value) {
        switch (key) {
            case "instructions":
                this.addParam('instructions', value);
                break;
            case "genieControls":
                if(value !== EkstepEditorAPI.getAngularScope().showGenieControls) {
                    var angScope = EkstepEditorAPI.getAngularScope();
                    EkstepEditorAPI.ngSafeApply(angScope, function() {
                        angScope.toggleGenieControl();
                    });
                }
                break;
        }
    }
});
//# sourceURL=stageplugin.js