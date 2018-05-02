/**
 * Plugin to Create directive for keyboard config
 * @class keyboardCtrl
 * Jagadish Pujari <jagadish.pujari@tarento.com>
 */
'use strict';
angular.module('keyBoardApp', [])
	.controller('keyboardCtrl', ['$scope', function ($scope) {}])
	.directive('keyboardConfig', function () {
		return {
			restrict: 'AE',
			scope: {
				data: '='
			},
			template: `
				<div class="one column row" style="font-size: 1.42rem;margin-top: 4%;margin-bottom: 2%;">
					<span>Select Keyboard: </span>
				</div>
				<form name="keyboardForm">
						<div class="two row column">
							<div class="four wide column">
								<select ng-model="keyboardType" 
										ng-options="type as type for type in keyboardTypes" 
										ng-class="{\'has-success\':keyboardForm.keyboardType.$valid, \'has-error\': keyboardForm.keyboardType.$error.required != true, \'ui dropdown selection\': true}"
										ng-change="selectKeyboardType()"
										required>
								</select>
							</div>
						</div>
						<div class="two row column" ng-show="customTag">
							<div class="two wide column">
								<label class="qcMetadateFormLbl">Add keys <span class="star">&nbsp;*</span></label>
							</div>
							<div class="four wide column">
								<div class="ui input" style="width: 100%">
									<input class="form-control" 
									type="text" 
									ng-class="{\'has-success\':keyboardForm.keys.$valid, \'has-error\': keyboardForm.keys.$error.required != true}"
									ng-model="keys" 
									ng-blur="tokenizeTags($event)" 
									maxlength="51" 
									placeholder="Add keys seprated by comma(,)" 
									required>
								</div>
							</div>
						</div>

				</form>`,
			link: function (scope, element, attrs) {
				scope.keyboardTypes = ['Device', 'English', 'Custom'];
				if(!_.isUndefined(scope.data) && !_.isUndefined(scope.data.keyboardType))
				scope.keyboardType = scope.data.keyboardType;
				scope.customTag = false;
				scope.selectKeyboardType = function () {
					scope.data.keyboardType = scope.keyboardType;
					if (scope.keyboardType == 'Custom') {
						scope.customTag = true;
					} else {
						scope.customTag = false;
					}
				};
				scope.tokenizeTags = function (event) {
					scope.data.customKeys = event.target.value;
				};
			}
		};
	});

//# sourceURL=keyboardditorCtrl.js