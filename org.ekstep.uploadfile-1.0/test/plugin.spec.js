describe("Upload file Plugin:", function () {
    var manifest, ctrl, $scope, pluginInstance;
    var instance = { manifest: { id: "org.ekstep.uploadfile", ver: "1.0" }, "data": "" };

    beforeAll(function (done) {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.uploadfile");
        path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/uploadapp.js");
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.uploadtoc");
        var templatePath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/upload.html");
        var controllerPath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/uploadapp.js");
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
        ecEditor.getCurrentStage = jasmine.createSpy().and.callFake(function () {
            return { id: '5437859-543758937' }
        });
        ecEditor.getContext = jasmine.createSpy().and.callFake(function () {
            return "do_1125330285602488321282";
        });

        done();
    });

    it('mock popup service', function (done) {
        angular.mock.module('oc.lazyLoad');
        angular.mock.module('Scope.safeApply');
        inject(function ($ocLazyLoad, _$rootScope_, _$controller_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $ocLazyLoad.load([{
                type: 'js',
                path: path
            }]).then(function () {
                ctrl = $controller("uploadController", {
                    $scope: $scope,
                    instance: instance
                });
                $scope.applyPatch = { "applyPatch": "applyPatch" };
                $scope.$safeApply = function () { };
                $scope.closeThisDialog = jasmine.createSpy().and.callFake(function () {
                    console.log("POPUP CLOSED")
                })
                done();
            }, function (error) {
                done();
            });
            setInterval(function () {
                _$rootScope_.$digest();
            }, 10);
        });
    });

    describe('Upload file plugin test cases', function () {
        
        it("showLoader is called", function (done) {
            $scope.showLoaderIcon = false;
            spyOn($scope, "showLoader").and.callThrough();
            $scope.showLoader();
            console.log('loader showLoaderIcon: ',$scope.showLoaderIcon);
            expect($scope.showLoader).toHaveBeenCalled();
            done();
        });
        it('On click of close button uploadFormClose is called', function (done) {
            spyOn($scope, "uploadFormClose").and.callThrough();
            $scope.uploadFormClose();
            expect($scope.uploadFormClose).toHaveBeenCalled();
            done();
        })
        it("Should invoke generateTelemetry  method", function (done) {
            var data = { "type": "type", "subtype": "subtype", "target": "target", "pluginid": "org.ekstep.uploadtoc", "pluginver": "1.0", "objectid": "", "stage": "" };
            spyOn($scope, "generateTelemetry").and.callThrough();
            $scope.generateTelemetry(data);
            expect($scope.generateTelemetry).toHaveBeenCalled();
            done();
        })
        it("Should invoke generateTelemetry  method and data is undefined", function (done) {
            var data = undefined;
            spyOn($scope, "generateTelemetry").and.callThrough();
            $scope.generateTelemetry(data);
            expect($scope.generateTelemetry).toHaveBeenCalled();
            done();
        })
        xit('Should invoke ngDialog.opened event')
    });


});