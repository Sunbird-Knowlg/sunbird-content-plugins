angular.module('org.ekstep.collectioneditor', ["Scope.safeApply"]).controller('mainController', ['$scope', '$location', function($scope, $location) {
    var ctrl = this;
    $scope.contentDetails = {
        contentTitle: "Untitled Content",
        contentImage: "/images/com_ekcontent/default-images/default-content.png",
        contentConcepts: "No concepts selected",
        contentType: ""
    };
    $scope.metadataPageRegistry = [];
    $scope.template = false;
    $scope.templateUrl = '';

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
            org.ekstep.collectioneditor.api.getService('collection').addTree([template]);                       
        }
    });

    $scope.loadMetaPage = function(eve){
        var templatePath = ecEditor.resolvePluginResource("org.ekstep.collectioneditormeta", "1.0", "editor/metadetails.html");
        var controllerPath = ecEditor.resolvePluginResource("org.ekstep.collectioneditormeta", "1.0", "editor/testbookmetaApp.js");
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath)
            .then(function() {
                $scope.template = true;
                $scope.templatePath = templatePath;
                $scope.$safeApply();
                ecEditor.dispatchEvent("org.ekstep.collectioneditormeta:setdata");
            }, function() {
                throw "unable to load controller :" + templatePath;
            });
    };
    ecEditor.addEventListener("org.ekstep.collectioneditor:collectioneditormeta", $scope.loadMetaPage);
    ecEditor.jQuery("#collection-tree").fancytree({
        click: function(event, data) {
            $scope.loadMetaPage();
        }
    });
}]);
//# sourceURL=collectiontreeApp.js