var TextWYSIWYG = (function() {
    // Hashmap for text wysiwyg for fabricjs & createjs
    fontMap = {
        'NotoSans': {offsetY: 0.04, lineHeight: 1},
        'NotoSansKannada': {offsetY: 0.24, lineHeight: 1},
        'NotoNastaliqUrdu': {offsetY: -0.6, align: 'right', lineHeight: 2},
        "default": {offsetY: 0.2, lineHeight: 1}
    };
    _constants: {
        supportedTextType: 'text'
    };
    _textInstance = undefined;
    /**
     * This will return the fontMap value for font family used text instance
     * @returns {object} fontMap data
     */
    function getFontProperties() {
        return (fontMap[_textInstance.attributes.fontFamily] || fontMap['default']);
    }
    /**
     * Update the properties of text instance
     * @param {string} prop - properties which should be updated.
     * @param {string} value - value of properties.
     * @returns {void}
     */
    function setProperties(prop, value) {
        switch (prop) {
            case "lineHeight":
                _textInstance.attributes.lineHeight = value;
                _textInstance.editorObj.lineHeight = value;
                break;
            case "align":
                _textInstance.attributes.align = value;
                _textInstance.editorObj.setTextAlign(value);
                break;
            case "offsetY":
                _textInstance.attributes.offsetY = _textInstance.attributes.fontSize * value;
                break;
        }
    }
    /**
     * This will set the lineheight of both old and new instance of text based on condition
     * @param {object} textInstance - text instance.
     * @returns {object} text instance
     */
    function toECML(prop) {
        if (prop.textType === _constants.supportedTextType) {
            // converting new text instance lineheight to createjs supported value
            var config = JSON.parse(prop.config.__cdata);
            prop.lineHeight = 1.13 * prop.lineHeight * config.fontsize;
        } else {
            // setting lineHeight config for wordinfo & readalong for createJs;
            prop.lineHeight = 1.3;
        }
        return prop;
    }
    /**
     * This will set the alignment of text instance based on hashmap
     * @param {object} textInstance - text instance.
     * @returns {void}
     */
    function fromECML(textInstance) {
        if (textInstance.attributes.textType === _constants.supportedTextType) {
            var fontSize = textInstance.config.fontsize;
            if (fontSize) {
                // converting new text instance lineheight to fabricJs supported value
                var lineHeight = textInstance.editorData.lineHeight/(1.13 * fontSize);
                textInstance.attributes.lineHeight = lineHeight;
            }
        } else {
            // setting lineHeight config for wordinfo & readalong for fabricJs;
            textInstance.attributes.lineHeight = 1.16;
        }
    }
    /**
     * This function will set all WYSIWYG values of new text element.
     * @param {object} textInstance - text instance.
     * @returns {void}
     */
    function setInstance(textInstance) {
        if (textInstance.attributes.textType === _constants.supportedTextType) {
            _textInstance = textInstance // Setting Instance to private variable
            var fontProperties = getFontProperties();
            setProperties('lineHeight', fontProperties.lineHeight);
            setProperties('offsetY', fontProperties.offsetY);
            // if (fontProperties.align && !_textInstance.attributes.align) {
            //     setProperties('align', fontProperties.align);
            // }
            ecEditor.render();
        } else {
            // deleting WYSIWYG config for wordinfo & readalong;
            delete textInstance.attributes.lineHeight;
            delete textInstance.attributes.offsetY;
        }
    }
    return {
        setInstance: setInstance,
        toECML: toECML,
        fromECML: fromECML
    };
})();

//# sourceURL=textWYSIWYG.js