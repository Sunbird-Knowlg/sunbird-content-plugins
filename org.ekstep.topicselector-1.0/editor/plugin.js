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
     * topic data for sematic ui tree picker lib
     * @memberof topicselector
     */
    topicData: [],
    /**
     *
     * Api response for categories
     * @memberof topicselector
     */
    response:[],
    /**
     *
     * CategoryList from API
     * @memberof topicselector
     */
    categoryList:[],
    /**
     *
     * Selected filters data from metaform
     * @memberof topicselector
     */
    selectedFilters:[],
    /**
     *
     * for master data of topic tree
     * @memberof topicselector
     */
    topics: [],
    /**
     * set default timeout for api response
     * @memberof topicselector
     */
    apiResponseTimeout: 1000,
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
     * check for is topic selector initialized
     * @memberof topicselector
     */
    isPopupInitialized: false,
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
        ecEditor.addEventListener("editor:field:association", this.applyFilters, this);
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
            if(instance.categories.length > 0){
                instance.mapData(instance.categories, function(data){
                    instance.topicData = ecEditor._.uniqBy(data, "id");
                    instance.topics = instance.topicData;
                    instance.isPopupInitialized = true;
                    instance.selectedFilters = [];
                    ecEditor.dispatchEvent("metadata:form:getmeta", function(data){
                        instance.setAssociations(data, function(){
                            instance.setFiltersData(function(){
                                instance.showTopicBrowser(event, instance.data);         
                            });
                        });
                    });
                });
            }else{
                instance.isPopupInitialized = true;
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
        if (data && data.length){
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
        }else{
             callback(mappedData);
        }
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
            if (!error) {
                instance.response = response.data.result.framework.categories;
                ecEditor._.forEach(instance.response, function (value, key) {
                    if (value.code == "topic") instance.categories = value.terms;
                    else instance.categoryList.push(value.code);
                });
            }
            callback();
        })
    },
    /**
     *
     * To apply filters data
     * @memberof topicselector
     */
    applyFilters: function(event, data) {
        var instance = this;
        instance.selectedFilters = [];
        if(instance.isPopupInitialized && data.field.code != 'topic'){
            ecEditor.dispatchEvent("metadata:form:getmeta", function(data){
                instance.setAssociations(data, function(){
                    instance.setFiltersData(function(){
                        instance.showTopicBrowser(event, instance.data);
                    });
                });
            });
        }
    },
    /**
     *
     * To set filters data.
     * @memberof topicselector
     */
    setFiltersData: function(callback) {
        var instance = this;
        var associations = [];
        if (instance.selectedFilters.length > 0){
            ecEditor._.forEach(instance.selectedFilters, function(value, index) {
                if(value.association.length > 0){
                    var topics = [];
                    ecEditor._.forEach(value.association[0], function(topic, index) {
                        if(topic.category == 'topic') topics.push(topic.identifier); 
                    });
                    if(topics.length > 0) associations.push(topics);
                }
                if (index === instance.selectedFilters.length - 1){ 
                    var selectedIntersection = _.intersection.apply(_, associations);
                    var topicData = [];
                    ecEditor._.forEach(instance.topics, function(topic, index) {
                        ecEditor._.forEach(selectedIntersection, function(id) {
                            if (topic.id == id)
                            topicData.push(topic);
                        });
                        if (index === instance.topics.length - 1){ 
                            if(topicData.length > 0) instance.topicData = topicData;
                            callback();
                        }
                    });
                }
            });
        }else{
            callback();
        }    
    },
    /**
     *
     * Set associations according to the filters
     * @memberof topicselector
     */
    setAssociations: function(data, callback){
        var instance = this;
        instance.categoryList = ecEditor._.uniq(instance.categoryList);
        ecEditor._.forEach(instance.categoryList, function(value, index) {
            var category = {};
            category.name = value;
            category.value = data[value];
            category.association = [];
            ecEditor._.forEach(instance.response, function(apiCategory, index) {
                if(apiCategory.code == value){
                    ecEditor._.forEach(apiCategory.terms, function(term, index) {
                        if(_.isArray(data[value]) && term.associations.length > 0){
                            ecEditor._.forEach(data[value], function(select, index) {
                                if(term.name == select && category.association.length > 0) {
                                    term.associations  = _.union(category.association[0], term.associations);
                                    category.association = term.associations;
                                }else if(term.name == select){                                      
                                    category.association.push(term.associations);
                                }
                            });
                        }else if(term.name == data[value] && term.associations.length > 0){
                            category.association.push(term.associations);
                        }
                    });
                }
            });
            instance.selectedFilters.push(category);
        });
        callback();
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
        console.log(instance.topicData.length);
        setTimeout(function() {
            ecEditor.jQuery('#' + data.element).topicTreePicker({
                data: instance.topicData,
                name: 'Topic',
                apiResponseTimeout: instance.apiResponseTimeout,
                picked: data.selectedTopics,
                onSubmit: function(nodes) {
                    data.callback(nodes);
                    instance.generateTelemetry({type: 'click', subtype: 'submit', target: 'TopicSelectorSubmit'});
                },
                nodeName:"topicSelector_" + data.element,
                minSearchQueryLength: 1
            });
        }, instance.apiResponseTimeout);
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
