org.ekstep.contenteditor.basePlugin.extend({
    currentInstance: undefined,

    /**
     * registers events
     * @memberof collaborator
     */
    initialize: function () {
        var instance = this;
        ecEditor.addEventListener("org.ekstep.devconquestion:add", this.loadBrowser, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/worksheet.html");
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/worksheetApp.js");
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
    },
    /**
    *   load html template into the popup
    */
    loadBrowser: function (event, data) {
        currentInstance = this;
        ecEditor.getService('popup').open({
            template: 'partials/worksheet',
            controller: 'worksheetCtrl',
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
