
describe('upload file plugin', function () {
var manifest;
var pluginInstance;

    beforeAll(function () {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.uploadfile");
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.uploadfile");
        callback = {};
    });

    it("plugin should register its events", function() {
        expect(EventBus.hasEventListener('org.ekstep.uploadfile:show')).toBe(true);
    });
});