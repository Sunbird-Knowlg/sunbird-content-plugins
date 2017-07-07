angular.module('org.ekstep.collectioneditor', ["Scope.safeApply"]).controller('mainController', ['$scope', '$location', function($scope, $location) {
    //TODO: get config and data from environment
    var config = { "context": { "uid": "386", "contentId": "do_112272630392659968130", "sid": "0d5b94c87052869b58e47ec692f467cd", "channel": "ntp/ap", "pdata": { "id": "SunbirdPortal", "ver": "1.0" }, "dims": ["b27e743b51a22b4eed737c6a72cd4266"] }, "mode": "Edit", "rules": { "levels": 3, "objectTypes": [{ "type": "TextBook", "label": "Textbook", "isRoot": true, "editable": true, "childrenTypes": ["TextBookUnit"], "addType": "Editor", "iconClass": "fa fa-book fa-2" }, { "type": "TextBookUnit", "label": "Textbook Unit", "isRoot": false, "editable": true, "childrenTypes": ["TextBookUnit", "Collection", "Content"], "addType": "Editor", "iconClass": "fa fa-folder fa-2" }, { "type": "Collection", "label": "Collection", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file fa-2" }, { "type": "Content", "label": "Content", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file fa-2" }] }, "defaultTemplate": {} };

    $scope.contentDetails = {
        contentTitle: "Untitled Content",
        contentImage: "/images/com_ekcontent/default-images/default-content.png",
    };
    $scope.contentId = config.context.contentId;
    $scope.metaPages = [];
    $scope.selectedObjectType = undefined;

    $scope.setSelectedNode = function(event, data) {
        if (data.data.objectType) {
            $scope.selectedObjectType = data.data.objectType
            $scope.$safeApply();
        }
    };

    $scope.loadContent = function(callback) {
        org.ekstep.services.languageService.getCollectionHierarchy({ contentId: $scope.contentId }, function(err, res) {
            if (res && res.data && res.data.responseCode === "OK") {
                org.ekstep.collectioneditor.collectionService.fromCollection(res.data.result.content);
                callback && callback(err, res);
            } else {
                callback && callback('unable to fetch the content!', res);
            }
        });
    }

    org.ekstep.collectioneditor.api.initEditor(config, function() {
        $scope.loadContent();
        $scope.metaPages = org.ekstep.collectioneditor.metaPageManager.getPages();
    });

    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.setSelectedNode, $scope);
}]);
//# sourceURL=collectiontreeApp.js
