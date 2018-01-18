angular.module('org.ekstep.lessonbrowserapp', [])
.controller('lessonController', ['$scope', 'instance', 'callback', 'callerFilters', function($scope, instance, callback, callerFilters) {
    var ctrl = this;
        ctrl.res = { count: 0, content: [] };
    // QUICK FIX - Return selected lesson from repo. Service should be implemented
    $scope.selectedLessons = {};
        // Fetch lessons related params
        var limit = 10;
        var offset = 0;
        var searchBody = {
            "request": {
                "filters": {
                    "objectType": ["Content"],
                    "status": ["Live"]
                }
            }
        };
        var loadedLessonCount = 0;
    ctrl.lessonbrowser = instance;

    $scope.telemetry = {"pluginid":ctrl.lessonbrowser.manifest.id, "pluginver":ctrl.lessonbrowser.manifest.ver};

    var collectionService = org.ekstep.collectioneditor.api.getService('collection');
    ctrl.generateTelemetry = function(data) {
        if (data) ecEditor.getService('telemetry').interact({
            "type": data.type,
            "subtype": data.subtype,
            "target": data.target,
            "targetid":data.targetid,
            "pluginid": $scope.telemetry.pluginid,
            "pluginver": $scope.telemetry.pluginver,
            "objectid": '',
            "stage": collectionService.getActiveNode().id
        })
    };


    // Delay init of tabs till DOM is loaded
    $scope.$on('ngDialog.opened', function(){
        setTimeout(function(){$('.tabular.menu .item').tab()}, 200);
    });

    // Get and return the selected lessons
    $scope.returnSelectedLessons = function(selectedLessons){
        ctrl.generateTelemetry({type: 'click', subtype: 'submit', target: 'addlesson',targetid: 'button-add'});

    	// return selected lessons to the lesson browser caller
    	var err = null;
        var res = selectedLessons;
    	callback(err, res);

    	// close popup
    	$scope.closePopup();
    };

    // Close the popup
    $scope.closePopup = function() {
        ctrl.generateTelemetry({type: 'click', subtype: 'cancel', target: 'addlesson', targetid: 'button-cancel'});
        $scope.closeThisDialog();
    };

    $scope.browserApi = {
    	filters: function(repoId) {
    		var repo = ecEditor._.find(instance.repos, ['id', repoId]);
    		var filters = {};

    		if (repo) {
    			filters = repo.getFilters();
    		}

            var mergedFilters = {"language":[], "grade": [], "lessonType": [], "domain": []};
            angular.forEach(mergedFilters, function(idx, filterKey){
                if (filters[filterKey] && callerFilters[filterKey]) {
                    mergedFilters[filterKey] = filters[filterKey].concat(callerFilters[filterKey]);
                    mergedFilters[filterKey] = arrayUnique(mergedFilters[filterKey]);
                }
            });
    		return mergedFilters;
    	}
    };

    var arrayUnique = function(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    }
        // search changes
        // Load more results
        $scope.loadmore = function () {
            $scope.loadmoreEnabledFlag = false;
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'loadmore', targetid: 'button-load-more' });
            offset = limit + offset;
            ctrl.searchLessons(true);
        }

        // Title filter
        $scope.searchByKeyword = function () {
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'search', targetid: 'button-search' });
            console.log('search value..', this.searchKeyword);
            searchBody.request.query = this.searchKeyword;
            ecEditor.dispatchEvent("lessonplan:category:searchKey",this.searchKeyword);
            // ctrl.searchLessons();
        };

        // Title filter - search on enter
        $scope.searchOnKeypress = function () {
            if (event.keyCode === 13) {
                ctrl.generateTelemetry({ type: 'keypress', subtype: 'submit', target: 'search', targetid: 'keypress-search' });
                this.searchByKeyword();
            }
        }
        // Title filter - Reset
        $scope.resetSearchByKeyword = function () {
            ctrl.generateTelemetry({ type: 'click', subtype: 'reset', target: 'search', targetid: 'button-reset' });
            this.searchKeyword = '';
            delete searchBody.request.filters.name;
            ctrl.searchLessons();
        };
        // Search API Integration
        var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
        ctrl.searchLessons = function (loadmore = false) {
            if (!loadmore) {
                offset = 0;
            }
            searchBody.request.limit = limit;
            searchBody.request.offset = offset;
            console.log('search body...', searchBody);
            searchService.search(searchBody, function (err, res) {
                if (err) {
                    ctrl.err = "Oops! Something went wrong. Please try again later.";
                } else {
                    ctrl.res.count = res.data.result.count;

                    if (loadmore) {
                        if (res.data.result.content) {
                            loadedLessonCount += res.data.result.content.length;
                        }

                        angular.forEach(res.data.result.content, function (lessonContent) {
                            ctrl.res.content.push(lessonContent);
                        });
                    } else {
                        if (res.data.result.content) {
                            loadedLessonCount = res.data.result.content.length;
                        }

                        ctrl.res.content = [];
                        angular.forEach(res.data.result.content, function (lessonContent) {
                            ctrl.res.content.push(lessonContent);
                        });

                    }
                    $scope.loadmoreVisibleFlag = true;
                    $scope.loadmoreEnabledFlag = true;

                    if (loadedLessonCount >= ctrl.res.count) {
                        $scope.loadmoreEnabledFlag = false;
                    }

                    if (!res.data.result.content) {
                        $scope.loadmoreEnabledFlag = false;
                    }

                    if (!ctrl.res.count) {
                        $scope.loadmoreVisibleFlag = false;
                    }
                }
                $scope.$safeApply();
            });

        };
}]);