'use strict';

EkstepEditor.basePlugin.extend({
	type: 'telemetry',
	initialize: function() {
		var instance = this;
		this.registerEvents(this.pluginLifeCycleEvent.mappedEvents, this.pluginLifeCycleEvent);
		this.registerEvents(this.interactEvent.mappedEvents, this.interactEvent);
		this.registerEvents(this.errorEvent.mappedEvents, this.errorEvent);			
	},
	pluginLifeCycleEvent: {
		mappedEvents: ['ce:plugin:lifecycle'],
		listen: function(event, data) {
			EkstepEditorAPI.getService('telemetry').pluginLifeCycle(data);
		}
	},
	interactEvent: {
		mappedEvents: ['ce:plugin:interact'],
		listen: function(event, data) {
			EkstepEditorAPI.getService('telemetry').interact(data);
		}
	},
	endEvent: {
		mappedEvents: [],
		listen: function() {
			EkstepEditorAPI.getService('telemetry').end();
		}
	},
	errorEvent: {
		mappedEvents: ['ce:error'],
		listen: function(event, data) {
			EkstepEditorAPI.getService('telemetry').error(data);
		}
	},
	registerEvents: function(eventArray, scope) {
		var instance = this;
		_.forEach(eventArray, function(event){
			instance.addEventListener(event, scope);
		});
	},
	addEventListener: function (event, scope) {
		EkstepEditorAPI.addEventListener(event, scope.listen, scope);
	}
});
//# sourceURL=telemetryPlugin.js