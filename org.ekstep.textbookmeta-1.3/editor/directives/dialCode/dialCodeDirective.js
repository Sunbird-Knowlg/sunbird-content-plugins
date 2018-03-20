/**
 * @description
 * @author Archana Baskaran<archana.b@latitudefintech.com>
 */


 var textbookApp = angular.module('textbookmetaApp', ['ngTagsInput', 'Scope.safeApply'])
textbookApp.directive('dialCode', function () {
    template = ecEditor.resolvePluginResource("org.ekstep.textbookmeta", "1.3", "editor/directives/dialCode/template.html")
    var dialCodeController = ['$scope', '$controller', '$filter', function ($scope, $controller, $filter) {

        $scope.proceedFlag = false;
        $scope.clearFlag = false;
        $scope.failureFlag = false;
        $scope.successFlag = false;
        $scope.editFlag = false;
        // validate dial code input
        $scope.validateInputValue = function () {
            var dialCode = this.dialUpCode;
            console.log('entered value..', this.dialUpCode);
            if (String(dialCode).match(/^[A-Z0-9]{6}$/)) {
                $scope.proceedFlag = true;
                $scope.clearFlag = true;
            }
            else {
                $scope.proceedFlag = false;
                if (String(dialCode).length) {
                    $scope.clearFlag = true;
                }
                else {
                    $scope.clearFlag = false;
                }
            }
        }
        // validate the dialCode
        $scope.validateDialCode = function () {
            console.log('entered dial code..', this.dialUpCode);
            var validCode = $filter('filter')($scope.dialCodes, { identifier: this.dialUpCode })[0];
            console.log('result value..', validCode);
            if (validCode) {
                $scope.successFlag = true;
                $scope.failureFlag = false;
            } else {
                $scope.failureFlag = true;
                $scope.successFlag = false;
            }
            $scope.editFlag = true;
            $scope.clearFlag = false;
            $scope.proceedFlag = false;
        }

        // dialCode edit 
        $scope.editDialCode = function () {
            console.log('calling the edit dial code..');
            $('input.dialCode').focus();
            $scope.editFlag = false;
            $scope.clearFlag = true;
            $scope.proceedFlag = true;
            $scope.successFlag = false;
            $scope.failureFlag = false;
            $scope.$safeApply();
        }

        // clear dial code values
        $scope.clearDialCode = function () {
            $('input.dialCode').val('');
            $scope.proceedFlag = false;
            $scope.clearFlag = false;
        }

    }]
    return {
        restrict: 'EA',
        templateUrl: template,
        Scope: {},
        controller: dialCodeController

    }
});
//# sourceURL=dialCodeTextbook.js