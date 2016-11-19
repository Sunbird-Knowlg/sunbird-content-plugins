EkstepEditor.basePlugin.extend({
    type: 'imagebrowser',
    initData: undefined,
    initialize: function() {
        EkstepEditor.eventManager.addEventListener("imagebrowser:show", this.initPreview, this);
        EkstepEditor.eventManager.addEventListener("imagebrowser:close", this.closeAssetBrowser, this);
    },
    initPreview: function(event, data) {
        var instance = this;
        this.initData = data;
        this.loadResource('editor/imageBrowser.html', 'html', function(err, response) {
            instance.showAssetBrowser(err, response);
        });
    },
    getImageFromServer: function(searchText, cb) {
        var instance = this,
            iservice = new EkstepEditor.iService(),
            requestObj,
            requestHeaders;

        requestObj = {
            "request": {
                "filters": {
                    "mediaType": ["image"],
                    "license": ["Creative Commons Attribution (CC BY)"],
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

        _.isUndefined(searchText) ? null : requestObj.request.filters.name = [searchText];

        iservice.http.post(EkstepEditor.config.baseURL + '/api/search/v2/search', requestObj, requestHeaders, cb);
    },
    showAssetBrowser: function(err, data) {
        var instance = this,
            uibConfig,
            imageBrowserPopUp,
            uibModalInstance,
            searchText;



        uibConfig = {
            template: data,
            size: 'sm',
            controller: 'popupController',
            controllerAs: '$ctrl',
            resolve: {
                data: {}
            }
        };
        var controllerCallback = function(ctrl, scope, $uibModalInstance) {
            var data;
            data = _.clone(instance.initData);
            ctrl.selected_images = {};
            ctrl.selectDisable = true;

            var serverCallback = function(err, res) {
                if (res && res.data.result.content) {
                    ctrl.imageList = res.data.result.content;
                } else {
                    ctrl.imageList = [];
                };

                EkstepEditorAPI.getAngularScope().safeApply();
            };

            instance.getImageFromServer(searchText, serverCallback);

            ctrl.searchKeyPress = function() {
                var searchText = EkstepEditor.jQuery('#searchTextBox').val();
                (searchText === "") ? searchText = undefined: null;
                ctrl.selectDisable = true;
                instance.getImageFromServer(searchText, serverCallback);
            }

            ctrl.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

            ctrl.ImageSource = function(event, $index) {
                data.asset = event.target.attributes.data_id.value;
                data.src = event.target.attributes.src.value;
                ctrl.selectDisable = false;
                _.forEach(ctrl.selected_images, function(obj, index) {
                    if (obj.index !== $index) {
                        ctrl.selected_images[index].selected = false;
                    }
                });
            };

            ctrl.select = function() {
                if (data && data.asset) {
                    EkstepEditor.eventManager.dispatchEvent("imagebrowser:add", data);
                    $uibModalInstance.dismiss('cancel');
                }
            }
        };

        uibModalInstance = EkstepEditorAPI.getService('popup').open(uibConfig, controllerCallback);
    }
});
//# sourceURL=imagebrowserplugin.js
