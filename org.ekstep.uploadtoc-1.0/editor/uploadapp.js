'use strict';
var fileUploader;
angular.module('org.ekstep.uploadtoc-1.0', []).controller('uploadController', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {

    $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
    // $scope.contentURL = undefined;
    // $scope.newContent = false;
    $scope.showLoaderIcon = false;
    $scope.loaderIcon = ecEditor.resolvePluginResource("org.ekstep.uploadcsv", "1.0", "editor/loader.gif");
    $scope.uploadCancelLabel = ecEditor.getContext('contentId') ? 'Close' : 'Close Editor';

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
                    // log errors
                    // show errors
                        $scope.closeThisDialog();
                        ecEditor.getService('popup').open({
                            template: 'updateTocError',
                            controller: 'headerController',
                            controllerAs: '$ctrl',
                            resolve: {
                                'instance': function () {
                                    return this;
                                }
                            },
                            width: 200,
                            showClose: false,
                            className: 'ngdialog-theme-plain'
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

    $scope.uploadFile = function(mimeType, cb) {
        // Call upload csv api
       // on success dipatch event
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
        ecEditor.getContext('contentId') ? $scope.closeThisDialog() : ecEditor.dispatchEvent("org.ekstep:sunbirdcommonheader:close:editor");
    }

    $scope.generateTelemetry = function(data) {
        if (data) ecEditor.getService('telemetry').interact({
            "type": data.type || "click",
            "subtype": data.subtype || "",
            "target": data.target || "",
            "pluginid": "org.ekstep.uploadtoc",
            "pluginver": "1.0",
            "objectid": "",
            "targetid": "",
            "stage": ""
        })
    }    
}]);
