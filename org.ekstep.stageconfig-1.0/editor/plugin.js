EkstepEditor.basePlugin.extend({
    type: "org.ekstep.stageconfig",
    stageConfig: [],
    scope: EkstepEditorAPI.getAngularScope(),
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":addcomponent", this.register, this);
        EkstepEditorAPI.addEventListener("stage:select", this.showComponents, this);
        EkstepEditorAPI.addEventListener(this.manifest.id + ":remove", this.removeAudio, this);
    },
    register: function(event, data) {
        (this.getStageIndex(data) === -1) ? this.stageConfig.push({ stageId: data.stageId, components: [data] }): this.registerToStage(data);
        this.showComponents();
    },
    registerToStage: function(data) {
        EkstepEditorAPI._.forEach(this.stageConfig, function(stage) {
            if (stage.stageId === data.stageId) stage.components.push(data);
        });
    },
    getStageIndex: function(data) {
        return EkstepEditorAPI._.findIndex(this.stageConfig, function(stage) {
            return data.stageId === stage.stageId;
        });
    },
    showComponents: function() {
        var instance = this;
        this.hideAll();
        setTimeout(function(){
            instance.showAll();
        },500)
        //FIXME: Find a proper place to update currentStage
        var instance = this;
        EkstepEditorAPI.ngSafeApply(instance.scope, function() {
            instance.scope.currentStage = EkstepEditorAPI.getCurrentStage();
        });
    },
    hideAll: function() {
        var instance = this;
        EkstepEditorAPI._.forEach(this.stageConfig, function(stage) {
            instance.hideStageComponents(stage);
            EkstepEditorAPI.ngSafeApply(instance.scope);
        });
    },
    showAll: function() {
        var instance = this;
        EkstepEditorAPI._.forEach(this.stageConfig, function(stage, index) {
            if (stage.stageId === EkstepEditorAPI.getCurrentStage().id) {
                instance.showStageComponents(stage);
                EkstepEditorAPI.ngSafeApply(instance.scope);
                return;
            }
        });
    },
    showStageComponents: function(stage) {
        var instance = this;
        var items = []
            assetArr = [],
            htextArr = [];
        var events = EkstepEditorAPI.getCurrentStage().event;
        EkstepEditorAPI._.forEach(events, function(event){
            if(event.type === 'enter'){
                if(EkstepEditorAPI._.isArray(event.action)){
                    assetArr.push(event.action[0].asset); 
                }else{
                    assetArr.push(event.action.asset);
                }
            }
        });
        var mediaArr = EkstepEditorAPI.getAllPluginInstanceByTypes();
        EkstepEditorAPI._.forEach(mediaArr, function(val, key) {
            if(val.manifest.shortId === 'htext'){
                htextArr[key] = val.attributes.audio;
            }
        });
        EkstepEditorAPI._.forEach(stage.components, function(component) {
            if(EkstepEditorAPI._.indexOf(assetArr, component.id) != -1){
                component.autoplay = true;
            }else{
                component.autoplay = false;
            }
            if(EkstepEditorAPI._.indexOf(htextArr, component.id) != -1){
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
        EkstepEditorAPI._.forEach(stage.components, function(component, index) {
            instance.scope.stageAttachments[component.type] = {};
            instance.scope.stageAttachments[component.type].items = [];
            instance.scope.stageAttachments[component.type].show = false;
        });
    },
    removeAudio: function(event, data){
        var instance = this;
        EkstepEditorAPI._.forEach(instance.stageConfig, function(stage, key) {
            if(stage.stageId === EkstepEditorAPI.getCurrentStage().id){
                var components = EkstepEditorAPI._.clone(stage.components);
                EkstepEditorAPI._.forEach(components, function(com, key){
                    if(data.asset === com.id){
                        stage.components.splice(key, 1);
                        EkstepEditorAPI._.remove(instance.scope.stageAttachments['audio'].items, function(item) {
                           return data.asset === item.id;
                        });
                        return false;
                    }
                });
            }
        });
    }
});
//# sourceURL=stageconfig.js
