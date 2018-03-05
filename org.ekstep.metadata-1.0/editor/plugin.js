/**
 * @description
 * @extends org.ekstep.collectioneditor.metadataPlugin
 * @since 1.0
 * @author Kartheek Palla And Manjunath Davanam
 */
org.ekstep.collectioneditor.metadataPlugin = org.ekstep.collectioneditor.basePlugin.extend({
    /**
     *@description
     */
    initialize: function() {
        ecEditor.addEventListener('org.ekstep.editcontentmeta:showpopup', this.invokeTemplate, this);
    },

    /**
     * @param  {Object} fields
     * @param  {Object} resourceBundle
     * @description 
     */
    renderForm: function(fields, resourceBundle) {},

    /**
     * @param  {Object} fields
     * @param  {Object} resourceBundle
     * @description
     */
    updateForm: function(fields, resourceBundle) {},


    /**
     */
    applyDependencyRules: function(key, value) {
        var newForm = {};
        return newForm;
    },

    /**
     * @param {Object} fields
     */
    validate: function(fields) {},


    /**
     * @description
     */
    reset: function() {},


    /**
     * @param  {String} templateId
     * @description
     */
    invokeTemplate: function() {
        var instance = this;
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).open({
            template: 'metadataTemplate',
            controller: 'metadata',
            controllerAs: '$ctrl',
            resolve: {
                'data': function() {
                    return data;
                }
            },
            width: 900,
            showClose: false
        });
    },
    loadTemplate: function(templateName) {
        var templatePath = ecEditor.resolvePluginResource("org.ekstep.metadata", "1.0", `editor/templates/${templateName}.html`);
        var controllerPath = ecEditor.resolvePluginResource("org.ekstep.metadata", "1.0", "editor/controller.js");
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
    }


});
//# sourceURL=metadataPlugin.js