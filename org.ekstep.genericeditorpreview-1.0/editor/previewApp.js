angular.module('org.ekstep.genericeditorpreview', []).controller('previewController', ['$scope', function($scope) {
	this.showPreview = true;
	ecEditor.addEventListener("atpreview:show", function(){
		console.info("show preview");
		this.showPreview = true;
	});
}]);