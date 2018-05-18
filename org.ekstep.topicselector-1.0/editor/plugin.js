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
     * topic data for topic tree
     * @memberof topicselector
     */
    topics: [],
    /**
     *
     * Registers events.
     * @memberof topicselector
     */
    initialize: function() {
        var instance = this;

        /**Get topics data**/
        ecEditor.addEventListener(instance.manifest.id + ":init", this.initTopicBrowser, this);
    },
    /**
     *
     * Registers events.
     * @memberof topicselector
     */
    initData: function(instance, cb) {
        /**Set Topics and subtopic tree data**/
    },
    /**
     *
     * open topic selector to select topics and subtopics
     * @memberof topicselector
     *
     */
    initTopicBrowser: function(event, data) {
        ecEditor.jQuery('#' + data.element).treePicker({
            data: instance.topicData,
            name: 'Topics',
            picked: data.selectedTopics,
            onSubmit: function(nodes) {
                data.callback(nodes);
            },
            nodeName:"topicSelector_" + data.element,
            minSearchQueryLength: 1
        });
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
