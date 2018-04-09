/**
 * Plugin to Create directive for keyboard config
 * @class keyboardCtrl
 * Jagadish Pujari <jagadish.pujari@tarento.com>
 */
'use strict';
angular.module('keyBoardApp', [])
    .controller('keyboardCtrl', ['$scope', function($scope) {

    }])
    .directive('keyboardConfig', function($rootScope) {
	return {
		restrict: 'AE',
		template: '<div class="ui header">Jagadish</div>',
		link: function(scope, element, attrs) {
				
			});
			
		}
	}
})
