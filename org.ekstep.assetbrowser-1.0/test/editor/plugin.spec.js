'use strict';

describe('org.ekstep.assetbrowser', function() {
    var $scope,
        pluginTitle = 'org.ekstep.assetbrowser',
        plugin,
        pluginInstance;        

    beforeEach(function() {
        EkstepEditor.config = {
            defaultSettings: 'base/plugins/org.ekstep.assetbrowser-1.0/test/editor/config/editorSettings.json',
            pluginRepo: 'http://localhost:9876/base/plugins',
        }
    });
    beforeEach(module('editorApp'));

    beforeEach(inject(function($rootScope, $controller) {
        $scope = $rootScope.$new();        
        $controller('MainCtrl', { $scope: $scope });
    }));

    it('should initialize preview on show event', function() {
        plugin = EkstepEditorAPI.getPlugin(pluginTitle);
        pluginInstance = new plugin.p(plugin.m);
        spyOn(pluginInstance, 'initPreview');
        pluginInstance.initialize();
        EkstepEditorAPI.dispatchEvent(pluginTitle + ":show", { callback: function() {}, data: null });
        expect(pluginInstance.initPreview).toHaveBeenCalled();
    });

    it('should call showAssetBrowser when initpreview', function() {
        spyOn(pluginInstance, 'showAssetBrowser');
        pluginInstance.initPreview(undefined, { callback: function() {}, data: null });
        expect(pluginInstance.showAssetBrowser).toHaveBeenCalled();
    });

    it('should invoke popup service on showAssetBrowser', function() {
        var data = "<h1>sample template</h1>";
        spyOn(EkstepEditorAPI.getService('popup'), 'open');
        pluginInstance.showAssetBrowser(null, data);
        expect(EkstepEditorAPI.getService('popup').open).toHaveBeenCalled();
    });

    it('should get asset(image/audio) when getAsset', function() {
        var iservice = new EkstepEditor.iService();
        spyOn(iservice.http, 'post');
        pluginInstance.getAsset('tree', 'image', function(err, res) {});
        expect(iservice.http.post).toHaveBeenCalled();
    });

});
