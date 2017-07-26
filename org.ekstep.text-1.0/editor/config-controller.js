angular.module('editorApp')
    .controller('org.ekstep.text:config-controller', ['$scope', function($scope) {
        $scope.openTransliterator = function() {
            ecEditor.dispatchEvent("org.ekstep.text:showpopup");
        };

        ecEditor.jQuery('.ui.accordion').accordion();
        ecEditor.jQuery('.font-face-dropdown').dropdown({
        	'set selected': '1'
        });
    }]);