angular.module('collectioneditormetaApp', []).controller('collectioneditormetaController', ['$scope', function($scope) {
    var ctrl = this;
    $scope.textbook = {
        "board"     : "cbse",
        "medium"    : "eng",
        "subject"   : "maths",
        "grade"     : "kg",
        "audience"  : "learner",
    };
    $scope.metadataCloneObj = {}; 

    $scope.showAssestBrowser = function(){
        ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
            type: 'image',
            search_filter: {}, // All composite keys except mediaType
            callback: function(data) { 
                console.log('data ', data);
                $scope.textbook.image = data.assetMedia.src;
                $scope.$safeApply();
            }
        });
    }
    $scope.showConceptSelector = function(){

    }
    ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
        element: 'conceptSelector',
        selectedConcepts: [], // All composite keys except mediaType
        callback: function(data) {
            $scope.textbook.concepts = '(' + data.length + ') concepts selected';
            // $scope.concepts = _.map(data, function(concept) {
            //     return concept.id;
            // });
            $scope.$safeApply();
        }
    });
    $scope.saveNodeMetadata = function(){
        $scope.modifyArr = [];
        var activeNode = org.ekstep.collectioneditor.collectionService.getActiveNode();
        var oldValue = $scope.metadataCloneObj;
        //activeNode.setTitle($scope.textbook.name);
        var newValue = $scope.textbook;
        if(_.isEmpty(activeNode.data.metadata) || _.isUndefined(activeNode.data.metadata)){
            _.forEach(newValue, function(val, key){
                $scope.modifyArr.push({
                    "ts": Date.now(), 
                    "target": activeNode.key, 
                    "action": "modify", 
                    "parent": activeNode.key, 
                    "attribute": key, 
                    "oldValue": "", 
                    "newValue": val
                });
            });
        }else{
            _.forEach(newValue, function(value, key){
                if(_.isUndefined(oldValue[key])){
                    $scope.modifyArr.push({
                        "ts": Date.now(), 
                        "target": activeNode.key, 
                        "action": "modify", 
                        "parent": activeNode.key, 
                        "attribute": key, 
                        "oldValue": "", 
                        "newValue": value
                    });
                }else if(value != oldValue[key]){
                    $scope.modifyArr.push({
                        "ts": Date.now(), 
                        "target": activeNode.key, 
                        "action": "modify", 
                        "parent": activeNode.key, 
                        "attribute": key, 
                        "oldValue": oldValue[key], 
                        "newValue": value
                    });
                }
            });
        }
        activeNode.data.metadata = $scope.textbook;
        $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
        console.log('Modify ', $scope.modifyArr);
    }

    $scope.createModifyArray = function(newValue, oldValue){
        var val = {
            "ts" :Date.now(),
            "target" : newValue.name,
            "action" :"modify",
            "parent" : newValue.name,
            "attribute" :"name",
            "oldValue" :"",
            "newValue" :"Test chapter"
        };
        $scope.modifyArr.push(val);
    }

    $scope.addlesson = function(){
        ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show");
    }

    $scope.setMetaformValues = function(){
        var activeNode = org.ekstep.collectioneditor.collectionService.getActiveNode();
        if(_.isEmpty(activeNode.data.metadata) || _.isUndefined(activeNode.data.metadata)){
            $scope.textbook = {
                "board"     : "cbse",
                "medium"    : "eng",
                "subject"   : "maths",
                "grade"     : "kg",
                "audience"  : "learner",
                "image"     : ""
            };
            $scope.metadataCloneObj = _.clone($scope.textbook);
        }else{
            $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
            $scope.textbook = activeNode.data.metadata;
        }
        $scope.$safeApply();
    }
    ecEditor.addEventListener("org.ekstep.collectioneditormeta:setdata", $scope.setMetaformValues);
}]);
//# sourceURL=textbookmetaApp.js
