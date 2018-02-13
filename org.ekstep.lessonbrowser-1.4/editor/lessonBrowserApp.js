angular.module('org.ekstep.lessonbrowserapp', [])
.controller('lessonController', ['$scope', 'instance', 'callback', 'callerFilters', function($scope, instance, callback, callerFilters) {
    var ctrl = this;
    $scope.headerTemplate = ecEditor.resolvePluginResource("org.ekstep.lessonbrowser", "1.4", "editor/header.html");
    $scope.footerTemplate = ecEditor.resolvePluginResource("org.ekstep.lessonbrowser", "1.4", "editor/footer.html");
    $scope.filterTemplate = ecEditor.resolvePluginResource("org.ekstep.lessonbrowser", "1.4", "editor/filterTemplate.html");
    $scope.cardTemplate = ecEditor.resolvePluginResource("org.ekstep.lessonbrowser", "1.4", "editor/cardRendererTemplate.html");
    // console.log(' $scope.headerTemplate', $scope.headerTemplate);
    //Response variable
    ctrl.res = {count:0, content:[]};
    ctrl.searchRes = {count:0, content:[]};
    // error response
    ctrl.err = null;

    // header container load condition
    $scope.headerContainer = true;
    $scope.footerContainer = true;
    $scope.renderTemplate = 'selectedResult';
    // $scope.selectedResult = true;
    // $scope.selectedItemsView=false;
    $scope.enableViewLink = false;

    // telemetry pluginId and plugin version
    ctrl.lessonbrowser=instance;
     
    $scope.telemetry = {"pluginid":ctrl.lessonbrowser.manifest.id, "pluginver":ctrl.lessonbrowser.manifest.ver};

    //meta variable
    ctrl.meta = { "languages": {}, "grades": {}, "lessonTypes": {}, "domains": {},"subjects":{} };

    // Regulate Load more button
    $scope.loadmoreEnabledFlag = true;

    // Selected lessons
    $scope.lessonSelection = [];
    $scope.selectedResources = [];
    
    // Fetch lessons related params
    var limit = 12;
    var offset = 0;
    var searchBody = {"request": {
                        "filters":{
                           "objectType": ["Content"],
                           "status": ["Live"]
                        }
                    }};

    // Selected filters
    $scope.filterSelection = {"lang": [], "grade": [], "lessonType": [], "domain": [], "concept": [],"subject":[],"concepts":[]};
    
   
  
    
    //Telemetry
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

    
    // Meta APIs integration
    var metaService = org.ekstep.contenteditor.api.getService(ServiceConstants.META_SERVICE);
    ctrl.learningConfig = function() {
        metaService.getLearningConfig(function(err, res){
            if (err) {
                ctrl.langErr = "Oops! Something went wrong with learning config. Please try again later.";
            } else {
                ctrl.meta.languages = res.data.result.medium.values;
                ctrl.meta.grades = res.data.result.gradeLevel.values;
                ctrl.meta.subjects = res.data.result.subject.values;
                console.log('ctrl.meta',ctrl.meta);
                ctrl.meta.lessonTypes = collectionService.getObjectTypeByAddType('Browser');
                $('#lessonBrowser_lessonType').dropdown('set value', ctrl.meta.lessonTypes[0]);
            }
            $scope.$safeApply();
        });
    };

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

                }
                $scope.loadmoreEnabledFlag = true;

                if (loadedLessonCount >= ctrl.res.count) {
                    $scope.loadmoreEnabledFlag = false;
                }

                if (!res.data.result.content) {
                    $scope.loadmoreEnabledFlag = false;
                }
            }
            console.log('ctrl.res.content',ctrl.res.content);
            $scope.$safeApply(); 
            // disable view link
            // if($scope.lessonSelection.length){
            //      $('.viewLink').css('opacity:0;cursor:defaults');
            // }
            // else{
            //      $('.viewLink').css('opacity:0.5;cursor:defaults');
            // }
           
                angular.forEach(ctrl.res.content, function(resource){
                    if($scope.selectedResources.indexOf(resource.identifier) !== -1){
                        $('#checkBox_'+resource.identifier+' >.checkBox').attr('checked', true);
                        $('#add_'+resource.identifier).hide();
                        $('#remove_'+resource.identifier).show();
                    }
                    else{
                        $('#checkBox_'+resource.identifier+' >.checkBox').attr('checked', false);
                        $('#add_'+resource.identifier).show();
                        $('#remove_'+resource.identifier).hide();
                    }
                });
        });
        
    };

     // Load more results
     $scope.loadmore = function() {
        $scope.loadmoreEnabledFlag = false;
        ctrl.generateTelemetry({type: 'click', subtype: 'submit', target: 'loadmore',targetid: 'button-load-more'});
        offset = limit + offset;
        ctrl.searchLessons(true);
    };

    // browserApi
    // $scope.browserApi = {
    // 	filters: function(repoId) {
    // 		var repo = ecEditor._.find(instance.repos, ['id', repoId]);
    // 		var filters = {};

    // 		if (repo) {
    // 			filters = repo.getFilters();
    // 		}

    //         var mergedFilters = {"language":[], "grade": [], "lessonType": [], "domain": [],"subject":[]};
    //         angular.forEach(mergedFilters, function(idx, filterKey){
    //             if (filters[filterKey] && callerFilters[filterKey]) {
    //                 mergedFilters[filterKey] = filters[filterKey].concat(callerFilters[filterKey]);
    //                 mergedFilters[filterKey] = arrayUnique(mergedFilters[filterKey]);
    //             }
    //         });
    // 		return mergedFilters;
    // 	}
    // };


    // var arrayUnique = function(array) {
    //     var a = array.concat();
    //     for(var i=0; i<a.length; ++i) {
    //         for(var j=i+1; j<a.length; ++j) {
    //             if(a[i] === a[j])
    //                 a.splice(j--, 1);
    //         }
    //     }
    //     return a;
    // }
    
    // Fetch sidebar filters through APIs
    ctrl.learningConfig();
 
    // Fetch and apply initial filters for first load
    // var repoId = 'ekstep';
    // var filter = $scope.browserApi.filters(repoId) || {};
    // console.log('filter...',filter);
    // $scope.filterSelection.lang = filter.language;
    // $scope.filterSelection.grade = filter.grade;
    // $scope.filterSelection.subject = filter.subject;
    // $scope.filterSelection.domain = filter.domain;


        // get filters value
        $scope.getFiltersValue = function(){
            /** Get value from dropdown**/
            $scope.filterSelection.lang = $('#lessonBrowser_language').dropdown('get value');
            $scope.filterSelection.grade = $('#lessonBrowser_grade').dropdown('get value');
            $scope.filterSelection.lessonType = $('#lessonBrowser_lessonType').dropdown('get value');
            $scope.filterSelection.subject = $('#lessonBrowser_subject').dropdown('get value');
            console.log('$scope.filterSelection.lessonType',$scope.filterSelection.lessonType);
            if ($scope.filterSelection.lang.length) {
                $scope.filterSelection.lang = $scope.filterSelection.lang.split(",");
                searchBody.request.filters.language = $scope.filterSelection.lang;
            } else {
                delete searchBody.request.filters.language;
            }
    
            if ($scope.filterSelection.grade && $scope.filterSelection.grade.length) {
                $scope.filterSelection.grade = $scope.filterSelection.grade.split(",");
                searchBody.request.filters.gradeLevel = $scope.filterSelection.grade;
            } else {
                delete searchBody.request.filters.gradeLevel;
            }
    
            if ($scope.filterSelection.lessonType && $scope.filterSelection.lessonType.length) {
                $scope.filterSelection.lessonType = $scope.filterSelection.lessonType.split(",");
                searchBody.request.filters.contentType = $scope.filterSelection.lessonType;
            } else {
                delete searchBody.request.filters.contentType;
            }
            if ($scope.filterSelection.subject.length) {
                $scope.filterSelection.subject =  $scope.filterSelection.subject.split(",");
                searchBody.request.filters.subject = $scope.filterSelection.subject;
            } else {
                delete searchBody.request.filters.subject;
            }
    
            if ($scope.filterSelection.domain && $scope.filterSelection.domain.length) {
                searchBody.request.filters.domain = $scope.filterSelection.domain;
            } else {
                delete searchBody.request.filters.domain;
            }
    
            if ($scope.filterSelection.concept && $scope.filterSelection.concept.length) {
                searchBody.request.filters.concepts = $scope.filterSelection.concept;
            } else {
                delete searchBody.request.filters.concepts;
            }
    
            $scope.$safeApply();
        }


      // Sidebar - filters
      $scope.applyFilters = function(){
        ctrl.generateTelemetry({type: 'click', subtype: 'submit', target: 'filter',targetid: 'button-filter-apply'});
        
        /**Get filters values**/
        $scope.getFiltersValue();

        ctrl.searchLessons();
    };

    // Close the popup
    $scope.closePopup = function() {
        ctrl.generateTelemetry({type: 'click', subtype: 'cancel', target: 'addlesson', targetid: 'button-cancel'});
        $scope.closeThisDialog();
    };
    // Sidebar filters - Reset
    $scope.resetFilters = function() {
        ctrl.generateTelemetry({type: 'click', subtype: 'reset', target: 'filter',targetid: 'button-filter-reset'});
        $('#lessonBrowser_language').dropdown('restore defaults');
        $('#lessonBrowser_grade').dropdown('restore defaults');
        $('#lessonBrowser_lessonType').dropdown('restore defaults');
        $('#lessonBrowser_subject').dropdown('restore defaults');
        $scope.filterSelection.domain.splice(0, $scope.filterSelection.domain.length);
        $scope.filterSelection.concept.splice(0, $scope.filterSelection.concept.length);
        $scope.applyFilters();
    };
 
    // navigate to the previous page
    $scope.backToPrevious = function (){
    console.log('previous page navigation...');
    $scope.renderTemplate='selectedResult';
    // $scope.selectedItemsView=false;
     setTimeout(function(){
        $('#applyAccordion').accordion();
        $('.ui.multiple.selection.dropdown').dropdown({
            useLabels: false,
            forceSelection: false,
             onChange: function() {
                $scope.getFiltersValue();
            }
        });
        $('#lessonBrowser_lessonType').dropdown('set selected',ctrl.meta.lessonTypes[0]);
        $('#lessonBrowser_language').dropdown('set selected', $scope.filterSelection.lang);
        $('#lessonBrowser_grade').dropdown('set selected', $scope.filterSelection.grade);
        $('#lessonBrowser_subject').dropdown('set selected', $scope.filterSelection.subject);
        $scope.applyFilters();
    }, 100);

    }
    
    // initial configuration
    $scope.init = function () {
        ctrl.searchLessons();
    };
    $scope.init();

    
    // Get accordions functioning
    setTimeout(function(){
        $('#applyAccordion').accordion();
        $('.ui.multiple.selection.dropdown').dropdown({
            useLabels: false,
            forceSelection: false,
             onChange: function() {
                $scope.getFiltersValue();
            }
        });
        $('#lessonBrowser_language').dropdown('set selected', $scope.filterSelection.lang);
        $('#lessonBrowser_grade').dropdown('set selected', $scope.filterSelection.grade);
        $('#lessonBrowser_subject').dropdown('set selected', $scope.filterSelection.subject);
        $scope.applyFilters();
    }, 500);


    // Add the resource
        $scope.toggleSelectionLesson = function(lesson) {
            var idx = $scope.selectedResources.indexOf(lesson.identifier);
    
            if (idx > -1) {
                ctrl.generateTelemetry({type: 'click', subtype: 'uncheck', target: 'lesson',targetid: lesson.identifier});
                // is currently selected, remove from selection list
                $scope.lessonSelection.splice(idx, 1);
                $scope.selectedResources.splice(idx, 1);
                $('#add_'+lesson.identifier).show();
                $('#remove_'+lesson.identifier).hide();
            } else {
                ctrl.generateTelemetry({type: 'click', subtype: 'check', target: 'lesson',targetid: lesson.identifier});
                // is newly selected, add to the selection list
                $scope.lessonSelection.push(lesson);
                $scope.selectedResources.push(lesson.identifier);
                $('#add_'+lesson.identifier).hide();
                $('#remove_'+lesson.identifier).show();
            }
             if($scope.lessonSelection.length){
                 $('.viewLink').css('opacity:0;cursor:defaults');
            }
            else{
                 $('.viewLink').css('opacity:0.5;cursor:defaults');
            }
        };

        // search
        $scope.searchByKeyword = function () {
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'search', targetid: 'button-search' });
            // ecEditor.dispatchEvent("lessonplan:category:searchkey",this.searchKeyword);
            console.log('search query..',this.searchKeyword);
            searchBody.request.query = this.searchKeyword;
            searchBody.request.limit = limit;
            searchBody.request.offset = offset;

         searchService.search(searchBody, function(err, res){
            if (err) {
                ctrl.err = "Oops! Something went wrong. Please try again later.";
            } else {
                ctrl.searchRes.count = res.data.result.count;
                
                 angular.forEach(res.data.result.content, function(lessonContent){
                        ctrl.searchRes.content.push(lessonContent);
                    });
                 console.log(' ctrl.searchRes.content', ctrl.searchRes.content);
            }
        });

            // ctrl.searchLessons();
        };  

        // show selected items
        // show selected items
        $scope.SelectedItems = function () {
            console.log('show selected items');
            // $scope.selectedResult = false;
            $scope.renderTemplate='selectedItemsView';
            ctrl.res.content =  $scope.lessonSelection;
            $scope.loadmoreEnabledFlag = false;
            $scope.$safeApply();
            setTimeout(function(){
            angular.forEach($scope.lessonSelection, function(resource){
            $('#checkBox_'+resource.identifier+' >.checkBox').attr('checked', true);
            $('#add_'+resource.identifier).hide();
            $('#remove_'+resource.identifier).show();
            });
    }, 100);

        }
   
   
}]).filter('removeHTMLTags', function() {
    return function(text) {
        return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
}).filter('cut', function () {
    return function (value, wordwise, max) {
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

        return value;
    };
    
});