EkstepEditor.basePlugin.extend({
    type: "unsupported",
    initialize: function() {
        EkstepEditorAPI.addEventListener("unsupported:invoke", this.showUnsupported, this);
    },
    props: {x: 0, y: 0, w: 40, h: 40, r: 0},
    hasDims: false,
    newInstance: function() {
        var instance = this;
        var _parent = this.parent; 
        this.parent = undefined;
        var props = this.setImageDimensions(this.data.data);        
        var imgSrc = EkstepEditorAPI.absURL + EkstepEditorAPI.getPluginRepo() + "/org.ekstep.unsupported-1.0/assets/unsupportedplugin.png";
        fabric.Image.fromURL(imgSrc, function(img) {
            instance.editorObj = img;
            instance.parent = _parent;
            instance.postInit();            
        },props);        
    },
    setImageDimensions: function(data) {
        var props = _.clone(this.props);
        if (_.has(data, ['x']) && _.has(data, ['w'])) {
            props.x = data.x;
            props.y = data.y;
            props.w = data.w;
            props.h = data.h;
            this.hasDims = true;
        }
        this.percentToPixel(props);
        return this.convertToFabric(props);
    },
    fromECML: function(data) {
        this.setData(data.data);
    },
    toECML: function() {
        if(this.hasDims) {
            this.pixelToPercent(this.attributes);
            this.data.data.x =  this.attributes.x;
            this.data.data.y =  this.attributes.y;
            this.data.data.w =  this.attributes.w;
            this.data.data.h =  this.attributes.h;
        }
        return this.data.data;
    },
    getConfig: function () {
    	
    },
    getAttributes: function () {
    		
    },
    getManifestId: function () {
    	return this.data.id;
    }
});

//# sourceURL=unsupportedPlugin.js
