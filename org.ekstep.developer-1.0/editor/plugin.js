EkstepEditor.basePlugin.extend({
    initialize: function() {
        EkstepEditorAPI.addEventListener("org.ekstep.developer:loadplugin", this.loadPlugin, this);
        EkstepEditorAPI.jQuery('#addPlugin').popup({ on: 'click', popup: EkstepEditorAPI.jQuery("#addPluginContainer"), position: 'bottom left' });
    },
    loadPlugin: function(event, data) {
        var scope = EkstepEditorAPI.getAngularScope();
        console.log(data);
        EkstepEditor.config.contribURL = data.server;
        EkstepEditor.pluginManager.loadContribPlugin(data.pluginId, data.pluginVersion,function (err,resp) {
            if (err) {
                scope.contributedPluginMessageClass = "error";
                scope.contributedPluginMessage = "Unable to load Plugin";
            } else{
                scope.contributedPluginMessageClass = "success";
                scope.contributedPluginMessage = resp;
            }
            setTimeout(function () {
                scope.contributedPluginMessageClass = "";
                scope.contributedPluginMessage = undefined;
                EkstepEditorAPI.ngSafeApply(scope,function () {});
            },2000);
           EkstepEditorAPI.ngSafeApply(scope,function () {}); 
        });
    }
});
//# sourceURL=developerplugin.js
