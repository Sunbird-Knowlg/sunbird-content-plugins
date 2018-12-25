describe("Collaborator plugin", function () {
    var manifest, path, ctrl, $scope, pluginInstance, contentData;

    beforeAll(function (done) {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.collaborator");
        console.log('manifest', manifest);
        path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/collaboratorApp.js");
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.collaborator");

        contentData = {

            "ownershipType": [
                "createdBy"
            ],
            "identifier": "do_112658525052387328157",
            "audience": [
                "Learner"
            ],
            "code": "org.sunbird.pUovj2",
            "visibility": "Default",
            "description": "Enter description for TextBook",
            "language": [
                "English"
            ],
            "mediaType": "content",
            "mimeType": "application/vnd.ekstep.content-collection",
            "osId": "org.ekstep.quiz.app",
            "languageCode": "en",
            "createdOn": "2018-12-19T14:35:08.934+0000",
            "versionKey": "1545319293256",
            "framework": "NCFCOPY",
            "createdBy": "874ed8a5-782e-4f6c-8f36-e0288455901e",
            "name": "collaborator test",
            "lastUpdatedOn": "2018-12-20T15:21:33.256+0000",
            "collaborators": [
                "0c383526-2677-46be-8fb0-06d41392d40b",
                "bf7d7cf5-810c-46f2-9422-810843990e82"
            ],
            "contentType": "TextBook",
            "resourceType": "Book",
            "status": "Draft"
        }
        ecEditor.getService('content').getContent = jasmine.createSpy().and.callFake(function (data, callback) {
            return callback(undefined, contentData);
        });
        ecEditor.getContext = jasmine.createSpy().and.callFake(function (param) {
            if (param === 'contentId') {
                return "do_112480621612351488118";
            } else if (param === 'uid') {
                return '874ed8a5-782e-4f6c-8f36-e0288455901e';
            }
        });
        done();
    });

    it('mock controller', function (done) {
        angular.mock.module('oc.lazyLoad');
        angular.mock.module('Scope.safeApply');
        inject(function ($ocLazyLoad, _$rootScope_, _$controller_) {
            var $controller = _$controller_;
            $scope = _$rootScope_.$new();

            $ocLazyLoad.load([
                { type: 'js', path: path }
            ]).then(function () {
                ctrl = $controller("collaboratorCtrl", { $scope: $scope, instance: { manifest: manifest } });
                $scope.$safeApply = function () { };
                done();
            }, function (error) {
                done();
            });
            setInterval(function () {
                _$rootScope_.$digest();
            }, 10);
        });
    });

    describe("Add Collaborator", function () {
        it('Init collaborator', function () {
            console.log('Scope', $scope);
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

        it("Should invoke init method for initialization", function (done) {
            spyOn($scope, "init").and.callThrough();
            $scope.init();
            expect($scope.init).toHaveBeenCalled();
            done();
        });

        it('should call content service with current content ID', function (done) {
            $scope.getContentCollaborators();
            expect(ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContent).toHaveBeenCalledWith(ecEditor.getContext('contentId'), jasmine.any(Function));
            expect($scope.isContentOwner).toBeTruthy();
            expect($scope.collaboratorsId).toEqual(["0c383526-2677-46be-8fb0-06d41392d40b", "bf7d7cf5-810c-46f2-9422-810843990e82"]);
            expect($scope.isLoading).toBeTruthy();
            done();
        });
    });

    describe('selectTab', () => {
        it('should call fetchCollaborators if there are no existing collaborators on selecting a add collaborators tab', () => {
            spyOn($scope, 'generateTelemetry');
            let event = { currentTarget: { dataset: { tab: 'userListTab' } } };
            spyOn($scope, 'selectTab').and.callThrough();
            $scope.selectTab(event);
            expect($scope.selectTab).toHaveBeenCalled();
            expect($scope.isAddCollaboratorTab).toBeFalsy();
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'changeTab', target: 'manageCollaborator', targetid: 'userListTab' });
            expect($scope.isLoading).toBeTruthy();

        });
        it('should not make api call if there are collaborators exists', () => {
            spyOn($scope, 'generateTelemetry');
            let event = { currentTarget: { dataset: { tab: 'userListTab' } } };
            spyOn($scope, 'selectTab').and.callThrough();
            $scope.collaboratorsList = [];
            $scope.selectTab(event);
        });
    });
});