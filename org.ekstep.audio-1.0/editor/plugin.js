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
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":jplayerInit", this.jplayerInit, this);
    },
    /**
     * 
     * Adds audio to stage
     * @memberof audio
     */
    newInstance: function() {
        var media = this.media ? this.media[this.attributes.asset] : undefined;
        //this.id = media.id;
        if (media && media.src) {
            media.src = EkstepEditor.mediaManager.getMediaOriginURL(media.src);
            EkstepEditor.mediaManager.addMedia(media);
            EkstepEditorAPI.dispatchEvent("org.ekstep.stageconfig:addcomponent", { 
                stageId: EkstepEditorAPI.getCurrentStage().id,
                type: 'audio', 
                title: (EkstepEditorAPI._.isUndefined(media.name)) ? media.id : media.name,
                id: media.id,
                url: media.src
            });
        } else {
            this.parent = undefined;
        }
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
        EkstepEditorAPI._.forEach(mediaArr, function(val, key) {
            if(val.manifest.shortId === 'htext'){
                htextArr[key] = val.attributes.audio;
            }else if(val.manifest.shortId === 'audio'){
                audioArr[key] = val.attributes.asset;
            }
        });
        if(EkstepEditorAPI._.indexOf(htextArr, data.asset) === -1){
            EkstepEditorAPI.getCurrentStage().children.splice(EkstepEditorAPI._.indexOf(audioArr, data.asset), 1);
            EkstepEditorAPI.dispatchEvent('org.ekstep.stageconfig:remove', data);
        }
    },
    toggleAudio: function(event, data){
        var mediaArr = EkstepEditorAPI.getAllPluginInstanceByTypes();
        EkstepEditorAPI._.forEach(mediaArr, function(val, key) {
            if (!EkstepEditorAPI._.isUndefined(val.media) && val.media[data.asset]) {
                EkstepEditorAPI.dispatchEvent('org.ekstep.config:toggleStageEvent', {'flag': data.autoplay, 'id':data.asset});
            }
        }); 
    },
    jplayerInit: function(event, data){
        var id = data.id;
        EkstepEditorAPI.jQuery("#"+id).jPlayer({
            swfPath: 'js/jplayer/',
            supplied: 'mp3',
            solution: 'html, flash',
            preload: 'auto',
            wmode: 'window',
            ready: function() {
                EkstepEditorAPI.jQuery(this).jPlayer("setMedia", {
                    mp3: data.url
                }).jPlayer('play');
            },
            play: function() {
                EkstepEditorAPI.jQuery(this).addClass('pause');
            },
            pause: function() {
                EkstepEditorAPI.jQuery(this).removeClass('pause');
            },
            stop: function() {
                EkstepEditorAPI.jQuery(this).removeClass('pause');
            }
        });
        if(!EkstepEditorAPI.jQuery("#"+id).hasClass('pause')){
            EkstepEditorAPI.jQuery("#"+id).jPlayer('play');
        }else{
            EkstepEditorAPI.jQuery("#"+id).jPlayer('pause');
        }
    }
});
//# sourceURL=audioplugin.js
