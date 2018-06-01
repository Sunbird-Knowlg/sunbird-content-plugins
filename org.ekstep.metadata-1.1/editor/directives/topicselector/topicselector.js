/**
 * @description topic selector directive
 * @author Gourav More <gourav_m@tekditechnologies.com>
 */

formApp.directive('topicSelector', function() {
    const manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.metadata");

    var topicController = ['$scope', '$rootScope', '$controller', function($scope, $rootScope, $controller) {
        var selectedTopics = [];
        $scope.contentMeta = $scope.$parent.contentMeta;
        $scope.topicSelectorMessage = $scope.contentMeta.topic ? '(' + $scope.contentMeta.topic.length + ') topics selected' : '(0) topics selected'
        $scope.fieldConfig = $scope.config;
        if ($scope.contentMeta.topic) {
            if ($scope.contentMeta.topic.length)
                _.forEach($scope.contentMeta.topic, function(topic) {
                    selectedTopics.push(topic);
                });
        }
        $scope.topicElementId = (!_.isUndefined($scope.$parent.$parent.tempalteName)) ? $scope.$parent.$parent.tempalteName + '-topic' : 'metaform-topic';
        $scope.invokeTopicSelector = function() {
            ecEditor.addEventListener('editor:form:change', $scope.resetTopics, this);
            ecEditor.dispatchEvent('org.ekstep.topicselector:init', {
                element: $scope.topicElementId,
                selectedTopics: selectedTopics,
                isCategoryDependant : true,
                callback: function(data) {
                    console.log("Length", data)
                    $scope.topicSelectorMessage = '(' + data.length + ') topics selected';
                    $scope.contentMeta.topic = _.map(data, function(topic) {
                        return  topic.name;
                    });
                    ecEditor.dispatchEvent('editor:form:change', {key: 'topic', value: $scope.contentMeta.topic});
                    $rootScope.$safeApply();
                }
            });
        }
        $scope.resetTopics = function(event, data){
            if(data.key == 'topic' && data.value.length == 0){
                $scope.topicSelectorMessage = '(0) topics selected';
                $scope.contentMeta.topic = [];
                $rootScope.$safeApply();
            }    
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