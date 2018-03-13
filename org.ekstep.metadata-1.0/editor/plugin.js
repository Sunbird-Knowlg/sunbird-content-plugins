/**
 * @description
 * @extends org.ekstep.collectioneditor.metadataPlugin
 * @since 1.0
 * @author Kartheek Palla And Manjunath Davanam
 */
org.ekstep.collectioneditor.metadataPlugin = org.ekstep.collectioneditor.basePlugin.extend({

    /**
     *@description - Initialization of the metdata form plugin.
     *@event 'org.ekstep.editcontentmeta:showpopup'
     */
    initialize: function() {},

    /**
     * TODO:
     * @param {Object} fields
     * @description - Which is used to validate the fields.
     */
    validate: function(fields) {},


    /**
     * TODO:
     * @description - Which is used to reset the form.
     */
    resetFields: function() {},

    renderForm: function() {},

    /**
     * @description
     */
    showForm: function() {
        var instance = this;
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).open({
            template: 'metadataTemplate',
            controller: 'metadataform',
            controllerAs: '$ctrl',
            resolve: {
                'configurations': function() {
                    return instance.getFormFields();
                }
            },
            width: 900,
            showClose: false
        });
    },

    /**
     * @param {String} templateName  - Name of the template
     * @description - Which loads the template 
     */
    loadTemplate: function(templateName) {
        var templatePath = ecEditor.resolvePluginResource("org.ekstep.metadata", "1.0", `editor/templates/${templateName}.html`);
        var controllerPath = ecEditor.resolvePluginResource("org.ekstep.metadata", "1.0", "editor/controller.js");
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
    },

    /**
     * @description
     */
    getFormFields: function( /*Child class should return the form field data*/ ) {},


    /**
     * @param {Object} destination
     * @param {Object} source
     * @description - Which is used to merge the "Framework object into Form Configurations"
     *              - By mapping code attribute
     * @returns {Object}
     */
    mapObject: function(destination, source) {
        destination.forEach(function(dest) {
            source.forEach(function(src) {
                if (dest.code === src.code) {
                    dest.range = src.terms;
                }
            })
        });
        return destination;
    },


});
//# sourceURL=metadataPlugin.js