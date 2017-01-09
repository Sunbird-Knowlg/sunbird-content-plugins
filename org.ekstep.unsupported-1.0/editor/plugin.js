EkstepEditor.basePlugin.extend({
    type: "unsupported",
    initialize: function() {
        EkstepEditorAPI.addEventListener("unsupported:invoke", this.showUnsupported, this);
    },
    props: {x: 0, y: 0, w: 40, h: 40, r: 0},
    newInstance: function() {
        var instance = this;
        var _parent = this.parent; 
        this.parent = undefined;
        this.props.x = this.props.y += 3;                    
        var props = _.clone(this.props);
        this.percentToPixel(props);     
        props = this.convertToFabric(props);                                     
        fabric.Image.fromURL('/app/images/unsupportedplugin.png', function(img) {            
            instance.editorObj = img;
            instance.parent = _parent;
            instance.postInit();            
        },props);        
    },
    fromECML: function(data) {
        this.setData(data.data);
    },
    toECML: function() {
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
