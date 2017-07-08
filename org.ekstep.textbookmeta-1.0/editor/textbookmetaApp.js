angular.module('textbookmetaApp', []).controller('textbookmetaController', ['$scope', function($scope) {
    var ctrl = this;
    $scope.textbook = {};
    $scope.gradeLevel =  '';
    $scope.metadataCloneObj = $scope.path = {};
    $scope.mode = org.ekstep.collectioneditor.collectionService.getConfig().mode;
  
    org.ekstep.collectioneditor.api.getService('meta').getConfigOrdinals(function(err, resp) {
        if (!err) {
            $scope.gradeList = resp.data.result.ordinals.gradeLevel;
            $scope.languageList = resp.data.result.ordinals.language;
            $scope.audienceList = resp.data.result.ordinals.audience;
            $scope.$safeApply();
        }
    });
    
    ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
        element: 'textbookConceptSelector',
        selectedConcepts: [], // All composite keys except mediaType
        callback: function(data) {
            $scope.textbook.concepts = '(' + data.length + ') concepts selected';
            // $scope.concepts = _.map(data, function(concept) {
            //     return concept.id;
            // });
            $scope.$safeApply();
        }
    });


    $scope.showAssestBrowser = function(){
        ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
            type: 'image',
            search_filter: {}, // All composite keys except mediaType
            callback: function(data) { 
                $scope.textbook.appIcon = data.assetMedia.src;
                $scope.$safeApply();
            }
        });
    }
    
    $scope.updateNode = function(){
        $scope.modifyArr = [];
        var activeNode = org.ekstep.collectioneditor.collectionService.getActiveNode();
        org.ekstep.collectioneditor.collectionService.setNodeTitle($scope.textbook.name);
        org.ekstep.collectioneditor.cache.nodesModified[activeNode.data.id] = $scope.getUpdatedMetadata($scope.metadataCloneObj, $scope.textbook);
        //activeNode.data.metadata = $scope.textbook;
        $scope.metadataCloneObj = _.clone($scope.textbook);
        console.log('Modify '+activeNode.data.id, org.ekstep.collectioneditor.cache.nodesModified[activeNode.data.id]);
        $scope.$safeApply();
    }

    $scope.getUpdatedMetadata = function(originalMetadata, currentMetadata){
        var modifieddata = { metadata : {}};
        if(_.isEmpty(originalMetadata) || _.isUndefined(originalMetadata)){
            modifieddata["isNew"] = true;
            modifieddata["root"] = false;
            _.forEach(currentMetadata, function(value, key){
                modifieddata.metadata[key] = value;
            });
        }else{
            modifieddata["isNew"] = false;
            modifieddata["root"] = false;
            _.forEach(currentMetadata   , function(value, key){
                if(_.isUndefined(originalMetadata[key])){
                    modifieddata.metadata[key] = value;
                }else if(value != originalMetadata[key]){
                    modifieddata.metadata[key] = value;
                }
            });
        }
        return modifieddata;
    }

    $scope.createModifyArray = function(activeNode, newValue, oldValue, attribute){
        $scope.modifyArr.push({
            "ts": Date.now(), 
            "target": activeNode.data.id, 
            "action": "modify", 
            "parent": activeNode.parent.data.id,
            "attribute": attribute, 
            "oldValue": oldValue, 
            "newValue": newValue
        });
    }

    $scope.addlesson = function(){
        ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show");
    }

    $scope.onNodeSelect = function(evant, data){
        var nodeId = data.data.id;
        var nodeType = data.data.objectType;
        var editable = data.editable;
        $scope.defaultImage = ecEditor.resolvePluginResource("org.ekstep.textbookmeta", "1.0", "assets/default.png");

        if(_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[nodeId])) {
            org.ekstep.collectioneditor.cache.nodesModified[nodeId] = {};
        }
        var activeNode = org.ekstep.collectioneditor.collectionService.getActiveNode();
        if(_.isEmpty(activeNode.data.metadata) || _.isUndefined(activeNode.data.metadata)){
            $scope.textbook = {};
            $scope.metadataCloneObj = _.clone($scope.textbook);
            $scope.editMode = true;
            $('.ui.dropdown').dropdown('refresh');
        }else{
            $scope.editMode = false;
            $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
            $scope.textbook = activeNode.data.metadata;
            $('#board').dropdown('set selected', $scope.textbook.board);
            $('#medium').dropdown('set selected', $scope.textbook.medium);
            $('#subject').dropdown('set selected', $scope.textbook.subject);
            $('#gradeLevel').dropdown('set selected', $scope.textbook.gradeLevel);
            $('#audience').dropdown('set selected', $scope.textbook.audience);
        }
        $scope.getPath();
        $scope.$safeApply();
    }
    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected:TextBook', $scope.onNodeSelect);

    $scope.getPath = function() {
        var nodes = [];
        var path = ecEditor.jQuery("#collection-tree").fancytree("getTree").getActiveNode().getKeyPath();
        _.forEach(path.split('/'), function(key) {
            if(key){
                var node = ecEditor.jQuery("#collection-tree").fancytree("getTree").getNodeByKey(key);
                $scope.path = {
                    'title' : node.title,
                    'nodeId'  : node.key 
                }
            }
        });
        $scope.$safeApply();
    }

    $scope.setActiveNode = function(nodeId){
        org.ekstep.collectioneditor.collectionService.setActiveNode(nodeId);
    }
}]);
//# sourceURL=textbookmetaApp.js
