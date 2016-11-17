EkstepEditor.basePlugin.extend({
    type: 'imagebrowser',
    initialize: function() {
        EkstepEditor.eventManager.addEventListener("imagebrowser:show", this.initPreview, this);
        EkstepEditor.eventManager.addEventListener("imagebrowser:close", this.closeAssetBrowser, this);
        window.org_ekstep_image_1_0 = {
            ImageSource: function(event, src, id) {
                console.log("image event", event);
                EkstepEditor.jQuery('#selectanduse').removeClass('disabled');
                EkstepEditor.jQuery('#selectanduse').attr({ src: src });
                if (EkstepEditor.jQuery("i").hasClass("fa-image-selected")) {
                    EkstepEditor.jQuery("i").removeClass("fa-image-selected");
                }
                EkstepEditor.jQuery('#' + "fa-check-" + id).addClass("fa-image-selected");
            }
        };
    },
    initPreview: function() {
        var instance = this;
        this.loadResource('editor/imageBrowser.html', 'html', function(err, response) {
            instance.showAssetBrowser(err, response);
        });
    },
    getImageFromServer: function(searchText) {
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

        iservice.http.post(EkstepEditor.config.baseURL + '/api/search/v2/search', requestObj, requestHeaders, function(err, res) {            
            instance.appendImageTag(res.data.result.content);
        });
    },
    appendImageTag: function(asset) {
        var assetArea = "<div id=\"assetArea\" class=\"row\">";
        assetArea += "<\/div>";
        EkstepEditor.jQuery('#assetArea').remove();
        EkstepEditor.jQuery('#assetWindow').append(assetArea);
        EkstepEditor.jQuery('#selectanduse').addClass('disabled');

        if (_.isUndefined(asset)) {
            var strVar = "<div uib-alert class=\"alert-warning\" style=\"font-size: 30px; text-align: center;\">";
            strVar += "<i class=\"fa fa-exclamation-triangle fa-1x\" aria-hidden=\"true\"><\/i>  Image not found";
            strVar += "<\/div>";
            EkstepEditor.jQuery('#assetArea').append(strVar);
        }

        _.forEach(asset, function(obj, index) {
            var imageElement = "<img class=\"img-thumbnail\"" + "id=img-" + index + " src=" + obj.downloadUrl + " onclick=\"window.org_ekstep_image_1_0.ImageSource(event, src, id);\" width=\"120\" height=\"120\">";
            imageElement += "<i " + "id=fa-check-img-" + index + " class=\"fa fa-check-square-o fa-2x-custom\" aria-hidden=\"true\"><\/i>";
            EkstepEditor.jQuery('#assetArea').append(imageElement);
        });


    },
    showAssetBrowser: function(err, data) {
        var instance = this,
            uibConfig,
            imageBrowserPopUp,
            uibModalInstance,
            searchText;

        uibConfig = {
            modal_content: data,
            size: 'sm'
        };

        uibModalInstance = EkstepEditorAPI.getService('popup').open(uibConfig);
        uibModalInstance.rendered.then(function() {
            //close popup window
            EkstepEditor.jQuery('#closePopUp').click(function() {
                EkstepEditor.eventManager.dispatchEvent("imagebrowser:close");
                uibModalInstance.close('cancel');
            });

            EkstepEditor.jQuery('#selectanduse').click(function() {
                EkstepEditor.eventManager.dispatchEvent("imagebrowser:selected", EkstepEditor.jQuery(this).attr('src'));
                uibModalInstance.close('cancel');
            });

            EkstepEditor.jQuery('#searchTextBox').bind("enterKey", function(e) {
                searchText = EkstepEditor.jQuery('#searchTextBox').val();
                (searchText === "") ? searchText = undefined: null;
                instance.getImageFromServer(searchText);
            });

            EkstepEditor.jQuery('#searchButton').click(function(e) {
                searchText = EkstepEditor.jQuery('#searchTextBox').val();
                (searchText === "") ? searchText = undefined: null;
                instance.getImageFromServer(searchText);
            });


            EkstepEditor.jQuery('#searchTextBox').keyup(function(e) {
                if (e.keyCode == 13) {
                    EkstepEditor.jQuery(this).trigger("enterKey");
                }
            });

            EkstepEditor.jQuery('#selectanduse').addClass('disabled');

            EkstepEditor.jQuery("span").filter(":contains('undefined')").remove();

            instance.getImageFromServer();
        });

    }
});
