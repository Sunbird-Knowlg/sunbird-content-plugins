EkstepEditor.basePlugin.extend({
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener("imagebrowser:add", function(event, data) {
            data.media = {};
            data.media[data.asset] = { src: data.src };
            EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', data);
        }, this);
    },
    newInstance: function() {
        var instance = this;
        var _parent = this.parent;
        this.parent = undefined;
        var props = this.convertToFabric(this.attributes);
        this.media = this.attributes.media;
        var media = this.media[this.attributes.asset];
        var imageURL = EkstepEditorAPI.globalContext.useProxyForURL ? "image/get/" + encodeURIComponent(media.src) : media.src;
        fabric.Image.fromURL(imageURL, function(img) {
            instance.editorObj = img;
            instance.parent = _parent;
            instance.postInit();
        }, props);
    }
});
//# sourceURL=imageplugin.js