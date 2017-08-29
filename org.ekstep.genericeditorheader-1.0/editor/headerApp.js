angular.module('org.ekstep.genericeditor', ["Scope.safeApply", "yaru22.angular-timeago"]).controller('headerController', ['$scope', function($scope) {
   var plugin = { id: "org.ekstep.genericeditorheader", ver: "1.0" };
   
   $scope.ekstepLogo = ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/images/ekstep_logo_white.png");
   $scope.disableSaveBtn = true;

   $scope.saveContent = function(){
   		console.log('save content method invoked');
   };

   $scope.download = function(){
   		var fileName = (ecEditor.getService('content').getContentMeta(ecEditor.getContext('contentId')).name).toLowerCase();
        ecEditor.getService('content').downloadContent(ecEditor.getContext('contentId'), fileName, function(err, resp) {
            if (!err && resp.data.responseCode == "OK") {
				var link = document.createElement('a');
				link.href = resp.data.result.ECAR_URL;
				link.download = link.href;
				link.style.display = 'none';
				document.body.appendChild(link);
			    link.click();
			    document.body.removeChild(link);  
			    
			    ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                    title: 'Content downloaded successfully!',                    
                    position: 'topCenter',
                    icon: 'fa fa-check-circle'
                });     
            } else {
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Unable to download the content, please try again later',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
        });
   };

   $scope.closeGenericEdtr = function(){
   		window.location.reload();
   };

   setTimeout(function(){
      ecEditor.jQuery('.popup-item').popup();
   },10);
   
   ecEditor.addEventListener('org.ekstep.genericeditor:download', $scope.download, $scope);
  
}]);
