EkstepEditor.basePlugin.extend({
    type: "image",
    useProxy: true,
    initialize: function() {
        EkstepEditor.eventManager.addEventListener("image:add", this.showAssetBrowser, this);
    },
    newInstance: function(data) {
        this.editorObj = data.props;
    },
    showAssetBrowser: function() {
        //TODO: get image from image browser and load the image
        var instance = this;
        var addImageToStage = function(url) {
            var imageURL = instance.useProxy ? "image/get/" + encodeURIComponent(url) : url;
            fabric.Image.fromURL(imageURL, function(img) {
                img.set({
                    top: 50,
                    left: 50,
                    width: 300,
                    height: 300
                });
                instance.addImage(img);
            });
        };

        var uibConfig = {
            modal_header: this.popupHTML().modal_header(),
            modal_content: this.popupHTML().modal_content(),
            modal_footer: this.popupHTML().modal_footer(),
            size: 'sm'
        };

        var imageBrowserPopUp = new EkstepEditor.popupService();

        var uibModalInstance = imageBrowserPopUp.open(uibConfig);
        EkstepEditor.ImagePlugin = {
            addImageAsset: function(url) {
                addImageToStage(url);
            }
        };

        uibModalInstance.rendered.then(function() {
            //close popup window
            EkstepEditor.jQuery('#closePopUp').click(function() {
                uibModalInstance.close('cancel');
            });

            EkstepEditor.jQuery("span").filter(":contains('undefined')").remove();
        });


    },
    addImage: function(data) {
        this.create({ props: data });
    },

    editor: function() {

    },
    onSelect: function(event) {

    },
    onRemove: function(event) {

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
                strVar += "    cursor: pointer; padding: 0;";
                strVar += "}";
                strVar += "";
               strVar += ".img-thumbnail:hover {";
               strVar += "    border-color: cadetblue;";
               strVar += "    border-width: 3px;";
               strVar += "}";
                strVar += ".scrollWindow {";
                strVar += "    margin-top: 30px;";
                strVar += "    overflow: scroll;";
                strVar += "    height: 320px;";
                strVar += "}";
                strVar += "";
                strVar += ".uploadImage {";
                strVar += "    border-right: 2px solid black;";
                strVar += "    height: 400px;";
                strVar += "}";
                strVar += "";
                strVar += ".uploadButton {";
                strVar += "    width: 100%;";
                strVar += "    text-align: center;";
                strVar += "}";
                strVar += "<\/style>";
                strVar += "<div class=\"imageBrowserContent\">";
                strVar += "    <text style=\"font-size: 20px;\">Add Image<\/text>";
                strVar += "    <uib-tabset active=\"active\">";
                strVar += "        <uib-tab index=\"0\" heading=\"Image\">";
                strVar += "            <input type=\"text\" style=\"width: 90%; float: left;\" placeholder=\"search asset\" \/>";
                strVar += "            <span>";
                strVar += "                    <button class=\"btn btn-primary\"><i class=\"fa fa-search\" aria-hidden=\"true\"><\/i><\/button>";
                strVar += "                    <\/span>";
                strVar += "            <div class=\"col-xs-8 col-sm-8 col-md-8 col-lg-8 scrollWindow\">";
                strVar += "                <div class=\"row\">";                
                strVar += "                    <img class=\"img-thumbnail\" src=\"https:\/\/dev.ekstep.in\/assets\/public\/content\/d09ceec025889c57ca02db08dea77999_1477636668010.jpeg\" onclick=\"EkstepEditor.ImagePlugin.addImageAsset(src)\" width=\"120\" height=\"120\">";                
                strVar += "                    <img class=\"img-thumbnail\" src=\"https:\/\/dev.ekstep.in\/assets\/public\/content\/d09ceec025889c57ca02db08dea77999_1477636668010.jpeg\" onclick=\"EkstepEditor.ImagePlugin.addImageAsset(src)\" width=\"120\" height=\"120\">";
                strVar += "                    <img class=\"img-thumbnail\" src=\"https:\/\/dev.ekstep.in\/assets\/public\/content\/d09ceec025889c57ca02db08dea77999_1477636668010.jpeg\" onclick=\"EkstepEditor.ImagePlugin.addImageAsset(src)\" width=\"120\" height=\"120\">";
                strVar += "                <\/div>";
                strVar += "            <\/div>";
                strVar += "            <div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-4\" style=\"padding: 25px; font-size: 25px;\"> Select an asset to view properties";
                strVar += "            <\/div>";
                strVar += "        <\/uib-tab>";
                strVar += "        <uib-tab index=\"$index+1\" heading=\"My Images\">";
                strVar += "        <\/uib-tab>        ";
                strVar += "    <\/uib-tabset>";
                strVar += "<\/div>";
                strVar += "";

                return strVar;
            },

            modal_footer: function() {
                var strVar = "";
                strVar += "<button class=\"btn btn-primary\" type=\"button\">Select and Use<\/button>";
                strVar += "<button id=\"closePopUp\" class=\"btn btn-warning\" type=\"button\">Cancel<\/button>";
                return strVar;
            }
        }
    }
});
