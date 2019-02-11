'use strict'

describe('Preview Plugin', function () {

   var pluginInstance;
   beforeAll(function () {
      pluginInstance = ecEditor.instantiatePlugin("org.ekstep.preview");
   })


   it('should instantiate the plugin ', function () {
      spyOn(pluginInstance, "initialize").and.callThrough();
      pluginInstance.initialize();
      expect(pluginInstance.initialize).toHaveBeenCalled();
   })


   it('should Register all the events before dispatching', function () {
      expect(ecEditor.hasEventListener('atpreview:show')).toBe(true);
   })


   it('should invoke the callback function of the dispatched event', function () {
      spyOn(pluginInstance, "showPreview").and.callThrough();
      ecEditor.dispatchEvent('atpreview:show', { target: undefined, type: "atpreview:show" }, {
         "contentBody": {
            "theme": {
               "id": "theme",
               "version": "1.0",
               "startStage": "4bcadeba-928e-4cae-bb9d-a75bd2990d9b",
               "stage": [
                  {
                     "x": 0,
                     "y": 0,
                     "w": 100,
                     "h": 100,
                     "id": "4bcadeba-928e-4cae-bb9d-a75bd2990d9b",
                     "rotate": null,
                     "config": {
                        "__cdata": "{\"opacity\":100,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"#FFFFFF\",\"genieControls\":false,\"instructions\":\"\"}"
                     },
                     "manifest": {
                        "media": [

                        ]
                     },
                     "hotspot": [
                        {
                           "type": "roundrect",
                           "y": 20,
                           "x": 20,
                           "fill": "rgb(255,0,0)",
                           "w": 15,
                           "h": 25,
                           "opacity": 0.3,
                           "stroke": "rgba(255, 255, 255, 0)",
                           "strokeWidth": 1,
                           "rotate": 0,
                           "z-index": 0,
                           "id": "cb26b83b-3e83-4a9e-94e6-7a78c0d16705",
                           "config": {
                              "__cdata": "{\"opacity\":30,\"strokeWidth\":1,\"stroke\":\"rgba(255, 255, 255, 0)\",\"autoplay\":false,\"visible\":true,\"color\":\"rgb(255,0,0)\"}"
                           }
                        }
                     ]
                  }
               ],
               "manifest": {
                  "media": [
                     {
                        "id": "bed35370-0ed8-450c-838c-054b05937232",
                        "plugin": "org.ekstep.navigation",
                        "ver": "1.0",
                        "src": "/plugins/org.ekstep.navigation-1.0/renderer/controller/navigation_ctrl.js",
                        "type": "js"
                     },
                     {
                        "id": "7e5b9266-38d7-4d4d-b6e3-4b2a57d0c366",
                        "plugin": "org.ekstep.navigation",
                        "ver": "1.0",
                        "src": "/plugins/org.ekstep.navigation-1.0/renderer/templates/navigation.html",
                        "type": "js"
                     },
                     {
                        "id": "org.ekstep.navigation",
                        "plugin": "org.ekstep.navigation",
                        "ver": "1.0",
                        "src": "/plugins/org.ekstep.navigation-1.0/renderer/plugin.js",
                        "type": "plugin"
                     },
                     {
                        "id": "org.ekstep.navigation_manifest",
                        "plugin": "org.ekstep.navigation",
                        "ver": "1.0",
                        "src": "/plugins/org.ekstep.navigation-1.0/manifest.json",
                        "type": "json"
                     }
                  ]
               },
               "plugin-manifest": {
                  "plugin": [
                     {
                        "id": "org.ekstep.navigation",
                        "ver": "1.0",
                        "type": "plugin",
                        "depends": ""
                     }
                  ]
               },
               "compatibilityVersion": 2
            }
         },
         "currentStage": true
      });
      expect(pluginInstance.showPreview).toHaveBeenCalled();
      
   })
})