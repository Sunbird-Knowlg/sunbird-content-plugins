org.ekstep.contenteditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof assessment
     */
    type: "login",
    currentInstance: undefined,

    /**
     * registers events
     * @memberof collaborator
     */
    initialize: function () {
        var instance = this;
        org.ekstep.contenteditor.api.addEventListener("org.ekstep.login:showPopup", this.loadBrowser, this);
        var templatePath = org.ekstep.contenteditor.api.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/login.html");
        var controllerPath = org.ekstep.contenteditor.api.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/loginapp.js"); 
        org.ekstep.contenteditor.api.getService('popup').loadNgModules(templatePath, controllerPath);
    },
    /**
    *   load html template into the popup
    */
    loadBrowser: function (event, data) {
        currentInstance = this;
        org.ekstep.contenteditor.api.getService('popup').open({
            template: 'partials/login.html',
            controller: 'logincontroller',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function () {
                    return currentInstance;
                }
            },
            showClose: false,
            className: 'ngdialog-theme-plain'
        });

    }
});

//# sourceURL=collaboratorPlugin.js
