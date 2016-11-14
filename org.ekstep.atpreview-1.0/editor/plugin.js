EkstepEditor.basePlugin.extend({
    type: 'atpreview',
    initialize: function() {
        EkstepEditorAPI.addEventListener("atpreview:show", this.showPreview, this);
    },
    showPreview: function() {
        var popupConfig = {
            modal_content: popUpHTML(),
            windowClass: 'modal-preview',
            size: 'lg'
        };

        var previewModal = new EkstepEditor.popupService();

        previewModal.open(popupConfig).rendered.then(function() {
            EkstepEditor.jQuery("span").filter(":contains('undefined')").remove();

            var previewContentIframe = EkstepEditor.jQuery('#previewContentIframe')[0],
                config = { "showStartPage": true, "showEndPage": true };

            previewContentIframe.src = EkstepEditor.configService.previewReverseProxyUrl;
            
            var iservice = new EkstepEditor.iService();

            previewContentIframe.onload = function() {
                var url = EkstepEditor.configService.learningServiceBaseUrl + "/v2/content/do_10096674";
                iservice.http.get(url).then(function(response) {
                    onPreviewContentIframeLoad(response);
                });
            };

            function onPreviewContentIframeLoad(response) {            	
                var data = EkstepEditor.stageManager.toECML();                
                previewContentIframe.contentWindow.setContentData(response.data.result.content, data, config);
            };
        });

        function popUpHTML() {
            var strVar = "";
            strVar += "<div class=\"frame-modal-preview\">";
            strVar += "    <div class=\"preview-frame\"><\/div>";
            strVar += "    <div class=\"frame-modal-content\">";
            strVar += "        <div class=\"modal-body\">";
            strVar += "            <iframe id=\"previewContentIframe\" width=100% height=100%><\/iframe>";
            strVar += "        <\/div>";
            strVar += "    <\/div>";
            strVar += "<\/div>";
            return strVar;
        }
    }
});
