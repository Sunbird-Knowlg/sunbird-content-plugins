org.ekstep.contenteditor.basePlugin.extend({
    initialize: function() {
    	var templatePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/collectionmeta.html");
        var controllerPath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/collectioneditormetaApp.js");                    
        org.ekstep.collectioneditor.api.registerMetaPage({
        	objectType: "TextBook",
        	templateURL: templatePath,
        	controllerURL: controllerPath
        });
    }	
});
//# sourceURL=textbookMeta.js
