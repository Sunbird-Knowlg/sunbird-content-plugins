angular.module('org.ekstep.contentprovider', [])
.controller('contentproviderekstepController', ['$scope', function($scope) {
    var ctrl = this;


    ctrl.err = null;
    ctrl.meta = {"languages":{}, "grades":{}, "lessonTypes":{}, "domains":{}};
    ctrl.res = {count:0, content:[]};

    // Selected filters
    $scope.filterSelection = {"lang": [], "grade": ["Grade 1"], "lessonType": [], "domain": [], "concept": []};

    // Selected lessons
    $scope.lessonSelection = [];
    // QUICK FIX - Return selected lesson from repo. Service should be implemented
    $scope.selectedLessons.list = $scope.lessonSelection;

    // Regulate Load more button
    $scope.loadmoreEnabledFlag = true;
    $scope.loadmoreVisibleFlag = true;
    var loadedLessonCount = 0;

    // Select all - Sidebar filters
    $scope.isAllSelected = {"lang": false, "grade": false, "lessonType": false, "domain": false};

    // Fetch lessons related params
    var limit = 10;
    var offset = 0;
    var searchBody = {"request": {
                        "filters":{
                           "objectType": ["Content"],
                           "status": ["Live"]
                        }
                    }};

    // Get accordions functioning
    setTimeout(function(){$('.ui.accordion').accordion()}, 200);

    // Search API Integration
    var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
    ctrl.searchLessons = function(loadmore = false){
        if (!loadmore) {
            offset = 0;
        }
        searchBody.request.limit = limit;
        searchBody.request.offset = offset;

        searchService.search(searchBody, function(err, res){
            if (err) {
                ctrl.err = "Oops! Something went wrong. Please try again later.";
            } else {
                ctrl.res.count = res.data.result.count;

                if (loadmore) {
                    if (res.data.result.content) {
                        loadedLessonCount += res.data.result.content.length;
                    }

                    angular.forEach(res.data.result.content, function(lessonContent){
                        ctrl.res.content.push(lessonContent);
                    });
                } else {
                    if (res.data.result.content) {
                        loadedLessonCount = res.data.result.content.length;
                    }

                    ctrl.res.content = [];
                    angular.forEach(res.data.result.content, function(lessonContent){
                        ctrl.res.content.push(lessonContent);
                    });

                    $scope.loadmoreEnabledFlag = true;
                    $scope.loadmoreVisibleFlag = true;
                }

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
        // Reset the lesson selection on re-search
        $scope.lessonSelection.splice(0, $scope.lessonSelection.length);
    };

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

    // Title filter
    $scope.searchByKeyword = function(){
        searchBody.request.filters.name = {"startsWith": this.searchKeyword};
        ctrl.searchLessons();
    };

    // Title filter - search on enter
    $scope.searchOnKeypress = function() {
        if (event.keyCode === 13) {
            this.searchByKeyword();
        }
    }

    // Title filter - Reset
    $scope.resetSearchByKeyword = function(){
        this.searchKeyword = '';
        delete searchBody.request.filters.name;
        ctrl.searchLessons();
    };

    // Sidebar - filters
    $scope.applyFilters = function(){
        if ($scope.filterSelection.lang.length) {
            searchBody.request.filters.language = $scope.filterSelection.lang;
        } else {
            delete searchBody.request.filters.language;
        }

        if ($scope.filterSelection.grade.length) {
            searchBody.request.filters.gradeLevel = $scope.filterSelection.grade;
        } else {
            delete searchBody.request.filters.gradeLevel;
        }

        if ($scope.filterSelection.lessonType.length) {
            searchBody.request.filters.contentType = $scope.filterSelection.lessonType;
        } else {
            delete searchBody.request.filters.contentType;
        }

        if ($scope.filterSelection.domain.length) {
            searchBody.request.filters.domain = $scope.filterSelection.domain;
        } else {
            delete searchBody.request.filters.domain;
        }

        if ($scope.filterSelection.concept.length) {
            searchBody.request.filters.concepts = $scope.filterSelection.concept;
        } else {
            delete searchBody.request.filters.concepts;
        }

        ctrl.searchLessons();
    };

    // Sidebar filters - Reset
    $scope.resetFilters = function() {
        $scope.filterSelection.lang.splice(0, $scope.filterSelection.lang.length);
        $scope.filterSelection.grade.splice(0, $scope.filterSelection.grade.length);
        $scope.filterSelection.lessonType.splice(0, $scope.filterSelection.lessonType.length);
        $scope.filterSelection.domain.splice(0, $scope.filterSelection.domain.length);
        $scope.filterSelection.concept.splice(0, $scope.filterSelection.concept.length);

        $scope.applyFilters();
    };

    // Load more results
    $scope.loadmore = function() {
        offset = limit + offset;
        ctrl.searchLessons(true);
    }

    // Toggle selection for lessons - called on click of select all
    $scope.toggleSelection = function(selectionKey, val, metaKey, valueKey) {

        var idx = $scope.filterSelection[selectionKey].indexOf(val);

        if (idx > -1) {
            // is currently selected, remove from selection list
            $scope.filterSelection[selectionKey].splice(idx, 1);

            // Un-check select all box
            $scope.isAllSelected[selectionKey] = false;
        } else {
            // is newly selected, add to the selection list
            $scope.filterSelection[selectionKey].push(val);

            // Check select all box, if all options selected
            var optionsStatus = true;
            angular.forEach(ctrl.meta[metaKey], function(itm){
                if (valueKey) {
                    var itmAvailable = $scope.filterSelection[selectionKey].indexOf(itm[valueKey]) > -1;
                } else {
                    var itmAvailable = $scope.filterSelection[selectionKey].indexOf(itm) > -1;
                }

                optionsStatus = itmAvailable && optionsStatus;
            });
            $scope.isAllSelected[selectionKey] = optionsStatus;
        }
    };

    // Toggle select all
    $scope.toggleAll = function(selectionKey, metaKey, valueKey){
        var toggleStatus = !$scope.isAllSelected[selectionKey];
        $scope.filterSelection[selectionKey].splice(0, 15);

        if (toggleStatus) {
            if (valueKey) {
                angular.forEach(ctrl.meta[metaKey], function(itm){ $scope.filterSelection[selectionKey].push(itm[valueKey]); });
            } else {
                angular.forEach(ctrl.meta[metaKey], function(itm){ $scope.filterSelection[selectionKey].push(itm); });
            }
        }

        $scope.isAllSelected[selectionKey] = toggleStatus;
    };

    // Initiate concept selector
    ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
        element: 'conceptSelector',
        selectedConcepts: [], // All composite keys except mediaType
        callback: function(concepts) {
            angular.forEach(concepts, function(concept){
                $scope.filterSelection.concept.push(concept.id);
            });
            $scope.$safeApply();
        }
    });

    // Fetch sidebar filters through APIs
    ctrl.learningConfig();
    ctrl.configOrdinals();

    console.log(ctrl.meta);

    // Fetch and apply initial filters for first load
    var repoId = 'ekstep';
    var filter = $scope.$parent.browserApi.filters(repoId) || {};

    $scope.filterSelection.lang = filter.language;
    $scope.filterSelection.grade = filter.grade;
    $scope.filterSelection.lessonType = filter.lessonType;
    $scope.filterSelection.domain = filter.domain;
    $scope.applyFilters();

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