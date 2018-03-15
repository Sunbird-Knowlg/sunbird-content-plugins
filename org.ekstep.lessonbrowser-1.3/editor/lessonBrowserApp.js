angular.module('org.ekstep.lessonbrowserapp', ['angular-inview', 'luegg.directives'])
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
        ctrl.contentNotFoundImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/content_not_found.jpg");
        ctrl.defaultImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/default_image.png");

        //Response variable
        ctrl.res = { count: 0, content: [] };
        ctrl.err = null;
        ctrl.concepts = '';
        ctrl.searchRes = { count: 0, content: [] };

        $scope.mainTemplate = '';
        $scope.isLoading = true;
        $scope.isCardSearching = false;
        $scope.sortOption = 'name';
        $scope.defaultResources = [];
        $scope.lessonView = {};
        $scope.viewAllAvailableResponse = {};
        $scope.conceptsNames = {};
        $scope.noResultFound = false;
        $scope.glued = false;

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
        $scope.filterSelection = { "language": [], "grade": [], "lessonType": [], "concept": [], "subject": [] };

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
                }
                $scope.$safeApply();
            });
        };

        // get the concepts name based on concept ids
        ctrl.searchConcepts = function(content, cb) {
            angular.forEach(content, function(content) {
                conceptRequestBody.request.filters.identifier = (content.concepts) ? conceptRequestBody.request.filters.identifier.concat(content.concepts) : conceptRequestBody.request.filters.identifier;
            });
            conceptRequestBody.request.filters.identifier = conceptRequestBody.request.filters.identifier.filter(function(currentValue, index, array) {
                return index === array.indexOf(currentValue);
            });
            searchService.search(conceptRequestBody, function(err, res) {
                if (err) {
                    ctrl.err = "Oops! Something went wrong. Please try again later.";
                } else {
                    angular.forEach(res.data.result.concepts, function(concept) {
                        $scope.conceptsNames[concept.identifier] = concept.name;
                    });
                    $scope.$safeApply();
                    $timeout(function() {
                        ctrl.toggleContent(ctrl.res.content);
                        ctrl.conceptSelector();
                        ecEditor.jQuery('.special.cards .image').dimmer({
                            on: 'hover'
                        });
                    }, 0);
                }
                return cb();
            });
        }

        // Search API Integration
        var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
        ctrl.searchLessons = function(callback) {
            searchService.search(searchBody, function(err, res) {
                if (err) {
                    ctrl.err = "Oops! Something went wrong. Please try again later.";
                    return callback(true);
                } else {
                    ctrl.res = { count: 0, content: [] };
                    ctrl.res.content = res.data.result.content;
                    if (ctrl.res.content) {
                        ctrl.searchConcepts(ctrl.res.content, function() {
                            ecEditor.jQuery('#noLessonMsg').hide();
                            return callback(true);
                        });
                    } else {
                        return callback(false);
                    }
                }
            });
        };

        // Add or Remove resources
        ctrl.toggleContent = function(Contents) {
            angular.forEach(Contents, function(resource) {
                if ($scope.selectedResources.indexOf(resource.identifier) !== -1) {
                    ecEditor.jQuery('#checkBox_' + resource.identifier + ' >.checkBox').prop('checked', true);
                } else {
                    ecEditor.jQuery('#checkBox_' + resource.identifier + ' >.checkBox').prop('checked', false);
                }
            });
        }

        // show card details
        $scope.showCardDetails = function(lesson) {
            ecEditor.jQuery('#resourceSearch').val(lesson.name);
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
                    ctrl.concepts = concepts.length + ' selected';
                    $scope.filterSelection.concept = [];
                    angular.forEach(concepts, function(concept) {
                        $scope.filterSelection.concept.push(concept.name);
                    });
                    $scope.$safeApply();
                }
            });
        }

        // apply all jquery after dom render
        ctrl.applyAllJquery = function() {
            $timeout(function() {
                ctrl.toggleContent(ctrl.res.content);
                ctrl.conceptSelector();
                ctrl.dropdownAndCardsConfig();
                ctrl.setFilterValues();
                ecEditor.jQuery('#resourceSearch').val('');
            }, 0);
        }

        // Search specific lesson
        $scope.lessonBrowserSearch = function() {
            $scope.isCardSearching = true;
            ctrl.searchRes = { count: 0, content: [] };
            searchBody.request.filters.name = { "value": this.searchKeyword };
            ctrl.searchLessons(function(res) {
                $scope.isCardSearching = false;
                $scope.noResultFound = false;
                ctrl.applyAllJquery();
            });
        }

        // get filters value
        $scope.getFiltersValue = function() {
            /** Get value from dropdown**/
            $scope.filterSelection.language = ecEditor.jQuery('#lessonBrowser_language').dropdown('get value');
            $scope.filterSelection.grade = ecEditor.jQuery('#lessonBrowser_grade').dropdown('get value');
            $scope.filterSelection.lessonType = ecEditor.jQuery('#lessonBrowser_lessonType').dropdown('get value');
            $scope.filterSelection.subject = ecEditor.jQuery('#lessonBrowser_subject').dropdown('get value');

            if ($scope.filterSelection.language.length) {
                $scope.filterSelection.language = _.isString($scope.filterSelection.language) ? $scope.filterSelection.language.split(",") : $scope.filterSelection.language;
                searchBody.request.filters.language = $scope.filterSelection.language;
            } else {
                delete searchBody.request.filters.language;
            }
            if ($scope.filterSelection.grade.length) {
                $scope.filterSelection.grade = _.isString($scope.filterSelection.grade) ? $scope.filterSelection.grade.split(",") : $scope.filterSelection.grade;
                searchBody.request.filters.gradeLevel = $scope.filterSelection.grade;
            } else {
                delete searchBody.request.filters.gradeLevel;
            }
            if ($scope.filterSelection.lessonType.length) {
                $scope.filterSelection.lessonType = _.isString($scope.filterSelection.lessonType) ? $scope.filterSelection.lessonType.split(",") : $scope.filterSelection.lessonType;
                searchBody.request.filters.contentType = $scope.filterSelection.lessonType;
            } else {
                searchBody.request.filters.contentType = ctrl.meta.lessonTypes;
            }
            if ($scope.filterSelection.subject.length) {
                $scope.filterSelection.subject = _.isString($scope.filterSelection.subject) ? $scope.filterSelection.subject.split(",") : $scope.filterSelection.subject;
                searchBody.request.filters.subject = $scope.filterSelection.subject;
            } else {
                delete searchBody.request.filters.subject;
            }
            if ($scope.filterSelection.concept.length) {
                $scope.filterSelection.concept = _.isString($scope.filterSelection.concept) ? $scope.filterSelection.concept.split(",") : $scope.filterSelection.concept;
                searchBody.request.filters.concepts = $scope.filterSelection.concept;
            } else {
                delete searchBody.request.filters.concepts;
            }
            $scope.$safeApply();
        }


        // Sidebar - filters
        $scope.applyFilters = function() {
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'filter', targetid: 'button-filter-apply' });
            searchBody = {
                "request": {
                    "filters": {
                        "objectType": ["Content"],
                        "status": ["Live"]
                    },
                    "query": ""
                }
            };
            $scope.getFiltersValue(); /**Get filters values**/
            $scope.isCardSearching = true;
            ctrl.searchLessons(function(res) {
                $scope.isCardSearching = false;
                $scope.$safeApply();
                if (!res) {
                    ecEditor.jQuery('#noLessonMsg').show();
                } else {
                    ecEditor.jQuery('#noLessonMsg').hide();
                }
            });
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
            $scope.isCardSearching = true;
            ecEditor.jQuery('#lessonBrowser_lessonType').dropdown('restore defaults');
            ecEditor.jQuery('#lessonBrowser_language').dropdown('restore defaults');
            ecEditor.jQuery('#lessonBrowser_grade').dropdown('restore defaults');
            ecEditor.jQuery('#lessonBrowser_concepts').val('');
            ecEditor.jQuery('#lessonBrowser_subject').dropdown('restore defaults');
            if ($scope.filterSelection.concept.length) {
                $scope.filterSelection.concept.splice(0, $scope.filterSelection.concept.length);
            }
            if ($scope.filterSelection.subject.length) {
                $scope.filterSelection.subject.splice(0, $scope.filterSelection.subject.length);
            }
            if ($scope.filterSelection.grade.length) {
                $scope.filterSelection.grade.splice(0, $scope.filterSelection.grade.length);
            }
            if ($scope.filterSelection.language.length) {
                $scope.filterSelection.language.splice(0, $scope.filterSelection.language.length);
            }
            if ($scope.filterSelection.lessonType.length) {
                $scope.filterSelection.lessonType.splice(0, $scope.filterSelection.lessonType.length);
            }
            searchBody = {
                "request": {
                    "filters": {
                        "objectType": ["Content"],
                        "status": ["Live"]
                    },
                    "query": ""
                }
            };
            searchBody.request.filters.contentType = ctrl.meta.lessonTypes
            ctrl.searchLessons(function(res) {
                $scope.isCardSearching = false;
            });

        };

        // navigate to the previous page
        $scope.backToPrevious = function() {
            ctrl.searchRes = { count: 0, content: [] };
            $scope.noResultFound = false;
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
            ctrl.applyAllJquery();
        }

        // Get accordions functioning
        ctrl.dropdownAndCardsConfig = function() {
            ecEditor.jQuery('.special.cards .image').dimmer({
                on: 'hover'
            });
            ecEditor.jQuery('.ui.multiple.selection.dropdown').dropdown({
                useLabels: false,
                forceSelection: false,
                direction: 'downward',
                onHide: function() {
                    $scope.getFiltersValue();
                }
            });
        }

        // setting filter values
        ctrl.setFilterValues = function() {
            if ($scope.filterSelection.lessonType.length) {
                angular.forEach($scope.filterSelection.lessonType, function(lessonType) {
                    $("#lessonBrowser_lessonType").dropdown('set selected', lessonType);
                });
            }
            if ($scope.filterSelection.language.length) {
                angular.forEach($scope.filterSelection.language, function(language) {
                    $("#lessonBrowser_language").dropdown('set selected', language);
                });
            }
            if ($scope.filterSelection.grade.length) {
                angular.forEach($scope.filterSelection.grade, function(grade) {
                    $("#lessonBrowser_grade").dropdown('set selected', grade);
                });
            }
            if ($scope.filterSelection.subject.length) {
                angular.forEach($scope.filterSelection.subject, function(subject) {
                    $("#lessonBrowser_subject").dropdown('set selected', subject);
                });
            }
        }

        // Add the resource
        $scope.toggleSelectionLesson = function(lesson) {
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
            var searchQuery = this.searchKeyword;
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'search', targetid: 'button-search' });
            searchBody.request.filters.name = { "value": this.searchKeyword };
            searchService.search(searchBody, function(err, res) {
                if (err) {
                    ctrl.searchErr = "Oops! Something went wrong. Please try again later.";
                } else {
                    $scope.searchStatus = "end";
                    ecEditor.jQuery('.searchLoader').removeClass('active');
                    ctrl.searchRes.count = res.data.result.count;
                    if (res.data.result.content) {
                        ctrl.searchRes.content = res.data.result.content;
                        $scope.noResultFound = false;
                    } else {
                        ctrl.searchRes.content = [];
                        $scope.noResultFound = true;
                    }
                    $scope.$safeApply();
                    /* highlight matches text */
                    ecEditor.jQuery(".searcher ul.searchList li.searchResult").each(function() {
                        var matchStart = ecEditor.jQuery(this).text().toLowerCase().indexOf("" + searchQuery.toLowerCase() + "");
                        var matchEnd = matchStart + searchQuery.length - 1;
                        var beforeMatch = ecEditor.jQuery(this).text().slice(0, matchStart);
                        var matchText = ecEditor.jQuery(this).text().slice(matchStart, matchEnd + 1);
                        var afterMatch = ecEditor.jQuery(this).text().slice(matchEnd + 1);
                        ecEditor.jQuery(this).html(beforeMatch + "<em>" + matchText + "</em>" + afterMatch);
                    });
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
            ctrl.applyAllJquery();
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
            if (!ctrl.facetsResponse) {
                $scope.getPageAssemble(function(err, res) {
                    if (res) {
                        ctrl.facetsResponse = res.data;
                        var contents = [];
                        $scope.mainTemplate = 'facetsItemView';
                        if (ctrl.facetsResponse.result.response.sections) {
                            angular.forEach(ctrl.facetsResponse.result.response.sections, function(section, sectionIndex) {
                                angular.forEach(section.contents, function(content) {
                                    contents.push(content);
                                });
                            });
                            ctrl.searchConcepts(contents, function() {
                                $scope.isLoading = false;
                                ecEditor.jQuery('#noLessonMsg').hide();
                            });
                        } else {
                            ecEditor.jQuery('#noLessonMsg').show();
                        }
                    } else {
                        console.error("Unable to fetch response", err);
                        ecEditor.dispatchEvent("org.ekstep.toaster:warning", {
                            message: "Content list for resources not available",
                            position: 'topCenter',
                            icon: 'fa fa-warning'
                        });
                        $scope.viewAll(searchBody);
                    }
                });
            }
        }

        // view all the items for a specific resource
        $scope.viewAll = function(query, sectionIndex) {
            ctrl.generateTelemetry({ type: 'click', subtype: 'submit', target: 'viewAll', targetid: "" });
            if (_.isString(query)) {
                query = JSON.parse(query);
            }
            query.request.limit = limit;
            searchBody = {
                "request": {
                    "filters": {
                        "objectType": ["Content"],
                        "status": ["Live"]
                    },
                    "query": ""
                }
            };
            searchBody = query;
            searchBody.request.filters.objectType = ["Content"];
            searchBody.request.filters.status = ["Live"];
            ctrl.learningConfig();
            ctrl.meta.lessonTypes = collectionService.getObjectTypeByAddType('Browser');
            if (query.request.filters.contentType) {
                $scope.filterSelection.lessonType = query.request.filters.contentType;
            } else {
                searchBody.request.filters.contentType = ctrl.meta.lessonTypes;
            }
            if (query.request.filters.gradeLevel) {
                $scope.filterSelection.grade = query.request.filters.gradeLevel;
            }
            if (query.request.filters.language) {
                $scope.filterSelection.language = query.request.filters.language;
            }
            if (query.request.filters.subject) {
                $scope.filterSelection.subject = query.request.filters.subject;
            }
            if (query.request.filters.concepts) {
                $scope.filterSelection.concept = query.request.filters.concepts;
            }

            ctrl.searchRes = { count: 0, content: [] };
            if (_.isUndefined(sectionIndex)) {
                $scope.mainTemplate = 'selectedResult';
                ctrl.searchLessons(function(res) {
                    $scope.defaultResources = ctrl.res.content;
                    ctrl.dropdownAndCardsConfig();
                    ctrl.setFilterValues();
                    $scope.isLoading = false;
                    $scope.noResultFound = false;
                    ecEditor.jQuery('#resourceSearch').val('');
                });
            } else {
                if (!$scope.viewAllAvailableResponse.hasOwnProperty(sectionIndex)) {
                    $scope.isLoading = true;
                    $scope.mainTemplate = 'selectedResult';
                    ctrl.searchLessons(function(res) {
                        $scope.defaultResources = ctrl.res.content;
                        ctrl.dropdownAndCardsConfig();
                        ctrl.setFilterValues();
                        ecEditor.jQuery('#resourceSearch').val('');
                        $scope.isLoading = false;
                        $scope.noResultFound = false;
                        if (!_.isUndefined(sectionIndex))
                            $scope.viewAllAvailableResponse[sectionIndex] = $scope.defaultResources;

                    });
                } else {
                    ctrl.res.content = $scope.viewAllAvailableResponse[sectionIndex];
                    $scope.mainTemplate = 'selectedResult';
                    ctrl.applyAllJquery();
                }
            }
        }

        // Sort the resources
        $scope.Sort = function(option) {
            $scope.isCardSearching = true;
            if (option == 'alphabetical') {
                $scope.sortOption = 'name';
            } else {
                $scope.sortOption = 'lastPublishedOn';
            }
            $scope.$safeApply();
            $scope.isCardSearching = false;
            ctrl.applyAllJquery();
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

        // scroll down the filter element
        $scope.moveDown = function() {
            $timeout(function() {
                $scope.glued = true;
                $scope.$safeApply();
                $scope.glued = false;
            }, 800);
        }

        // searcher value reset
        $scope.resetSearch = function() {
            ctrl.searchRes.content = [];
            $scope.noResultFound = false;
        }

        // initial configuration
        $scope.init = function() {
            $scope.messages = Messages;
            if (instance.client) {
                $scope.viewAll(instance.query);
            } else {
                $scope.invokeFacetsPage();
            }
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