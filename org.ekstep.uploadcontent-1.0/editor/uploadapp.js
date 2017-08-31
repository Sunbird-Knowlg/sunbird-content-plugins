'use strict';
var fileUploader;
angular.module('org.ekstep.uploadcontent-1.0', []).controller('uploadController', ['$scope','$injector', 'instance', function($scope, $injector, instance) {
    
    $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
    $scope.contentURL = undefined;
    $scope.newContent = false;
    $scope.showLoaderIcon = false;    
    $scope.loaderIcon = ecEditor.resolvePluginResource("org.ekstep.uploadcontent", "1.0", "editor/loader.gif");


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
                allowedExtensions: ['pdf', 'epub', 'mp4', 'h5p', 'zip', 'webm'],
                itemLimit: 1,
                sizeLimit: 25000000 // 25 MB = 25 * 1024 * 1024 bytes
            },
            callbacks: {
                onStatusChange: function(id, oldStatus, newStatus) {
                    if(newStatus === 'canceled') {
                        //$scope.uploader.reset(id); 
                        $scope.showLoader(false);
                        $('#qq-upload-actions').show();
                        $("#url-upload").show();
                    }
                },
                onSubmit: function(id, name) {
                    $('#qq-upload-actions').hide();
                    $("#url-upload").hide();                    
                }
            }
        });
        $('#qq-template-validation').remove();
        fileUploader = $scope.uploader;
    });

    $scope.detectMimeType = function(fileName) {

        var extn = fileName.split('.').pop()
        switch(extn) {
            case 'pdf':
                return 'application/pdf';
            case 'mp4':
                return 'video/mp4';
            case 'h5p':
                return 'application/vnd.ekstep.h5p-archive';
            case 'zip':
                return 'application/vnd.ekstep.html-archive';
            case 'epub':
                return 'application/epub';
            case 'webm':
                return 'video/webm';    
            default:
                if($scope.validateYoutubeURL(fileName)) {
                    return 'video/x-youtube';
                }
                return '';
        }
    }

    $scope.validateYoutubeURL = function(fileName) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = fileName.match(regExp);
        if (match && match[2].length == 11) {
            return true;
        }
        return false;
    }

    $scope.upload = function() {
        $scope.showLoader(true);
        if($scope.uploader.getFile(0) == null && !$scope.contentURL) {
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: 'URL or File is required to upload',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
            $scope.showLoader(false);
            return;
        }
        
        var fileUpload = false;
        if($scope.uploader.getFile(0) != null) {
            fileUpload = true;
        }
        var mimeType = fileUpload ? $scope.detectMimeType($scope.uploader.getName(0)) : $scope.detectMimeType($scope.contentURL);
        if(!mimeType) {
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: 'Invalid content type (supported type: pdf, epub, h5p, mp4, youtube, html-zip, webm)',
                position: 'topCenter',
                icon: 'fa fa-warning'
            }); 
            $scope.showLoader(false);           
            return;
        }
        if($scope.newContent) {
            // Create Content
            var data = {
                request: {
                    content: {
                        "name": "Untitled Content",
                        "code": UUID(),
                        "mimeType": mimeType
                    }
                }
            }

            $scope.contentService.createContent(data, function(err, res) {
                if(err) {
                    ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                        message: 'Unable to create content!',
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                    $scope.showLoader(false);
                } else {
                    var result = res.data.result;
                    ecEditor.setContext('contentId', result.node_id);                    
                    $scope.uploadByURL(fileUpload, mimeType);
                }
            });
        } else {
            $scope.uploadByURL(fileUpload, mimeType);
        }
    }

    $scope.uploadByURL = function(fileUpload, mimeType) {
        var cb = function(fileURL) {
            var data = new FormData();
            data.append("fileUrl", fileURL);
            data.append("mimeType", mimeType);
            var config = {
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                cache: false
            }

            $scope.contentService.uploadContent(ecEditor.getContext('contentId'), data, config, function(err, res) {
                if(err) {
                    ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                        message: 'Unable to upload content!',
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                    $scope.showLoader(false);
                } else {
                    ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                        title: 'content uploaded successfully!',                    
                        position: 'topCenter',
                        icon: 'fa fa-check-circle'
                    });
                    ecEditor.dispatchEvent("org.ekstep.genericeditor:reload");
                    $scope.closeThisDialog();
                }
            })
        }
        if(fileUpload) {
            $scope.uploadFile(mimeType, cb);
        } else {
            cb($scope.contentURL);
        }
    }

    $scope.uploadFile = function(mimeType, cb) {

        var contentType = mimeType;
        if(mimeType === 'application/vnd.ekstep.h5p-archive' || mimeType === 'application/vnd.ekstep.html-archive') {
            contentType = 'application/octet-stream';
        }
        // 1. Get presigned URL
        $scope.contentService.getPresignedURL(ecEditor.getContext('contentId'), $scope.uploader.getName(0), function(err, res) {
            if(err) {
                $scope.showLoader(false);
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'error while uploading!',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            } else {
                // 2. Upload File to signed URL
                var signedURL = res.data.result.pre_signed_url;
                var config = { 
                    processData: false,
                    contentType: contentType
                }
                $scope.contentService.uploadDataToSignedURL(signedURL, $scope.uploader.getFile(0), config, function(err, res) {
                    if(err) {
                        $scope.showLoader(false);
                        ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                            message: 'error while uploading!',
                            position: 'topCenter',
                            icon: 'fa fa-warning'
                        });
                    } else {
                        cb(signedURL.split('?')[0]);
                    }
                })
            }
        })
    }

    if(!ecEditor.getContext('contentId')) {
        $scope.newContent = true;
    }

    $scope.showLoader = function(flag) {
        $scope.showLoaderIcon = flag;
        $scope.$safeApply();
        if (flag) {
            $('#qq-upload-actions').hide();
        } else {
            if (!$scope.uploader.getFile(0)) {
                $('#qq-upload-actions').show();
            }
        }
    }
}]);
