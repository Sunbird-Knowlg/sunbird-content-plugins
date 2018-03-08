/**
 * @description
 * @extends org.ekstep.collectioneditor.basePlugin
 * @since 1.0
 * @author Kartheek Palla And Manjunath Davanam
 */

org.ekstep.collectioneditor.metadataPlugin.extend({
    /**
     * @description -
     */
    form: {},

    /**  
     * @description - Resource Bundle object.
     */
    resourceBundle: {},

    /**
     * @description - Framwork association object which is used to map the relationship between fields. eg:(Grade, class)
     */
    framework: {},

    /**
     * @description - Form configuration object.
     */
    config: {},

    /**
     * @description - Initialization of the plugin.
     */
    initialize: function() {
        var instance = this;
        ecEditor.addEventListener('editor:form:cancel', this.cancelsAction, this);
        ecEditor.addEventListener('editor:form:success', this.successAction, this);
        ecEditor.addEventListener('org.ekstep.editcontentmeta:showpopup', this.showForm, this);
        this.getConfigurations(function(error, response) {
            instance.resourceBundle = response.resourceBundle;
            instance.framework = response.framework.data.result.framework;
            instance.config = response.config;
            instance.config = dyanamic; // Remove this line
            instance.form = instance.mapObject(instance.config, instance.framework.categories);
            instance.renderForm(instance.form, instance.resourceBundle);
        });
    },

    /**
     * @description
     */
    onConfigChange: function(event, key, value) {
        var form = this.applyDependencyRules(key, value);
        this.updateForm(form, this.resourceBundle);
    },

    /**
     * @description
     */
    successAction: function(event, data, successCB) {
        if (this.validated()) {
            // invokeRelated Action
            successCB && successCB();
        }
    },

    /**
     * @description
     */
    cancelAction: function(event, data, cancelCB) {
        if (this.validated()) {
            // Invoke related Action
            cancelCB && cancelCB()
        }
    },

    /**
     * @description - Which get the form configurations, framework and resource bundle data
     *                Which makes async parallel call.
     */
    getConfigurations: function(callback) {
        var instance = this;
        async.parallel({
            config: function(callback) {
                // get the formConfigurations data
                callback(undefined, {})
            },
            framework: function(callback) {
                // get the framworkData
                var frameworkId = ecEditor.getContext('framework') || org.ekstep.services.collectionService.defaultFramwork;
                ecEditor.getService(ServiceConstants.META_SERVICE).getCategorys(frameworkId, function(error, response) {
                    if (!error) callback(undefined, response)
                    else throw 'Unable to fetch the framework data.'
                })
            },
            resourceBundle: function(callback) {
                // get the resource bundle data
                callback(undefined, {})
            }
        }, function(error, response) {
            // results is now equals to: {config: {}, framework: {}, resourceBundle:{}}
            instance.loadTemplate("template");
            console.log("result", response);
            callback(err, response);
        });
    },

    /**
     * @param {Object} destination
     * @param {Object} source
     * @description - Which is used to merge the framework object into configurations
     *              - By mapping code attribute
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

    getFormFields: function() {
        return this.form;
    }
});
//# sourceURL=sunbirdmetadataplugin.js;