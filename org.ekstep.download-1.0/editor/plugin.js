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
        var templatePath = EkstepEditorAPI.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/popup.html");
        EkstepEditorAPI.getService('popup').loadNgModules(templatePath);
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
            $scope.cntName = EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).name;
            instance.getDownloadUrl(function(downloadUrl) {
                if (downloadUrl) {
                    $scope.isLoading = true;
                    $scope.isDownloading = false;
                    EkstepEditorAPI.ngSafeApply(EkstepEditorAPI.getAngularScope());
                    instance.sendEmail($scope, downloadUrl);
                } else {
                    $scope.isLoading = false;
                    $scope.isDownloading = false;
                    $scope.status = false;
                    $scope.getMessage = 'Content is not ready to download, please try again later';
                    EkstepEditorAPI.jQuery('.ct_download_msg').transition('drop');
                    EkstepEditorAPI.ngSafeApply(EkstepEditorAPI.getAngularScope());
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
        var fileName = (EkstepEditorAPI.getService('content').getContentMeta(EkstepEditorAPI.getContext('contentId')).name).toLowerCase();
        EkstepEditorAPI.getService('content').downloadContent(EkstepEditorAPI.getContext('contentId'), fileName, function(err, resp) {
            if (!err && resp.data.responseCode == "OK") {
                callback(resp.data.result.ECAR_URL);
            } else {
                callback(false);
            }
        });
    },
    sendEmail: function($scope, data) {
        EkstepEditorAPI.jQuery.ajax({
            url: EkstepEditorAPI.getConfig('baseURL') + '/index.php?option=com_api&app=ekcontent&resource=download&format=raw',
            headers: {
                'x-auth': 'session'
            },
            type: "POST",
            data: {
                downloadUrl: data,
                name: EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).name
            },
            success: function(results) {
                $scope.isLoading = false;
                $scope.status = (results.responseCode == 'OK') ? true : false;
                $scope.getMessage = results.result;
                EkstepEditorAPI.jQuery('.ct_download_msg').transition('drop');
                EkstepEditorAPI.ngSafeApply(EkstepEditorAPI.getAngularScope());
            },
            error: function() {
                $scope.isLoading = false;
                $scope.status = false;
                $scope.getMessage = 'Unable to send email, please try again later';
                EkstepEditorAPI.jQuery('.ct_download_msg').transition('drop');
                EkstepEditorAPI.ngSafeApply(EkstepEditorAPI.getAngularScope());
            }
        });
    },
});
//# sourceURL=downloadplugin.js
