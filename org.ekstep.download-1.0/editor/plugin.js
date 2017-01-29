/**
 *
 * plugin for add download content
 * @class download
 * @extends EkstepEditor.basePlugin
 * @author Gourav More <gourav_m@tekditechnologies.com>
 * @listens download:content
 */
EkstepEditor.basePlugin.extend({
    /**
     *   @member type {String} plugin title
     *   @memberof download
     *
     */
    type: 'download',
    /**
     *   registers events
     *   @memberof download
     *
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener("download:content", this.downloadContent, this);
        var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.download-1.0/editor/popup.html';
        setTimeout(function() {
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath);
        }, 1000);
    },
    /**
     *
     *   @param event {Object} event object from event bus.
     *   @param data {Object} ecml
     *   @memberof download
     */
    downloadContent: function() {
        var instance = this;
        instance.isSending = 'active';
        instance.isLoading = true;
        instance.isSuccess = false;

        var modalController = function($scope) {
            $scope.isSending = instance.isSending;
            $scope.isLoading = instance.isLoading;
            $scope.isSuccess = instance.isSuccess;
            $scope.cntName = EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).contentMeta.name;
            instance.sendEmail($scope);
        };

        EkstepEditorAPI.getService('popup').open({
            template: 'partials_org.ekstep.download.html',
            controller: ['$scope', modalController],
            showClose: false,
            width: 900,
            background: 'transparent!important',
            className: 'ngdialog-theme-plain dwContent'
        });
    },
    sendEmail: function($scope) {
        EkstepEditorAPI.jQuery.ajax({
            url: EkstepEditor.config.baseURL + '/index.php?option=com_ekcontent&task=content.downloadContent',
            headers: {
                'x-auth': 'session'
            },
            type: "POST",
            data: {
                cntIdentifier: window.context.content_id,
                cntName: EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).contentMeta.name
            },
            success: function(results) {
                $scope.isLoading = false;
                $scope.status = (results.status == 'success') ? true : false;
                $scope.getMessage = results.msg;
                EkstepEditorAPI.jQuery('.ct_download_msg').transition('drop');
                EkstepEditorAPI.getAngularScope().safeApply();
                setTimeout(function() {
                    $scope.closeThisDialog();
                }, 1000);
            },
            error: function() {
                $scope.isLoading = false;
                $scope.status = false;
                $scope.getMessage = 'Unable to download content, please try again later';
                EkstepEditorAPI.jQuery('.ct_download_msg').transition('drop');
                EkstepEditorAPI.getAngularScope().safeApply();
                setTimeout(function() {
                    $scope.closeThisDialog();
                }, 1000);
            }
        });
    },
});

//# sourceURL=downloadplugin.js
