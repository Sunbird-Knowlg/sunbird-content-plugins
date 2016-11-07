EkstepEditor.basePlugin.extend({
    type: "image",
    initialize: function() {
        EkstepEditor.eventManager.addEventListener("image:getImage", this.getImage, this);
    },
    newInstance: function(data) {
        if (data.type === "image") this.editorObj = data.props;
    },
    getImage: function() {
        //TODO: get image from image browser and load the image
        var instance = this;
        fabric.Image.fromURL("plugins/org.ekstep.image-1.0/assets/try_again_popup.png", function(img) {
            console.log("image added");
            img.set({
                top: 50,
                left: 50
            });
            instance.addImage({}, img);
        });
    },
    addImage: function(event, data) {
        this.create({ type: 'image', props: data });
    },

    editor: function() {

    },
    onSelect: function(event) {

    },
    onRemove: function(event) {

    }
});
