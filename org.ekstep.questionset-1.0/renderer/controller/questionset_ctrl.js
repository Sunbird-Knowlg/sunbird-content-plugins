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
	 	template: '<div ng-include="contentUrl"></div>'
	 }
	})
.controllerProvider.register("questionsetctrl", function($scope, $ocLazyLoad,$compile) {
/**
 * Event handler to dynamically load HTML file and add it to DOM.
 * @event "renderer:load:html"
 * @param
 *      {
 *          path: String //Path to html file.
 *          toElement: String //Class of the HTML element to append the html to.
 *          callback: Function //Callback to execute after load.
 *      }
 */
 	EkstepRendererAPI.addEventListener('renderer:load:html', function (event) {
 	var data = event.target;
 	if (data.path) {
 		$ocLazyLoad.load([{type: 'html', path: data.path}]).then(function () {
 			if (data.toElement) {
 				var element = angular.element(data.toElement);
 				var ngElement = angular.element('<template-content path="' + data.path + '"></template-content>');
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
 * @param
 *      {
 *          path: String //Path to js file.
 *          callback: Function //Callback to execute after load.
 *      }
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