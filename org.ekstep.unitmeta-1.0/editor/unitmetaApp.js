angular.module('unitmetaApp', []).controller('unitmetaController', ['$scope', function($scope) {
    $scope.mode = org.ekstep.collectioneditor.api.getService('collection').getConfig().mode;
    $scope.metadataCloneOb = {};
    $scope.nodeId = $scope.nodeType = '';
    ecEditor.getService('meta').getConfigOrdinals(function(err, resp) {
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
        if($scope.unitMetaForm.$valid){ 
            if(_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) {
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId] = {};
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["isNew"] = $scope.newNode;
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["root"] = false;
            }
            if(_.isString($scope.unit.keywords)){
                $scope.unit.keywords = $scope.unit.keywords.split(',');
            }
            $scope.unit.contentType = $scope.nodeType;
            org.ekstep.collectioneditor.api.getService('collection').setNodeTitle($scope.unit.name);
            org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata = _.assign(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata , $scope.getUpdatedMetadata($scope.metadataCloneObj, $scope.unit));;
            $scope.metadataCloneObj = _.clone($scope.unit);
            $scope.editMode = false;
            $scope.$safeApply();
        }else{
            iziToast.warning({
                message: 'Please fill in all required fields',
                position: 'topCenter'
            });
            $scope.submitted = true; 
        }
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

    $scope.addlesson = function(){
        ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show");
    }

    $scope.onNodeSelect = function(evant, data){
        var selectedConcepts = [];
        $scope.nodeId = data.data.id;
        $scope.nodeType = data.data.objectType;
        $scope.unit = {};
        $scope.editMode = $scope.newNode = false;
        $scope.editable = org.ekstep.collectioneditor.api.getService('collection').getObjectType(data.data.objectType).editable;
        $scope.defaultImage = ecEditor.resolvePluginResource("org.ekstep.unitmeta", "1.0", "assets/default.png");

        var activeNode = org.ekstep.collectioneditor.api.getService('collection').getActiveNode();
        $scope.unit = (_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) ? activeNode.data.metadata : _.assign(activeNode.data.metadata, org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata);
        if($scope.mode === "Edit" && $scope.editable === true){
            $scope.editMode = true;
            $('.ui.dropdown').dropdown('refresh');
            $scope.metadataCloneObj = _.clone($scope.unit);
        }
        if(!_.isEmpty(activeNode.data.metadata)){
            $scope.editMode = false;
            $('#unitBoard').dropdown('set selected', $scope.unit.board);
            $('#unitMedium').dropdown('set selected', $scope.unit.medium);
            $('#unitSubject').dropdown('set selected', $scope.unit.subject);
            $('#unitGradeLevel').dropdown('set selected', $scope.unit.gradeLevel);
            $('#unitAudience').dropdown('set selected', $scope.unit.audience);
            if(!_.isUndefined(activeNode.data.metadata.concepts)){
                $scope.unit.concepts = activeNode.data.metadata.concepts;
                $scope.unit.conceptData = '(' + $scope.unit.concepts.length + ') concepts selected';
                if($scope.unit.concepts.length > 0){
                    _.forEach($scope.unit.concepts, function(concept){
                        selectedConcepts.push(concept.identifier);
                    });
                }
            }
            $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
        }else{
            $scope.newNode = true;
        }
        ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
            element: 'unitConceptSelector',
            selectedConcepts: selectedConcepts,
            callback: function(data) {
                $scope.unit.conceptData = '(' + data.length + ') concepts selected';
                $scope.unit.concepts = _.map(data, function(concept) {
                    return { "identifier" : concept.id , "name" : concept.name} ;
                });
                $scope.$safeApply();
            }
        });
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
        org.ekstep.collectioneditor.api.getService('collection').setActiveNode(nodeId);
    }

    $scope.generateTelemetry = function(data) {
        if (data) org.ekstep.services.telemetryService.interact({ "type": data.type, "subtype": data.subtype, "target": data.target, "pluginid": "org.ekstep.unitmeta", "pluginver": "1.0", "objectid": $scope.nodeId, "stage": $scope.nodeId })
    }
}]);
//# sourceURL=unitmetaApp.js
