/**
 * 
 * Simple plugin to add audio to stage
 * @class audio
 * @extends EkstepEditor.basePlugin
 *
 * @author Sunil A S <sunils@ilimi.in>
 * @fires org.ekstep.assetbrowser:show
 * @fires org.ekstep.audio:create 
 * @listens org.ekstep.audio:assetbrowser:open
 */

EkstepEditor.basePlugin.extend({
    /**
     *  
     * Registers events.
     * @memberof audio
     */
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":assetbrowser:open", this.openBrowser, this);
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":removeAudio", this.removeAudio, this);
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":toggleAudio", this.toggleAudio, this);
    },
    /**
     * 
     * Adds audio to stage
     * @memberof audio
     */
    newInstance: function() {
        var media = this.media[this.attributes.asset];
        this.id = media.id;
        media.src = EkstepEditor.mediaManager.getMediaOriginURL(media.src);
        EkstepEditor.mediaManager.addMedia(media);
        EkstepEditorAPI.dispatchEvent("org.ekstep.stageconfig:addcomponent", { 
            stageId: EkstepEditorAPI.getCurrentStage().id,
            type: 'audio', 
            title: media.id
        });
    },
    /**    
     *      
     * open asset browser to get audio data. 
     * @memberof audio
     * 
     */
    openBrowser: function() {
        var instance = this;
        EkstepEditorAPI.dispatchEvent('org.ekstep.assetbrowser:show', {
            type: 'audio',
            search_filter: {}, // All composite keys except mediaType
            callback: function(data) { EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', data) }
        });
    },
    /**
     * 
     * copy attributes of this instance.
     * @returns {Object}
     * @memberof audio
     */
    getCopy: function() {
        var cp = this._super();
        cp.assetMedia = this.media[this.attributes.asset];
        return cp;
    },
    onConfigChange: function(key, value) {
        EkstepEditorAPI.dispatchEvent('delete:invoke');
        EkstepEditorAPI.dispatchEvent(this.manifest.id + ':create', value)
    },
    render: function(canvas) {
        //do nothing, since there is no editorObj
    },
    removeAudio: function(event, data) {
        var htextArr = [], 
            audioArr = [];
        var mediaArr = EkstepEditorAPI.getAllPluginInstanceByTypes();
        _.forEach(mediaArr, function(val, key) {
            if(val.manifest.shortId === 'htext'){
                htextArr[key] = val.attributes.audio;
            }else if(val.manifest.shortId === 'audio'){
                audioArr[key] = val.attributes.asset;
            }
        });
        if(_.indexOf(htextArr, data.asset) === -1){
            EkstepEditorAPI.getCurrentStage().children.splice(_.indexOf(audioArr, data.asset), 1);
            EkstepEditorAPI.dispatchEvent('org.ekstep.stageconfig:remove', data);
        }
    },
    toggleAudio: function(event, data){
        var mediaArr = EkstepEditorAPI.getAllPluginInstanceByTypes();
        _.forEach(mediaArr, function(val, key) {
            if (!_.isUndefined(val.media) && val.media[data.asset]) {
                EkstepEditorAPI.dispatchEvent('org.ekstep.config:toggleStageEvent', {'flag': data.autoplay, 'id':data.asset});
            }
        }); 
    }
});
//# sourceURL=audioplugin.js
