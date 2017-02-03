/**
 * This plugin is used to add activities to the content
 * @class activityBrowser
 * @extends EkstepEditor.basePlugin
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */

EkstepEditor.basePlugin.extend({
    currentInstance: undefined,
    /**
     * registers events
     * @memberof activityBrowser
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener("org.ekstep.activitybrowser:showpopup", this.loadBrowser, this);
        setTimeout(function() {
            var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.activitybrowser-1.0/editor/activityBrowser.html';
            var controllerPath = EkstepEditor.config.pluginRepo + '/org.ekstep.activitybrowser-1.0/editor/activityBrowser.js';
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);

    },
    /**
     * This method used to create the text fabric object and assigns it to editor of the instance
     * convertToFabric is used to convert attributes to fabric properties 
     * @memberof activityBrowser
     */
    newInstance: function() {
        
    },
    /**        
     *   load html template into the popup
     *   @param parentInstance 
     *   @param attrs attributes
     *   @memberof activityBrowser
     */
    loadBrowser: function() {
        currentInstance = this;
        EkstepEditorAPI.getService('popup').open({
            template: 'activityBrowser',
            controller: 'activityBrowserCtrl',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return currentInstance;
                }
            },
            width: 900,
            showClose: false,
            className: 'ngdialog-theme-plain'
        }, function() {
            
        });

    }
});
//# sourceURL=activitybrowserplugin.js
