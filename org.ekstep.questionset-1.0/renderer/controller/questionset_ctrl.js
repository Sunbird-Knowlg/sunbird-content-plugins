'use strict';
angular.module('genie-canvas')
  .directive('templateContent', function () {
    /**
     * Directive to dynamically include HTML content in the existing DOM
     * Ex:
     *    <template-content path="/path/to/file.html"></template-content>
     */
    return {
      restrict: 'E',
      scope: false,
      transclude: true,
      link: function (scope, element, attrs) {
        scope.contentUrl = attrs.path;
        attrs.$observe('path', function (p) {
          scope.contentUrl = p;
        });
      },
      template: '<div><button ng-click="showhint()" ng-show="currentQue.showHint" style="position:absolute; right: 2%;">hints</button></div><div ng-include="contentUrl"></div>'
    }
  })
  .controllerProvider.register("questionsetctrl", function ($scope, $ocLazyLoad, $compile) {
    /**
     * Event handler to dynamically load HTML file and add it to DOM.
     * @event "renderer:load:html"
     */
    EkstepRendererAPI.addEventListener('renderer:load:html', function (event) {
      var data = event.target;
      if (data.path) {
        $ocLazyLoad.load([{type: 'html', path: data.path}]).then(function () {
          if (data.toElement) {
            var element = angular.element(data.toElement);
            var ngElement = angular.element('<template-content id="' + data.questionId + '" path="' + data.path + '"></template-content>');
            element.append(ngElement);
            $compile(element.contents())($scope);
            $scope.safeApply();
            if (_.isFunction(data.callback)) data.callback(data);
          }
        });
      }
    });

    /**
     * Event handler to dynamically load a JS file.
     * @event "renderer:load:js"
     */
    EkstepRendererAPI.addEventListener('renderer:load:js', function (event) {
      var data = event.target;
      if (data.path) {
        $ocLazyLoad.load({type: 'js', path: data.path}).then(function () {
          if (_.isFunction(data.callback)) data.callback(data);
        });
      }
      $scope.safeApply();
    });
  });

//# sourceURL=questionSetCtrl.js