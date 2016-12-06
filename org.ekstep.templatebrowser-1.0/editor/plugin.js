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
                    "objectType": ["AssessmentItem"]
                },
                "name": {
                    "startsWith": searchText
                },
                "limit": 10
            }
        };

        requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'user-id': 'ATTool'
            }
        };

        iservice.http.post(EkstepEditor.config.baseURL + '/api/search/v2/search', requestObj, requestHeaders, callback);
    },
    browserCallback: function(ctrl, injector, data) {
        var templateData,
            dynamicText = [];

        ctrl.lastSelected;
        ctrl.template = {};
        ctrl.dynamicText = [];

        ctrl.closeWindow = function() {
            $('.ui.modal').modal('hide');
        };

        ctrl.search = function() {
            dynamicText = [];
            var search = $('#templateSearch').val();
            search && data.instance.getTemplates(search, function(err, res) {
                _.forEach(res.data.result.items, function(obj) { dynamicText.push({ 'title': obj.name }); });
                ctrl.dynamicText = dynamicText;
                EkstepEditorAPI.getAngularScope().safeApply();
            });
        };

        data.instance.getTemplates(null, function(err, res) {
            if (res) {
                ctrl.templates = res.data.result.items;
            }
            EkstepEditorAPI.getAngularScope().safeApply();
            if (res) ctrl.initPopup(res.data.result.items);
            if (err) console.log('template data', err);
        });

        ctrl.initPopup = function(item) {
            _.forEach(item, function(obj, index) {
                console.log('obj.identifier', obj.identifier);
                $('#templatebrowser-' + index).popup({
                    hoverable: true,
                    position: 'right center'
                });
            });
        };

        ctrl.templateSelected = function(identifier, index) {
            templateData = _.find(ctrl.templates, function(obj) {
                return obj.identifier === identifier
            });
            if (!_.isUndefined(ctrl.lastSelected)) ctrl.template[ctrl.lastSelected] = false;
            ctrl.lastSelected = index;
        };

        ctrl.save = function() {
            console.log('templateData', templateData);
            if (!_.isUndefined(ctrl.lastSelected)) data.instance.callback && data.instance.callback(templateData);
            ctrl.closeWindow();
        };
    }
});
