angular.module('org.ekstep.genericeditor', ["Scope.safeApply"]).controller('mainController', ['$scope', '$location', function($scope, $location) {

    $scope.contentDetails = {
        contentTitle: ""
    };
    $scope.contentId = ecEditor.getContext('contentId');
    //Header scope starts
    $scope.headers = [];

    $scope.addToHeader = function(header) {
        $scope.headers.push(header);
        $scope.$safeApply();
    }

    org.ekstep.contenteditor.headerManager.initialize({ loadNgModules: $scope.loadNgModules, scope: $scope });

    //Header scope ends

    $scope.loadContent = function(callback) {        
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContent(org.ekstep.contenteditor.api.getContext('contentId'), function(err, res) {
            if (res && res.data && res.data.responseCode === "OK") {
                //TODO: handle success case
                $scope.$safeApply();
                callback && callback(err, res);
            } else {
                callback && callback('unable to fetch the content!', res);
            }
        });
    };


    $scope.telemetry = function(data) {
        org.ekstep.services.telemetryService.interact({ "type": 'click', "subtype": data.subtype, "target": data.target, "pluginid": "org.ekstep.collectioneditor", "pluginver": "1.0", "objectid": ecEditor.getCurrentStage().id, "stage": ecEditor.getCurrentStage().id });
    };    

    org.ekstep.genericeditor.api.initEditor(ecEditor.getConfig('editorConfig'), function() {
        $scope.loadContent(function(err, res) {
            if (res) {                
                // close the loading screen
                window.loading_screen && window.loading_screen.finish();
            } else {
                ecEditor.jQuery('.loading-message').remove();
                ecEditor.jQuery('.sk-cube-grid').remove();
                ecEditor.jQuery('.pg-loading-html').prepend('<p class="loading-message">Unable to fetch content! Please try again later</p><button class="ui red button" onclick="ecEditor.dispatchEvent(\'org.ekstep.collectioneditor:content:notfound\');"><i class="window close icon"></i>Close Editor!</button>');
            }
        });
    });
}]);
//# sourceURL=genericeditorApp.js