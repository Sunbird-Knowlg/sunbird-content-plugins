angular.module('org.ekstep.lessonbrowserapp', [])
    .controller('lessonController', ['$scope', 'instance', 'callback', 'callerFilters', function($scope, instance, callback, callerFilters) {
        var ctrl = this;
        ctrl.facetsResponse = undefined;
        $scope.headerTemplate = ecEditor.resolvePluginResource("org.ekstep.lessonbrowser", "1.3", "editor/header.html");
        $scope.footerTemplate = ecEditor.resolvePluginResource("org.ekstep.lessonbrowser", "1.3", "editor/footer.html");
        $scope.filterTemplate = ecEditor.resolvePluginResource("org.ekstep.lessonbrowser", "1.3", "editor/filterTemplate.html");
        $scope.cardTemplate = ecEditor.resolvePluginResource("org.ekstep.lessonbrowser", "1.3", "editor/cardRendererTemplate.html");
        $scope.facetsTemplate = ecEditor.resolvePluginResource("org.ekstep.lessonbrowser", "1.3", "editor/facetsRenderTemplate.html");
        //Response variable
        ctrl.res = { count: 0, content: [] };
        ctrl.err = null;


        $scope.mainTemplate = 'selectedResult';
        $scope.noResultMsg = false;
        $scope.isLoading = true;

        // telemetry pluginId and plugin version
        ctrl.lessonbrowser = instance;

        $scope.telemetry = { "pluginid": ctrl.lessonbrowser.manifest.id, "pluginver": ctrl.lessonbrowser.manifest.ver };

        //meta variable
        ctrl.meta = { "languages": {}, "grades": {}, "lessonTypes": {}, "subjects": {} };

        // Selected lessons
        $scope.lessonSelection = [];
        $scope.selectedResources = [];

        // Fetch lessons related params
        var searchBody = {
            "request": {
                "filters": {
                    "objectType": ["Content"],
                    "status": ["Live"]
                }
            }
        };

        // Selected filters
        $scope.filterSelection = { "lang": [], "grade": [], "lessonType": [], "concept": [], "subject": [] };

        //Telemetry
        var collectionService = org.ekstep.collectioneditor.api.getService('collection');
        ctrl.generateTelemetry = function(data) {
            if (data) ecEditor.getService('telemetry').interact({
                "type": data.type,
                "subtype": data.subtype,
                "target": data.target,
                "targetid": data.targetid,
                "pluginid": $scope.telemetry.pluginid,
                "pluginver": $scope.telemetry.pluginver,
                "objectid": '',
                "stage": collectionService.getActiveNode().id
            })
        };


        // Meta APIs integration
        var metaService = org.ekstep.contenteditor.api.getService(ServiceConstants.META_SERVICE);
        ctrl.learningConfig = function() {
            metaService.getLearningConfig(function(err, res) {
                if (err) {
                    ctrl.langErr = "Oops! Something went wrong with learning config. Please try again later.";
                } else {
                    ctrl.meta.languages = res.data.result.medium.values;
                    ctrl.meta.grades = res.data.result.gradeLevel.values;
                    ctrl.meta.subjects = res.data.result.subject.values;
                    $('#lessonBrowser_lessonType').dropdown('set value', ctrl.meta.lessonTypes[0]);
                    $scope.filterSelection.lessonType.push(ctrl.meta.lessonTypes[0]);
                }
                $scope.$safeApply();
            });
        };

        // Search API Integration
        var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
        ctrl.searchLessons = function() {
            searchService.search(searchBody, function(err, res) {
                if (err) {
                    ctrl.err = "Oops! Something went wrong. Please try again later.";
                } else {
                    ctrl.res = { count: 0, content: [] };
                    angular.forEach(res.data.result.content, function(lessonContent) {
                        ctrl.res.content.push(lessonContent);
                    });
                }
                $scope.isLoading = false;
                $scope.$safeApply();
                angular.forEach(ctrl.res.content, function(resource) {
                    if ($scope.selectedResources.indexOf(resource.identifier) !== -1) {
                        $('#checkBox_' + resource.identifier + ' >.checkBox').attr('checked', true);
                        $('#add_' + resource.identifier).hide();
                        $('#remove_' + resource.identifier).show();
                    } else {
                        $('#checkBox_' + resource.identifier + ' >.checkBox').attr('checked', false);
                        $('#add_' + resource.identifier).show();
                        $('#remove_' + resource.identifier).hide();
                    }
                    $('.special.cards .image').dimmer({
                        on: 'hover'
                    });
                });
            });

        };

        // Initiate concept selector
        ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
            element: 'lessonBrowser_concepts',
            selectedConcepts: [], // All composite keys except mediaType
            callback: function(concepts) {
                $scope.filterSelection.concept = [];
                angular.forEach(concepts, function(concept) {
                    $scope.filterSelection.concept.push(concept.name);
                });
                $scope.$safeApply();
            }
        });

        // Search specific lesson
        $scope.lessonBrowseSearch = function() {
            $scope.noResultMsg = false;
            searchBody.request.query = this.searchKeyword;
            ctrl.searchLessons();
            ctrl.searchRes = { count: 0, content: [] };
        }

        // get filters value
        $scope.getFiltersValue = function() {
            /** Get value from dropdown**/
            $scope.filterSelection.lang = $('#lessonBrowser_language').dropdown('get value');
            $scope.filterSelection.grade = $('#lessonBrowser_grade').dropdown('get value');
            $scope.filterSelection.lessonType = $('#lessonBrowser_lessonType').dropdown('get value');
            $scope.filterSelection.subject = $('#lessonBrowser_subject').dropdown('get value');
            if ($scope.filterSelection.lang.length) {
                $scope.filterSelection.lang = $scope.filterSelection.lang.split(",");
                searchBody.request.filters.language = $scope.filterSelection.lang;
            } else {
                delete searchBody.request.filters.language;
            }

            if ($scope.filterSelection.grade.length) {
                $scope.filterSelection.grade = $scope.filterSelection.grade.split(",");
                searchBody.request.filters.gradeLevel = $scope.filterSelection.grade;
            } else {
                delete searchBody.request.filters.gradeLevel;
            }

            if ($scope.filterSelection.lessonType.length) {
                $scope.filterSelection.lessonType = $scope.filterSelection.lessonType.split(",");
                searchBody.request.filters.contentType = $scope.filterSelection.lessonType;
            } else {
                delete searchBody.request.filters.contentType;
            }
            if ($scope.filterSelection.subject.length) {
                $scope.filterSelection.subject = $scope.filterSelection.subject.split(",");
                searchBody.request.filters.subject = $scope.filterSelection.subject;
            } else {
                delete searchBody.request.filters.subject;
            }

            if ($scope.filterSelection.concept.length) {
                searchBody.request.filters.concepts = $scope.filterSelection.concept;
            } else {
                delete searchBody.request.filters.concepts;
            }
            $scope.$safeApply();
        }


        // Sidebar - filters
        $scope.applyFilters = function() {
            $scope.isLoading = true;
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'filter', targetid: 'button-filter-apply' });
            $scope.getFiltersValue(); /**Get filters values**/
            ctrl.searchLessons();
        };

        // Close the popup
        $scope.closePopup = function() {
            ctrl.generateTelemetry({ type: 'click', subtype: 'cancel', target: 'addlesson', targetid: 'button-cancel' });
            $scope.closeThisDialog();
        };
        // Sidebar filters - Reset
        $scope.resetFilters = function() {
            ctrl.generateTelemetry({ type: 'click', subtype: 'reset', target: 'filter', targetid: 'button-filter-reset' });
            $('#lessonBrowser_language').dropdown('restore defaults');
            $('#lessonBrowser_grade').dropdown('restore defaults');
            $('#lessonBrowser_lessonType').dropdown('restore defaults');
            $('#lessonBrowser_subject').dropdown('restore defaults');
            $scope.filterSelection.concept.splice(0, $scope.filterSelection.concept.length);
            $scope.applyFilters();
        };

        // navigate to the previous page
        $scope.backToPrevious = function() {
            $scope.mainTemplate = 'selectedResult';
            $scope.isLoading = true;
            setTimeout(function() {
                $('#applyAccordion').accordion();
                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
                $('.ui.multiple.selection.dropdown').dropdown({
                    useLabels: false,
                    forceSelection: false,
                    onChange: function() {
                        $scope.getFiltersValue();
                    }
                });
                $('#lessonBrowser_lessonType').dropdown('set selected', ctrl.meta.lessonTypes[0]);
                $scope.applyFilters();
            }, 100);

        }

        // initial configuration
        $scope.init = function() {
            if (!$scope.filterSelection.lessonType.length) {
                ctrl.meta.lessonTypes = collectionService.getObjectTypeByAddType('Browser');
                searchBody.request.filters.contentType = ctrl.meta.lessonTypes[0];
            }
            ctrl.searchLessons();
            ctrl.learningConfig(); // Fetch sidebar filters through APIs
        };
        $scope.init();


        // Get accordions functioning
        setTimeout(function() {
            $('#applyAccordion').accordion();
            $('.ui.multiple.selection.dropdown').dropdown({
                useLabels: false,
                forceSelection: false,
                onChange: function() {
                    $scope.getFiltersValue();
                }
            });
        }, 300);


        // Add the resource
        $scope.toggleSelectionLesson = function(lesson) {
            var idx = $scope.selectedResources.indexOf(lesson.identifier);
            if (idx > -1) {
                ctrl.generateTelemetry({ type: 'click', subtype: 'uncheck', target: 'lesson', targetid: lesson.identifier });
                $scope.lessonSelection.splice(idx, 1); // is currently selected, remove from selection list
                $scope.selectedResources.splice(idx, 1);
                $('#add_' + lesson.identifier).show();
                $('#remove_' + lesson.identifier).hide();
            } else {
                ctrl.generateTelemetry({ type: 'click', subtype: 'check', target: 'lesson', targetid: lesson.identifier });
                $scope.lessonSelection.push(lesson); // is newly selected, add to the selection list
                $scope.selectedResources.push(lesson.identifier);
                $('#add_' + lesson.identifier).hide();
                $('#remove_' + lesson.identifier).show();
            }
        };

        // search
        $scope.searchByKeyword = function() {
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'search', targetid: 'button-search' });
            searchBody.request.query = this.searchKeyword;
            searchService.search(searchBody, function(err, res) {
                if (err) {
                    ctrl.searchErr = "Oops! Something went wrong. Please try again later.";
                } else {
                    ctrl.searchRes = { count: 0, content: [] };
                    ctrl.searchRes.count = res.data.result.count;
                    angular.forEach(res.data.result.content, function(lessonContent) {
                        ctrl.searchRes.content.push(lessonContent);
                    });
                    if (!ctrl.searchRes.content.length) {
                        $scope.noResultMsg = true;
                    }
                    $scope.$safeApply();
                }
            });
        };

        // show selected items
        $scope.SelectedItems = function() {
            $scope.mainTemplate = 'addedItemsView';
            ctrl.res.content = $scope.lessonSelection;
            $scope.$safeApply();
            setTimeout(function() {
                angular.forEach($scope.lessonSelection, function(resource) {
                    $('#checkBox_' + resource.identifier + ' >.checkBox').attr('checked', true);
                    $('#add_' + resource.identifier).hide();
                    $('#remove_' + resource.identifier).show();
                });
            }, 100);
        }

        // searcher selected lesson
        $scope.searchSelectedLesson = function(selectedLesson) {
            searchBody.request.query = selectedLesson;
            ctrl.searchLessons();
            ctrl.searchRes = [];
            this.searchKeyword.length = 0;
            $scope.$safeApply();
        }

        $scope.getPageAssemble = function(cb) {
            let Obj = {
                request: {
                    source: "web",
                    name: 'LessonBrowser',
                    sort_by: {
                        "createdOn": "desc"
                    }
                }
            }
            let service = org.ekstep.contenteditor.api.getService(ServiceConstants.META_SERVICE);
            service.getPageAssemble(Obj, function(err, res) {
                // Initialize the model
                cb(err, response)
            })

        }
       
        $scope.invokeFacetsPage = function() {
            $scope.mainTemplate = 'facetsItemView';
            if (!ctrl.facetsResponse) {
                $scope.getPageAssemble(function(err, response) {
                    ctrl.facetsResponse = response;
                    console.log("Facets Response",ctrl.facetsResponse);
                    console.log("$ctrl.facetsResponse.result.response.section.length",ctrl.facetsResponse.result.response.sections.length)
                });
            }
        }

        $scope.serachContents = function(query){
            searchService.search(query, function(err, res){
                if(res){
                    
                }
            });
        }

        $scope.invokeFacetsPage();

    }]).filter('removeHTMLTags', function() {
        return function(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }).filter('cut', function() {
        return function(value, wordwise, max) {
            if (!value) return '';
            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;
            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }
            return value;
        };

    });