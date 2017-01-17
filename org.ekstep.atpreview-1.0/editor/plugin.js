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
        var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.atpreview-1.0/editor/popup.html';
        setTimeout(function() {
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath);
        }, 1000);
    },
    /**
     *
     *   @param event {Object} event object from event bus.
     *   @param data {Object} ecml
     *   @memberof atPreview
     */
    initPreview: function(event, data) {
        this.contentBody = data.contentBody;
        if(data.currentStage){
            this.contentBody.theme.startStage = EkstepEditorAPI.getCurrentStage().id;
        }
        this.showPreview();
    },
    /**     
     *   @memberof atPreview
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
            template: 'partials_org.ekstep.atpreview.html',
            controller: ['$scope', modalController],
            showClose: false,
            width: 900,
            className: 'ngdialog-theme-plain'
        });

    }
});

//# sourceURL=atpreviewplugin.js
