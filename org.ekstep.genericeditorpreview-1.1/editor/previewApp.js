angular.module('org.ekstep.genericeditorpreview', []).controller('previewController', ['$scope', function($scope) {
	$scope.showPreview = false;
	$scope.showPreviewFrame = function(){
		$scope.showPreview = true;
		if(!$scope.metadata){
			$scope.metadata = ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta(ecEditor.getContext('contentId'));
		}
		$scope.showPdfWarningMsg = ($scope.metadata.mimeType == 'application/pdf') ? true : false;
		$scope.$safeApply();
	}
	ecEditor.addEventListener("atpreview:show", $scope.showPreviewFrame);
	$scope.metadata = ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta(ecEditor.getContext('contentId'));
	if($scope.metadata){
		$scope.showPreviewFrame();
	}

	$scope.hidePdfWarningMsg = function(){
		$scope.showPdfWarningMsg = false;
		$scope.$safeApply();
	};

	ecEditor.addEventListener("atpreview:hide", function(){
		$scope.showPreview = false;
		$scope.$safeApply();
	});
}]);