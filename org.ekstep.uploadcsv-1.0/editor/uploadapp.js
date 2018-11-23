'use strict';
var fileUploader;
angular.module('org.ekstep.uploadcsv-1.0', []).controller('uploadController', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {

    $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
    // $scope.contentURL = undefined;
    // $scope.newContent = false;
    $scope.showLoaderIcon = false;
    $scope.loaderIcon = ecEditor.resolvePluginResource("org.ekstep.uploadcsv", "1.0", "editor/loader.gif");
    $scope.uploadCancelLabel = ecEditor.getContext('contentId') ? 'Cancel' : 'Close Editor';

    $scope.$on('ngDialog.opened', function() {
        $scope.uploader = new qq.FineUploader({
            element: document.getElementById("upload-content-div"),
            template: 'qq-template-validation',
            request: {
                endpoint: '/server/uploads'
            },
            autoUpload: false,
            multiple: false,
            validation: {
                allowedExtensions: ['csv'],
                itemLimit: 1,
                sizeLimit: 52428800 // 50 MB = 50 * 1024 * 1024 bytes
            },
            messages:{
                sizeError: "{file} is too large, maximum file size is 50MB."
            },
            callbacks: {
                onStatusChange: function(id, oldStatus, newStatus) {
                    if (newStatus === 'canceled') {
                        $scope.showLoader(false);
                        $('#qq-upload-actions').show();
                        $("#url-upload").show();
                        $scope.uploader.reset();
                        $("#orLabel").show();
                    }
                },
                onSubmit: function(id, name) {
                    $('#qq-upload-actions').hide();
                    $("#url-upload").hide();
                    $("#orLabel").hide();
                    $scope.upload();
                },
                onError: function(id, name, errorReason) {
                    console.error("Unable to upload due to:", errorReason);
                    $scope.showLoader(false);
                    ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                        message: errorReason,
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                    const manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.uploadcsv");
                    var pkgVersion = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId')).pkgVersion;
                    var object = {
                        id: org.ekstep.contenteditor.api.getContext('contentId'),
                        ver: !_.isUndefined(pkgVersion) && pkgVersion.toString() || '0',
                        type: 'Content'
                    }
                    org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE).error({
                        "err": name || 'Unable to upload',
                        "errtype": 'CONTENT',
                        "stacktrace": errorReason,
                        "pageid": "",
                        "object": object,
                        "plugin": {
                            id: manifest.id,
                            ver: manifest.ver,
                            category: 'core'
                        }
                    });
                    $scope.uploader.reset();
                }
            },
            showMessage: function(messages) {
                console.info(" hiding the alert messages from fine uploader");                
            }
        });
        $('#qq-template-validation').remove();
        fileUploader = $scope.uploader;
    });

    $scope.upload = function() {
        $scope.generateTelemetry({subtype:"upload",target:"browseButton",objecttype:'content'})
        $scope.showLoader(true);
        if ($scope.uploader.getFile(0) == null) {
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: 'URL or File is required to upload',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
            $scope.showLoader(false);
            return;
        }

        var fileUpload = false;
        if ($scope.uploader.getFile(0) != null) {
            fileUpload = true;
        }

             // Create Content
             var data = {
                request: {
                    // content: {file }
                }
            }

    }

    $scope.showLoader = function(flag) {
        $scope.showLoaderIcon = flag;
        $scope.$safeApply();
        if (flag) {
            $('#qq-upload-actions').hide();
        } else {
            $('#qq-upload-actions').show();
        }
    }
    $scope.uploadCsvClose = function() {
       $scope.closeThisDialog();
    }

    $scope.generateTelemetry = function(data) {
        if (data) ecEditor.getService('telemetry').interact({
            "type": data.type || "click",
            "subtype": data.subtype || "",
            "target": data.target || "",
            "pluginid": "org.ekstep.uploadcsv",
            "pluginver": "1.0",
            "objectid": "",
            "targetid": "",
            "stage": ""
        })
    }    
}]);
