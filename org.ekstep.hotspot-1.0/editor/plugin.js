/**
 * 
 * Simple plugin to create hotspot
 * @class hotspot
 * @extends EkstepEditor.basePlugin
 *
 * @author Sunil A S <sunils@ilimi.in>
 * @fires object:modified
 */
EkstepEditor.basePlugin.extend({
    type: "hotspot",
    initialize: function() {},
    /**
     *  @memberof hotspot
     *   creates new plugin instance with Hotspot shape
     */
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        if (this.attributes.type === 'rect') {
            this.editorObj = new fabric.Rect(props);
        }
    },
    onRemove: function(event) {

    },
    /**
     *   update attributes with shape properties from editorObj.
     *  @memberof hotspot
     *
     */
    updateAttributes: function() {
        var instance = this;
        var dataList = { "stroke-width": "stroke-width", "scaleX": "scaleX", "scaleY": "scaleY" };
        if (this) {
            _.forEach(dataList, function(val, key) {
                instance.attributes[key] = instance.editorObj.get(val);
            })
            this.attributes.radius = this.editorObj.rx;
        }
    },
    /**
     *
     *   update editorObj properties on config change
     *  @memberof hotspot
     *
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
     *
     *   get config data plugin instance
     *   @returns {Object}
     *   config object
     *  @memberof hotspot
     */
    getConfig: function() {
        return { color: this.attributes.fill };
    }
});
//# sourceURL=hotspotplugin.js
