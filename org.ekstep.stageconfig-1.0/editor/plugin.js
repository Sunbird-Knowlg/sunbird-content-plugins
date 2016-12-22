EkstepEditor.basePlugin.extend({
    type: "org.ekstep.stageconfig",
    stageConfig: [],
    scope: EkstepEditorAPI.getAngularScope(),
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":addcomponent", this.register, this);
        EkstepEditorAPI.addEventListener("stage:afterselect", this.showComponents, this);
    },
    register: function(event, data) {
        (this.getStageIndex(data) === -1) ? this.stageConfig.push({ stageId: data.stageId, components: [data] }): this.registerToStage(data);
        this.showComponents();
    },
    registerToStage: function(data) {
        _.forEach(this.stageConfig, function(stage) {
            if (stage.stageId === data.stageId) stage.components.push(data);
        });
    },
    getStageIndex: function(data) {
        return _.findIndex(this.stageConfig, function(stage) {
            return data.stageId === stage.stageId;
        });
    },
    showComponents: function() {
        this.hideAll();
        this.showAll();
    },
    hideAll: function() {
        var instance = this;
        _.forEach(this.stageConfig, function(stage) {
            instance.hideStageComponents(stage);
            instance.scope.safeApply();
        });
    },
    showAll: function() {
        var instance = this;
        _.forEach(this.stageConfig, function(stage, index) {
            if (stage.stageId === EkstepEditorAPI.getCurrentStage().id) {
                instance.showStageComponents(stage);
                instance.scope.safeApply();
                return;
            }
        });
    },
    showStageComponents: function(stage) {
        var instance = this;
        _.forEach(stage.components, function(component) {
            instance.scope.stageAttachments[component.type] = {};
            instance.scope.stageAttachments[component.type].show = true;
            if (component.title) instance.scope.stageAttachments[component.type].title = component.title;
        });
    },
    hideStageComponents: function(stage) {
        var instance = this;
        _.forEach(stage.components, function(component, index) {
            instance.scope.stageAttachments[component.type] = {};
            instance.scope.stageAttachments[component.type].show = false;
        });
    }
});
//# sourceURL=stageconfig.js
