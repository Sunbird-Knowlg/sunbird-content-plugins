'use strict';
describe('Config plugin', function() {
    var configPlugin, shapePlugin;
    var $scope;
    beforeEach(function() {
        jasmine.getJSONFixtures().fixturesPath = 'test';
        EkstepEditor.config = {
            defaultSettings: 'base/plugins/org.ekstep.config-1.0/test/editor/config/editorSettings.json',
            pluginRepo: 'http://localhost:9876/base/plugins',
            //corePlugins: ["testplugin"]
        }
    })

    // Include Modules
    beforeEach(module('editorApp'));

    beforeEach(inject(function($rootScope, _$controller_) {
        $scope = $rootScope.$new();
        _$controller_('MainCtrl', { $scope: $scope });
    }));
    beforeEach(function() {
        EkstepEditor.pluginManager.loadPlugin('org.ekstep.config', "1.0");
        EkstepEditor.eventManager.dispatchEvent('org.ekstep.shape:create', {
            "type": "rect",
            "x": 10,
            "y": 20,
            "fill": "#FFFF00",
            "w": 14,
            "h": 25
        });
    })
    it('should add the plugin to plugin manager', function() {
        expect(EkstepEditor.pluginManager.plugins).toBeDefined();
        expect(Object.keys(EkstepEditor.pluginManager.plugins)).toContain('org.ekstep.shape@1.0');
    });
    it('should call object selected', function() {

        EkstepEditorAPI.dispatchEvent("object:selected", { id: Object.keys(EkstepEditor.pluginManager.pluginInstances)[0] })
    });
    it('should call object unselected', function() {
        EkstepEditorAPI.dispatchEvent("object:unselected")
    });
    it('should call show config method', function() {
        EkstepEditorAPI.dispatchEvent("config:show")
    });
    it('should call stage unselect', function() {
        EkstepEditorAPI.dispatchEvent("stage:unselect")
    });
    it('should show help', function() {
        EkstepEditorAPI.dispatchEvent("config:help")
    });
    it('should show properties', function() {
        EkstepEditorAPI.dispatchEvent("config:properties")
    });
});
