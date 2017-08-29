'use strict';
var fileUploader;
angular.module('org.ekstep.uploadcontent-1.0', []).controller('uploadController', ['$scope','$injector', 'instance', function($scope, $injector, instance) {
    
    console.log('upload controller initialized...');
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
                allowedExtensions: ['pdf', 'epub', 'mp4', 'h5p', 'zip'],
                itemLimit: 1,
                sizeLimit: 26214400 // 50 kB = 50 * 1024 bytes
            }
        });
        fileUploader = $scope.uploader;
    })
    $scope.upload = function() {

    }
}]);
