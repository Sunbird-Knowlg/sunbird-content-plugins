/**
 * @description
 * @author Archana Baskaran<archana.b@latitudefintech.com>
 */


angular.module('editorApp', ['ngDialog', 'oc.lazyLoad', 'Scope.safeApply']).directive('dialCodeUnits', function () {
    template = ecEditor.resolvePluginResource("org.ekstep.unitmeta", "1.2", "editor/directives/dialCode/template.html")
    var dialCodeController = ['$scope', '$controller', '$filter', function ($scope, $controller, $filter) {
        $scope.contentMeta = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId'));
        $scope.proceedFlag = false;
        $scope.clearFlag = false;
        $scope.failureFlag = false;
        $scope.successFlag = false;
        $scope.editFlag = false;
        
        // validate dial code input
        $scope.validateInputValue = function () {
            var dialCode = this.dialCode;
            if (String(dialCode).match(/^[A-Z0-9]{6}$/)) {
                $scope.proceedFlag = true;
                $scope.clearFlag = true;
            }
            else {
                $scope.proceedFlag = false;
                if (String(dialCode).length) {
                    $scope.clearFlag = true;
                }
                else {
                    $scope.clearFlag = false;
                }
            }
        }
        // validate the dialCode
        $scope.validateDialCode = function () {
            let nodeId =  org.ekstep.services.collectionService.getActiveNode().data.id;
            if(org.ekstep.collectioneditor.cache.nodesModified){
                if(org.ekstep.collectioneditor.cache.nodesModified[nodeId]){
                    org.ekstep.collectioneditor.cache.nodesModified[nodeId].metadata["dialCode"] = this.dialCode;
                }
            }
            if (ecEditor._.indexOf(org.ekstep.services.collectionService.dialcodeList, this.dialCode) != -1) {
                $scope.successFlag = true;
                $scope.failureFlag = false;
                if($scope.contentMeta.mimeType == 'application/vnd.ekstep.content-collection'){
                    if(!org.ekstep.services.stateService.state.dialCodes){
                        org.ekstep.services.stateService.create('dialCodeMap');
                    }
                    org.ekstep.services.stateService.setState('dialCodeMap',$scope.config.data.data.id || $scope.config.contentId,this.dialCode);
                }
            } else {
                $scope.failureFlag = true;
                $scope.successFlag = false;
            }
            $scope.editFlag = true;
            $scope.clearFlag = false;
            $scope.proceedFlag = false;
        }

        // dialCode edit 
        $scope.editDialCode = function () {
            $('input.dialCode').focus();
            $scope.editFlag = false;
            $scope.clearFlag = true;
            $scope.proceedFlag = true;
            $scope.successFlag = false;
            $scope.failureFlag = false;
        }

        // clear dial code values
        $scope.clearDialCode = function () {
            $('input.dialCode').val('');
            $scope.proceedFlag = false;
            $scope.clearFlag = false;
        }
        $scope.init = function(){
            ecEditor.addEventListener("editor:dialcode:get", $scope.getCurrentDialCode, $scope);
            ecEditor.addEventListener("editor:update:dialcode", $scope.updateDialCode);
            $scope.getDialCodes(function(dialCodes){
               $scope.dialCodes =  dialCodes ?  dialCodes.result.dialcodes : console.error('Unable to fetch');
            })
          
        }

        $scope.updateDialCode = function(event, data){
            if($scope.contentMeta.mimeType == 'application/vnd.ekstep.content-collection'){
                if(data){
                    $scope.config = data;
                    $scope.dialCode= $scope.config.data.data.metadata.dialCode;
                }
            }else{
                /// other content mimeTypes
                $scope.dialCode = $scope.contentMeta.dialCode;
            }
        }

        $scope.retrunDialCode = function(){
            ecEditor.dispatchEvent("editor:content:dialcode", $scope.dialCode);
        }


        /**
         * 
         */
        $scope.getDialCodes = function(callbackFn){
            // invoke ajax call 
           callbackFn && callbackFn(window.dialCodes);
        
        }

        $scope.getCurrentDialCode = function(event, options){
            if(options){
                if(options.callback){
                    options.callback($scope.dialCode);
                }
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