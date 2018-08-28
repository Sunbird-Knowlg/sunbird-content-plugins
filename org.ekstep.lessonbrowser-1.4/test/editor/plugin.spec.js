describe("lesson browser plugin", function() {
    var manifest, path, ctrl, $scope, pluginInstance;
    beforeAll(function(done) {
        CollectionEditorTestFramework.init(function() {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.lessonbrowser");
            path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/lessonBrowserApp.js");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.lessonbrowser");
            var templatePath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/lessonbrowser.html");
            var controllerPath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/lessonBrowserApp.js");
            ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
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
                ctrl = $controller("lessonController", { $scope: $scope, instance: { manifest: manifest } });
                done();
            }, function(error) {
                done();
            });
            setInterval(function() {
                _$rootScope_.$digest();
            }, 10);
        });
    });
    
    describe("Lesson browser", function() {
    	it("It should initialized Lesson browser plugin", function() {
            spyOn(pluginInstance, 'initialize').and.callThrough();
            pluginInstance.initialize(manifest);
            console.log("manifest", manifest);
            console.log("pluginInstance", pluginInstance);
            expect(pluginInstance.initialize).toHaveBeenCalled();
        });
        it("Should initialize the lesson browser without filters", function(done) {
            spyOn($scope, "initPreview").and.callThrough();
            ecEditor.dispatchEvent('org.ekstep.lessonbrowser:show', {
                "filters": {
                    "lessonType": [
                    "Resource"
                    ]
                }
            });
            expect($scope.mainTemplate).toEqual("cardDetailsView");
            done();
        });
        it("Should initialize the lesson browser without filters", function(done) {
            spyOn($scope, "initPreview").and.callThrough();
            ecEditor.dispatchEvent('editor:invoke:viewall', {
                "client": "org",
                "request": {
                    "mode": "soft",
                    "filters": {
                    "objectType": [
                        "Content"
                    ],
                    "status": [
                        "Live"
                    ],
                    "contentType": [
                        "Collection",
                        "Resource",
                        "Story",
                        "Worksheet"
                    ]
                    },
                    "offset": 0,
                    "limit": 100,
                    "softConstraints": {
                    "gradeLevel": 100,
                    "medium": 50,
                    "board": 25
                    }
                },"callback": callback()
            });
            expect($scope.mainTemplate).toEqual("selectedResult");
            done();
        });
    });
});