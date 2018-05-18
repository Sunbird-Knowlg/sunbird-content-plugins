/**
 *
 * Plugin to browse topic and select
 * @class topicselector
 * @extends org.ekstep.contenteditor.basePlugin
 *
 * @author Gourav More <gourav_m@tekditechnologies.com>
 * @listens org.ekstep.topicselector:init
 */

org.ekstep.contenteditor.basePlugin.extend({
    /**
     *
     * topic data for topic tree
     * @memberof topicselector
     */
    topicData: undefined,
    /**
     * set default limit to framework API
     * @memberof topicselector
     */
    limit: 500,
    /**
     * Selected topic array
     * @memberof topicselector
     */
    selectors: [],
    /**
     *
     * Registers events.
     * @memberof topicselector
     */
    initialize: function() {
        var instance = this;

        /**Register event**/
        ecEditor.addEventListener(instance.manifest.id + ":init", this.showTopicBrowser, this);
    },
    /**
     *
     * Registers events.
     * @memberof topicselector
     */
    initData: function(cb) {
        /**Set Topics and subtopic tree data**/
    },
    /**
     *
     * open topic selector to select topics and subtopics
     * @memberof topicselector
     *
     */
    showTopicBrowser: function(event, data) {
        // Call treepicker lib to show topics and subtopics tree
    },
    /**
     *   To generate telemetry events
     *   @memberof topicselector
     */
    generateTelemetry: function(data) {
        //Generate telemetry
    }
});
//# sourceURL=topicselectorplugin.js
