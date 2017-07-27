angular.module('editorApp')
    .controller('org.ekstep.text:config-controller', ['$scope', function($scope) {
        $scope.openTransliterator = function() {
            ecEditor.dispatchEvent("org.ekstep.text:showpopup");
        };

        ecEditor.jQuery('.ui.accordion').accordion();
        
    }]);