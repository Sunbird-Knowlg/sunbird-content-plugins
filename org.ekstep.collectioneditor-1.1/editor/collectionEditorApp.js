angular.module('org.ekstep.collectioneditor', ["Scope.safeApply"]).controller('mainController', ['$scope', '$location', function($scope, $location) {
    //do_112272630392659968130
    $scope.contentDetails = {
        contentTitle: ""
    };
    $scope.contentId = ecEditor.getContext('contentId');
    $scope.metaPages = [];
    $scope.selectedObjectType = undefined;
    $scope.nodeFilter = "";
    $scope.expandNodeFlag = true;
    $scope.getObjectType = function(objectType) {
        return _.find(objectType, function(type) {
            return type == $scope.selectedObjectType
        });
    }

    var limit = 100;
    var offset = 0;
    $scope.excludeContents = [];
    $scope.collectionData = [];
    $scope.suggestedContentList = {count:0, content:[]};
    var searchBody = {"request": {
                        "filters":{
                           "objectType": ["Content"],
                           "contentType": ["Collection", "Content"],
                           "status": ["Live"]
                        }
                    }};
    var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);

    $scope.searchNode = function(event) {
        if (event.target.value == "") org.ekstep.services.collectionService.clearFilter();
        org.ekstep.services.collectionService.filterNode(event.target.value);
    };

    $scope.setSelectedNode = function(event, data) {
        if (data.data.objectType) {
            $scope.selectedObjectType = data.data.objectType
            $scope.$safeApply();
        }
    };
    //Header scope starts
    $scope.headers = [];

    $scope.addToHeader = function(header) {
        $scope.headers.push(header);
        $scope.$safeApply();
    }

    org.ekstep.contenteditor.headerManager.initialize({ loadNgModules: $scope.loadNgModules, scope: $scope });

    //Header scope ends

    $scope.loadContent = function(callback) {
        var mode;
        if (ecEditor.getConfig('editorConfig').contentStatus === "draft") mode = "edit";
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getCollectionHierarchy({ contentId: $scope.contentId, mode: mode }, function(err, res) {
            if (res && res.data && res.data.responseCode === "OK") {
                org.ekstep.services.collectionService.fromCollection(res.data.result.content);
                $scope.collectionData = res.data.result.content;
                _.forEach(ecEditor.jQuery("#collection-tree").fancytree("getRootNode").children[0].children, function(content) {
                    $scope.excludeContents.push(content.data.id);
                });
                var frameworkId = ecEditor.getContext('framework') || org.ekstep.services.collectionService.defaultFramwork;
                ecEditor.getService('meta').getCategorys(frameworkId, function(cateerr, cateresp) {
                    if (!cateerr) {
                        _.forEach(cateresp.data.result.framework.categories, function(category){
                            org.ekstep.services.collectionService.categoryList[category.name] = category;
                        });
                        $scope.metaPages = org.ekstep.collectioneditor.metaPageManager.getPages();
                        $scope.$safeApply();
                        callback && callback(err, res);
                    }else{
                        callback && callback('unable to fetch categories!', cateresp);
                    }
                });
            } else {
                callback && callback('unable to fetch the content!', res);
            }
        });
    };

    $scope.expandNode = function() {
        ecEditor.getService(ServiceConstants.COLLECTION_SERVICE).expandAll($scope.expandNodeFlag);
        $scope.expandNodeFlag = !($scope.expandNodeFlag);
        setTimeout(function() {
            ecEditor.jQuery('.popup-item').popup();
        }, 0);
    };

    $scope.telemetry = function(data) {
        org.ekstep.services.telemetryService.interact({ "type": 'click', "subtype": data.subtype, "target": data.target, "pluginid": "org.ekstep.collectioneditor", "pluginver": "1.1", "objectid": ecEditor.getCurrentStage().id, "stage": ecEditor.getCurrentStage().id });
    };
    
    org.ekstep.collectioneditor.api.initEditor(ecEditor.getConfig('editorConfig'), function() {
        $scope.loadContent(function(err, res) {
            if (res) {
                var activeNode = org.ekstep.services.collectionService.getActiveNode();
                $scope.contentDetails.contentTitle = activeNode.title ? activeNode.title : "Untitled Content";
                // if (!_.isUndefined(activeNode.data.metadata.appIcon)) {
                //     $scope.contentDetails.contentImage = activeNode.data.metadata.appIcon;
                // }
                setTimeout(function() {
                    ecEditor.dispatchEvent('org.ekstep.collectioneditor:node:selected', activeNode);
                    ecEditor.dispatchEvent('org.ekstep.collectioneditor:node:selected:' + activeNode.data.objectType, activeNode);
                    ecEditor.dispatchEvent("org.ekstep.collectioneditor:content:load");
                }, 200);
                // close the loading screen
                window.loading_screen && window.loading_screen.finish();
            } else {
                ecEditor.jQuery('.loading-message').remove();
                ecEditor.jQuery('.sk-cube-grid').remove();
                ecEditor.jQuery('.pg-loading-html').prepend('<p class="loading-message">Unable to fetch content! Please try again later</p><button class="ui red button" onclick="ecEditor.dispatchEvent(\'org.ekstep.collectioneditor:content:notfound\');"><i class="window close icon"></i>Close Editor!</button>');
            }
        });
    });

    $scope.addNodeType = function(nodeType) {
        if (nodeType == 'sibling') {
            org.ekstep.services.collectionService.addSibling()
        }
        if (nodeType == 'child') {
            org.ekstep.services.collectionService.addChild()
        }
    }


    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.setSelectedNode, $scope);


    $scope.init = function(){
        org.ekstep.services.collectionService.suggestVocabularyRequest.request.limit = ecEditor.getConfig('keywordsLimit')
    }

    $scope.parseKeywords = function(keywords){
        if(_.isString(keywords)){
            return JSON.parse(keywords);
        }else{
            return keywords;
        }
    }

    $scope.searchLessons = function() {
        searchBody.request.limit = limit;
        searchBody.request.offset = offset;
        searchBody.request.filters.contentType = org.ekstep.collectioneditor.api.getService('collection').getObjectTypeByAddType('Browser');
        // _.forEach(ecEditor.jQuery("#collection-tree").fancytree("getRootNode").children[0].children, function(content) {
        //     $scope.excludeContents.push(content.data.id);
        // });
        searchService.search(searchBody, function(err, res) {
            if (err) {
                console.log("Oops! Something went wrong. Please try again later.");
            } else {
                $scope.suggestedContentList = {count:0, content:[]};
                $scope.suggestedContentList.count = res.data.result.count;
                $('.card-list')
                        .transition({
                            animation  : 'pulse',
                            duration   : '3s',
                        });
                angular.forEach(res.data.result.content, function(lessonContent) {
                    if($scope.excludeContents.length) {
                        if(_.indexOf($scope.excludeContents, lessonContent.identifier) == -1) $scope.suggestedContentList.content.push(lessonContent);
                        console.log("content", lessonContent)
                        console.log("collectionData", $scope.collectionData);
                    } else {
                        $scope.suggestedContentList.content.push(lessonContent);
                    }
                });
            }
            $scope.$safeApply();
        });
    }

    $scope.openResourceBrowser = function() {
        ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show", {
            filters: { lessonType: ["Resource"] },
            callback: function(err, res) {
                console.log("RESULT", res);
            }
        });
    }

    $scope.selectContent = function(lesson) {
        $scope.selectedContents.push(lesson);
        console.log("called", lesson);
    }

    $scope.addContent = function(lesson, index) {
        org.ekstep.contenteditor.api.dispatchEvent("org.ekstep.collectioneditor:addContent", [lesson]);
        if (index > -1) $scope.suggestedContentList.content.splice(index, 1);
        $scope.excludeContents.push(lesson.identifier);
    }

    $scope.init();
    $scope.searchLessons();
}]);
//# sourceURL=collectiontreeApp.js