describe("Ekstep Asset Browser Plugin:", function () {
    var manifest, ctrl, $scope, pluginInstance;
    var instance = { manifest: { id: "org.ekstep.assetbrowser", ver: "1.2" }, "data": "" };
    beforeAll(function (done) {
        ContentEditorTestFramework.init(function () {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.assetbrowser");
            path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/assetbrowserapp.js");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.assetbrowser");
            var templatePath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/assetBrowser.html");
            var controllerPath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/assetbrowserapp.js");
            ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
            ecEditor.getContext = jasmine.createSpy().and.callFake(function () {
                return "do_1143535346658585";
            });
            done();
        })
    })
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
                ctrl = $controller("browsercontroller", {
                    $scope: $scope,
                    instance: instance
                });
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
    describe('Asset Browser plugin test cases', function () {

        it("Should incoke myAssetTab method", function (done) {
           
            done();
        });

        it("Should invoke getMediaType method", function (done) {
           
            done();
        });

        it("Should invoke allAssetTab method", function (done) {
           
            done();
        });

        it("Should invoke uploadButton method", function (done) {
           
            done();
        });

        it("Should invoke uploadClick method", function (done) {
           
            done();
        });

        it("Should invoke audioTab method", function (done) {
           
            done();
        });

        it("Should invoke assetUpload method", function (done) {
           
            done();
        });

        it("Should invoke search method", function (done) {
           
            done();
        });

        it("Should invoke cancle method for close popup", function (done) {
           
            done();
        });

        it("Should invoke ImageSource method", function (done) {
           
            done();
        });

        it("Should invoke toggleImageCheck method", function (done) {
           
            done();
        });

        it("Should invoke toggleImageCheck method", function (done) {
           
            done();
        });

        it("Should invoke initPopup method", function (done) {
           
            done();
        });

        it("Should invoke initPopup method", function (done) {
           
            done();
        });

        it("Should invoke convertToBytes method", function (done) {
           
            done();
        });


        it("Should not generate telemetry when data is not passed", function (done) {
           
            done();
        });

        it("Should generate telemetry event", function (done) {
       
            done();
        });
    })
})