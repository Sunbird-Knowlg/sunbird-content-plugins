EkstepEditor.basePlugin.extend({
    type: "stagedecorator",
    components: ['audio'],
    stageMeta: [],
    initialize: function() {
        EkstepEditorAPI.addEventListener("stagedecorator:addcomponent", this.addComponent, this);
        //EkstepEditorAPI.addEventListener("stagedecorator:removecomponent", this.removeComponent, this);
        EkstepEditorAPI.addEventListener("stage:select", this.refreshComponents, this);
    },
    updateStageMeta: function(data) {
        this.stageMeta.push(data)
    },
    getComponents: function() {
        return this.components;
    },
    addComponent: function(event, data) {
        console.log('addComponent', data);        
        if (!data) return false;
        this.updateStageMeta({id: EkstepEditorAPI.getCurrentStage().id, component:data});
        this.updateStage(data);
    },
    findComponent: function(component) {
        return this.components.find(function(elem) { elem === component });
    },
    updateStage: function(data) {
        var scope = EkstepEditorAPI.getAngularScope();
        var stage = EkstepEditorAPI.getCurrentStage();
        if (stage.isSelected) {
            scope.safeApply(function() {
                scope.attachmentHolder = {}
                scope.attachmentHolder.show = true;
                scope.attachmentHolder[data.component] = {};
                scope.attachmentHolder[data.component].show = true;
                scope.attachmentHolder[data.component].title = data.title;
            });
        }
    },
    refreshComponents: function(event, stage) {
        var instance = this;
        var setData = undefined;
        _.forEach(instance.stageMeta, function(obj) {
            if (obj.id === stage.stageId) setData = obj.component;
        });

        if (!_.isUndefined(setData)) instance.updateStage(setData);
        if (_.isUndefined(setData)) instance.hideComponent();
    },
    hideComponent: function(data) {
        var scope = EkstepEditorAPI.getAngularScope();
        var stage = EkstepEditorAPI.getCurrentStage();
        stage.isSelected && scope.safeApply(function() {
            scope.attachmentHolder = {}
            scope.attachmentHolder.show = false;
        });
    }
});
//# sourceURL=stagedecorator.js
