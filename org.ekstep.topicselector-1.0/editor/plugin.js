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
    apiData:[],
    categoryList:[],
    selectedFilters:[],
    selectedArray:[],
    /**
     *
     * for master data of topic tree
     * @memberof topicselector
     */
    topics: [],
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
                    instance.topics = instance.topicData;
                    instance.isPopupInitialized = true;
                    instance.selectedFilters = [];
                    ecEditor.dispatchEvent("metadata:form:getmeta", function(data){
                        ecEditor._.forEach(instance.categoryList, function(value, index) {
                            var category = {};
                            category.name = value;
                            category.value = data[value];
                            category.association = [];
                            ecEditor._.forEach(instance.apiData, function(apiCategory, index) {
                                if(apiCategory.code == value){
                                    ecEditor._.forEach(apiCategory.terms, function(term, index) {
                                        if(_.isArray(data[value])){
                                            ecEditor._.forEach(data[value], function(select, index) {
                                                if(term.name == select) category.association.push(term.associations);
                                            });
                                        }else{
                                            if(term.name == data[value]) category.association.push(term.associations);
                                        }
                                    });
                                }
                            });
                            instance.selectedFilters.push(category);
                        });
                    });
                    instance.showTopicBrowser(event, instance.data);
                });
            }else{
                instance.isTopicPopupOpened = true;
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
             return callback(mappedData);
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
                instance.apiData = response.data.result.framework.categories;
                ecEditor._.forEach(instance.apiData, function (value, key) {
                    if (value.code == "topic") instance.categories = value.terms;
                    else instance.categoryList.push(value.code);
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
        instance.selectedFilters = [];
        if(instance.isPopupInitialized && data.field.code != 'topic'){
            ecEditor.dispatchEvent("metadata:form:getmeta", function(data){
                ecEditor._.forEach(instance.categoryList, function(value, index) {
                    var category = {};
                    category.name = value;
                    category.value = data[value];
                    category.association = [];
                    ecEditor._.forEach(instance.apiData, function(apiCategory, index) {
                        if(apiCategory.code == value){
                            ecEditor._.forEach(apiCategory.terms, function(term, index) {
                                if(_.isArray(data[value])){
                                    ecEditor._.forEach(data[value], function(select, index) {
                                        if(term.name == select) category.association.push(term.associations);
                                    });
                                }else{
                                    if(term.name == data[value]) category.association.push(term.associations);
                                }
                            });
                        }
                    });
                    instance.selectedFilters.push(category);
                });
                setTimeout(function() {
                    instance.getFiltersData();
                },100);
            });
        }
    },
    /**
     *
     * To get filters data.
     * @memberof topicselector
     */
    getFiltersData: function(callback) {
        var instance = this;
        var associations = [];
        ecEditor._.forEach(instance.selectedFilters, function(value, index) {
            if(value.association.length > 0){
                ecEditor._.forEach(value.association, function(association, index) {
                    if(associations.length > 0)
                    association = _.intersectionBy(associations, association, 'identifier');
                    associations.push(association);
                });
            }
            if (index === instance.selectedFilters.length - 1){ 
                var selectedIntersection = _.intersection.apply(_, associations);
                instance.getAssociations(selectedIntersection, function(data){
                    console.log(data);
                });
            }
        });    
    },
    /**
     *
     * To get intersection data
     * @memberof topicselector
     */
    getIntersection: function(data, callback) {
        var instance = this;
        var filters = [];
        /** Check existing filters **/
        var categories = (!instance.filtersData.length) ? instance.topics : instance.filtersData;
        /** Get intersection of master data and filters data **/
        filters = _.intersectionBy(categories, data, 'id');
        callback(filters);
    },
    /**
     *
     * To get associations data
     * @memberof topicselector
     */
    getAssociations: function(data, callback) {
        var instance = this;
        var association = [];
        if (data && data.length){
            _.forEach(data, function(obj, index) {
                if(_.isArray(obj)){
                    ecEditor._.forEach(obj, function(select, index) {
                        if (select.category == "topic") association.push(select);
                    });
                }else{
                    if (obj.category == "topic") association.push(obj);
                }
                if (index === data.length - 1) callback(association);
            });
        }else{
            callback(association);
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
        instance.data = data;
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
