describe("lesson browser plugin", function() {
    var manifest, path, ctrl, $scope, pluginInstance;
    beforeAll(function(done) {
        CollectionEditorTestFramework.init(function() {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.lessonbrowser");
            path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/lessonBrowserApp.js");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.lessonbrowser");
            done();
        });
    });

    it('mock controller', function(done) {
        angular.mock.module('oc.lazyLoad');
        angular.mock.module('Scope.safeApply');
        inject(function($ocLazyLoad, _$rootScope_, _$controller_) {
            var $controller = _$controller_;
            $scope = _$rootScope_.$new();

            $ocLazyLoad.load([
                { type: 'js', path: path }
            ]).then(function() {
                ctrl = $controller("mainController", { $scope: $scope, instance: { manifest: manifest } });
                done();
            }, function(error) {
                done();
            });
            setInterval(function() {
                _$rootScope_.$digest();
            }, 10);
        });
    });
    
    describe("When plugin is initialized", function() {
    	it("It should initialized Lesson browser plugin", function() {
            spyOn(pluginInstance, 'initialize').and.callThrough();
            pluginInstance.initialize(manifest);
            console.log("manifest", manifest);
            console.log("pluginInstance", pluginInstance);
            expect(pluginInstance.initialize).toHaveBeenCalled();
            expect(pluginInstance._templatePath).not.toBeUndefined();
            expect(pluginInstance.controllerPath).not.toBeUndefined();
        });
    });
});