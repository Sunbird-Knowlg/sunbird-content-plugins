angular.module('org.ekstep.lessonbrowserapp', ['angular-inview'])
    .controller('lessonController', ['$scope', '$timeout', 'instance', 'callback', 'callerFilters', function($scope, $timeout, instance, callback, callerFilters) {
        var ctrl = this;
        ctrl.facetsResponse = undefined;
        const DEFAULT_PAGEAPI = 'ContentBrowser';
        // different html configuration to render dynamically
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

        // concept request body
        var conceptRequestBody = {
            "request": {
                "filters": {
                    "objectType": ["Concept"],
                    "identifier": []
                }
            }
        }

        // Selected filters
        $scope.filterSelection = { "lang": [], "grade": [], "lessonType": [], "concept": [], "subject": [] };

        //Telemetry
        var collectionService = org.ekstep.collectioneditor.api.getService('collection');

        // Generate interact telemetry
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

        // Generate Impression telemetry
        ctrl.generateImpression = function(data) {
            if (data) ecEditor.getService('telemetry').impression({
                "type": data.type,
                "subtype": data.subtype || "",
                "pageid": data.pageid || "",
                "uri": window.location.href,
                "visits": inViewLogs
            });
        }


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


        ctrl.searchConcepts = function(content) {
            angular.forEach(content, function(content, contentIndex) {
                conceptRequestBody.request.filters.identifier = content.concepts;
                searchService.search(conceptRequestBody, function(err, res) {
                    if (err) {
                        ctrl.err = "Oops! Something went wrong. Please try again later.";
                    } else {
                        if (res.data.result.concepts !== (undefined || null)) {
                            if (res.data.result.concepts.length === 1) {
                                var conceptNames = [];
                                conceptNames.push(res.data.result.concepts[0].name);
                            } else {
                                angular.forEach(res.data.result.concepts, function(concept) {
                                    var conceptNames = [];
                                    conceptNames.push(concept.name);
                                });
                            }
                            ctrl.res.content[contentIndex].concepts = conceptNames;
                        } else {
                            ctrl.res.content[contentIndex].concepts = [];
                        }
                    }
                });
            });

        }

        // Search API Integration
        var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
        ctrl.searchLessons = function(callback) {
            searchService.search(searchBody, function(err, res) {
                if (err) {
                    ctrl.err = "Oops! Something went wrong. Please try again later.";
                } else {
                    ctrl.res = { count: 0, content: [] };
                    ctrl.res.content = res.data.result.content;
                    ctrl.searchConcepts(ctrl.res.content);
                }
                $scope.$safeApply();
                ctrl.addOrRemoveContent(ctrl.res.content);
                ctrl.conceptSelector();
                ctrl.dropdownAndCardsConfig();
                $timeout(function() {
                    $scope.isLoading = false;
                }, 200);
            });
            return callback(true);
        };

        // Add or Remove resources
        ctrl.addOrRemoveContent = function(Contents) {
            angular.forEach(Contents, function(resource) {
                if ($scope.selectedResources.indexOf(resource.identifier) !== -1) {
                    ecEditor.jQuery('#checkBox_' + resource.identifier + ' >.checkBox').attr('checked', true);
                } else {
                    ecEditor.jQuery('#checkBox_' + resource.identifier + ' >.checkBox').attr('checked', false);
                }
            });
        }

        // show card details
        $scope.showCardDetails = function(lesson) {
            $scope.previousPage = $scope.mainTemplate;
            if ($scope.mainTemplate == 'selectedResult') {
                $scope.defaultResources = ctrl.res.content;
            }
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
        }

        // Search specific lesson
        $scope.lessonBrowseSearch = function() {
            $scope.noResultMsg = false;
            $scope.isLoading = true;
            searchBody.request.query = this.searchKeyword;
            ctrl.searchLessons(function(res) {
                ctrl.searchRes = { count: 0, content: [] };
            });

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
            ctrl.searchLessons(function(res) {});
        };

        // Close the popup
        $scope.closePopup = function(pageId) {
            if (pageId == "facetsItemView") {
                ctrl.generateImpression({ type: 'click', subtype: 'close', pageid: 'FacetList' });
            } else {
                ctrl.generateImpression({ type: 'click', subtype: 'close', pageid: 'LessonBrowser' });
            }
            inViewLogs = [];
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
            if ($scope.mainTemplate == 'selectedResult') {
                $scope.mainTemplate = 'facetsItemView';
            } else if ($scope.mainTemplate == 'addedItemsView') {
                $scope.mainTemplate = 'selectedResult';
                ctrl.res.content = $scope.defaultResources;
            } else {
                $scope.mainTemplate = $scope.previousPage;
                if ($scope.mainTemplate == 'selectedResult') {
                    ctrl.res.content = $scope.defaultResources;
                }
            }
            $scope.$safeApply();
            $timeout(function() {
                ctrl.addOrRemoveContent(ctrl.res.content);
                ctrl.conceptSelector();
                ctrl.dropdownAndCardsConfig();
            }, 0);
        }

        // Get accordions functioning
        ctrl.dropdownAndCardsConfig = function() {
            ecEditor.jQuery('#applyAccordion').accordion();
            ecEditor.jQuery('.special.cards .card').dimmer({
                on: 'hover'
            });
            ecEditor.jQuery('.ui.multiple.selection.dropdown').dropdown({
                useLabels: false,
                forceSelection: false,
                onChange: function() {
                    $scope.getFiltersValue();
                }
            });
            ecEditor.jQuery('#lessonBrowser_lessonType').dropdown('set selected', ctrl.meta.lessonTypes[0]);
        }

        // Add the resource
        $scope.toggleSelectionLesson = function(lesson, event, clickOption) {
            var idx = $scope.selectedResources.indexOf(lesson.identifier);
            if (idx > -1) {
                ctrl.generateTelemetry({ type: 'click', subtype: 'uncheck', target: 'lesson', targetid: lesson.identifier });
                $scope.lessonSelection.splice(idx, 1); // is currently selected, remove from selection list
                $scope.selectedResources.splice(idx, 1);
                ecEditor.jQuery('#checkBox_' + lesson.identifier + ' >.checkBox').prop('checked', false);
            } else {
                ctrl.generateTelemetry({ type: 'click', subtype: 'check', target: 'lesson', targetid: lesson.identifier });
                $scope.lessonSelection.push(lesson); // is newly selected, add to the selection list
                $scope.selectedResources.push(lesson.identifier);
                ecEditor.jQuery('#checkBox_' + lesson.identifier + ' >.checkBox').prop('checked', true);
            }
        };

        // search
        $scope.searchByKeyword = function() {
            ecEditor.jQuery('.searchLoader').addClass('active');
            $scope.searchStatus = "start";
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'search', targetid: 'button-search' });
            searchBody.request.query = this.searchKeyword;
            searchService.search(searchBody, function(err, res) {
                if (err) {
                    ctrl.searchErr = "Oops! Something went wrong. Please try again later.";
                } else {
                    ctrl.searchRes = { count: 0, content: [] };
                    $scope.searchStatus = "end";
                    ecEditor.jQuery('.searchLoader').removeClass('active');
                    ctrl.searchRes.count = res.data.result.count;
                    if (res.data.result.content) {
                        ctrl.searchRes.content = res.data.result.content;
                        ctrl.searchConcepts(ctrl.searchRes.content);
                    }
                    if (!res.data.result.content) {
                        $scope.noResultMsg = true;
                    }
                    $scope.$safeApply();
                }
            });
        };

        // show selected items
        $scope.SelectedItems = function() {
            $scope.previousPage = $scope.mainTemplate;
            $scope.defaultResources = ctrl.res.content;
            $scope.mainTemplate = 'addedItemsView';
            ctrl.res.content = $scope.lessonSelection;
            $scope.$safeApply();
            $timeout(function() {
                ctrl.addOrRemoveContent($scope.lessonSelection);
                ctrl.dropdownAndCardsConfig();
            }, 0);
        }

        $scope.getPageAssemble = function(cb) {
            let Obj = {
                request: {
                    source: "web",
                    name: ecEditor.getContext('pageAPI') || DEFAULT_PAGEAPI,
                    sort_by: {
                        "createdOn": "desc"
                    }
                }
            }
            let service = org.ekstep.contenteditor.api.getService(ServiceConstants.META_SERVICE);
            service.getPageAssemble(Obj, function(err, res) {
                // Initialize the model
                cb(err, res)
            })

        }

        $scope.invokeFacetsPage = function() {
            $scope.mainTemplate = 'facetsItemView';
            if (!ctrl.facetsResponse) {
                $scope.getPageAssemble(function(err, res) {
                    if (!res) {
                        ctrl.facetsResponse = res.data;
                        angular.forEach(ctrl.facetsResponse.result.response.sections, function(section, sectionIndex) {
                            angular.forEach(section.contents, function(content, contentIndex) {
                                if (content.concepts !== undefined) {
                                    conceptRequestBody.request.filters.identifier = content.concepts;
                                    searchService.search(conceptRequestBody, function(err, res) {
                                        if (err) {
                                            ctrl.err = "Oops! Something went wrong. Please try again later.";
                                        } else {
                                            var conceptNames = [];
                                            if (res.data.result.concepts.length === 1) {
                                                conceptNames.push(res.data.result.concepts[0].name);
                                            } else {
                                                angular.forEach(res.data.result.concepts, function(concept) {
                                                    conceptNames.push(concept.name);
                                                });
                                            }
                                            ctrl.facetsResponse.result.response.sections[sectionIndex].contents[contentIndex].concepts = conceptNames;
                                        }

                                    });
                                } else {
                                    ctrl.facetsResponse.result.response.sections[sectionIndex].contents[contentIndex].concepts = [];
                                }

                            });
                        });
                        $scope.$safeApply();
                        $timeout(function() {
                            ctrl.addOrRemoveContent(ctrl.res.content);
                            ctrl.dropdownAndCardsConfig();
                        }, 0);
                        $scope.isLoading = false;
                    } else {
                        console.error("Unable to fetch response", err);
                    }
                });
            }
        }

        // show all the contents of particular resource
        $scope.viewAll = function(query) {
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'viewAll', targetid: "" });
            if (_.isString(query)) {
                query = JSON.parse(query);
            }
            if (!$scope.items) {
                $scope.isLoading = true;
                query.request.limit = limit;
                searchBody = query;
                ctrl.searchLessons(function(res) {
                    $scope.mainTemplate = 'selectedResult';
                    $scope.defaultResources = ctrl.res.content;

                });
            } else {
                $scope.mainTemplate = 'selectedResult';
                ctrl.res.content = $scope.defaultResources;
                $scope.$safeApply();
                $timeout(function() {
                    ctrl.addOrRemoveContent(ctrl.res.content);
                    ctrl.conceptSelector();
                    ctrl.dropdownAndCardsConfig();
                }, 0);
            }

        }

        // Sort the resources
        $scope.Sort = function(option) {
            if (option == 'alphabetical') {
                $scope.sortOption = 'name';
            } else {
                $scope.sortOption = 'createdOn';
            }
        }

        var inViewLogs = [];
        $scope.lineInView = function(index, inview, item, section, pageSectionId) {
            var obj = _.filter(inViewLogs, function(o) {
                return o.identifier === item.identifier
            })
            if (inview && obj.length === 0) {
                inViewLogs.push({
                    objid: item.identifier,
                    objtype: item.contentType,
                    section: section,
                    index: index
                })
            }
        }

        // Get and return the selected lessons
        $scope.returnSelectedLessons = function(pageId, selectedLessons) {
            // Geenerate interact telemetry
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'addlesson', targetid: 'button-add' });

            // return selected lessons to the lesson browser caller
            var err = null;
            var res = selectedLessons;
            callback(err, res);

            // generate impression
            if (pageId == "facetsItemView") {
                ctrl.generateImpression({ type: 'click', subtype: 'submit', pageid: 'FacetList' });
            } else {
                ctrl.generateImpression({ type: 'click', subtype: 'submit', pageid: 'LessonBrowser' });

            }
            inViewLogs = [];

            // close the popup
            $scope.closeThisDialog();
        };

        // refresh searcher
        $scope.refreshSearch = function() {
            this.searchKeyword = '';
        }
        // initial configuration
        $scope.init = function() {
            if (!$scope.filterSelection.lessonType.length) {
                ctrl.meta.lessonTypes = collectionService.getObjectTypeByAddType('Browser');
                searchBody.request.filters.contentType = ctrl.meta.lessonTypes[0];
            }
            $scope.invokeFacetsPage();
            $timeout(function() {
                ctrl.learningConfig(); // Fetch sidebar filters through APIs
                ctrl.dropdownAndCardsConfig();
                if (instance.client) {
                    $scope.viewAll(instance.query);
                }
            }, 100);
        };
        $scope.init();

    }]);

// slider directive
angular.module('org.ekstep.lessonbrowserapp').directive('flexslider', function() {
    return {
        link: function(scope, element, attrs) {
            element.flexslider({
                animation: "slide",
                slideshow: false,
                controlNav: true,
                directionNav: true,
                prevText: "",
                nextText: ""
            });
        }
    }
});