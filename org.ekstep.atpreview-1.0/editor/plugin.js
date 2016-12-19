/**
 * 
 * plugin for preview stage contents
 * @class atPreview
 * @extends EkstepEditor.basePlugin
 * @author Sunil A S <sunils@ilimi.in>
 * @listens atpreview:show
 */
EkstepEditor.basePlugin.extend({
    /**
     *   @member type {String} plugin title
     *   @memberof atPreview
     *
     */
    type: 'atpreview',
    /**
     *   @member previewURL {String} reverse proxy URL
     *   @memberof atPreview
     *
     */
    previewURL: 'preview/preview.html?webview=true',
    /**
     *   @member contentBody {Object} content body for preview
     *   @memberof atPreview
     *
     */
    contentBody: undefined,
    /**
     *   registers events
     *   @memberof atPreview
     *
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener("atpreview:show", this.initPreview, this);
    },
    /**
     *
     *   @param event {Object} event object from event bus.
     *   @param data {Object} ecml
     *   @memberof atPreview
     */
    initPreview: function(event, data) {
        var instance = this;
        this.contentBody = data.contentBody;
        this.loadResource('editor/popup.html', 'html', function(err, response) {
            instance.showPreview(err, response);
        });
    },
    /**
     *   @param err {Object}
     *   @param data {String} HTML template
     *   @memberof atPreview
     */
    showPreview: function(err, data) {
        console.log(this.previewURL);
        var instance = this;
        var popupConfig = { template: data};
        var popupService = EkstepEditorAPI.getService('popup');
        var contentService = EkstepEditorAPI.getService('content');
        var meta = EkstepEditorAPI.getService('content').getContentMeta(EkstepEditorAPI.globalContext.contentId);

        popupService.open(popupConfig, function() {
            var previewContentIframe = EkstepEditor.jQuery('#previewContentIframe')[0];
            previewContentIframe.src = instance.previewURL;
            meta.contentMeta = EkstepEditorAPI._.isUndefined(meta.contentMeta) ? null : meta.contentMeta;
            previewContentIframe.onload = function() {                
                previewContentIframe.contentWindow.setContentData(meta.contentMeta, instance.contentBody, { "showStartPage": true, "showEndPage": true });
            };
        });
    }
});

//# sourceURL=atpreviewplugin.js
