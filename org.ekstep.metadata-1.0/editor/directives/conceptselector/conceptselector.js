/**
 * @description
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

formApp.directive('concetpselector', function() {
    var conceptController = ['$scope', '$controller', function($scope, $controller) {
        let selectedConcepts = []
        if ($scope.contentMeta.concepts) {
            if ($scope.contentMeta.concepts.length)
                _.forEach($scope.contentMeta.concepts, function(concept) {
                    selectedConcepts.push(concept.identifier);
                });
        } else {
            $scope.contentMeta.conceptData = '(0) concepts selected';
        }
        $scope.invokeConceptSelector = function() {
            ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
                element: 'metaform-concept',
                selectedConcepts: selectedConcepts,
                callback: function(data) {
                    $scope.contentMeta.conceptData = '(' + data.length + ') concepts selected';
                    $scope.contentMeta.concepts = _.map(data, function(concept) {
                        return {
                            "identifier": concept.id,
                            "name": concept.name
                        };
                    });
                    $scope.$safeApply();
                }
            });
        }
        $scope.invokeConceptSelector()
    }]
    return {
        restrict: "EA",
        templateUrl: ecEditor.resolvePluginResource("org.ekstep.metadata", "1.0", "editor/directives/conceptselector/template.html"),
        controller: conceptController

    };
});

//# sourceURL=conceptDirective.jssss