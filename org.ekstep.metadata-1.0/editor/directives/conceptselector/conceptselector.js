/**
 * @description concept selector directive
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

formApp.directive('concetpselector', function() {
    const manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.metadata");

    var conceptController = ['$scope', '$controller', function($scope, $controller) {
        var selectedConcepts = [];
        $scope.contentMeta = $scope.$parent.$parent.$parent.contentMeta;
        $scope.fieldConfig = $scope.config;
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
                    console.log("Length", data)
                    $scope.contentMeta.conceptData = '(' + data.length + ') concepts selected';
                    $scope.contentMeta.concepts = _.map(data, function(concept) {
                        return {
                            "identifier": concept.id,
                            "name": concept.name
                        };
                    });
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
        }

    };
});

//# sourceURL=conceptDirective.js