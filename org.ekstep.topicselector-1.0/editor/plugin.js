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
     * For Board, gradelevel, medium, Subject filters data
     * @memberof topicselector
     */
    filtersData: [],
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

        /**Register event to show topic selector browser**/
        ecEditor.addEventListener(instance.manifest.id + ":init", this.initData, this);
        /**Register event for update filters data**/
        ecEditor.addEventListener("editor:field:association", this.updateFilters, this);
    },
    /**
     *
     * To init topic selector data.
     * @memberof topicselector
     */
    initData: function(event, data) {
        //Data mapping
        this.showTopicBrowser(event, data);
    },
    /**
     *
     * To update filters data
     * @memberof topicselector
     */
    updateFilters: function(event, data) {
        var dependedValues, groupdFields;
        if (data.field.depends && data.field.depends.length) {
            _.forEach(data.field.depends, function(id) {
                if(id == 'topics'){
                    //TODO Data mapping
                    console.log('update data', data);
                }
            });
        }
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
