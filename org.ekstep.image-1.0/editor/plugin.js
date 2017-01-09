/**
 * 
 * Simple plugin to add image to stage
 * @class image
 * @extends EkstepEditor.basePlugin
 *
 * @author Sunil A S <sunils@ilimi.in>
 * @fires org.ekstep.assetbrowser:show
 * @fires org.ekstep.image:create 
 * @listens org.ekstep.image:assetbrowser:open
 */

EkstepEditor.basePlugin.extend({
    /**
    *  
    * Registers events.
    * @memberof image
    */
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":assetbrowser:open", this.openBrowser, this);
    },
    /**
    * 
    * Adds image to stage
    * @memberof image
    */
    newInstance: function() {                        
        var instance = this;
        var _parent = this.parent;
        this.parent = undefined;
        var props = this.convertToFabric(this.attributes);
        //delete props.width;
        //delete props.height;
        var media = this.media[this.attributes.asset];
        media.src = EkstepEditor.mediaManager.getMediaOriginURL(media.src);
        var imageURL = EkstepEditorAPI.globalContext.useProxyForURL ? "image/get/" + encodeURIComponent(media.src) : media.src;
        fabric.Image.fromURL(imageURL, function(img) {
            instance.editorObj = img;
            instance.parent = _parent;
            //instance.editorObj.scaleToWidth(props.w);
            instance.postInit();
        }, props);
    },
    /**    
    *      
    * open asset browser to get image data. 
    * @memberof image
    * 
    */
    openBrowser: function() {
        var instance = this;
        EkstepEditorAPI.dispatchEvent('org.ekstep.assetbrowser:show', {
            type: 'image',
            search_filter: {}, // All composite keys except mediaType
            callback: function(data) { 
                data.x = 20;
                data.y = 20;
                data.w = 50;
                data.h = 50;
                EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', data) 
            }
        });
    },
    /**
    * 
    * copy attributes of this instance.
    * @returns {Object}
    * @memberof image
    */
    getCopy: function() {
        var cp = this._super();
        cp.assetMedia = this.media[this.attributes.asset];
        return cp;
    },
    onConfigChange: function(key, value) {
        switch (key) {
            case "asset":
                EkstepEditorAPI.dispatchEvent('delete:invoke');
                EkstepEditorAPI.dispatchEvent(this.manifest.id + ':create', value)
                break;
        }
    }
});
//# sourceURL=imageplugin.js
