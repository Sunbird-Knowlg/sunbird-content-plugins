'use strict';

angular.module('org.ekstep.uploadcontent-1.0', []).controller('uploadController', ['$scope','$injector', 'instance', function($scope, $injector, instance) {
    var ctrl = this;
    ctrl.uploader = $('#upload-content-div').fineUploader({
        template: 'qq-template-validation',
        request: {
            endpoint: '/server/uploads'
        },
        autoUpload: false,
        validation: {
            allowedExtensions: ['pdf', 'epub', 'mp4', 'h5p', 'zip'],
            itemLimit: 1,
            sizeLimit: 26214400 // 50 kB = 50 * 1024 bytes
        }
    });
    ctrl.upload = function() {
        
    }
}]);
