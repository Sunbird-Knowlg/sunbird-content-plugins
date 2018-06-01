/**
 * compatibility check for editor v3.2.0 with topic picker v1.0
 */
describe("compatibility check `Topic selector-1.0` with ` Editor 3.2.0`", function() {
    var pluginInstance, manifest;
    beforeAll(function(callback) {
        jQuery("body").append($("<script type='text/javascript' src='https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/collection-editor/scripts/collectioneditor.min.js'>"));
        setTimeout(function() {
            CollectionEditorTestFramework.init(function() {
                manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.topicselector");
                pluginInstance = ecEditor.instantiatePlugin("org.ekstep.topicselector");
                callback();
            });
        }, 1000)
    });
    it('It should invoke framework api', function(done) {
        org.ekstep.services.config.apislug = 'https://dev.ekstep.in/api'
        var frameworkId = 'NCFCOPY';
        org.ekstep.services.iService.requestHeaders = {
            "headers": {
                "content-type": "application/json",
                "user-id": "content-editor",
                "Authorization": ""
            }
        };
        ecEditor.getService(ServiceConstants.META_SERVICE).getCategorys(frameworkId, function(error, response) {
            expect(response).not.toBe(undefined);
            expect(error).toBe(undefined)
            done()
        })
    })

    describe('Should invoke initData', function() {

        it('When selected topics are empty, it should show the topic tree', function(done) {
            spyOn(pluginInstance, "initData").and.callThrough();
            pluginInstance.initData('', {
                "element": "defaultTemplate-topic",
                "selectedTopics": []
            });
            expect(pluginInstance.initData).toHaveBeenCalled();
            expect(pluginInstance.isTopicPopupOpened).toBe(true)
            done()
        });

        it('When category is undefined,popup should be closed', function(done) {
            spyOn(pluginInstance, "initData").and.callThrough();
            pluginInstance.initData('', undefined);
            expect(pluginInstance.initData).toHaveBeenCalled();
            expect(pluginInstance.isTopicPopupOpened).toBe(false)
            done()
        })
        xit('When category is undefined,popup should be closed', function(done) {
            spyOn(pluginInstance, "initData").and.callThrough();
            pluginInstance.initData('', undefined);
            expect(pluginInstance.initData).toHaveBeenCalled();
            expect(pluginInstance.isTopicPopupOpened).toBe(false)
            done()
        })
    })

    describe('Get filters', function() {
        it('It should get topic data,When valid data is passed', function(done) {
            var data = {
                "associations": [{
                        "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_36",
                        "code": "environmentalstudies_l1Con_36",
                        "name": "The Valley Of Flowers - Uttaranchal",
                        "description": "The Valley Of Flowers - Uttaranchal",
                        "category": "topic",
                        "status": "Live"
                    },
                    {
                        "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_31",
                        "code": "environmentalstudies_l1Con_31",
                        "name": "Train Journey ",
                        "description": "Train Journey ",
                        "category": "topic",
                        "status": "Live"
                    }
                ],
                "field": {
                    "code": "gradeLevel",
                    "dataType": "list",
                    "description": "Level",
                    "editable": true,
                    "index": 6,
                    "inputType": "multiselect",
                    "label": "Grade Level",
                    "name": "Level",
                    "placeholder": "Select Grade",
                    "required": true,
                    "visible": true,
                    "depends": [
                        "topics"
                    ],
                    "range": [{
                        "identifier": "cmd_fw_16_gradelevel_class9",
                        "code": "class9",
                        "name": "Class 9",
                        "description": "Class 9",
                        "index": 4,
                        "category": "gradeLevel",
                        "status": "Live",
                        "$$hashKey": "object:155"
                    }],
                    "$$hashKey": "object:120"
                }
            }
            spyOn(pluginInstance, "getFilters").and.callThrough();
            pluginInstance.getFilters('', data);
            expect(pluginInstance.getFilters).toHaveBeenCalled();
            expect(pluginInstance.topicData).not.toBe(undefined);
            done()
        })
        it('When undefined data is passed, topic data should be undefined', function(done) {
            spyOn(pluginInstance, "getFilters").and.callThrough();
            pluginInstance.getFilters('', undefined);
            expect(pluginInstance.getFilters).toHaveBeenCalled();
            expect(pluginInstance.topicData.length).toBe(0);
            done()
        })
        it('When associations are not available, It should get the  empty filter values', function(done) {
            var data = {
                "associations": undefined,
                "field": {
                    "code": "gradeLevel",
                    "dataType": "list",
                    "description": "Level",
                    "editable": true,
                    "index": 6,
                    "inputType": "multiselect",
                    "label": "Grade Level",
                    "name": "Level",
                    "placeholder": "Select Grade",
                    "required": true,
                    "visible": true,
                    "depends": [
                        "topics"
                    ],
                    "range": [{
                        "identifier": "cmd_fw_16_gradelevel_class9",
                        "code": "class9",
                        "name": "Class 9",
                        "description": "Class 9",
                        "index": 4,
                        "category": "gradeLevel",
                        "status": "Live",
                        "$$hashKey": "object:155"
                    }],
                    "$$hashKey": "object:120"
                }
            }
            spyOn(pluginInstance, "getFilters").and.callThrough();
            pluginInstance.getFilters('', data);
            expect(pluginInstance.getFilters).toHaveBeenCalled();
            expect(pluginInstance.topicData).not.toBe(undefined);
            expect(pluginInstance.topicData.length).toBe(0);
            done()
        })
        it('When fields are not present, topic data should not be empty', function(done) {
            var data = {
                "associations": undefined,
                "field": {}
            }
            spyOn(pluginInstance, "getFilters").and.callThrough();
            pluginInstance.getFilters('', data);
            expect(pluginInstance.getFilters).toHaveBeenCalled();
            expect(pluginInstance.topicData).not.toBe(undefined);
            done()
        })
        it('When fields range are empty, Then it should not break the get filters', function(done) {
            var data = {
                "associations": [{
                        "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_36",
                        "code": "environmentalstudies_l1Con_36",
                        "name": "The Valley Of Flowers - Uttaranchal",
                        "description": "The Valley Of Flowers - Uttaranchal",
                        "category": "topic",
                        "status": "Live"
                    },
                    {
                        "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_31",
                        "code": "environmentalstudies_l1Con_31",
                        "name": "Train Journey ",
                        "description": "Train Journey ",
                        "category": "topic",
                        "status": "Live"
                    }
                ],
                "field": {
                    "code": "gradeLevel",
                    "dataType": "list",
                    "description": "Level",
                    "editable": true,
                    "index": 6,
                    "inputType": "multiselect",
                    "label": "Grade Level",
                    "name": "Level",
                    "placeholder": "Select Grade",
                    "required": true,
                    "visible": true,
                    "depends": [
                        "topics"
                    ],
                    "range": [],
                    "$$hashKey": "object:120"
                }
            }
            spyOn(pluginInstance, "getFilters").and.callThrough();
            pluginInstance.getFilters('', data);
            expect(pluginInstance.getFilters).toHaveBeenCalled();
            expect(pluginInstance.topicData).not.toBe(undefined);
            done()
        })
        xit('When depends field are present, it should get the assocation ', function(done) {
            pluginInstance.isTopicPopupOpened = true;
            var data = {
                "associations": [{
                        "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_36",
                        "code": "environmentalstudies_l1Con_36",
                        "name": "The Valley Of Flowers - Uttaranchal",
                        "description": "The Valley Of Flowers - Uttaranchal",
                        "category": "topic",
                        "status": "Live"
                    },
                    {
                        "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_31",
                        "code": "environmentalstudies_l1Con_31",
                        "name": "Train Journey ",
                        "description": "Train Journey ",
                        "category": "topic",
                        "status": "Live"
                    }
                ],
                "field": {
                    "code": "gradeLevel",
                    "dataType": "list",
                    "description": "Level",
                    "editable": true,
                    "index": 6,
                    "inputType": "multiselect",
                    "label": "Grade Level",
                    "name": "Level",
                    "placeholder": "Select Grade",
                    "required": true,
                    "visible": true,
                    "depends": [
                        "topics"
                    ],
                    "range": [],
                    "$$hashKey": "object:120"
                }
            }
            spyOn(pluginInstance, "getFilters").and.callThrough();
            pluginInstance.getFilters('', data);
            expect(pluginInstance.getFilters).toHaveBeenCalled();
            expect(pluginInstance.topicData).not.toBe(undefined);
            done()
        })
    })
    describe('get association', function() {
        it('It should get the association, When valid data is passed', function(done) {
            var data = [{
                    "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_2",
                    "code": "environmentalstudies_l1Con_2",
                    "name": "Diversity In Plants",
                    "description": "Diversity In Plants",
                    "category": "topic",
                    "status": "Live"
                },
                {
                    "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_4",
                    "code": "environmentalstudies_l1Con_4",
                    "name": "School And Family",
                    "description": "School And Family",
                    "category": "topic",
                    "status": "Live"
                },
                {
                    "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_19",
                    "code": "environmentalstudies_l1Con_19",
                    "name": "Animals",
                    "description": "Animals",
                    "category": "gradeLevel",
                    "status": "Live"
                }
            ]
            spyOn(pluginInstance, "getAssociations").and.callThrough();
            pluginInstance.getAssociations(data, function(association) {
                expect(association).not.toBe(undefined);
                expect(association.length).toBe(2);
                done()
            })
            expect(pluginInstance.getAssociations).toHaveBeenCalled();
        })
        it('Association should be empty, When invalid category data is passed', function(done) {
            var data = [{
                    "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_2",
                    "code": "environmentalstudies_l1Con_2",
                    "name": "Diversity In Plants",
                    "description": "Diversity In Plants",
                    "category": "gradeLevel",
                    "status": "Live"
                },
                {
                    "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_4",
                    "code": "environmentalstudies_l1Con_4",
                    "name": "School And Family",
                    "description": "School And Family",
                    "category": "gradeLevel",
                    "status": "Live"
                },
                {
                    "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_19",
                    "code": "environmentalstudies_l1Con_19",
                    "name": "Animals",
                    "description": "Animals",
                    "category": "gradeLevel",
                    "status": "Live"
                }
            ]
            spyOn(pluginInstance, "getAssociations").and.callThrough();
            pluginInstance.getAssociations(data, function(association) {
                expect(association).not.toBe(undefined);
                expect(association.length).toBe(0);
                done()
            })
            expect(pluginInstance.getAssociations).toHaveBeenCalled();
        })
        it('Association should be empty, When category data is not present', function(done) {
            var data = [{
                    "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_2",
                    "code": "environmentalstudies_l1Con_2",
                    "name": "Diversity In Plants",
                    "description": "Diversity In Plants",
                    "status": "Live"
                },
                {
                    "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_4",
                    "code": "environmentalstudies_l1Con_4",
                    "name": "School And Family",
                    "description": "School And Family",
                    "status": "Live"
                },
                {
                    "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_19",
                    "code": "environmentalstudies_l1Con_19",
                    "name": "Animals",
                    "description": "Animals",
                    "status": "Live"
                }
            ]
            spyOn(pluginInstance, "getAssociations").and.callThrough();
            pluginInstance.getAssociations(data, function(association) {
                expect(association).not.toBe(undefined);
                expect(association.length).toBe(0);
                done()
            })
            expect(pluginInstance.getAssociations).toHaveBeenCalled();
        })

        it('Association should be empty, when empty data is passed', function(done) {
            var data = {}
            spyOn(pluginInstance, "getAssociations").and.callThrough();
            pluginInstance.getAssociations(data, function(association) {
                expect(association).not.toBe(undefined);
                expect(association.length).toBe(0);
                done()
            });
            expect(pluginInstance.getAssociations).toHaveBeenCalled();
        })

        it('It should throw error when undefined data is passed to get the association', function(done) {
            spyOn(pluginInstance, "getAssociations").and.callThrough();
            pluginInstance.getAssociations(undefined, function(association) {
                expect(association.length).toBe(0);
                done()
            })
            expect(pluginInstance.getAssociations).toHaveBeenCalled();
        })
    })

    describe('Get topic tree', function() {
        it('Should get the topic tree from api', function(done) {
            spyOn(pluginInstance, "getTopicCategory").and.callThrough();
            pluginInstance.getTopicCategory(function() {
                expect(pluginInstance.categories).not.toBe(undefined);
                done()
            });
            expect(pluginInstance.getTopicCategory).toHaveBeenCalled();
        })
    })

    describe('Get subtopics', function() {
        it('Subtopics should be empty, when Invalid topic data is passed', function(done) {
            spyOn(pluginInstance, "getSubtopics").and.callThrough();
            var result = pluginInstance.getSubtopics()
            expect(pluginInstance.getSubtopics).toHaveBeenCalled();
            expect(result.length).toBe(0);
            done()
        })
        it('Subtopics should not be empty, when valid topics are undefined', function(done) {
            var topics = [{ "identifier": "cmd_fw_16_topic_environmentalstudies_l1con_2_l2con_1", "code": "environmentalstudies_l1con_2_l2con_1", "name": "Leaves", "description": "Leaves", "index": 1, "category": "topic", "status": "Live" }]
            spyOn(pluginInstance, "getSubtopics").and.callThrough();
            var result = pluginInstance.getSubtopics(topics)
            expect(pluginInstance.getSubtopics).toHaveBeenCalled();
            expect(result).not.toBe(undefined);
            done()
        });
        it('Subtopics should not be empty, when identifiers are not defined', function(done) {
            var topics = [{ "code": "environmentalstudies_l1con_2_l2con_1", "name": "Leaves", "description": "Leaves", "index": 1, "category": "topic", "status": "Live" }]
            spyOn(pluginInstance, "getSubtopics").and.callThrough();
            var result = pluginInstance.getSubtopics(topics)
            expect(pluginInstance.getSubtopics).toHaveBeenCalled();
            expect(result.length).not.toBe(0);
            done()
        })
    })

    describe('Show tree picker', function() {
        it('When valid config is passed, should show topic picker tree', function(done) {
            var config = {
                'element': "elementId",
                'selectedTopics': ['abc', 'edf', 'ghi'],
                'callback': function() {
                    console.log("Submit of topics are invoked");
                }
            }
            ecEditor.addEventListener(manifest.id + ':init', function(event, data) {
                expect(data.element).not.toBe(undefined);
                expect(data.callback).not.toBeFalsy();
                expect(data.selectedTopics).not.toBe(undefined);
                setTimeout(function() {
                    done();
                }, 1000)
            })
            spyOn(pluginInstance, "showTopicBrowser").and.callThrough();
            ecEditor.dispatchEvent(manifest.id + ':init', config);
            pluginInstance.showTopicBrowser();
            expect(pluginInstance.showTopicBrowser).toHaveBeenCalled();
            //expect(pluginInstance.isTopicPopupOpened).toBe(true);
            done()
        });

        it('When invalid config is passed, should show topic picker tree', function() {
            var config = {
                'element': '',
                'selectedTopics': '',
                'callback': {},
            }
            ecEditor.addEventListener(manifest.id + ':init', function(event, data) {
                expect(data.element).not.toBe(undefined);
                expect(data.callback).not.toBe(undefined);
                setTimeout(function() {
                    done();
                }, 1000)
            })
            spyOn(pluginInstance, "showTopicBrowser").and.callThrough();
            ecEditor.dispatchEvent(manifest.id + ':init', config);
            pluginInstance.showTopicBrowser();
            expect(pluginInstance.showTopicBrowser).toHaveBeenCalled();
            // expect(pluginInstance.isTopicPopupOpened).toBe(false);

        });
    })

    it("Framework should support for plugin initialization", function(done) {
        spyOn(pluginInstance, "initialize").and.callThrough();
        pluginInstance.initialize();
        expect(pluginInstance.initialize).toHaveBeenCalled();
        done();
    });
    it("Base class must be defined", function(done) {
        expect(org.ekstep.contenteditor.basePlugin).not.toBe(undefined);
        done();
    });
    it('Framework should support for registering and dispatching an events listeners ', function(done) {
        spyOn(ecEditor, "addEventListener").and.callThrough();
        ecEditor.addEventListener('editor:invoke:event', function(event, data) {
            expect(event.type).toBe('editor:invoke:event');
            expect(data).not.toBe(undefined);
            done()
        });
        expect(ecEditor.addEventListener).toHaveBeenCalled();
        ecEditor.dispatchEvent('editor:invoke:event', {});
    });
    it('Editor should support for logging an telemetry events', function(done) {
        expect(ecEditor.getService('telemetry')).not.toBe(undefined);
        spyOn(ecEditor.getService('telemetry'), 'interact').and.callThrough();
        ecEditor.getService('telemetry').interact({
            "type": "click",
            "subtype": '',
            "target": 'button',
            "pluginid": manifest.id,
            "pluginver": manifest.ver,
            "objectid": '',
            "targetid": '',
            "stage": ''
        })
        expect(ecEditor.getService('telemetry').interact).toHaveBeenCalled();
        done()
    });

})