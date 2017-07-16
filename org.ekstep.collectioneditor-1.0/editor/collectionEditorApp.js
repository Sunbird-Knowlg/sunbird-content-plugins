angular.module('org.ekstep.collectioneditor', ["Scope.safeApply"]).controller('mainController', ['$scope', '$location', function($scope, $location) {
    //do_112272630392659968130
    $scope.contentDetails = {
        contentTitle: ""
    };
    $scope.contentId = ecEditor.getContext('contentId');
    $scope.metaPages = [];
    $scope.selectedObjectType = undefined;
    $scope.nodeFilter = "";
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
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getCollectionHierarchy({ contentId: $scope.contentId }, function(err, res) {
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

    org.ekstep.collectioneditor.api.initEditor(ecEditor.getConfig('editorConfig'), function() {
        $scope.loadContent(function(err, res) {
            if (res) {
                var activeNode = org.ekstep.services.collectionService.getActiveNode();
                $scope.contentDetails.contentTitle = activeNode.title ? activeNode.title : "Untitled Content";
                if (!_.isUndefined(activeNode.data.metadata.appIcon)) {
                    $scope.contentDetails.contentImage = activeNode.data.metadata.appIcon;
                }
                setTimeout(function() {
                    ecEditor.dispatchEvent('org.ekstep.collectioneditor:node:selected', activeNode);
                    ecEditor.dispatchEvent('org.ekstep.collectioneditor:node:selected:' + activeNode.data.objectType, activeNode)
                }, 200);
            } else {
                // ecEditor.getService('popup').open({
                //     template: '<div class="ui warning message no-content-dialog"><div id="content-not-fetch-message">:( &nbsp;Unable to fetch the content! Please try again later!</div><div><div class="ui negative basic button button-overrides"><i class="help circle icon"></i>Help</div><div class="ui black basic button button button-overrides"><i class="close icon"></i>Close editor</div></div></div>',
                //     plain: true,
                //     showClose: false,
                //     width: "50vw"
                // });
                iziToast.error({

                    icon: 'material',
                    title: 'No content!!!',
                    timeout: false,
                    message: 'We are unable to fetch content now.',
                    animateInside: true,
                    close: false,
                    position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
                    buttons: [
                        ['<button>Reload</button>', function(instance, toast) {
                            alert("Hello world!");
                        }],
                        ['<button>Close Editor</button>', function(instance, toast) {
                            instance.hide({
                                transitionOut: 'fadeOutUp',
                                onClosing: function(instance, toast, closedBy) {
                                    console.info('closedBy: ' + closedBy); //btn2
                                }
                            }, toast, 'close', 'btn2');
                        }]
                    ],
                    onOpening: function(instance, toast) {
                        $('.collection-masterhead').css('visibility', 'hidden');
                    },
                    onClosing: function(instance, toast, closedBy) {
                        console.info('closedBy: ' + closedBy); // tells if it was closed by 'drag' or 'button'
                    }
                });
            }
        });
    });


    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.setSelectedNode, $scope);
}]);
//# sourceURL=collectiontreeApp.js