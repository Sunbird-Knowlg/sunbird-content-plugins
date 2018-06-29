var TextWYSIWYG = (function() {
    // Hashmap for text wysiwyg for fabricjs & createjs
    fontMap = {
        'NotoSans': {offsetY: 0.04, lineHeight: 1},
        'NotoSansKannada': {offsetY: 0.24, lineHeight: 1},
        'NotoNastaliqUrdu': {offsetY: -0.6, align: 'right', lineHeight: 2},
        "default": {offsetY: 0.2, lineHeight: 1}
    };
    _constants = {
        textType: 'text', // We are only supporting 'text' type for WYSIWYG. 'htext' & 'wordInfo' is not available for WYSIWYG, htext & wordinfo render as html elemnent in content-renderer
        createJsLineHeight: 1.3, // Previously editor is sending 1.3 as lineheight for all text
        lineHeightMagicNumber: 1.13, // Fabricjs is using magic number 1.13 in their library
        lineHeight: 'lineHeight',
        align: 'align',
        offsetY: 'offsetY',
        default: 'default'
    };
    _textInstance = undefined;
    /**
     * This will return the fontMap value for font family used text instance
     * @returns {object} fontMap data
     */
    function getFontProperties() {
        return (fontMap[_textInstance.attributes.fontFamily] || fontMap[_constants.default]);
    }
    /**
     * Update the properties of text instance
     * @param {string} prop - properties which should be updated.
     * @param {string} value - value of properties.
     * @returns {void}
     */
    function setProperties(prop, value) {
        switch (prop) {
            case _constants.lineHeight:
                _textInstance.attributes.lineHeight = value;
                _textInstance.editorObj.lineHeight = value;
                break;
            case _constants.align:
                _textInstance.attributes.align = value;
                _textInstance.editorObj.setTextAlign(value);
                break;
            case _constants.offsetY:
                _textInstance.attributes.offsetY = value;
                break;
        }
    }
    /**
     * This will set the lineheight of both old and new instance of text based on condition
     * @param {object} textInstance - text instance.
     * @returns {object} text instance
     */
    function toECML(prop) {
        if (prop.textType === _constants.textType) {
            // converting new text instance lineheight to createjs supported value
            var config = JSON.parse(prop.config.__cdata);
            prop.lineHeight = _constants.lineHeightMagicNumber * prop.lineHeight * config.fontsize;
        } else {
            // setting lineHeight config for wordinfo & readalong for createJs for backward compatibility;
            prop.lineHeight = _constants.createJsLineHeight;
        }
        return prop;
    }
    /**
     * This will set the alignment of text instance based on hashmap
     * @param {object} textInstance - text instance.
     * @returns {void}
     */
    function fromECML(textInstance) {
        if (textInstance.attributes.textType === _constants.textType) {
            var fontSize = textInstance.config.fontsize;
            if (fontSize) {
                // converting new text instance lineheight to fabricJs supported value
                var lineHeight = textInstance.editorData.lineHeight/(_constants.lineHeightMagicNumber * fontSize);
                textInstance.attributes.lineHeight = lineHeight;
            }
        } else {
            // deleting lineHeight config for wordinfo & readalong for fabricJs as for backward compatibility it is using fabricjs default lineheight;
            delete textInstance.attributes.lineHeight;
        }
    }
    /**
     * This function will set all WYSIWYG values of new text element.
     * @param {object} textInstance - text instance.
     * @returns {void}
     */
    function setInstance(textInstance) {
        if (textInstance.attributes.textType === _constants.textType) {
            _textInstance = textInstance // Setting Instance to private variable
            var fontProperties = getFontProperties();
            setProperties(_constants.lineHeight, fontProperties.lineHeight);
            setProperties(_constants.offsetY, fontProperties.offsetY);
            // if (fontProperties.align && !_textInstance.attributes.align) {
                // setProperties(_constants.align, fontProperties.align);
            // }
            ecEditor.render();
        }
    }
    /**
     * This will reset all WYSIWYG properties of text instance.
     * @param {object} textInstance - text instance.
     * @returns {void}
     */
    function resetProperties(instance) {
        delete instance.attributes.offsetY;
        delete instance.attributes.lineHeight;
        delete instance.editorObj.lineHeight;
    }
    return {
        setInstance: setInstance,
        toECML: toECML,
        fromECML: fromECML,
        resetProperties: resetProperties
    };
})();

//# sourceURL=textWYSIWYG.js