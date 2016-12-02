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
        this.attributes.x = 20;
        this.attributes.y = 20;
        this.attributes.w = 40;
        this.attributes.h = 40;
        this.percentToPixel(this.attributes);
        var instance = this;
        var _parent = this.parent;
        this.parent = undefined;
        var props = this.convertToFabric(this.attributes);
        delete props.width;
        delete props.height;
        var media = this.media[this.attributes.asset];
        media.src = media.src.replace('https://ekstep-public.s3-ap-southeast-1.amazonaws.com/', 'https://dev.ekstep.in/assets/public/')
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
    * open asset browser to get image data. 
    * @memberof image
    * 
    */
    openBrowser: function() {
        var instance = this;
        EkstepEditorAPI.dispatchEvent('org.ekstep.assetbrowser:show', {
            callback: function(data) {EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', data)}
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
    }
});
//# sourceURL=imageplugin.js
