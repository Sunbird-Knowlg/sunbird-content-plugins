describe("Sunbird header plugin:", function() {
    var manifest, ctrl, $scope, pluginInstance;
    beforeAll(function(done) {
        CollectionEditorTestFramework.init(function() {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.sunbirdcommonheader");
            path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/headerApp.js");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.sunbirdcommonheader");
            var templatePath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/headerTemplate.html");
            var controllerPath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/headerApp.js");
            var checkListTemplate = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/checkList.html");
            ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
            ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(checkListTemplate);
            ecEditor.getCurrentStage = jasmine.createSpy().and.callFake(function() {
                return { id: '5437859-543758937' }
            });
            ecEditor.getContext = jasmine.createSpy().and.callFake(function() {
                return "do_1143535346658585";
            });
            done();
        })
    })
    it('mock popup service', function(done) {
        angular.mock.module('oc.lazyLoad');
        angular.mock.module('Scope.safeApply');
        angular.mock.module('yaru22.angular-timeago');
        inject(function($ocLazyLoad, _$rootScope_, _$controller_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $ocLazyLoad.load([{
                type: 'js',
                path: path
            }]).then(function() {
                ctrl = $controller("headerController", {
                    $scope: $scope
                });
                $scope.closeThisDialog = jasmine.createSpy().and.callFake(function() {
                    console.log("POPUP CLOSED")
                })
                $scope.resolveReviewBtnStatus = jasmine.createSpy().and.callFake(function() {
                    return {}
                });
                done();
            }, function(error) {
                done();
            });
            setInterval(function() {
                _$rootScope_.$digest();
            }, 10);
        });
    });
    describe("Content rejection", function() {
        it("Should initialize the content-review popup", function(done) {
            spyOn($scope, "initPopup").and.callThrough();
            $scope.initPopup();
            expect($scope.initPopup).toHaveBeenCalled();
            ecEditor.dispatchEvent('org.ekstep.checklist:showpopup', { mode: 'publish' })
            done();
        });
        it("Should get the mode ex:review/publish", function(done) {
            ecEditor.addEventListener("org.ekstep.checklist:getMode", function(event, callback) {
                console.log("Event is dispatched")
                callback({ "mode": 'publish' });
            })
            spyOn($scope, "initPopup").and.callThrough();
            $scope.initPopup();
            expect($scope.initPopup).toHaveBeenCalled();
            expect($scope.checklistMode).not.toBe(undefined);
            expect($scope.checklistMode).toBe('publish');
            done();
        })
        it("Should get the configurations during controller init", function(done) {
            ecEditor.addEventListener("org.ekstep.checklist:getMode", function(event, callback) {
                console.log("Event is dispatched")
                callback({ "mode": 'reject' });
            })
            spyOn($scope, "initPopup").and.callThrough();
            $scope.initPopup();
            expect($scope.initPopup).toHaveBeenCalled();
            expect($scope.checklistMode).not.toBe(undefined);
            expect($scope.checklistMode).toBe('reject');
            expect($scope.checklistItems).not.toBe(undefined);
            done();
        })
        it("Checklist item should not be empty when state is publish/reject", function(done) {
            ecEditor.addEventListener("org.ekstep.checklist:getMode", function(event, callback) {
                console.log("Event is dispatched")
                callback({ "mode": 'read' });
            })
            spyOn($scope, "initPopup").and.callThrough();
            $scope.initPopup();
            expect($scope.initPopup).toHaveBeenCalled();
            expect($scope.checklistMode).not.toBe(undefined);
            expect($scope.checklistMode).toBe('read');
            expect($scope.checklistItems).not.toBe(undefined);
            // Need to check the dom
            setTimeout(function() {
                console.log('waiting over.');
                done();
            }, 100)
        })
        it("Should update the checklist onChange of field", function(done) {
            spyOn($scope, "onCheckboxSelect").and.callThrough();
            $scope.onCheckboxSelect("Inappropriate Title or Description");
            expect($scope.onCheckboxSelect).toHaveBeenCalled();
            expect($scope.checkedContents).not.toBe(undefined);
            expect($scope.checkedContents.length).not.toBe(0);
            done()
        })
        it("Should not update the checklist for invalid value", function(done) {
            $scope.checkedContents = [];
            spyOn($scope, "onCheckboxSelect").and.callThrough();
            $scope.onCheckboxSelect(null);
            expect($scope.onCheckboxSelect).toHaveBeenCalled();
            expect($scope.checkedContents).not.toBe(undefined);
            expect($scope.checkedContents.length).toBe(0);
            done()
        })
        it('Should invoke open checkList method', function(done) {
            ecEditor.addEventListener('org.ekstep.checklist:showpopup', function() {
                console.log("Popup event is invoked")
            })
            spyOn($scope, "openCheckList").and.callThrough();
            $scope.openCheckList('publish');
            expect($scope.openCheckList).toHaveBeenCalled();
            done();
        })
        it('Should invoke requestChanges', function(done) {
            $scope.checkedContents = ["one"];
            $scope.reviewComments = "improper";
            ecEditor.addEventListener('org.ekstep.contenteditor:reject', function(event, object) {
                console.log("reject event is invoked", object);
                expect(object.rejectReasons).not.toBe(undefined);
                expect(object.rejectComment).not.toBe(undefined);
                if (object.callback) { object.callback(undefined, {}) };
                done();
            })
            spyOn($scope, "requestChanges").and.callThrough();
            $scope.requestChanges();
            expect($scope.requestChanges).toHaveBeenCalled();
        })
        it('Should invoke publishContent', function(done) {
            $scope.publishChecklist = ["one"];
            $scope.publishComment = "Good";
            ecEditor.addEventListener('org.ekstep.contenteditor:publish', function(event, object) {
                console.log("Publish content event is invoked", object);
                expect(object.publishChecklist).not.toBe(undefined);
                //expect(object.publishComment).not.toBe(undefined);
                if (object.callback) { object.callback(undefined, {}) };
                done();
            })
            spyOn($scope, "publishContent").and.callThrough();
            $scope.publishContent();
            expect($scope.publishContent).toHaveBeenCalled();
            don()
        })

    })
    describe("Content save", function() {
        it("Should disable the save icon, Once the save is success", function(done) {
            spyOn($scope, "onSave").and.callThrough();
            $scope.onSave();
            expect($scope.onSave).toHaveBeenCalled();
            expect($scope.pendingChanges).not.toBe(undefined);
            expect($scope.pendingChanges).toBe(false);
            expect($scope.lastSaved).not.toBe(undefined);
            expect($scope.lastSaved).toBe(Date.now());
            done();
        });
        it('Should not disable the save button when save is failed', function(done) {
            ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, data) {
                data.callback && data.callback({}, undefined);
            })
            spyOn($scope, "saveContent").and.callThrough();
            $scope.saveContent();
            expect($scope.saveContent).toHaveBeenCalled();
            expect($scope.disableSaveBtn).not.toBe(undefined);
            expect($scope.disableSaveBtn).toBe(false);
            expect($scope.pendingChanges).not.toBe(undefined);
            expect($scope.pendingChanges).toBe(false);
            done();
        })
        it('Should invoke save content when env != `COLLECTION` ', function(done) {
            $scope.editorEnv = 'GENERIC_EDITOR'
            $scope.hideReviewBtn = true;
            ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, data) {
                data.callback && data.callback(undefined, { data: { responseCode: "OK" } });
            })
            spyOn($scope, "saveContent").and.callThrough();
            $scope.saveContent();
            expect($scope.saveContent).toHaveBeenCalled();
            expect($scope.hideReviewBtn).toBe(true);
            done();
        })
        it('Should invoke save content when env = `COLLECTION` ', function(done) {
            $scope.editorEnv = 'COLLECTION'
            $scope.hideReviewBtn = true;
            ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, data) {
                data.callback && data.callback(undefined, { data: { responseCode: "OK" } });
            })
            spyOn($scope, "saveContent").and.callThrough();
            $scope.saveContent();
            expect($scope.saveContent).toHaveBeenCalled();
            expect($scope.hideReviewBtn).toBe(false);
            done()
        })

    })

    describe("Content review", function() {
        it("Should open edit meta", function(done) {
            var contentMeta = { "code": "e4992e72-370a-49b5-8eb4-a17d065d5e0e", "subject": "Urdu", "channel": "b00bc992ef25f1a9a8d63291e20efc8d", "showNotification": true, "language": ["English"], "mimeType": "application/pdf", "medium": "Marathi", "idealScreenSize": "normal", "createdOn": "2018-05-02T11:13:25.099+0000", "gradeLevel": ["Class 1"], "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/6f00e56680fa722f16bd8a282480c786_1476254079786.jpeg", "appId": "dev.sunbird.portal", "contentDisposition": "inline", "artifactUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/assets/do_1124949266849792001142/pdf.pdf", "contentEncoding": "identity", "lastUpdatedOn": "2018-05-02T11:14:03.919+0000", "sYS_INTERNAL_LAST_UPDATED_ON": "2018-05-02T11:13:25.981+0000", "contentType": "Resource", "lastUpdatedBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "identifier": "do_1124949266849792001142", "audience": ["Learner"], "creator": "N. T. RAO . creator_org_001", "createdFor": ["ORG_001"], "visibility": "Default", "os": ["All"], "consumerId": "72e54829-6402-4cf0-888e-9b30733c1b88", "mediaType": "content", "osId": "org.ekstep.quiz.app", "languageCode": "en", "versionKey": "1525259643919", "idealScreenDensity": "hdpi", "framework": "NCF", "createdBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "compatibilityLevel": 1, "name": "UP", "board": "NCERT", "resourceType": "Study material", "status": "Draft" }
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta = jasmine.createSpy().and.callFake(function() {
                return contentMeta
            });
            ecEditor.addEventListener('org.ekstep.editcontentmeta:showpopup', function() {
                console.log("Content review popup is opened")
            })
            ecEditor.addEventListener("org.ekstep.toaster:error", function(event, object) {
                console.log(object.message)
            })
            ecEditor.getService(ServiceConstants.COLLECTION_SERVICE).getNodeById = jasmine.createSpy().and.callFake(function() {
                return { data: {} }
            });
            spyOn($scope, "sendForReview").and.callThrough();
            $scope.sendForReview();
            expect($scope.sendForReview).toHaveBeenCalled();
            done();
        });
        it("Should get the contentType before opening metadata form", function(done) {
            var contentMeta = { "code": "e4992e72-370a-49b5-8eb4-a17d065d5e0e", "subject": "Urdu", "channel": "b00bc992ef25f1a9a8d63291e20efc8d", "showNotification": true, "language": ["English"], "mimeType": "application/vnd.ekstep.content-collection", "medium": "Marathi", "idealScreenSize": "normal", "createdOn": "2018-05-02T11:13:25.099+0000", "gradeLevel": ["Class 1"], "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/6f00e56680fa722f16bd8a282480c786_1476254079786.jpeg", "appId": "dev.sunbird.portal", "contentDisposition": "inline", "artifactUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/assets/do_1124949266849792001142/pdf.pdf", "contentEncoding": "identity", "lastUpdatedOn": "2018-05-02T11:14:03.919+0000", "sYS_INTERNAL_LAST_UPDATED_ON": "2018-05-02T11:13:25.981+0000", "contentType": "Resource", "lastUpdatedBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "identifier": "do_1124949266849792001142", "audience": ["Learner"], "creator": "N. T. RAO . creator_org_001", "createdFor": ["ORG_001"], "visibility": "Default", "os": ["All"], "consumerId": "72e54829-6402-4cf0-888e-9b30733c1b88", "mediaType": "content", "osId": "org.ekstep.quiz.app", "languageCode": "en", "versionKey": "1525259643919", "idealScreenDensity": "hdpi", "framework": "NCF", "createdBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "compatibilityLevel": 1, "name": "UP", "board": "NCERT", "resourceType": "Study material", "status": "Draft" }
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta = jasmine.createSpy().and.callFake(function() {
                return contentMeta
            });
            spyOn($scope, "getContentType").and.callThrough();
            var contentType = $scope.getContentType();
            expect($scope.getContentType).toHaveBeenCalled();
            expect(contentType).not.toBe(undefined);
            done();
        });
        it('Should get the content type as `resource` when MimeType is other than collection', function(done) {
            var contentMeta = { "code": "e4992e72-370a-49b5-8eb4-a17d065d5e0e", "subject": "Urdu", "channel": "b00bc992ef25f1a9a8d63291e20efc8d", "showNotification": true, "language": ["English"], "mimeType": "application/pdf", "medium": "Marathi", "idealScreenSize": "normal", "createdOn": "2018-05-02T11:13:25.099+0000", "gradeLevel": ["Class 1"], "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/6f00e56680fa722f16bd8a282480c786_1476254079786.jpeg", "appId": "dev.sunbird.portal", "contentDisposition": "inline", "artifactUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/assets/do_1124949266849792001142/pdf.pdf", "contentEncoding": "identity", "lastUpdatedOn": "2018-05-02T11:14:03.919+0000", "sYS_INTERNAL_LAST_UPDATED_ON": "2018-05-02T11:13:25.981+0000", "contentType": "Resource", "lastUpdatedBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "identifier": "do_1124949266849792001142", "audience": ["Learner"], "creator": "N. T. RAO . creator_org_001", "createdFor": ["ORG_001"], "visibility": "Default", "os": ["All"], "consumerId": "72e54829-6402-4cf0-888e-9b30733c1b88", "mediaType": "content", "osId": "org.ekstep.quiz.app", "languageCode": "en", "versionKey": "1525259643919", "idealScreenDensity": "hdpi", "framework": "NCF", "createdBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "compatibilityLevel": 1, "name": "UP", "board": "NCERT", "resourceType": "Study material", "status": "Draft" }
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta = jasmine.createSpy().and.callFake(function() {
                return contentMeta
            });
            spyOn($scope, "getContentType").and.callThrough();
            var contentType = $scope.getContentType();
            expect($scope.getContentType).toHaveBeenCalled();
            expect(contentType).toBe('resource');
            done();
        })

    })
    describe("Content download", function() {
        it("Should download the content, when input a valid fileName and content Id", function(done) {
            var contentMeta = { "code": "e4992e72-370a-49b5-8eb4-a17d065d5e0e", "subject": "Urdu", "channel": "b00bc992ef25f1a9a8d63291e20efc8d", "showNotification": true, "language": ["English"], "mimeType": "application/vnd.ekstep.content-collection", "medium": "Marathi", "idealScreenSize": "normal", "createdOn": "2018-05-02T11:13:25.099+0000", "gradeLevel": ["Class 1"], "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/6f00e56680fa722f16bd8a282480c786_1476254079786.jpeg", "appId": "dev.sunbird.portal", "contentDisposition": "inline", "artifactUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/assets/do_1124949266849792001142/pdf.pdf", "contentEncoding": "identity", "lastUpdatedOn": "2018-05-02T11:14:03.919+0000", "sYS_INTERNAL_LAST_UPDATED_ON": "2018-05-02T11:13:25.981+0000", "contentType": "Resource", "lastUpdatedBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "identifier": "do_1124949266849792001142", "audience": ["Learner"], "creator": "N. T. RAO . creator_org_001", "createdFor": ["ORG_001"], "visibility": "Default", "os": ["All"], "consumerId": "72e54829-6402-4cf0-888e-9b30733c1b88", "mediaType": "content", "osId": "org.ekstep.quiz.app", "languageCode": "en", "versionKey": "1525259643919", "idealScreenDensity": "hdpi", "framework": "NCF", "createdBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "compatibilityLevel": 1, "name": "UP", "board": "NCERT", "resourceType": "Study material", "status": "Draft" }
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta = jasmine.createSpy().and.callFake(function() {
                return contentMeta
            });
            ecEditor.getService('content').downloadContent = function(id, fileName, cb) {
                if (id && fileName) {
                    cb(undefined, { data: { result: { ECAR_URL: "" }, responseCode: 'OK' } })
                }
            }
            spyOn($scope, "download").and.callThrough();
            $scope.download();
            expect($scope.download).toHaveBeenCalled();
            done();
        });
        it("Should not download the content, when input a Invalid fileName and content Id", function(done) {
            var contentMeta = { "code": "e4992e72-370a-49b5-8eb4-a17d065d5e0e", "subject": "Urdu", "channel": "b00bc992ef25f1a9a8d63291e20efc8d", "showNotification": true, "language": ["English"], "mimeType": "application/vnd.ekstep.content-collection", "medium": "Marathi", "idealScreenSize": "normal", "createdOn": "2018-05-02T11:13:25.099+0000", "gradeLevel": ["Class 1"], "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/6f00e56680fa722f16bd8a282480c786_1476254079786.jpeg", "appId": "dev.sunbird.portal", "contentDisposition": "inline", "artifactUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/assets/do_1124949266849792001142/pdf.pdf", "contentEncoding": "identity", "lastUpdatedOn": "2018-05-02T11:14:03.919+0000", "sYS_INTERNAL_LAST_UPDATED_ON": "2018-05-02T11:13:25.981+0000", "contentType": "Resource", "lastUpdatedBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "identifier": "do_1124949266849792001142", "audience": ["Learner"], "creator": "N. T. RAO . creator_org_001", "createdFor": ["ORG_001"], "visibility": "Default", "os": ["All"], "consumerId": "72e54829-6402-4cf0-888e-9b30733c1b88", "mediaType": "content", "osId": "org.ekstep.quiz.app", "languageCode": "en", "versionKey": "1525259643919", "idealScreenDensity": "hdpi", "framework": "NCF", "createdBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "compatibilityLevel": 1, "name": undefined, "board": "NCERT", "resourceType": "Study material", "status": "Draft" }
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta = jasmine.createSpy().and.callFake(function() {
                return contentMeta
            });
            ecEditor.getService('content').downloadContent = function(id, fileName, cb) {
                if (id && fileName) {
                    cb(undefined, { data: { result: { ECAR_URL: "" }, responseCode: 'OK' } })
                }
            }
            spyOn($scope, "download").and.callThrough();
            $scope.download();
            expect($scope.download).toHaveBeenCalled();
            done();
        });
        it("Should throw an error toaster when download content api is failed", function(done) {
            var contentMeta = { "code": "e4992e72-370a-49b5-8eb4-a17d065d5e0e", "subject": "Urdu", "channel": "b00bc992ef25f1a9a8d63291e20efc8d", "showNotification": true, "language": ["English"], "mimeType": "application/vnd.ekstep.content-collection", "medium": "Marathi", "idealScreenSize": "normal", "createdOn": "2018-05-02T11:13:25.099+0000", "gradeLevel": ["Class 1"], "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/6f00e56680fa722f16bd8a282480c786_1476254079786.jpeg", "appId": "dev.sunbird.portal", "contentDisposition": "inline", "artifactUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/assets/do_1124949266849792001142/pdf.pdf", "contentEncoding": "identity", "lastUpdatedOn": "2018-05-02T11:14:03.919+0000", "sYS_INTERNAL_LAST_UPDATED_ON": "2018-05-02T11:13:25.981+0000", "contentType": "Resource", "lastUpdatedBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "identifier": "do_1124949266849792001142", "audience": ["Learner"], "creator": "N. T. RAO . creator_org_001", "createdFor": ["ORG_001"], "visibility": "Default", "os": ["All"], "consumerId": "72e54829-6402-4cf0-888e-9b30733c1b88", "mediaType": "content", "osId": "org.ekstep.quiz.app", "languageCode": "en", "versionKey": "1525259643919", "idealScreenDensity": "hdpi", "framework": "NCF", "createdBy": "6d4da241-a31b-4041-bbdb-dd3a898b3f85", "compatibilityLevel": 1, "name": "UP", "board": "NCERT", "resourceType": "Study material", "status": "Draft" }
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta = jasmine.createSpy().and.callFake(function() {
                return contentMeta
            });
            ecEditor.addEventListener('org.ekstep.toaster:error', function(event, data) {
                console.error("Error:", data.message);
            })
            ecEditor.getService('content').downloadContent = function(id, fileName, cb) {
                if (id && fileName) {
                    cb({}, undefined)
                }
            }
            spyOn($scope, "download").and.callThrough();
            $scope.download();
            expect($scope.download).toHaveBeenCalled();
            done();
        })
    })
    describe("Content Upload", function() {
        it("Should invoke upload and dispatch an upload form event", function(done) {
            ecEditor.addEventListener('org.ekstep.uploadcontent:show', function(event, data) {
                console.log("Upload content event is dispatched")
            })
            spyOn($scope, "upload").and.callThrough();
            $scope.upload();
            expect($scope.upload).toHaveBeenCalled();
            done();
        });
        it("Should show an uploadForm", function(done) {
            ecEditor.getContext = jasmine.createSpy().and.callFake(function() {
                return undefined;
            });
            ecEditor.addEventListener('org.ekstep.uploadcontent:show', function(event, data) {
                console.log("Upload content event is dispatched")
            })
            spyOn($scope, "showUploadForm").and.callThrough();
            $scope.showUploadForm();
            expect($scope.showUploadForm).toHaveBeenCalled();
            done();
        })
    })
    describe("Telemetry", function() {
        it("Should invoke generate telemetry when data is passed", function(done) {
            spyOn($scope, 'generateTelemetry').and.callThrough();
            $scope.generateTelemetry(undefined);
            expect($scope.generateTelemetry).toHaveBeenCalled();
            done()
        });
        it("Should not generate telemetry when data is not passed", function(done) {
            spyOn($scope, 'generateTelemetry').and.callThrough();
            $scope.generateTelemetry({});
            expect($scope.generateTelemetry).toHaveBeenCalled();
            done()
        })
    })
    describe("Update Title", function() {
        it("Should update the header title, when proper value is passed", function(done) {
            var title = 'Untitled';
            spyOn($scope, 'updateTitle').and.callThrough();
            $scope.updateTitle("", title);
            expect($scope.updateTitle).toHaveBeenCalled();
            expect($scope.contentDetails.contentTitle).not.toBe(undefined);
            expect($scope.contentDetails.contentTitle).toBe(title);
            expect(document.title).not.toBe(undefined);
            expect(document.title).toBe(title);
            done()
        });
        it("Should not update the header title, when improper data is passed", function(done) {
            $scope.contentDetails.contentTitle = "TextBook";
            document.title = 'TextBook';
            var title = undefined;
            spyOn($scope, 'updateTitle').and.callThrough();
            $scope.updateTitle("", title);
            expect($scope.updateTitle).toHaveBeenCalled();
            expect($scope.contentDetails.contentTitle).toBe("TextBook");
            expect($scope.contentDetails.contentTitle).not.toBe(undefined);
            expect(document.title).toBe("TextBook");
            expect(document.title).not.toBe(undefined);
            done()
        });
    })
    describe("Update Icon", function() {
        it("Should update the header icon, when proper value is passed", function(done) {
            var icon = 'a.png';
            spyOn($scope, 'updateIcon').and.callThrough();
            $scope.updateIcon("", icon);
            expect($scope.updateIcon).toHaveBeenCalled();
            expect($scope.contentDetails.contentImage).not.toBe(undefined);
            expect($scope.contentDetails.contentImage).toBe(icon);
            done()
        });
        it("Should not update the header icon, when improper data is passed", function(done) {
            $scope.contentDetails.contentImage = "a.png";
            var icon = undefined;
            spyOn($scope, 'updateIcon').and.callThrough();
            $scope.updateIcon("", icon);
            expect($scope.updateIcon).toHaveBeenCalled();
            expect($scope.contentDetails.contentImage).toBe("a.png");
            expect($scope.contentDetails.contentImage).not.toBe(undefined);
            done()
        });
    });
    describe("Set Pending changes", function() {
        it("Should set the pendingChanges to false when env is collection and mode is read", function(done) {
            $scope.editorEnv = "COLLECTION";
            ecEditor.getConfig = jasmine.createSpy().and.callFake(function() {
                return { mode: 'Read' };
            });
            spyOn($scope, 'setPendingChangingStatus').and.callThrough();
            $scope.setPendingChangingStatus();
            expect($scope.setPendingChangingStatus).toHaveBeenCalled();
            expect($scope.pendingChanges).toBe(false);
            expect($scope.disableSaveBtn).toBe(false);
            done();
        })
        it("Should set the pendingChanges to true when env is other than collection and mode is edit", function(done) {
            $scope.editorEnv = "Editor";
            ecEditor.getConfig = jasmine.createSpy().and.callFake(function() {
                return { mode: 'Edit' };
            });
            spyOn($scope, 'setPendingChangingStatus').and.callThrough();
            $scope.setPendingChangingStatus();
            expect($scope.setPendingChangingStatus).toHaveBeenCalled();
            expect($scope.pendingChanges).toBe(true);
            expect($scope.disableSaveBtn).toBe(false);
            done();
        })
    })
    describe("SetEditorDetail", function() {
        it('Should invoke setEditor details and set editor env to ecml,When mime type is ecml mimeType', function(done) {
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta = jasmine.createSpy().and.callFake(function(done) {
                return { mimeType: 'application/vnd.ekstep.ecml-archive' }
            })
            spyOn($scope, 'setEditorDetails').and.callThrough();
            $scope.setEditorDetails();
            expect($scope.setEditorDetails).toHaveBeenCalled();
            expect($scope.editorEnv).toBe('ECML');
            expect($scope.editorEnv).not.toBe(undefined);
            done();
        })
        it('Should invoke setEditor details and set editor env to Collection, When mime type is collection mimeType', function(done) {
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta = jasmine.createSpy().and.callFake(function(done) {
                return { mimeType: 'application/vnd.ekstep.content-collection' }
            })
            ecEditor.getConfig = jasmine.createSpy().and.callFake(function() {
                return { mode: 'Read' };
            });
            spyOn($scope, 'setEditorDetails').and.callThrough();
            $scope.setEditorDetails();
            expect($scope.setEditorDetails).toHaveBeenCalled();
            expect($scope.editorEnv).toBe('COLLECTION');
            expect($scope.editorEnv).not.toBe(undefined);
            done();
        })
        it("should hide the `Show edit meta` link in the header plugin, when mode is `READ`", function(done) {
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta = jasmine.createSpy().and.callFake(function(done) {
                return { mimeType: 'application/vnd.ekstep.content-collection' }
            })
            ecEditor.getConfig = jasmine.createSpy().and.callFake(function() {
                return { mode: 'Read' };
            });
            spyOn($scope, 'setEditorDetails').and.callThrough();
            $scope.setEditorDetails();
            expect($scope.setEditorDetails).toHaveBeenCalled();
            expect($scope.editorEnv).toBe('COLLECTION');
            expect($scope.editorEnv).not.toBe(undefined);
            expect($scope.showEditMeta).toBe(false);
            expect($scope.showEditMeta).not.toBe(undefined);
            done();
        })
    })
    describe('General methods', function() {
        it('should dispatch an event when preview content is invoked', function(done) {
            ecEditor.addEventListener('org.ekstep.contenteditor:preview', function(event, data) {
                console.log("Content preview is invoked");
            })
            org.ekstep.contenteditor.stageManager = {};
            org.ekstep.contenteditor.stageManager.toECML = jasmine.createSpy().and.callFake(function() {
                return { mode: 'Read' };
            });
            spyOn($scope, 'previewContent').and.callThrough();
            $scope.previewContent();
            expect($scope.previewContent).toHaveBeenCalled();
            done();
        });
        it("Should dispatch dynamic form event, when editmeta is inovked", function(done) {
            var config = { "dispatcher": "console", "pluginRepo": "http://localhost:9876/base", "corePluginsPackaged": false, "plugins": [{ "id": "org.ekstep.sunbirdcommonheader", "ver": "1.4", "type": "plugin" }], "keywordsLimit": 500, "editorConfig": { "mode": "Edit", "contentStatus": "draft", "rules": { "levels": 7, "objectTypes": [{ "type": "TextBook", "label": "Textbook", "isRoot": true, "editable": true, "childrenTypes": ["TextBookUnit"], "addType": "Editor", "iconClass": "fa fa-book" }, { "type": "TextBookUnit", "label": "Textbook Unit", "isRoot": false, "editable": true, "childrenTypes": ["TextBookUnit", "Collection", "Content"], "addType": "Editor", "iconClass": "fa fa-folder-o" }, { "type": "Collection", "label": "Collection", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file-o" }, { "type": "Content", "label": "Content", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file-o" }] }, "defaultTemplate": {} } }
            ecEditor.getConfig = jasmine.createSpy().and.callFake(function() {
                return config
            });
            ecEditor.addEventListener('org.ekstep.editcontentmeta:showpopup', function(event, data) {
                console.log("Meta form is invoked");
                expect(data.action).toBe('save');
                expect(data.popup).toBe(true);
                expect(data.framework).not.toBe(undefined);
                expect(data.rootOrgId).not.toBe(undefined);
                expect(data.editMode).not.toBe(undefined);
                expect(data.subType).not.toBe(undefined);
            })
            spyOn($scope, 'editContentMeta').and.callThrough();
            $scope.editContentMeta();
            expect($scope.editContentMeta).toHaveBeenCalled();
            done();
        })
    })


})