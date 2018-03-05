/**
 * @class  org.ekstep.navigation.EditorPlugin
 */
org.ekstep.contenteditor.basePlugin.extend({

    /**
     * @memberOf org.ekstep.navigation.EditorPlugin#
     */
    initialize:function() {
        var instance = this;
        // For every new stage create navigation plugin instance.
        ecEditor.addEventListener('stage:add', this.createInstance);
        // While content load, event bus is disabled so, unable to catch `stage:add` event (for empty content by default new stage is created).
        // Creating the new instance on content loaded.
        ecEditor.addEventListener('content:load:complete', this.createInstance);
    },

    newInstance: function() {
        var nextImage = ecEditor.resolvePluginResource(this.manifest.id, '1.0', 'renderer/assets/next.png');
        this.addMedia({
            id: "nextImage",
            src: org.ekstep.contenteditor.mediaManager.getMediaOriginURL(nextImage),
            assetId: "nextImage",
            type: "image",
            preload: true
        });
        var preImage = ecEditor.resolvePluginResource(this.manifest.id, '1.0', 'renderer/assets/previous.png');
        this.addMedia({
            id: "preImage",
            src: org.ekstep.contenteditor.mediaManager.getMediaOriginURL(preImage),
            assetId: "preImage",
            type: "image",
            preload: true
        });
    },

    createInstance: function() {
        ecEditor.instantiatePlugin(instance.manifest.id, {}, ecEditor.getCurrentStage());
    }
});
//# sourceURL=navigationEditorPlugin.js

