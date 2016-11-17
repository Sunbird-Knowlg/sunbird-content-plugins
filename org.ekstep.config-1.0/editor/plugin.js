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
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("config:show", this.showConfig, this);
        EkstepEditorAPI.addEventListener("stage:unselect", this.stageUnselect, this);
        EkstepEditorAPI.addEventListener("config:help", this.showHelp, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:colorpicker", this.showColorPicker, this);
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
    objectSelected: function(event, data) {

        var instance = this;
        this.selectedPlugin = data.id;
        var plugin = EkstepEditorAPI.getPluginInstance(data.id);
        EkstepEditor.jQuery('#toolbarHiddenButton').offset({
            top: (this.canvasOffset.top + plugin.editorObj.top - this.margin.top),
            left: (this.canvasOffset.left + plugin.editorObj.left + (plugin.editorObj.getWidth() / 2) - this.margin.left)
        });
        this.toolbarObj.show();

    },
    objectUnselected: function(event, data) {
        if (this.toolbarObj && this.selectedPlugin === data.id)
            this.toolbarObj.hide();
        EkstepEditor.jQuery("#plugin-toolbar-container").hide();
    },
    showConfig: function(event, data) {
        var instance = this;
        EkstepEditor.jQuery("#plugin-toolbar-container").show();
        this.pluginConfigManifest = _.clone(EkstepEditorAPI.getCurrentObject().getPluginConfig());
        this.configData = _.clone(EkstepEditorAPI.getCurrentObject().getConfig());
        if (_.isUndefined(this.pluginConfigManifest)) {
            this.pluginConfigManifest = [];
        }
        var angScope = EkstepEditorAPI.getAngularScope();
        angScope.safeApply(function() {
            angScope.showPluginConfig = true;
            angScope.showPluginHelp = false;
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
            var eventData = { id: config.propertyName, callback: this.onConfigChange, color: configData[config.propertyName]};
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
        });
        var helpText = EkstepEditorAPI.getCurrentObject().getHelp();
        var parsedText = micromarkdown.parse(helpText);
        EkstepEditor.jQuery("#pluginHelp").html(parsedText);
    }
});
