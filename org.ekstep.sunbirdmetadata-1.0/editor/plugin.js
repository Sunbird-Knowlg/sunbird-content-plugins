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
     * 
     */
    actionMap: { save: "org.ekstep.contenteditor:save", review: "org.ekstep.contenteditor:review" },

    /**
     * @description - Initialization of the plugin.
     */
    initialize: function() {
        var instance = this;
        ecEditor.addEventListener('editor:form:cancel', this.cancelAction, this);
        ecEditor.addEventListener('editor:form:success', this.successAction, this);
        ecEditor.addEventListener('editor:form:change', this.onConfigChange, this);
        ecEditor.addEventListener('editor:form:reset', this.resetFields, this);
        ecEditor.addEventListener('org.ekstep.editcontentmeta:showpopup', this.showForm, this);
        this.getConfigurations(function(error, response) {
            response ? instance.renderForm(response) : console.error("Fails to render")
        });
    },

    /**
     * @description
     */
    onConfigChange: function(event, object) {},

    /**
     * @description
     */
    successAction: function(event, data) {
        if (data.isValid) {
            let event = this.actionMap[this.config.action];
            this.updateState(data.formData);
            ecEditor.dispatchEvent(event, {
                savingPopup: false,
                successPopup: false,
                failPopup: false,
                contentMeta: data.formData,
                callback: function(err, res) {
                    if (res && res.data && res.data.responseCode == "OK") {
                        data.callback && data.callback(undefined, res);
                    } else {
                        data.callback && data.callback(err, undefined);
                    }
                }
            })
        } else {
            throw 'Invalid form data'
        }
    },
    /**
     * @description
     */
    cancelAction: function(event, data) {
        data.callback && data.callback()
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

            console.log("result", response);
            callback(err, response);
        });
    },

    /**
     * @description - Which returns the current form object.
     * @returns {Object}
     */
    getFormFields: function() {
        return this.form;
    },

    /**
     * @description -
     * @param {Object} formObj  - Form object it should have configurations, resourceBundle, framework object
     * @example {resourceBundle:{},framework:{},config:{}}
     */
    renderForm: function(formObj) {
        this.resourceBundle = formObj.resourceBundle;
        this.framework = formObj.framework.data.result.framework;
        this.config = formObj.config;
        this.config = formConfigurations; // Remove this line
        this.form = this.mapObject(this.config.fields, this.framework.categories);
        this.loadTemplate(this.config.templateName);
    },

    updateState: function(stateObj) {
        let key = stateObj.nodeId;
        let value = {};
        value.root = stateObj.isRoot;
        value.isNew = stateObj.isNew;
        value.metadata = stateObj.metaData;
        org.ekstep.services.stateService.setState(key, value);
    }

});
//# sourceURL=sunbirdmetadataplugin.js;