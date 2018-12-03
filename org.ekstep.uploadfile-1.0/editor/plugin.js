'use strict';

org.ekstep.contenteditor.basePlugin.extend({
    callback: undefined,
    data: undefined,
    initialize: function() {
        var instance = this;
        ecEditor.addEventListener(this.manifest.id + ":show", this.showUploadForm, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/upload.html');
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/uploadapp.js');
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
    },
    showUploadForm: function(event, data) {
        var instance = this;
        instance.data = data;
        ecEditor.getService('popup').open({
            template: 'partials_org.ekstep.uploadfile.html',
            controller: 'uploadController',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return instance;
                }
            },
            showClose: false,
            closeByDocument: ecEditor.getContext('contentId') ? true : false,
            closeByEscape: ecEditor.getContext('contentId') ? true : false,
            width: 720,
            className: 'ngdialog-theme-plain'
        });
    }
});
