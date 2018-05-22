describe("Topic selector plugin", function() {
    var manifest, path, ctrl, $scope, pluginInstance;
    beforeAll(function(done) {
        CollectionEditorTestFramework.init(function() {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.topicselector");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.topicselector");
            done();
        });
    });
    xit('Topic selector plugin should be initialized', function(){
    });
});