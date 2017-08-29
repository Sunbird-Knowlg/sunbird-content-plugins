angular.module('org.ekstep.genericeditor', ["Scope.safeApply", "yaru22.angular-timeago"]).controller('headerController', ['$scope', function($scope) {
$(".popup-item").popup();
    $(".ui.accordion").accordion();
    $(".ui.dropdown").dropdown();
    $('.ui.checkbox').checkbox();
    $('.ui.radio.checkbox').checkbox();
}]);
