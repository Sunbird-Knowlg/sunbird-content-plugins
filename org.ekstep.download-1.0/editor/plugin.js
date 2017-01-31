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
        instance.isLoading = false;
        instance.isSuccess = false;
        instance.isDownloading = true;

        var modalController = function($scope) {
            $scope.isSending = instance.isSending;
            $scope.isLoading = instance.isLoading;
            $scope.isSuccess = instance.isSuccess;
            $scope.isDownloading = instance.isDownloading;
            $scope.cntName = EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).contentMeta.name;
            instance.getDownloadUrl(function(downloadUrl) {
                if (downloadUrl) {
                    $scope.isLoading = true;
                    $scope.isDownloading = false;
                    EkstepEditorAPI.getAngularScope().safeApply();
                    setTimeout(function() {
                        instance.sendEmail($scope, downloadUrl);
                    }, 1000);
                } else {
                    $scope.isLoading = false;
                    $scope.isDownloading = false;
                    $scope.status = false;
                    $scope.getMessage = 'Content is not ready to download, please try again later';
                    EkstepEditorAPI.jQuery('.ct_download_msg').transition('drop');
                    EkstepEditorAPI.getAngularScope().safeApply();
                }
            });
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
    getDownloadUrl: function(callback) {
        var fileName = (EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).contentMeta.name).toLowerCase();
        EkstepEditor.contentService.downloadContent(window.context.content_id, fileName, function(err, resp) {
            if (!err && resp.data.responseCode == "OK") {
                callback(resp.data.result.ECAR_URL);
            } else {
                callback(false);
            }
        });
    },
    sendEmail: function($scope, data) {
        EkstepEditorAPI.jQuery.ajax({
            url: EkstepEditor.config.baseURL + '/index.php?option=com_api&app=ekcontent&resource=download&format=raw',
            headers: {
                'x-auth': 'session'
            },
            type: "POST",
            data: {
                downloadUrl: data,
                name: EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).contentMeta.name
            },
            success: function(results) {
                $scope.isLoading = false;
                $scope.status = (results.responseCode == 'OK') ? true : false;
                $scope.getMessage = results.result;
                EkstepEditorAPI.jQuery('.ct_download_msg').transition('drop');
                EkstepEditorAPI.getAngularScope().safeApply();
            },
            error: function() {
                $scope.isLoading = false;
                $scope.status = false;
                $scope.getMessage = 'Unable to send email, please try again later';
                EkstepEditorAPI.jQuery('.ct_download_msg').transition('drop');
                EkstepEditorAPI.getAngularScope().safeApply();
            }
        });
    },
});
//# sourceURL=downloadplugin.js
