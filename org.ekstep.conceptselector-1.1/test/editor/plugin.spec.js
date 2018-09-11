describe("Concept Selecotr:", function() {
    var manifest, ctrl, $scope, pluginInstance;
    
    beforeAll(function(done) {
        CollectionEditorTestFramework.init(function() {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.conceptselector");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.conceptselector");
            done();
        })
    });
    it("Should initialize the plugin and register the event",function(done){
        spyOn(pluginInstance, "initialize").and.callThrough();
        pluginInstance.initialize();
        expect(pluginInstance.initialize).toHaveBeenCalled();
        var eventName = manifest.id + ":init";
        var isEventPresent = ecEditor.hasEventListener(eventName);
        expect(isEventPresent).toBe(true); 
        expect(pluginInstance.initialize.calls.count()).toEqual(1);
        expect(pluginInstance.initialize.calls.count()).not.toBeGreaterThan(1);
        done();
    });

    it("Should Get domains and dimensions data on invoke of init method", function(done) {
        var data = { "request": { "filters": { "objectType": ["Dimension", "Domain"] } } };
        var resp = { data:{"result":{"domains":[{"identifier":"AI","code":"AI","keywords":["Subject","AI"],"subject":"Artificial_Intelligence","consumerId":"72e54829-6402-4cf0-888e-9b30733c1b88","channel":"in.ekstep","graph_id":"domain","nodeType":"DATA_NODE","createdOn":"2018-02-28T13:17:58.507+0000","versionKey":"1519823878507","objectType":"Domain","children":["AI1","AI3","AI4","AI2"],"appId":"ekstep_portal","name":"Artificial_Intelligence","lastUpdatedOn":"2018-02-28T13:17:58.507+0000","status":"Live","node_id":31087}], "concepts":[{"identifier":"C412","parent":["AI"],"code":"C412","keywords":["Funtoot, Misconception"],"references":"MO025, MO031\r","consumerId":"f6878ac4-e9c9-4bc4-80be-298c5a73b447","subject":"numeracy","channel":"in.ekstep","description":"Add amounts of money(in rupees and paisa)","graph_id":"domain","nodeType":"DATA_NODE","createdOn":"2016-06-15T09:43:19.795+0000","versionKey":"1496662621072","objectType":"Concept","contents":["do_10097685","do_10094168","do_10094619","do_10094124"],"appId":"dev.ekstep.in","name":"Add money","lastUpdatedOn":"2017-06-05T11:37:01.072+0000","status":"Live","node_id":69035}], "dimensions":[{"identifier":"LD3","parent":["AI"],"code":"LD3","keywords":["Dimension"],"consumerId":"f6878ac4-e9c9-4bc4-80be-298c5a73b447","subject":"literacy","channel":"in.ekstep","description":"Basic ability to read and write a language involves recognizing the aksharas of the language. Child should be able to recognize (read) the aksharas and their sounds, as well as write the aksharas.","graph_id":"domain","nodeType":"DATA_NODE","Subject":"literacy","versionKey":"1496769636594","objectType":"Dimension","children":["do_112326333823483904143","LO37","LO39","do_112300246933831680110","do_11230024191408537619","do_112300252824281088113","do_112300301411336192127","do_112300309856591872129","do_112301509992890368191","domain_13508","do_112322803341230080143","do_112324853724790784148","do_112324915782754304156","do_112465181541261312130","do_112473654660456448135"],"appId":"dev.ekstep.in","name":"Akshara Knowledge","lastUpdatedOn":"2017-06-06T17:20:36.594+0000","status":"Live","node_id":252}]}}};
        pluginInstance.concepts = [];
        ecEditor.getService('search').search = jasmine.createSpy().and.callFake(function(data, cb) {
            cb(undefined, resp);
        });
        spyOn(pluginInstance, "initData").and.callThrough();
        pluginInstance.initData(pluginInstance, function(){});
        expect(pluginInstance.initData).toHaveBeenCalled();
        expect(pluginInstance.concepts.length).toBe(0);
        expect(pluginInstance.concepts).not.toBe(undefined);
        expect(pluginInstance.initData).not.toBe(undefined);
        expect(pluginInstance.initData.calls.count()).toEqual(1);
        expect(pluginInstance.initData.calls.count()).not.toBeGreaterThan(1);
        done();         
    });

    it("Should initialize Instance with this value when undefined", function(done) {
        var data = { "request": { "filters": { "objectType": ["Dimension", "Domain"] } } };
        var resp = { data:{"result":{"domains":[{"identifier":"AI","code":"AI","keywords":["Subject","AI"],"subject":"Artificial_Intelligence","consumerId":"72e54829-6402-4cf0-888e-9b30733c1b88","channel":"in.ekstep","graph_id":"domain","nodeType":"DATA_NODE","createdOn":"2018-02-28T13:17:58.507+0000","versionKey":"1519823878507","objectType":"Domain","children":["AI1","AI3","AI4","AI2"],"appId":"ekstep_portal","name":"Artificial_Intelligence","lastUpdatedOn":"2018-02-28T13:17:58.507+0000","status":"Live","node_id":31087}], "concepts":[{"identifier":"C412","parent":["AI"],"code":"C412","keywords":["Funtoot, Misconception"],"references":"MO025, MO031\r","consumerId":"f6878ac4-e9c9-4bc4-80be-298c5a73b447","subject":"numeracy","channel":"in.ekstep","description":"Add amounts of money(in rupees and paisa)","graph_id":"domain","nodeType":"DATA_NODE","createdOn":"2016-06-15T09:43:19.795+0000","versionKey":"1496662621072","objectType":"Concept","contents":["do_10097685","do_10094168","do_10094619","do_10094124"],"appId":"dev.ekstep.in","name":"Add money","lastUpdatedOn":"2017-06-05T11:37:01.072+0000","status":"Live","node_id":69035}], "dimensions":[{"identifier":"LD3","parent":["AI"],"code":"LD3","keywords":["Dimension"],"consumerId":"f6878ac4-e9c9-4bc4-80be-298c5a73b447","subject":"literacy","channel":"in.ekstep","description":"Basic ability to read and write a language involves recognizing the aksharas of the language. Child should be able to recognize (read) the aksharas and their sounds, as well as write the aksharas.","graph_id":"domain","nodeType":"DATA_NODE","Subject":"literacy","versionKey":"1496769636594","objectType":"Dimension","children":["do_112326333823483904143","LO37","LO39","do_112300246933831680110","do_11230024191408537619","do_112300252824281088113","do_112300301411336192127","do_112300309856591872129","do_112301509992890368191","domain_13508","do_112322803341230080143","do_112324853724790784148","do_112324915782754304156","do_112465181541261312130","do_112473654660456448135"],"appId":"dev.ekstep.in","name":"Akshara Knowledge","lastUpdatedOn":"2017-06-06T17:20:36.594+0000","status":"Live","node_id":252}]}}};
        var Instance = undefined;
        ecEditor.getService('search').search = jasmine.createSpy().and.callFake(function(data, cb) {
            cb(undefined, resp);
        });
        spyOn(pluginInstance, "initData").and.callThrough();
        pluginInstance.initData(Instance,function(){});
        expect(pluginInstance.initData).toHaveBeenCalled();
        expect(pluginInstance.initData).not.toBe(undefined);
        done();         
    });

    it("Should Get concepts data on invoked of getConcept method", function(done) {
        var offset = 0; var limit = 500;
        var respconcept =  {"data":{"result":{"concepts":[{"identifier":"C412","parent":["C412"],"code":"C412","keywords":["Funtoot, Misconception"],"references":"MO025, MO031\r","consumerId":"f6878ac4-e9c9-4bc4-80be-298c5a73b447","subject":"numeracy","channel":"in.ekstep","description":"Add amounts of money(in rupees and paisa)","graph_id":"domain","nodeType":"DATA_NODE","createdOn":"2016-06-15T09:43:19.795+0000","versionKey":"1496662621072","objectType":"Concept","contents":["do_10097685","do_10094168","do_10094619","do_10094124"],"appId":"dev.ekstep.in","name":"Add money","lastUpdatedOn":"2017-06-05T11:37:01.072+0000","status":"Live","node_id":69035}],"count":2}}}
        var data = { "request": { "filters": { "objectType": ["Concept"] }, "offset": 0, "limit": 50 } };
        ecEditor.getService('search').search = jasmine.createSpy().and.callFake(function(resp, cb) {
            cb(false, respconcept);

        });
        spyOn(pluginInstance, "getConcept").and.callThrough();
        pluginInstance.getConcept(offset, limit, pluginInstance, function(){});
        expect(pluginInstance.getConcept).not.toBe(undefined);
        expect(offset).not.toBe(undefined);
        expect(limit).not.toBe(undefined);
        done();
    });

    it("Should initialize with this value when undefined", function(done) {
        var offset = 0; var limit = 500;
        var respconcept =  {"data":{"result":{"concepts":[{"identifier":"C412","parent":["C412"],"code":"C412","keywords":["Funtoot, Misconception"],"references":"MO025, MO031\r","consumerId":"f6878ac4-e9c9-4bc4-80be-298c5a73b447","subject":"numeracy","channel":"in.ekstep","description":"Add amounts of money(in rupees and paisa)","graph_id":"domain","nodeType":"DATA_NODE","createdOn":"2016-06-15T09:43:19.795+0000","versionKey":"1496662621072","objectType":"Concept","contents":["do_10097685","do_10094168","do_10094619","do_10094124"],"appId":"dev.ekstep.in","name":"Add money","lastUpdatedOn":"2017-06-05T11:37:01.072+0000","status":"Live","node_id":69035}],"count":1}}}
        ecEditor.getService('search').search = jasmine.createSpy().and.callFake(function(resp, cb) {
            cb(false, respconcept);

        });
        var Instance = undefined;
        spyOn(pluginInstance, "getConcept").and.callThrough();
        pluginInstance.getConcept(offset, limit, Instance, function(){});
        expect(pluginInstance.getConcept).not.toBe(undefined);
        expect(offset).not.toBe(undefined);
        expect(limit).not.toBe(undefined);
        done();
    });

    it("Should Get concepts on invoked of initConceptBrowser method", function(done) {
        var data = { "request": { "filters": { "objectType": ["Dimension", "Domain"] } } };
        pluginInstance.concepts = [];
        var event = {"type":"org.ekstep.conceptselector:init", "target":''}
        spyOn(pluginInstance, "initConceptBrowser").and.callThrough();
        pluginInstance.initConceptBrowser(event, data);
        setTimeout(function() {
            expect(pluginInstance.concepts).not.toBe(undefined);
            expect(pluginInstance.initConceptBrowser).toHaveBeenCalled();
            expect(pluginInstance.initConceptBrowser.calls.count()).toEqual(1);
            expect(pluginInstance.initConceptBrowser.calls.count()).not.toBeGreaterThan(1);
            done();
        }, 1000);
    });

    it("Should not select concepts when concepts length is zero", function(done) {
        pluginInstance.concepts = [{'identifier':'identifier', 'name':'name'}];
        var data = { "request": { "filters": { "objectType": ["Dimension", "Domain"] } } };
        var event = {"type":"org.ekstep.conceptselector:init", "target":''}
        spyOn(pluginInstance, "initConceptBrowser").and.callThrough();
        pluginInstance.initConceptBrowser(event, data);
        setTimeout(function() {
            expect(pluginInstance.concepts.length).not.toBe(0);
            expect(pluginInstance.initConceptBrowser).toHaveBeenCalled();
            done();
        }, 1000);
    });

    it("Should set pageid default if pageid is not available to generate telemetry event", function(done) {
        var telemetryData = { type: 'click', subtype: 'back', target: 'backButton'};
        spyOn(org.ekstep.contenteditor.api, 'getCurrentStage').and.returnValue({ id: '' });
        var pageid = org.ekstep.contenteditor.api.getCurrentStage().id;
        spyOn(pluginInstance, "generateTelemetry").and.callThrough();
        spyOn(ecEditor.getService('telemetry'), 'interact');
        pluginInstance.generateTelemetry(telemetryData);
        expect(ecEditor.getService('telemetry').interact).toHaveBeenCalledWith({
            "type": telemetryData.type,
            "subtype": telemetryData.subtype,
            "id": telemetryData.target,
            "pageid": pageid,
            "target":{
                "id": "",
                "type": "plugin",
                "ver": ""
            },
            "plugin":{
                "id": 'org.ekstep.conceptselector',
                "ver": '1.1',
                "category": "core"
            },
            "ver": "3.0"
        });
        expect(pluginInstance.generateTelemetry.calls.count()).toEqual(1);
        expect(pluginInstance.generateTelemetry.calls.count()).not.toBeGreaterThan(1);
        done();
    });

    it("Should not generate telemetry event,if data is not available", function(done) {
        var telemetryData = {};
        spyOn(org.ekstep.contenteditor.api, 'getCurrentStage').and.returnValue({ id: '' });
        var pageid = org.ekstep.contenteditor.api.getCurrentStage().id;
        spyOn(pluginInstance, "generateTelemetry").and.callThrough();
        spyOn(ecEditor.getService('telemetry'), 'interact');
        pluginInstance.generateTelemetry(telemetryData);
        expect(pluginInstance.generateTelemetry).toHaveBeenCalled();
        done();
    });

});