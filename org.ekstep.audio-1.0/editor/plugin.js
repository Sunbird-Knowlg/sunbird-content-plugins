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
    },
    /**
    * 
    * Adds audio to stage
    * @memberof audio
    */
    newInstance: function() {
        var instance = this;
        var _parent = this.parent;
        var props = this.convertToFabric(this.attributes);
        delete props.width;
        delete props.height;
        var media = this.media[this.attributes.asset];
        media.src = EkstepEditor.mediaManager.getMediaOriginURL(media.src);
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
    }
});
//# sourceURL=audioplugin.js
