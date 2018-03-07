/**
 * @description
 */

formApp.directive('concetpselector', function() {
    var conceptController = ['$scope', '$controller', function($scope, $controller) {
        $scope.metaform.concept = [];
        $scope.invokeConceptSelector = function() {
            ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
                element: 'metaform-concept',
                callback: function(concepts) {
                    angular.forEach(concepts, function(concept) {
                        $scope.metaform.concept.push(concept.name);
                    });
                    $scope.$safeApply();
                }
            });
        }
    }]
    return {
        restrict: "EA",
        templateUrl: ecEditor.resolvePluginResource("org.ekstep.metadata", "1.0", "editor/directives/conceptselector/template.html"),
        controller: conceptController

    };
});

//# sourceURL=conceptDirective.jsss