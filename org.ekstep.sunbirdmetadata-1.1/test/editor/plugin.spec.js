describe("Sunbird metadata plugin:", function() {
    var manifest, ctrl, $scope, pluginInstance;
    
    beforeAll(function(done) {
        CollectionEditorTestFramework.init(function() {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.sunbirdmetadata");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.sunbirdmetadata");
            done();
        })
    });
    it("Should initialize the plugin and register the event",function(done){
        spyOn(pluginInstance, "initialize").and.callThrough();
        pluginInstance.initialize();
        expect(pluginInstance.initialize).toHaveBeenCalled();
        expect(pluginInstance.initialize.calls.count()).toEqual(1);
        expect(pluginInstance.initialize.calls.count()).not.toBeGreaterThan(1);
        expect(EventBus.hasEventListener('editor:form:cancel')).toBe(true);
        done();
    });

    it("Should invoke method called to render metadataform",function(done){
        var type = "textbook";
        var action = "save";
        var event = {"type":"org.ekstep.editcontentmeta:showpopup"};
        var config = {"action":"save","subType":"textbook","framework":"NCF","rootOrgId":"b00bc992ef25f1a9a8d63291e20efc8d","type":"content","popup":true,"editMode":true};
        spyOn(pluginInstance, "invoke").and.callThrough();
        pluginInstance.invoke(event, config);
        expect(pluginInstance.invoke).toHaveBeenCalled();
        expect(pluginInstance.invoke).not.toBeUndefined();
        spyOn(pluginInstance, "isConfigurationsExists").and.callThrough();
        pluginInstance.isConfigurationsExists(type, action);
        expect(pluginInstance.isConfigurationsExists).toHaveBeenCalled();
        done();
    });

    xit("Should onConfigChange method",function(done){
        var event = {"type":"org.ekstep.editcontentmeta:showpopup"};
        var config = {};
        spyOn(pluginInstance, "onConfigChange").and.callThrough();
        pluginInstance.onConfigChange(event, config);
        expect(pluginInstance.onConfigChange).toHaveBeenCalled();
        expect(pluginInstance.onConfigChange).not.toBeUndefined();
        done();
    });

    it("Should invoke successAction method after saving form data",function(done){
        pluginInstance.config.action = "review";
        var event = {"type":"editor:form:success"};
        var data = {"formData": {"metaData":{"ownedBy":"do_112599081812180992167","appIcon":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_1122027950982266881377/artifact/images_1489599011195.jpeg","board":"NCERT","gradeLevel":["Class 1"],"subject":"Mathematics","medium":"English","year":"2009","name":"Textbook-19th-12","contentType":"TextBook","mimeType":"application/vnd.ekstep.content-collection","ownershipType":["createdFor"],"owner":"ekstep"}}, "isValid": true};
        spyOn(pluginInstance, "successAction").and.callThrough();
        pluginInstance.successAction(event, data);
        expect(pluginInstance.successAction).toHaveBeenCalled();
        expect(pluginInstance.successAction).not.toBeUndefined();
        spyOn(pluginInstance, "updateState").and.callThrough();
        pluginInstance.updateState(data.formData);
        expect(pluginInstance.updateState).toHaveBeenCalled();
        done();
    });
     
    it("Should cancelAction method to cancle save action",function(done){
        var event = {"type":"org.ekstep.editcontentmeta:cancel"};
        var data = {callback(){}};
        spyOn(pluginInstance, "cancelAction").and.callThrough();
        pluginInstance.cancelAction(event, data);
        expect(pluginInstance.cancelAction).toHaveBeenCalled();
        expect(pluginInstance.cancelAction).not.toBeUndefined();
        done();
    });

    xit("Should updateState method to load template",function(done){
        var object = {"metaData": {"ownedBy":"do_21256981223442841614868","board":"NCERT","gradeLevel":["KG"],"subject":"English","year":"2004","name":"Textbook-19th-12","contentType":"TextBook","mimeType":"application/vnd.ekstep.content-collection","ownershipType":["createdFor"],"owner":"sunbird"}};
        spyOn(pluginInstance, "updateState").and.callThrough();
        pluginInstance.updateState(object);
        expect(pluginInstance.updateState).toHaveBeenCalled();
        done();
    });

    it("Should invoke reviewContent method after review ",function(done){
        var data = {};
        spyOn(pluginInstance, "reviewContent").and.callThrough();
        pluginInstance.reviewContent(data, jasmine.any(Function));
        expect(pluginInstance.reviewContent).toHaveBeenCalled();
        expect(pluginInstance.reviewContent).not.toBeUndefined();
        done();
    });

    xit("Should invoke renderForm method to reder form details",function(done){
        var ispopup = true;
        var config = {'resourceBundle':{}, 'fields':{}, 'framework':{}, 'formConfig':{}};
        spyOn(pluginInstance, "renderForm").and.callThrough();
        pluginInstance.renderForm(ispopup, config);
        expect(pluginInstance.renderForm).toHaveBeenCalled();
        done();
    });

    it("Should invoke getModel method to load model",function(done){
        spyOn(pluginInstance, "getModel").and.callThrough();
        pluginInstance.getModel();
        expect(pluginInstance.getModel).toHaveBeenCalled();
        done();
    });
         
});