var TextWYSIWYG = (function() {
    // Hashmap for text wysiwyg for fabricjs & createjs
    hashMap = {
        'NotoSans': {offsetY: 0.04, lineHeight: 1},
        'NotoSansKannada': {offsetY: 0.24, lineHeight: 1},
        'NotoNastaliqUrdu': {offsetY: -0.6, align: 'right', lineHeight: 2},
        "NotoSansGujarati": {offsetY: 0.2, lineHeight: 1},
        "NotoSansBengali": {offsetY: 0.2, lineHeight: 1},
        "NotoSansGurmukhi": {offsetY: 0.2, lineHeight: 1},
        "NotoSansOriya": {offsetY: 0.2, lineHeight: 1},
        "NotoSansDevanagari": {offsetY: 0.2, lineHeight: 1},
        "NotoSansTamil": {offsetY: 0.2, lineHeight: 1},
        "NotoSansTelugu": {offsetY: 0.2, lineHeight: 1},
        "NotoSansMalayalam": {offsetY: 0.2, lineHeight: 1},
        "default": {offsetY: 0.2, lineHeight: 1}
    }
    /**
     * This will return the hashmap value for font family used text instance
     * @param {object} data - text instance.
     * @returns {object} hashmap data
     */
    function getHashMap(data) {
        return (hashMap[data.attributes.fontFamily] || hashMap['default']);
    }
    /**
     * This will return boolean value if text instance is not or old version
     * @param {object} data - text instance.
     * @returns {boolean} text instance is old or not
     */
    function isOldPlugin(data){
        if (!data.version || data.version < 1.2) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * This will set the offsetY value for text instance based on hashmap
     * @param {object} data - text instance.
     * @returns {void}
     */
    function setOffsetY(data) {
        var fontHashMap = getHashMap(data);
        data.attributes.offsetY = data.attributes.fontSize * fontHashMap.offsetY;
    }
    /**
     * This will set the alignment of text instance based on hashmap
     * @param {object} data - text instance.
     * @returns {void}
     */
    function setAlignment(data) {
        var fontHashMap = getHashMap(data);
        if (fontHashMap.align && !data.attributes.align) {
            data.attributes.align = fontHashMap.align;
            data.editorObj.setTextAlign(fontHashMap.align);
        }
    }
    /**
     * This will set the baseline of text instance based on hashmap
     * @param {object} data - text instance.
     * @returns {void}
     */
    function setLineHeight(data) {
        var fontHashMap = getHashMap(data);
        data.attributes.lineHeight = fontHashMap.lineHeight;
        data.editorObj.lineHeight = fontHashMap.lineHeight;
    }
    /**
     * This will set the lineheight of both old and new instance of text based on condition
     * @param {object} data - text instance.
     * @returns {object} text instance
     */
    function toECML(data) {
        if (isOldPlugin(data)) {  // setting old text instance lineheight as 1.3 for createJs(old text instance default value)
            data.lineHeight = 1.3;
        } else {
            // converting new text instance lineheight to createjs supported value
            var config = JSON.parse(data.config.__cdata);
            data.lineHeight = 1.13 * data.lineHeight * config.fontsize;
        }
        return data;
    }
    /**
     * This will set the alignment of text instance based on hashmap
     * @param {object} data - text instance.
     * @returns {void}
     */
    function fromECML(data) {
        if (isOldPlugin(data)) {
            data.attributes.lineHeight = 1.16; // setting old text instance lineheight as 1.16 for fabricJs(old text instance default value)
        } else {;
            var fontSize = data.config.fontsize;
            if (fontSize) {
                // converting new text instance lineheight to fabricJs supported value
                var lineHeight = data.editorData.lineHeight/(1.13 * fontSize);
                data.attributes.lineHeight = lineHeight;
            }
        }
    }
    /**
     * This function will set all WYSIWYG values of new text element.
     * @param {object} data - text instance.
     * @returns {void}
     */
    function setProperties(data) {
        if (isOldPlugin(data.attributes)) return;
        setOffsetY(data);
        // setAlignment(data);
        setLineHeight(data);
        ecEditor.render();
    }
    return {
        setProperties: setProperties,
        toECML: toECML,
        fromECML: fromECML
    };
})();

//# sourceURL=textWYSIWYG.js