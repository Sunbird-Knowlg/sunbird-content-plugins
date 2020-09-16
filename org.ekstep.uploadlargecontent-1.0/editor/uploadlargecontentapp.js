'use strict';
var fileUploader;
angular.module('org.ekstep.uploadlargecontent-1.0', []).controller('largeUploadController', ['$scope', '$injector', 'instance', function ($scope, $injector, instance) {
    
    $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
    $scope.showLoaderIcon = false;
    $scope.failOnBlock = false;
    $scope.loaderIcon = ecEditor.resolvePluginResource("org.ekstep.uploadlargecontent", "1.0", "editor/loader.gif");
    $scope.uploadCancelLabel = ecEditor.getContext('contentId') ? 'Cancel' : 'Close Editor';
    $scope.selectedFile = null;
    $scope.currentFilePointer = 0;
    $scope.totalBytesRemaining = 0;
    $scope.blockIds = [];
    $scope.blockIdPrefix = "block-";
    $scope.submitUri = "";
    $scope.bytesUploaded = 0;
    $scope.timeStarted;
    $scope.remainingTime = 0;
    $scope.percentComplete = 0;
    $scope.reader = new FileReader();
    $scope.currentBlockId = 0;
    $scope.currentBlockProgress = 0;
    $scope.mimeType = '';
    $scope.isNewContent = (!ecEditor.getContext('contentId')) ? true : false;
    $scope.uploadInfo = (!ecEditor.getContext('uploadInfo')) ? true : false;
    /** Local file configuration */
    $scope.maxBlockSize = 5242880 //Each file will be split in 5 MB.
    $scope.retryChunkUploadLimit = 10; // total retry on any chunk upload failure 
    $scope.delayBetweenRetryCalls = 2000; // time difference between chunk upload retry call 2sec
    $scope.maxUploadSize = $scope.uploadInfo ? Number($scope.uploadInfo.maxAllowedContentSize)*1024*1024 : 16106127360; // falback is 15 GB
    $scope.minUploadSize = 1; //52428800;  // 50 MB
    $scope.allowedContentType = $scope.uploadInfo ? $scope.uploadInfo.allowedContentType : ['mp4', 'webm']; // falback mp4 and webm
    $scope.selectedPrimaryCategory = '';
    $scope.disableDropdown = false;
    $scope.primaryCategoryList = [];
    
    $scope.getCategoryList = function(){
        const contextPrimaryCategory = ecEditor.getContext('primaryCategories');
        if(!_.isUndefined(contextPrimaryCategory)) {
            $scope.primaryCategoryList = contextPrimaryCategory;
        }
    }
    $scope.onPrimaryCategoryChange = function() {
        if ($scope.selectedPrimaryCategory == '') {
            $('#dragDropArea').css("visibility", "hidden");
            $('input[name="qqfile"]').attr('disabled', true);
            $('#browseButton').css("opacity", "0.5");
        } else {
            $('#dragDropArea').css("visibility", "visible");
            $('input[name="qqfile"]').attr('disabled', false);
            $('#browseButton').css("opacity", "1");
        }
    }

    $scope.$on('ngDialog.opened', function () {
        $('#dragDropArea').css("visibility", "hidden");
        $('#browseButton').css("opacity", "0.5");
        $scope.getCategoryList();
        $('#progressElement').hide(); // Progress element for UI
        $('#retryUploadButton').hide(); // Retry on network outage for UI
        $('.progress').progress("reset") // reset progress on each upload
        $scope.uploader = new qq.FineUploader({
            element: document.getElementById("upload-content-div"),
            template: 'qq-template-validation',
            request: {
                endpoint: '/server/uploads'
            },
            autoUpload: false,
            multiple: false,
            validation: {
                allowedExtensions: $scope.allowedContentType,
                itemLimit: 1,
                sizeLimit: $scope.maxUploadSize,
                minSizeLimit: $scope.minUploadSize 
            },
            messages: {
                sizeError: "{file} You are trying to upload a file that exceeds the maximum size allowed : " + $scope.humanReadableFileSize($scope.maxUploadSize),
                minSizeError: "{file} is too small, minimum file size is " + $scope.humanReadableFileSize($scope.minUploadSize),
                typeError: "{file} The format of the file you are uploading is not supported. You can upload only {extensions} files formats",
                onLeave: "{file} is being uploaded, if you leave now the upload will be cancelled"
            },
            callbacks: {
                onStatusChange: function (id, oldStatus, newStatus) {
                    if (newStatus === 'canceled') {
                        $scope.uploader.reset();
                    }
                },
                onSubmit: function (id, name) {
                    $('#qq-upload-actions').hide();
                    $('#progressElement').show();
                    $scope.selectedFile = $scope.uploader.getFile(0)
                    $scope.totalBytesRemaining = $scope.selectedFile.size;
                    $scope.fileValidation()
                },
                onError: function (id, name, errorReason) {
                    $scope.toasterMsgHandler("error", errorReason)
                    $scope.pluginError(errorReason)
                    $scope.uploader.reset();
                }
            },
            showMessage: function (messages) {
                console.info(" hiding the alert messages from fine uploader");
            }
        });
        $('#qq-template-validation').remove();
        $('input[name="qqfile"]').attr('disabled', true);
        fileUploader = $scope.uploader;
    });
    
    
    $scope.fileValidation = function () {
        $scope.disableDropdown = true;
        $scope.generateTelemetry({
            id: "button",
            type: "click",
            subtype: "upload",
            target: "browseButton",
            objecttype: 'content'
        })
        $scope.showLoader(true);
        if ($scope.uploader.getFile(0) == null) {
            $scope.toasterMsgHandler("error", "File is required to upload")
            return;
        }
        $scope.mimeType = ($scope.uploader.getFile(0) != null) ? $scope.detectMimeType($scope.uploader.getName(0)) : '';
        if (!$scope.mimeType) {
            $scope.toasterMsgHandler("error", "Invalid content type (supported type: mp4, webm)")
            return;
        } else {
            $scope.createContent();
        }
    }
    
    
    $scope.createContent = function () {
        if ($scope.isNewContent) {
            var data = {
                request: {
                    content: {
                        "name": "Untitled Content",
                        "code": UUID(),
                        "mimeType": $scope.mimeType,
                        "createdBy": ecEditor.getContext('user').id,
                        "createdFor": ecEditor._.keys(ecEditor.getContext('user').organisations),
                        "contentType": "Resource",
                        "resourceType": "Learn",
                        "creator": ecEditor.getContext('user').name,
                        "framework": ecEditor.getContext('framework'),
                        "organisation": ecEditor._.values(ecEditor.getContext('user').organisations),
                        "primaryCategory": $scope.selectedPrimaryCategory
                    }
                }
            }
            
            $scope.contentService.createContent(data, function (err, res) {
                if (err) {
                    $scope.toasterMsgHandler("error", "Unable to create content!")
                } else {
                    var result = res.data.result;
                    ecEditor.setContext('contentId', result.node_id);
                    var resourceInfo = {
                        "identifier": result.node_id,
                        "mimeType": $scope.mimeType,
                        "framework": ecEditor.getContext('framework'),
                        "contentType": "Resource",
                    }
                    var creatorInfo = {
                        "name": ecEditor.getContext('user').name,
                        "id": ecEditor.getContext('user').id
                    }
                    var lockRequest = {
                        request: {
                            "resourceId": result.node_id,
                            "resourceType": "Content",
                            "resourceInfo": JSON.stringify(resourceInfo),
                            "creatorInfo": JSON.stringify(creatorInfo),
                            "createdBy": ecEditor.getContext('user').id
                        }
                    }
                    ecEditor.getService(ServiceConstants.CONTENT_LOCK_SERVICE).createLock(lockRequest, function (err, lockRes) {
                        if (err) {
                            $scope.toasterMsgHandler("error", "Unable to create lock!")
                        } else {
                            ecEditor.setConfig('lock', lockRes.data.result);
                            $scope.uploadCancelLabel = "Cancel";
                            $scope.generatePreSignedUrl()
                        }
                    });
                }
            });
        } else {
            $scope.generatePreSignedUrl()
        }
    }
    
    $scope.generatePreSignedUrl = function () {
        $scope.contentService.getPresignedURL(ecEditor.getContext('contentId'), $scope.uploader.getName(0), function (err, res) {
            if (err) {
                $scope.toasterMsgHandler("error", "error while generating presigned URL")
            } else {
                $scope.submitUri = res.data.result.pre_signed_url;
                $scope.uploadFileInBlocks();
            }
        })
    }
    
    /**
     * Entry point for retry upload
     */
    
    $scope.uploadFileInBlocks = function () {
        $('#retryUploadButton').hide(); // clicked on retry
        $scope.timeStarted = (!$scope.timeStarted) ? new Date() : $scope.timeStarted
        if ($scope.totalBytesRemaining > 0) {
            var fileContent = $scope.selectedFile.slice($scope.currentFilePointer, $scope.currentFilePointer + $scope.maxBlockSize);
            var blockId = $scope.blockIdPrefix + $scope.pad($scope.blockIds.length, 6);
            $scope.blockIds.push(btoa(blockId));
            $scope.reader.readAsArrayBuffer(fileContent);
            $scope.currentFilePointer += $scope.maxBlockSize;
            $scope.totalBytesRemaining -= $scope.maxBlockSize;
            if ($scope.totalBytesRemaining < $scope.maxBlockSize) {
                $scope.maxBlockSize = $scope.totalBytesRemaining;
            }
        } else {
            $('.progress').progress({
                percent: $scope.percentComplete,
                text: {
                    active: "Do not close this window until the upload is complete",
                },
            });
            setTimeout(() => {
                $scope.commitBlockList();
            }, 4000)
        }
    }
    
    
    $scope.commitBlockList = function () {
        var uri = $scope.submitUri + '&comp=blocklist';
        var requestBody = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
        for (var i = 0; i < $scope.blockIds.length; i++) {
            requestBody += '<Latest>' + $scope.blockIds[i] + '</Latest>';
        }
        requestBody += '</BlockList>';
        const blockListPromise = $scope.fetchRetry(uri, {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-ms-blob-content-type": $scope.selectedFile.type
            },
            "body": requestBody,
            "method": "PUT",
        }, $scope.delayBetweenRetryCalls, $scope.retryChunkUploadLimit);
        
        blockListPromise.then($scope.handleErrors)
            .then(function () {
                $('.progress').progress({
                    percent: 100,
                    text: {
                        active: "File Uploaded",
                    },
                });
                $('.progress').progress("complete")
                $scope.updateContentWithURL($scope.submitUri.split('?')[0]);
            }).catch(function () {
                $scope.failOnBlock = true
                $scope.toasterMsgHandler("error", "The upload seems to have failed. Click Retry to resume uploading the video.")
                $('#retryUploadButton').show();
            });
    }
    
    
    $scope.updateContentWithURL = function (fileURL) {
        var data = new FormData();
        data.append("fileUrl", fileURL);
        data.append("mimeType", $scope.mimeType);
        var config = {
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false
        }
        
        $scope.contentService.uploadContent(ecEditor.getContext('contentId'), data, config, function (err, res) {
            if (err) {
                $scope.toasterMsgHandler("error", "Unable to upload content!")
            } else {
                $scope.toasterMsgHandler("success", "content uploaded successfully!")
                ecEditor.dispatchEvent("org.ekstep.genericeditor:reload");
                $scope.closeThisDialog();
            }
        })
    }
    
    $scope.reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
            var uri = $scope.submitUri + '&comp=block&blockid=' + $scope.blockIds[$scope.blockIds.length - 1];
            var requestData = new Uint8Array(evt.target.result);
            const fetchPromise = $scope.fetchRetry(uri, {
                "headers": {
                    "Content-Type": $scope.mimeType,
                    "x-ms-blob-type": "BlockBlob"
                },
                "body": requestData,
                "method": "PUT",
            }, $scope.delayBetweenRetryCalls, $scope.retryChunkUploadLimit);
            
            fetchPromise.then($scope.handleErrors)
                .then(function (response) {
                    if (response.ok) {
                        $scope.bytesUploaded += requestData.length;
                        $scope.percentComplete = ((parseFloat($scope.bytesUploaded) / parseFloat($scope.selectedFile.size)) * 100).toFixed(2);
                        $scope.fileUploadingTimeCalculation();
                        $scope.uploadFileInBlocks();
                    } else {
                        throw new Error('failed no response from cloud storage'); // no response from cloud storage
                    }
                }).catch(function () {
                    $scope.toasterMsgHandler("error", "The upload seems to have failed. Click Retry to resume uploading the video.")
                    // preparing for retry from where it failed
                    $scope.blockIds.pop();
                    $scope.currentBlockId = $scope.blockIds[$scope.blockIds.length - 1];
                    $scope.currentBlockProgress = $scope.percentComplete
                    $scope.currentFilePointer -= $scope.maxBlockSize;
                    $scope.totalBytesRemaining += $scope.maxBlockSize;
                    $('#retryUploadButton').show();
                });
        }
    };
    
    $scope.fileUploadingTimeCalculation = function () {
        var timeElapsed = (new Date()) - $scope.timeStarted;
        var uploadSpeed = Math.floor($scope.bytesUploaded / (timeElapsed / 1000)); // Upload speed in second
        var estimatedSecondsLeft = Math.round((($scope.selectedFile.size - $scope.bytesUploaded) / uploadSpeed));
        if (!estimatedSecondsLeft) {
            return;
        }
        $scope.countdownTimer(estimatedSecondsLeft, 'seconds');
    }
    
    $scope.countdownTimer = function (number, unit) {
        let m, s, h, d;
        if (isNaN(number)) {
            throw new TypeError('Value must be a number.')
        }
        
        if (unit === 'sec' || unit === 'seconds') {
            s = number
        } else if (unit === 'ms' || unit === 'milliseconds' || !unit) {
            s = Math.floor(number / 1000)
        } else {
            throw new TypeError('Unit must be sec or ms');
        }
        
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        
        let parts = {
            days: d,
            hours: h,
            minutes: m,
            seconds: s
        };
        let remaining = Object.keys(parts)
            .map(part => {
                if (!parts[part]) return;
                return `${parts[part]} ${part}`;
            })
            .join(" ");
        $scope.remainingTime = remaining
        
        $('.progress').progress({
            percent: $scope.percentComplete,
            text: {
                active: "Remaining time" + $scope.remainingTime,
            },
        });
        
    }
    /** Retry upload in case of permanent disconnection  */
    $scope.retryUpload = function () {
        ($scope.failOnBlock) ? $scope.commitBlockList(): $scope.uploadFileInBlocks()
    }
    
    $scope.pad = function (number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
    
    $scope.handleErrors = function (response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
    
    $scope.detectMimeType = function (fileName) {
        var extension = fileName.split('.').pop()
        switch (extension) {
        case 'mp4':
            return 'video/mp4';
        case 'webm':
            return 'video/webm';
        default:
        }
    }
    
    $scope.showLoader = function (flag) {
        $scope.showLoaderIcon = flag;
        if (flag) {
            $('#qq-upload-actions').hide();
        } else {
            $('#qq-upload-actions').show();
        }
        $scope.$safeApply();
    }
    
    $scope.generateTelemetry = function (data) {
        if (data) ecEditor.getService('telemetry').interact({
            "id": data.id,
            "type": data.type || "click",
            "subtype": data.subtype || "",
            "target": data.target || "",
            "pluginid": "org.ekstep.uploadcontent",
            "pluginver": "1.5",
            "objectid": "",
            "targetid": "",
            "stage": ""
        })
    }
    
    /** Retry upload in case of intermittent disconnection  */
    $scope.fetchRetry = function (url, fetchOptions = {}, delay, limit) {
        return new Promise((resolve, reject) => {
            function success(response) {
                resolve(response);
            }
            
            function failure(error) {
                limit--;
                if (limit) {
                    setTimeout(fetchUrl, delay)
                } else {
                    // not able to connect at all lets show retry 
                    reject(error);
                }
            }
            
            function finalHandler(finalError) {
                throw finalError;
            }
            
            function fetchUrl() {
                return fetch(url, fetchOptions)
                    .then(success)
                    .catch(failure)
                    .catch(finalHandler);
            }
            fetchUrl();
        });
    }
    
    $scope.toasterMsgHandler = function (type, title) {
        switch (type) {
        case 'success':
            ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                title: title,
                position: 'topCenter',
                icon: 'fa fa-check-circle'
            });
            break;
        case 'error':
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: title,
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
            $scope.showLoader(false);
            break;
        default:
        }
        
    }
    
    $scope.pluginError = function (errorReason) {
        const manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.uploadcontent");
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
    }

    $scope.humanReadableFileSize = function (size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    $scope.uploadFormClose = function() {
        ecEditor.getContext('contentId') ? $scope.closeThisDialog() : ecEditor.dispatchEvent("org.ekstep:sunbirdcommonheader:close:editor");
    }

}]);

//# sourceURL=uploadLargeContentApp.js
