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

    $scope.excludeContents = [];
    $scope.metaData = {};
    $scope.responseData = {};
    $scope.suggestedContentList = {count:0, content:[]};
    var searchBody = {"request": {
                        "mode": "soft",
                        "filters":{},
                        "offset": 0,
                        "limit": 100
                         }
                    };
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
                //var collectionData = res.data.result.content;
                if(res.data.result.content.board && res.data.result.content.subject && res.data.result.content.gradeLevel) {
                    _.forEach(ecEditor.jQuery("#collection-tree").fancytree("getRootNode").children[0].children, function(content) {
                        if(!content.folder) $scope.excludeContents.push(content.data.id);
                    });
                    //$scope.metaData.board = res.data.result.content.board;
                    $scope.metaData.subject = res.data.result.content.subject;
                    if(res.data.result.content.language) $scope.metaData.language = res.data.result.content.language;
                    if(res.data.result.content.concepts) $scope.metaData.concepts = res.data.result.content.concepts;
                    //$scope.metaData.gradeLevel = res.data.result.content.gradeLevel;
                    //if(res.data.result.content.keywords) $scope.metaData.keywords = res.data.result.content.keywords;
                    //$scope.searchLessons();
                }

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
        //org.ekstep.services.collectionService.suggestVocabularyRequest.request.limit = ecEditor.getConfig('keywordsLimit')
    }

    $scope.parseKeywords = function(keywords){
        if(_.isString(keywords)){
            return JSON.parse(keywords);
        }else{
            return keywords;
        }
    }

    $scope.searchLessons = function(apiCallLevel) {
        var apiCall = apiCallLevel ? apiCallLevel : 1;
        var queryData = {};
        //queryData.board = $scope.metaData.board || "";
        queryData.subject = $scope.metaData.subject;
        //queryData.gradeLevel = $scope.metaData.gradeLevel || "";

        searchBody.request.filters = queryData;
        searchBody.request.filters.contentType = org.ekstep.collectioneditor.api.getService('collection').getObjectTypeByAddType('Browser');

        //Very First call, reads data from root node and strict checking
        if(apiCall === 1) {
            if(!$scope.metaData.language) {
                apiCall++;
                $scope.searchLessons();
            }

            $scope.suggestedContentList = { count:0, content:[] };
            searchBody.request.filters.language = $scope.metaData.language;
            if($scope.metaData.concepts) searchBody.request.filters.concepts = $scope.metaData.concepts;
            searchBody.request.softConstraints = { "gradeLevel": 100, "board": 90 };
        } else if(apiCall === 2) {
            if($scope.metaData.language) searchBody.request.filters.language = { "NE": $scope.metaData.language };
            if($scope.metaData.concepts) searchBody.request.filters.concepts = $scope.metaData.concepts;
            searchBody.request.softConstraints = { "gradeLevel": 100, "board": 90, "concepts": 80 };
        } else {
            if($scope.metaData.concepts) searchBody.request.filters.concepts = { "NE": $scope.metaData.concepts };
            searchBody.request.filters.language = $scope.metaData.language || "";
            searchBody.request.softConstraints = { "gradeLevel": 100, "language": 90, "board": 80 };
        }
        searchBody.request.filters.objectType = ["Content"];
        searchBody.request.filters.status = ["Live"];
        searchService.search(searchBody, function(err, res) {
            if (err) {
                console.err("Oops! Something went wrong. Please try again later.");
            } else {
                $scope.suggestedContentList.count = res.data.result.count;
                // $('.card-list').transition({
                //     animation  : 'pulse',
                //     duration   : '3s',
                // });
                if(apiCall === 1) $scope.responseData = res.data.result.content;
                angular.forEach(res.data.result.content, function(lessonContent) {
                    if($scope.excludeContents.length) {
                        if(_.indexOf($scope.excludeContents, lessonContent.identifier) < 0) $scope.suggestedContentList.content.push(lessonContent);
                    } else {
                        $scope.suggestedContentList.content.push(lessonContent);
                    }
                });
                $scope.suggestedContentList.content = _.uniqBy($scope.suggestedContentList.content, 'identifier');
                //$scope.responseData[JSON.stringify(searchBody.request)] = $scope.suggestedContentList.content;
                searchBody.request.filters = {};
                if($scope.suggestedContentList.content.length < 20 && apiCall === 1 || apiCall === 2) {
                    apiCall++;
                    $scope.searchLessons(apiCall);
                } else if(apiCall == 3) {
                    apiCall = 1;
                }
            }
            $scope.$safeApply();
        });
    }

    $scope.openResourceBrowser = function() {
        if($scope.suggestedContentList.count) {
            ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show", {
                filters: { 
                    //contentType: org.ekstep.collectioneditor.api.getService('collection').getObjectTypeByAddType('Browser'),
                    lessonType: org.ekstep.collectioneditor.api.getService('collection').getObjectTypeByAddType('Browser'),
                    language: $scope.metaData.language || "",
                    grade: $scope.metaData.gradeLevel || "",
                    //subject: $scope.metaData.subject
                },
                callback: function(err, res) {
                    console.log("RESULT", res);
                }
            });
        }
    }

    $scope.addContent = function(lesson, index) {
        org.ekstep.contenteditor.api.dispatchEvent("org.ekstep.collectioneditor:addContent", [lesson]);
        if (index > -1) $scope.suggestedContentList.content.splice(index, 1);
        $scope.excludeContents.push(lesson.identifier);
    }

    $scope.onNodeSelect = function() {
        if($scope.metaData.subject) {
            $scope.excludeContents = [];
            _.forEach(org.ekstep.services.collectionService.getActiveNode().children, function(content) {
                if(!content.folder) $scope.excludeContents.push(content.data.id);
            });
            if($scope.responseData.length > 20) {
                $scope.suggestedContentList.content = [];
                angular.forEach($scope.responseData, function(lessonContent) {
                    if(_.indexOf($scope.excludeContents, lessonContent.identifier) == -1) $scope.suggestedContentList.content.push(lessonContent);
                });
                if($scope.suggestedContentList.content.length < 20) $scope.searchLessons(1);
            } else {
                $scope.searchLessons(1);
            }
        }
    }

    $scope.updateMetaData = function() {
        _.forEach(org.ekstep.collectioneditor.api.getService('collection').getCollectionHierarchy().nodesModified, function(node) {
            if(node.root) {
                var metadataUpdate = false;
                if(node.metadata.subject && node.metadata.subject != $scope.metaData.subject) {
                    $scope.metaData.subject = node.metadata.subject;
                    metadataUpdate = true;
                }
                if(node.metadata.concepts && node.metadata.concepts != $scope.metaData.concepts) {
                    $scope.metaData.concepts = node.metadata.concepts;
                    metadataUpdate = true;
                }
                if(node.metadata.medium && node.metadata.concepts != $scope.metaData.concepts) {
                    $scope.metaData.language = node.metadata.medium;
                    metadataUpdate = true;
                }
                //if(node.metadata.board) $scope.metaData.board = node.metadata.board;
                //if(node.metadata.gradeLevel) $scope.metaData.gradeLevel = node.metadata.gradeLevel;
                if(metadataUpdate) $scope.searchLessons();
            } else {
                if(node.metadata.concepts && node.metadata.concepts != $scope.metaData.concepts) $scope.searchLessons();
            }
        });
    }

    ecEditor.addEventListener('org.ekstep.collectioneditor:contentchange', $scope.onNodeSelect);
    ecEditor.addEventListener('org.ekstep.collectioneditor:save', $scope.updateMetaData);
    $scope.init();
}]);
//# sourceURL=collectiontreeApp.js