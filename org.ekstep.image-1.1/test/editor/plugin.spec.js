'use strict'

describe('Image Plugin', function () {

    var pluginInstance, imagePluginInstance;

    beforeAll(function () {
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.assetbrowser");
    })

    it('should NOT instantiate  itself directly', function () {
        /*
        *
        * Image can be added to the stage, 
        * Only After choosing it through the assetbrowser.
        *  
        */
        expect(function () {
            ecEditor.instantiatePlugin("org.ekstep.image").toThrow(new Error("Error: when instantiating plugin: org.ekstep.image thrown"));
        })

    })

    it('should be able to initialize after instantiating', function () {

        spyOn(pluginInstance, "initialize").and.callThrough();
        pluginInstance.initialize();
        expect(pluginInstance.initialize).toHaveBeenCalled();

    })

    it('sholud register all the events before dispatching it', function () {

        expect(ecEditor.hasEventListener('org.ekstep.assetbrowser:show')).toBe(true);
        expect(ecEditor.hasEventListener('org.ekstep.image:assetbrowser:open')).toBe(true);
        expect(ecEditor.hasEventListener('org.ekstep.image:create')).toBe(true);

    })

    it('should add image to the stage successfully', function () {

        expect(function(){
            ecEditor.dispatchEvent('org.ekstep.image:create',
            {
                "asset": "do_1121907048923545601138",
                "assetMedia": { "id": "do_1121907048923545601138", "src": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_1121907048923545601138/artifact/profile-_1488123156828.png", "type": "image" }, "x": 20, "y": 20, "w": 50, "h": 50, "from": "plugin"
            }
        )
        }).not.toThrow();
    })


    it('should thorw error with out exact image data', function(){
        expect(function(){
            ecEditor.dispatchEvent("org.ekstep.image:create",{
                "assetMedia": { "id": "do_1121907048923545601138", "src": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_1121907048923545601138/artifact/profile-_1488123156828.png", "type": "image" }, "x": 20, "y": 20, "w": 50, "h": 50, "from": "plugin"
            })
        }).toThrow()
    })

})
