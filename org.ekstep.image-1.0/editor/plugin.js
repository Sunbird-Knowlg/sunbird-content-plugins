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
        var imageURL = EkstepEditorAPI.globalContext.useProxyForURL ? "image/get/" + encodeURIComponent(props.src) : props.src;
        fabric.Image.fromURL(imageURL, function(img) {
            instance.editorObj = img;
            instance.parent = _parent;
            instance.postInit();
        }, props);
    }
});
//# sourceURL=imageplugin.js