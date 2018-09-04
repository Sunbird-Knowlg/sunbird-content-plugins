angular.module('suggestcontentApp', []).controller('suggestcontentController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.contentId = ecEditor.getContext('contentId');
    var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest('org.ekstep.suggestcontent');
    $scope.defaultImage = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "assets/default.png");
    $scope.excludeContents = [];
    $scope.metaData = {};
    $scope.responseData = [];
    $scope.mode = ecEditor.getConfig('editorConfig').mode;
    var pickerArray = ['gradeLevel', 'board', 'subject', 'medium', 'concepts'];
    $scope.suggestedContentList = {
        count: 0,
        content: []
    };
    var searchBody = {
        "request": {
            "mode": "soft",
            "filters": {
                objectType: ["Content"],
                status: ["Live"]
            },
            "offset": 0,
            "limit": 100
        }
    };
    var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);

    /* Initialisation */
    $scope.init = function () {
        _.forEach(ecEditor.jQuery("#collection-tree").fancytree("getRootNode").children[0].children, function (content) {
            if (!content.folder) $scope.excludeContents.push(content.data.id);
        });
        var rootNodeMetadata = ecEditor.jQuery("#collection-tree").fancytree("getRootNode").getFirstChild().data.metadata;
        Object.assign($scope.metaData,
            _.pick(rootNodeMetadata, ['name', 'description', 'board', 'subject', 'gradeLevel']),
            (rootNodeMetadata.medium && _.isArray(rootNodeMetadata.medium) ? {
                medium: _.first(rootNodeMetadata.medium)
            } : {
                medium: rootNodeMetadata.medium
            }),
            (rootNodeMetadata.concepts) ? {
                concepts: _.forEach(rootNodeMetadata.concepts, function (concept) {
                    $scope.metaData.concepts.push(concept.identifier)
                })
            } : {});
    }


    $scope.generateTelemetry = function (data) {
        if (data) org.ekstep.services.telemetryService.interact({
            "type": data.type,
            "subtype": data.subtype,
            "target": data.target,
            "pluginid": manifest.id,
            "pluginver": manifest.ver,
            "objectid": ecEditor.getCurrentStage().id,
            "stage": ecEditor.getCurrentStage().id
        })
    }
    /* HashKey to store suggestion responses to avoid api call */
    $scope.setMetaResponseHash = function (meta) {
        var objPick = _.values(_.pick(meta, pickerArray));

        var flatObj = _.flattenDeep(objPick).join('').toLowerCase();
        var hash = 0,
            len = flatObj.length;
        for (var i = 0; i < len; i++) {
            hash = ((hash >> 5) + hash) + flatObj.charCodeAt(i);
            hash |= 0;
        }
        return "hash" + hash;
    }

    $scope.searchLessons = function () {
        Object.assign(searchBody.request.filters,
            _.pick($scope.metaData, pickerArray), {
                contentType: org.ekstep.collectioneditor.api.getService('collection').getObjectTypeByAddType('Browser')
            }
        )
        $scope.suggestedContentList = {
            count: 0,
            content: []
        };
        var concepts = "";

        if ($scope.metaData) {
            concepts = $scope.setMetaResponseHash($scope.metaData)
        } else if (searchBody.request.filters.concepts) {
            concepts = "No_Concepts";
            delete searchBody.request.filters.concepts;
        }
        ecEditor.jQuery('#suggestions-loader').dimmer('show');

        if ($scope.responseData[concepts]) {
            if (!$scope.suggestedContentList.content.length) {
                $('.card-list').transition({
                    animation: 'fade in',
                    duration: '2s',
                });
            }
            _.forEach($scope.responseData[concepts], function (lessonContent) {
                if (_.indexOf($scope.excludeContents, lessonContent.identifier) == -1)
                    $scope.suggestedContentList.content.push(lessonContent);
            });
            setTimeout(function () {
                ecEditor.jQuery('#suggestions-loader').dimmer('hide');
            }, 2000);
            $scope.$safeApply();
        } else {
            searchBody.request.softConstraints =  ($scope.metaData.concepts) ? {
                "concepts": 100,
                "medium": 50,
                "gradeLevel": 25,
                "board": 12
            } : {
                "gradeLevel": 100,
                "medium": 50,
                "board": 25
            }
            $scope.searchBody = searchBody; 
            searchService.search(searchBody, function (err, res) {
                if (err) {
                    console.error("Oops! Something went wrong. Please try again later.", err);
                } else if (res.data.result.content) {
                    $scope.responseData[concepts] = _.concat(_.uniqBy($scope.responseData, 'identifier'), res.data.result.content);
                    if (!$scope.suggestedContentList.content.length) {
                        $('.card-list').transition({
                            animation: 'fade in',
                            duration: '3s',
                        });
                    }
                    angular.forEach(res.data.result.content, function (lessonContent) {
                        /* Exclude Already Added content in the currently selected node */
                        if ($scope.excludeContents.length) {
                            if (_.indexOf($scope.excludeContents, lessonContent.identifier) < 0) $scope.suggestedContentList.content.push(lessonContent);
                        } else {
                            $scope.suggestedContentList.content.push(lessonContent);
                        }
                    });
                    ecEditor.jQuery('#suggestions-loader').dimmer('hide');
                    $scope.$safeApply();
                    /*  Remove Duplicate contents from the list */
                    $scope.suggestedContentList.content = _.uniqBy($scope.suggestedContentList.content, 'identifier');
                } else {
                    ecEditor.jQuery('#suggestions-loader').dimmer('hide');
                }
            });
        }        
    }

    /* Open Resourse Browser with the Given query */
    $scope.openResourceBrowser = function () {
        if ($scope.suggestedContentList.content.length) {
            var query = $scope.searchBody;
            ecEditor.dispatchEvent('editor:invoke:viewall', {
                client: "org",
                query,
                callback: org.ekstep.services.collectionService.filterResource
            })
        }
    }
    /* Adds content/collection to the currently selected node */
    $scope.addContent = function (lesson, index) {
        /* Add content in root node and unit node only, content inside content is not allowed */
        if (org.ekstep.services.collectionService.getActiveNode().folder) {
            org.ekstep.services.collectionService.filterResource(undefined, [lesson]);

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
    $scope.onNodeSelect = function () {
        $scope.excludeContents = [];
        var activeNodeConcepts = [];
        var activeNode = org.ekstep.services.collectionService.getActiveNode();
        /* Fetch the added contents for the currently selected node */
        _.forEach(activeNode.children, function (content) {
            if (!content.folder) $scope.excludeContents.push(content.data.id);
        });

        _.forEach(ecEditor.getConfig('editorConfig').rules.objectTypes, function (obj) {
            if ((obj.type === activeNode.data.objectType) && obj.editable) {
                if ((obj.type === activeNode.data.objectType) && obj.editable && activeNode.data.metadata.concepts) {
                    _.forEach(activeNode.data.metadata.concepts, function (concept) {
                        activeNodeConcepts.push(concept.identifier);
                    });
                }
                if (activeNode.data.metadata.keywords && activeNode.data.metadata.keywords.length > 0) {
                    var lemmaCheck = _.isObject(_.first(activeNode.data.metadata.keywords))
                    activeNodeKeywords = (lemmaCheck) ? _.map(activeNode.data.metadata.keywords, 'lemma') : activeNode.data.metadata.keywords;
                }
            }
        });


        if ($scope.metaData.concepts)
            $scope.metaData.concepts = $scope.metaData.concepts.sort();
        if (!_.isEqual(activeNodeConcepts.sort(), $scope.metaData.concepts))
            $scope.metaData.concepts = activeNodeConcepts;
        if (!activeNodeConcepts.length)
            $scope.metaData.concepts = undefined;

        $scope.searchLessons();
    }

    /* Call when user changes metadata */
    $scope.updateMetaData = function () {
        var getNodesModified = org.ekstep.collectioneditor.api.getService('collection').getCollectionHierarchy().nodesModified;
        _.forEach(getNodesModified, function (node) {
            var updatedConcepts = [];
            updatedConcepts = _.map(node.metadata.concepts, 'identifier');
            if (node.root) {
                Object.assign($scope.metaData,
                    _.pick(node.metadata, ['gradeLevel', 'board', 'subject', 'medium']),
                    (updatedConcepts.length && !_.isEqual(updatedConcepts.sort(), $scope.metaData.concepts.sort())) ? {
                        concepts: updatedConcepts
                    } : {})
            } else {
                if ($scope.metaData.concepts)
                    $scope.metaData.concepts = $scope.metaData.concepts.sort();
                if (updatedConcepts.length && !_.isEqual(updatedConcepts.sort(), $scope.metaData.concepts)) {
                    $scope.metaData.concepts = updatedConcepts;
                }
            }
        })

        $scope.searchLessons();
    }

    $scope.refreshSuggestions = function () {
        var currentNodeData = ecEditor.jQuery("#collection-tree").fancytree("getTree").getActiveNode().data;
        var updatedConcepts = [];
        updatedConcepts = _.map(currentNodeData.metadata.concepts, 'identifier');
        if (currentNodeData.root) {
            Object.assign($scope.metaData,
                _.pick(currentNodeData.metadata, ['gradeLevel', 'board', 'subject', 'medium']),
                (updatedConcepts.length && !_.isEqual(updatedConcepts.sort(), $scope.metaData.concepts.sort())) ? {
                    concepts: updatedConcepts
                } : {}
            )
        } else if (!updatedConcepts.length) {
            $scope.metaData.concepts = undefined;
        } else {
            if ($scope.metaData.concepts)
                $scope.metaData.concepts = $scope.metaData.concepts.sort();
            if (updatedConcepts.length && !_.isEqual(updatedConcepts.sort(), $scope.metaData.concepts)) {
                $scope.metaData.concepts = updatedConcepts;
            }
        }
        $scope.searchLessons();
    }


    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.onNodeSelect);
    ecEditor.addEventListener('org.ekstep.contenteditor:save', $scope.updateMetaData);
    ecEditor.addEventListener('editor:form:success', $scope.updateMetaData);
    $scope.init();
}]);
//# sourceURL=suggestcontentApp.js