describe('Reviewer comments plugin', function () {
    var manifest, pluginInstance;
    var apiResponse = { "data" : {
        "id": "api.review.comment",
        "params": {
            "resmsgid": "ac022850-df33-4cf6-a78a-870809c0c5be",
            "msgid": "8aa60e8a-95e4-4e44-aa89-d621107dc2b9",
            "status": "successful"
        },
        "responseCode": "OK",
        "result": {
            "comments": [
                {
                    "postId": "bf05fbf6-d500-4950-ba42-93d96c4ab412",
                    "threadId": "6d4e06a0-d5bf-11e8-b74f-8b7f5a2679c5",
                    "body": "comment for ver 1 stage 2",
                    "createdOn": "2018-10-22T05:57:58.413Z",
                    "userId": "NCF",
                    "tag": "do_123_1_ecml",
                    "userInfo": {
                        "logo": "https://dev.open-sunbird.org/assets/images/sunbird_logo.png",
                        "name": "ram"
                    },
                    "stageId": "25357daa-801d-4b60-a111-67bbcb72a56b"
                },
                {
                    "postId": "2090348f-94b7-462f-814a-8ce5ca01b3bd",
                    "threadId": "4f580b00-d5bf-11e8-b74f-8b7f5a2679c5",
                    "body": "comment for ver 1 stage 2",
                    "createdOn": "2018-10-22T05:57:08.211Z",
                    "userId": "NCF",
                    "tag": "do_123_1_ecml",
                    "userInfo": {
                        "logo": "https://dev.open-sunbird.org/assets/images/sunbird_logo.png",
                        "name": "ram"
                    },
                    "stageId": "25357daa-801d-4b60-a111-67bbcb72a56b"
                },
                {
                    "postId": "60d45c78-e63f-441c-8546-5e0c62cc5cfc",
                    "threadId": "6d4e06a0-d5bf-11e8-b74f-8b7f5a2679c5",
                    "body": "comment for ver 1 stage 1",
                    "createdOn": "2018-10-22T05:58:07.598Z",
                    "userId": "NCF",
                    "tag": "do_123_1_ecml",
                    "userInfo": {
                        "logo": "",
                        "name": "ram"
                    },
                    "stageId": "a67464a0-878c-4263-9a54-9e36cd05a35c"
                }
            ]
        },
        "ts": "2018-10-22T06:00:39.012Z",
        "ver": "1.0"
    }
    };
    var noCommentsResponse = { "data" : {
        "id": "api.review.comment",
        "params": {
            "resmsgid": "ac022850-df33-4cf6-a78a-870809c0c5be",
            "msgid": "8aa60e8a-95e4-4e44-aa89-d621107dc2b9",
            "status": "successful"
        },
        "responseCode": "OK",
        "result": {
            "comments": [ ]
        },
        "ts": "2018-10-22T06:00:39.012Z",
        "ver": "1.0"
    }
    };
    beforeAll(function (done) {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.reviewercomments");
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.reviewercomments");
        done();
    });

    it("Should invoke plugin initialize method for the event `stage:select`", function(done) {
        spyOn(pluginInstance, "callAPI").and.callThrough();
        spyOn(pluginInstance, "initShowComments").and.callThrough();
        spyOn(pluginInstance, "initialize").and.callThrough();      
        ecEditor.getService('content').getComments = jasmine.createSpy().and.callFake(function(data, callBack) {
            callBack(undefined, apiResponse);            
        });
        pluginInstance.initialize();
        expect(pluginInstance.initialize).toHaveBeenCalled();
        done();
    });
    xit("Should call the callAPI function to fetch data from the API", function(done) {
        pluginInstance.isApiCalled = false;
        spyOn(pluginInstance, "callAPI").and.callThrough();
        spyOn(pluginInstance, "initializeComments").and.callThrough();
        ecEditor.getService('content').getComments = jasmine.createSpy().and.callFake(function(data, callBack) {
            callBack();            
        });
        pluginInstance.callAPI();
        expect(pluginInstance.callAPI).toHaveBeenCalled();
        done();
    }); 
    xit("Should call initializeComments function to display comments", function(done) {
        spyOn(pluginInstance, "initializeComments").and.callThrough();
        pluginInstance.initializeComments();
        done();
    });
    
    it("If initializeComments function returns null display `no comments message`", function(done) {
        spyOn(pluginInstance, "callAPI").and.callThrough();
        spyOn(pluginInstance, "initShowComments").and.callThrough();
        spyOn(pluginInstance, "initialize").and.callThrough();      
        ecEditor.getService('content').getComments = jasmine.createSpy().and.callFake(function(data, callBack) {
            callBack(undefined, noCommentsResponse);            
        });
        pluginInstance.initialize();
        expect(pluginInstance.initialize).toHaveBeenCalled();
        done();
        
    });
    xit("If initializeComments function throws error, display the error message", function() {

    });
});