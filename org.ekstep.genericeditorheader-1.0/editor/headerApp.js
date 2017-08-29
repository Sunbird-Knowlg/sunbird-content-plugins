angular.module('org.ekstep.genericeditor', ["Scope.safeApply", "yaru22.angular-timeago"]).controller('headerController', ['$scope', function($scope) {
   var plugin = { id: "org.ekstep.genericeditorheader", ver: "1.0" };
   $scope.ekstepLogo = ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/images/ekstep_logo_white.png");

   setTimeout(function(){
   		ecEditor.jQuery('.popup-item').popup();
   },10);

}]);
