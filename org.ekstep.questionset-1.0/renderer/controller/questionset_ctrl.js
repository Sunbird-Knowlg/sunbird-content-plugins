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
  .directive('qsGoodJob', function () {
    return {
      restrict: 'AE',
      template: '<div class="popup" style="z-index: 9999999;"> <div class="popup-overlay"></div> <div class="popup-full-body"> <div class="font-lato assess-popup assess-goodjob-popup"> <div class="correct-answer" style=" text-align: center;"> <div class="banner"> <img ng-src="assets/icons/banner1.png" height="100%" width="100%" src="assets/icons/banner1.png"> </div> <div class="sign-board"> <img ng-src="assets/icons/check.png" id="correctButton" width="40%" src="assets/icons/check.png"> </div> </div> <div id="popup-buttons-container"> <div ng-click="hidePopup();moveNextStage();" class="primary center button ng-binding">Next</div> </div> </div> </div> </div>',
      link: function (scope, element) {
        EkstepRendererAPI.addEventListener('renderer:load:popup:goodJob', function () {
          element.show();
        });
        scope.hidePopup = function () {
          element.hide();
        }
        scope.moveNextStage = function () {
          EkstepRendererAPI.dispatchEvent('renderer:navigation:next');
          scope.hidePopup();
          element.hide();
        }
      }
    }
  })
  .directive('qsTryAgain', function () {
    return {
      restrict: 'AE',
      template: '<div class="popup" style="z-index: 9999999;"> <div class="popup-overlay"></div> <div class="popup-full-body"> <div class="font-lato assess-popup assess-tryagain-popup"> <div class="wrong-answer" style=" text-align: center;"> <div class="banner"> <img ng-src="assets/icons/banner2.png" height="100%" width="100%" src="assets/icons/banner2.png"> </div> <div class="sign-board"><img ng-src="assets/icons/incorrect.png" width="40%" id="incorrectButton" src="assets/icons/incorrect.png"> </div> </div> <div id="popup-buttons-container"> <div ng-click="tryAgainHidePopup();moveNextStage();" class="left button ng-binding">Next</div> <div ng-click="tryAgainSameQ();" class="right primary button ng-binding">Try Again</div> </div> </div> </div> </div>',
      link: function (scope, element) {
        EkstepRendererAPI.addEventListener('renderer:load:popup:tryAgain', function () {
          element.show();
        });
        scope.tryAgainHidePopup = function () {
          element.hide();
        }
        scope.moveNextStage = function () {
          EkstepRendererAPI.dispatchEvent('renderer:navigation:next');
          scope.tryAgainHidePopup();
          element.hide();
        }
        scope.tryAgainSameQ = function () {
          EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:feedback:retry');
          scope.tryAgainHidePopup();
          element.hide();
        }
      }
    }
  })
  .directive('qsPartialCorrect', function () {
    return {
      restrict: 'AE',
      template: '<div class="popup" style="z-index: 9999999;"> <div class="popup-overlay"></div> <div class="popup-full-body"> <div class="font-lato assess-popup assess-tryagain-popup"> <div class="wrong-answer" style=" text-align: center;"> <div class="banner"> <img ng-src="assets/icons/banner2.png" height="100%" width="100%" src="assets/icons/banner2.png"> </div> <div class="sign-board"><span width="40%" style="font-size: 1.8em;color: #7d7d7d;font-family:noto-sans;font-weight: 900;" id="incorrectButton">{{partialScoreRes}}</span> </div> </div> <div id="popup-buttons-container"> <div ng-click="tryAgainHidePopup();moveToNextStage();" class="left button ng-binding">Next</div> <div ng-click="tryAgainSameQues();" class="right primary button ng-binding">Try Again</div> </div> </div> </div> </div>',
      link: function (scope, element) {
        EkstepRendererAPI.addEventListener('renderer:load:popup:partialCorrect', function (event) {
          scope.partialScoreRes = event.target;
          element.show();
        });
        scope.tryHidePopup = function () {
          element.hide();
        }
        scope.moveToNextStage = function () {
          EkstepRendererAPI.dispatchEvent('renderer:navigation:next');
          scope.tryHidePopup();
          element.hide();
        }
        scope.tryAgainSameQues = function () {
          EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:feedback:retry');
          scope.tryHidePopup();
          element.hide();
        }
      }
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