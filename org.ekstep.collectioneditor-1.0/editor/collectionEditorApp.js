angular.module('org.ekstep.collectioneditor', ["Scope.safeApply"]).controller('mainController', ['$scope', '$location', function($scope, $location) {
    var ctrl = this;
    $scope.contentDetails = {
        contentTitle: "Untitled Content",
        contentImage: "/images/com_ekcontent/default-images/default-content.png",
        contentConcepts: "No concepts selected",
        contentType: ""
    };
    $scope.metaPages = [];
    $scope.selectedObjectType = undefined;

    $scope.setSelectedNode = function(event, data) {
        if (data.data.objectType) {
            $scope.selectedObjectType = data.data.objectType
            $scope.$safeApply();
        }
    }

    $scope.contentId = $location.search().contentId;
    if (_.isUndefined($scope.contentId)) {
        $scope.contentId = ((window.context && window.context.content_id) ? window.context.content_id : undefined)
    }

    //TODO: get config and data from environment
    var config = { "levels": 4, "mode": "edit/read", "objectTypes": ["TextBook", "TextBookUnit", "Collection", "Content"], "defaultTemplate": { "title": "Untitled TextBook", "objectType": "TextBook", "metadata": {}, "children": [] }, "rules": { "definition": { "TextBook": { "root": true, "childrenTypes": ["TextBookUnit", "Collection"], "additionalConfig": {} }, "TextBookUnit": { "root": false, "childrenTypes": ["TextBookUnit", "Collection", "Content"], "additionalConfig": {} }, "Collection": { "root": false, "childrenTypes": [], "additionalConfig": {} }, "Content": { "root": false, "childrenTypes": [], "additionalConfig": {} } } }, "labels": { "TextBook": "Text book", "TextBookUnit": "Unit", "Collection": "Collection", "Content": "Content" } }
    var data = undefined;

    org.ekstep.collectioneditor.api.initEditor(config, function() {
        if (data) {
            org.ekstep.collectioneditor.api.getService('collection').addTree(data);
        } else {
            var template = _.clone(org.ekstep.collectioneditor.api.getService('collection').getConfig().defaultTemplate);
            template.folder = true;
            template.root = true;
            template.id = UUID();
            org.ekstep.collectioneditor.api.getService('collection').addTree([template]);                       
        }
        $scope.metaPages = org.ekstep.collectioneditor.metaPageManager.getPages();
    });

    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.setSelectedNode, $scope);
}]);
//# sourceURL=collectiontreeApp.js