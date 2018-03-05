/**
 * @description
 */

angular.module('org.ekstep.metadataform', ['ngTokenField']).directive('keywords', function() {
    var keywordController = ['$scope', '$controller', function($scope, $controller) {
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
        templateUrl: ecEditor.resolvePluginResource("org.ekstep.metadata", "1.0", "editor/directives/keywordTemplate.html"),
        controller: keywordController

    };
});

//# sourceURL=keywordDirective.js