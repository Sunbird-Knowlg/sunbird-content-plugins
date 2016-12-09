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
        // TODO: Fetch the data from search service
        // 1. Fire composite search API with Object Types ["Concept", "Dimension", "Domain"]
        // 2. Iterate through all objects and create a map of {"<concept-id>": {"id": String, "name": String, "type": String}}
        // 3. Start with Domains and start creating nodes recursively
        this.conceptData = [
            {
              "id": 1,
              "name": "Appetizers",
              "nodes": [
                {"id": 110, "name": "Jalapenos Nachos"},
                {"id": 120, "name": "Quesadilla", "nodes": [
                  {"id": 121, "name": "with Cheese", "selectable": "selectable"},
                  {"id": 122, "name": "with Beef", "selectable": "selectable"},
                  {"id": 123, "name": "with Chiclen", "selectable": "selectable"}
                  ]},
                {"id": 130, "name": "Toquitos Chicken or Beef"},
                {"id": 140, "name": "Chips", "nodes": [
                  {"id": 141, "name": "with Cheese"},
                  {"id": 142, "name": "with Cheese & Beans"}
                ]}
              ]
            },

            {
              "id": 2,
              "name": "Tacos",
              "nodes": [
                {"id": 210, "name": "Carnitas", nodes: []},
                {"id": 220, "name": "Carne Asada"},
                {"id": 230, "name": "Chicken", nodes: []},
                {"id": 240, "name": "Shredded Beef"},
                {"id": 250, "name": "Al Pastor"},
                {"id": 260, "name": "Crispy Potato"}
              ]
            },

            {
              "id": 3,
              "name": "Breakfast",
              "nodes": [
                {"id": 310, "name": "Huevos Rancheros"},
                {"id": 320, "name": "Machaca Plate"},
                {"id": 330, "name": "Hievos a la Mexicana"},
                {"id": 340, "name": "Chile Verde Omelette"}
              ]
            }
        ];
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
