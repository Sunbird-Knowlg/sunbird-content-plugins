EkstepEditor.basePlugin.extend({
    type: 'atpreview',
    previewURL: 'preview/preview.html?webview=true',
    contentBody: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener("atpreview:show", this.initPreview, this);
    },
    initPreview: function(event, data) {
        var instance = this;
        this.contentBody = data.contentBody;
        this.loadResource('editor/popup.html', 'html', function(err, response) {
            instance.showPreview(err, response);
        });
    },
    showPreview: function(err, data) {
        console.log(this.previewURL);
        var instance = this;
        var popupConfig = { modal_content: data, windowClass: 'modal-preview', size: 'lg'};
        var popupService = EkstepEditorAPI.getService('popup');
        var contentService = EkstepEditorAPI.getService('content');

        popupService.open(popupConfig).rendered.then(function() {
            
            EkstepEditor.jQuery("span").filter(":contains('undefined')").remove();
            var previewContentIframe = EkstepEditor.jQuery('#previewContentIframe')[0];
            previewContentIframe.src = instance.previewURL;
            
            previewContentIframe.onload = function() {
                contentService.getContentMetadata('do_10096674', function(err, response) {
                    previewContentIframe.contentWindow.setContentData(response.data.result.content, instance.contentBody, { "showStartPage": true, "showEndPage": true });
                });
            };
        });
    }
});
