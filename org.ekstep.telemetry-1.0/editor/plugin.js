'use strict';

EkstepEditor.basePlugin.extend({
    type: 'org.ekstep.telemetry',
    service: undefined,
    initialize: function() {
        this.service = EkstepEditorAPI.getService('telemetry');
        EkstepEditorAPI.addEventListener('content:onload', this.registerEvents, this);
    },
    registerEvents: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener('object:selected', function(event, data) {
            if(data && data.id && data.id != '') {
                instance.interactEvent('select', '', 'plugin', data.type, data.ver, data.id);
            }
        }, this);
        EkstepEditorAPI.addEventListener('object:modified', function(event, data) {
            if(data && data.id && data.id != '') {
                console.log('event', event);
                instance.interactEvent('modify', '', 'plugin', data.type, data.ver, data.id);
            }
        }, this);
        EkstepEditorAPI.addEventListener('object:unselected', function(event, data) {
            if(data && data.id && data.id != '') {
                instance.interactEvent('unselect', '', 'plugin', data.type, data.ver, data.id);
            }
        }, this);
        
        EkstepEditorAPI.addEventListener('object:removed', function(event, data) {
            if(data && data.id && data.id != '') {
                var plugin = EkstepEditorAPI.getPluginInstance(data.id);
                this.service.pluginLifeCycle({type: 'remove', pluginid: plugin.manifest.id, pluginver: plugin.manifest.ver, objectid: plugin.id, assetid: plugin.getAttribute('asset'), stage: EkstepEditorAPI.getCurrentStage().id, containerid: "", containerplugin: ""});
            }
        }, this);

        EkstepEditorAPI.addEventListener('stage:removed', function(event, data) {
            console.log('stage delete', data);
            if(data && data.stageId && data.stageId != '') {
                var plugin = EkstepEditorAPI.getPluginInstance(data.stageId);
                this.service.pluginLifeCycle({type: 'remove', pluginid: plugin.manifest.id, pluginver: plugin.manifest.ver, objectid: plugin.id, assetid: plugin.getAttribute('asset'), stage: plugin.id, containerid: "", containerplugin: ""});
            }
        }, this);
        EkstepEditorAPI.addEventListener('stage:delete', function(event, data) {
            if(data && data.stageId && data.stageId != '') {
                instance.interactEvent('click', 'delete', 'plugin', 'org.ekstep.stage', '1.0', data.stageId);
            }
        }, this);
        EkstepEditorAPI.addEventListener('stage:duplicate', function(event, data) {
            if(data && data.stageId && data.stageId != '') {
                instance.interactEvent('duplicate', '', 'plugin', 'org.ekstep.stage', '1.0', data.stageId);
            }
        }, this);
        EkstepEditorAPI.addEventListener('stage:select', function(event, data) {
            if(data && data.stageId && data.stageId != '') {
                instance.interactEvent('select', '', 'plugin', 'org.ekstep.stage', '1.0', data.stageId);
            }
        }, this);
        EkstepEditorAPI.addEventListener('stage:reorder', function(event, data) {
            if(data && data.stageId && data.stageId != '') {
                instance.interactEvent('modify', 'reorder', 'stage', 'org.ekstep.stage', '1.0', data.stageId);
            }
        }, this);
    },
    interactEvent: function(type, subtype, target, pluginid, pluginver, objectId) {
        this.service.interact({ "type": type, "subtype": subtype, "target": target, "pluginid": pluginid, "pluginver": pluginver, "objectid": objectId, "stage": EkstepEditorAPI.getCurrentStage().id })
    }
});
//# sourceURL=telemetryPlugin.js
