'use strict';
/*
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
        $('<div><canvas id="canvas" width="720px" height="405px"></canvas><div id="toolbarOptions" class="hide toolbarOptions"></div><div id="plugin-toolbar-container"><div class="ui shape" id="pluginToolbarShape"><div class="sides"><div class="side active pluginConfig" id="pluginConfig"></div><div class="side pluginProperties" id="pluginProperties"></div><div class="side pluginHelpContent" id="pluginHelpContent"></div></div></div></div><div id="pluginHelp"></div></div><i id="color"></i><div class="ui dropdown"><div>').appendTo('body');
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
        expect(Object.keys(EkstepEditor.pluginManager.plugins)).toContain('org.ekstep.shape');
        setTimeout(function() {
            done();
            expect(EkstepEditor.jQuery("#toolbarOptions")).toBeInDOM();
        }, 1001);
        expect($scope.contextToolbar.length).toEqual(jasmine.any(Number));
    });
    it('should call object selected', function() {
        EkstepEditorAPI.dispatchEvent("object:selected", { id: EkstepEditorAPI.getCurrentObject().id })
        expect(EkstepEditor.jQuery("#toolbarOptions").css("display")).toEqual("block");
    });
    it('should call object unselected', function() {
        EkstepEditorAPI.dispatchEvent("object:unselected", { id: EkstepEditorAPI.getCurrentObject().id })
        expect(EkstepEditor.jQuery("#plugin-toolbar-container").css('display')).toEqual('none');
        expect(EkstepEditor.jQuery("#toolbarOptions").css("display")).toEqual("none");
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
    it('should call show config method with undefined manifest config', function(done) {
        spyOn(EkstepEditorAPI.getCurrentObject(), 'getPluginConfig').and.returnValue(undefined);
        spyOn(EkstepEditorAPI.getCurrentObject(),'renderConfig')
        EkstepEditorAPI.dispatchEvent("config:show");
        setTimeout(function() {
            expect($scope.pluginConfig.length).toEqual(0);
            expect(EkstepEditorAPI.getCurrentObject().renderConfig).toHaveBeenCalled();
            done();
        }, 501)
    });
    it('should call stage unselect', function() {
        EkstepEditorAPI.dispatchEvent("stage:unselect")
    });
    it('should show help', function(done) {
        spyOn(EkstepEditorAPI,'dispatchEvent').and.callThrough();
        EkstepEditorAPI.dispatchEvent("config:help");
        setTimeout(function() {
            expect($('#pluginHelp').html()).toBeDefined();
            done();    
        },5000);
        
    });
    it('should show properties', function() {
        EkstepEditorAPI.dispatchEvent("config:properties");
        expect($scope.pluginProperties).toBeDefined();
    });
    it('should remove config toolbar and container', function() {
        EkstepEditorAPI.dispatchEvent("object:modified",{id:"text"});
        expect(EkstepEditor.jQuery('#toolbarOptions').css("display")).toEqual("none");
        expect(EkstepEditor.jQuery('#plugin-toolbar-container').css("display")).toEqual("none");
    });
});
*/
