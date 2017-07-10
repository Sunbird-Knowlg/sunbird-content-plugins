angular.module('textbookmetaApp', []).controller('textbookmetaController', ['$scope', function($scope) {
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
        if(_.isString($scope.textbook.tags)){
            $scope.textbook.tags = $scope.textbook.tags.split(',');
        }
        var activeNode = org.ekstep.collectioneditor.collectionService.getActiveNode();
        org.ekstep.collectioneditor.collectionService.setNodeTitle($scope.textbook.name);
        $scope.unit.contentType = activeNode.data.objectType;
        org.ekstep.collectioneditor.cache.nodesModified[activeNode.data.id]["isNew"] = false;
        org.ekstep.collectioneditor.cache.nodesModified[activeNode.data.id]["root"] = true;
        org.ekstep.collectioneditor.cache.nodesModified[activeNode.data.id] = $scope.getUpdatedMetadata(activeNode.data.meta, $scope.textbook);
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
        if(_.isEmpty(activeNode.data.metadata) || _.isUndefined(activeNode.data.metadata)){
            $scope.textbook = {};
            $scope.editMode = true;
            $('.ui.dropdown').dropdown('refresh');
        }else{
            $scope.editMode = false;
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
    }

    $scope.setActiveNode = function(nodeId){
        org.ekstep.collectioneditor.collectionService.setActiveNode(nodeId);
    }
}]);
//# sourceURL=textbookmetaApp.js
