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
    topicData: [],
    /**
     * set default limit to framework API
     * @memberof topicselector
     */
    limit: 500,
    /**
     * set default timeout for api response
     * @memberof topicselector
     */
    apiResponseTimeout: 3000,
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
        var instance = this;
        setTimeout(function() {
            ecEditor.jQuery('#' + data.element).topicTreePicker({
                data: instance.topicData,
                name: 'Topics',
                apiResponseTimeout: instance.apiResponseTimeout,
                picked: data.selectedTopics,
                onSubmit: function(nodes) {
                    data.callback(nodes);
                },
                nodeName:"topicSelector_" + data.element,
                minSearchQueryLength: 1
            });
        }, 1000);
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
