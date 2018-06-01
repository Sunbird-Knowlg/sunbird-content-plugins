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

describe('Plugin initialization', function() {
    it('Should open the popup, When categories are present', function(done) {
        //  assertions
        //         - POPUP should open
        //         - categories should be present 
        //         - Master data should be present
        //          
        var data = {}
        pluginInstance.getTopicCategory = jasmine.createSpy().and.callFake(function() {
            pluginInstance.categories = [{ id: "topic1" }]
        });
        pluginInstance.initData('', data);
        expect(pluginInstance.isTopicPopupOpened).toBe(true);
        expect(pluginInstance.categories.length).not.toBe(undefined);
        expect(pluginInstance.topicData).not.toBe(undefined);
        done();
    });
    it('Should show an popup and throw an error message, When categories are not present', function() {
        var data = {};
        //  assertions
        //         - POPUP should open
        //         - categories should not be present 
        //         - Should throw an error message
        //          
        try {
            pluginInstance.initData('', data);
        } catch (e) {
            expect(e).not.toBe(undefined);
            expect(e).toBe('categories are not present');
        }
        pluginInstance.getTopicCategory = jasmine.createSpy().and.callFake(function() {
            pluginInstance.categories = []
        });
        expect(pluginInstance.isTopicPopupOpened).toBe(true);
        expect(pluginInstance.categories.length).toBe(0);
        done();
    });
    it('When configurations are undefined are passed, Should throw an error', function(done) {
        //  assertions
        //         - POPUP should not open
        //         - Should throw an error message
        //    
        try {
            pluginInstance.initData('', undefined);
        } catch (e) {
            expect(e).not.toBe(undefined);
            expect(e).toBe('Invalid config');
            done();
        }
        expect(pluginInstance.isTopicPopupOpened).toBe(false);
        expect(pluginInstance.categories.length).toBe(0);
    });

    it('When invalid configurations are passed, Should throw an error', function(done) {
        var config = {};
        //  assertions
        //         - POPUP should not open
        //         - Should throw an error message
        //  
        try {
            pluginInstance.initData('', config);
        } catch (e) {
            expect(e).not.toBe(undefined);
            expect(e).toBe('Invalid config');
            done();
        }
        expect(pluginInstance.isTopicPopupOpened).toBe(false);
        expect(pluginInstance.categories.length).toBe(0);
    })

})

describe('applyFilters', function() {
    it('When valid object is passed, Should topic browser', function() {
        var data = {};
        pluginInstance.applyFilters('', data);
        expect(pluginInstance.selectedFilters).not.toBe(undefined);

    })
})

describe('Associations', function() {
    it('Should get the associations, When category is topic', function(done) {
        //  assertions
        //              - Should get the assocations when category is topic
        //  
        pluginInstance.getAssociations(data, function(associations) {
            expect(associations).not.toBe(undefined);
            expect(associations.length).not.toBe(0);
            done();
        })
    })
    it('Should not get the associations, When category is not a topic', function(done) {
        // Assertion 
        //              - Association length must be zero
        //              - Association must not be undefined
        var data = {}
        pluginInstance.getAssociations(data, function(associations) {
            expect(associations).not.toBe(undefined);
            expect(associations.length).toBe(0);
            done()
        })
    })
    it('Should throw an error, When data is undefined', function(done) {
        // Assertion
        //              - Should throw an error.
        //              - Association length must be zero.
        var data = {}
        try {
            pluginInstance.getAssociations(data, function(associations) {
                expect(associations.length).toBe(0);
                done()
            })
        } catch (e) {
            expect(e).not.toBe(undefined);
            expect(e).toBe('Unable to get associations');
            done();
        }
    })
})

describe('Subtopics', function() {
    it('Should get the subTopics, When valid topic data is passed', function(done) {
        // Assertions 
        //              - Should return the subTopics
        var subTopics = pluginInstance.getSubtopics(topic);
        expect(subTopics).not.toBe(undefined);
    });
    it('When object is not defined, Should throw an error', function(done) {
        var topics = undefined;
        // Asserstions
        //            - Should throw an error (Invalid topics)
        try {
            expect(pluginInstance.getSubtopics(topic)).toBe(undefined);
        } catch (e) {
            expect(e).not.toBe(undefined);
            expect(e).toBe('Invalid topics');
            done();
        }
    });

    it('When invalid object structure is passed, Should throw an error', function(done) {
        // Asserstions
        //            - Should throw an error (Invalid topics)
        var topics = {} // Invalid topic structure data
        try {
            expect(pluginInstance.getSubtopics(topic)).toBe(undefined);
        } catch (e) {
            expect(e).not.toBe(undefined);
            expect(e).toBe('Invalid data');
            done();
        }
    })

});

describe('Topics', function(done) {
    it('Should get a topics, When valid topic data is passed', function(done) {
        // Asserstions
        //            - Topic must not undefined
        //            - Topic size must not be zero
        var data = {};
        pluginInstance.getTopics(data, function(topic) {
            expect(topic).not.toBe(undefined);
            expect(topic.length).not.toBe(0);
        });
    });
    it('Should throw an error, When data is not defined', function(done) {
        // Asserstions
        //            - Should throw an error
        var data = undefined;
        try {
            pluginInstance.getTopics(data, function(topic) {
                expect(topic).not.toBe(undefined);
                expect(topic.length).not.toBe(0);
            });
        } catch (e) {
            expect(e).not.toBe(undefined);
            expect(e).toBe('Invalid data')
        }
    });
    it('Should throw an error, When object is not proper', function(done) {
        // Asserstions
        //            - Should throw an error
        var data = {};
        try {
            pluginInstance.getTopics(data, function(topic) {});
        } catch (e) {
            expect(e).not.toBe(undefined);
            expect(e).toBe('Invalid data')
        }
    });

})

})
})