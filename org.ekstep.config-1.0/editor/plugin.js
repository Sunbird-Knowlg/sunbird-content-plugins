/**
 * Config
 * The purpose of {@link Configplugin} is to encapsulate configurable properties and providing a UI for changing values
 *
 * @class Config
 * @extends EkstepEditor.basePlugin
 *
 * @author Harish Gangula <harishg@ilimi.in>
 */
EkstepEditor.basePlugin.extend({

    canvasOffset: undefined,
    selectedPlugin: undefined,
    toolbarObj: undefined,
    margin: {
        left: 7.5,
        top: 30,
    },

    pluginConfigManifest: undefined,
    configData: undefined,
  /**
   * register events
   * initialize toolbar
   *
   *
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
        EkstepEditorAPI.addEventListener("object:moving", this.objectModifying, this);
        EkstepEditorAPI.addEventListener("object:scaling", this.objectModifying, this);
        var angScope = EkstepEditorAPI.getAngularScope();
        angScope.safeApply(function() {
            angScope.contextToolbar = instance.manifest.editor.data.toolbars;
        });
        this.canvasOffset = $('#canvas').offset();
        setTimeout(function() {
            instance.toolbarObj = Object.create(ToolBar);
            instance.toolbarObj.init({
                content: '#toolbar-options',
                position: 'top',
                style: 'dark',
                event: 'click'
            }, EkstepEditor.jQuery('#toolbarHiddenButton'));
            console.log('Context toolbar initialized');
        }, 1000);
    },
  /**
   * Place config toolbar on top of plugin, based on its location
   * @param event object:selected
   * @param data id of the selected plugin
   */
    objectSelected: function(event, data) {
        this.selectedPlugin = data.id;
        var plugin = EkstepEditorAPI.getPluginInstance(data.id);
        EkstepEditor.jQuery('#toolbarHiddenButton').offset({
            top: (this.canvasOffset.top + plugin.editorObj.top - this.margin.top),
            left: (this.canvasOffset.left + plugin.editorObj.left + (plugin.editorObj.getWidth() / 2) - this.margin.left)
        });
        if (this.toolbarObj) this.toolbarObj.show();
    },
    objectUnselected: function(event, data) {
        if (this.toolbarObj && this.selectedPlugin === data.id)
            this.toolbarObj.hide();
        EkstepEditor.jQuery("#plugin-toolbar-container").hide();
    },
  /**
   * Show configuration
   * @param event
   * @param data
   */
    showConfig: function(event, data) {
        var instance = this;
        var selectedPluginObj = EkstepEditorAPI.getCurrentObject().editorObj;
        EkstepEditor.jQuery("#plugin-toolbar-container").show();
        EkstepEditor.jQuery('#plugin-toolbar-container').offset({
            top: (this.canvasOffset.top + this.margin.top + selectedPluginObj.top),
            left: (this.canvasOffset.left + selectedPluginObj.left + selectedPluginObj.getWidth() + this.margin.left)
        });
        this.pluginConfigManifest = _.clone(EkstepEditorAPI.getCurrentObject().getPluginConfig());
        this.configData = _.clone(EkstepEditorAPI.getCurrentObject().getConfig());
        if (_.isUndefined(this.pluginConfigManifest)) {
            this.pluginConfigManifest = [];
            EkstepEditorAPI.getCurrentObject().renderConfig();
        }
        var angScope = EkstepEditorAPI.getAngularScope();
        angScope.safeApply(function() {
            angScope.showPluginConfig = true;
            angScope.showPluginHelp = false;
            angScope.showPluginProperty = false;
            angScope.pluginConfig = instance.pluginConfigManifest;
            angScope.configData = instance.configData;
            angScope.$watch('configData', function(newValue, oldValue) {
                instance.updateConfig(newValue, oldValue);
            }, true);

        });
        _.forEach(instance.pluginConfigManifest, function(config) {
            instance.invoke(config, instance.configData)
        })
    },
    stageUnselect: function(data) {
        if (this.toolbarObj)
            this.toolbarObj.hide();
    },
    invoke: function(config, configData) {
        configData = configData || {};
        if (config.dataType === 'colorpicker') {
            var eventData = { id: config.propertyName, callback: this.onConfigChange, color: configData[config.propertyName] };
            setTimeout(function() { EkstepEditorAPI.dispatchEvent("colorpicker:state", eventData) }, 500);
        }
    },
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
    onConfigChange: function(key, value) {
        EkstepEditorAPI.getCurrentObject().onConfigChange(key, value);
    },
    saveConfig: function(config) {
        EkstepEditorAPI.getCurrentObject().saveConfig(config);
    },
    showHelp: function() {
        EkstepEditor.jQuery("#plugin-toolbar-container").show();
        var angScope = EkstepEditorAPI.getAngularScope();
        angScope.safeApply(function() {
            angScope.showPluginConfig = false;
            angScope.showPluginHelp = true;
            angScope.showPluginProperty = false;
        });
        EkstepEditorAPI.getCurrentObject().getHelp(function(helpText) {
            EkstepEditor.jQuery("#pluginHelp").html(micromarkdown.parse(helpText));
        });

    },
    showProperties: function() {
        EkstepEditor.jQuery("#plugin-toolbar-container").show();
        var properties = EkstepEditorAPI.getCurrentObject().getProperties();
        var angScope = EkstepEditorAPI.getAngularScope();
        angScope.safeApply(function() {
            angScope.showPluginConfig = false;
            angScope.showPluginHelp = false;
            angScope.showPluginProperty = true;
            angScope.pluginProperties = properties;
        });
    },
    objectModifying: function(event, data) {
        if (data && data.id) {
            this.selectedPlugin = data.id;
            var plugin = EkstepEditorAPI.getPluginInstance(data.id);
            EkstepEditor.jQuery('#toolbarHiddenButton').offset({
                top: (this.canvasOffset.top + plugin.editorObj.top - this.margin.top),
                left: (this.canvasOffset.left + plugin.editorObj.left + (plugin.editorObj.getWidth() / 2) - this.margin.left)
            });
            if (this.toolbarObj) this.toolbarObj.show();
            EkstepEditor.jQuery('#plugin-toolbar-container').offset({
                top: (this.canvasOffset.top + this.margin.top + plugin.editorObj.top),
                left: (this.canvasOffset.left + plugin.editorObj.left + plugin.editorObj.getWidth() + this.margin.left)
            });
        }
    }
});
//# sourceURL=configplugin.js
