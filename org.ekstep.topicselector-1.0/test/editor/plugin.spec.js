describe("Topic selector plugin", function() {
    var manifest, path, ctrl, $scope, pluginInstance;
    beforeAll(function(done) {
        CollectionEditorTestFramework.init(function() {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.topicselector");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.topicselector");
            done();
        });
    });
    it('Topic selector plugin should be initialized', function(){
        spyOn(pluginInstance, 'initData').and.callThrough();
        pluginInstance.initData();
        expect(pluginInstance.initData).toHaveBeenCalled();
    });
});