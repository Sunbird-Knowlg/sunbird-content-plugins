org.ekstep.collectioneditor.basePlugin.extend({
    currentInstance: undefined,

    /**
     * registers events
     * @memberof collaborator
     */
    initialize: function() {
        var instance = this;
        console.log("Plugin initialized");
        ecEditor.addEventListener("collaborator:add", this.loadBrowser, this);
    	var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/collaborator.html");
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/collaboratorApp.js");
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
        console.log('templatePath',templatePath );
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
    */
   loadBrowser: function() {
       console.log("loading browser");
       currentInstance = this;

       console.log('currentInstance', currentInstance);

       ecEditor.getService('popup').open({
           template: 'partials/collaborator',
           controller: 'collaboratorCtrl',
           controllerAs: '$ctrl',
           resolve: {
               'instance': function() {
                   return currentInstance;
               }
           },
           width: 851,
           showClose: false,
           closeByDocument: false,
           closeByEscape: false,
           className: 'ngdialog-theme-plain'
       }, function() {});

   }
});
//# sourceURL=collaboratorPlugin.js
