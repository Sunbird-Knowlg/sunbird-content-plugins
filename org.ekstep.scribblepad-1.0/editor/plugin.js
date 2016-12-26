/**
 * 
 * Simple plugin to create scribblepad
 * @class scribblePad
 * @extends EkstepEditor.basePlugin
 *
 * @author Sunil A S <sunils@ilimi.in>
 * @fires object:modified
 */
EkstepEditor.basePlugin.extend({
    type: "org.ekstep.scribblepad",
    initialize: function() {},
    /**
    *
    *   invoked by framework when instantiating plugin instance.
    *   Creates and adds scribblepad shape to stage.
    *   @memberof scribblePad
    */
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        props.stroke = 1;
        props.strokeWidth = 2;
        props.strokeDashArray = [5, 5];
        if (this.attributes.type === 'roundrect') {
            this.editorObj = new fabric.Rect(props);
            this.addMedia({
                id: "org.ekstep.scribblepad.eraser",
                src: EkstepEditor.config.baseURL + "/assets/public/content/1460624453530trash.png",
                assetId: "org.ekstep.scribblepad.eraser",
                type: "image",
                preload: true
            });
        }
    },
    /**
     *   update attributes with shape properties from editorObj.
     *    
     *
     *   @memberof scribblePad
     */

    updateAttributes: function() {
        var instance = this;
        var dataList = { "radius": "radius", "opacity": "opacity", "stroke": "stroke", "stroke-width": "stroke-width", "scaleX": "scaleX", "scaleY": "scaleY" };
        if (instance) {
            EkstepEditorAPI._.forEach(dataList, function(val, key) {
                instance.attributes[key] = instance.editorObj.get(val);
            })
        }
    },
    /**
     *
     *   update editorObj properties on config change
     *   
     *
     *   @memberof scribblePad
     */

    onConfigChange: function(key, value) {
        if (key === 'color') {
            this.editorObj.setFill(value);
            this.attributes.fill = value;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    /** 
     *   set scribblepad properties for ECML
     *  @override
     *  @returns {Object}
     *  ECML properties for scribblepad
     *   @memberof scribblePad
     */
    getAttributes: function() {
        var attr = this._super();
        delete attr.strokeDashArray;
        attr['stroke-width'] = 1;
        attr['opacity'] = 0.3;
        attr.stroke = '#663300';
        attr.thickness = 2;
        return attr;
    },
    /**
    *
    *   get config data plugin instance
    *   @returns {Object}
    *   config object
    *   @memberof scribblePad
    */
    getConfig: function() {
        var config = this._super();
        config.color = this.attributes.fill;
        return config;
    }
});
//# sourceURL=scribblepadplugin.js
