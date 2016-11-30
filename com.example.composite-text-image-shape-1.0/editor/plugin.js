EkstepEditor.basePlugin.extend({
    type: "shape-text",
    thumbnail: undefined,
    onclick: undefined,
    initialize: function() {
    },
    text: undefined,
    shape: undefined,
    image: undefined,
    newInstance: function() {
        var props = _.merge({
                        fill: "rgb(255,255,255)",
                        stroke: "rgb(7,7,7)",
                        strokeDashArray: [5, 5],
                        strokeWidth: 1,
                        padding: 10,
                        lockMovementX: true,
                        lockMovementY: true,
                        lockScalingX: true,
                        lockScalingY: true
                    }, this.convertToFabric(this.attributes));
        console.log('props', props);
        this.editorObj = new fabric.Rect(props);
        if (this.editorObj) this.editorObj.setFill(props.fill);
    },
    moving: function(options, event) {
        
        this.children[0].editorObj.set("left", this.children[0].attributes.x + (this.editorObj.left - this.attributes.x));
        this.children[0].editorObj.set("top", this.children[0].attributes.y + (this.editorObj.top - this.attributes.y));
        

        this.children[1].editorObj.set("left", this.children[1].attributes.x + (this.editorObj.left - this.attributes.x));
        this.children[1].editorObj.set("top", this.children[1].attributes.y + (this.editorObj.top - this.attributes.y));
        
        this.children[0].editorObj.setCoords();
        this.children[1].editorObj.setCoords();
        /*
        this.children[0].editorObj.set("top", this.children[0].editorData.props.top + (this.editorObj.top - this.editorData.props.invisibleShape.top));
        this.children[1].editorObj.set("left", this.children[1].editorData.props.left + (this.editorObj.left - this.editorData.props.invisibleShape.left));
        this.children[1].editorObj.set("top", this.children[1].editorData.props.top + (this.editorObj.top - this.editorData.props.invisibleShape.top));
        this.children[0].editorObj.setCoords();
        this.children[1].editorObj.setCoords();
        */
    },
    added: function(instance, options, event) {
        console.log('composite plugin added');
        var lock = {
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true
        }
        if (instance.children.length === 0) {
            this.text = EkstepEditorAPI.instantiatePlugin('org.ekstep.text', _.cloneDeep(_.merge(lock, instance.data.text, instance.config.text)), instance, {
                selected: function(instance) {},
                deselected: function(instance) {},
                onConfigChange: function(key, value) {
                    this._super(key, value);
                    this.parent.config.text[key] = value;
                }
            });
            this.shape = EkstepEditorAPI.instantiatePlugin('org.ekstep.shape', _.cloneDeep(_.merge(lock, instance.data.shape, instance.config.shape)), instance, {
                onConfigChange: function(key, value) {
                    this._super(key, value);
                    this.parent.config.shape[key] = value;
                }
            });
            instance.data.image.assetMedia.src = EkstepEditor.config.absURL + instance.relativeURL(instance.data.image.assetMedia.src);
            this.image = EkstepEditorAPI.instantiatePlugin('org.ekstep.image', _.cloneDeep(_.merge(lock, instance.data.image, instance.config.image)), instance);
        }
    },
    addChild: function(plugin) {
        this._super(plugin);
        plugin.render(EkstepEditorAPI.getCanvas());
        if(plugin.manifest.id === 'org.ekstep.image') {
            var instance = this;
            plugin.editorObj.on('mousedown', function(e) { 
                EkstepEditorAPI.dispatchEvent('org.ekstep.assetbrowser:show', {
                    callback: function(data) {
                        instance.data.image.assetMedia = data.assetMedia;
                        instance.data.image.asset = data.asset;
                        EkstepEditorAPI.getCanvas().remove(plugin.editorObj);
                        instance.removeChild(plugin);
                        instance.image = EkstepEditorAPI.instantiatePlugin('org.ekstep.image', _.cloneDeep(_.merge({
                            lockMovementX: true,
                            lockMovementY: true,
                            lockScalingX: true,
                            lockScalingY: true
                        }, instance.data.image, instance.config.image)), instance);
                    }
                });
            });
        }
    },
    render: function(canvas) {
        canvas.add(this.editorObj);
        canvas.add(this.children[0].editorObj);
        canvas.add(this.children[1].editorObj);
        canvas.add(this.children[2].editorObj);
    },
    getMedia: function() {
        return this.children[2].getMedia();
    },
    getData: function() {
        var data = _.cloneDeep(this.data);
        data.text = _.merge(data.text, this.text.getRendererDimensions(), {id: this.text.id});
        data.shape = _.merge(data.shape, this.shape.getRendererDimensions(), {id: this.shape.id});
        data.image = _.merge(data.image, this.image.getRendererDimensions(), {id: this.image.id});
        delete data.image.assetMedia;
        return data;
    },
    getConfig: function() {
        var config = _.cloneDeep(this.config);
        config.text.fontSize = this.children[0].updateFontSize(config.text.fontSize, false);
        return config;
    }
});
//# sourceURL=compositeplugin.js