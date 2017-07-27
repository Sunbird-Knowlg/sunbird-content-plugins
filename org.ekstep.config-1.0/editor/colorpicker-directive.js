angular.module('editorApp').directive('uiColorpicker', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<span><input class="input" id="{{config.propertyName || \'color\'}}" id="{{config.propertyName || \'color\'}}" ng-click="fireSidebarTelemetry({id: config.propertyName || \'color\'}, config.dataType)"/></span>',
        link: function(scope, element) {
            var input = element.find('input');
            input.spectrum({
                color: "#eeeeee"
            });
        }
    };
});
