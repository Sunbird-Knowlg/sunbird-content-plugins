/**
 * 
 * plugin for preview stage contents
 * @class Preview
 * @extends org.ekstep.genericeditor.basePlugin
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 * @listens atpreview:show
 */
org.ekstep.genericeditor.basePlugin.extend({
    /**
     *   @member type {String} plugin title
     *   @memberof preview
     *
     */
    type: 'preview',
    /**
     *   @member previewURL {String} reverse proxy URL
     *   @memberof Preview
     *
     */
    previewURL: 'preview/preview.html' + '?webview=true',
    /**
     *   @member contentBody {Object} content body for preview
     *   @memberof Preview
     *
     */
    contentBody: undefined,
    /**
     *   registers events
     *   @memberof preview
     *
     */
    initialize: function() {
        ecEditor.addEventListener("atpreview:show", this.initPreview, this);
        var templatePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/contentPreview.html");
    },
    /**
     *
     *   @param event {Object} event object from event bus.
     *   @param data {Object} ecml
     *   @memberof preview
     */
    initPreview: function(event, data) {
        //this.contentBody = data.contentBody;
        this.showPreview();
    },
    /**     
     *   @memberof preview
     */
    showPreview: function() {
        console.log(this.previewURL);
        var instance = this;
        var contentService = ecEditor.getService('content');
        var meta = ecEditor.getService('content').getContentMeta(ecEditor.getContext('contentId'));
        var previewContentIframe = ecEditor.jQuery('#previewContentIframe')[0];
        previewContentIframe.src = instance.previewURL;
        var userData = ecEditor.getService('telemetry').context;
        previewContentIframe.onload = function() {
            var configuration = {};
            userData.etags = userData.etags || {};
            configuration.context = {
                'mode': 'edit',
                'contentId': meta.identifier,
                'sid': userData.sid,
                'uid': userData.uid,
                'channel': userData.channel,
                'pdata': userData.pdata,
                'app': userData.etags.app,
                'dims': userData.etags.dims,
                'partner': userData.etags.partner,
                'contentId':'do_1123102903042129921225'
            };
            configuration.config = {
                'showEndPage': 'true',
                'showStartPage': 'true'
            };
            configuration.data = {};
            configuration.metadata = meta.contentMeta;
            configuration.data = instance.contentBody;
            previewContentIframe.contentWindow.initializePreview(configuration);

        };
    }
});

//# sourceURL=previewplugin.js