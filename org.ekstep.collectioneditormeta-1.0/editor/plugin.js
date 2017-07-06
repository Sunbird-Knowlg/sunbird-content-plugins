org.ekstep.contenteditor.basePlugin.extend({
    initialize: function() {
    	var templatePath = ecEditor.resolvePluginResource("org.ekstep.collectioneditormeta", "1.0", "editor/metadetails.html");
        var controllerPath = ecEditor.resolvePluginResource("org.ekstep.collectioneditormeta", "1.0", "editor/collectioneditormetaApp.js");                    
        org.ekstep.collectioneditor.api.registerMetaPage({
        	objectType: "TextBook",
        	templateURL: templatePath,
        	controllerURL: controllerPath
        });
    }	
});
//# sourceURL=textbookMeta.js
