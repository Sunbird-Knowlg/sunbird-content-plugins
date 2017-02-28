'use strict';

EkstepEditor.basePlugin.extend({
    type: 'org.ekstep.telemetry',
    objectInteractEventList: [
        'object:selected',
        'object:modified',
        'object:unselected',
        'object:added',
        'object:removed',
        'object:moving',
        'object:scaling'
    ],
    stageInteractEventList: [
        'stage:delete',
        'stage:duplicate',
        'stage:select',
        'stage:reorder'
    ],
    initialize: function() {
        var instance = this;
        this.addEventListener('content:onload', function() {
            instance.registerEvents(instance.objectInteractEventList, instance.objectInteractEvent);
            instance.registerEvents(instance.stageInteractEventList, instance.stageInteractEvent);
        });
    },
    registerEvents: function(eventArray, scope) {
        var instance = this;
        _.forEach(eventArray, function(event) {
            instance.addEventListener(event, scope);
        });
    },
    addEventListener: function(event, callback) {
        EkstepEditorAPI.addEventListener(event, callback, this);
    },
    objectInteractEvent: function(event, data) {
        if (data) EkstepEditorAPI.getService('telemetry').interact({ "type": "canvasInteract", "subtype": event.type, "target": "canvas", "targetid": data.type, "objectid": data.id, "stage": EkstepEditorAPI.getCurrentStage().id });
    },
    stageInteractEvent: function(event, data) {
        if (data) EkstepEditorAPI.getService('telemetry').interact({ "type": "stageInteract", "subtype": event.type, "target": "stage", "targetid": data.stageId, "objectid": data.stageId, "stage": EkstepEditorAPI.getCurrentStage().id });
    }
});
//# sourceURL=telemetryPlugin.js
