var TextWYSIWYG = (function() {
    // Hashmap for text wysiwyg for fabricjs & createjs
    hashMap = {
        'NotoSans': {offsetY: 0.04, lineHeight: 1},
        'NotoSansKannada': {offsetY: 0.24, lineHeight: 1},
        'NotoNastaliqUrdu': {offsetY: -0.6, align: 'right', lineHeight: 2},
        "default": {offsetY: 0.2, lineHeight: 1}
    };
    _textInstance = undefined;
    /**
     * This will return the hashmap value for font family used text instance
     * @returns {object} hashmap data
     */
    function getHashMap() {
        return (hashMap[_textInstance.attributes.fontFamily] || hashMap['default']);
    }
    /**
     * This will set the offsetY value for text instance based on hashmap
     * @returns {void}
     */
    function setOffsetY() {
        var fontHashMap = getHashMap(_textInstance);
        _textInstance.attributes.offsetY = _textInstance.attributes.fontSize * fontHashMap.offsetY;
    }
    /**
     * This will set the alignment of text instance based on hashmap
     * @returns {void}
     */
    function setAlignment() {
        var fontHashMap = getHashMap(_textInstance);
        if (fontHashMap.align && !_textInstance.attributes.align) {
            _textInstance.attributes.align = fontHashMap.align;
            setEditorProperties('align', fontHashMap.align)
        }
    }
    /**
     * This will set the baseline of text instance based on hashmap
     * @returns {void}
     */
    function setLineHeight() {
        var fontHashMap = getHashMap(_textInstance);
        _textInstance.attributes.lineHeight = fontHashMap.lineHeight;
        setEditorProperties('lineHeight', fontHashMap.lineHeight)
    }
    /**
     * Update the text instance editor data
     * @param {string} prop - properties which should be updated.
     * @param {string} value - value of properties.
     * @returns {void}
     */
    function setEditorProperties(prop, value) {
        switch (prop) {
            case "lineHeight":
                _textInstance.editorObj.lineHeight = value;
                break;
            case "align":
                _textInstance.editorObj.setTextAlign(value);
                break;
        }
        ecEditor.render();
    }
    function setTextInstance(textInstance) {
        _textInstance = textInstance
    }
    /**
     * This will set the lineheight of both old and new instance of text based on condition
     * @param {object} textInstance - text instance.
     * @returns {object} text instance
     */
    function toECML(prop) {
        // converting new text instance lineheight to createjs supported value
        var config = JSON.parse(prop.config.__cdata);
        prop.lineHeight = 1.13 * prop.lineHeight * config.fontsize;
        return prop;
    }
    /**
     * This will set the alignment of text instance based on hashmap
     * @param {object} textInstance - text instance.
     * @returns {void}
     */
    function fromECML(textInstance) {
        var fontSize = textInstance.config.fontsize;
        if (fontSize) {
            // converting new text instance lineheight to fabricJs supported value
            var lineHeight = textInstance.editorData.lineHeight/(1.13 * fontSize);
            textInstance.attributes.lineHeight = lineHeight;
        }
    }
    /**
     * This function will set all WYSIWYG values of new text element.
     * @param {object} textInstance - text instance.
     * @returns {void}
     */
    function setProperties(textInstance) {
        setTextInstance(textInstance)
        setOffsetY();
        // setAlignment();
        setLineHeight();
    }
    return {
        setProperties: setProperties,
        toECML: toECML,
        fromECML: fromECML
    };
})();

//# sourceURL=textWYSIWYG.js