EkstepEditor.basePlugin.extend({
    type: "org.ekstep.stageconfig",
    stageConfig: [],
    scope: EkstepEditorAPI.getAngularScope(),
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":addcomponent", this.register, this);
        EkstepEditorAPI.addEventListener("stage:afterselect", this.showComponents, this);
        EkstepEditorAPI.addEventListener(this.manifest.id + ":remove", this.removeAudio, this);
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
        //FIXME: Find a proper place to update currentStage
        var instance = this;
        instance.scope.safeApply(function() {
            instance.scope.currentStage = EkstepEditorAPI.getCurrentStage();
        });

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
        var items = []
            assetArr = [],
            htextArr = [];
        var evants = EkstepEditorAPI.getCurrentStage().event;
        _.forEach(evants, function(event){
            if(event.type === 'enter'){
                assetArr.push(event.action[0].asset); 
            }
        });
        var mediaArr = EkstepEditorAPI.getAllPluginInstanceByTypes();
        _.forEach(mediaArr, function(val, key) {
            if(val.manifest.shortId === 'htext'){
                htextArr[key] = val.attributes.audio;
            }
        });
        _.forEach(stage.components, function(component) {
            if(_.indexOf(assetArr, component.title) != -1){
                component.autoplay = true;
            }else{
                component.autoplay = false;
            }
            if(_.indexOf(htextArr, component.title) != -1){
                component.showClose = true;
            }else{
                component.showClose = false;
            }
            items.push(component);
            instance.scope.stageAttachments[component.type] = {};            
            instance.scope.stageAttachments[component.type].items = items;
            instance.scope.stageAttachments[component.type].show = true;            
        });
    },
    hideStageComponents: function(stage) {
        var instance = this;
        _.forEach(stage.components, function(component, index) {
            instance.scope.stageAttachments[component.type] = {};
            instance.scope.stageAttachments[component.type].items = [];
            instance.scope.stageAttachments[component.type].show = false;
        });
    },
    removeAudio: function(event, data){
        _.remove(this.scope.stageAttachments['audio'].items, function(item) {
           return data.asset === item.title;
        });
    }
});
//# sourceURL=stageconfig.js
