'use strict';
describe('Asset Brouser plugin', function () {
    var instance, controller, scope;

    beforeAll(function () {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.assetbrowser");
        path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/assetbrowserapp.js");
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.assetbrowser");
    });

    it('Should invoke initialize method and register event', function () {
        
    });

    it('Should invoke initPreview method to show the popup', function () {
        
    });

    it('Should ge tAsset from Learning platfrom', function () {
        
    });

    it('Should invoke fileValidation for File size and mime type validation', function () {
        
    });

  
});