EkstepEditor.basePlugin.extend({
    type: "text",
    initialize: function() {
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("stage:unselect", this.stageUnselect, this);
    },
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        delete props.__text;
        this.editorObj = new fabric.ITextbox(this.attributes.__text, props);
        textEditor.showEditor(this.id);
    },
    selected: function(instance) {
        fabric.util.addListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    deselected: function(instance, options, event) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    objectUnselected: function(event, data) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    dblClickHandler: function() {
        textEditor.showEditor(EkstepEditorAPI.getEditorObject().id);
    },
    stageUnselect: function(data) {
        textEditor.hide();
    },
    getAttributes: function() {
        var instance = this;
        var dataList = {
            "__text": "text",
            "opacity": "opacity",
            "scaleX": "scaleX",
            "scaleY": "scaleY",
            "align": "textAlign",
            "valign": "vAlign"
        };
        if (this) {
            _.forEach(dataList, function(val, key) {
                instance.attributes[key] = instance.editorObj.get(val);
            })
            var fontWeight = _.isUndefined(this.editorObj.get("fontWeight")) ? "" : this.editorObj.get("fontWeight");
            var fontStyle = _.isUndefined(this.editorObj.get("fontStyle")) ? "" : this.editorObj.get("fontStyle");
            this.attributes.weight = (fontWeight + ' ' + fontStyle).trim();
        }
        return this.attributes;
    },
    onConfigChange: function(data) {
        if (data.color) {
            EkstepEditorAPI.getCurrentObject().editorObj.setFill(data.color);
            EkstepEditorAPI.getCurrentObject().config.color = data.color;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    }
});
