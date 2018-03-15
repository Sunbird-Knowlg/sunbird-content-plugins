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
        ecEditor.addEventListener('stage:add', function(event) {
            ecEditor.instantiatePlugin(instance.manifest.id, {}, ecEditor.getCurrentStage());
        });
        // While content load, event bus is disabled so, unable to catch `stage:add` event (for empty content by default new stage is created).
        // Creating the new instance on content loaded.
        ecEditor.addEventListener('content:load:complete', function(event) {
            var allStages = ecEditor.getAllStages();
            allStages.forEach(function (stage) {
                var addedNavigation = false;
                var stageChildren = stage.children;
                stageChildren.forEach(function (child) {
                    if(child.manifest.id == instance.manifest.id) {
                        addedNavigation = true;
                    }
                });
                if(!addedNavigation) {
                    ecEditor.instantiatePlugin(instance.manifest.id, {}, stage);
                }
            });
        });
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
    }
});
//# sourceURL=navigationEditorPlugin.js

