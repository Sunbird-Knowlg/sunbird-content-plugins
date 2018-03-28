angular.module('org.ekstep.genericeditorpreview', []).controller('previewController', ['$scope', function($scope) {
	$scope.showPreview = false;
	ecEditor.addEventListener("atpreview:show", function(){
		$scope.showPreview = true;
		var metadata = ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta(ecEditor.getContext('contentId'));
		$scope.showPdfWarningMsg = (metadata.mimeType == 'application/pdf') ? true : false;
		$scope.$safeApply();
	});

	$scope.hidePdfWarningMsg = function(){
		$scope.showPdfWarningMsg = false;
		$scope.$safeApply();
	};

	ecEditor.addEventListener("atpreview:hide", function(){
		$scope.showPreview = false;
		$scope.$safeApply();
	});
}]);