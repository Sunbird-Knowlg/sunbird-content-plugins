angular.module('org.ekstep.contentprovider', [])
.controller('contentproviderekstepController', ['$scope', function($scope) {
    var ctrl = this;

    ctrl.err = null;
    ctrl.res = {count:0, content:{}};
    ctrl.meta = {"languages":{}, "grades":{}, "lessonTypes":{}, "domains":{}};
    $scope.langSelection = [];
    $scope.lessonTypeSelection = [];
    $scope.gradeSelection = [];
    $scope.domainSelection = [];
    $scope.lessonSelection = [];
    $scope.noLessonSelected = false;

    var searchBody = {"request": {
                        "filters":{
                           "objectType": ["Content"],
                           "status": ["Live"]
                        },
                        "limit": 100,
                        "offset":0
                    }};

    // Get accordions functioning
    setTimeout(function(){$('.ui.accordion').accordion()}, 200);

    $scope.addSelectedLessons = function() {
        console.log('trying to add selected lessons');
        $scope.noLessonSelected = false;
        if ($scope.lessonSelection.length) {
            org.ekstep.contenteditor.api.dispatchEvent('org.ekstep.contentprovider:lessonSelected', $scope.lessonSelection);
        } else {
            $scope.noLessonSelected = true;
        }
    };

    $scope.closePopup = function() {
        // console.log('tring to close popup');
        org.ekstep.contenteditor.api.dispatchEvent('org.ekstep.contentprovider:closePopup');
    };

    // Search API Integration
    var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
    ctrl.searchLessons = function(searchBody){
        searchService.search(searchBody, function(err, res){
            if (err) {
                ctrl.err = "Oops! Something went wrong. Please try again later.";
            } else {
                ctrl.res.count = res.data.result.count;
                ctrl.res.content = res.data.result.content;
            }
            $scope.$safeApply();
        });
        // Reset the lesson selection on re-search
        $scope.lessonSelection = [];
    };
    ctrl.searchLessons(searchBody);

    // Meta APIs integration
    var metaService = org.ekstep.contenteditor.api.getService(ServiceConstants.META_SERVICE);
    ctrl.learningConfig = function() {
        metaService.getLearningConfig(function(err, res){
            if (err) {
                ctrl.langErr = "Oops! Something went wrong with learning config. Please try again later.";
            } else {
                ctrl.meta.languages = res.data.result.medium.values;
                ctrl.meta.grades = res.data.result.gradeLevel.values;
            }
            $scope.$safeApply();
        });
    };
    ctrl.learningConfig();

    ctrl.configOrdinals = function() {
        metaService.getConfigOrdinals(function(err, res){
            if (err) {
                ctrl.langErr = "Oops! Something went wrong with config ordinals. Please try again later.";
            } else {
                ctrl.meta.lessonTypes = res.data.result.ordinals.contentType;
                ctrl.meta.domains = res.data.result.ordinals.domain;
            }
            $scope.$safeApply();
        });
    };
    ctrl.configOrdinals();

    $scope.searchByKeyword = function(){
        searchBody.request.filters.name = {"startsWith": this.searchKeyword};
        ctrl.searchLessons(searchBody);
    };

    $scope.resetSearchByKeyword = function(){
        this.searchKeyword = '';
        delete searchBody.request.filters.name;
        ctrl.searchLessons(searchBody);
    };

    $scope.applyFilters = function(){
        if ($scope.langSelection.length) {
            searchBody.request.filters.language = $scope.langSelection;
        } else {
            delete searchBody.request.filters.language;
        }

        if ($scope.gradeSelection.length) {
            searchBody.request.filters.gradeLevel = $scope.gradeSelection;
        } else {
            delete searchBody.request.filters.gradeLevel;
        }

        if ($scope.lessonTypeSelection.length) {
            searchBody.request.filters.contentType = $scope.lessonTypeSelection;
        } else {
            delete searchBody.request.filters.contentType;
        }

        if ($scope.domainSelection.length) {
            searchBody.request.filters.domain = $scope.domainSelection;
        } else {
            delete searchBody.request.filters.domain;
        }
        ctrl.searchLessons(searchBody);
    };

    // toggle selection for a given checkbox set
    $scope.toggleSelection = function toggleSelection(selections, val) {
        var idx = selections.indexOf(val);

        if (idx > -1) {
            // is currently selected
            selections.splice(idx, 1);
        } else {
            // is newly selected
            selections.push(val);
        }
        console.log($scope.lessonSelection);
        console.log($scope.lessonSelection.length);

    };

}]).filter('removeHTMLTags', function() {
    return function(text) {
        return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
}).filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});