/**
 * 
 * plugin for preview stage contents
 * @class Preview
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Sunil A S <sunils@ilimi.in>
 * @listens atpreview:show
 */
org.ekstep.contenteditor.basePlugin.extend({
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
    previewURL: 'preview/preview.html?webview=true',
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
        var templatePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/popup.html");
        ecEditor.getService('popup').loadNgModules(templatePath);
    },
    /**
     *
     *   @param event {Object} event object from event bus.
     *   @param data {Object} ecml
     *   @memberof preview
     */
    initPreview: function(event, data) {
        this.contentBody = data.contentBody;
        if(data.currentStage){
            this.contentBody.theme.startStage = ecEditor.getCurrentStage().id;
        }
        var scope = ecEditor.getAngularScope();
        if (scope.developerMode) {
            if(!this.contentBody.theme['plugin-manifest']) this.contentBody.theme['plugin-manifest'] = {"plugin": []};
            if(!_.isArray(this.contentBody.theme['plugin-manifest'].plugin)) this.contentBody.theme['plugin-manifest'].plugin = [this.contentBody.theme['plugin-manifest'].plugin];
            this.contentBody.theme['plugin-manifest'].plugin.splice(0, 0, {
                "id": "org.ekstep.developer",
                "ver": "1.0",
                "type": "plugin",
                "hostPath": org.ekstep.pluginframework.hostRepo.basePath
            });
        }
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
        var modalController = function($scope) {
            $scope.$on('ngDialog.opened', function() {                
                var previewContentIframe = ecEditor.jQuery('#previewContentIframe')[0];
                previewContentIframe.src = instance.previewURL;
                meta.contentMeta = _.isUndefined(meta.contentMeta) ? null : meta.contentMeta;
                previewContentIframe.onload = function() {
                    previewContentIframe.contentWindow.setContentData(meta.contentMeta, instance.contentBody, { "showStartPage": true, "showEndPage": true });
                };
            });
        };

        ecEditor.getService('popup').open({
            template: 'partials_org.ekstep.preview.html',
            controller: ['$scope', modalController],
            showClose: false,
            width: 900,
            className: 'ngdialog-theme-plain'
        });

    }
});

//# sourceURL=previewplugin.js
