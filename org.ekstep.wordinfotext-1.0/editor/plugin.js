/**
 * plugin is used to create or modifiy the word meaning text in editor
 * @class wordinfotext
 * @extends EkstepEditor.basePlugin
 * @author Kartheek Palla <kartheekp@ilimi.in>
 */

EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof wordinfotext
     */
    type: "wordinfotext",
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
     * @member currentInstance
     * @memberof wordinfotext
     */
    currentInstance: undefined,
    cb: undefined,
    text:undefined,
    /**
     * registers events
     * @memberof wordinfotext
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("delete:invoked", this.deleteObject, this);
        EkstepEditorAPI.addEventListener("org.ekstep.wordinfotext:showpopup", this.loadHtml, this);
        setTimeout(function() {
            var templatePath = EkstepEditorAPI.getPluginRepo() + '/org.ekstep.wordinfotext-1.0/editor/wordinfotext.html';
            var controllerPath = EkstepEditorAPI.getPluginRepo() + '/org.ekstep.wordinfotext-1.0/editor/wordinfotextapp.js';
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);
    },
    /**
     * This method used to create the text fabric object and assigns it to editor of the instance
     * convertToFabric is used to convert attributes to fabric properties 
     * @memberof wordinfotext
     */
    // newInstance: function() {
    //     var instance = this;
    //     if(EkstepEditorAPI._.isUndefined(instance.data.selectedPluginid) && EkstepEditorAPI._.isUndefined(instance.attributes.__text)){
    //         this.attributes = {
    //             "__text": instance.data.selectedSentence,
    //             "x": 72,
    //             "y": 81,
    //             "fontFamily": "Sans-serif",
    //             "fontSize": 18,
    //             "minWidth": 20,
    //             "w": 252,
    //             "maxWidth": 500,
    //             "fill": "#000000",
    //             "fontStyle": "normal",
    //             "fontWeight": "normal",
    //             "stroke": "rgba(255, 255, 255, 0)",
    //             "strokeWidth": 1,
    //             "opacity": 1,
    //             "editable": false
    //         };
    //     }else if(!EkstepEditorAPI._.isUndefined(instance.data.selectedPluginid)){
    //         var selectedText = EkstepEditorAPI.getPluginInstance(instance.data.selectedPluginid);
    //         this.attributes = selectedText.attributes;   
    //     }
    //     if(!EkstepEditorAPI._.isUndefined(instance.data.words)){
    //         this.attributes.words = instance.data.words.join();
    //         var selectedWords = instance.data.words;
    //     }else{
    //         var selectedWords = instance.attributes.words.split(',');
    //     }
    //     var props = this.convertToFabric(instance.attributes);
    //     delete instance.data.selectedSentence;
    //     delete instance.data.words;
    //     delete instance.data.selectedPluginid;
    //     instance.editorObj = new fabric.ITextbox(instance.attributes.__text, props);
    //     if(!EkstepEditorAPI._.isUndefined(selectedText)){
    //         EkstepEditorAPI.getCanvas().remove(selectedText.editorObj);
    //     }

    //     if(!EkstepEditorAPI._.isUndefined(selectedText)){
    //         _.forEach(selectedWords, function(value, key) {
    //             EkstepEditorAPI.getCurrentStage().addEvent({
    //                 'type': value+ '_click',
    //                 'action': [{ 'type': 'command', 'command': 'toggleShow', 'asset': value + '_info' },
    //                     //{ 'type': 'command', 'command': 'HIDEHTMLELEMENTS', 'asset': value + '_info' },
    //                 ]
    //             });
    //         });
    //         this.attributes.wordfontcolor = "#0000FF";
    //         this.attributes.wordhighlightcolor = "#FFFF00";
    //         this.attributes.wordunderlinecolor = "#0000FF";
    //     }
    //     var image = {
    //             "id": "popupTint",
    //             "src": "https://dev.ekstep.in/assets/public/content/PopupTint_1460636175572.png",
    //             "type": "image",
    //             "assetId": "domain_38606"
    //         }
    //     image.src = EkstepEditor.mediaManager.getMediaOriginURL(image.src);
    //     instance.addMedia(image);
    //     currentInstance = instance;
    // },
    /**        
     *   load html template into the popup
     *   @param parentInstance 
     *   @param attrs attributes
     *   @memberof wordinfotext
     */
    loadHtml: function(event, data) {
        currentInstance = this;
        this.cb = data.callback;
        this.text = this.attributes.__text = data.textObj.editorObj.text;
        this.attributes = data.textObj.config;
        if(data.textObj.config.type == "wordinfo")
            this.editorObj = data.textObj.editorObj;
        EkstepEditorAPI.getService('popup').open({
            template: 'wordinfotext',
            controller: 'wordinfotextcontroller',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return currentInstance;
                },
            },
            width: 900,
            showClose: false,
            className: 'ngdialog-theme-plain'
        }, function() {

        });

    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and here we double click event is added
     * @memberof wordinfotext
     */
    selected: function(instance) {
        currentInstance = EkstepEditorAPI.getCurrentObject();
        fabric.util.addListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and here we double click event is removed
     * @memberof wordinfotext
     */
    deselected: function(instance, options, event) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method is called when the object:unselected event is fired
     * It will remove the double click event for the canvas
     * @memberof wordinfotext
     */
    objectUnselected: function(event, data) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method is callback for double click event which will call the textEditor to show the ediotor to add or modify text.
     * @param event {Object} event
     * @memberof wordinfotext
     */
    dblClickHandler: function(event) {
        var leftSt = EkstepEditorAPI.jQuery("#canvas").offset().left + EkstepEditorAPI.getCurrentObject().editorObj.left;
        var leftEnd = leftSt + EkstepEditorAPI.getCurrentObject().editorObj.width;
        var topSt = EkstepEditorAPI.jQuery("#canvas").offset().top + EkstepEditorAPI.getCurrentObject().editorObj.top;
        var topEnd = topSt + EkstepEditorAPI.getCurrentObject().editorObj.height;
        if (event.clientX > leftSt && event.clientX < leftEnd && event.clientY > topSt && event.clientY < topEnd) {
            currentInstance.loadHtml();
        }
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
            case "wordfontcolor":
                this.attributes.wordfontcolor = value;
                break;
            case "wordhighlightcolor":
                this.attributes.wordhighlightcolor = value;
                break;
            case "wordunderlinecolor":
                this.attributes.wordunderlinecolor = value;
                break;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and it will provide the config of this plugin
     * @memberof wordinfotext
     */
    getConfig: function() {
        var config = this._super();
        config.color = this.attributes.color || this.attributes.fill;
        config.wordfontcolor = this.attributes.wordfontcolor;
        config.wordhighlightcolor = this.attributes.wordhighlightcolor;
        config.wordunderlinecolor = this.attributes.wordunderlinecolor;
        config.fontfamily = this.attributes.fontFamily;
        config.fontsize = this.attributes.fontSize;
        config.fontweight = this.attributes.fontweight || false;
        config.fontstyle = this.attributes.fontstyle || false;
        return config;
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and this will provide attributes to generate content for Genie
     * @memberof wordinfotext
     */
    getAttributes: function() {
        var attributes = EkstepEditorAPI._.omit(EkstepEditorAPI._.clone(this.attributes), ['top', 'left', 'width', 'height', 'fontFamily', 'fontfamily', 'fontSize', 'fontstyle', 'fontweight', 'scaleX', 'scaleY']);
        attributes.font = this.editorObj.get('fontFamily');
        attributes['__text'] = this.editorObj.get('text');
        attributes.fontsize = this.updateFontSize(this.editorObj.get('fontSize'), false);
        var fontWeight = EkstepEditorAPI._.isUndefined(this.editorObj.get("fontWeight")) ? "" : (this.editorObj.get("fontWeight") === "bold" ? "bold" : "");
        var fontStyle = EkstepEditorAPI._.isUndefined(this.editorObj.get("fontStyle")) ? "" : (this.editorObj.get("fontStyle") === "italic" ? "italic" : "");

        attributes.weight = (fontWeight + ' ' + fontStyle).trim();
        return attributes;
    },
    /**
     * This method is used to convert font size when we are doing from or to conversion based on the flag 
     * @memberof wordinfotext
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
     * @memberof wordinfotext
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
        delete retData.lineHeight // line height set to default value 
        return retData;
    },
    deleteObject: function(event, data) {
        if (!EkstepEditorAPI._.isUndefined(data.editorObj.audio)) {
            EkstepEditorAPI.dispatchEvent('org.ekstep.stageconfig:remove', { 'asset': data.editorObj.audio });
        }
    },
    getConfigManifest: function() {
        var config = this._super();
        EkstepEditorAPI._.remove(config, function(c) {
            return c.propertyName === 'stroke';
        })
        return config;
    }
});
//# sourceURL=wordinfotextplugin.js
