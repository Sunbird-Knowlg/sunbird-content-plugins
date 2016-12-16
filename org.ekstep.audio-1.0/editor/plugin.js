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
        if (!this.attributes.x) 
        {
            this.attributes.x = 20;
            this.attributes.y = 20;
            this.attributes.w = 40;
            this.attributes.h = 40;
            this.percentToPixel(this.attributes);
        }
        var instance = this;
        var _parent = this.parent;
        this.parent = undefined;
        var props = this.convertToFabric(this.attributes);
        delete props.width;
        delete props.height;
        var media = this.media[this.attributes.asset];
        media.src = EkstepEditor.mediaManager.getMediaOriginURL(media.src);
        var imageURL = EkstepEditorAPI.globalContext.useProxyForURL ? "image/get/" + encodeURIComponent(media.src) : media.src;
        fabric.Image.fromURL(imageURL, function(img) {
            instance.editorObj = img;
            instance.parent = _parent;
            instance.editorObj.scaleToWidth(props.w);
            instance.postInit();
        }, props);
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
