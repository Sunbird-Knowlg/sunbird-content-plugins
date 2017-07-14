angular.module('org.ekstep.ceheader:headerApp', []).controller('mainController', ['$scope', function($scope) {

    var plugin = { id: "org.ekstep.collectionheader", ver: "1.0" },
        lastSavedTime;
    $scope.contentDetails.contentImage = ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/images/default.png");
    $scope.internetStatusObj = {
        'status': navigator.onLine,
        'text': 'Internet Connection not available'
    };

    $scope.saveContent = function(event, options) {
        var contentBody = org.ekstep.collectioneditor.api.getService('collection').getCollectionHierarchy();
        console.log('contentBody', contentBody);
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).saveCollectionHierarchy({ body: contentBody }, function(err, res) {
            if (res && res.data && res.data.responseCode == "OK") {
                ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                    title: 'Content saved successfully!',                    
                    position: 'topCenter',
                    icon: 'fa fa-check-circle'
                });
            } else {
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Unable to save the content, try again!',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
        });
    };

    $scope.fireEvent = function(event) {
        if (event) org.ekstep.contenteditor.api.dispatchEvent(event.id, event.data);
    };

    $scope.fireTelemetry = function(menu, menuType) {
        $scope.telemetryService.interact({ "type": "click", "subtype": "menu", "target": menuType, "pluginid": 'org.ekstep.ceheader', 'pluginver': '1.0', "objectid": menu.id, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
    };

    $scope.internetStatusFn = function(event) {
        $scope.$safeApply(function() {
            $scope.internetStatusObj.status = navigator.onLine;
        })
    };

    window.onbeforeunload = function(e) {
        return "You have unsaved changes";
    }
    window.addEventListener('online', $scope.internetStatusFn, false);
    window.addEventListener('offline', $scope.internetStatusFn, false);
    ecEditor.addEventListener('org.ekstep.collectionheader:save', $scope.saveContent, $scope);
}]);
