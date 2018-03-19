/**
 * @description
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */
var formApp = angular.module('org.ekstep.metadataform', ['ngTagsInput']);

formApp.directive('keywords', function() {
    var keywordController = ['$scope', '$controller', function($scope, $controller) {
        $scope.contentMeta = $scope.$parent.$parent.$parent.contentMeta;
        $scope.fieldConfig = $scope.config;
        $scope.loadKeywords = function($query) {
            if ($query.length >= 3) {
                return org.ekstep.services.collectionService.fetchKeywords($query).then(function(keywords) {
                    return keywords.filter(function(keyword) {
                        return keyword.lemma.toLowerCase().indexOf($query.toLowerCase()) != -1;
                    });
                })
            }
        };
    }]
    return {
        restrict: "EA",
        templateUrl: ecEditor.resolvePluginResource("org.ekstep.metadata", "1.0", "editor/directives/keywords/template.html"),
        controller: keywordController,
        transclude: true,
        scope: {
            config: "="
        },
    };
});

//# sourceURL=keywordDirective.js