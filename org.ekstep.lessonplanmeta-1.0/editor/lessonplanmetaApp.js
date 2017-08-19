angular.module('lessonplanmetaApp', ['Scope.safeApply']).controller('lessonplanmetaController', ['$scope', function($scope) {    
    $scope.mode = ecEditor.getConfig('editorConfig').mode;
    $scope.metadataCloneObj = {};
    $scope.nodeId = $scope.nodeType = '';
    $scope.showImageIcon = true;
    $scope.boardList = {};
    $scope.gradeList = [];
    $scope.languageList = [];    
    $scope.subjectList = [];


    ecEditor.getService('meta').getConfigOrdinals(function(err, resp) {
        if (!err) {
            $scope.gradeList = resp.data.result.ordinals.gradeLevel;
            $scope.languageList = resp.data.result.ordinals.language;            
            $scope.subjectList = resp.data.result.ordinals.language;
            //TODO: Replace below list with API resplonse            
            $scope.boardList["CBSE"]  = "CBSE";
            $scope.boardList["NCERT"] = "NCERT";
            $scope.boardList["ICSE"] = "ICSE"
            $scope.boardList["MSCERT"] = "MSCERT";
            $scope.boardList["Other"] = "Others";
            $scope.$safeApply();                   
        }
    });

    $scope.showAssestBrowser = function(){
        ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
            type: 'image',
            search_filter: {}, // All composite keys except mediaType
            callback: function(data) { 
                $scope.lesson.appIcon = data.assetMedia.src;
                $scope.$safeApply();
            }
        });
    }

    $scope.initDropdown = function() {
        $('#lessonplan-board').dropdown('set selected', $scope.lesson.board);
        $('#lessonplan-medium').dropdown('set selected', $scope.lesson.medium);
        $('#lessonplan-subject').dropdown('set selected', $scope.lesson.subject);
        $('#lessonplan-gradeLevel').dropdown('set selected', $scope.lesson.gradeLevel);        
        $('#lessonplan-language').dropdown('set selected', $scope.lesson.language);    
    }
    
    $scope.updateNode = function(){
        if($scope.lessonMetaForm.$valid){ 
            if(_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) {
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId] = {};
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["isNew"] = $scope.newNode;
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["root"] = true;
            }            
            if(_.isString($scope.lesson.gradeLevel)){
                $scope.lesson.gradeLevel = [$scope.lesson.gradeLevel];
            }            
            if(_.isString($scope.lesson.language)){
                $scope.lesson.language = [$scope.lesson.language];
            }
            $scope.lesson.duration = $scope.duration ? $scope.duration.toString() : "0";
            $scope.lesson.learningObjective = $scope.learningObjective ? [$scope.learningObjective] : [];
            org.ekstep.collectioneditor.api.getService('collection').setNodeTitle($scope.lesson.name);
            $scope.lesson.contentType = $scope.nodeType;
            org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata = _.assign(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata , $scope.getUpdatedMetadata($scope.metadataCloneObj, $scope.lesson));
            $scope.metadataCloneObj = _.clone($scope.lesson);
            $scope.editMode = false;
            ecEditor.dispatchEvent('org.ekstep.collectioneditor:node:modified');
            $scope.getPath();
            $scope.$safeApply();
        }else{
            ecEditor.dispatchEvent("org.ekstep.toaster:warning", {
                title: 'Please fill in all required fields',
                position: 'topCenter',
                icon: 'fa fa-warning'
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
        if(_.isUndefined(metadata['name'])){
            metadata['name'] = originalMetadata['name'];
        }
        if(_.isUndefined(metadata['code'])){
            metadata['code'] = $scope.nodeId;
        }
        if(_.isUndefined(metadata['mimeType'])){
            metadata['mimeType'] = "application/vnd.ekstep.content-collection";
        }
        return metadata;
    }

    $scope.addlesson = function(){
        ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show");
    }

    $scope.onNodeSelect = function(evant, data){
        var selectedConcepts = [];
        $scope.showImageIcon = false;
        $scope.nodeId = data.data.id;
        $scope.nodeType = data.data.objectType;
        $scope.lesson = {};
        $scope.editMode = $scope.newNode = false;
        $scope.editable = org.ekstep.collectioneditor.api.getService('collection').getObjectType(data.data.objectType).editable;
        $scope.defaultImage = ecEditor.resolvePluginResource("org.ekstep.lessonplanmeta", "1.0", "assets/default.png");

        var activeNode = org.ekstep.collectioneditor.api.getService('collection').getActiveNode();
        $scope.lesson = (_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) ? activeNode.data.metadata : _.assign(activeNode.data.metadata, org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata);
        if($scope.mode === "Edit" && $scope.editable === true){
            $scope.editMode = true;
            $('.ui.dropdown').dropdown('refresh');
            $scope.metadataCloneObj = _.clone($scope.lesson);
        }
        if(!_.isEmpty(activeNode.data.metadata) && _.has(activeNode.data.metadata, ["name"]) && _.has(activeNode.data.metadata, ["description"])){
            $scope.editMode = false;
            $('#lessonplan-board').dropdown('set selected', $scope.lesson.board);
            $('#lessonplan-medium').dropdown('set selected', $scope.lesson.medium);
            $('#lessonplan-subject').dropdown('set selected', $scope.lesson.subject);
            $('#lessonplan-gradeLevel').dropdown('set selected', $scope.lesson.gradeLevel);            
            $('#lessonplan-language').dropdown('set selected', $scope.lesson.language);
            if(!_.isUndefined(activeNode.data.metadata.concepts)){
                $scope.lesson.concepts = activeNode.data.metadata.concepts;
                if($scope.lesson.concepts.length > 0){
                    $scope.lesson.conceptData = '(' + $scope.lesson.concepts.length + ') concepts selected';
                    _.forEach($scope.lesson.concepts, function(concept){
                        selectedConcepts.push(concept.identifier);
                    });
                }else{
                    $scope.lesson.conceptData = '';
                }
            }
            $scope.lesson.duration = activeNode.data.metadata.duration ? parseInt(activeNode.data.metadata.duration) : "0";
            if (activeNode.data.metadata.learningObjective) $scope.learningObjective = activeNode.data.metadata.learningObjective[0];
            $scope.duration = activeNode.data.metadata.duration;
            $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
        }else{
            $scope.newNode = true;
            $scope.learningObjective = undefined;
            $scope.duration = "0";
            $('#lessonplan-board').dropdown('clear');
            $('#lessonplan-medium').dropdown('clear');
            $('#lessonplan-subject').dropdown('clear');
            $('#lessonplan-gradeLevel').dropdown('clear');
            $('#lessonplan-language').dropdown('clear');
        }
        ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
            element: 'lessonConceptSelector',
            selectedConcepts: selectedConcepts,
            callback: function(data) {
                $scope.lesson.conceptData = '(' + data.length + ') concepts selected';
                $scope.lesson.concepts = _.map(data, function(concept) {
                    return { "identifier" : concept.id , "name" : concept.name} ;
                });
                $scope.$safeApply();
            }
        });
        $scope.showImageIcon = true;
        $scope.getPath();
        $scope.$safeApply();
    }
    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected:LessonPlan', $scope.onNodeSelect);

    $scope.getPath = function() {
        $scope.path = [];
        var path = ecEditor.jQuery("#collection-tree").fancytree("getTree").getActiveNode().getKeyPath();
        _.forEach(path.split('/'), function(key) {
            if(key){
                var node = ecEditor.jQuery("#collection-tree").fancytree("getTree").getNodeByKey(key);
                $scope.path.push({'title' : node.title, 'nodeId'  : node.key });
            }
        });
    }

    setTimeout(function(){
        ecEditor.jQuery('.popup-item').popup();
    },0);
    
    $scope.setActiveNode = function(nodeId){
        org.ekstep.collectioneditor.api.getService('collection').setActiveNode(nodeId);
    }

    $scope.generateTelemetry = function(data) {
        if (data) org.ekstep.services.telemetryService.interact({ "type": data.type, "subtype": data.subtype, "target": data.target, "pluginid": "org.ekstep.textbookmeta", "pluginver": "1.0", "objectid": $scope.nodeId, "stage": $scope.nodeId })
    }
}]);
//# sourceURL=lessonplanmetaApp.js
