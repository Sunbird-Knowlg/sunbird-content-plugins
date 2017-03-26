var testContext = {
	uid: 'unittest',
	sid: 'testsession',
	contentId: 'do_1234'
}

var testConfig = {
	dispatcher: 'console',
	pluginRepo: 'http://localhost:9876/base',
	corePluginsPackaged: false,
	plugins: {
		'org.ekstep.stage': '1.0',
		'org.ekstep.config': '1.0'
	}
}

var $scope = {
	$safeApply: function() {},
	$watch: function() {}
}

var $document = {
	on: function() {}
}

ContentTestFramework = {
	init: function(cb, plugins) {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		console.log('####### Initializing Content Editor Framework #######');
		if(plugins) testConfig.plugins = plugins;
		EkstepEditor.init(testContext, testConfig, $scope, $document, function() {
			console.log('####### Content Editor Framework Initialized #######');
			cb();
		});
	},
	getFabricObject: function(objectId, canvas) {
		return EkstepEditorAPI._.find(canvas.getObjects(), {id: objectId});
	},
	objectsEqual: function(editorObj, fabricObj) {
		expect(editorObj).toBe(fabricObj);
	},
	validateObject: function(object, map) {
		EkstepEditorAPI._.forIn(map, function(value, key) {
			expect(EkstepEditorAPI._.get(object, key)).toBe(value);
		});
	},
	resize: function(objectId, scaleX, scaleY) {
		var object = EkstepEditorAPI._.find(EkstepEditorAPI.getCanvas().getObjects(), {id: objectId});
		object.set({scaleX: scaleX, scaleY: scaleY});
		EkstepEditorAPI.getCanvas().fire('object:modified', {target: object});
		object.fire('modified', {});
	},
	moveTo: function(objectId, x, y) {
		var object = EkstepEditorAPI._.find(EkstepEditorAPI.getCanvas().getObjects(), {id: objectId});
		object.set({left: x, top: y});
		EkstepEditorAPI.getCanvas().fire('object:modified', {target: object});
		object.fire('modified', {});
	},
	rotate: function(objectId, angle) {
		var object = EkstepEditorAPI._.find(EkstepEditorAPI.getCanvas().getObjects(), {id: objectId});
		object.set({angle: angle});
		EkstepEditorAPI.getCanvas().fire('object:modified', {target: object});
		object.fire('modified', {});
	},
	resizing: function(objectId, scaleX, scaleY) {
		var object = EkstepEditorAPI._.find(EkstepEditorAPI.getCanvas().getObjects(), {id: objectId});
		EkstepEditorAPI.getCanvas().fire('object:scaling', {target: object});
		object.fire('resizing', {});
	},
	moving: function(objectId, x, y) {

	},
	rotating: function(objectId, angle) {

	},
	select: function(objectId) {
		var object = EkstepEditorAPI._.find(EkstepEditorAPI.getCanvas().getObjects(), {id: objectId});
		EkstepEditorAPI.getCanvas().setActiveObject(object);
		EkstepEditorAPI.getCanvas().trigger('object:selected', {target: object});
		object.fire('selected', {});
	},
	unselect: function(objectId) {
		var object = EkstepEditorAPI._.find(EkstepEditorAPI.getCanvas().getObjects(), {id: objectId});
		EkstepEditorAPI.getCanvas().setActiveObject(null);
		EkstepEditorAPI.getCanvas().fire('selection:cleared', {target: object});
		object.fire('deselected', {});
	}
}
