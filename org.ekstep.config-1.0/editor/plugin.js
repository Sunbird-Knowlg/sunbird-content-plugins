/**
 * Config
 * The purpose of {@link Configplugin} is to encapsulate configurable properties and providing a UI for changing values
 *
 * @class Config
 * @extends EkstepEditor.basePlugin
 *
 * @author Harishkumar Gangula <harishg@ilimi.in>
 */
EkstepEditor.basePlugin.extend({
    /** @member {undefined|Object} canvasOffset
     * @memberof Config
     */
    canvasOffset: undefined,
    /** @member {undefined|String} selectedPluginId
     * @memberof Config
     */
    selectedPluginId: undefined,
    margin: {
        left: 0,
        top: 60,
    },
    /** @member {undefined|Array} pluginConfigManifest
     * @memberof Config
     */
    pluginConfigManifest: undefined,
    /** @member {undefined|Array} configData
     * @memberof Config
     */
    configData: undefined,
    /**
     * 
     * The events are registred which are used to update the selected editor object
     * <br/>Assign canvasOffset using <b>jquery</b> offset method
     * <br/>Initialize toolbar 
     * @override
     * @memberof Config
     */
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("config:show", this.showConfig, this);
        EkstepEditorAPI.addEventListener("stage:unselect", this.stageUnselect, this);
        EkstepEditorAPI.addEventListener("config:help", this.showHelp, this);
        EkstepEditorAPI.addEventListener("config:properties", this.showProperties, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:colorpicker", this.showColorPicker, this);
        EkstepEditorAPI.addEventListener("object:modified", this.objectModified, this);
        var angScope = EkstepEditorAPI.getAngularScope();
        angScope.safeApply(function() {
            angScope.contextToolbar = instance.manifest.editor.data.toolbars;
        });

        this.canvasOffset = EkstepEditor.jQuery('#canvas').offset();
    },
    /**
     * Place config toolbar on top of plugin, based on its location
     * @param event object:selected
     * @param data id of the selected plugin
     * @memberof Config
     */
    objectSelected: function(event, data) {
        var instance = this;
        this.selectedPluginId = data.id;
        var plugin = EkstepEditorAPI.getPluginInstance(data.id);
        EkstepEditor.jQuery('#toolbarOptions').offset({
            top: (instance.canvasOffset.top + plugin.editorObj.top - instance.margin.top),
            left: (instance.canvasOffset.left + plugin.editorObj.left - instance.margin.left)
        });
        EkstepEditor.jQuery('#toolbarOptions').show();
    },
    objectUnselected: function(event, data) {
        EkstepEditor.jQuery('#toolbarOptions').hide();
        EkstepEditor.jQuery("#plugin-toolbar-container").hide();
    },
    /**
     *  Show configuration
     *  <br/> 1. Gets the selected object from canvas and toolbar is location is set and based on selected object location in canvas
     *  <br/> 2. Get the selected plugin manifest and config data and assign it to angular scope to render the view and update angular model with config data
     *  <br/> 3. Watches the config data with angular watch method and on change of config data calls updateConfig method
     *  <br/> 4. Iterates pluginConfigManifest  and invoke method is called
     *  @param event config:show is the event called
     *  @param data Object type is sent to method
     *  @memberof Config
     */
    showConfig: function(event, data) {
        var instance = this;
        this.pluginConfigManifest = _.clone(EkstepEditorAPI.getCurrentObject().getPluginConfig());
        this.configData = _.clone(EkstepEditorAPI.getCurrentObject().getConfig());
        if (_.isUndefined(this.pluginConfigManifest)) {
            this.pluginConfigManifest = [];
            EkstepEditorAPI.getCurrentObject().renderConfig();
        }
        var angScope = EkstepEditorAPI.getAngularScope();
        angScope.safeApply(function() {
            angScope.pluginConfig = instance.pluginConfigManifest;
            angScope.configData = instance.configData;
            angScope.$watch('configData', function(newValue, oldValue) {
                instance.updateConfig(newValue, oldValue);
            }, true);

        });
        _.forEach(instance.pluginConfigManifest, function(config) {
            instance.invoke(config, instance.configData)
        })

        /*
        semantic ui apply
         */
        setTimeout(function() {
            EkstepEditor.jQuery(".ui.dropdown").each(function() {
                EkstepEditor.jQuery(this).dropdown();
            })
        }, 500);
        this.animateToolbar("pluginConfig");
    },
    /**
     * This is called on stage unselect event fired 
     * This will hide toolbar if it is visible on DOM
     * @param data {Object}
     * @memberof Config
     */
    stageUnselect: function(data) {
        EkstepEditor.jQuery('#toolbarOptions').hide();
    },
    /**
     * This method invokes any config items require to  initialize before showing in config toolbar
     * @param  config {Array}
     * @param  configData {Array}
     * @memberof Config
     */
    invoke: function(config, configData) {
        configData = configData || {};
        if (config.dataType === 'colorpicker') {
            var eventData = { id: config.propertyName, callback: this.onConfigChange, color: configData[config.propertyName] };
            setTimeout(function() { EkstepEditorAPI.dispatchEvent("colorpicker:state", eventData) }, 500);
        }
    },
    /**
     * This method gets the old and new config data and compares the both and calls the onConfigChange method with the key and value of new value
     * @param  newValue {Object}
     * @param  oldValue {Object}
     * @memberof Config
     */
    updateConfig: function(newValue, oldValue) {
        var instance = this;
        var changedValues = _.reduce(oldValue, function(result, value, key) {
            return _.isEqual(value, newValue[key]) ?
                result : result.concat(key);
        }, []);
        _.forEach(changedValues, function(cv) {
            instance.onConfigChange(cv, newValue[cv]);
        })
    },
    /**
     * This will call the selected plugin onConfigChange method with key and value which is recevied as params
     * @param  key {String}
     * @param  value {Any}
     * @memberof Config
     */
    onConfigChange: function(key, value) {
        EkstepEditorAPI.getCurrentObject().onConfigChange(key, value);
    },
    /**
     * This is lifecycle method called when object saves the all the config data at a time
     * @param  config {Object}
     * @memberof Config
     */
    saveConfig: function(config) {
        EkstepEditorAPI.getCurrentObject().saveConfig(config);
    },
    /**
     * This method called when config:help event is fired  
     * <br/> It will show the help data for the selected plugin 
     * @param  event {Object}
     * @param  data {Object}
     *  @memberof Config
     */
    showHelp: function(event, data) {
        var instance = this;
        EkstepEditorAPI.getCurrentObject().getHelp(function(helpText) {
            EkstepEditor.jQuery("#pluginHelp").html(micromarkdown.parse(helpText));
            instance.animateToolbar("pluginHelpContent");
        });
    },
    /**
     * This method called when config:properties event is fired  
     * It shows the properties of the selected plugin
     * @param  event {Object}
     * @param  data {Object}
     * @memberof Config
     */
    showProperties: function(event, data) {
        var properties = EkstepEditorAPI.getCurrentObject().getProperties();
        var angScope = EkstepEditorAPI.getAngularScope();
        angScope.safeApply(function() {
            angScope.pluginProperties = properties;
        });
        this.animateToolbar("pluginProperties");
    },
    /**
     * * This method called when object:moving or object:scaling events is fired 
     * It will moves the toolbar with plugin object when moving and scaling in canvas 
     * @param  event {Object}
     * @param  data {Object}  
     * @memberof Config   
     */
    objectModified: function(event, data) {
        if (data && data.id) {
            this.selectedPlugin = data.id;
            var plugin = EkstepEditorAPI.getPluginInstance(data.id);
            if (!_.isUndefined(plugin)) {
                EkstepEditor.jQuery('#toolbarOptions').show();
                EkstepEditor.jQuery('#toolbarOptions').offset({
                    top: (this.canvasOffset.top + plugin.editorObj.top - this.margin.top),
                    left: (this.canvasOffset.left + plugin.editorObj.left - this.margin.left)
                });
                EkstepEditor.jQuery('#plugin-toolbar-container').offset({
                    top: (this.canvasOffset.top + plugin.editorObj.top),
                    left: (this.canvasOffset.left + plugin.editorObj.left + plugin.editorObj.getWidth() + this.margin.left + 15)
                });
            } else {
                EkstepEditor.jQuery('#toolbarOptions').hide();
                EkstepEditor.jQuery('#plugin-toolbar-container').hide();
            }
        }
    },
    animateToolbar: function(id) {
        var selectedPluginObj = EkstepEditorAPI.getCurrentObject().editorObj;
        EkstepEditor.jQuery("#plugin-toolbar-container").show();
        EkstepEditor.jQuery('#plugin-toolbar-container').offset({
            top: (this.canvasOffset.top + selectedPluginObj.top),
            left: (this.canvasOffset.left + selectedPluginObj.left + selectedPluginObj.getWidth() + this.margin.left + 15)
        });
        if (EkstepEditor.jQuery("#" + id).hasClass('active')) return;
        EkstepEditor.jQuery('#pluginToolbarShape')
            .shape({
                onChange: function() {
                    EkstepEditor.jQuery("#pluginToolbarShape .side").each(function() {
                        EkstepEditor.jQuery(this).removeClass('active');
                    })
                    EkstepEditor.jQuery("#" + id).addClass('active');
                }
            }).shape('flip right');
    }
});
//# sourceURL=configplugin.js
