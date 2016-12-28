/**
 * Text
 * The purpose of {@link TextPlugin} is used to create or modifiy the text in editor
 *
 * @class Text
 * @extends EkstepEditor.basePlugin
 *
 * @author Harishkumar Gangula <harishg@ilimi.in>
 */
EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof Text
     */
    type: "text",
    /**
     * Magic Number is used to calculate the from and to ECML conversion 
     * @member {Number} magicNumber
     * @memberof Text
     */
    magicNumber: 1920,
    /**
     * Editor Width is used to calculate the from and to ECML conversion 
     * @member {Number} editorWidth
     * @memberof Text
     */
    editorWidth: 720,
    /**
     * The events are registred which are used which are used to add or remove fabric events and other custom events
     * @memberof Text
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("stage:unselect", this.stageUnselect, this);
    },
    /**
     * This method used to create the text fabric object and assigns it to editor of the instance
     * convertToFabric is used to convert attributes to fabric properties 
     * It shows the text editor popup to enter text to add it to canvas editor fabric object
     * @memberof Text
     */
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        delete props.__text;
        this.editorObj = new fabric.ITextbox(this.attributes.__text, props);
        if (this.attributes.__text == '') {
            textEditor.showEditor(this.id);
        }
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and here we double click event is added
     * @memberof Text
     */
    selected: function(instance) {
        fabric.util.addListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and here we double click event is removed
     * @memberof Text
     */
    deselected: function(instance, options, event) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method is called when the object:unselected event is fired
     * It will remove the double click event for the canvas
     * @memberof Text
     */
    objectUnselected: function(event, data) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method is callback for double click event which will call the textEditor to show the ediotor to add or modify text.
     * @memberof Text
     */
    dblClickHandler: function() {
        var leftSt = EkstepEditorAPI.jQuery("#canvas").offset().left + EkstepEditorAPI.getCurrentObject().editorObj.left;
        var leftEnd = leftSt + EkstepEditorAPI.getCurrentObject().editorObj.width;
        var topSt = EkstepEditorAPI.jQuery("#canvas").offset().top + EkstepEditorAPI.getCurrentObject().editorObj.top;
        var topEnd = topSt + EkstepEditorAPI.getCurrentObject().editorObj.height;
        if(event.clientX > leftSt && event.clientX < leftEnd && event.clientY > topSt && event.clientY < topEnd){
            textEditor.showEditor(EkstepEditorAPI.getEditorObject().id);
        }
    },
    /**
     * This method is called when the stage:unselect event is fired,
     * It will hide the texteditor
     * @memberof Text
     */
    stageUnselect: function(data) {
        textEditor.hide();
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and this will provide attributes to generate content for Genie
     * @memberof Text
     */
    getAttributes: function() {
        var attributes = EkstepEditorAPI._.omit(EkstepEditorAPI._.clone(this.attributes), ['top', 'left', 'width', 'height', 'fontFamily', 'fontfamily', 'fontSize', 'fontstyle', 'fontweight', 'scaleX', 'scaleY']);
        attributes.font = this.editorObj.get('fontFamily');
        attributes['__text'] = this.editorObj.get('text');
        attributes.fontsize = this.updateFontSize(this.editorObj.get('fontSize'), false);
        var fontWeight = EkstepEditorAPI._.isUndefined(this.editorObj.get("fontWeight")) ? "" : this.editorObj.get("fontWeight");
        var fontStyle = EkstepEditorAPI._.isUndefined(this.editorObj.get("fontStyle")) ? "" : this.editorObj.get("fontStyle");
        attributes.weight = (fontWeight + ' ' + fontStyle).trim();
        return attributes;
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and it will be called on change of config plugin,
     * <br/>It will update the fontweight, fontstyle, fontfamily,fontsize and color of the plugin
     * @memberof Text
     */
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
    /**
     * This method overridden from Ekstepeditor.basePlugin and it will provide the config of this plugin
     * @memberof Text
     */
    getConfig: function() {
        var config = this._super();
        config.color = this.attributes.color || this.attributes.fill;
        config.fontfamily = this.attributes.fontFamily; 
        config.fontsize = this.attributes.fontSize;
        config.fontweight = this.attributes.fontweight || false;
        config.fontstyle = this.attributes.fontstyle || false;
        return config;
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and it will provide the properties of this plugin
     * @memberof Text
     */
    getProperties: function() {
        var props = EkstepEditorAPI._.omitBy(EkstepEditorAPI._.clone(this.attributes), EkstepEditorAPI._.isObject);
        props = EkstepEditorAPI._.omitBy(props, EkstepEditorAPI._.isNaN);
        delete props.__text;
        props.text = this.editorObj.text;
        return props;
    },
    /**
     * This method is used to convert font size when we are doing from or to conversion based on the flag 
     * @memberof Text
     * @param {Number} initFontSize  This is font size need to be converted
     * @param {Boolean} The flag  It provides the flag on conversion to ecml or from ecml with values false, true 
     * @return {Number} fontsize The fontsize is converted font size
     */
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
    /**
     * This method overridden from Ekstepeditor.basePlugin 
     * <br/>It is used convert data to fabric elements before creating the editor Object
     * <br/>Here font weight , style and size to be converted to fabric 
     * @param {Object} data This data provided by either api or on creation of new instance
     * @return {Object} retData retData is fabric form of data used to create fabric text object
     * @memberof Text
     */
    convertToFabric: function(data) {
        var retData = EkstepEditorAPI._.clone(data);
        if (data.x) retData.left = data.x;
        if (data.y) retData.top = data.y;
        if (data.w) retData.width = data.w;
        if (data.h) retData.height = data.h;
        if (data.radius) retData.rx = data.radius;
        if (data.color) retData.fill = data.color;
        if (data.weight && EkstepEditorAPI._.includes(data.weight, 'bold')) {
            retData.fontWeight = "bold";
            data.fontweight = true;
        } else { data.fontweight = false; }
        if (data.weight && EkstepEditorAPI._.includes(data.weight, 'italic')) {
            retData.fontStyle = "italic";
            data.fontstyle = true;
        } else { data.fontstyle = false; }
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
