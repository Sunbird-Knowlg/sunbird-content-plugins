describe("Ekstep Asset Browser Plugin:", function () {
    var manifest, ctrl, $scope, pluginInstance;
    
    beforeAll(function(done) {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.assetbrowser");
            path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/assetbrowserapp.js");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.assetbrowser");
            var templatePath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/courseunitmeta.html");
            var controllerPath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/assetbrowserapp.js");
            ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
            ecEditor.getCurrentStage = jasmine.createSpy().and.callFake(function() {
                return { id: '5437859-543758937' }
            });
            ecEditor.getContext = jasmine.createSpy().and.callFake(function() {
                return "do_1125330285602488321282";
            });
            org.ekstep.contenteditor.globalContext.user = {id: '123'};
            pluginInstance.mediaType = "image";
            done();
    });

    it('mock popup service', function(done) {
        angular.mock.module('oc.lazyLoad');
        angular.mock.module('Scope.safeApply');
        inject(function($ocLazyLoad, _$rootScope_, _$controller_, _$injector_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $ocLazyLoad.load([{
                type: 'js',
                path: path
            }]).then(function() {
                ctrl = $controller("browsercontroller", {
                    $scope: $scope,
                    instance: pluginInstance
                });
                $scope.$safeApply = function() {};
                $scope.closeThisDialog = jasmine.createSpy().and.callFake(function() {
                    console.log("POPUP CLOSED")
                })
                done();
            }, function(error) {
                done();
            });
            setInterval(function() {
                _$rootScope_.$digest();
            }, 10);
        });
    });

    describe('Asset Browser plugin test cases', function () {

        xit("Should incoke myAssetTab method", function (done) {
            spyOn(ctrl, "myAssetTab").and.callThrough();
            ctrl.myAssetTab();
            expect(ctrl.myAssetTab).toHaveBeenCalled();
            expect(ctrl.myAssetTab).not.toBeUndefined();
           
            done();
        });

        it("Should invoke getMediaType method and mediatype is image", function (done) {
            pluginInstance.mediaType = "image";
            spyOn(ctrl, "getMediaType").and.callThrough();
            ctrl.getMediaType();
            expect(ctrl.getMediaType).toHaveBeenCalled();
            expect(ctrl.getMediaType).not.toBeUndefined();
            done();
        });

        it("Should invoke getMediaType method and mediatype is audio", function (done) {
            pluginInstance.mediaType = "audio";
            spyOn(ctrl, "getMediaType").and.callThrough();
            ctrl.getMediaType();
            expect(ctrl.getMediaType).toHaveBeenCalled();
            expect(ctrl.getMediaType).not.toBeUndefined();
            done();
        });

        xit("Should invoke allAssetTab method", function (done) {
            spyOn(ctrl, "allAssetTab").and.callThrough();
            ctrl.allAssetTab();
            expect(ctrl.allAssetTab).toHaveBeenCalled();
            expect(ctrl.allAssetTab).not.toBeUndefined();
            done();
        });

        it("Should invoke uploadButton method", function (done) {
            pluginInstance.mediaType = "image";
            ctrl.record = true;
            spyOn(ctrl, "uploadButton").and.callThrough();
            ctrl.uploadButton();
            expect(ctrl.uploadButton).toHaveBeenCalled();
            expect(ctrl.uploadButton).not.toBeUndefined();
            done();
        });

        it("Should invoke uploadButton method and mediatype is not image", function (done) {
            pluginInstance.mediaType = "audio";
            ctrl.record = true;
            spyOn(ctrl, "uploadButton").and.callThrough();
            ctrl.uploadButton();
            expect(ctrl.uploadButton).toHaveBeenCalled();
            expect(ctrl.uploadButton).not.toBeUndefined();
            done();
        });

        it("Should invoke uploadClick method", function (done) {
            spyOn(ctrl, "uploadClick").and.callThrough();
            ctrl.uploadClick();
            expect(ctrl.uploadClick).toHaveBeenCalled();
            expect(ctrl.uploadClick).not.toBeUndefined();
            done();
        });

        it("Should invoke audioTab method", function (done) {
            spyOn(ctrl, "audioTab").and.callThrough();
            ctrl.audioTab();
            expect(ctrl.audioTab).toHaveBeenCalled();
            expect(ctrl.audioTab).not.toBeUndefined();
            done();
        });

        it("Should invoke assetUpload method", function (done) {
            spyOn(ctrl, "assetUpload").and.callThrough();
            ctrl.assetUpload();
            expect(ctrl.assetUpload).toHaveBeenCalled();
            expect(ctrl.assetUpload).not.toBeUndefined();
            done();
        });

        it("Should invoke search method", function (done) {
            spyOn(ctrl, "search").and.callThrough();
            ctrl.search();
            expect(ctrl.search).toHaveBeenCalled();
            expect(ctrl.search).not.toBeUndefined();
            done();
        });

        it("Should invoke search method and tabselected value is other", function (done) {
            ctrl.tabSelected = "other";
            ctrl.myTabScrollElement = "id";
            spyOn(ctrl, "search").and.callThrough();
            ctrl.search();
            expect(ctrl.search).toHaveBeenCalled();
            expect(ctrl.search).not.toBeUndefined();
            done();
        });

        it("Should invoke cancel method for close popup", function (done) {
            ctrl.myTabScrollElement = "id";
            spyOn(ctrl, "cancel").and.callThrough();
            ctrl.cancel();
            expect(ctrl.cancel).toHaveBeenCalled();
            expect(ctrl.cancel).not.toBeUndefined();
            done();
        });

        // it("Should invoke ImageSource method", function (done) {
           
        //     done();
        // });

        // it("Should invoke toggleImageCheck method", function (done) {
           
        //     done();
        // });

        // it("Should invoke toggleImageCheck method", function (done) {
           
        //     done();
        // });

        // it("Should invoke initPopup method", function (done) {
           
        //     done();
        // });

        // it("Should invoke initPopup method", function (done) {
           
        //     done();
        // });

        // it("Should invoke convertToBytes method", function (done) {
           
        //     done();
        // });


        // it("Should not generate telemetry when data is not passed", function (done) {
           
        //     done();
        // });

        // it("Should generate telemetry event", function (done) {
       
        //     done();
        // });
    })
})