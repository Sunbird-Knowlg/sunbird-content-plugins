'use strict';
var fileUploader;
angular.module('org.ekstep.uploadfile-1.0', []).controller('uploadController', ['$scope', '$injector', 'instance', function ($scope, $injector, instance) {

    $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
    $scope.showLoaderIcon = false;
    $scope.uploadBtn = true;
    $scope.loaderIcon = ecEditor.resolvePluginResource("org.ekstep.uploadfile", "1.0", "editor/loader.gif");


    $scope.configData = instance.configData;
    $scope.callback = instance.callback;
    $scope.showErrorPopup = false;
    console.log('instance.configData: ', instance.configData);
    $scope.$on('ngDialog.opened', function () {
        $scope.uploader = new qq.FineUploader({
            element: document.getElementById("upload-csv-div"),
            template: 'qq-template-validation',
            request: {
                endpoint: 'localhost'
            },
            autoUpload: false,
            multiple: false,
            validation: {
                allowedExtensions: instance.configData.validation.allowedExtension,
                itemLimit: 1,
                sizeLimit: 52428800 // 50 MB = 50 * 1024 * 1024 bytes
            },
            messages: {
                sizeError: "{file} is too large, maximum file size is 50MB."
            },
            callbacks: {
                onStatusChange: function (id, oldStatus, newStatus) {
                    if (newStatus === 'canceled') {
                        $scope.showLoader(false);
                        $('#qq-upload-actions').show();
                        $scope.uploader.reset();
                        $("#orLabel").show();
                    }
                },
                onSubmit: function (id, name, responseJSON) {
                    $('#qq-upload-actions').hide();
                    $("#url-upload").hide();
                    $("#orLabel").hide();
                    $scope.showLoader(true);
                    $scope.uploadBtn = false;
                    $scope.uploadFile($scope.callback);
                },
                onError: function (id, name, errorReason) {
                    $scope.uploadBtn = true;
                    console.error("Unable to upload due to:", errorReason);
                    $scope.showLoader(false);
                    $scope.showErrorPopup = true;
                    $scope.closeThisDialog();

                    $scope.uploader.reset();
                }
            },
            showMessage: function (messages) {
                console.info(" hiding the alert messages from fine uploader");
            }
        });
        $('#qq-template-validation').remove();
        fileUploader = $scope.uploader;
    });

    $scope.uploadFile = function (cb) {
        // 1. Get presigned URL
        $scope.contentService.getPresignedURL(ecEditor.getContext('contentId'), $scope.uploader.getName(0), function (err, res) {
            if (err) {
                $scope.showLoader(false);
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Unable to upload content!',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
                $scope.updateAttrs();
            } else {
                // 2. Upload File to signed URL
                var signedURL = res.data.result.pre_signed_url;
                var config = {
                    processData: false,
                    headers: {
                        'x-ms-blob-type': 'BlockBlob'
                    }
                }

                $scope.contentService.uploadDataToSignedURL(signedURL, $scope.uploader.getFile(0), config, function (err, res) {
                    if (err) {
                        $scope.showLoader(false);
                        ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                            message: 'error while uploading!',
                            position: 'topCenter',
                            icon: 'fa fa-warning'
                        });
                        $scope.updateAttrs();
                    } else {
                        var data = new FormData();
                        var fileUrl = signedURL.split('?')[0];
                        data.append("fileUrl", fileUrl);
                        var config = {
                            enctype: 'multipart/form-data',
                            processData: false,
                            contentType: false,
                            cache: false
                        }

                        org.ekstep.services.textbookService.uploadFile(ecEditor.getContext('contentId'), data, config, function (err, res) {
                            if (err) {
                                const errTitle = 'CSV update Error';
                                const errMessage = err.responseJSON.params.errmsg;
                                console.log('Error message: ', err.responseJSON.params.errmsg);
                                $scope.closeThisDialog();
                                instance.callback(errMessage, errTitle);
                                $scope.updateAttrs();
                                $scope.showLoader(false);

                            } else {
                                ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                                    title: 'content uploaded successfully!',
                                    position: 'topCenter',
                                    icon: 'fa fa-check-circle'
                                });
                                $scope.closeThisDialog();
                            }
                        })
                    }
                })
            }
        }, 'toc');
    }
    $scope.updateAttrs = function () {
        ecEditor.dispatchEvent("org.ekstep.collectioneditor:node:load", showToc = false, function (err, res) {
            console.log('result in callback', err, res)
            if (res.responseCode == 'OK') {
                console.log("CSV updated successfully");
            }
        });
    }
    $scope.upload = function () {
        $scope.showLoader(true);
        if ($scope.uploader.getFile(0) == null) {
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: 'File is required to upload',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
            $scope.showLoader(false);
            return;
        }
    }

    $scope.showLoader = function (flag) {
        $scope.showLoaderIcon = flag;
        $scope.$safeApply();
        if (flag) {
            $('#qq-upload-actions').hide();
        } else {
            $('#qq-upload-actions').show();
        }
    }

    $scope.uploadFormClose = function () {
        $scope.closeThisDialog();
    }

    $scope.generateTelemetry = function (data) {
        if (data) ecEditor.getService('telemetry').interact({
            "type": data.type || "click",
            "subtype": data.subtype || "",
            "target": data.target || "",
            "pluginid": "org.ekstep.uploadfile",
            "pluginver": "1.0",
            "objectid": "",
            "targetid": "",
            "stage": ""
        })
    }
}]);
//# sourceURL=uploadfileplugin.js
