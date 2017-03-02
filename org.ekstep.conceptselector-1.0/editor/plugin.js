/**
 *
 * Plugin to browse concepts and select
 * @class conceptselector
 * @extends EkstepEditor.basePlugin
 *
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 * @listens org.ekstep.image:conceptselector:init
 */

EkstepEditor.basePlugin.extend({
    conceptData: undefined,
    callback: undefined,
    limit: 200,
    selectors: [],
    concepts: [],
    /**
     *
     * Registers events.
     * @memberof conceptselector
     */
    initialize: function() {
        var instance = this;
        instance.getConcept(0, instance.limit, instance, function() { instance.initData(instance); });
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":init", this.initConceptBrowser, this);
    },
    initData: function(instance) {
        var instance = instance || this;
        var domains = [];
        EkstepEditor.conceptService.getConceptsTree(function(err, resp) {
            if (!err && resp.data && resp.data.result && EkstepEditorAPI._.isArray(resp.data.result.domains)) {
                EkstepEditorAPI._.forEach(resp.data.result.domains, function(value) {
                    var domain = {};
                    domain.id = value.identifier;
                    domain.name = value.name;
                    var domainChild = [];
                    EkstepEditorAPI._.forEach(getChild(value.identifier, resp.data.result.dimensions), function(value) {
                        var dimension = {};
                        dimension.id = value.id;
                        dimension.name = value.name;
                        dimension.nodes = getChild(value.id, instance.concepts);
                        domainChild.push(dimension);
                    });
                    domain.nodes = domainChild;
                    domains.push(domain);
                });
            }
        });

        function getChild(id, resp) {
            var childArray = [];
            EkstepEditorAPI._.forEach(resp, function(value) {
                if (value.parent != undefined) {
                    if (value.parent[0] == id) {
                        var child = {};
                        child.id = value.identifier;
                        child.name = value.name;
                        child.selectable = "selectable";
                        child.nodes = getChild(value.identifier, resp);
                        childArray.push(child);
                    }
                }
            });
            return childArray;
        }
        this.conceptData = domains;
    },
    /**
     *
     * Get concepts data and push to conceptarray
     * @param offset {Object} offset for search API.
     * @param limit {Object} limit for search API
     * @memberof conceptselector
     *
     */
    getConcept: function(offset, limit, instance, callback) {
        var instance = instance || this;
        offset = offset || 0;
        limit = limit || instance.limit;
        EkstepEditor.conceptService.getConcepts(function(err, resp) {
            if (!err && resp.data && resp.data.result && EkstepEditorAPI._.isArray(resp.data.result.concepts)) {
                EkstepEditorAPI._.forEach(resp.data.result.concepts, function(value) {
                    instance.concepts.push(value);
                });
                if (resp.data.result.count > limit) {
                    offset = resp.data.result.count - limit;
                    limit = limit + limit;
                    instance.getConcept(offset, limit, instance, callback);
                } else callback(instance);
            }
        }, offset, limit);
    },
    /**
     *
     * open concept selector to select concepts
     * @memberof conceptselector
     *
     */
    initConceptBrowser: function(event, data) {
        var instance = this;
        if (instance.selectors.indexOf(data.element) == -1) {
            setTimeout(function() {
                EkstepEditorAPI.jQuery('#' + data.element).treePicker({
                    data: instance.conceptData,
                    name: 'Concepts',
                    picked: data.selectedConcepts,
                    onSubmit: function(nodes) {
                        data.callback(nodes);
                    },
                    /**displayFormat: function(picked) { return "Concepts ("+picked.length+" selected)"; },**/
                    minSearchQueryLength: 1
                });
            }, 1000);
        }
    }
});
//# sourceURL=conceptplugin.js
