EkstepEditor.basePlugin.extend({
    canvasOffset: undefined,
    selectedPlugin: undefined,
    toolbarObj: undefined,
    margin: {
        left: 7.5,
        top: 30,
    },
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("config:show", this.showConfig, this);
        EkstepEditorAPI.addEventListener("stage:unselect", this.stageUnselect, this);
        EkstepEditorAPI.addEventListener("config:update", this.configUpdate, this);
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
        this.selectedPlugin = data.id;
        var plugin = EkstepEditorAPI.getPluginInstance(data.id);
        EkstepEditor.jQuery('#toolbarHiddenButton').offset({
            top: (this.canvasOffset.top + plugin.editorObj.top - this.margin.top),
            left: (this.canvasOffset.left + plugin.editorObj.left + (plugin.editorObj.width / 2) - this.margin.left)
        });
        this.toolbarObj.show();
        var pluginConfig = EkstepEditorAPI.getCurrentObject().getPluginConfig();
        if (_.isUndefined(pluginConfig)) {
            pluginConfig = [];
        }
        pluginConfig["pluginId"] = EkstepEditorAPI.getCurrentObject().id;
        var angScope = EkstepEditorAPI.getAngularScope();
        angScope.safeApply(function() {
            angScope.pluginConfig = pluginConfig;
        });
    },
    objectUnselected: function(event, data) {
        if (this.toolbarObj && this.selectedPlugin === data.id)
            this.toolbarObj.hide();
        EkstepEditor.jQuery("#plugin-toolbar-container").hide();
    },
    showConfig: function(event, data) {
        EkstepEditor.jQuery("#plugin-toolbar-container").toggle();
        var pluginConfig = EkstepEditorAPI.getCurrentObject().getPluginConfig();
        EkstepEditorAPI.getCurrentObject().resetConfig();
    },
    stageUnselect: function(data) {
        if (this.toolbarObj)
            this.toolbarObj.hide();
    },
    configUpdate: function(event, data) {
        EkstepEditorAPI.getCurrentObject().resetConfig(data);
    }
});
