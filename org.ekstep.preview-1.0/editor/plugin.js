/**
 * 
 * plugin for preview stage contents
 * @class Preview
 * @extends EkstepEditor.basePlugin
 * @author Sunil A S <sunils@ilimi.in>
 * @listens atpreview:show
 */
EkstepEditor.basePlugin.extend({
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
        EkstepEditorAPI.addEventListener("atpreview:show", this.initPreview, this);
        var templatePath = EkstepEditorAPI.getPluginRepo() + '/' + this.manifest.id + '-' + this.manifest.ver +'/editor/popup.html';
        EkstepEditorAPI.getService('popup').loadNgModules(templatePath);
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
            this.contentBody.theme.startStage = EkstepEditorAPI.getCurrentStage().id;
        }
        this.showPreview();
    },
    /**     
     *   @memberof preview
     */
    showPreview: function() {        
        console.log(this.previewURL);
        var instance = this;
        var contentService = EkstepEditorAPI.getService('content');
        var meta = EkstepEditorAPI.getService('content').getContentMeta(EkstepEditorAPI.globalContext.contentId);
        var modalController = function($scope) {
            $scope.$on('ngDialog.opened', function() {                
                var previewContentIframe = EkstepEditorAPI.jQuery('#previewContentIframe')[0];
                previewContentIframe.src = instance.previewURL;
                meta.contentMeta = _.isUndefined(meta.contentMeta) ? null : meta.contentMeta;
                previewContentIframe.onload = function() {
                    previewContentIframe.contentWindow.setContentData(meta.contentMeta, instance.contentBody, { "showStartPage": true, "showEndPage": true });
                };
            });
        };

        EkstepEditorAPI.getService('popup').open({
            template: 'partials_org.ekstep.preview.html',
            controller: ['$scope', modalController],
            showClose: false,
            width: 900,
            className: 'ngdialog-theme-plain'
        });

    }
});

//# sourceURL=previewplugin.js
