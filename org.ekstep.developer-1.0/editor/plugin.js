EkstepEditor.basePlugin.extend({
    initialize: function() {
        EkstepEditorAPI.addEventListener("org.ekstep.developer:loadplugin", this.loadPlugin, this);
        EkstepEditorAPI.addEventListener("org.ekstep.developer:getPlugins", this.listPlugins, this);
        EkstepEditorAPI.addEventListener("org.ekstep.developer:updateLocalServerPath", this.updateLocalServerPath, this);
        
        EkstepEditorAPI.jQuery('#addPlugin').popup({ on: 'click', popup: EkstepEditorAPI.jQuery("#addPluginContainer"), position: 'bottom center' });
        var scope = EkstepEditorAPI.getAngularScope();
        if (!scope.localServerPath) {
            EkstepEditor.config.contribURL = scope.localServerPath = "https://localhost:8081/";
            
        }
        scope.localServerPathEdit = false;
        EkstepEditorAPI.ngSafeApply(scope, function() {});
    },
    loadPlugin: function(event, data) {
        var scope = EkstepEditorAPI.getAngularScope();
        var pluginArray = data.plugin.split("-");
        EkstepEditor.localPluginUtil.loadContribPlugin(pluginArray[0], pluginArray[1], function(err, resp) {
            if (err) {
                scope.contributedPluginMessageClass = "error";
                scope.contributedPluginMessage = "Unable to load Plugin";
            } else {
                scope.contributedPluginMessageClass = "success";
                scope.contributedPluginMessage = resp;
            }
            setTimeout(function() {
                scope.contributedPluginMessageClass = "";
                scope.contributedPluginMessage = undefined;
                EkstepEditorAPI.ngSafeApply(scope, function() {});
            }, 2000);
            EkstepEditorAPI.ngSafeApply(scope, function() {});
        });
    },
    listPlugins: function(event, data) {
        var scope = EkstepEditorAPI.getAngularScope();
        scope.localPlugins = [];
        scope.contributedPluginMessageClass = "";
        scope.contributedPluginMessage = "";
        EkstepEditorAPI.jQuery.ajax({
            type: 'GET',
            url: EkstepEditor.config.contribURL+"list",
            beforeSend: function() {
                scope.localPluginsPlugins = true;
                EkstepEditorAPI.ngSafeApply(scope, function() {});
            },
            success: function(data) {
                if (EkstepEditorAPI._.isArray(data) && data.length === 0) {
                    scope.contributedPluginMessageClass = "info";
                    scope.contributedPluginMessage = "No plugins found.";
                }
                if(EkstepEditorAPI._.isArray(data)){
                    scope.localPlugins = data;
                }
                EkstepEditorAPI.ngSafeApply(scope, function() {});
            },
            error: function(err) {
                scope.contributedPluginMessageClass = "error";
                scope.contributedPluginMessage = "Unable to loadPlugins.";
            },
            complete: function () {
                scope.loadingContributedPlugins = false;
                EkstepEditorAPI.ngSafeApply(scope, function() {});
            }
        });

    },
    updateLocalServerPath: function (event, data) {
        var scope = EkstepEditorAPI.getAngularScope();
        EkstepEditor.config.contribURL = scope.localServerPath;
        scope.localServerPathEdit = false;
        EkstepEditorAPI.ngSafeApply(scope, function() {});
        this.listPlugins();
    }
});
//# sourceURL=developerplugin.js
