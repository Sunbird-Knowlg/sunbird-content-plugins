/**
 * @description DIAL code directive
 * @author Archana Baskaran<archana.b@latitudefintech.com>
 */
angular.module('editorApp', ['ngDialog', 'oc.lazyLoad', 'Scope.safeApply']).directive('dialcode', function() {
    const manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.metadata");

    template = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/directives/dialCode/template.html")
    var dialCodeController = ['$scope', '$controller', '$filter', function($scope, $controller, $filter) {
        $scope.mode = ecEditor.getConfig('editorConfig').mode;
        $scope.contentMeta = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId'));
        $scope.maxLength = 6;
        $scope.minLength = 0;
        $scope.editFlag = false;
        $scope.errorMessage = "";
        $scope.status = "";

        // validate the dialCode
        $scope.validateDialCode = function() {
            if (String(this.dialcodes).match(/^[A-Z0-9]{6}$/)) {
                $scope.errorMessage = "";
                var node = ecEditor.jQuery("#collection-tree").fancytree("getRootNode").getFirstChild();
                if (org.ekstep.collectioneditor.cache.nodesModified && org.ekstep.collectioneditor.cache.nodesModified[node.data.id]) {
                    org.ekstep.collectioneditor.cache.nodesModified[node.data.id].metadata["dialcodes"] = this.dialcodes;
                }
                if (ecEditor._.indexOf(org.ekstep.services.collectionService.dialcodeList, this.dialcodes) != -1) {
                    $scope.status = "success";
                    if ($scope.contentMeta.mimeType == 'application/vnd.ekstep.content-collection') {
                        if (!org.ekstep.services.stateService.state.dialCodeMap) {
                            org.ekstep.services.stateService.create('dialCodeMap');
                        }
                        org.ekstep.services.stateService.setState('dialCodeMap', node.data.id, this.dialcodes);
                    }
                } else {
                    if (!org.ekstep.services.stateService.state.invaliddialCodeMap) {
                        org.ekstep.services.stateService.create('invaliddialCodeMap');
                    }
                    org.ekstep.services.stateService.setState('invaliddialCodeMap', node.data.id, this.dialcodes);
                    $scope.status = "failure";
                }
                $scope.editFlag = true;
            } else {
                $scope.editFlag = false;
                $scope.errorMessage = "Please enter valid DIAL code";
            }
        }

        // dialCode edit 
        $scope.editDialCode = function() {
            $scope.editFlag = false;
        }

        // clear dial code values
        $scope.clearDialCode = function () {
            $scope.dialcodes = "";
            var nodeId = ecEditor.jQuery("#collection-tree").fancytree("getRootNode").getFirstChild().data.id;
            if (org.ekstep.collectioneditor.cache.nodesModified && org.ekstep.collectioneditor.cache.nodesModified[nodeId]) {
                org.ekstep.collectioneditor.cache.nodesModified[nodeId].metadata["dialcodes"] = [];
            }
            if (!org.ekstep.services.stateService.state.dialCodeMap) {
                org.ekstep.services.stateService.create('dialCodeMap');
            }
            org.ekstep.services.stateService.setState('dialCodeMap', nodeId, "");
        }

        $scope.changeDialCode = function () {
            $scope.errorMessage = "";
            if(_.isEmpty(this.dialcodes)){
                var nodeId = ecEditor.jQuery("#collection-tree").fancytree("getRootNode").getFirstChild().data.id;
                if (org.ekstep.collectioneditor.cache.nodesModified && org.ekstep.collectioneditor.cache.nodesModified[nodeId]) {
                    org.ekstep.collectioneditor.cache.nodesModified[nodeId].metadata["dialcodes"] = [];
                }
                if (!org.ekstep.services.stateService.state.dialCodeMap) {
                    org.ekstep.services.stateService.create('dialCodeMap');
                }
                org.ekstep.services.stateService.setState('dialCodeMap', nodeId, "");
            }else if (!String(this.dialcodes).match(/^[A-Z0-9]{6}$/) || this.dialcodes.length < 6) {
                $scope.editFlag = false;
                $scope.errorMessage = "Please enter valid DIAL code";
            }
        }

        $scope.init = function() {
            ecEditor.addEventListener("editor:dialcode:get", $scope.getCurrentDialCode, $scope);
            ecEditor.addEventListener("editor:update:dialcode", $scope.updateDialCode);
            if(org.ekstep.services.collectionService.dialcodeList.length === 0){
                $scope.getAllDialCodes();
            }
        }

        $scope.getAllDialCodes = function(callback){
            var channel = ecEditor.getContext('channel');
            var reqObj = {
                "request": {
                    "search": {}
                }
            };
            ecEditor.getService('dialcode').getAllDialCodes(channel, reqObj, function(dialerr, dialrep) {
                if (!dialerr) {
                    _.forEach(dialrep.data.result.dialcodes, function(dialcodeData){
                        org.ekstep.services.collectionService.dialcodeList.push(dialcodeData.identifier);
                    });
                    callback && callback();
                }else{
                    console.log('unable to fetch dialcodes!', dialrep);
                }
            });
        }

        $scope.updateDialCode = function(event, data) {
            $scope.dialcodes = "";
            if ($scope.contentMeta.mimeType == 'application/vnd.ekstep.content-collection') {
                var node = ecEditor.jQuery("#collection-tree").fancytree("getRootNode").getFirstChild();
                if (node.data.metadata.dialcodes) {
                    $scope.dialcodes = node.data.metadata.dialcodes
                } else if (!_.isEmpty(org.ekstep.collectioneditor.cache.nodesModified) && org.ekstep.collectioneditor.cache.nodesModified[node.data.id]) {
                    $scope.dialcodes = org.ekstep.collectioneditor.cache.nodesModified[node.data.id].metadata["dialcodes"]
                }
            } else {
                $scope.dialcodes = $scope.contentMeta.dialcodes;
            }
            if ($scope.dialcodes) {
                if (_.isArray($scope.dialcodes)) {
                    $scope.dialcodes = $scope.dialcodes[0];
                }
                $scope.editFlag = ($scope.dialcodes && ($scope.dialcodes.length == $scope.maxLength)) ? true : false;
                if($scope.editFlag && org.ekstep.services.collectionService.dialcodeList.length === 0){
                    $scope.getAllDialCodes(function(){
                        $scope.status = ecEditor._.indexOf(org.ekstep.services.collectionService.dialcodeList, $scope.dialcodes) == -1 ? "failure" : "success";
                        $scope.$safeApply();
                    });
                }else{
                    $scope.status = ecEditor._.indexOf(org.ekstep.services.collectionService.dialcodeList, $scope.dialcodes) == -1 ? "failure" : "success";
                }
            } else {
                $scope.editFlag = false;
            }
        }

        $scope.retrunDialCode = function() {
            ecEditor.dispatchEvent("editor:content:dialcode", $scope.dialcodes);
        }

        $scope.getCurrentDialCode = function(event, options) {
            if (options && options.callback) {
                options.callback($scope.dialcodes);
            }
        }

        $scope.init()

    }]
    return {
        restrict: 'EA',
        templateUrl: template,
        controller: dialCodeController

    }
});
//# sourceURL=dialCodeForMeta.js