'use strict';
var fileUploader;
angular.module('org.ekstep.uploadcontent-1.0', []).controller('uploadController', ['$scope','$injector', 'instance', function($scope, $injector, instance) {
    
    $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
    $scope.contentURL = undefined;
    $scope.newContent = false;

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
                allowedExtensions: ['pdf', 'epub', 'mp4', 'h5p', 'zip','webm'],
                itemLimit: 1,
                sizeLimit: 25000000 // 25 MB = 25 * 1024 * 1024 bytes
            },
            callbacks: {
                onStatusChange: function(id, oldStatus, newStatus) {
                    if(newStatus === 'canceled') {
                        $('#qq-upload-actions').show();
                    }
                },
                onSubmit: function(id, name) {
                    $('#qq-upload-actions').hide();
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
        if($scope.uploader.getFile(0) == null && !$scope.contentURL) {
            alert('URL or File is required');
            return;
        }
        
        var fileUpload = false;
        if($scope.uploader.getFile(0) != null) {
            fileUpload = true;
        }
        var mimeType = fileUpload ? $scope.detectMimeType($scope.uploader.getName(0)) : $scope.detectMimeType($scope.contentURL);
        if(!mimeType) {
            alert('Invalid mime type - Mimetype should be one of pdf, epub, h5p, video, youtube, html-zip');
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
                    // TODO: Show error message
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
            console.log('Uploading content by URL', fileURL);
            var data = new FormData();
            data.append("fileUrl", fileURL);
            var config = {
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                cache: false
            }

            $scope.contentService.uploadContent(ecEditor.getContext('contentId'), data, config, function(err, res) {
                if(err) {
                    // TODO: throw error message
                } else {
                    console.log('File upload successful', res);
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
        if(mimeType === 'application/vnd.ekstep.h5p-archive' || mimeType === 'application/vnd.ekstep.html-archive') {
            mimeType = 'application/octet-stream';
        }
        // 1. Get presigned URL
        $scope.contentService.getPresignedURL(ecEditor.getContext('contentId'), $scope.uploader.getName(0), function(err, res) {
            if(err) {
                // TODO: Show error message
            } else {
                // 2. Upload File to signed URL
                var signedURL = res.data.result.pre_signed_url;
                var config = { 
                    processData: false,
                    contentType: mimeType
                }
                console.log('signed url', signedURL);
                $scope.contentService.uploadDataToSignedURL(signedURL, $scope.uploader.getFile(0), config, function(err, res) {
                    if(err) {
                        // TODO: Show error message
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
}]);
