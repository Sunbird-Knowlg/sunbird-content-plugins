angular.module('unitmetaApp', []).controller('unitmetaController', ['$scope', function($scope) {
    var ctrl = this;
    $scope.unit = {};
    $scope.gradeLevel = '';
    $scope.metadataCloneObj = {}; 
    // if(_.isEmpty(org.ekstep.collectioneditor.collectionService.getActiveNode().data.metadata) || _.isUndefined(org.ekstep.collectioneditor.collectionService.getActiveNode().data.metadata)){
    //     $scope.editMode = true;
    //     $scope.defaultImage = ecEditor.resolvePluginResource("org.ekstep.unitmeta", "1.0", "assets/default.png");
    // }else{
    //     $scope.editMode = false;
    // }

    org.ekstep.collectioneditor.api.getService('meta').getConfigOrdinals(function(err, resp) {
        if (!err) {
            $scope.gradeList = resp.data.result.ordinals.gradeLevel;
            $scope.languageList = resp.data.result.ordinals.language;
            $scope.audienceList = resp.data.result.ordinals.audience;
            $scope.$safeApply();
        }
    });
    
    ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
        element: 'conceptSelector',
        selectedConcepts: [], // All composite keys except mediaType
        callback: function(data) {
            $scope.unit.concepts = '(' + data.length + ') concepts selected';
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
                $scope.unit.appIcon = data.assetMedia.src;
                $scope.$safeApply();
            }
        });
    }
    
    $scope.saveNodeMetadata = function(){
        $scope.modifyArr = [];
        var activeNode = org.ekstep.collectioneditor.collectionService.getActiveNode();
        var oldValue = $scope.metadataCloneObj;
        org.ekstep.collectioneditor.collectionService.setNodeTitle($scope.unit.name);
        var newValue = $scope.unit;
        if(_.isEmpty(activeNode.data.metadata) || _.isUndefined(activeNode.data.metadata)){
            _.forEach(newValue, function(val, key){
                $scope.createModifyArray(activeNode, val, "", key);
            });
        }else{
            _.forEach(newValue, function(value, key){
                if(_.isUndefined(oldValue[key])){
                    $scope.createModifyArray(activeNode, value, "", key);
                }else if(value != oldValue[key]){
                    $scope.createModifyArray(activeNode, value, oldValue[key], key);
                }
            });
        }
        activeNode.data.metadata = $scope.unit;
        $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
        console.log('Modify ', $scope.modifyArr);
        $scope.$safeApply();
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

    $scope.setMetaformValues = function(){
        var activeNode = org.ekstep.collectioneditor.collectionService.getActiveNode();
        if(_.isEmpty(activeNode.data.metadata) || _.isUndefined(activeNode.data.metadata)){
            $scope.unit = {};
            $scope.metadataCloneObj = _.clone($scope.unit);
            $scope.editMode = true;
            $('.ui.dropdown').dropdown('refresh');
            $scope.defaultImage = ecEditor.resolvePluginResource("org.ekstep.unitmeta", "1.0", "assets/default.png");
        }else{
            $scope.editMode = false;
            $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
            $scope.unit = activeNode.data.metadata;
            $('#board').dropdown('set selected', $scope.unit.board);
            $('#medium').dropdown('set selected', $scope.unit.medium);
            $('#subject').dropdown('set selected', $scope.unit.subject);
            $('#grade').dropdown('set selected', $scope.unit.grade);
            $('#audience').dropdown('set selected', $scope.unit.audience);
        }
        $scope.$safeApply();
    }
    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected:TextBookUnit', $scope.setMetaformValues);
}]);
//# sourceURL=unitmetaApp.js
