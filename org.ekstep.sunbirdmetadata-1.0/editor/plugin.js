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
     * 
     */

    mappedResponse: {},

    /**
     * @property      - List of are event are mapped with the action
     */
    eventMap: { savemeta: 'org.ekstep.contenteditor:save:meta', review: 'org.ekstep.contenteditor:review', save: 'org.ekstep.contenteditor:save' },

    options: {
        savingPopup: false,
        successPopup: true,
        failPopup: true,
        contentMeta: {},
        showNotification: true,
        callback: undefined
    },

    /**
     * @description    - Initialization of the plugin.
     */
    initialize: function() {
        var instance = this
        ecEditor.addEventListener('editor:form:cancel', this.cancelAction, this)
        ecEditor.addEventListener('editor:form:success', this.successAction, this)
        ecEditor.addEventListener('editor:form:change', this.onConfigChange, this)
        ecEditor.addEventListener('editor:form:reset', this.resetFields, this)
        ecEditor.addEventListener('org.ekstep.editcontentmeta:showpopup', this.invoke, this)

    },

    invoke: function(event, config) {
        console.log("fds")
        var instance = this;
        if (!this.isConfigurationsExists(config.subType, config.action)) {
            this.getConfigurations(config, function(error, res) {
                if (res) {
                    instance.mapResponse(config.subType, config.action, { resourceBundle: res.resourceBundle, framework: res.framework.data.result.framework, formConfig: res.config })
                    instance.renderForm({ resourceBundle: res.resourceBundle, framework: res.framework.data.result.framework, formConfig: res.config })
                } else {
                    console.error('Fails to render', error)
                }   

            })
        } else {
            instance.renderForm(instance.getMappedResponse(config.subType, config.action))
        }
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
        var instance = this
        if (data.isValid) {
            if (data.formData.metaData.mimeType === 'application/vnd.ekstep.content-collection') this.updateState(data.formData)
                // Callback function
            var callbackFn = function(err, res) {
                if (res && res.data && res.data.responseCode == 'OK') {
                    data.callback && data.callback(undefined, res)
                } else {
                    data.callback && data.callback(err, undefined)
                }
            }
            switch (this.config.action) {
                case 'review':
                    this.reviewFn(data.formData.metaData, callbackFn)
                    break
                case 'save':
                    this.saveMetaFn(data.formData.metaData, callbackFn)
                    break
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
    reviewFn: function(data, callbackFn) {
        var instance = this
        var reviewCallBackFn = function(err, res) {
            if (!err) {
                ecEditor.dispatchEvent(instance.eventMap[instance.config.action], callbackFn)
            } else {
                throw 'Unable to update the fields value before sending to review status'
                callbackFn(err)
            }
        }
        this.saveContentFn(data, reviewCallBackFn)
    },

    /**
     * @description              - Which is used to update the content
     *
     * @param {Object} options      - which should have properties related to notification.
     *
     * @param {Fn} callbackFn       - Callback function
     */
    saveMetaFn: function(contentMeta, callbackFn) {
        this.options.contentMeta = contentMeta
        this.options.callback = callbackFn
        ecEditor.dispatchEvent(this.eventMap['savemeta'], this.options)
    },

    /**
     * @description     -
     */
    saveContentFn: function(contentMeta, callbackFn) {
        this.options.contentMeta = contentMeta
        this.options.callback = callbackFn
        ecEditor.dispatchEvent(this.eventMap['save'], this.options)
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
    getConfigurations: function(request, callback) {
        var instance = this
        async.parallel({
            config: function(callback) {
                // get the formConfigurations data
                org.ekstep.services.configuration.getFormConfigurations({ request: request.formConfig }, function(error, response) {
                    //if (!error) callback(undefined, response)
                    //else throw 'Unable to fetch the form configurations.'
                    callback(undefined, window.formConfigurations)
                })
            },
            framework: function(callback) {
                // get the framworkData
                ecEditor.getService(ServiceConstants.META_SERVICE).getCategorys(request.framework, function(error, response) {
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
            callback(error, response)
        })
    },

    /**
     * @description             - Which returns the current form object.
     *
     * @returns {Object}
     */
    getFormFields: function() {
        return this.form
    },

    /**
     *
     *
     */
    getTemplate: function() {
        return this.config.templateName
    },

    /**
     * @description             - Which is used to render the form with the configurations.
     *
     * @param {Object} formObj  - Form object it should have configurations, resourceBundle, framework object
     *
     * @example                 - {resourceBundle:{},framework:{},config:{}}
     */
    renderForm: function(config) {
        this.resourceBundle = config.resourceBundle
        this.framework = config.framework
        this.config = config.formConfig
        this.form = this.mapObject(this.config.fields, this.framework.categories)
        this.loadTemplate(this.config.templateName);
        this.showForm()
    },

    /**
     * @description             - Which is used to set the state of form object.
     *
     * @param {Object} stateObj - It should contain the {isRoot, isNew, and form metaData information}
     */
    updateState: function(object) {
        var isNew = true
        var contentMeta = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId'))
        if (!_.isEmpty(contentMeta) && _.has(contentMeta, ['name'])) {
            isNew = false
        }
        var key = object.nodeId
        var value = {}
        value.root = object.isRoot || true // Currently, Supporting oly for root node
        value.isNew = object.isNew || isNew
        value.metadata = object.metaData
        org.ekstep.services.stateService.create('nodesModified')
        org.ekstep.services.stateService.setState('nodesModified', key, value)
    },

    /**
     * @description
     */
    mapResponse: function(type, action, value) {
        this.mappedResponse[type + '_' + action] = value;
    },

    /**
     * @description
     */
    isConfigurationsExists: function(type, action) {
        return this.mappedResponse[type + '_' + action] ? true : false
    },

    /**
     * @description
     */
    getMappedResponse: function(type, action) {
        return this.mappedResponse[type + '_' + action]
    }



})

// # sourceURL=sunbirdmetadataplugin.js