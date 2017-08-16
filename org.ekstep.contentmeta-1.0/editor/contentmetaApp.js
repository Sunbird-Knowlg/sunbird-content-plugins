angular.module('contentmetaApp', []).controller('contentmetaController', ['$scope', function($scope) {
    $scope.mode = ecEditor.getConfig('editorConfig').mode;
    $scope.metadataCloneOb = {};
    $scope.nodeId = $scope.nodeType = '';
    $scope.toggleCollectionAccodrionState=true;
    ecEditor.getService('meta').getConfigOrdinals(function(err, resp) {
        if (!err) {
            $scope.languageList = resp.data.result.ordinals.language;
            $scope.$safeApply();
        }
    });
    $scope.showImageIcon = true;

    $scope.showAssestBrowser = function() {
        ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
            type: 'image',
            search_filter: {}, // All composite keys except mediaType
            callback: function(data) {
                $scope.content.appIcon = data.assetMedia.src;
                $scope.$safeApply();
            }
        });
    }

    $scope.updateNode = function() {
        if ($scope.contentMetaForm.$valid) {
            if (_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) {
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId] = {};
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["isNew"] = $scope.newNode;
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["root"] = false;
            }
            if (_.isString($scope.content.keywords)) {
                $scope.content.keywords = $scope.content.keywords.split(',');
            }
            if (_.isString($scope.content.language)) {
                $scope.content.language = [$scope.content.language];
            }
            $scope.content.contentType = $scope.nodeType;
            org.ekstep.collectioneditor.api.getService('collection').setNodeTitle($scope.content.name);
            org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata = _.assign(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata, $scope.getUpdatedMetadata($scope.metadataCloneObj, $scope.content));;
            $scope.metadataCloneObj = _.clone($scope.content);
            ecEditor.dispatchEvent('org.ekstep.collectioneditor:node:modified');
            $scope.editMode = false;
            $scope.$safeApply();
        } else {
            ecEditor.dispatchEvent("org.ekstep.toaster:warning", {
                title: 'Please fill in all required fields',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
            $scope.submitted = true;
        }
    };

    $scope.initDropdown = function() {
        $('#language').dropdown('set selected', $scope.content.language);
    };

    $scope.getUpdatedMetadata = function(originalMetadata, currentMetadata) {
        var metadata = {};
        if (_.isEmpty(originalMetadata)) {
            _.forEach(currentMetadata, function(value, key) {
                metadata[key] = value;
            });
        } else {
            _.forEach(currentMetadata, function(value, key) {
                if (_.isUndefined(originalMetadata[key])) {
                    metadata[key] = value;
                } else if (value != originalMetadata[key]) {
                    metadata[key] = value;
                }
            });
        }
        if (_.isUndefined(metadata['name'])) {
            metadata['name'] = originalMetadata['name'];
        }
        if (_.isUndefined(metadata['code'])) {
            metadata['code'] = $scope.nodeId;
        }
        if (_.isUndefined(metadata['mimeType'])) {
            metadata['mimeType'] = "application/vnd.ekstep.content-collection";
        }
        return metadata;
    }

    $scope.addlesson = function() {
        ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show");
    }

    $scope.onNodeSelect = function(evant, data) {
        $scope.showImageIcon = false;
        var contentArr = ["Story", "Collection", "Game", "Worksheet"];
        $scope.editable = org.ekstep.collectioneditor.api.getService('collection').getObjectType(data.data.objectType).editable;
        if (_.indexOf(contentArr, data.data.objectType) != -1) {
            $scope.nodeId = data.data.id;
            $scope.nodeType = data.data.objectType;
            $scope.content = {};
            $scope.editMode = $scope.newNode = false;
            $scope.editable = org.ekstep.collectioneditor.api.getService('collection').getObjectType(data.data.objectType).editable;
            $scope.defaultImage = ecEditor.resolvePluginResource("org.ekstep.contentmeta", "1.0", "assets/default.png");

            var activeNode = org.ekstep.collectioneditor.api.getService('collection').getActiveNode();
            if ($scope.mode === "Edit" && $scope.editable === true) {
                $scope.editMode = true;
                $('.ui.dropdown').dropdown('refresh');
                $scope.metadataCloneObj = _.clone($scope.content);
            }
            if (!_.isEmpty(activeNode.data.metadata) && _.has(activeNode.data.metadata, ["name"])) {
                $scope.editMode = false;
                $scope.content = (_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) ? activeNode.data.metadata : _.assign(activeNode.data.metadata, org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata);
                $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
                $('#language').dropdown('set selected', $scope.content.language);
            } else if (_.has(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata, ["name"])) {
                $scope.editMode = false;
                $scope.content = _.assign(activeNode.data.metadata, org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata);
                $scope.metadataCloneObj = _.clone(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata);
                $('#language').dropdown('set selected', $scope.content.language);
            } else {
                $scope.newNode = true;
            }
            $scope.getPath();
        }
        $scope.showImageIcon = true;
        $scope.getSubCollection(data.data.metadata.identifier, data.data.metadata.status, function(err, res) {
            if (err) console.log("error when trying to fetch sub collections");
            if (res) $scope.initFancyTree(res.data.result.content);
        });
        $scope.$safeApply();
    }
    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.onNodeSelect);

    $scope.getPath = function() {
        $scope.path = [];
        var path = ecEditor.jQuery("#collection-tree").fancytree("getTree").getActiveNode().getKeyPath();
        _.forEach(path.split('/'), function(key) {
            if (key) {
                var node = ecEditor.jQuery("#collection-tree").fancytree("getTree").getNodeByKey(key);
                $scope.path.push({ 'title': node.title, 'nodeId': node.key })
            }
        });
    }

    $scope.setActiveNode = function(nodeId) {
        org.ekstep.collectioneditor.api.getService('collection').setActiveNode(nodeId);
    }

    $scope.previewContent = function() {
        ecEditor.setContext('contentId', $scope.nodeId);
        org.ekstep.services.contentService.getContent($scope.nodeId, function(err, content) {
            if (!err) {
                var contentBody = content.body;
                org.ekstep.pluginframework.eventManager.dispatchEvent("atpreview:show", { contentBody: content.body, 'currentStage': false });
                console.log('contentBody ', contentBody);
            } else {
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Unable to preview the content, please try again later',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
                org.ekstep.services.telemetryService.error({ "env": "content", "stage": "", "action": "show error", "err": "Unable to fetch content from remote", "type": "API", "data": err, "severity": "fatal" });
            }
        });
    }

    setTimeout(function() {
        ecEditor.jQuery('.popup-item').popup();
        ecEditor.jQuery(".collection-metadata-accordion").accordion({
            collapsible: true,
            duration: 500
        });
        ecEditor.jQuery('.collection-metadata-accordion .title:first-child').click();
    }, 0);

    $scope.generateTelemetry = function(data) {
        if (data) org.ekstep.services.telemetryService.interact({ "type": data.type, "subtype": data.subtype, "target": data.target, "pluginid": "org.ekstep.contentmeta", "pluginver": "1.0", "objectid": $scope.nodeId, "stage": $scope.nodeId })
    }

    $scope.getSubCollection = function(contentId, mode, callback) {
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getCollectionHierarchy({ contentId: contentId, mode: mode }, function(err, res) {
            if (res && res.data && res.data.responseCode === "OK") {
                callback && callback(err, res);
            } else {
                callback && callback('unable to fetch the content!', res);
            }
        });
    };

    $scope.initFancyTree = function(data) {        
        if (!data) return;
        data = $scope.buildSubCollectionTree(data);
        ecEditor.jQuery("#collection-meta-tree").fancytree("getTree").reload(data);
    }

    ecEditor.jQuery("#collection-meta-tree").fancytree({
        source: []
    });

    $scope.buildSubCollectionTree = function(data, tree) {
        var instance = this,
            tree = tree || [];
        if (data.children) data.children = _.sortBy(data.children, ['index']);
        _.forEach(data.children, function(child) {            
            var childTree = [];            
            tree.push({
                "id": child.identifier || UUID(),
                "title": (child.name.length > 22) ? child.name.substring(0,22)+'...' : child.name,
                "objectType": child.contentType,
                "metadata": _.omit(child, ["children", "collections"]),
                "folder": !_.isEmpty(child.children),
                "children": childTree,
                "root": false                
            });
            if (child.children && child.children.length > 0) {
                instance.buildSubCollectionTree(child, childTree);
            }
        });

        return tree;
    }

    $scope.toggleCollectionAccodrion=function(){
        $scope.toggleCollectionAccodrionState = !($scope.toggleCollectionAccodrionState);
    }
}]);
//# sourceURL=contentmetaApp.js