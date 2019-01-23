org.ekstep.contenteditor.basePlugin.extend({
    currentInstance: undefined,

    /**
     * registers events
     * @memberof timetable
     */
    initialize: function () {
        var instance = this;
        ecEditor.addEventListener("org.ekstep.timetable:add", this.loadBrowser, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/timetable.html");
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/timetableApp.js");
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
    },
    /**
    *   load html template into the popup
    */
    loadBrowser: function (event, data) {
        currentInstance = this;
        ecEditor.getService('popup').open({
            template: 'partials/timetable',
            controller: 'timetableCtrl',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function () {
                    return currentInstance;
                }
            },
            width: "100%",
            height: "250%",
            showClose: false,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-plain'
        }, function () { });

    }
});

//# sourceURL=timetabledashboardplugin.js
