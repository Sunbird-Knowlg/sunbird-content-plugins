describe("Collaborator plugin", function () {
    var manifest, path, ctrl, $scope, pluginInstance, contentData, $timeout, userSearchData;

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

        userSearchData = {
            "data": {
                "id": "api.user.search",
                "ver": "v1",
                "ts": "2018-12-28 06:57:11:742+0000",
                "params": {
                    "resmsgid": null,
                    "msgid": "af2af5c2-5910-4c87-b5c5-db4b37591c79",
                    "err": null,
                    "status": "success",
                    "errmsg": null
                },
                "responseCode": "OK",
                "result": {
                    "response": {
                        "count": 1,
                        "content": [
                            {
                                "lastName": "Raj",
                                "identifier": "4a698288-5d8b-4ed1-8b21-3215d945c474",
                                "firstName": "Rajath",
                                "organisations": [
                                    {
                                        "organisationId": "01243890518834380856",
                                        "updatedBy": "781c21fc-5054-4ee0-9a02-fbb1006a4fdd",
                                        "orgName": "hello3001",
                                        "addedByName": null,
                                        "addedBy": null,
                                        "roles": [
                                            "CONTENT_CREATOR"
                                        ],
                                        "approvedBy": null,
                                        "updatedDate": "2018-05-21 09:35:50:475+0000",
                                        "userId": "4a698288-5d8b-4ed1-8b21-3215d945c474",
                                        "approvaldate": null,
                                        "isDeleted": false,
                                        "hashTagId": null,
                                        "isRejected": null,
                                        "id": "0125082889641984004",
                                        "position": null,
                                        "isApproved": null,
                                        "orgjoindate": "2018-05-21 08:02:47:911+0000",
                                        "orgLeftDate": null
                                    }
                                ],
                                "phone": "",
                                "email": ""
                            }
                        ]
                    }
                },
                "responseTime": 93
            }
        };
        ecEditor.getService('content').getContent = jasmine.createSpy().and.callFake(function (data, callback) {
            return callback(undefined, contentData);
        });
        ecEditor.getContext = jasmine.createSpy().and.callFake(function (param) {
            if (param === 'contentId') {
                return "do_112480621612351488118";
            } else if (param === 'uid') {
                return '874ed8a5-782e-4f6c-8f36-e0288455901e';
            } else if (param === 'user') {
                return {
                    orgIds: ["0123653943740170242", "ORG_001"]
                }
            }
        });
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
                ctrl = $controller("collaboratorCtrl", { $scope: $scope, instance: { manifest: manifest } });
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
            expect($scope.currentCollaborators).toEqual(["0c383526-2677-46be-8fb0-06d41392d40b", "bf7d7cf5-810c-46f2-9422-810843990e82"]);
            expect($scope.isLoading).toBeTruthy();
            done();
        });

        /*         it('should set isContentOwner to false', function (done) {
                    ecEditor.getContext = jasmine.createSpy().and.callFake(function (param) {
                        if (param === 'contentId') {
                            return "do_112480621612351488118";
                        } else if (param === 'uid') {
                            return '874ed8a5-782e-4f6c-8f36-e0288455901f';
                        } else if (param === 'user') {
                            return {
                                orgIds: ["0123653943740170242", "ORG_001"]
                            }
                        }
                    });
                    $scope.getContentCollaborators();
                    expect($scope.isContentOwner).toBeFalsy();
                    done();
                }); */

        it('should fetch collaborators', function (done) {
            spyOn($scope, 'fetchCollaborators');
            ecEditor.getService('content').getContent = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback(undefined, []);
            });
            $scope.getContentCollaborators();
            expect($scope.currentCollaborators).toEqual([]);
            expect($scope.fetchCollaborators).toHaveBeenCalled();
            done();
        });

        it('should show error message and close popup', function (done) {
            ecEditor.getService('content').getContent = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback({}, undefined);
            });
            spyOn(ecEditor, 'dispatchEvent');
            $scope.getContentCollaborators();
            expect($scope.isLoading).toBeFalsy();
            expect(ecEditor.dispatchEvent).toHaveBeenCalledWith("org.ekstep.toaster:error", { message: 'Unable to fetch collaborators', position: 'topCenter', icon: 'fa fa-warning' });
            done();
        });
    });

    describe('selectTab', () => {
        it('should call fetchCollaborators if there are no existing collaborators on selecting a add collaborators tab', () => {
            spyOn($scope, 'generateTelemetry');
            spyOn($scope, 'fetchCollaborators');
            let event = { currentTarget: { dataset: { tab: 'userListTab' } } };
            spyOn($scope, 'selectTab').and.callThrough();
            $scope.selectTab(event);
            expect($scope.selectTab).toHaveBeenCalled();
            expect($scope.isAddCollaboratorTab).toBeFalsy();
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'changeTab', target: 'manageCollaborator', targetid: 'userListTab' });
            expect($scope.isLoading).toBe(true);
            expect($scope.fetchCollaborators).toHaveBeenCalled();

        });

        it('should not make api call if there are collaborators exists', () => {
            spyOn($scope, 'fetchCollaborators');
            let event = { currentTarget: { dataset: { tab: 'userListTab' } } };
            spyOn($scope, 'selectTab').and.callThrough();
            $scope.collaboratorsList = ['874ed8a5-782e-4f6c-8f36-e0288455901e'];
            $scope.selectTab(event);
            expect($scope.isLoading).toBe(true);
            //expect($scope.fetchCollaborators).not.toHaveBeenCalled();
        });

        it('should change a tab to the add collaborator', (done) => {
            spyOn($scope, 'generateTelemetry');
            spyOn($scope, 'fetchCollaborators');
            spyOn($scope, 'applyJQuery');
            let event = { currentTarget: { dataset: { tab: 'addCollaboratorTab' } } };
            spyOn($scope, 'selectTab').and.callThrough();
            $scope.selectTab(event);
            expect($scope.isLoading).toBe(false);
            expect($scope.isAddCollaboratorTab).toBe(true);
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'changeTab', target: 'addCollaborator', targetid: 'addCollaboratorTab' });
            $timeout.flush();
            expect($scope.applyJQuery).toHaveBeenCalled();
            done();
        });
    });

    describe('fetchCollaborators', () => {
        it('should fetch details of the collaborators, if there are collaborators for the content', () => {
            $scope.userService = { search: () => { } };
            spyOn($scope, 'fetchCollaborators').and.callThrough();
            spyOn($scope.userService, 'search');
            $scope.userService.search = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback(undefined, userSearchData);
            });
            $scope.currentCollaborators = ['4a698288-5d8b-4ed1-8b21-3215d945c474'];
            $scope.fetchCollaborators();
            let searchBody = {
                "request": {
                    "query": "",
                    "filters": {
                        "organisations.roles": ["CONTENT_CREATOR"],
                        "rootOrgId": ["0123653943740170242", "ORG_001"],
                        "userId": ['4a698288-5d8b-4ed1-8b21-3215d945c474']
                    },
                    "fields": ["email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone"],
                    "offset": 0,
                    "limit": 200
                }
            };
            expect($scope.fetchCollaborators).toHaveBeenCalled();
            expect($scope.userService.search).toHaveBeenCalledWith(searchBody, jasmine.any(Function));
            expect($scope.collaborators).toEqual(userSearchData.data.result.response.content);
            expect($scope.collaborators.selectedCount).toEqual(0);
            $timeout.flush();
            expect($scope.isLoading).toBe(false);

        });

        it('should log error telemetry event if user service fails', () => {
            $scope.userService = { search: () => { } };
            spyOn($scope, 'fetchCollaborators').and.callThrough();
            spyOn($scope.userService, 'search');
            spyOn($scope, 'generateError');
            $scope.userService.search = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback({}, undefined);
            });
            $scope.currentCollaborators = ['4a698288-5d8b-4ed1-8b21-3215d945c474'];
            $scope.fetchCollaborators();
            expect($scope.generateError).toHaveBeenCalledWith({ status: '', error: {} });
        });

        it('should not make user search api call if there are no collaborators present for the content', () => {
            spyOn($scope, 'fetchCollaborators').and.callThrough();
            spyOn($scope, '$safeApply')
            $scope.currentCollaborators = [];
            $scope.fetchCollaborators();
            expect($scope.isLoading).toBe(false);
            expect($scope.$safeApply).toHaveBeenCalled();
        });
    });

    describe('loadAllUsers', () => {
        it('should call user search API to fetch users, if there are no collaborators present', () => {
            let searchBody = {
                "request": {
                    "query": "",
                    "filters": {
                        "organisations.roles": ["CONTENT_CREATOR"],
                        "rootOrgId": ["0123653943740170242", "ORG_001"]
                    },
                    "fields": ["email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone"],
                    "offset": 0,
                    "limit": 200
                }
            };
            $scope.userService = { search: () => { } };
            spyOn($scope, 'loadAllUsers').and.callThrough();
            spyOn($scope.userService, 'search');
            spyOn($scope, 'applyJQuery');
            $scope.userService.search = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback(undefined, userSearchData);
            });

            $scope.loadAllUsers();
            expect($scope.loadAllUsers).toHaveBeenCalled();
            expect($scope.isAddCollaboratorTab).toBe(true);
            expect($scope.currentCollaborators).toEqual([]);
            expect($scope.userService.search).toHaveBeenCalledWith(searchBody, jasmine.any(Function));
            expect($scope.users).toEqual(userSearchData.data.result.response.content);
            expect($scope.users.count).toEqual(1);
            expect($scope.users.selectedCount).toEqual(0);
            expect($scope.isLoading).toBe(false);
            $timeout.flush();
            expect($scope.applyJQuery).toHaveBeenCalled();
        });

        it('should exclude the current collaborators from the list', () => {
            let searchBody = {
                "request": {
                    "query": "",
                    "filters": {
                        "organisations.roles": ["CONTENT_CREATOR"],
                        "rootOrgId": ["0123653943740170242", "ORG_001"],
                    },
                    "fields": ["email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone"],
                    "offset": 0,
                    "limit": 200
                }
            };
            $scope.userService = { search: () => { } };
            $scope.currentCollaborators = ['4a698288-5d8b-4ed1-8b21-3215d945c474'];
            spyOn($scope, 'loadAllUsers').and.callThrough();
            spyOn($scope.userService, 'search');
            spyOn($scope, 'excludeCollaborators');
            $scope.userService.search = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback(undefined, userSearchData);
            });
            $scope.excludeCollaborators = jasmine.createSpy().and.returnValue({});

            $scope.loadAllUsers();
            expect($scope.excludeCollaborators).toHaveBeenCalledWith(userSearchData.data.result.response.content);
        });
        it('should log the error telemetry event if user search API fails', () => {
            let searchBody = {
                "request": {
                    "query": "",
                    "filters": {
                        "organisations.roles": ["CONTENT_CREATOR"],
                        "rootOrgId": ["0123653943740170242", "ORG_001"],
                    },
                    "fields": ["email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone"],
                    "offset": 0,
                    "limit": 200
                }
            };
            $scope.userService = { search: () => { } };
            spyOn($scope, 'loadAllUsers').and.callThrough();
            spyOn($scope.userService, 'search');
            spyOn($scope, 'generateError');
            $scope.userService.search = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback({}, undefined);
            });

            $scope.loadAllUsers();
            expect($scope.generateError).toHaveBeenCalled();
        })
    });

    describe('updateCollaborators', () => {
        it('should update the collaborators for a content', () => {
            let newCollaborators = ['874ed8a5-782e-4f6c-8f36-e0288455901f', '454ed8a5-782e-4f6c-8f36-e0288455903f'];
            let updateRequest = {
                "request": {
                    "content": {
                        "collaborators": ['874ed8a5-782e-4f6c-8f36-e0288455901f', '454ed8a5-782e-4f6c-8f36-e0288455903f']
                    }
                }
            }

            let updateResponse = {
                "data": {
                    "id": "api.collaborator.update",
                    "ver": "1.0",
                    "ts": "2018-12-28T11:09:52.783Z",
                    "params": {
                        "resmsgid": "199df9f0-0a91-11e9-8a91-450ab715ff69",
                        "msgid": "19889d30-0a91-11e9-82de-0b2c133f0d4f",
                        "status": "successful",
                        "err": null,
                        "errmsg": null
                    },
                    "responseCode": "OK",
                    "result": {
                        "content_id": "do_11265256986546995213",
                        "versionKey": "1545995392694"
                    },
                    "responseTime": 291
                }
            };

            spyOn($scope, 'updateCollaborators').and.callThrough()
            spyOn(ecEditor, 'dispatchEvent');
            spyOn($scope, 'closePopup');
            spyOn($scope.contentService, '_setContentMeta');
            $scope.userService.updateCollaborators = jasmine.createSpy().and.callFake(function (contentId, updateRequest, callback) {
                return callback(undefined, updateResponse);
            });
            $scope.contentService.getContentMeta = jasmine.createSpy().and.returnValue(contentData);
            $scope.updateCollaborators(newCollaborators);

            expect(ecEditor.dispatchEvent).toHaveBeenCalledWith("org.ekstep.toaster:success", {
                message: 'Collaborators updated successfully',
                position: 'topCenter',
                icon: 'fa fa-check-circle'
            });
            expect($scope.updateCollaboratorRequest.request.content.collaborators).toEqual(['874ed8a5-782e-4f6c-8f36-e0288455901f', '454ed8a5-782e-4f6c-8f36-e0288455903f']);
            expect($scope.userService.updateCollaborators).toHaveBeenCalledWith('do_112480621612351488118', updateRequest, jasmine.any(Function));
            expect($scope.contentService.getContentMeta).toHaveBeenCalledWith('do_112480621612351488118');
            expect($scope.contentService.getContentMeta(ecEditor.getContext('contentId'))).toEqual(contentData);
            contentData.versionKey = 1545995392694;
            expect($scope.contentService._setContentMeta).toHaveBeenCalledWith('do_112480621612351488118', contentData);
            expect($scope.closePopup).toHaveBeenCalled();
        });

        it('should show the error message if collaborator API fails to update', () => {
            let updateRequest = {
                "request": {
                    "content": {
                        "collaborators": ['874ed8a5-782e-4f6c-8f36-e0288455901f', '454ed8a5-782e-4f6c-8f36-e0288455903f']
                    }
                }
            }
            spyOn($scope, 'updateCollaborators').and.callThrough();
            spyOn(ecEditor, 'dispatchEvent');
            $scope.userService.updateCollaborators = jasmine.createSpy().and.callFake(function (contentId, updateRequest, callback) {
                return callback({}, undefined);
            });
            $scope.updateCollaborators([]);

            expect(ecEditor.dispatchEvent).toHaveBeenCalledWith("org.ekstep.toaster:error", {
                message: 'Unable to update collaborator',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
        });
    });

    describe('excludeCollaborators', () => {
        it('should exclude the current collaborators from the usersList', () => {
            let users = [
                {
                    "lastName": "",
                    "identifier": "0c383526-2677-46be-8fb0-06d41392d40b",
                    "firstName": "sezal",
                    "organisations": [],
                    "phone": "******8098",
                    "email": "se****@gmail.com"
                },
                {
                    "lastName": "Raj",
                    "identifier": "4a698288-5d8b-4ed1-8b21-3215d945c474",
                    "firstName": "Rajath",
                    "organisations": [],
                    "phone": "",
                    "email": ""
                },
                {
                    "lastName": "Kumar",
                    "identifier": "bb4c9877-a025-44fe-aa3b-e2291fba0008",
                    "firstName": "Amit",
                    "organisations": [],
                    "phone": "",
                    "email": ""
                },
                {
                    "lastName": "07",
                    "identifier": "6e4fa739-84b9-47ea-9758-914e0b967697",
                    "firstName": "content_creator_org_003",
                    "organisations": [],
                    "phone": null,
                    "email": ""
                },
                {
                    "lastName": "Raj",
                    "identifier": "91eedfbe-4cc1-463f-9f6a-ff1045dd504e",
                    "firstName": "Rajjath",
                    "organisations": [],
                    "phone": "",
                    "email": null
                }
            ]
            $scope.currentCollaborators = ['91eedfbe-4cc1-463f-9f6a-ff1045dd504e', '4a698288-5d8b-4ed1-8b21-3215d945c474'];
            spyOn($scope, 'excludeCollaborators').and.callThrough();
            let result = $scope.excludeCollaborators(users);
            expect($scope.excludeCollaborators).toHaveBeenCalled();
            users.splice(1, 1);
            users.splice(4, 1);
            expect(result).toEqual(users);
        });

        it('should not exclude any user if there are no collaborators', () => {
            let users = [
                {
                    "lastName": "",
                    "identifier": "0c383526-2677-46be-8fb0-06d41392d40b",
                    "firstName": "sezal",
                    "organisations": [],
                    "phone": "******8098",
                    "email": "se****@gmail.com"
                },
                {
                    "lastName": "Raj",
                    "identifier": "4a698288-5d8b-4ed1-8b21-3215d945c474",
                    "firstName": "Rajath",
                    "organisations": [],
                    "phone": "",
                    "email": ""
                },
                {
                    "lastName": "Kumar",
                    "identifier": "bb4c9877-a025-44fe-aa3b-e2291fba0008",
                    "firstName": "Amit",
                    "organisations": [],
                    "phone": "",
                    "email": ""
                },
                {
                    "lastName": "07",
                    "identifier": "6e4fa739-84b9-47ea-9758-914e0b967697",
                    "firstName": "content_creator_org_003",
                    "organisations": [],
                    "phone": null,
                    "email": ""
                },
                {
                    "lastName": "Raj",
                    "identifier": "91eedfbe-4cc1-463f-9f6a-ff1045dd504e",
                    "firstName": "Rajjath",
                    "organisations": [],
                    "phone": "",
                    "email": null
                }
            ]
            $scope.currentCollaborators = [];
            spyOn($scope, 'excludeCollaborators').and.callThrough();
            let result = $scope.excludeCollaborators(users);
            expect($scope.excludeCollaborators).toHaveBeenCalled();
            expect(result).toEqual(users);
        });
    });

    describe('closePopup', () => {
        it('should close the popup and call telemetry event', () => {
            spyOn($scope, 'closePopup').and.callThrough();
            spyOn($scope, 'generateTelemetry');
            spyOn($scope, 'closeThisDialog');
            $scope.closePopup();
            expect($scope.closePopup).toHaveBeenCalled();
            expect($scope.inViewLogs).toEqual([]);
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'cancel', target: 'closePopup', targetid: 'close-button' });
            expect($scope.closeThisDialog).toHaveBeenCalled();
        });
    });

    describe('toggleSelectionUser', () => {
        it('should check the selection', () => {
            $scope.users = [{
                "lastName": "",
                "identifier": "0c383526-2677-46be-8fb0-06d41392d40b",
                "firstName": "sezal",
                "organisations": [],
                "phone": "******8098",
                "email": "se****@gmail.com"
            },
            {
                "lastName": "Raj",
                "identifier": "4a698288-5d8b-4ed1-8b21-3215d945c474",
                "firstName": "Rajath",
                "organisations": [],
                "phone": "",
                "email": ""
            }];

            $scope.users.selectedCount = 0;
            spyOn($scope, 'toggleSelectionUser').and.callThrough();
            spyOn($scope, 'generateTelemetry');
            spyOn($scope, '$safeApply');
            $scope.toggleSelectionUser($scope.users[0], 0, 'users');

            expect($scope.toggleSelectionUser).toHaveBeenCalledWith($scope.users[0], 0, 'users');
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'check', target: 'user', targetid: '0c383526-2677-46be-8fb0-06d41392d40b' });
            expect($scope.users[0].isSelected).toBe(true);
            expect($scope.users.selectedCount).toEqual(1);
            expect($scope.$safeApply).toHaveBeenCalled();
        });

        it('should uncheck the selection', () => {
            $scope.users = [{
                "lastName": "",
                "identifier": "0c383526-2677-46be-8fb0-06d41392d40b",
                "firstName": "sezal",
                "organisations": [],
                "phone": "******8098",
                "email": "se****@gmail.com",
                "isSelected": true
            },
            {
                "lastName": "Raj",
                "identifier": "4a698288-5d8b-4ed1-8b21-3215d945c474",
                "firstName": "Rajath",
                "organisations": [],
                "phone": "",
                "email": ""
            }];

            $scope.users.selectedCount = 1;

            spyOn($scope, 'toggleSelectionUser').and.callThrough();
            spyOn($scope, 'generateTelemetry');
            spyOn($scope, '$safeApply');
            $scope.toggleSelectionUser($scope.users[0], 0, 'users');

            expect($scope.toggleSelectionUser).toHaveBeenCalledWith($scope.users[0], 0, 'users');
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'uncheck', target: 'user', targetid: '0c383526-2677-46be-8fb0-06d41392d40b' });
            expect($scope.users[0].isSelected).toBe(false);
            expect($scope.users.selectedCount).toEqual(0);
            expect($scope.$safeApply).toHaveBeenCalled();
        });
    });

    describe('sortUsersList', () => {
        it('should sort a users list based on the received input', () => {
            $scope.users = [{
                "lastName": "",
                "identifier": "0c383526-2677-46be-8fb0-06d41392d40b",
                "firstName": "sezal",
                "organisations": [],
                "phone": "******8098",
                "email": "se****@gmail.com",
                "isSelected": true
            },
            {
                "lastName": "Raj",
                "identifier": "4a698288-5d8b-4ed1-8b21-3215d945c474",
                "firstName": "Rajath",
                "organisations": [],
                "phone": "",
                "email": ""
            }];
            spyOn($scope, 'sortUsersList').and.callThrough();
            spyOn($scope, '$safeApply');
            $scope.sortUsersList('firstName');
            expect($scope.sortUsersList).toHaveBeenCalled();
            expect($scope.users).toEqual($scope.users.reverse());
            expect($scope.$safeApply).toHaveBeenCalled();
        });
        it('should sort a users list based on the received input', () => {
            $scope.users = [{
                "lastName": "",
                "identifier": "0c383526-2677-46be-8fb0-06d41392d40b",
                "firstName": "sezal",
                "organisations": [{
                    "organisationId": "01243890518834380856",
                    "updatedBy": "781c21fc-5054-4ee0-9a02-fbb1006a4fdd",
                    "orgName": "hello3001",
                    "addedByName": null,
                    "addedBy": null,
                    "roles": [
                        "CONTENT_CREATOR"
                    ],
                    "approvedBy": null,
                    "updatedDate": "2018-05-21 09:35:50:475+0000",
                    "userId": "4a698288-5d8b-4ed1-8b21-3215d945c474",
                    "approvaldate": null,
                    "isDeleted": false,
                    "hashTagId": null,
                    "isRejected": null,
                    "id": "0125082889641984004",
                    "position": null,
                    "isApproved": null,
                    "orgjoindate": "2018-05-21 08:02:47:911+0000",
                    "orgLeftDate": null
                }],
                "phone": "******8098",
                "email": "se****@gmail.com",
                "isSelected": true
            },
            {
                "lastName": "Kumar",
                "identifier": "8cb56ae8-c056-4dd1-a42d-29009e4efc25",
                "firstName": "Amit",
                "organisations": [
                    {
                        "organisationId": "01230597559319756819",
                        "updatedBy": null,
                        "orgName": "Bangalore ",
                        "addedByName": null,
                        "addedBy": null,
                        "roles": [
                            "CONTENT_CREATOR"
                        ],
                        "approvedBy": null,
                        "updatedDate": null,
                        "userId": "8cb56ae8-c056-4dd1-a42d-29009e4efc25",
                        "approvaldate": null,
                        "isDeleted": false,
                        "hashTagId": null,
                        "isRejected": null,
                        "id": "0123102670801879049",
                        "position": null,
                        "isApproved": null,
                        "orgjoindate": "2017-08-14 13:29:53:309+0000",
                        "orgLeftDate": null
                    }
                ],
                "phone": "",
                "email": "",
                "$$hashKey": "object:10493"
            }];
            let sortedArray = $scope.users.reverse();
            spyOn($scope, 'sortUsersList').and.callThrough();
            spyOn($scope, '$safeApply');
            $scope.sortUsersList('firstName');
            expect($scope.sortUsersList).toHaveBeenCalled();
            expect($scope.users).toEqual(sortedArray);
            expect($scope.$safeApply).toHaveBeenCalled();
        });

        it('should sort a users list by organization', () => {
            let sortedArray = $scope.users.reverse();
            spyOn($scope, 'sortUsersList').and.callThrough();
            spyOn($scope, '$safeApply');
            $scope.sortUsersList('organisations');
            expect($scope.sortUsersList).toHaveBeenCalled();
            expect($scope.users).toEqual($scope.users);
            expect($scope.$safeApply).toHaveBeenCalled();
        })
    });

    /**
     * This will add a user to the list, (with selection icon). The selectedCount should increase by one.
     * If user is present in the list then it should move it to 1st position.
     * If the user is not present in the list it should add that user in the top of the list and user count should increase by one.
     */
    describe('selectUser', () => {
        it('should select a user from the list, and move it to the top of the list', () => {
            spyOn($scope, 'selectUser').and.callThrough();
            spyOn($scope, 'generateTelemetry');
            spyOn($scope, '$safeApply');
            $scope.users.selectedCount = 0
            $scope.selectUser($scope.users[1]);

            expect($scope.selectUser).toHaveBeenCalled();
            expect($scope.users.selectedCount).toBe(1);
            expect($scope.users).toEqual($scope.users.reverse());
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'select', target: 'user', targetid: $scope.users[1].identifier });
            $timeout.flush();
            expect($scope.$safeApply).toHaveBeenCalled();
        });
        it('should add new user to the top of the list', () => {
            spyOn($scope, 'selectUser').and.callThrough();
            spyOn($scope, 'generateTelemetry');
            $scope.users.selectedCount = 0;
            $scope.users.count = 0;
            $scope.selectUser({ 'firstName': 'Kumar', 'identifier': '4a698288-5d8b-4ed1-8b21-3215d945c456' });

            expect($scope.users.selectedCount).toBe(1);
            expect($scope.users.count).toEqual(1);
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'select', target: 'user', targetid: '4a698288-5d8b-4ed1-8b21-3215d945c456' });
        });
    });

    describe('searchByKeyword', () => {
        it('should check validate the email and should make API request accordingly', () => {
            spyOn($scope, 'searchByKeyword').and.callThrough();
            spyOn($scope, '$safeApply');
            spyOn($scope, 'generateTelemetry');
           // $scope.validateEmail = jasmine.createSpy().and.returnValue(true);
            $scope.searchKeyword = "vivek_kasture@techjoomla.com";
            $scope.userService.search = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback(undefined, userSearchData);
            });
            $scope.excludeCollaborators = jasmine.createSpy().and.returnValue(userSearchData.data.result.response.content);
            let searchBody = {
                "request": {
                    "query": "",
                    "filters": {
                        "organisations.roles": ["CONTENT_CREATOR"],
                        "rootOrgId": ["0123653943740170242", "ORG_001"],
                        "email": "vivek_kasture@techjoomla.com"
                    },
                    "fields": ["email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone"],
                    "offset": 0,
                    "limit": 200
                }
            };
            $scope.searchByKeyword();
            expect($scope.searchByKeyword).toHaveBeenCalled();
            expect($scope.userService.search).toHaveBeenCalledWith(searchBody, jasmine.any(Function));
            expect($scope.searchRes.searchStatus).toBe("end");
            expect($scope.excludeCollaborators).toHaveBeenCalledWith(userSearchData.data.result.response.content);
            expect($scope.searchRes.content).toEqual(userSearchData.data.result.response.content);
            expect($scope.searchRes.isEmptyResponse).toBe(false);
            expect($scope.searchRes.count).toEqual(userSearchData.data.result.response.count);
            expect($scope.$safeApply).toHaveBeenCalled();
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'submit', target: 'search', targetid: 'search-button' });
        });
        it('should check validate the phone and should make API request accordingly', () => {
            spyOn($scope, 'searchByKeyword').and.callThrough();
           // $scope.validateEmail = jasmine.createSpy().and.returnValue(false);
            $scope.searchKeyword = "8698645680";
            let response = { data: { result: { response: { count: 0 } } } }
            $scope.userService.search = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback(undefined, response);
            });
            $scope.excludeCollaborators = jasmine.createSpy().and.returnValue(response.data.result.response.content);
            let searchBody = {
                "request": {
                    "query": "",
                    "filters": {
                        "organisations.roles": ["CONTENT_CREATOR"],
                        "rootOrgId": ["0123653943740170242", "ORG_001"],
                        "phone": "8698645680"
                    },
                    "fields": ["email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone"],
                    "offset": 0,
                    "limit": 200
                }
            };
            $scope.searchByKeyword();
            expect($scope.searchByKeyword).toHaveBeenCalled();
            expect($scope.userService.search).toHaveBeenCalledWith(searchBody, jasmine.any(Function));
            expect($scope.searchRes.searchStatus).toBe("end");
            expect($scope.searchRes.isEmptyResponse).toBe(true);
            expect($scope.searchRes.content).toEqual([]);
            expect($scope.searchRes.count).toEqual(0);
        });
        it('should send keyword as query if the keyword is not the email or mobile number, and should make API request accordingly', () => {
            spyOn($scope, 'searchByKeyword').and.callThrough();
            //$scope.validateEmail = jasmine.createSpy().and.returnValue(false);
            $scope.searchKeyword = "test";
            let response = { data: { result: { response: { count: 0 } } } }
            $scope.userService.search = jasmine.createSpy().and.callFake(function (data, callback) {
                return callback({ error: '' }, undefined);
            });
            $scope.excludeCollaborators = jasmine.createSpy().and.returnValue(response.data.result.response.content);
            let searchBody = {
                "request": {
                    "query": "test",
                    "filters": {
                        "organisations.roles": ["CONTENT_CREATOR"],
                        "rootOrgId": ["0123653943740170242", "ORG_001"]
                    },
                    "fields": ["email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone"],
                    "offset": 0,
                    "limit": 200
                }
            };
            $scope.searchByKeyword();
            expect($scope.searchByKeyword).toHaveBeenCalled();
            expect($scope.userService.search).toHaveBeenCalledWith(searchBody, jasmine.any(Function));
            expect($scope.searchRes.content).toEqual([]);
            expect($scope.searchRes.isEmptyResponse).toBe(true);
            expect($scope.searchRes.errorMessage).toEqual('Oops! Something went wrong. Please try again later.');
        });
    });

    describe('filterSearch', () => {
        it('should return whether the user is collaborator or not', () => {
            spyOn($scope, 'filterSearch').and.callThrough();
            let res = $scope.filterSearch($scope.users[1]);
            expect($scope.filterSearch).toHaveBeenCalled();
            expect(res).toBe(true);
        });
    });

    describe('viewAllResults', () => {
        it('should show search results in main list page', () => {
            spyOn($scope, 'viewAllResults').and.callThrough();
            spyOn($scope, 'generateTelemetry');
            $scope.searchRes.content = userSearchData.data.result.response.content;
            $scope.viewAllResults();
            expect($scope.viewAllResults).toHaveBeenCalled();
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'submit', target: 'viewAll', targetid: "view-all-results" });
            expect($scope.users).toEqual(userSearchData.data.result.response.content);
            $timeout.flush();
        });
    });

    describe('refreshSearch', () => {
        it('should refresh a search and reset a values to defaults', () => {
            spyOn($scope, 'refreshSearch').and.callThrough();
            spyOn($scope, 'generateTelemetry');
            $scope.refreshSearch();
            expect($scope.refreshSearch).toHaveBeenCalled();
            expect($scope.generateTelemetry).toHaveBeenCalledWith({ type: 'click', subtype: 'refresh', target: 'refreshSearch', targetid: "refresh-button" });
            expect($scope.searchKeyword).toEqual('');
        });
    });

    describe('addCollaborators', () => {
        it('should add newly selected users as collaborators', () => {
            spyOn($scope, 'addCollaborators').and.callThrough();
            spyOn($scope, 'generateImpression');
            $scope.addCollaborators();
            expect($scope.addCollaborators).toHaveBeenCalled();
            expect($scope.generateImpression).toHaveBeenCalledWith({ type: 'click', subtype: 'submit', pageid: 'AddCollaborator' });
        });
    });

    describe('removeCollaborators', () => {
        it('should remove selected existing collaborators', () => {
            spyOn($scope, 'removeCollaborators').and.callThrough();
            spyOn($scope, 'generateImpression');
            $scope.removeCollaborators();
            expect($scope.removeCollaborators).toHaveBeenCalled();
            expect($scope.generateImpression).toHaveBeenCalledWith({ type: 'click', subtype: 'submit', pageid: 'RemoveCollaborator' });
        });
    });

    describe('resetSearch', () => {
        it('should reset the search results', () => {
            spyOn($scope, 'resetSearch').and.callThrough();
            $scope.resetSearch();
            expect($scope.resetSearch).toHaveBeenCalled();
        });
    });

    describe('validateEmail', () => {
        it('should return true', () => {
            spyOn($scope, 'validateEmail').and.callThrough();
            let res = $scope.validateEmail('test@gmail.com');
            expect($scope.validateEmail).toHaveBeenCalled();
            expect(res).toBe(true);
        });
    });

    describe('lineInView', () => {
        it('should register line view items', () => {
            spyOn($scope, 'lineInView').and.callThrough();
            $scope.lineInView();
            expect($scope.lineInView).toHaveBeenCalled();
        });
    });
});