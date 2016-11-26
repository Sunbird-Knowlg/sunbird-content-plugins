'use strict';
describe('Hollow Circle plugin', function() {
    var configPlugin;
    var $scope;
    beforeEach(function() {
        jasmine.getJSONFixtures().fixturesPath = 'test';
        EkstepEditor.config = {
            defaultSettings: 'base/plugins/org.ekstep.hollowcircle-1.0/test/editor/config/editorSettings.json',
            pluginRepo: 'http://localhost:9876/base/plugins',
        }
    })
    beforeAll(function() {
        $('<div><canvas id="canvas" width="720px" height="405px"></canvas><div id="toolbarHiddenButton"></div><div id="plugin-toolbar-container"><ul></ul></div><div id="pluginHelp"></div></div><div id="plugin-toolbar-container"></div>').appendTo('body');
    });
    beforeEach(module('editorApp'));

    beforeEach(inject(function($rootScope, _$controller_) {
        $scope = $rootScope.$new();
        _$controller_('MainCtrl', { $scope: $scope });
    }));
    beforeEach(function() {
        EkstepEditor.eventManager.dispatchEvent('org.ekstep.hollowcircle:create', {
            "type": "ellipse",
            "radius": 90,
            "x": 10,
            "y": 10,
            "w": 10,
            "h": 10,
            "fill": "",
            "stroke": "rgba(0,192,255,0.5)"
        });
    });
    it('should initiate plugin', function() {
        expect(EkstepEditorAPI.getCurrentObject().type).toEqual("org.ekstep.hollowcircle");
        expect(EkstepEditorAPI.getCurrentObject().editorObj).toBeDefined();
        expect(EkstepEditorAPI.getCurrentObject().editorObj.radius).toEqual(90)
    });
    it('should call the config rendered method', function() {
        spyOn(EkstepEditorAPI.getCurrentObject(), "renderConfig").and.callThrough();
        EkstepEditorAPI.getCurrentObject().renderConfig();
        expect(EkstepEditorAPI.getCurrentObject().renderConfig).toHaveBeenCalled();
        expect($('#hollowcircleconfigColor')).toBeInDOM();
        expect($('#hollowcircleconfigRadius')).toBeInDOM();
        expect($('#hollowcircleconfigStrokeWidth')).toBeInDOM();
    });
    it('should call the onConfigChange method with color change', function() {
        spyOn(EkstepEditorAPI.getCurrentObject().__proto__, 'onConfigChange').and.callThrough();
        var colorBefore = EkstepEditorAPI.getCurrentObject().editorObj.getStroke();
        $('.hc-color-picker').spectrum("container").find(".sp-thumb-el:nth-child(1) .sp-thumb-inner").click();
        $('.sp-choose').click();
        var colorAfter = EkstepEditorAPI.getCurrentObject().editorObj.getStroke();
        expect(EkstepEditorAPI.getCurrentObject().__proto__.onConfigChange).toHaveBeenCalled();
        expect(colorBefore).not.toEqual(colorAfter);
        expect(EkstepEditorAPI.getCurrentObject().attributes.stroke).toEqual(colorAfter);
    });
    it('should call the onConfigChange method with radius change', function() {
        spyOn(EkstepEditorAPI.getCurrentObject().__proto__, 'onConfigChange').and.callThrough();
        var radiusBefore = EkstepEditorAPI.getCurrentObject().editorObj.radius;
        EkstepEditorAPI.getCurrentObject().renderConfig();
        $('#hsRadius').val(100).change();
        var radiusAfter = EkstepEditorAPI.getCurrentObject().editorObj.radius;
        expect(EkstepEditorAPI.getCurrentObject().__proto__.onConfigChange).toHaveBeenCalled();
        expect(radiusBefore).not.toEqual(radiusAfter);
        expect(EkstepEditorAPI.getCurrentObject().attributes.radius).toEqual(radiusAfter);
    });
    it('should call the onConfigChange method with strokewidth change', function() {
        EkstepEditorAPI.getCurrentObject().renderConfig();
        $('#hsStrokeWidth').val(50).change();
    });
});
