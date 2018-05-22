/**
 * @description topic selector directive
 * @author Gourav More <gourav_m@tekditechnologies.com>
 */

formApp.directive('topicSelector', function() {
    const manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.metadata");

    var topicController = ['$scope', '$rootScope', '$controller', function($scope, $rootScope, $controller) {
        var selectedTopics = [];
        $scope.contentMeta = $scope.$parent.contentMeta;
        $scope.topicSelectorMessage = $scope.contentMeta.topics ? '(' + $scope.contentMeta.topics.length + ') topics selected' : '(0) topics selected'
        $scope.fieldConfig = $scope.config;
        if ($scope.contentMeta.topics) {
            if ($scope.contentMeta.topics.length)
                _.forEach($scope.contentMeta.topics, function(topic) {
                    selectedTopics.push(topic.identifier);
                });
        }
        $scope.topicElementId = (!_.isUndefined($scope.$parent.$parent.tempalteName)) ? $scope.$parent.$parent.tempalteName + '-topic' : 'metaform-topic';
        $scope.invokeTopicSelector = function() {
            ecEditor.dispatchEvent('org.ekstep.topicselector:init', {
                element: $scope.topicElementId,
                selectedTopics: selectedTopics,
                callback: function(data) {
                    console.log("Length", data)
                    $scope.topicSelectorMessage = '(' + data.length + ') topics selected';
                    $scope.contentMeta.topics = _.map(data, function(topic) {
                        return {
                            "identifier": topic.id,
                            "name": topic.name
                        };
                    });
                    ecEditor.dispatchEvent('editor:form:change', {key: 'topics', value: $scope.contentMeta.topics});
                    $rootScope.$safeApply();
                }
            });
        }
        $scope.invokeTopicSelector()
    }]
    return {
        restrict: "EA",
        templateUrl: ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/directives/topicselector/template.html"),
        controller: topicController,
        scope: {
            config: '='
        },
        transclude: true

    };
});

//# sourceURL=topicDirective.js