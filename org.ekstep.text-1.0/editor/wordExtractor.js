/**
 * @class  org.ekstep.plugins.text.WordExtractor
 */
org.ekstep.plugins.text.WordExtractor = Class.extend({
    /**
     * Get the currently selected object on the stage. If its a text plugin,
     * retuns the text else returns undefined.
     * @returns {string} plugin.editorObj.text - text being displayed by the text plugin
     */
    extractText: function() {
        var plugin = org.ekstep.contenteditor.api.getCurrentObject();
        if (plugin && plugin.manifest.id == "org.ekstep.text") {
            return plugin.editorObj.text;
        }
        return undefined;
    }
});
