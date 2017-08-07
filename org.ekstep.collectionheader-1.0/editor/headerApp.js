angular.module('org.ekstep.collectionheader:app', ["Scope.safeApply", "yaru22.angular-timeago"]).controller('headerController', ['$scope', function($scope) {

    var plugin = { id: "org.ekstep.collectionheader", ver: "1.0" };
    $scope.contentDetails.contentImage =  ecEditor.getConfig('headerLogo') || ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/images/default.png");
    $scope.internetStatusObj = {
        'status': navigator.onLine,
        'text': 'No Internet Connection!'
    };
    $scope.disableSaveBtn = true;
    $scope.lastSaved;

    $scope.saveContent = function() {
        $scope.disableSaveBtn = true;
        ecEditor.dispatchEvent("org.ekstep.collectioneditorfunctions:save", {
            showNotification: true,
            callback: function(err, res) {
                if(res && res.data && res.data.responseCode == "OK") $scope.lastSaved = Date.now();
                $scope.$safeApply();
            }
        });
    };

    $scope.downloadContent = function() {
        ecEditor.dispatchEvent("download:content");
    };

    $scope.onNodeEvent = function(event, data) {
        $scope.disableSaveBtn = false;
        $scope.$safeApply();
    };

    $scope.telemetry = function(data) {
        org.ekstep.services.telemetryService.interact({ "type": 'click', "subtype": data.subtype, "target": data.target, "pluginid": plugin.id, "pluginver": plugin.ver, "objectid": ecEditor.getCurrentStage().id, "stage": ecEditor.getCurrentStage().id });
    };

    $scope.internetStatusFn = function(event) {
        $scope.$safeApply(function() {
            $scope.internetStatusObj.status = navigator.onLine;
        });
    };

    $scope.closeCollectionEdtr = function ()
    {
        if ($scope.disableSaveBtn === false)
        {
            window.parent.EkTextbookUI.unsavedChangesWarningForCollectionEditor();
            window.onbeforeunload = null;
        }
        else
        {
            //window.parent.jQuery('#default-collection-modal').iziModal('close');
            window.parent.location.reload();
        }
    };

    $scope.reportIssueLink = ((window.context && window.context.reportIssueLink) ? window.context.reportIssueLink : "");

    window.onbeforeunload = function(e) {
        if (!$scope.disableSaveBtn) return "You have unsaved changes";
        e.preventDefault();
    }
    window.addEventListener('online', $scope.internetStatusFn, false);
    window.addEventListener('offline', $scope.internetStatusFn, false);
    ecEditor.addEventListener("org.ekstep.collectioneditor:node:added", $scope.onNodeEvent, $scope);
    ecEditor.addEventListener("org.ekstep.collectioneditor:node:modified", $scope.onNodeEvent, $scope);
    ecEditor.addEventListener("org.ekstep.collectioneditor:node:removed", $scope.onNodeEvent, $scope);
    ecEditor.addEventListener("org.ekstep.collectioneditor:node:reorder", $scope.onNodeEvent, $scope);
}]);
