angular.module('suggestcontentApp', []).controller('suggestcontentController', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.contentId = ecEditor.getContext('contentId');
    $scope.excludeContents = [];
    $scope.metaData = {};
    $scope.responseData = [];
    $scope.suggestedContentList = {count:0, content:[]};
    var searchBody = {
                        "request": {
                            "mode": "soft",
                            "filters": {},
                            "offset": 0,
                            "limit": 100
                        }
                    };
    var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
    
    /* Initialisation */
    $scope.init = function() {
        _.forEach(ecEditor.jQuery("#collection-tree").fancytree("getRootNode").children[0].children, function(content) {
            if(!content.folder) $scope.excludeContents.push(content.data.id);
        });
        var rootNodeMetadata = ecEditor.jQuery("#collection-tree").fancytree("getRootNode").getFirstChild().data.metadata;
        $scope.metaData.subject = rootNodeMetadata.subject;
        if(rootNodeMetadata.language) $scope.metaData.language = (typeof rootNodeMetadata.language === 'object') ? rootNodeMetadata.language[0] : rootNodeMetadata.language;
        if(rootNodeMetadata.concepts) {
            $scope.metaData.concepts = [];
            _.forEach(rootNodeMetadata.concepts, function(concept) {
                $scope.metaData.concepts.push(concept.identifier)
            });
        }
        $scope.searchLessons();
    }

    $scope.generateTelemetry = function(data) {
        if (data) org.ekstep.services.telemetryService.interact({ "type": data.type, "subtype": data.subtype, "target": data.target, "pluginid": "org.ekstep.suggestcontent", "pluginver": "1.0", "objectid": ecEditor.getCurrentStage().id, "stage": ecEditor.getCurrentStage().id })
    }

    /* Search Lesson, takes parameters from the root node and currently selected node */
    $scope.searchLessons = function(apiCallLevel) {
        var apiCall = apiCallLevel ? apiCallLevel : 1;

        searchBody.request.filters = { "subject": $scope.metaData.subject };
        searchBody.request.filters.contentType = org.ekstep.collectioneditor.api.getService('collection').getObjectTypeByAddType('Browser');

        //Very First call, reads data from root node and strict checking
        if(apiCall === 1) {
            if(!$scope.metaData.language) {
                apiCall++;
                $scope.searchLessons();
            }

            $scope.suggestedContentList = { count:0, content:[] };
            $scope.responseData = [];
            searchBody.request.filters.language = $scope.metaData.language;
            if($scope.metaData.concepts) searchBody.request.filters.concepts = $scope.metaData.concepts;
            searchBody.request.softConstraints = { "gradeLevel": 100, "board": 90, "concepts": 80, "keywords": 70 };
        } else if(apiCall === 2) {
            if($scope.metaData.language) searchBody.request.filters.language = { "NE": $scope.metaData.language };
            if($scope.metaData.concepts) searchBody.request.filters.concepts = $scope.metaData.concepts;
            searchBody.request.softConstraints = { "gradeLevel": 100, "board": 90, "concepts": 80, "keywords": 70 };
        } else {
            if($scope.metaData.concepts) searchBody.request.filters.concepts = { "NE": $scope.metaData.concepts };
            searchBody.request.softConstraints = { "gradeLevel": 100, "language": 90, "board": 80, "concepts": 70, "keywords": 60 };
        }
        searchBody.request.filters.objectType = ["Content"];
        searchBody.request.filters.status = ["Live"];
        searchService.search(searchBody, function(err, res) {
            if (err) {
                console.err("Oops! Something went wrong. Please try again later.");
            } else {
                $scope.suggestedContentList.count = res.data.result.count;
                if(res.data.result.content != undefined) {
                    $scope.responseData = _.concat(_.uniqBy($scope.responseData, 'identifier'), res.data.result.content);
                    if(!$scope.suggestedContentList.content.length) {
                        $('.card-list').transition({
                        animation  : 'fade in',
                        duration   : '3s',
                        });
                    }
                    angular.forEach(res.data.result.content, function(lessonContent) {
                        /* Exclude Already Added content in the currently selected node */
                        if($scope.excludeContents.length) {
                            if(_.indexOf($scope.excludeContents, lessonContent.identifier) < 0) $scope.suggestedContentList.content.push(lessonContent);
                        } else {
                            $scope.suggestedContentList.content.push(lessonContent);
                        }
                    });

                    /*  Remove Duplicate contents from the list */
                    $scope.suggestedContentList.content = _.uniqBy($scope.suggestedContentList.content, 'identifier');
                }

                searchBody.request.filters = {};
                /* Increase the API call level */
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

    /* Open Resourse Browser with the Given query */
    $scope.openResourceBrowser = function() {
        if($scope.suggestedContentList.content.length) {
            var query = {
                    request: {
                        lessonType: org.ekstep.collectioneditor.api.getService('collection').getObjectTypeByAddType('Browser'),
                        language: $scope.metaData.language || "",
                        grade: $scope.metaData.gradeLevel || "",
                        subject: $scope.metaData.subject
                    }
                }

            ecEditor.dispatchEvent('editor:invoke:viewall', { from: true, query })
            ecEditor.dispatchEvent('editor:invoke:viewall', { client: "org", query}) 
        }
    }

    /* Adds content/collection to the currently selected node */
    $scope.addContent = function(lesson, index) {

        /* Add content in root node and unit node only, content inside content is not allowed */
        if(org.ekstep.services.collectionService.getActiveNode().folder) {
            org.ekstep.services.collectionService.addNode(lesson.contentType, lesson);

            if (index > -1) $scope.suggestedContentList.content.splice(index, 1);
            $scope.excludeContents.push(lesson.identifier);
        } else {
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: "Sorry, this operation is not allowed.",
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
        }
    }

    /* Returns list of content or makes new API if contents are not available */
    $scope.onNodeSelect = function() {
        if($scope.metaData.subject) {
            $scope.excludeContents = [];

            /* Fetch the added node for the currently selected node */
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

    /* Call when user changes metadata */
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

                if(node.metadata.medium && node.metadata.medium != $scope.metaData.language) {
                    $scope.metaData.language = node.metadata.medium;
                    metadataUpdate = true;
                }

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

    ecEditor.addEventListener('org.ekstep.collectioneditor:nodechange', $scope.onNodeSelect);
    ecEditor.addEventListener('org.ekstep.collectioneditor:save', $scope.updateMetaData);
    $scope.init();
}]);
//# sourceURL=suggestcontentApp.js
