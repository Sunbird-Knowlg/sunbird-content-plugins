EkstepEditor.basePlugin.extend({
    type: "image",
    useProxy: true,
    initialize: function() {
        EkstepEditor.eventManager.addEventListener("image:add", this.getImage, this);
        EkstepEditor.eventManager.addEventListener("imagebrowser:selected", this.addImage, this);
    },
    newInstance: function(data) {
        this.editorObj = data.props;
    },
    getImage: function() {
        EkstepEditor.eventManager.dispatchEvent('imagebrowser:show');
    },
    addImage: function(events, url) {
        
        var instance = this;
        (function addImageToStage(url) {            
            var imageURL = instance.useProxy ? "image/get/" + encodeURIComponent(url) : url;
            fabric.Image.fromURL(imageURL, function(img) {
                img.set({
                    top: 50,
                    left: 50,
                    width: 300,
                    height: 300
                });
                instance.create({ props: img });
            });
        })(url);
    },
    editor: function() {

    },
    onSelect: function(event) {

    },
    onRemove: function(event) {

    }
});
