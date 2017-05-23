angular.module('editorApp')
.controller('org.ekstep.textNew:config-controller', ['$scope', function($scope) {
    $scope.setFont = function(font) {
    	org.ekstep.contenteditor.api.jQuery('#__config_select').dropdown('set selected', 'string:'+font);
    	org.ekstep.contenteditor.api.getCurrentObject().onConfigChange('fontfamily', font);
    	alert('Font has been changed to '+ font);
    }
}]);
