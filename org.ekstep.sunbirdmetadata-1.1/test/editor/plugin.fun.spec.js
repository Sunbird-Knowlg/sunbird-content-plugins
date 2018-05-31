/**
 * compatibility check for editor v3.2.0 with topic picker v1.0
 * TODO: Need to put this code back to 1.1 version of the sunbird metadata plugin
 */
describe("compatibility check `org.ekstep.sunbirdmetdata-1.1` with ` Editor 3.2.0`", function() {
    var pluginInstance;
    beforeAll(function(callback) {
        jQuery("body").append($("<script type='text/javascript' src='https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/collection-editor/scripts/collectioneditor.min.js'>"));
        setTimeout(function() {
            CollectionEditorTestFramework.init(function() {
                pluginInstance = ecEditor.instantiatePlugin("org.ekstep.sunbirdmetadata");
                callback();
            });
        }, 1000)

    });


    describe('Plugin initialization', function() {
        it('Should register the events', function(done) {
            spyOn(pluginInstance, "initialize").and.callThrough();
            pluginInstance.initialize()
            expect(pluginInstance.initialize).toHaveBeenCalled();
            expect(ecEditor.hasEventListener('editor:form:cancel')).toBe(true);
            expect(ecEditor.hasEventListener('editor:form:success')).toBe(true);
            expect(ecEditor.hasEventListener('editor:form:change')).toBe(true);
            expect(ecEditor.hasEventListener('org.ekstep.editcontentmeta:showpopup')).toBe(true);
            expect(ecEditor.hasEventListener('editor:form:reset')).toBe(true);
            done();
        });

    });
    describe('Plugin invoke', function() {
        xit('It should invoke the plugin when `org.ekstep.editcontentmeta:showpopup` event is dispatched', function(done) {
            ecEditor.dispatchEvent('org.ekstep.editcontentmeta:showpopup', { model: {}, editMode: true });
            expect(pluginInstance.model).not.toBe(undefined);
            expect(pluginInstance.editMode).toBe(true);
            done()
        });
        it('It should render the form with configurations, On invoke of plugin with valid configurations', function(done) {
            var formConfig = {
                "templateName": "defaultTemplate",
                "action": "save",
                "fields": [{
                        "code": "description",
                        "dataType": "text",
                        "description": "Brief description",
                        "editable": true,
                        "inputType": "textarea",
                        "label": "Description",
                        "name": "Description",
                        "placeholder": "Description",
                        "renderingHints": {},
                        "required": true,
                        "visible": true
                    },
                    {
                        "code": "keywords",
                        "dataType": "list",
                        "description": "Keywords for the content",
                        "editable": true,
                        "inputType": "keywordsuggestion",
                        "label": "keywords",
                        "name": "Keywords",
                        "placeholder": "Enter Keywords",
                        "required": true,
                        "visible": true
                    }
                ]
            };
            var frameworkConfig = {
                "owner": "in.ekstep",
                "identifier": "NCFCOPY",
                "code": "NCFCOPY",
                "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                "channel": "in.ekstep",
                "description": "NCFCOPY framework.",
                "type": "K-12",
                "createdOn": "2018-01-23T17:07:56.405+0000",
                "versionKey": "1523427539160",
                "appId": "qa.ekstep.genie",
                "name": "NCF framework",
                "lastUpdatedOn": "2018-04-11T06:18:59.160+0000",
                "categories": [{
                    "identifier": "ncfcopy_topic",
                    "code": "topic",
                    "terms": [{
                            "identifier": "ncfcopy_topic_topic1",
                            "code": "topic1",
                            "name": "Topic 1",
                            "description": "Topic 1",
                            "index": 1,
                            "category": "topic",
                            "status": "Live"
                        },
                        {
                            "identifier": "ncfcopy_topic_topic2",
                            "code": "topic2",
                            "name": "Topic 2",
                            "description": "Topic 2",
                            "index": 2,
                            "category": "topic",
                            "status": "Live"
                        }
                    ],
                    "name": "Topic",
                    "description": "Topic",
                    "index": 6,
                    "status": "Live"
                }],
                "status": "Live"
            }
            var responseObj = {
                resourceBundle: undefined,
                framework: { data: { result: { framework: frameworkConfig } } },
                config: { data: { result: { form: { data: formConfig } } } }
            };
            pluginInstance.getConfigurations = jasmine.createSpy().and.callFake(function(request, callback) {
                callback(undefined, responseObj)
            });
            pluginInstance.loadTemplate = jasmine.createSpy().and.callFake(function(defaultTemplate, callback) {
                callback()
            })
            pluginInstance.invoke('', { model: {}, editMode: true, subType: 'textbook', action: "save" })
            expect(pluginInstance.mappedResponse).not.toBe(undefined);
            expect(pluginInstance.resourceBundle).toBe(undefined);
            expect(pluginInstance.framework).not.toBe(undefined);
            expect(pluginInstance.config).not.toBe(undefined);
            expect(pluginInstance.form).not.toBe(undefined);
            done()
        });
        it('When configurations are exists then it should fetch the config from local cache', function(done) {
            var key1 = 'textbook',
                key2 = 'save';
            expect(pluginInstance.isConfigurationsExists(key1, key2)).toBe(true);
            expect(pluginInstance.config).not.toBe(undefined);
            var configurations = pluginInstance.getMappedResponse('textbook', 'save');
            expect(configurations).not.toBe(undefined);
            expect(configurations.framework).not.toBe(undefined);
            expect(configurations.formConfig).not.toBe(undefined);
            done()
        });
        it('When invalid key passed, It should not fetch the config from cache', function(done) {
            var key1 = 'collection',
                key2 = 'review';
            expect(pluginInstance.isConfigurationsExists(key1, key2)).toBe(false);
            var configurations = pluginInstance.getMappedResponse(key1, key2);
            expect(configurations).toBe(undefined);
            done()
        })
        xit('Should throw an error, When invalid configurations are passed', function(done) {
            try {
                pluginInstance.invoke('', undefined);
            } catch (e) {
                expect(e).not.toBe(undefined);
                expect(e).toBe('Invalid config data');
                done()
            }
        });
    });

    describe('From success action', function() {
        describe('Form review', function() {
            it('When valid configurations are passed', function(done) {
                pluginInstance.config.action = 'review';
                var callbackFn = function(err, resp) {
                    done()
                }
                var data = {
                    formData: {
                        metaData: {
                            mimeType: 'application/vnd.ekstep.ecml-archive',
                            name: "My first book",
                            gradeLevel: ['Grade1']
                        }
                    },
                    isValid: true,
                    callback: callbackFn
                }
                ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, metadata) {
                    expect(metadata).not.toBe(undefined);
                    expect(metadata.callback).not.toBe(undefined);
                    expect(metadata.contentMeta).not.toBe(undefined);
                    expect(metadata.contentMeta.gradeLevel).not.toBe(undefined);
                    expect(metadata.contentMeta.name).not.toBe(undefined);
                    expect(metadata.contentMeta.mimeType).not.toBe(undefined);
                    metadata.callback(undefined, {})

                })
                ecEditor.addEventListener('org.ekstep.contenteditor:review', function(event, reviewFn) {
                    expect(reviewFn).not.toBe(undefined);
                    reviewFn(undefined, {});
                })
                ecEditor.addEventListener('org.ekstep.collectioneditor:content:notfound', function(event, reviewFn) {
                    console.log('Content close is invoked');
                })
                pluginInstance.successAction('', data);

            });
            it('When invalid configurations(Metadata is not available) are passed,Should throw an error', function(done) {
                pluginInstance.config.action = 'review';
                var callbackFn = function(err, resp) {
                    done()
                }
                var data = {
                    formData: {},
                    isValid: false,
                    callback: callbackFn
                }
                ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, metadata) {
                    expect(metadata).not.toBe(undefined);
                    expect(metadata.callback).not.toBe(undefined);
                    expect(metadata.contentMeta).not.toBe(undefined);
                    expect(metadata.contentMeta.gradeLevel).not.toBe(undefined);
                    expect(metadata.contentMeta.name).not.toBe(undefined);
                    expect(metadata.contentMeta.mimeType).not.toBe(undefined);
                    metadata.callback(undefined, {})

                })
                ecEditor.addEventListener('org.ekstep.contenteditor:review', function(event, reviewFn) {
                    expect(reviewFn).not.toBe(undefined);
                    reviewFn(undefined, {});
                })
                ecEditor.addEventListener('org.ekstep.collectioneditor:content:notfound', function(event, reviewFn) {
                    console.log('Content close is invoked');
                })
                try {
                    pluginInstance.successAction('', data);
                } catch (e) {
                    expect(e).not.toBe(undefined);
                    expect(e).toBe('Invalid form data');
                    done();
                }
            })
            it('When form data is undefined, Should throw an error', function(done) {
                pluginInstance.config.action = 'review';
                var callbackFn = function(err, resp) {
                    done()
                }
                var data = {
                    formData: undefined,
                    isValid: true,
                    callback: callbackFn
                }
                ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, metadata) {
                    expect(metadata).not.toBe(undefined);
                    expect(metadata.callback).not.toBe(undefined);
                    expect(metadata.contentMeta).not.toBe(undefined);
                    expect(metadata.contentMeta.gradeLevel).not.toBe(undefined);
                    expect(metadata.contentMeta.name).not.toBe(undefined);
                    expect(metadata.contentMeta.mimeType).not.toBe(undefined);
                    metadata.callback(undefined, {})

                })
                ecEditor.addEventListener('org.ekstep.contenteditor:review', function(event, reviewFn) {
                    expect(reviewFn).not.toBe(undefined);
                    reviewFn(undefined, {});
                })
                ecEditor.addEventListener('org.ekstep.collectioneditor:content:notfound', function(event, reviewFn) {
                    //console.log('Content close is invoked');
                })
                try {
                    pluginInstance.successAction('', data);
                } catch (e) {
                    expect(e).not.toBe(undefined);
                    expect(e).toBe('Invalid form data');
                    done();
                }
            })
            it('When content type is collection, Should review the content', function(done) {
                pluginInstance.config.action = 'review';
                var callbackFn = function(err, resp) {
                    expect(org.ekstep.services.stateService).not.toBe(undefined);
                    expect(org.ekstep.services.stateService.getState('nodesModified')).not.toBe(undefined);
                    done()
                }
                var data = {
                    formData: {
                        metaData: {
                            mimeType: 'application/vnd.ekstep.content-collection',
                            name: "My first book",
                            gradeLevel: ['Grade1']
                        }
                    },
                    isValid: true,
                    callback: callbackFn
                }
                ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, metadata) {
                    expect(metadata).not.toBe(undefined);
                    expect(metadata.callback).not.toBe(undefined);
                    expect(metadata.contentMeta).not.toBe(undefined);
                    expect(metadata.contentMeta.gradeLevel).not.toBe(undefined);
                    expect(metadata.contentMeta.name).not.toBe(undefined);
                    expect(metadata.contentMeta.mimeType).not.toBe(undefined);
                    metadata.callback(undefined, {})

                })
                ecEditor.addEventListener('org.ekstep.contenteditor:review', function(event, reviewFn) {
                    expect(reviewFn).not.toBe(undefined);
                    reviewFn(undefined, {});
                })
                ecEditor.addEventListener('org.ekstep.collectioneditor:content:notfound', function(event, reviewFn) {
                    console.log('Content close is invoked');
                })
                pluginInstance.successAction('', data);
            })
        });
        describe('From meta save', function() {
            it('When valid configurations are passed', function(done) {
                pluginInstance.config.action = 'save';
                var callbackFn = function(err, resp) {
                    done()
                }
                var data = {
                    formData: {
                        metaData: {
                            mimeType: 'application/vnd.ekstep.ecml-archive',
                            name: "My first book",
                            gradeLevel: ['Grade1']
                        }
                    },
                    isValid: true,
                    callback: callbackFn
                }
                ecEditor.addEventListener('org.ekstep.contenteditor:save:meta', function(event, metadata) {
                    expect(metadata).not.toBe(undefined);
                    expect(metadata.callback).not.toBe(undefined);
                    expect(metadata.contentMeta).not.toBe(undefined);
                    expect(metadata.contentMeta.gradeLevel).not.toBe(undefined);
                    expect(metadata.contentMeta.name).not.toBe(undefined);
                    expect(metadata.contentMeta.mimeType).not.toBe(undefined);
                    metadata.callback(undefined, {})

                })
                pluginInstance.successAction('', data);

            });
            it('When invalid configurations are passed', function(done) {
                pluginInstance.config.action = 'save';
                var callbackFn = function(err, resp) {
                    done()
                }
                var data = {
                    formData: {
                        metaData: undefined
                    },
                    isValid: true,
                    callback: callbackFn
                }
                ecEditor.addEventListener('org.ekstep.contenteditor:save:meta', function(event, metadata) {
                    expect(metadata).not.toBe(undefined);
                    expect(metadata.callback).not.toBe(undefined);
                    expect(metadata.contentMeta).not.toBe(undefined);
                    expect(metadata.contentMeta.gradeLevel).not.toBe(undefined);
                    expect(metadata.contentMeta.name).not.toBe(undefined);
                    expect(metadata.contentMeta.mimeType).not.toBe(undefined);
                    metadata.callback(undefined, {})

                })
                try {
                    pluginInstance.successAction('', data);
                } catch (e) {
                    expect(e).not.toBe(undefined);
                    expect(e).toBe('Invalid form data')
                }

            });
            it('When content type is collection, It should update the state of the content', function(done) {
                pluginInstance.config.action = 'save';
                var callbackFn = function(err, resp) {
                    expect(org.ekstep.services.stateService).not.toBe(undefined);
                    expect(org.ekstep.services.stateService.getState('nodesModified')).not.toBe(undefined);
                    done()
                }
                var data = {
                    formData: {
                        metaData: {
                            mimeType: 'application/vnd.ekstep.content-collection',
                            name: "My first book",
                            gradeLevel: ['Grade1']
                        }
                    },
                    isValid: true,
                    callback: callbackFn
                }
                ecEditor.addEventListener('org.ekstep.contenteditor:save:meta', function(event, metadata) {
                    expect(metadata).not.toBe(undefined);
                    expect(metadata.callback).not.toBe(undefined);
                    expect(metadata.contentMeta).not.toBe(undefined);
                    expect(metadata.contentMeta.gradeLevel).not.toBe(undefined);
                    expect(metadata.contentMeta.name).not.toBe(undefined);
                    expect(metadata.contentMeta.mimeType).not.toBe(undefined);
                    metadata.callback(undefined, {})
                })
                pluginInstance.successAction('', data);
            })
        });
        describe('Other than `save` and `review`', function() {
            it('Should dispatch an form data', function(done) {
                pluginInstance.config.action = 'question-save';
                var data = {
                    formData: {
                        metaData: {
                            mimeType: 'application/vnd.ekstep.ecml-archive',
                            name: "My first book",
                            gradeLevel: ['Grade1']
                        }
                    },
                    isValid: true,
                }
                ecEditor.addEventListener('editor:form:data', function(event, data) {
                    expect(data).not.toBe(undefined);
                    done();
                });
                try {
                    pluginInstance.successAction('', data);
                } catch (e) {
                    expect(e).toBe(undefined);
                    done();
                }
            });
        })
    })
    describe('Content save', function() {
        it('Should save the `ECML` type content', function(done) {
            var contentMeta = { mimeType: 'application/vnd.ekstep.ecml-archive', name: "My first book", gradeLevel: ['Grade1'] };
            ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, metadata) {
                expect(metadata).not.toBe(undefined);
                expect(metadata.callback).not.toBe(undefined);
                expect(metadata.contentMeta).not.toBe(undefined);
                if (metadata.callback) {
                    metadata.callback();
                }
            });
            pluginInstance.saveContent(contentMeta, function() {
                done();
            });

        });
        it('Should save the `COLLECTION` type content', function(done) {
            var contentMeta = { name: 'Untitled-Collection', mimeType: 'application/vnd.ekstep.content-collection', gradeLevel: ['Grade1'] };
            ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, metadata) {
                expect(metadata).not.toBe(undefined);
                expect(metadata.callback).not.toBe(undefined);
                expect(metadata.contentMeta).not.toBe(undefined);
                if (metadata.callback) {
                    metadata.callback();
                }
            });
            pluginInstance.saveContent(contentMeta, function() {
                done();
            });
        })
        it('When content type neither `ECML` nor `COLLECTION`, It should save the content', function(done) {
            var contentMeta = { name: 'Untitled', mimeType: 'application/vnd.ekstep.html-archive', gradeLevel: ['Grade1'] };
            var callbackFn = function() {
                done();
            }
            ecEditor.addEventListener('org.ekstep.contenteditor:save', function(event, metadata) {
                expect(metadata).not.toBe(undefined);
                expect(metadata.callback).not.toBe(undefined);
                if (metadata.callback) {
                    metadata.callback();
                }
            });
            pluginInstance.saveContent(contentMeta, callbackFn);
        });
        it('Should throw an error, When content meta is not defined', function(done) {
            try {
                pluginInstance.saveContent(contentMeta, function() {
                    done();
                });
            } catch (e) {
                expect(e).not.toBe(undefined);
                done();
            }
        })
    });
})