angular.module('org.ekstep.collectioneditor', ["Scope.safeApply"]).controller('mainController', ['$scope', '$location', function($scope, $location) {
    var ctrl = this;
    $scope.contentDetails = {
        contentTitle: "Untitled Content",
        contentImage: "/images/com_ekcontent/default-images/default-content.png",
        contentConcepts: "No concepts selected",
        contentType: ""
    };

    $scope.collection = {};

    $scope.contentId = $location.search().contentId;
    if (_.isUndefined($scope.contentId)) {
        $scope.contentId = ((window.context && window.context.content_id) ? window.context.content_id : undefined)
    }

    window.collectionTree = {
        add: function() {
            var selectedNode = ecEditor.jQuery("#collection-tree").fancytree("getTree").getActiveNode();
            selectedNode.addChildren({
                title: "Untitled Unit",
                objectType: "TextBookUnit",
                folder: true,
                metadata: {}
            });
            selectedNode.sortChildren(null, true);
            selectedNode.setExpanded();
        },
        remove: function() {
            var selectedNode = ecEditor.jQuery("#collection-tree").fancytree("getTree").getActiveNode();
            var def = org.ekstep.collectioneditor.configService.getHierarchyDefinition();
            if (!def.definition[selectedNode.data.objectType].root) {
                var result = confirm("Do you want to remove this unit?");
                if (result == true) {
                    selectedNode.remove();
                }
            }
        }
    }

    org.ekstep.services.languageService.getCollectionHierarchy({ contentId: $scope.contentId }, function(err, res) {
        if (res && res.data && res.data.responseCode === "OK") {
            var tree = ctrl.getCollectionTree(res.data.result.content);
            ctrl.addCollectionTree(tree);
        }
    });

    ctrl.clearCollectionForm = function() {
        $scope.collection = {}
        $scope.$safeApply();
    };    

    ctrl.populateCollectionForm = function(data) {
        $scope.collection = {
            name: data.name,
            description: data.description,
            notes: data.notes,
            pageNumber: data.pageNumber,
        }

        ecEditor._.forEach(data.concepts, function(concept) {
            $scope.collection.concepts = ($scope.collection.concepts ? $scope.collection.concepts : "") + concept.name + ",";
        });

        $scope.$safeApply();
    };

    ctrl.getCollectionTree = function(data) {
        var config = org.ekstep.collectioneditor.configService.buildConfig(data)
        config.defaultTemplate.folder = true;        
        return [config.defaultTemplate];
    };

    ctrl.addCollectionTree = function(tree) {
        ecEditor.jQuery("#collection-tree").fancytree({
            extensions: ["dnd"],
            source: tree,
            beforeActivate: function(event, data) {
                if (!data.node.isFolder()) {
                    ctrl.clearCollectionForm();
                    return false;
                }
                ctrl.populateCollectionForm(data.node.data.metadata);
            },
            dnd: {
                autoExpandMS: 400,
                focusOnClick: true,
                preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                dragStart: function(node, data) {
                    return true;
                },
                dragEnter: function(node, data) {
                    return true;
                },
                dragDrop: function(node, data) {
                    if (data.hitMode === "before" || data.hitMode === "after") return false;
                    var def = org.ekstep.collectioneditor.configService.getHierarchyDefinition();
                    if (node && node.data && node.data.objectType) {
                        var dropAllowed = _.includes(def.definition[data.node.data.objectType].childrenTypes, node.data.objectType);
                        if (dropAllowed) { data.otherNode.moveTo(node, data.hitMode) } else {
                            alert(data.node.title + " cannot be added to " + node.title);
                        }
                    }
                }
            },
            renderNode: function(event, data) {
                var node = data.node;
                var $nodeSpan = $(node.span);
                // check if span of node already rendered
                if (!$nodeSpan.data('rendered') && (data.node.data.objectType == "TextBook" || data.node.data.objectType == "TextBookUnit")) {
                    var contextButton = $('<span style="padding-left: 20px;left: 65%;"><i class="add square icon" onclick="collectionTree.add()"></i><i class="remove icon" onclick="collectionTree.remove()"></i></span>');
                    $nodeSpan.append(contextButton);
                    contextButton.hide();
                    $nodeSpan.hover(function() { contextButton.show(); }, function() { contextButton.hide(); });
                    $nodeSpan.data('rendered', true);
                }
            }
        });
        var node = ecEditor.jQuery("#collection-tree").fancytree("getRootNode");
      	node.sortChildren(null, true);
    }

    $scope.saveNodeMetadata = function(data) {
    	var selectedNode = ecEditor.jQuery("#collection-tree").fancytree("getTree").getActiveNode();
    	selectedNode.data.metadata = $scope.collection;
    	selectedNode.setTitle($scope.collection.name);
    	selectedNode.sortChildren(null, true);
    }
}]);
