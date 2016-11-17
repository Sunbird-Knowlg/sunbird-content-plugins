EkstepEditor.basePlugin.extend({
    type: "shape",
    initialize: function() {},
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        switch (this.attributes.type) {
            case 'ellipse':
                props.rx = props.r;
                props.ry = props.r;
                this.editorObj = new fabric.Ellipse(props);
                break;
            case 'roundrect':
                this.manifest.editor.config.push({
                    "propertyName": "radius",
                    "title": "Radius",
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
    onConfigChange: function(key, value) {
        switch (key) {
            case 'color':
                this.editorObj.setFill(value);
                this.attributes.fill = value;
                break;
            case 'radius':
                this.editorObj.set({ 'rx': value });
                this.attributes.radius = value;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    getConfig: function() {
        var config = { color: this.attributes.fill };
        if (this.attributes.type == 'roundrect') {
            config.radius = 10;
        }
        return config;
    },
    getHelp: function() {
        var help = "";
        EkstepEditor.loadResource('/plugins/org.ekstep.shape-1.0/editor/help.md', 'text', function(err, data) {
            if (err) {
                help = 'Unable to load help';
            } else {
                help = data;
            }
        });
        return help;
    }
});
