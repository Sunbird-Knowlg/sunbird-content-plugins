'use strict';

EkstepEditor.basePlugin.extend({
    callback: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":show", this.initPreview, this);
        setTimeout(function() {
            var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.templatebrowser-1.0/editor/templateBrowser.html';
            var controllerPath = EkstepEditor.config.pluginRepo + '/org.ekstep.templatebrowser-1.0/editor/templatebrowserapp.js';
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);
    },
    initPreview: function(event, callback) {
        var instance = this;
        instance.callback = callback;
        EkstepEditorAPI.getService('popup').open({
            template: 'partials_org.ekstep.templatebrowser.html',
            controller: 'templatebrowser',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return instance;
                }
            },
            showClose: false,
            width: 900
        });
    },
    getTemplates: function(searchText, callback) {
        var instance = this,
            iservice = new EkstepEditor.iService(),
            requestObj,
            requestHeaders;

        requestObj = {
            "request": {
                "filters": {
                    "objectType": ["AssessmentItem"]
                }
            }
        };

        requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'user-id': 'ATTool'
            }
        };

        _.isUndefined(searchText) ? null : (requestObj.request.filters.name = [searchText]);
        iservice.http.post(EkstepEditor.serviceURL.searchServiceBaseUrl + 'v2/search', requestObj, requestHeaders, callback);
    }
});
