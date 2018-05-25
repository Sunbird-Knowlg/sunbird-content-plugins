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
    apiResponseTimeout: 1000,
    /**
     * Selected topic array
     * @memberof topicselector
     */
    selectors: [],
    /**
     * categories of framework
     * @memberof topicselector
     */
    categories: [],
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
        var instance = this;
        instance.getTopicCategory(function(){
            if(instance.categories.length){
                instance.mapData(instance.categories, function(){
                    instance.topicData = ecEditor._.uniqBy(instance.topicData, "id");
                    instance.showTopicBrowser(event, data);
                });
            }else instance.showTopicBrowser(event, data);
        });
    },
    /**
     *
     * Map topic data.
     * @memberof topicselector
     */
    mapData: function(data, callback) {
        var instance = this;
        ecEditor._.forEach(data, function(value, index, ) {
            var topic = {};
            topic.id = value.identifier;
            topic.name = value.name;
            topic.selectable = "selectable";
            topic.nodes = instance.getSubtopics(value.children);
            instance.topicData.push(topic)
            if (index === data.length - 1){ 
                callback();
            }
        });
    },
    /**
     *
     * To Get topic child recursively.
     * @memberof topicselector
     */
    getSubtopics: function(topic) {
        var instance = this;
        var childArray = [];
        ecEditor._.forEach(topic, function(value) {
            var child = {};
            child.id = value.identifier;
            child.name = value.name;
            child.selectable = "selectable";
            child.nodes = instance.getSubtopics(value.children);
            childArray.push(child);
        });
        return ecEditor._.uniqBy(childArray, "id");
    },
    /**
     *
     * To all topics data.
     * @memberof topicselector
     */
    getTopicCategory: function(callback) {
        var instance = this;
        ecEditor.getService(ServiceConstants.META_SERVICE).getCategorys('cmd_fw_16', function(error, response) {
            if (!error) {
                var categories = window.frameworkConfigurations.result.framework.categories;//response.data.result.framework.categories;
                ecEditor._.forEach(categories, function (value, key) {
                    if (value.code == "topic") instance.categories = value.terms;
                });
            }
            callback();
        })
    },
    /**
     *
     * To update filters data
     * @memberof topicselector
     */
    updateFilters: function(event, data) {
        var dependedValues,
            groupdFields,
            instance = this;
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
