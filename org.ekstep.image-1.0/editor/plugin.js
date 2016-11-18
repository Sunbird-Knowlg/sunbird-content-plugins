EkstepEditor.basePlugin.extend({
    type: "image",
    useProxy: true,
    initialize: function() {
        EkstepEditor.eventManager.addEventListener("image:add", this.getImage, this);
        EkstepEditor.eventManager.addEventListener("imagebrowser:selected", this.addImage, this);
    },
    newInstance: function() {
        this.editorObj = this.attributes.imageObj;
    },
    getImage: function() {
        EkstepEditor.eventManager.dispatchEvent('imagebrowser:show');
    },
    addImage: function(events, url) {
        var instance = this;
        var imageURL = instance.useProxy ? "image/get/" + encodeURIComponent(url) : url;
        console.log("imageUrl:", imageURL);
        fabric.Image.fromURL(imageURL, function(img) {
            img.set({
                top: 50,
                left: 50,
                width: 300,
                height: 300
            });
            var data = {
                x: 20,
                y: 20,
                w: 50,
                h: 50,
                url: imageURL,
                imageObj: img
            };

            EkstepEditor.eventManager.dispatchEvent('org.ekstep.image:create', data);
        });



    },
    editor: function() {

    },
    onSelect: function(event) {

    },
    onRemove: function(event) {

    }
});
//# sourceURL=imageplugin.js