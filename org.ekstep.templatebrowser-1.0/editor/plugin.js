'use strict';

EkstepEditor.basePlugin.extend({
    callback: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":show", this.loadTemplate, this);
    },
    loadTemplate: function(event, callback) {
        var that = this;
        this.callback = callback;
        this.loadResource('editor/templateBrowser.html', 'html', function(err, response) {
            that.initPreview(err, response);
        });
    },
    initPreview: function(err, template) {
        if (err) return;
        EkstepEditorAPI.getService('popup').open({ template: template, data: { instance: this } }, this.browserCallback);
    },
    getTemplates: function(searchText, callback) {
        var instance = this,
            iservice = new EkstepEditor.iService(),
            requestObj,
            requestHeaders;

        requestObj = {
            "request": {
                "filters": {
                    "objectType": ["AssessmentItem"],
                    "name": []
                }
            }
        };

        requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'user-id': 'ATTool'
            }
        };

        requestObj.request.filters.name = EkstepEditorAPI._.isUndefined(searchText) ? [] : [searchText];        
        iservice.http.post(EkstepEditor.config.baseURL + '/api/search/v2/search', requestObj, requestHeaders, callback);
    },
    browserCallback: function(ctrl, injector, data) {
        var templateData,
            dynamicText = [];

        ctrl.lastSelected;
        ctrl.template = {};
        ctrl.dynamicText = [];
        ctrl.error = false;

        ctrl.closeWindow = function() {
            EkstepEditorAPI.jQuery('.ui.modal').modal('hide');
        };

        ctrl.search = function() {
            dynamicText = [];
            var search = EkstepEditorAPI.jQuery('#templateSearch').val();
            search && data.instance.getTemplates(search, ctrl.getTemplatesCallback);
        };

        ctrl.getTemplatesCallback = function(err, res) {
            if (res) {
                ctrl.templates = res.data.result.items;
                ctrl.error = false;
            }
            if (err) {
                ctrl.error = true;
            }
            EkstepEditorAPI.getAngularScope().safeApply();
            if (res) ctrl.initPopup(res.data.result.items);
        };

        data.instance.getTemplates(null, ctrl.getTemplatesCallback);

        ctrl.initPopup = function(item) {
            EkstepEditorAPI._.forEach(item, function(obj, index) {
                EkstepEditorAPI.jQuery('#templatebrowser-' + index).popup({
                    hoverable: true,
                    position: 'right center'
                });
            });
        };

        ctrl.templateSelected = function(identifier, index) {
            templateData = EkstepEditorAPI._.find(ctrl.templates, function(obj) {
                return obj.identifier === identifier
            });
            if (!EkstepEditorAPI._.isUndefined(ctrl.lastSelected)) ctrl.template[ctrl.lastSelected] = false;
            ctrl.lastSelected = index;
        };

        ctrl.save = function() {
            console.log('templateData', templateData);
            if (!EkstepEditorAPI._.isUndefined(ctrl.lastSelected)) data.instance.callback && data.instance.callback(templateData);
            ctrl.closeWindow();
        };
    }
});
