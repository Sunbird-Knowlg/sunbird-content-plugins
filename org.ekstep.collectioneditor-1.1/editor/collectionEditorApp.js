angular.module('org.ekstep.collectioneditor', ["Scope.safeApply", "ui.sortable"]).controller('mainController', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {
    //do_112272630392659968130
    $scope.contentDetails = {
        contentTitle: ""
    };
    $scope.contentId = ecEditor.getContext('contentId');
    $scope.metaPages = [];
    $scope.selectedObjectType = undefined;
    $scope.nodeFilter = "";
    $scope.expandNodeFlag = true;
    $scope.defaultImage = ecEditor.resolvePluginResource("org.ekstep.collectioneditor", "1.1", "assets/default.png");
    $scope.playImage = ecEditor.resolvePluginResource("org.ekstep.collectioneditor", "1.1", "assets/icn_play.png");
    $scope.contentList = [];
    $scope.selectedContent;
    $scope.isContent = false;
    $scope.getObjectType = function(objectType) {
        return _.find(objectType, function(type) {
            return type == $scope.selectedObjectType
        });
    }

    $scope.sortableOptions = {
        stop: function() {
            var collectionData = org.ekstep.collectioneditor._.cloneDeep($scope.contentList);
            var activeNode = org.ekstep.services.collectionService.getActiveNode();
            activeNode.removeChildren();
            activeNode.setActive();
            $scope.contentList = collectionData;
            activeNode.addChildren(collectionData);
        }
      };

    $scope.searchNode = function(event) {
        if (event.target.value == "") org.ekstep.services.collectionService.clearFilter();
        org.ekstep.services.collectionService.filterNode(event.target.value);
    };

    $scope.resetContentList = function() {
        $scope.contentList = [];
        $scope.isContent = false;
        var iframe = document.getElementById('previewContentIframe');
        if (iframe) {
            iframe.src = "";
            var previewImage = document.getElementsByClassName('preview-image')[0];
            previewImage.style.display = 'block';
        }
    }

    $scope.getContentList = function(data, child) {
        if (data.children) {
            org.ekstep.collectioneditor._.each(data.children, function(content) {
                if (!content.isFolder())
                    $scope.contentList.push(content);
            })
        } else
        if (child && !child.isFolder())
            $scope.contentList.push(child)
        else if (!data.type && !data.isFolder()) {
            $scope.selectedContent = data;
            $scope.isContent = true;
        }
    }

    $scope.playContent = function(data) {
        if (!data || data.data.metadata.mimeType !== 'application/vnd.ekstep.ecml-archive') {
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: 'Unable to preview the content, please try again later',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
            org.ekstep.services.telemetryService.error({ "env": "content", "stage": "", "action": "show error", "err": "Unable to fetch content from remote", "type": "API", "data": err, "severity": "fatal" });
            return
        }
        var previewButton = document.getElementsByClassName('preview-image')[0];
        previewButton.style.display = 'none';
        var previewIframe = document.getElementById('previewContentIframe');
        previewIframe.src = (ecEditor.getConfig('previewURL') || '/content/preview/preview.html') + '?webview=true';
        previewIframe.onload = function() {
            org.ekstep.services.contentService.getContent(data.data.metadata.identifier, function(err, content) {
                var configuration = {};
                var userData = {};
                userData.etags = ecEditor.getContext('etags') || [];
                configuration.context = {
                    'mode':'edit',
                    'contentId': ecEditor.getContext('contentId'),
                    'sid': ecEditor.getContext('sid'),
                    'uid': ecEditor.getContext('uid'), 
                    'channel': ecEditor.getContext('channel') || "in.ekstep", 
                    'pdata': ecEditor.getContext('pdata') || {id: "in.ekstep", pid: "", ver: "1.0"}, 
                    'app': userData.etags.app || [], 
                    'dims': userData.etags.dims || [], 
                    'partner': userData.etags.partner || []
                }; 
                if (ecEditor.getConfig('previewConfig')) {
                    configuration.config = ecEditor.getConfig('previewConfig');
                } else {
                    configuration.config = {showEndpage:true};
                }
                configuration.metadata = content.metadata; 
                configuration.data = (content.mimeType == 'application/vnd.ekstep.ecml-archive') ?  content.body : {};
                previewIframe.contentWindow.initializePreview(configuration);
            })
        }
    }

    $scope.setSelectedNode = function(event, data) {
        $scope.resetContentList();
        $scope.getContentList(data);
        if (data.data.objectType) {
            $scope.selectedObjectType = data.data.objectType
            $scope.$safeApply();
        }
        org.ekstep.collectioneditor.jQuery( "#content-list").sortable();
        org.ekstep.collectioneditor.jQuery( "#content-list").disableSelection();
    };

    $scope.deleteNode = function(node, event) {
        if (!node.data.root) {
            ecEditor.getService('popup').open({
                template: '<div class="ui mini modal active" id="deletePopup"> <div class="content"> <div class="ui grid"> <div class="ten wide column"> <span class="custom-modal-heading">Are you sure you want to delete this content?</span> </div><div class="two wide column"> <i class="close large icon four wide column floatContentRight" ng-click="closeThisDialog()"></i></div></div><p class="custom-modal-content">All content within this folder will also be deleted from this textbook.</p><button class="ui red button" ng-click="confirm()">YES, DELETE</button> </div></div>',
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
            var ngDialogEventListener = $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                var dialogWidth = $('#deletePopup').width();
                var dialogHeight = $('#deletePopup').height();
                var height = event.pageY;
                var viewPortHeight = $(window).height();
                if ((viewPortHeight-(event.pageY + dialogHeight)) < 0)
                    height = height-dialogHeight;
                $('#deletePopup').offset({ top: height, left:  (event.pageX-dialogWidth)}).fadeIn(); 
                ngDialogEventListener();
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
                res.data.result.content.keywords = $scope.parseKeywords(res.data.result.content.keywords);
                org.ekstep.services.collectionService.fromCollection(res.data.result.content);
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

    $scope.setActiveNode = function(nodeId) {
        org.ekstep.collectioneditor.api.getService('collection').setActiveNode(nodeId);
    }

    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.setSelectedNode, $scope);
    ecEditor.addEventListener('org.ekstep.collectioneditor:node:added', $scope.getContentList, $scope);
    // ecEditor.addEventListener("org.ekstep.contentmeta:preview", $scope.playContent, $scope);
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

    $scope.addResource = function() {
        var collectionTree = document.getElementById('collection-tree');
        org.ekstep.collectioneditor.jQuery(collectionTree).trigger("nodeCommand", {cmd: 'addLesson'});
    }

    $scope.init();

}]);
//# sourceURL=collectiontreeApp.js