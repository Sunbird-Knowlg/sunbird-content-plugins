angular.module('suggestcontentApp', []).controller('suggestcontentController', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.contentId = ecEditor.getContext('contentId');

    $scope.excludeContents = [];
    $scope.metaData = {};
    $scope.responseData = [];
    $scope.suggestedContentList = {count:0, content:[]};
    var searchBody = {"request": {
                        "mode": "soft",
                        "filters":{},
                        "offset": 0,
                        "limit": 100
                         }
                    };
    var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
    
    $scope.init = function() {
        var mode;
        if (ecEditor.getConfig('editorConfig').contentStatus === "draft") mode = "edit";
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getCollectionHierarchy({ contentId: $scope.contentId, mode: mode }, function(err, res) {
            if (res && res.data && res.data.responseCode === "OK") {
                if(res.data.result.content.subject) {
                    _.forEach(ecEditor.jQuery("#collection-tree").fancytree("getRootNode").children[0].children, function(content) {
                        if(!content.folder) $scope.excludeContents.push(content.data.id);
                    });

                    $scope.metaData.subject = res.data.result.content.subject;
                    if(res.data.result.content.language) $scope.metaData.language = (typeof res.data.result.content.language === 'object') ? res.data.result.content.language[0] : res.data.result.content.language;
                    if(res.data.result.content.concepts) {
                        $scope.metaData.concepts = [];
                        _.forEach(res.data.result.content.concepts, function(concept) {
                            $scope.metaData.concepts.push(concept.identifier)
                        });
                    }
                }
            }
        });
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
                if(res.data.result.content != undefined) {
                    $scope.responseData = _.concat($scope.responseData, res.data.result.content);
                    angular.forEach(res.data.result.content, function(lessonContent) {
                        if($scope.excludeContents.length) {
                            if(_.indexOf($scope.excludeContents, lessonContent.identifier) < 0) $scope.suggestedContentList.content.push(lessonContent);
                        } else {
                            $scope.suggestedContentList.content.push(lessonContent);
                        }
                    });
                    $scope.suggestedContentList.content = _.uniqBy($scope.suggestedContentList.content, 'identifier');
                }
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
            /*ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show", {
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
            }); */

            var query = {
                    request: {
                        lessonType: org.ekstep.collectioneditor.api.getService('collection').getObjectTypeByAddType('Browser'),
                        language: $scope.metaData.language || "",
                        grade: $scope.metaData.gradeLevel || "",
                        subject: $scope.metaData.subject
                    }
                }

            ecEditor.dispatchEvent('editor:invoke:viewall', {from:true, query})
            ecEditor.dispatchEvent('editor:invoke:viewall', { client: "org", que}) 
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
            if($scope.responseData && $scope.responseData.length > 20) {
                $scope.suggestedContentList.content = [];
                angular.forEach($scope.responseData, function(lessonContent) {
                    if(_.indexOf($scope.excludeContents, lessonContent.identifier) == -1) $scope.suggestedContentList.content.push(lessonContent);
                });
                if($scope.suggestedContentList.content.length < 20) $scope.searchLessons();
            } else {
                $scope.searchLessons();
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
                    $scope.metaData.concepts = [];
                    _.forEach(node.metadata.concepts, function(concept) {
                        $scope.metaData.concepts.push(concept.identifier);
                    });
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
                if(node.metadata.concepts && node.metadata.concepts != $scope.metaData.concepts) {
                    $scope.metaData.concepts = [];
                    _.forEach(node.metadata.concepts, function(concept) {
                        $scope.metaData.concepts.push(concept.identifier);
                    });
                    $scope.searchLessons();
                }
            }
        });
    }

    $scope.getCourseData = function(event, data) {
        if(data.length > 0 && $scope.metaData.concepts && !_.isEqual(data.sort(), $scope.metaData.concepts.sort())) {
            var temp = $scope.metaData.concepts;
            $scope.metaData.concepts = data;
            $scope.searchLessons();
            $scope.metaData.concepts = temp;
        } else {
            $scope.onNodeSelect();
        }
    }

    ecEditor.addEventListener('org.ekstep.collectioneditor:contentchange', $scope.onNodeSelect);
    ecEditor.addEventListener('org.ekstep.collectioneditor:save', $scope.updateMetaData);
    ecEditor.addEventListener('org.ekstep.collectioneditor:nodeselect', $scope.getCourseData, $scope);
    $scope.init();
}]);
//# sourceURL=suggestcontentApp.js
