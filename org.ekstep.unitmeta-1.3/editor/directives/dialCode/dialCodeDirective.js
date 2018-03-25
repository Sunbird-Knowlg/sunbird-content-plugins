/**
 * @description DIAL code directive
 * @author Archana Baskaran<archana.b@latitudefintech.com>
 */
angular.module('editorApp', ['ngDialog', 'oc.lazyLoad', 'Scope.safeApply']).directive('dialCode', function () {
    var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.unitmeta");
    template = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/directives/dialCode/template.html")
    var dialCodeController = ['$scope', '$controller', '$filter', function ($scope, $controller, $filter) {
        $scope.mode = ecEditor.getConfig('editorConfig').mode;
        $scope.contentMeta = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId'));
        $scope.maxLength = 6;
        $scope.minLength = 0;
        $scope.editFlag = false;
        $scope.errorMessage = "";
        $scope.status = "";

        // validate the dialCode
        $scope.validateDialCode = function () {
            if (String(this.dialcodes).match(/^[A-Z0-9]{6}$/)) {
                $scope.errorMessage = "";
                var nodeId = org.ekstep.services.collectionService.getActiveNode().data.id;
                if (org.ekstep.collectioneditor.cache.nodesModified && org.ekstep.collectioneditor.cache.nodesModified[nodeId]) {
                    org.ekstep.collectioneditor.cache.nodesModified[nodeId].metadata["dialcodes"] = this.dialcodes;
                }
                if (ecEditor._.indexOf(org.ekstep.services.collectionService.dialcodeList, this.dialcodes) != -1) {
                    $scope.status = "success";
                    if ($scope.contentMeta.mimeType == 'application/vnd.ekstep.content-collection') {
                        if (!org.ekstep.services.stateService.state.dialCodeMap) {
                            org.ekstep.services.stateService.create('dialCodeMap');
                        }
                        org.ekstep.services.stateService.setState('dialCodeMap', nodeId, this.dialcodes);
                    }
                } else {
                    if (!org.ekstep.services.stateService.state.invaliddialCodeMap) {
                        org.ekstep.services.stateService.create('invaliddialCodeMap');
                    }
                    org.ekstep.services.stateService.setState('invaliddialCodeMap', nodeId, this.dialcodes);
                    $scope.status = "failure";
                }
                $scope.editFlag = true;
            } else{
                $scope.editFlag = false;
                $scope.errorMessage = "Invalid input";
            }
        }

        // dialCode edit 
        $scope.editDialCode = function () {
            $scope.editFlag = false;
        }

        // clear dial code values
        $scope.clearDialCode = function () {
            $scope.dialcodes = "";
        }
        $scope.init = function () {
            ecEditor.addEventListener("editor:dialcode:get", $scope.getCurrentDialCode, $scope);
            ecEditor.addEventListener("editor:update:dialcode", $scope.updateDialCode);
        }

        $scope.updateDialCode = function (event, data) {
            $scope.dialcodes = "";
            if ($scope.contentMeta.mimeType == 'application/vnd.ekstep.content-collection') {
                var node = org.ekstep.services.collectionService.getActiveNode();
                if(node.data.metadata.dialcodes){
                    $scope.dialcodes = node.data.metadata.dialcodes    
                }else if(!_.isEmpty(org.ekstep.collectioneditor.cache.nodesModified) && org.ekstep.collectioneditor.cache.nodesModified[node.data.id]){
                    $scope.dialcodes = org.ekstep.collectioneditor.cache.nodesModified[node.data.id].metadata["dialcodes"]
                }
            } else {
                $scope.dialcodes = $scope.contentMeta.dialcodes;
            }
            if($scope.dialcodes){
                if(_.isArray($scope.dialcodes)){
                    $scope.dialcodes = $scope.dialcodes[0];
                }
                $scope.editFlag = ($scope.dialcodes.length == $scope.maxLength) ? true : false;
                if($scope.editFlag){
                    $scope.status = ecEditor._.indexOf(org.ekstep.services.collectionService.dialcodeList, $scope.dialcodes) == -1 ? "failure" : "success";
                }
            } else{
                $scope.editFlag = false;
            }
        }

        $scope.retrunDialCode = function () {
            ecEditor.dispatchEvent("editor:content:dialcode", $scope.dialcodes);
        }

        $scope.getCurrentDialCode = function (event, options) {
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
//# sourceURL=dialCodeForUnits.js