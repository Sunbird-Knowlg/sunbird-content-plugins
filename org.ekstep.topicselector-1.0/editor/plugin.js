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
     * Data to Topic tree library
     * @memberof topicselector
     */
    data: [],
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
        ecEditor.addEventListener("editor:field:association", this.getFilters, this);
    },
    /**
     *
     * To init topic selector data.
     * @memberof topicselector
     */
    initData: function(event, data) {
        var instance = this;
        instance.data = data;
        instance.getTopicCategory(function(){
            if(instance.categories.length){
                instance.mapData(instance.categories, function(data){
                    instance.topicData = ecEditor._.uniqBy(data, "id");
                    instance.showTopicBrowser(event, instance.data);
                });
            }else{
                instance.showTopicBrowser(event, instance.data);
            }
        });
    },
    /**
     *
     * Map topic data.
     * @memberof topicselector
     */
    mapData: function(data, callback) {
        var instance = this;
        var mappedData = [];
        if (!data) return callback();
        ecEditor._.forEach(data, function(value, index) {
            var topic = {};
            topic.id = value.identifier;
            topic.name = value.name;
            topic.selectable = "selectable";
            topic.nodes = instance.getSubtopics(value.children);
            mappedData.push(topic)
            if (index === data.length - 1){ 
                callback(mappedData);
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
        ecEditor.getService(ServiceConstants.META_SERVICE).getCategorys(org.ekstep.contenteditor.globalContext.framework, function(error, response) {
            if (error) {
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
     * To get filters data
     * @memberof topicselector
     */
    getFilters: function(event, data) {
        var instance = this;
        var filters = [];
        if (data.field.depends && data.field.depends.length) {
            _.forEach(data.field.depends, function(id) {
                if(id == 'topics'){
                    instance.getAssociations(data.associations, function(association){
                        instance.mapData(association, function(mappedData){
                            _.forEach(instance.topicData, function(topicId, index) {
                                _.forEach(mappedData, function(associationId) {
                                    if(associationId.id == topicId.id)
                                        filters.push(instance.topicData[index]);
                                });
                            });
                            instance.topicData = ecEditor._.uniqBy(filters, "id");
                            instance.showTopicBrowser(event, instance.data);
                        });
                    });
                }
            });
        }
    },
    /**
     *
     * To get associations data
     * @memberof topicselector
     */
    getAssociations: function(data, callback) {
        var instance = this;
        var association = [];
        if (!data) return callback();
        _.forEach(data, function(obj, index) {
            if (obj.category == "topic") association.push(obj);
            if (index === data.length - 1) callback(association);
        });
    },
    /**
     *
     * open topic selector to select topics and subtopics
     * @memberof topicselector
     *
     */
    showTopicBrowser: function(event, data) {
        var instance = this;
        instance.data = data;
        ecEditor.jQuery('#' + data.element).topicTreePicker({
            data: instance.topicData,
            name: 'Topics',
            apiResponseTimeout: instance.apiResponseTimeout,
            picked: data.selectedTopics,
            onSubmit: function(nodes) {
                data.callback(nodes);
                instance.generateTelemetry({type: 'click', subtype: 'submit', target: 'TopicSelectorSubmit'});
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
        var instance = this;
        if (data) ecEditor.getService('telemetry').interact({
            "type": data.type,
            "subtype": data.subtype,
            "id": data.target,
            "pageid": org.ekstep.contenteditor.api.getCurrentStage().id || "",
            "target":{
                "id":  data.targetid || "",
                "type": "plugin",
                "ver": ""
            },
            "plugin":{
                "id": instance.manifest.id,
                "ver": instance.manifest.ver,
                "category": "core"
            },
            "ver": "3.0"
        });
    }
});
//# sourceURL=topicselectorplugin.js
