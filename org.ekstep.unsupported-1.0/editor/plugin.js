EkstepEditor.basePlugin.extend({
    type: "unsupported",
    initialize: function() {
        EkstepEditorAPI.addEventListener("unsupported:invoke", this.showUnsupported, this);
    },
    newInstance: function() {
        var instance = this;
        var _parent = this.parent;
        var imageData = 'data:image/png;base64,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'
        var img = EkstepEditorAPI.jQuery('<img>',{'id':'unsupportedPluginImg','style':'display:none;','src':imageData});
        if(EkstepEditorAPI.jQuery("#unsupportedPluginImg").length === 0){EkstepEditorAPI.jQuery(img).appendTo('body');}
                fabric.Image.fromURL(document.getElementById('unsupportedPluginImg').src, function(img) {
                		instance.editorObj = img;
				            instance.parent = _parent;
				            instance.postInit();
				            instance.editorObj.selection = false;
                }, { 'left': 0, 'top': 0});
    },
    fromECML: function(data) {
        this.setData(data.data);
    },
    toECML: function() {
        return this.data.data;
    },
    getConfig: function () {
    	
    },
    getAttributes: function () {
    		
    },
    getManifestId: function () {
    	return this.data.id;
    }
});

//# sourceURL=unsupportedPlugin.js
