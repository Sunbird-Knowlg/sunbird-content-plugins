'use strict';
var fileUploader;
angular.module('org.ekstep.uploadfile-1.0', []).controller('uploadController', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {

    $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
    $scope.showLoaderIcon = false;
    $scope.loaderIcon = ecEditor.resolvePluginResource("org.ekstep.uploadfile", "1.0", "editor/loader.gif");

   
    $scope.configData = instance.configData;
    $scope.showErrorPopup = false;
    console.log('instance.configData: ', instance.configData);
    $scope.$on('ngDialog.opened', function() {
        $scope.uploader = new qq.FineUploader({
            element: document.getElementById("upload-csv-div"),
            template: 'qq-template-validation',
            request: {
                endpoint: '/server/uploads'
            },
            autoUpload: false,
            multiple: false,
            validation: {
                allowedExtensions: instance.configData.validation.allowedExtension,
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
                    $scope.uploadFile();
                },
                onError: function(id, name, errorReason) {
                    console.error("Unable to upload due to:", errorReason);
                    $scope.showLoader(false);
                    $scope.showErrorPopup = true;
                    // log errors
                    // show errors
                        $scope.closeThisDialog();
                        // ecEditor.getService('popup').open({
                        //     template: 'updateTocError',
                        //     controller: 'headerController',
                        //     controllerAs: '$ctrl',
                        //     resolve: {
                        //         'instance': function () {
                        //             return this;
                        //         }
                        //     },
                        //     width: 200,
                        //     showClose: false,
                        //     className: 'ngdialog-theme-plain'
                        // });
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

    $scope.uploadFile = function() {
        var data = new FormData();
        data.append("fileUrl", $scope.uploader.getName(0));
        var config = {
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false
        }

        $scope.contentService.uploadFile(ecEditor.getContext('contentId'), data, config, function(err, res) {
         
            if (err) {
                const errTitle = 'CSV update Error';
                const errMessage = err.responseJSON.params.errmsg;
                console.log('Error message: ', err.responseJSON.params.errmsg);
                $scope.closeThisDialog();
                instance.callback(errMessage, errTitle);     
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
        if (fileUpload) {
            $scope.uploadFile(mimeType, cb);
        } else {
            cb($scope.contentURL);
        }
    }

    $scope.upload = function () {
        $scope.showLoader(true);
        if ($scope.uploader.getFile(0) == null ) {
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: 'File is required to upload',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
            $scope.showLoader(false);
            return;
        }

        else {

        var updatedHierarchyData = org.ekstep.collectioneditor.api.getService('collection').getCollectionHierarchy()
        console.log('updatedHierarchyData: ', updatedHierarchyData)
       console.log('collection update: ', ecEditor.dispatchEvent('org.ekstep.collectioneditor:content:update', updatedHierarchyData));
    
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

    $scope.uploadFormClose = function() {
       $scope.closeThisDialog();
    }

    $scope.generateTelemetry = function(data) {
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
