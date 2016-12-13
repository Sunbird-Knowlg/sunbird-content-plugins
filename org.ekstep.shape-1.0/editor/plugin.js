/**
 * 
 * Simple plugin to create geometrical shapes
 * @class shape
 * @extends EkstepEditor.basePlugin
 *
 * @author Sunil A S <sunils@ilimi.in>
 * @fires object:modified
 */
EkstepEditor.basePlugin.extend({
    type: "shape",
    initialize: function() {},
    /**
     *
     *   invoked by framework when instantiating plugin instance.
     *   Creates following shapes: Circle, Rectangle, Round Rectangle
     *   @memberof shape
     *
     */
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        switch (this.attributes.type) {
            case 'ellipse':
                props.rx = props.w / 2;
                props.ry = props.h / 2;
                this.editorObj = new fabric.Ellipse(props);
                break;
            case 'roundrect':
                this.manifest.editor.config.push({
                    "propertyName": "radius",
                    "title": "Radius",
                    "placeholder":"Radius",
                    "description": "Input radius for the rounded rectangle",
                    "dataType": "input",
                    "valueType": "number",
                    "required": false,
                    "defaultValue": 10
                });
                this.editorObj = new fabric.Rect(props);
                break;
            case 'rect':
                this.editorObj = new fabric.Rect(props);
                break;
            default:
        }
        if (this.editorObj) this.editorObj.setFill(props.fill);
    },
    /**
     *
     *   update editorObj properties on config change
     *   @memberof shape
     *   
     *
     */
    onConfigChange: function(key, value) {
        switch (key) {
            case 'color':
                this.editorObj.setFill(value);
                this.attributes.fill = value;
                break;
            case 'radius':
                this.editorObj.set({ 'rx': value });
                this.attributes.radius = value;
                break;
            case 'opacity':
                this.editorObj.setOpacity(value/100);
                this.attributes.opacity = value/100;
                break;
            case 'strokeWidth':    
                value = parseInt(value);
                this.editorObj.set('strokeWidth', value);
                this.attributes['stroke-width'] = value;
                this.attributes['strokeWidth'] = value;
                break;
            case 'stroke':
                this.editorObj.setStroke(value);
                this.attributes.stroke = value;    
                break;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    /**
     *
     *   get config data plugin instance
     *   @returns {Object}
     *   config object
     *   @memberof shape
     */
    getConfig: function() {
        var config = { color: this.attributes.fill, opacity: (this.attributes.opacity*100), strokeWidth: this.attributes.strokeWidth, stroke: this.attributes.stroke};
        if (this.attributes.type == 'roundrect') {
            config.radius = 10;
        }
        return config;
    }
});
//# sourceURL=shapeplugin.js
