/**
 * 
 * Plugin to create question set and add it to stage.
 * @class questionset
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.contenteditor.basePlugin.extend({
    type: "org.ekstep.questionset",
    /**
     * Register events.
     * @memberof questionset
     */
    initialize: function() {
        ecEditor.addEventListener(this.manifest.id + ":showpopup", this.showpopup, this);
    },
    newInstance: function() {
        // TODO: Logic here
    },
    showpopup: function () {
        console.log('TODO: Handle \'showpopup\' event.');
    }
});
//# sourceURL=questionsetPlugin.js
