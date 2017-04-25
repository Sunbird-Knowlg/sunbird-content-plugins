angular.module('editorApp').directive('uiColorpicker', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<span><input class="input" id="{{config.propertyName}}" id="{{config.propertyName}}" ng-click="fireSidebarTelemetry({id: config.propertyName}, config.dataType)"/></span>',
        link: function(scope, element) {
            var input = element.find('input');
            input.spectrum({
                color: "#eeeeee"
            });
        }
    };
});
