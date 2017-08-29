'use strict';

org.ekstep.contenteditor.basePlugin.extend({
    callback: undefined,
    initialize: function() {
        var instance = this;
        ecEditor.addEventListener(this.manifest.id + ":show", this.showUploadForm, this);
        setTimeout(function() {
            var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/upload.html');
            var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/uploadapp.js');
            ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);
    },
    showUploadForm: function(event, callback) {
        var instance = this;
        instance.callback = callback;
        ecEditor.getService('popup').open({
            template: 'partials_org.ekstep.uploadcontent.html',
            controller: 'uploadController',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return instance;
                }
            },
            showClose: false,
            width: 900,
            className: 'ngdialog-theme-plain'
        });
    }
});
