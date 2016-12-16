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
    selectors: [],
    /**
    *
    * Registers events.
    * @memberof conceptselector
    */
    initialize: function() {
        var instance = this;
        this.initData();
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":init", this.initConceptBrowser, this);
    },
    initData: function() {
		var domains = [];
		EkstepEditor.conceptService.getConceptsTree(function(err, resp) {
			if (!err && resp.statusText == "OK") {
				_.forEach(resp.data.result.domains, function(value) {
					var domain = {};
					domain.id   = value.identifier;
					domain.name = value.name;
					domainChild = [];
					_.forEach(value.children, function(DomainChildren) {
						var child = {};
						_.forEach(resp.data.result.dimensions, function(value) {
							if (DomainChildren == value.identifier)
							{
								child.id   = value.identifier;
								child.name = value.name;
								domainChild.push(child);
								dimensionChild = [];
								_.forEach(value.children, function(value) {
									var concept = {};
									_.forEach(resp.data.result.concepts, function(concepts) {
										if (value == concepts.identifier)
										{
											concept.id   = concepts.identifier;
											concept.name = concepts.name;
											concept.selectable = "selectable";
											conceptChild = [];
											_.forEach(concepts.children, function(value) {
													var subConcept = {};
												_.forEach(resp.data.result.concepts, function(concepts) {
													if (value == concepts.identifier)
													{
														subConcept.id   = concepts.identifier;
														subConcept.name = concepts.name;
														subConcept.selectable = "selectable";
														conceptChild.push(subConcept);
													}
												});
											});
											concept.nodes = conceptChild;
											dimensionChild.push(concept);
										}
									});
								});
								child.nodes = dimensionChild;
							}
						});
					});
					domain.nodes = domainChild;
					domains.push(domain);
				});
				EkstepEditorAPI.getAngularScope().safeApply();
			}
		});
        this.conceptData = domains;
    },
    /**
    *
    * open concept selector to select concepts
    * @memberof conceptselector
    *
    */
    initConceptBrowser: function(event, data) {
        var instance = this;
        if(instance.selectors.indexOf(data.element) == -1) {
            instance.selectors.push(data.element);
            EkstepEditorAPI.jQuery('#' + data.element).treePicker({
                data: instance.conceptData,
                name: 'Concepts',
                picked:  data.selectedConcepts,
                onSubmit: function(nodes) {
                  data.callback(nodes);
                },
                /**displayFormat: function(picked) { return "Concepts ("+picked.length+" selected)"; },**/
                onClose: function() {
                    instance.selectors = _.remove(instance.selectors, function(n) {
                        return n != data.element;
                    });
                },
                minSearchQueryLength: 1
            });
        }
    }
});
//# sourceURL=conceptplugin.js
