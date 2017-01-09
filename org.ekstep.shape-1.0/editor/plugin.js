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
                this.manifest.editor.configManifest.push({
                    "propertyName": "radius",
                    "title": "Radius",
                    "placeholder": "Radius",
                    "description": "Input radius for the ellipse",
                    "dataType": "input",
                    "valueType": "number",
                    "required": false,
                    "defaultValue": 64
                });                
                this.editorObj = new fabric.Ellipse(props);
                break;
            case 'roundrect':
                this.manifest.editor.configManifest.push({
                    "propertyName": "radius",
                    "title": "Radius",
                    "placeholder": "Radius",
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
                if (this.attributes.type == 'ellipse') {
                    this.editorObj.set({ 'w': value * 2 });
                    this.editorObj.set({ 'h': value * 2 });
                    this.attributes.w = value * 2;
                    this.attributes.h = value * 2;
                }
                this.editorObj.set({ 'rx': value });
                this.editorObj.set({ 'ry': value });
                this.attributes.radius = value;
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
        var config = this._super();
        config.color = this.attributes.fill;
        if (this.attributes.type == 'roundrect') {
            config.radius = this.editorObj.rx;
        }
        if (this.attributes.type == 'ellipse') {
            config.radius = this.editorObj.rx;
        }
        return config;
    }
});
//# sourceURL=shapeplugin.js
