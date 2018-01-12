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
    $scope.defaultImage = ecEditor.resolvePluginResource("org.ekstep.collectioneditor", "1.0", "assets/default.png");
    $scope.getObjectType = function(objectType) {
        return _.find(objectType, function(type) {
            return type == $scope.selectedObjectType
        });
    }

    $scope.searchNode = function(event) {
        if (event.target.value == "") org.ekstep.services.collectionService.clearFilter();
        org.ekstep.services.collectionService.filterNode(event.target.value);
    };

    $scope.setSelectedNode = function(event, data) {
        $scope.collectionData = data;
        if (data.data.objectType) {
            $scope.selectedObjectType = data.data.objectType
            $scope.$safeApply();
        }
    };

    $scope.deleteNode = function(node, event) {
        if (!node.data.root) {
            ecEditor.getService('popup').open({
                template: '<div class="ui mini modal active" style="top:' + event.clientY + 'px;right:' + event.clientX + 'px;"><div class="content"><span class="custom-modal-heading">Are you sure you want to delete this content?</span> <i class="close large icon floatContentRight" ng-click="closeThisDialog()"></i><p class="custom-modal-content">All content within this folder will also be deleted from this textbook.</p><button class="ui red button" ng-click="confirm()">YES,  DELETE</button></div></div>',
                // '<div class="ui icon negative message remove-unit-popup"><i class="close icon" ></i><div class="content"><div class="header"><i class="fa fa-exclamation-triangle"></i> Do you want to remove this?</div><div class="remove-unit-buttons" style="padding-right:0; text-align:right;"><div class="ui red button button-overrides" id="remove-yes-button" >Yes</div><div class="ui basic primary button button-overrides" id="remove-no-button" >No</div></div></div></div>',
                controller: ["$scope", function($scope) {
                    $scope.confirm = function() {
                        node.remove();
                        $scope.closeThisDialog();
                        delete org.ekstep.collectioneditor.cache.nodesModified[node.data.id];
                        ecEditor.dispatchEvent("org.ekstep.collectioneditor:node:removed", node.data.id);
                    };
                }],
                plain: true,
                showClose: false
            });
        }
    }
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
                $scope.metaPages = org.ekstep.collectioneditor.metaPageManager.getPages();
                $scope.$safeApply();
                callback && callback(err, res);
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
        org.ekstep.services.telemetryService.interact({ "type": 'click', "subtype": data.subtype, "target": data.target, "pluginid": "org.ekstep.collectioneditor", "pluginver": "1.0", "objectid": ecEditor.getCurrentStage().id, "stage": ecEditor.getCurrentStage().id });
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


    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.setSelectedNode, $scope);
}]);
//# sourceURL=collectiontreeApp.js