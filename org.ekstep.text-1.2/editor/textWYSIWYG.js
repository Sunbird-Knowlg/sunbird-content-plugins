var TextWYSIWYG = (function() {
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
    function getHashMap(data) {
        return (hashMap[data.attributes.fontFamily] || hashMap['default']);
    }
    function isOldPlugin(data){
        if (!data.version || data.version < 1.2) {
            return true;
        } else {
            return false;
        }
    }
    function setOffsetY(data) {
        var fontHashMap = getHashMap(data);
        data.attributes.offsetY = data.attributes.fontSize * fontHashMap.offsetY;
    }
    function setAlignment(data) {
        var fontHashMap = getHashMap(data);
        if (fontHashMap.align && !data.attributes.align) {
            data.attributes.align = fontHashMap.align;
            data.editorObj.setTextAlign(fontHashMap.align);
        }
    }
    function setLineHeight(data) {
        var fontHashMap = getHashMap(data);
        data.attributes.lineHeight = fontHashMap.lineHeight;
        data.editorObj.lineHeight = fontHashMap.lineHeight;
    }
    function toECML(data) {
        if (isOldPlugin(data)) return;
        var config = JSON.parse(data.config.__cdata);
        data.lineHeight = 1.13 * data.lineHeight * config.fontsize;
        return data;
    }
    function fromECML(data) {
        if (isOldPlugin(data)) return;
        var fontSize = data.config.fontsize;
        if (fontSize) {
            var lineHeight = data.editorData.lineHeight/(1.13 * fontSize);
            data.attributes.lineHeight = lineHeight;
        }
    }
    function setProperties(data) {
        if (isOldPlugin(data.attributes)) return;
        setOffsetY(data);
        setAlignment(data);
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