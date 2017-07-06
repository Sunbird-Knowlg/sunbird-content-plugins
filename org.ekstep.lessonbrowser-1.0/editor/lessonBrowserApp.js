angular.module('org.ekstep.lessonbrowserapp', [])
.controller('lessonController', ['$scope', 'instance', 'callback',function($scope, instance, callback) {
    var ctrl = this;

    // QUICK FIX - Return selected lesson from repo. Service should be implemented
    $scope.selectedLessons = {};

    ctrl.lessonbrowser = instance;

    // Delay init of tabs till DOM is loaded
    $scope.$on('ngDialog.opened', function(){
        setTimeout(function(){$('.tabular.menu .item').tab()}, 200);
    });

    // Get and return the selected lessons
    $scope.returnSelectedLessons = function(selectedLessons){
    	// return selected lessons to the lesson browser caller
    	var err = null;
        var res = selectedLessons;
    	callback(err, res);

    	// close popup
    	$scope.closePopup();
    };

    // Close the popup
    $scope.closePopup = function() {
        $scope.closeThisDialog();
    };

    $scope.browserApi = {
    	filters: function(repoId) {
    		var repo = ecEditor._.find(instance.repos, ['id', repoId]);
    		var filters = {};

    		if (repo) {
    			filters = repo.getFilters();
    		}
    		return filters;
    	}
    };
}]);