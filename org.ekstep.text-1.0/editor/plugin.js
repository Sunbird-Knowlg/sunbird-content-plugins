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
    onConfigChange: function(key, value) {
        switch (key) {
            case "fontweight":
                this.editorObj.setFontWeight(value ? "bold" : "normal");
                this.attributes.fontWeight = value;
                break;
            case "fontstyle":
                this.editorObj.setFontStyle(value ? "italic" : "normal");
                this.attributes.fontStyle = value;
                break;
            case "fontfamily":
                this.editorObj.setFontFamily(value);
                this.attributes.fontFamily = value;
                break;
            case "fontsize":
                this.editorObj.setFontSize(value);
                this.attributes.fontSize = value;
                break;
            case "color":
                this.editorObj.setFill(value);
                this.attributes.fill = value;
                break;
        }

        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    getConfig: function() {
        var config = { color: this.attributes.fill, fontfamily: this.attributes.fontFamily, fontsize: this.attributes.fontSize }
        config.fontweight = this.attributes.fontWeight || false;
        config.fontstyle = this.attributes.fontStyle || false;
        return config;
    },
    getProperties: function () {
        var props = _.omitBy(_.clone(this.attributes), _.isObject);
        props = _.omitBy(props, _.isNaN);
        delete props.__text;
        props.text = this.editorObj.text;
        return props;
    }
});
//# sourceURL=textplugin.js