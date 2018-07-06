org.ekstep.collectioneditor.basePlugin.extend({
    initialize: function() {
    	var templatePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/unitmeta.html");
        var controllerPath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/unitmetaApp.js");                    
        org.ekstep.collectioneditor.api.registerMetaPage({
        	objectType: ["TextBookUnit"],
            templateURL: require('./unitmeta.html'),
            controllerURL: require('./unitmetaApp'),
            allowTemplateCache: true
        });
    }	
});
//# sourceURL=textbookMeta.js
