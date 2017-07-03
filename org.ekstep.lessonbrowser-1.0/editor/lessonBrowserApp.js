angular.module('org.ekstep.lessonbrowserapp', [])
.controller('lessonController', ['$scope', 'instance', 'callback',function($scope, instance, callback) {
    var ctrl = this;

    ctrl.lessonbrowser = instance;

    $scope.$on('ngDialog.opened', function(){
        setTimeout(function(){$('.tabular.menu .item').tab()}, 200);
    });

    // TODO: return appropriate response
    var error = undefined;
    var response = undefined;

    callback(error, response);

}]);