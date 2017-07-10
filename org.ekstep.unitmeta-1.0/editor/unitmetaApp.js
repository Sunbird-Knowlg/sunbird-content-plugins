angular.module('unitmetaApp', []).controller('unitmetaController', ['$scope', function($scope) {
    $scope.mode = org.ekstep.collectioneditor.collectionService.getConfig().mode;

    org.ekstep.collectioneditor.api.getService('meta').getConfigOrdinals(function(err, resp) {
        if (!err) {
            $scope.gradeList = resp.data.result.ordinals.gradeLevel;
            $scope.languageList = resp.data.result.ordinals.language;
            $scope.audienceList = resp.data.result.ordinals.audience;
            //TODO: Replace below list with API resplonse
            $scope.boardList = {};
            $scope.boardList["CBSE"]  = "CBSE";
            $scope.boardList["NCERT"] = "NCERT";
            $scope.boardList["ICSE"] = "ICSE"
            $scope.boardList["MSCERT"] = "MSCERT";
            $scope.boardList["Other"] = "Othres";
          
            $scope.subjectList = {};
            $scope.subjectList["Maths"]  = "Maths";
            $scope.subjectList["English"] = "English";
            $scope.subjectList["Hindi"] = "Hindi"
            $scope.subjectList["Bengali"] = "Bengali";
            $scope.subjectList["Telugu"] = "Telugu";
            $scope.subjectList["Tamil"] = "Tamil";
            $scope.subjectList["Kannada"] = "Kanada";
            $scope.subjectList["Marathi"] = "Marathi";
            $scope.$safeApply();
        }
    });
    
    ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
        element: 'unitConceptSelector',
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
    
    $scope.updateNode = function(){
        $scope.modifyArr = [];
        if(_.isString($scope.unit.tags)){
            $scope.unit.tags = $scope.unit.tags.split(',');
        }
        var activeNode = org.ekstep.collectioneditor.collectionService.getActiveNode();
        $scope.unit.contentType = activeNode.data.objectType;
        org.ekstep.collectioneditor.collectionService.setNodeTitle($scope.unit.name);
        org.ekstep.collectioneditor.cache.nodesModified[activeNode.data.id]["isNew"] = _.isEmpty(activeNode.data.metadata) ? true : false;
        org.ekstep.collectioneditor.cache.nodesModified[activeNode.data.id]["root"] = false;
        org.ekstep.collectioneditor.cache.nodesModified[activeNode.data.id].metadata = _.assign(org.ekstep.collectioneditor.cache.nodesModified[activeNode.data.id].metadata , $scope.getUpdatedMetadata(activeNode.data.meta, $scope.unit));;
        $scope.$safeApply();
    }

    $scope.getUpdatedMetadata = function(originalMetadata, currentMetadata){
        var metadata = { };
        if(_.isEmpty(originalMetadata)){
            _.forEach(currentMetadata, function(value, key){
                metadata[key] = value;
            });
        }else{
            _.forEach(currentMetadata   , function(value, key){
                if(_.isUndefined(originalMetadata[key])){
                    metadata[key] = value;
                }else if(value != originalMetadata[key]){
                    metadata[key] = value;
                }
            });
        }
        return metadata;
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
        if(_.isEmpty(activeNode.data.metadata) && _.isEmpty(org.ekstep.collectioneditor.cache.nodesModified[nodeId].metadata)){
            $scope.unit = {};
            $scope.editMode = true;
            $('.ui.dropdown').dropdown('refresh');
        }else{
            $scope.editMode = false;
            $scope.unit = _.assign(activeNode.data.metadata, org.ekstep.collectioneditor.cache.nodesModified[nodeId].metadata);
            $('#unitBoard').dropdown('set selected', $scope.unit.board);
            $('#unitMedium').dropdown('set selected', $scope.unit.medium);
            $('#unitSubject').dropdown('set selected', $scope.unit.subject);
            $('#unitGradeLevel').dropdown('set selected', $scope.unit.gradeLevel);
            $('#unitAudience').dropdown('set selected', $scope.unit.audience);
        }
        $scope.getPath();
        $scope.$safeApply();
    }
    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected:TextBookUnit', $scope.onNodeSelect);

    $scope.getPath = function() {
        $scope.path = [];
        var path = ecEditor.jQuery("#collection-tree").fancytree("getTree").getActiveNode().getKeyPath();
        _.forEach(path.split('/'), function(key) {
            if(key){
                var node = ecEditor.jQuery("#collection-tree").fancytree("getTree").getNodeByKey(key);
                $scope.path.push({'title' : node.title, 'nodeId'  : node.key })
            }
        });
    }

    $scope.setActiveNode = function(nodeId){
        org.ekstep.collectioneditor.collectionService.setActiveNode(nodeId);
    }
}]);
//# sourceURL=unitmetaApp.js
