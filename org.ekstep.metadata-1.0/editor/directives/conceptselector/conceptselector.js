/**
 * @description concept selector directive
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

formApp.directive('conceptselector', function() {
    const manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.metadata");

    var conceptController = ['$scope', '$rootScope', '$controller', function($scope, $rootScope, $controller) {
        var selectedConcepts = [];
        $scope.contentMeta = $scope.$parent.contentMeta;
        $scope.contentMeta.conceptData = $scope.$parent.contentMeta.conceptData || '(0) concepts selected';
        $scope.fieldConfig = $scope.config;
        if ($scope.contentMeta.concepts) {
            if ($scope.contentMeta.concepts.length)
                _.forEach($scope.contentMeta.concepts, function(concept) {
                    selectedConcepts.push(concept.identifier);
                });
        }
        $scope.invokeConceptSelector = function() {
            ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
                element: 'metaform-concept',
                selectedConcepts: selectedConcepts,
                callback: function(data) {
                    console.log("Length", data)
                    $scope.contentMeta.conceptData = '(' + data.length + ') concepts selected';
                    $scope.contentMeta.concepts = _.map(data, function(concept) {
                        return {
                            "identifier": concept.id,
                            "name": concept.name
                        };
                    });
                    $rootScope.$safeApply();
                }
            });
        }
        $scope.invokeConceptSelector()
    }]
    return {
        restrict: "EA",
        templateUrl: ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/directives/conceptselector/template.html"),
        controller: conceptController,
        scope: {
            config: '='
        },
        transclude: true

    };
});

//# sourceURL=conceptDirective.js