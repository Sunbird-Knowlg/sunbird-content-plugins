angular.module('org.ekstep.lessonbrowserapp', [])
    .controller('lessonController', ['$scope', 'instance', 'callback', 'callerFilters', function($scope, instance, callback, callerFilters) {
        var ctrl = this;
        ctrl.facetsResponse = undefined;
        $scope.headerTemplate = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/header.html");
        $scope.footerTemplate = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/footer.html");
        $scope.filterTemplate = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/filterTemplate.html");
        $scope.cardTemplate = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/cardRendererTemplate.html");
        $scope.facetsTemplate = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/facetsRenderTemplate.html");
        $scope.cardDetailsTemplate = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/cardDetailsTemplate.html");
        ctrl.contentNotFoundImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/contentNotFound.jpg");
        //Response variable
        ctrl.res = { count: 0, content: [] };
        ctrl.err = null;


        $scope.mainTemplate = 'selectedResult';
        $scope.noResultMsg = false;
        $scope.isLoading = true;
        $scope.sortOption = 'name';
        $scope.defaultResources = [];
        $scope.lessonView = {};

        // telemetry pluginId and plugin version
        ctrl.lessonbrowser = instance;

        $scope.telemetry = { "pluginid": ctrl.lessonbrowser.manifest.id, "pluginver": ctrl.lessonbrowser.manifest.ver };

        //meta variable
        ctrl.meta = { "languages": {}, "grades": {}, "lessonTypes": {}, "subjects": {} };

        // Selected lessons
        $scope.lessonSelection = [];
        $scope.selectedResources = [];
        var limit = 100;

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
                    ecEditor.jQuery('#lessonBrowser_lessonType').dropdown('set value', ctrl.meta.lessonTypes[0]);
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
                ctrl.addOrRemoveContent(ctrl.res.content);
            });

        };

        // Add or Remove resources
        ctrl.addOrRemoveContent = function(Contents) {
            angular.forEach(Contents, function(resource) {
                if ($scope.selectedResources.indexOf(resource.identifier) !== -1) {
                    ecEditor.jQuery('#checkBox_' + resource.identifier + ' >.checkBox').attr('checked', true);
                } else {
                    ecEditor.jQuery('#checkBox_' + resource.identifier + ' >.checkBox').attr('checked', false);
                }
                ecEditor.jQuery('.special.cards .card').dimmer({
                    on: 'hover'
                });
            });
            $scope.isLoading = false;
        }

        // show card details
        $scope.showCardDetails = function(lesson) {
            $scope.defaultResources = ctrl.res.content;
            $scope.mainTemplate = 'cardDetailsView';
            $scope.lessonView = lesson;
        }

        // Initiate concept selector
        ctrl.conceptSelector = function() {
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
            // $scope.isLoading=false;
        }

        // Search specific lesson
        $scope.lessonBrowseSearch = function() {
            $scope.noResultMsg = false;
            $scope.isLoading = true;
            searchBody.request.query = this.searchKeyword;
            ctrl.searchLessons();
            ctrl.searchRes = { count: 0, content: [] };
        }

        // get filters value
        $scope.getFiltersValue = function() {
            /** Get value from dropdown**/
            $scope.filterSelection.lang = ecEditor.jQuery('#lessonBrowser_language').dropdown('get value');
            $scope.filterSelection.grade = ecEditor.jQuery('#lessonBrowser_grade').dropdown('get value');
            $scope.filterSelection.lessonType = ecEditor.jQuery('#lessonBrowser_lessonType').dropdown('get value');
            $scope.filterSelection.subject = ecEditor.jQuery('#lessonBrowser_subject').dropdown('get value');
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
            ecEditor.jQuery('#lessonBrowser_language').dropdown('restore defaults');
            ecEditor.jQuery('#lessonBrowser_grade').dropdown('restore defaults');
            ecEditor.jQuery('#lessonBrowser_concepts').dropdown('restore defaults');
            ecEditor.jQuery('#lessonBrowser_subject').dropdown('restore defaults');
            ecEditor.jQuery('#lessonBrowser_lessonType').dropdown('set value', ctrl.meta.lessonTypes[0]);
            $scope.filterSelection.concept.splice(0, $scope.filterSelection.concept.length);
        };

        // navigate to the previous page
        $scope.backToPrevious = function() {
            $scope.mainTemplate = 'selectedResult';
            $scope.isLoading = true;
            setTimeout(function() {
                ctrl.addOrRemoveContent(ctrl.res.content);
                ctrl.dropdownConfig();
                ctrl.conceptSelector();
            }, 0);
            ctrl.res.content = $scope.defaultResources;
            $scope.$safeApply();
            $scope.isLoading = false;
        }

        // Get accordions functioning
        ctrl.dropdownConfig = function() {
            ecEditor.jQuery('#applyAccordion').accordion();
            ecEditor.jQuery('.ui.multiple.selection.dropdown').dropdown({
                useLabels: false,
                forceSelection: false,
                onChange: function() {
                    $scope.getFiltersValue();
                }
            });
            ecEditor.jQuery('#lessonBrowser_lessonType').dropdown('set selected', ctrl.meta.lessonTypes[0]);
            // $scope.isLoading=false;
        }

        // initial configuration
        $scope.init = function() {
            if (!$scope.filterSelection.lessonType.length) {
                ctrl.meta.lessonTypes = collectionService.getObjectTypeByAddType('Browser');
                searchBody.request.filters.contentType = ctrl.meta.lessonTypes[0];
            }

            ctrl.searchLessons();
            setTimeout(function() {
                ctrl.learningConfig(); // Fetch sidebar filters through APIs
                ctrl.dropdownConfig();
            }, 0);
        };
        $scope.init();

        // Add the resource
        $scope.toggleSelectionLesson = function(lesson, event, clickOption) {
            var idx = $scope.selectedResources.indexOf(lesson.identifier);
            if (idx > -1) {
                ctrl.generateTelemetry({ type: 'click', subtype: 'uncheck', target: 'lesson', targetid: lesson.identifier });
                $scope.lessonSelection.splice(idx, 1); // is currently selected, remove from selection list
                $scope.selectedResources.splice(idx, 1);
                $('#checkBox_' + lesson.identifier + ' >.checkBox').prop('checked', false);
            } else {
                ctrl.generateTelemetry({ type: 'click', subtype: 'check', target: 'lesson', targetid: lesson.identifier });
                $scope.lessonSelection.push(lesson); // is newly selected, add to the selection list
                $scope.selectedResources.push(lesson.identifier);
                $('#checkBox_' + lesson.identifier + ' >.checkBox').prop('checked', true);
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
            $scope.defaultResources = ctrl.res.content;
            ctrl.res.content = $scope.lessonSelection;
            $scope.$safeApply();
            setTimeout(function() {
                ctrl.addOrRemoveContent($scope.lessonSelection);
            }, 0);
        }

        // searcher selected lesson
        $scope.searchSelectedLesson = function(selectedLesson) {
            searchBody.request.query = selectedLesson;
            ctrl.searchLessons();
            ctrl.searchRes = [];
            $scope.noResultMsg = false;
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
                $scope.getPageAssemble(function(err, res) {
                    if (res) {
                        ctrl.facetsResponse =res;
                    } else {
                        console.error("Unable to fetch response", err);
                    }
                });
            }
        }

        $scope.viewAll = function(query) {
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'viewAll', targetid: "" });
            $scope.isLoading = true;
            if (_.isString(query)) {
                query = JSON.parse(query);
            }
            if (!$scope.items) {
                query.request.limit = limit;
                searchService.search(query, function(err, res) {
                    if (res) {
                        $scope.items = res;
                        ctrl.res.content = $scope.items.data.result.content;
                        $scope.mainTemplate = 'selectedResult';
                        $scope.$safeApply();
                        setTimeout(function() {
                            ctrl.addOrRemoveContent(ctrl.res.content);
                            ctrl.dropdownConfig();
                            ctrl.conceptSelector();
                        }, 0);
                    } else {
                        console.error("Unable to fetch", err);
                    }
                });
            }
        }

        $scope.invokeFacetsPage();

        // Sort the resources
        $scope.Sort = function(option) {
            if (option == 'alphabetical') {
                $scope.sortOption = 'name';
            } else {
                $scope.sortOption = 'createdOn';
            }
        }

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