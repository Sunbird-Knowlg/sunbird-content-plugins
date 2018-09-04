describe("lesson browser plugin", function() {
    var manifest, path, ctrl, $scope, pluginInstance;
    beforeAll(function(done) {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.lessonbrowser");
        path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/lessonBrowserApp.js");
        pluginInstance = org.ekstep.pluginframework.pluginManager.pluginObjs["org.ekstep.lessonbrowser"];
        done();
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
        describe("Init lesson browser", function() {
            it("It should initialized Lesson browser plugin", function() {
                spyOn(pluginInstance, 'initialize').and.callThrough();
                pluginInstance.initialize(manifest);
                expect(pluginInstance.initialize).toHaveBeenCalled();
            });
            it("Should initialize the lesson browser with filters", function(done) {
                spyOn(pluginInstance, "initPreview").and.callThrough();
                var query = {
                    "query": {
                        "lessonType": [
                        "Resource"
                        ]
                    }
                };
                ecEditor.dispatchEvent('org.ekstep.lessonbrowser:show', query);
                expect(pluginInstance.query).toEqual(query.query);
                done();
            });
            it("By dispatching editor:invoke:viewall event init preview should called", function(done) {
                spyOn(pluginInstance, "initPreview").and.callThrough();
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
                            "Resource"
                        ]
                        },
                        "offset": 0,
                        "limit": 100,
                        "softConstraints": {
                        "gradeLevel": 100,
                        "medium": 50,
                        "board": 25
                        }
                    },"callback": function(){}
                });
                expect(pluginInstance.client).toEqual("org");
                done();
            });
        });
        describe("View all", function() {
            it("ContentType filter should prefilled with Resource type", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "objectType": [
                            "Resource"
                        ]}}});
                expect(ctrl.filterSelection.contentType).toEqual("Resource");
            });
            it("ContentType filter should prefilled with Collection type", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "objectType": [
                            "Collection"
                        ]}}});
                expect(ctrl.filterSelection.contentType).toEqual(["Collection"]);
            });
            it("CURRICULUM filter should prefilled with ICSE", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "board": [
                            "ICSE"
                        ]}}});
                expect(ctrl.filterSelection.board).toEqual(["ICSE"]);
            });
            it("CLASS filter should prefilled with Class 1", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "gradeLevel": [
                            "Class 1"
                        ]}}});
                expect(ctrl.filterSelection.gradeLevel).toEqual(["Class 1"]);
            });
            it("SUBJECT  filter should prefilled with English", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "subject": [
                            "English"
                        ]}}});
                expect(ctrl.filterSelection.subject).toEqual(["English"]);
            });
            it("MEDIUM  filter should prefilled with English", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "medium": [
                            "English"
                        ]}}});
                expect(ctrl.filterSelection.medium).toEqual(["English"]);
            });
        });
        describe("Apply rootNode Metadata", function() {
            it("If root node having NCERT board, filters should be prefilled as NCERT board", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "objectType": [
                            "Resource"
                        ]}}});
                $scope.contentMeta.board = ["NCERT"]; 
                expect($scope.rootNodeFilter.board).toEqual($scope.contentMeta.board);
            });
            it("If root node having NCERT board and Query having NCF, filters should be prefilled as NCERT, NCF board", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "board":["NCF"], 
                        "objectType": [
                            "Resource"
                        ]}}});
                $scope.contentMeta.board = ["NCERT"]; 
                expect($scope.rootNodeFilter.board).toEqual($scope.contentMeta.board);
            });
            it("If root node having English medium, filters should be prefilled as English medium", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "objectType": [
                            "Resource"
                        ]}}});
                $scope.contentMeta.medium = ["English"]; 
                expect($scope.rootNodeFilter.medium).toEqual($scope.contentMeta.medium);
            });
            it("If root node having English subject, filters should be prefilled as English subject", function() {
                spyOn(ctrl, 'viewAll').and.callThrough();
                ctrl.viewAll({"request": {
                        "filters": {
                        "objectType": [
                            "Resource"
                        ]}}});
                $scope.contentMeta.subject = ["English"]; 
                expect($scope.rootNodeFilter.subject).toEqual($scope.contentMeta.subject);
            });
        });
    });
});