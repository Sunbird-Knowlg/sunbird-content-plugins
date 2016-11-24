'use strict';
describe('Config plugin', function() {
    var configPlugin;
    var $scope;
    beforeEach(function() {
        jasmine.getJSONFixtures().fixturesPath = 'test';
        EkstepEditor.config = {
            defaultSettings: 'base/plugins/org.ekstep.config-1.0/test/editor/config/editorSettings.json',
            pluginRepo: 'http://localhost:9876/base/plugins',
        }
    })
    beforeAll(function() {
        $('<div><canvas id="canvas" width="720px" height="405px"></canvas><div id="toolbarHiddenButton"></div><div id="plugin-toolbar-container"></div><div id="pluginHelp"></div></div><i id="color"></i><div id="plugin-toolbar-container"></div>').appendTo('body');
    });
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
    });

    it('should add the plugin to plugin manager', function(done) {
        expect(EkstepEditor.pluginManager.plugins).toBeDefined();
        expect(Object.keys(EkstepEditor.pluginManager.plugins)).toContain('org.ekstep.shape@1.0');
        setTimeout(function() {
            done();
            expect($('.tool-container')).toBeInDOM();
        }, 1001);
        expect($scope.contextToolbar.length).toEqual(jasmine.any(Number));
    });
    it('should call object selected', function() {
        EkstepEditorAPI.dispatchEvent("object:selected", { id: EkstepEditorAPI.getCurrentObject().id })
        expect($('.tool-container').css('opacity')).toEqual('1');
    });
    it('should call object unselected', function() {
        EkstepEditorAPI.dispatchEvent("object:unselected", { id: EkstepEditorAPI.getCurrentObject().id })
        expect($("#plugin-toolbar-container").css('display')).toEqual('none');
    });
    it('should call show config method', function(done) {
        spyOn(EkstepEditorAPI.getCurrentObject(), 'onConfigChange')
        EkstepEditorAPI.dispatchEvent("config:show");
        setTimeout(function() {
            done();
        }, 501)
        expect($scope.configData).toBeDefined();
        expect($scope.pluginConfig.length).toEqual(jasmine.any(Number));
        $scope.configData.color = "#000000";
        $scope.safeApply();
        expect(EkstepEditorAPI.getCurrentObject().onConfigChange).toHaveBeenCalledWith('color', '#000000');
    });
    it('should call stage unselect', function() {
        EkstepEditorAPI.dispatchEvent("stage:unselect")
    });
    it('should show help', function() {
        EkstepEditorAPI.dispatchEvent("config:help");
        expect($scope.showPluginConfig).toBeFalsy();
        expect($scope.showPluginHelp).toBeTruthy()
        expect($scope.showPluginProperty).toBeFalsy();
        expect($('#pluginHelp').html()).toBeDefined();
    });
    it('should show properties', function() {
        EkstepEditorAPI.dispatchEvent("config:properties");
        expect($scope.showPluginConfig).toBeFalsy();
        expect($scope.showPluginHelp).toBeFalsy();
        expect($scope.showPluginProperty).toBeTruthy();
        expect($scope.pluginProperties).toBeDefined();
    });
});
