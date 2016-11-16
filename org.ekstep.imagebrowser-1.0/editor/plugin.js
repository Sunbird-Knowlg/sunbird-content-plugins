EkstepEditor.basePlugin.extend({
    type: 'imagebrowser',
    initialize: function() {
        EkstepEditor.eventManager.addEventListener("imagebrowser:show", this.showAssetBrowser, this);
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

        iservice.http.post(EkstepEditor.configService.searchServiceBaseUrl + 'v2/search', requestObj, requestHeaders).then(function(res) {
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
    showAssetBrowser: function() {
        var instance = this,
            uibConfig,
            imageBrowserPopUp,
            uibModalInstance,
            searchText;


        uibConfig = {
            modal_header: this.popupHTML().modal_header(),
            modal_content: this.popupHTML().modal_content(),
            modal_footer: this.popupHTML().modal_footer(),
            size: 'sm'
        };

        imageBrowserPopUp = new EkstepEditor.popupService();

        uibModalInstance = imageBrowserPopUp.open(uibConfig);

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

    },
    popupHTML: function() {
        return {
            modal_header: function() {
                return;
            },
            modal_content: function() {
                var strVar = "";
                strVar += "<style>";
                strVar += ".modal.in .modal-dialog {";
                strVar += "    width: 65%;";
                strVar += "}";
                strVar += "";
                strVar += ".tab-content {";
                strVar += "    height: 400px;";
                strVar += "}";
                strVar += "";
                strVar += ".modal-body { padding: 0px;}";
                strVar += ".nav-tabs {";
                strVar += "    background: none;";
                strVar += "}";
                strVar += "";
                strVar += ".imageBrowserContent {";
                strVar += "    margin: 12px;";
                strVar += "}";
                strVar += "";
                strVar += ".modal-footer {";
                strVar += "    padding: 10px;";
                strVar += "    text-align: right;";
                strVar += "}";
                strVar += "";
                strVar += ".img-thumbnail {";
                strVar += "    margin: 3px;";
                strVar += "    cursor: pointer; padding: 0; position: relative;";
                strVar += "}";
                strVar += "";
                strVar += ".img-thumbnail:hover {";
                strVar += "		 opacity: 0.4;"
                strVar += "}";
                strVar += ".scrollWindow {";
                strVar += "    margin-top: 30px;";
                strVar += "    overflow: scroll;";
                strVar += "    height: 320px;";
                strVar += "}";
                strVar += "";
                strVar += ".fa-2x-custom { color: aliceblue; margin-right: 10px; margin-left: 2px; font-size: 2em;}"
                strVar += "";
                strVar += ".fa-2x-custom:hover {color: white; }"
                strVar += "";
                strVar += ".fa-image-selected { color: #3899ec; margin-right: 10px; margin-left: 2px; font-size: 2em;}"
                strVar += "";
                strVar += "<\/style>";
                strVar += "<div class=\"imageBrowserContent\">";
                strVar += "    <text style=\"font-size: 20px;\">Add Image<\/text>";
                strVar += "    <uib-tabset active=\"active\">";
                strVar += "        <uib-tab index=\"0\" heading=\"Image\">";
                strVar += "            <input id=\"searchTextBox\" type=\"text\" style=\"width: 95%; float: left; font-size: 20px;\" placeholder=\"search image...\" \/>";
                strVar += "            <span>";
                strVar += "                    <button id=\"searchButton\" class=\"btn btn-primary\"><i class=\"fa fa-search\" aria-hidden=\"true\"><\/i><\/button>";
                strVar += "                    <\/span>";
                strVar += "            <div id=\"assetWindow\" class=\"col-xs-8 col-sm-8 col-md-8 col-lg-8 scrollWindow\">";
                strVar += "                <div id=\"assetArea\" class=\"row\">";
                strVar += "                <\/div>";
                strVar += "            <\/div>";
                strVar += "            <div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-4\" style=\"padding: 25px; font-size: 25px;\">";
                strVar += "            <\/div>";
                strVar += "        <\/uib-tab>";
                strVar += "    <\/uib-tabset>";
                strVar += "<\/div>";
                strVar += "";

                return strVar;
            },

            modal_footer: function() {
                var strVar = "";
                strVar += "<button id=\"selectanduse\" class=\"btn btn-primary\" type=\"button\">Select<\/button>";
                strVar += "<button id=\"closePopUp\" class=\"btn btn-warning\" type=\"button\">Cancel<\/button>";
                return strVar;
            }
        }
    }

});
