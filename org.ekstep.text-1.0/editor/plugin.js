EkstepEditor.basePlugin.extend({
    type: "text",
    magicNumber: 1920,
    editorWidth: 720,
    initialize: function() {
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("stage:unselect", this.stageUnselect, this);
    },
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        delete props.__text;
        this.editorObj = new fabric.ITextbox(this.attributes.__text, props);
        if(this.attributes.__text == '') {
            textEditor.showEditor(this.id);
        }
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
        var attributes = _.omit(_.clone(this.attributes), ['top', 'left', 'width', 'height', 'fontFamily', 'fontfamily', 'fontSize', 'fontstyle', 'fontweight', 'scaleX', 'scaleY']);
        attributes.font = this.editorObj.get('fontFamily');
        attributes['__text'] = this.editorObj.get('text');
        attributes.fontsize = this.updateFontSize(this.editorObj.get('fontSize'), false);
        var fontWeight = _.isUndefined(this.editorObj.get("fontWeight")) ? "" : this.editorObj.get("fontWeight");
        var fontStyle = _.isUndefined(this.editorObj.get("fontStyle")) ? "" : this.editorObj.get("fontStyle");
        attributes.weight = (fontWeight + ' ' + fontStyle).trim();
        return attributes;
    },
    onConfigChange: function(key, value) {
        switch (key) {
            case "fontweight":
                this.editorObj.setFontWeight(value ? "bold" : "normal");
                this.attributes.fontweight = value;
                break;
            case "fontstyle":
                this.editorObj.setFontStyle(value ? "italic" : "normal");
                this.attributes.fontstyle = value;
                break;
            case "fontfamily":
                this.editorObj.setFontFamily(value);
                this.attributes.fontFamily = value;
                this.attributes.fontfamily = value;
                break;
            case "fontsize":
                this.editorObj.setFontSize(value);
                this.attributes.fontSize = value;
                break;
            case "color":
                this.editorObj.setFill(value);
                this.attributes.color = value;
                break;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    getConfig: function() {
        var config = { color: this.attributes.color || this.attributes.fill, fontfamily: this.attributes.fontFamily, fontsize: this.attributes.fontSize }
        config.fontweight = this.attributes.fontweight || false;
        config.fontstyle = this.attributes.fontstyle || false;
        return config;
    },
    getProperties: function() {
        var props = _.omitBy(_.clone(this.attributes), _.isObject);
        props = _.omitBy(props, _.isNaN);
        delete props.__text;
        props.text = this.editorObj.text;
        return props;
    },
    updateFontSize: function(initFontSize, flag) {
        var fontsize = undefined;
        if (flag) { // from ECML conversion
            var exp = this.attributes.w * (this.magicNumber / 100);
            var width = this.editorWidth * this.attributes.w / 100;
            fontsize = parseInt(Math.round(initFontSize * (width / exp)).toString());
        } else { // to ECML conversion
            var exp = (this.editorObj.width / this.magicNumber) * 100;
            var width = (this.editorObj.width / this.editorWidth) * 100;
            var newfontsize = (initFontSize * (this.editorObj.scaleX || 1))
            fontsize = parseFloat((newfontsize * (width / exp)).toFixed(2));
        }
        return fontsize;
    },
    convertToFabric: function(data) {
        var retData = _.clone(data);
        if (data.x) retData.left = data.x;
        if (data.y) retData.top = data.y;
        if (data.w) retData.width = data.w;
        if (data.h) retData.height = data.h;
        if (data.radius) retData.rx = data.radius;
        if (data.color) retData.fill = data.color;
        if (data.weight && _.includes(data.weight, 'bold')) {
            retData.fontWeight = "bold";
            data.fontweight = true;
        } else { data.fontweight = false; }
        if (data.weight && _.includes(data.weight, 'italic')) {
            retData.fontStyle = "italic";
            data.fontstyle = true;
        } else {data.fontstyle = false;}
        if (data.font) {
            retData.fontFamily = data.font;
            data.fontFamily = data.font
        }
        if (data.fontsize) {
            var fontSize = this.updateFontSize(data.fontsize, true);
            retData.fontSize = fontSize;
            data.fontSize = fontSize;
        };
        return retData;
    }
});
//# sourceURL=textplugin.js
