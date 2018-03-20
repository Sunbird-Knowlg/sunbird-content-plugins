/**
 * @description
 * @extends org.ekstep.collectioneditor.basePlugin
 * @since 1.0
 * @author Kartheek Palla And Manjunath Davanam
 */

org.ekstep.contenteditor.metadataPlugin.extend({
    /**
     * @property    - Form object which contains field details with framework and resource bundle
     */
    form: {},

    /**  
     * @property    - Resource Bundle object.
     */
    resourceBundle: {},

    /**
     * @property     - Framwork association object which is used to map the relationship between fields. eg:(Grade, class)
     */
    framework: {},

    /**
     * @property     - Form configuration object
     */
    config: {},

    /**
     * @property      - List of are event are mapped with the action
     */
    eventMap: { save: "org.ekstep.contenteditor:save", review: "org.ekstep.contenteditor:review" },

    /**
     * @description    - Initialization of the plugin.
     */
    initialize: function() {
        var instance = this;
        ecEditor.addEventListener('editor:form:cancel', this.cancelAction, this);
        ecEditor.addEventListener('editor:form:success', this.successAction, this);
        ecEditor.addEventListener('editor:form:change', this.onConfigChange, this);
        ecEditor.addEventListener('editor:form:reset', this.resetFields, this);
        ecEditor.addEventListener('org.ekstep.editcontentmeta:showpopup', this.showForm, this);
        this.getConfigurations({ templateId: "", channel: "", contentType: "" }, function(error, res) {
            res ? instance.renderForm({ resourceBundle: res.resourceBundle, framework: res.framework.data.result.framework, formConfig: res.config }) : console.error('Fails to render')
        });
    },

    /**
     * @description         - When field value changes. Currenlty, Event is dispatching
     *                        only when drop down value changes
     */
    onConfigChange: function(event, object) {},

    /**
     * @event           -'editor:form:success'
     *                  
     * @description     - Which is used to perform the save/review actions when form is submitted.
     *                    Which is currently handles 'review` and `save' action
     */
    successAction: function(event, data) {
        let instance = this;
        if (data.isValid) {
            this.updateState(data.formData);
            // Callback function
            let callbackFn = function(err, res) {
                if (res && res.data && res.data.responseCode == "OK") {
                    data.callback && data.callback(undefined, res);
                } else {
                    data.callback && data.callback(err, undefined);
                }
            }
            let options = {
                savingPopup: true,
                successPopup: true,
                failPopup: true,
                contentMeta: data.formData,
                showNotification: true,
                callback: callbackFn
            };

            switch (this.config.action) {
                case 'review':
                    this.reviewFn(options, callbackFn);
                    break;
                case 'save':
                    this.saveFn(options, callbackFn)
                    break;
                default:
                    console.error(this.config.action + 'Action wont support ')
            }
        } else {
            throw 'Invalid form data'
        }
    },

    /**
     * @description                 - Which is used send the content to review status 
     *                                Before sending the content it will update the content
     * @param {Object} options      - which should have properties related to notification.
     * 
     * @param {Fn} callbackFn       - Callback function
     */
    reviewFn: function(options, callbackFn) {
        let instance = this;
        ecEditor.dispatchEvent(this.eventMap['save'], {
            callback: function(err, res) {
                if (!err) {
                    ecEditor.dispatchEvent(instance.eventMap[instance.config.action], callbackFn)
                } else {
                    throw 'Unable to update the fields value before sending to review status'
                    callbackFn(err)
                }
            }
        })

    },


    /**
     * @description              - Which is used to update the content
     * 
     * @param {Object} options      - which should have properties related to notification.
     * 
     * @param {Fn} callbackFn       - Callback function
     */
    saveFn: function(options, callbackFn) {
        ecEditor.dispatchEvent(this.eventMap[this.config.action], options)
    },


    /**
     * @description              - When cancel action is invoked
     * 
     * @event                    - 'editor:form:cancel'
     * 
     * @param {Object} data      - Which contains a callback method and other options 
     */
    cancelAction: function(event, data) {
        data.callback && data.callback()
    },

    /**
     * @description             - Which get the form configurations, framework and resource bundle data
     *                            Which makes async parallel call.
     */
    getConfigurations: function({ temaplateId, channel } = {}, callback) {
        var instance = this;
        async.parallel({
            config: function(callback) {
                // get the formConfigurations data
                callback(undefined, {})
            },
            framework: function(callback) {
                // get the framworkData
                var frameworkId = ecEditor.getContext('framework');
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
            callback(err, response);
        });
    },

    /**
     * @description             - Which returns the current form object.
     * 
     * @returns {Object}    
     */
    getFormFields: function() {
        return this.form;
    },

    /**
     * @description             - Which is used to render the form with the configurations.
     * 
     * @param {Object} formObj  - Form object it should have configurations, resourceBundle, framework object
     * 
     * @example                 - {resourceBundle:{},framework:{},config:{}}
     */
    renderForm: function({ resourceBundle, framework, formConfig } = {}) {
        this.resourceBundle = resourceBundle;
        this.framework = framework;
        this.config = formConfig;
        this.config = window.formConfigurations; // Remove this line
        this.form = this.mapObject(this.config.fields, this.framework.categories);
        this.loadTemplate(this.config.templateName);
    },


    /**
     * @description             - Which is used to set the state of form object.
     * 
     * @param {Object} stateObj - It should contain the {isRoot, isNew, and form metaData information}
     */
    updateState: function({ nodeId, isRoot, isNew, metaData } = {}) {
        let key = nodeId;
        let value = {};
        value.root = isRoot;
        value.isNew = isNew;
        value.metadata = metaData;
        org.ekstep.services.stateService.create("nodesModified");
        org.ekstep.services.stateService.setState("nodesModified", key, value);
    }

});
//# sourceURL=sunbirdmetadataplugin.js;