describe("Collaborator plugin", function () {
    var manifest, path, ctrl, $scope, pluginInstance, returnData;

    beforeAll(function (done) {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.collaborator");
        console.log('manifest', manifest);
        path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/collaboratorApp.js");
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.collaborator");

        var domElement = '<div id="noLessonMsg"></div>';
        var body = document.getElementsByTagName("body")[0];
        var div = document.createElement('div');

        div.innerHTML = domElement;
        body.appendChild(div.children[0]);
        done();
    });

    it('mock popup service', function(done) {
        angular.mock.module('oc.lazyLoad');
        angular.mock.module('Scope.safeApply');
        inject(function($ocLazyLoad, _$rootScope_, _$controller_) {
            var $controller = _$controller_;
            $scope = _$rootScope_.$new();

            $ocLazyLoad.load([
                { type: 'js', path: path }
            ]).then(function() {
                ctrl = $controller("collaboratorCtrl", { $scope: $scope, instance: { manifest: manifest } });
                done();
            }, function(error) {
                done();
            });
            setInterval(function() {
                _$rootScope_.$digest();
            }, 10);
        });
    });



    describe("Add Collaborator", function () {
        it('Init collaborator', function () {
            spyOn(pluginInstance, 'initialize').and.callThrough();
            pluginInstance.initialize(manifest);
            expect(pluginInstance.initialize).toHaveBeenCalled();
        });

        it("should register required events", function () {
            expect(EventBus.hasEventListener('org.ekstep.collaborator:add')).toBe(true);
        });

        it("should open dialog on loadBrowser", function () {
            spyOn(ecEditor.getService('popup'), 'open');
            pluginInstance.loadBrowser();
            expect(ecEditor.getService('popup').open).toHaveBeenCalled();
        });

        it('should call content service with current content ID', function () {
            spyOn(ecEditor.getService(ServiceConstants.CONTENT_SERVICE), 'getContent').and.returnValue({});
            $scope.getContentCollaborators();
            expect(ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContent).toHaveBeenCalled();
        });
    });
});