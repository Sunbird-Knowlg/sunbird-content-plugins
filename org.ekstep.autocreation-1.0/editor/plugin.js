org.ekstep.contenteditor.basePlugin.extend({
    currentInstance: undefined,

    /**
     * registers events
     * @memberof collaborator
     */
    initialize: function () {
        var instance = this;
        ecEditor.addEventListener("org.ekstep.autocreation:add", this.loadBrowser, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/autocreation.html");
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/autocreationApp.js");
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
    },
    /**
    *   load html template into the popup
    */
    loadBrowser: function (event, data) {
        console.log("in the creation");
        currentInstance = this;
        ecEditor.getService('popup').open({
            template: 'partials/autocreation',
            controller: 'autocreationCtrl',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function () {
                    return currentInstance;
                }
            },
            // width: 851,
            showClose: false,
            closeByDocument: false,
            closeByEscape: true,
            // className: 'ngdialog-theme-plain'
        }, function () { });

    }
});

//# sourceURL=collaboratorPlugin.js
