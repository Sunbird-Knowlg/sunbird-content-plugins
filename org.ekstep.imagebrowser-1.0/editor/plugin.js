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
                EkstepEditor.jQuery('#' + "imageOverlay-" + id).addClass("fa-image-selected");                
            }
        };
    },
    getImageFromServer: function() {
        var instance = this;
        var iservice = new EkstepEditor.iService();
        var requestObj = {
            "request": {
                "filters": {
                    "objectType": ["Content"],
                    "contentType": ["asset"]
                }
            }
        };
        var requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'user-id': 'ATTool'
            }
        };

        iservice.http.post(EkstepEditor.configService.searchServiceBaseUrl + 'v2/search', requestObj, requestHeaders).then(function(res) {
            instance.appendImageTag(res.data.result.content);
        });
    },
    appendImageTag: function(asset) {
        _.forEach(asset, function(obj, index) {
            var imageElement = "<img class=\"img-thumbnail\"" + "id=" + index + " src=" + obj.downloadUrl + " onclick=\"window.org_ekstep_image_1_0.ImageSource(event, src, id);\" width=\"120\" height=\"120\">";
            imageElement += "<i " + "id=imageOverlay-" + index + " class=\"fa fa-check-square-o fa-2x-custom\" aria-hidden=\"true\"><\/i>";
            EkstepEditor.jQuery('#assestArea').append(imageElement);
        });
    },
    showAssetBrowser: function() {
        var instance = this;
        var uibConfig = {
            modal_header: this.popupHTML().modal_header(),
            modal_content: this.popupHTML().modal_content(),
            modal_footer: this.popupHTML().modal_footer(),
            size: 'sm'
        };

        var imageBrowserPopUp = new EkstepEditor.popupService();

        var uibModalInstance = imageBrowserPopUp.open(uibConfig);

        uibModalInstance.rendered.then(function() {
            //close popup window
            EkstepEditor.jQuery('#closePopUp').click(function() {
                uibModalInstance.close('cancel');
            });

            EkstepEditor.jQuery('#selectanduse').click(function() {
                EkstepEditor.eventManager.dispatchEvent("imagebrowser:selected", EkstepEditor.jQuery(this).attr('src'));
                uibModalInstance.close('cancel');
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
                strVar += "            <input type=\"text\" style=\"width: 90%; float: left;\" placeholder=\"search image...\" \/>";
                strVar += "            <span>";
                strVar += "                    <button class=\"btn btn-primary\"><i class=\"fa fa-search\" aria-hidden=\"true\"><\/i><\/button>";
                strVar += "                    <\/span>";
                strVar += "            <div class=\"col-xs-8 col-sm-8 col-md-8 col-lg-8 scrollWindow\">";
                strVar += "                <div id=\"assestArea\" class=\"row\">";
                strVar += "                <\/div>";
                strVar += "            <\/div>";
                strVar += "            <div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-4\" style=\"padding: 25px; font-size: 25px;\"> Select an asset to view properties";
                strVar += "            <\/div>";
                strVar += "        <\/uib-tab>";
                strVar += "    <\/uib-tabset>";
                strVar += "<\/div>";
                strVar += "";

                return strVar;
            },

            modal_footer: function() {
                var strVar = "";
                strVar += "<button id=\"selectanduse\" class=\"btn btn-primary\" type=\"button\">Select and Use<\/button>";
                strVar += "<button id=\"closePopUp\" class=\"btn btn-warning\" type=\"button\">Cancel<\/button>";
                return strVar;
            }
        }
    }

});
