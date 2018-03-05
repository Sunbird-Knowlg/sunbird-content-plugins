/**
 * @description
 * @extends org.ekstep.collectioneditor.basePlugin
 * @since 1.0
 * @author Kartheek Palla And Manjunath Davanam
 */

org.ekstep.collectioneditor.metadataPlugin.extend({
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
        ecEditor.addEventListener('editor:form:cancel', this.cancelAction, this);
        ecEditor.addEventListener('editor:form:success', this.successAction, this);
        this.getConfigurations();
    },

    /**
     * @description
     */
    onConfigChange: function(key, value) {
        this.newForm = this.applyDependencyRules(key, value);
        this.updateForm(newForm, this.resourceBundle);
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
    getConfigurations: function() {
        var instance = this;
        async.parallel({
            config: function(callback) {
                // get the formConfigurations data
                callback(undefined, {})
            },
            framework: function(callback) {
                // get the framworkData
                callback(undefined, {})
            },
            resourceBundle: function(callback) {
                // get the resource bundle data
                callback(undefined, {})
            }
        }, function(err, results) {
            // results is now equals to: {config: {}, framework: {}, resourceBundle:{}}
            instance.loadTemplate("template");
            instance.resourceBundle = results.resourceBundle;
            instance.framework = results.framework;
            instance.config = results.config;
            instance.renderForm(results.config, instance.resourceBundle);
        });
    },

    /**
     * @description - Which is used to merge the configurations.
     */
    mergeConfigurations: function() {

    },
});
//# sourceURL=sunbirdmetadataplugin.js;