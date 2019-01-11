describe('Preview plugin', ()=> {
    var pluginInstance;

    beforeAll(function (done) {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.preview");
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.preview");
        done();
    });

    it('Should invoke initialize method to initialize plugin', (done)=> {
        spyOn(pluginInstance, "initialize").and.callThrough();
        pluginInstance.initialize();
        expect(pluginInstance.initialize).toHaveBeenCalled();
        expect(pluginInstance.initialize.calls.count()).toEqual(1);
        done();
    });

    it('Should invoke initPreview method to laod preview', (done)=> {
        var event = {"type":"atpreview:show"};
        var data = {"contentBody":{"theme":{"id":"theme","version":"1.0","startStage":"51210238-3604-4320-a24d-0327515a7a79","stage":[{"x":0,"y":0,"w":100,"h":100,"id":"51210238-3604-4320-a24d-0327515a7a79","rotate":null,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#FFFFFF\",\"genieControls\":false,\"instructions\":\"\"}"},"manifest":{"media":[]}}],"manifest":{"media":[{"id":"75b46258-bae0-496d-81a6-e8a548d4c9d8","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/controller/navigation_ctrl.js","type":"js"},{"id":"c7426ca7-8ea9-4b93-a37a-70447955c090","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/templates/navigation.html","type":"js"},{"id":"org.ekstep.navigation","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/plugin.js","type":"plugin"},{"id":"org.ekstep.navigation_manifest","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/manifest.json","type":"json"}]},"plugin-manifest":{"plugin":[{"id":"org.ekstep.navigation","ver":"1.0","type":"plugin","depends":""}]},"compatibilityVersion":2}},"currentStage":true};
        spyOn(pluginInstance, "initPreview").and.callThrough();
        pluginInstance.initPreview(event, data);
        expect(pluginInstance.initPreview).toHaveBeenCalled();
        spyOn(pluginInstance, "showPreview").and.callThrough();
        pluginInstance.showPreview(data);
        expect(pluginInstance.showPreview).toHaveBeenCalled();
        done();
    });

    it('Should invoke initPreview method to laod preview when currentStage is false', (done)=> {
        var event = {"type":"atpreview:show"};
        var data = {"contentBody":{"theme":{"id":"theme","version":"1.0","startStage":"51210238-3604-4320-a24d-0327515a7a79","stage":[{"x":0,"y":0,"w":100,"h":100,"id":"51210238-3604-4320-a24d-0327515a7a79","rotate":null,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#FFFFFF\",\"genieControls\":false,\"instructions\":\"\"}"},"manifest":{"media":[]}}],"manifest":{"media":[{"id":"75b46258-bae0-496d-81a6-e8a548d4c9d8","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/controller/navigation_ctrl.js","type":"js"},{"id":"c7426ca7-8ea9-4b93-a37a-70447955c090","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/templates/navigation.html","type":"js"},{"id":"org.ekstep.navigation","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/plugin.js","type":"plugin"},{"id":"org.ekstep.navigation_manifest","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/manifest.json","type":"json"}]},"plugin-manifest":{"plugin":[{"id":"org.ekstep.navigation","ver":"1.0","type":"plugin","depends":""}]},"compatibilityVersion":2}},"currentStage":false};
        spyOn(pluginInstance, "initPreview").and.callThrough();
        pluginInstance.initPreview(event, data);
        expect(pluginInstance.initPreview).toHaveBeenCalled();
        done();
    });

    it('Should invoke showPreview method to display preview', (done)=> {
        var data = {"contentBody":{"theme":{"id":"theme","version":"1.0","startStage":"51210238-3604-4320-a24d-0327515a7a79","stage":[{"x":0,"y":0,"w":100,"h":100,"id":"51210238-3604-4320-a24d-0327515a7a79","rotate":null,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#FFFFFF\",\"genieControls\":false,\"instructions\":\"\"}"},"manifest":{"media":[]}}],"manifest":{"media":[{"id":"75b46258-bae0-496d-81a6-e8a548d4c9d8","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/controller/navigation_ctrl.js","type":"js"},{"id":"c7426ca7-8ea9-4b93-a37a-70447955c090","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/templates/navigation.html","type":"js"},{"id":"org.ekstep.navigation","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/plugin.js","type":"plugin"},{"id":"org.ekstep.navigation_manifest","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/manifest.json","type":"json"}]},"plugin-manifest":{"plugin":[{"id":"org.ekstep.navigation","ver":"1.0","type":"plugin","depends":""}]},"compatibilityVersion":2}},"currentStage":true};
        spyOn(pluginInstance, "showPreview").and.callThrough();
        pluginInstance.showPreview(data);
        expect(pluginInstance.showPreview).toHaveBeenCalled();
        done();
    });

    it('Should invoke showPreview method to display preview', (done)=> {
        var data = {"contentBody":{"theme":{"id":"theme","version":"1.0","startStage":"51210238-3604-4320-a24d-0327515a7a79","stage":[{"x":0,"y":0,"w":100,"h":100,"id":"51210238-3604-4320-a24d-0327515a7a79","rotate":null,"config":{"__cdata":"{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#FFFFFF\",\"genieControls\":false,\"instructions\":\"\"}"},"manifest":{"media":[]}}],"manifest":{"media":[{"id":"75b46258-bae0-496d-81a6-e8a548d4c9d8","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/controller/navigation_ctrl.js","type":"js"},{"id":"c7426ca7-8ea9-4b93-a37a-70447955c090","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/templates/navigation.html","type":"js"},{"id":"org.ekstep.navigation","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/renderer/plugin.js","type":"plugin"},{"id":"org.ekstep.navigation_manifest","plugin":"org.ekstep.navigation","ver":"1.0","src":"/plugins/org.ekstep.navigation-1.0/manifest.json","type":"json"}]},"plugin-manifest":{"plugin":[{"id":"org.ekstep.navigation","ver":"1.0","type":"plugin","depends":""}]},"compatibilityVersion":2}},"currentStage":true, 'parentElement': {'parentElement':'parentElement'}};
        spyOn(pluginInstance, "showPreview").and.callThrough();
        pluginInstance.showPreview(data);
        expect(pluginInstance.showPreview).toHaveBeenCalled();
        done();
    });

    it('Should invoke window.onclic method', (done)=> {
        var event = {'target':''};
        spyOn(window, 'onclick').and.callThrough();
        window.onclick(event);       
        expect(window.onclick).toHaveBeenCalledWith(event);
        done();
    });

});