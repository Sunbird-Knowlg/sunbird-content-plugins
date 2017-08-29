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
        ecEditor.addEventListener("atpreview:show", this.showPreview, this);
    },

    getMetadata: function(contentId, cb) {
        var headers = {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiYWYyYzg1OWIxMDg0NzhkYjMyNmYwZDQxNjMwZWMzMSJ9.YZjU6kKNg9F5BvS7JrXTfrxyTEULjR49v7wRD-CT9sg"
        }
        jQuery.ajax({
            url: "https://dev.ekstep.in/api/content/v3/read/" + contentId,
            method: "GET",
            headers: headers,
            data: {}
        }).done(function(resp) {
            cb(resp.result.content)
        });
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
                'contentId': 'do_1123102903042129921225'
            };
            configuration.config = {
                'showEndPage': 'true',
                'showStartPage': 'true'
            };
            configuration.data = {};
            instance.getMetadata('do_1123102913293189121226', function(res) {
                configuration.metadata = res
                configuration.data = {};
                previewContentIframe.contentWindow.initializePreview(configuration);
            });
            /*configuration.metadata = meta.contentMeta;
            configuration.data = instance.contentBody;
            previewContentIframe.contentWindow.initializePreview(configuration);
*/
        };
    }
});

//# sourceURL=previewplugin.js