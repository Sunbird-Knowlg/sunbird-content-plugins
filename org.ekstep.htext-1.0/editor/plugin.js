/**
 * plugin is used to create or modifiy the readalong text in editor
 * @class Htext
 * @extends EkstepEditor.basePlugin
 * @author Kartheek Palla <kartheekp@ilimi.in>
 */

EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof Htext
     */
    type: "htext",
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
     * @memberof Htext
     */
    currentInstance: undefined,
    /**
     * registers events
     * @memberof Htext
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("delete:invoked", this.deleteObject, this);
        setTimeout(function() {
            var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.htext-1.0/editor/htext.html';
            var controllerPath = EkstepEditor.config.pluginRepo + '/org.ekstep.htext-1.0/editor/readalongapp.js';
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);

    },
    /**
     * This method used to create the text fabric object and assigns it to editor of the instance
     * convertToFabric is used to convert attributes to fabric properties 
     * @memberof Htext
     */
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        delete props.__text;
        this.editorObj = new fabric.ITextbox(this.attributes.__text, props);
        this.loadHtml(this);
        currentInstance = this;
    },
    /**        
     *   load html template into the popup
     *   @param parentInstance 
     *   @param attrs attributes
     *   @memberof Htext
     */
    loadHtml: function(parentInstance, attrs) {
        var instance = this;
        EkstepEditorAPI.getService('popup').open({
            template: 'htext',
            controller: 'readalongcontroller',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return instance;
                },
                'attrs': function() {
                    return attrs;
                }
            },
            width: 900,
            showClose: false,
        }, function() {
            if (!instance.editorObj.__text) {
                instance.editorObj.remove();
                EkstepEditorAPI.render();
            }
        });

    },
    invokeKaraoke: function(audioSrc, attrs) {
        var karaoke = new Karaoke();
        karaoke.audioObj.url = audioSrc;
        if (attrs) {
            var timings = !EkstepEditorAPI._.isEmpty(attrs.attributes.timings) ? EkstepEditorAPI._.split(attrs.attributes.timings, ',') : '',
                wordTimes = [],
                words = [],
                wordsArr = EkstepEditorAPI._.split(attrs.attributes.__text, ' '),
                wordIdx = 0;
            EkstepEditorAPI._.each(timings, function(key, value) {
                wordIdx += 1;
                words.push({
                    word: wordsArr[value],
                    stepNo: (parseFloat(key / 1000).toFixed(1)) * 10,
                    wordIdx: wordIdx
                });
                wordTimes.push(parseFloat(key / 1000).toFixed(1));
            });
            karaoke.audioObj.url = audioSrc;
            karaoke.audioObj.wordMap = words;
            karaoke.audioObj.wordTimes = wordTimes;
            karaoke.audioObj.highlightColor = attrs.attributes.highlight;
        } else {
            karaoke.audioObj.url = audioSrc;
            karaoke.audioObj.wordMap = '';
            karaoke.audioObj.wordTimes = '';
            karaoke.audioObj.highlightColor = '';
            EkstepEditorAPI.jQuery("#jplayerSync").data('jPlayer', "");
        }
        var slider = EkstepEditorAPI.jQuery('#syncSlider').slider({
            min: 1,
            max: 3,
            value: 1,
            step: 1,
            change: karaoke.changePlaybackRate
        });
        EkstepEditorAPI.jQuery('#changeaudio').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.res, karaoke));
        EkstepEditorAPI.jQuery('#syncStart').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.startSync, karaoke));
        EkstepEditorAPI.jQuery('#pick-hcolor').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.setColor, karaoke));
        EkstepEditorAPI.jQuery('#stopAudio').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.stopAudio, karaoke));
        EkstepEditorAPI.jQuery('.slideStep').bind('drop', EkstepEditorAPI.jQuery.proxy(karaoke.handleWordDrop, karaoke));
        EkstepEditorAPI.jQuery('#syncMark').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.markWords, karaoke));
        EkstepEditorAPI.jQuery('#sync-play').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.playSyncedLayer, karaoke));
        EkstepEditorAPI.jQuery('#sync-pause').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.pauseAudio, karaoke));
        window.karaoke = karaoke;
        karaoke.initPlayer();
        return karaoke;
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and here we double click event is added
     * @memberof Htext
     */
    selected: function(instance) {
        fabric.util.addListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and here we double click event is removed
     * @memberof Htext
     */
    deselected: function(instance, options, event) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method is called when the object:unselected event is fired
     * It will remove the double click event for the canvas
     * @memberof Htext
     */
    objectUnselected: function(event, data) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.loadHtml);
    },
    /**
     * This method is callback for double click event which will call the textEditor to show the ediotor to add or modify text.
     * @param event {Object} event
     * @memberof Htext
     */
    dblClickHandler: function(event) {
        var leftSt = EkstepEditorAPI.jQuery("#canvas").offset().left + EkstepEditorAPI.getCurrentObject().editorObj.left;
        var leftEnd = leftSt + EkstepEditorAPI.getCurrentObject().editorObj.width;
        var topSt = EkstepEditorAPI.jQuery("#canvas").offset().top + EkstepEditorAPI.getCurrentObject().editorObj.top;
        var topEnd = topSt + EkstepEditorAPI.getCurrentObject().editorObj.height;
        if (event.clientX > leftSt && event.clientX < leftEnd && event.clientY > topSt && event.clientY < topEnd) {
            pluginId = EkstepEditorAPI.getEditorObject().id;;
            currentInstance.loadHtml(currentInstance, EkstepEditorAPI.getPluginInstance(pluginId));
        }
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and it will be called on change of config plugin,
     * <br/>It will update the fontweight, fontstyle, fontfamily,fontsize and color of the plugin
     * @memberof Text
     */
    onConfigChange: function(key, value) {
        switch (key) {
            case "highlight":
                this.attributes.highlight = value;
                break;
            case "autoplay":
                this.attributes.autoplay = value;
                break;
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
     * @memberof Htext
     */
    getConfig: function() {
        var config = this._super();
        config.highlight = this.attributes.highlight;
        config.autoplay = this.attributes.autoplay || false;
        config.color = this.attributes.color || this.attributes.fill;
        config.fontfamily = this.attributes.fontFamily;
        config.fontsize = this.attributes.fontSize;
        config.fontweight = this.attributes.fontweight || false;
        config.fontstyle = this.attributes.fontstyle || false;
        return config;
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and this will provide attributes to generate content for Genie
     * @memberof Htext
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
     * This method is used to convert font size when we are doing from or to conversion based on the flag 
     * @memberof Htext
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
     * @memberof Htext
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
    },
    deleteObject: function(event, data) {
        if (!_.isUndefined(data.editorObj.audio)) {
            var mediaArr = EkstepEditorAPI.getAllPluginInstanceByTypes();
            _.forEach(mediaArr, function(val, key) {
                if (!_.isUndefined(val.media) && val.media[data.editorObj.audio]) {
                    EkstepEditorAPI.getCurrentStage().children.splice(key, 1);
                    EkstepEditorAPI.dispatchEvent('org.ekstep.stageconfig:remove', {'asset': data.editorObj.audio});
                }
            });
        }
    }
});
//# sourceURL=readalongplugin.js
