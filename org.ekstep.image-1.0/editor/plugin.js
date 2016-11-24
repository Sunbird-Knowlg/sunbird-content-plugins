EkstepEditor.basePlugin.extend({
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener("imagebrowser:add", function(event, data) {
            EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', data);
        }, this);
    },
    newInstance: function() {
        var instance = this;
        var _parent = this.parent;
        this.parent = undefined;
        var props = this.convertToFabric(this.attributes);
        var media = this.media[this.attributes.asset];
        var imageURL = EkstepEditorAPI.globalContext.useProxyForURL ? "image/get/" + encodeURIComponent(media.src) : media.src;
        fabric.Image.fromURL(imageURL, function(img) {
            instance.editorObj = img;
            instance.parent = _parent;
            instance.postInit();
        }, props);
    },
    getCopy: function() {
        var cp = this._super();
        cp.assetMedia = this.media[this.attributes.asset];
        return cp;
    }
});
//# sourceURL=imageplugin.js