describe("uploadContent plugin", function () {
    var manifest, path, $scope, pluginInstance, $timeout;

    beforeAll(function (done) {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.uploadcontent");
        console.log('manifest', manifest);
        path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/uploadapp.js");
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.uploadcontent");

        done();
    });

    it('mock controller', function (done) {
        angular.mock.module('oc.lazyLoad');
        angular.mock.module('Scope.safeApply');
        inject(function ($ocLazyLoad, _$rootScope_, _$controller_, _$timeout_) {
            var $controller = _$controller_;
            $timeout = _$timeout_;
            $scope = _$rootScope_.$new();

            $ocLazyLoad.load([
                { type: 'js', path: path }
            ]).then(function () {
                ctrl = $controller("uploadController", { $scope: $scope, instance: { manifest: manifest } });
                $scope.$safeApply = function () { };
                $scope.closeThisDialog = function () { };
                done();
            }, function (error) {
                done();
            });
            setInterval(function () {
                _$rootScope_.$digest();
            }, 10);
        });
    });

    describe("Upload content", function () {
        it('should initialize the plugin', function () {
            spyOn(pluginInstance, 'initialize').and.callThrough();
            spyOn(ecEditor, 'resolvePluginResource');
            spyOn(ecEditor.getService('popup'), 'loadNgModules');
            pluginInstance.initialize(manifest);
            expect(pluginInstance.initialize).toHaveBeenCalled();
            expect(EventBus.hasEventListener('org.ekstep.uploadcontent:show')).toBe(true);
            var templatePath = expect(ecEditor.resolvePluginResource).toHaveBeenCalledWith('org.ekstep.uploadcontent', '1.4', 'editor/upload.html');
            var controllerPath = expect(ecEditor.resolvePluginResource).toHaveBeenCalledWith('org.ekstep.uploadcontent', '1.4', 'editor/uploadapp.js');
            expect(ecEditor.getService('popup').loadNgModules).toHaveBeenCalledWith(templatePath, controllerPath);
        });
        it('should open the modal on event trigger', () => {
            spyOn(ecEditor.getService('popup'), 'open');
            pluginInstance.showUploadForm();
            expect(ecEditor.getService('popup').open).toHaveBeenCalled();
        });
    });
});