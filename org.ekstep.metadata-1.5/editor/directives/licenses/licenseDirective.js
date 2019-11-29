/**
 * @description : License supports to show content licensing
 * @author: Rahul Shukla <rahul.shukla@ilimi.in>
 * 
 */
formApp.directive('licenses', function() {
    const manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.metadata");
    var licensesController = ['$scope', '$controller', function($scope, $controller) {
        $scope.data = {};
        $scope.licenseData= "";
        $scope.contentMeta = $scope.$parent.contentMeta;
        $scope.defaultLicense = (ecEditor.getContext("defaultLicense")) ? ecEditor.getContext("defaultLicense") : "";
        $scope.contentMimeType = ["application/pdf", "video/mp4", "application/epub", "video/webm", "application/vnd.ekstep.h5p-archive", "application/vnd.ekstep.html-archive", "application/vnd.ekstep.ecml-archive"]
        $scope.isDisableSelection = false;
        $scope.toggleLicenseDetails = false;
        $scope.isCopiedContent = false;


        /**
         * Function to get the license details from API 
         */
        $scope.getLicenseData = function() {
            var payload={"request":{"filters":{"objectType":"license","status":["Live"]}}}
            if (_.isFunction(ecEditor.getService('search').search)) {
                ecEditor.getService('search').search(payload, function(err, resp) {
                    (!err && (_.has(resp.data.result, "License"))) ? ($scope.data.availableOptions = resp.data.result.License) : ($scope.toggleLicenseDetails = true)
                })
            }
        }

        /**
         * Function to get the copied content and mimetype
         */
        $scope.getContentOrigin = function() {
            var contentId   = ecEditor.getContext('contentId');
            var origin      = ecEditor.getService('content').getContentMeta(contentId).origin;
            var mimeType    = ecEditor.getService('content').getContentMeta(contentId).mimeType;
            var license     = ecEditor.getService('content').getContentMeta(contentId).license
            // copied content should be having origin field
            /* istanbul ignore else */
            if(!_.isUndefined(origin)){
                $scope.defaultLicense = license;
                $scope.isDisableSelection = true
            }
            // Check for Mimetype other than youtube for asset upload
            /* istanbul ignore else */
            if(!_.isUndefined(mimeType)){
                if(_.findIndex($scope.contentMimeType, mimeType) > 0){
                    ($scope.defaultLicense = ((ecEditor.getContext("defaultLicense")) ? ecEditor.getContext("defaultLicense") : ""));
                    $scope.isDisableSelection = true
                }
            }
        }
        $scope.getLicenseData();
        $scope.getContentOrigin();
        $scope.data.selectedOption = {
            name: $scope.defaultLicense,
            node_id: 0 
        };
        $scope.contentMeta.license = $scope.defaultLicense;

        $scope.OnLicenseChange = function() {
            $scope.contentMeta.license = $scope.data.selectedOption.name;   
        }
    }]
    return {
        restrict: "EA",
        templateUrl: ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/directives/licenses/template.html"),
        transclude: true,
        scope: {
            config: "="
        },
        controller: licensesController
    };
});
//# sourceURL=licenseDirective.js;