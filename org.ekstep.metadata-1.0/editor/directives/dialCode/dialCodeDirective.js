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
            if (String(this.dialCode).match(/^[A-Z0-9]{6}$/)) {
                $scope.errorMessage = "";
                if (ecEditor._.indexOf(org.ekstep.services.collectionService.dialcodeList, this.dialCode) != -1) {
                    $scope.status = "success";
                    if ($scope.contentMeta.mimeType == 'application/vnd.ekstep.content-collection') {
                        var node = ecEditor.jQuery("#collection-tree").fancytree("getRootNode").getFirstChild();
                        if (org.ekstep.collectioneditor.cache.nodesModified && org.ekstep.collectioneditor.cache.nodesModified[node.data.id]) {
                            org.ekstep.collectioneditor.cache.nodesModified[node.data.id].metadata["dialCode"] = this.dialCode;
                        }
                        if (!org.ekstep.services.stateService.state.dialCodeMap) {
                            org.ekstep.services.stateService.create('dialCodeMap');
                        }
                        org.ekstep.services.stateService.setState('dialCodeMap', node.data.id, this.dialCode);
                    }
                } else {
                    $scope.status = "failure";
                }
                $scope.editFlag = true;
            } else {
                $scope.editFlag = false;
                $scope.errorMessage = "Invalid input";
            }
        }

        // dialCode edit 
        $scope.editDialCode = function() {
            $scope.editFlag = false;
        }

        // clear dial code values
        $scope.clearDialCode = function() {
            $scope.dialCode = "";
        }
        $scope.init = function() {
            ecEditor.addEventListener("editor:dialcode:get", $scope.getCurrentDialCode, $scope);
            ecEditor.addEventListener("editor:update:dialcode", $scope.updateDialCode);
        }

        $scope.updateDialCode = function(event, data) {
            if ($scope.contentMeta.mimeType == 'application/vnd.ekstep.content-collection') {
                if (data) {
                    $scope.config = data;
                    $scope.dialCode = $scope.config.data.data.metadata.dialCode;
                }
            } else {
                /// other content mimeTypes
                $scope.dialCode = $scope.contentMeta.dialCode;
            }
            if ($scope.dialCode) {
                $scope.editFlag = ($scope.dialCode.length == $scope.maxLength) ? true : false;
                if ($scope.editFlag) {
                    $scope.status = ecEditor._.indexOf(org.ekstep.services.collectionService.dialcodeList, this.dialCode) != -1 ? "failure" : "success";
                }
            } else {
                $scope.editFlag = false;
            }
        }

        $scope.retrunDialCode = function() {
            ecEditor.dispatchEvent("editor:content:dialcode", $scope.dialCode);
        }

        $scope.getCurrentDialCode = function(event, options) {
            if (options && options.callback) {
                options.callback($scope.dialCode);
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