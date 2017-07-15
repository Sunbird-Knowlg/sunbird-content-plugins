angular.module('org.ekstep.collectionheader:app', ["Scope.safeApply", "yaru22.angular-timeago"]).controller('headerController', ['$scope', function($scope) {

    var plugin = { id: "org.ekstep.collectionheader", ver: "1.0" };
    $scope.contentDetails.contentImage = ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/images/default.png");
    $scope.internetStatusObj = {
        'status': navigator.onLine,
        'text': 'No Internet Connection!'
    };
    $scope.disableSaveBtn = false;    
    $scope.lastSaved;

    $scope.saveContent = function() {
        $scope.disableSaveBtn = true;
        ecEditor.dispatchEvent("org.ekstep.collectioneditorfunctions:save", {
            showNotification: true,
            callback: function(err, res) {
                $scope.disableSaveBtn = false;
                $scope.lastSaved = Date.now(); 
                $scope.$safeApply();               
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
        });
    };

    window.onbeforeunload = function(e) {
        return "You have unsaved changes";
    }
    window.addEventListener('online', $scope.internetStatusFn, false);
    window.addEventListener('offline', $scope.internetStatusFn, false);
}]);