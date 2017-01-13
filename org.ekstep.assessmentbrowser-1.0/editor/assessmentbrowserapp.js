'use strict';

angular.module('assessmentbrowserapp', [])
    .controller('assessmentbrowsercontroller', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {
        EkstepEditorAPI.jQuery('.modal').addClass('item-activity');
        var config = { "showStartPage": false, "showEndPage": false },
            ctrl = this,
            itemIframe;

        ctrl.isFiltersShown = true;
        ctrl.isMyQuestions = false;
        ctrl.languagecode = 'en';
        ctrl.activePreviewItem = '';
        ctrl.assessment = {};
        ctrl.activity = {
            'title': '',
            'qlevel': '',
            'type': '',
            'language': 'English',
            'gradeLevel': '',
            'conceptIds': []
        };
        ctrl.activityOptions = {
            title: "",
            shuffle: false,
            showImmediateFeedback: true,
            myQuestions: false,
            concepts: '(0) Concepts'
        };
        ctrl.context = EkstepEditorAPI.getAngularScope().context;

        EkstepEditorAPI.getService('assessmentService').getLanguages(function(err, respLan) {
            if (!err && respLan.statusText == "OK") {
                var assessmentlanguages = {};
                EkstepEditorAPI._.forEach(respLan.data.result.languages, function(lang) {
                    assessmentlanguages[lang.code] = lang.name;
                });
                ctrl.assessment.language = EkstepEditorAPI._.values(assessmentlanguages);
                EkstepEditorAPI.getService('assessmentService').getDefinations(function(err, resp) {
                    if (!err && resp.statusText == "OK") {
                        var questionTypes = {};
                        EkstepEditorAPI._.forEach(resp.data.result.definition_node.properties, function(prop) {
                            switch (prop.propertyName) {
                                case "qlevel":
                                    ctrl.assessment.qlevel = prop.range;
                                    break;
                                case "gradeLevel":
                                    ctrl.assessment.gradeLevel = prop.range;
                                    break;
                                case "type":
                                    ctrl.assessment.type = prop.range;
                                    break;
                            }
                        });
                        EkstepEditorAPI.getService('assessmentService').getResourceBundles(function(err, resourceResp) {
                            if (!err && resourceResp.statusText == "OK") {
                                EkstepEditorAPI._.forEach(ctrl.assessment.type, function(data) {
                                    if (resourceResp.data.result.en[data] == undefined) {
                                        questionTypes[data] = data;
                                    } else {
                                        questionTypes[data] = resourceResp.data.result.en[data];
                                    }
                                });
                                ctrl.assessment.type = questionTypes;
                                EkstepEditorAPI.getAngularScope().safeApply();
                            }
                        });
                        EkstepEditorAPI.jQuery('.ui.dropdown').dropdown({ useLabels: false });
                    }
                });
            }
        });

        ctrl.searchQuestions = function() {
            var activity = ctrl.activity;
            ctrl.isItemAvailable = true;
            ctrl.itemsLoading = true;
            var data = {
                request: {
                    filters: {
                        objectType: ["AssessmentItem"],
                        status: [],
                    },

                    sort_by: { "name": "desc" },
                    limit: 200
                }
            };
            if (ctrl.activityOptions.myQuestions) {
                ctrl.isMyQuestions = true;
                data.request.filters.portalOwner = EkstepEditorAPI._.isUndefined(ctrl.context) ? '' : ctrl.context.user.id;
            } else {
                ctrl.isMyQuestions = false;
            }
            EkstepEditorAPI._.forEach(activity, function(value, key) {
                if (value) {
                    switch (key) {
                        case "question_title":
                            data.request.query = value;
                            break;
                        case "gradeLevel":
                            if (value.length) {
                                data.request.filters.gradeLevel = value;
                            }
                            break;
                        case "language":
                            data.request.filters.language = [value];
                            break;
                        case "qlevel":
                            data.request.filters.qlevel = value;
                            break;
                        case "type":
                            if (value.length) {
                                data.request.filters.type = value;
                            }
                            break;
                        case "concepts":
                            data.request.filters.concepts = value;
                            break;
                    }
                }
            });
            EkstepEditorAPI.getService('assessmentService').getQuestions(data, function(err, resp) {
                if (!err && resp.statusText == "OK") {
                    ctrl.itemsLoading = false;
                    var item;
                    ctrl.items = [];
                    if (!resp.data.result.count || resp.data.result.count <= 0) {
                        ctrl.isItemAvailable = false;
                    } else {
                        EkstepEditorAPI._.forEach(resp.data.result.items, function(value) {
                            if(!EkstepEditorAPI._.isUndefined(value.template_id)){
                                item = {};
                                item.question = value;
                                if (EkstepEditorAPI._.findIndex(ctrl.cart.items, function(i) {
                                        return i.question.identifier === value.identifier
                                    }) === -1) {
                                    item.isSelected = false;
                                } else {
                                    item.isSelected = true;
                                }
                                ctrl.items.push(item);
                            }
                        });
                        ctrl.previewItem(ctrl.items[0]);
                    }
                    ctrl.totalItems = ctrl.items.length;
                    EkstepEditorAPI.getAngularScope().safeApply();
                } else {
                    ctrl.itemsLoading = false;
                }
            });
        };

        ctrl.cart = {
            "items": [],
            "getItemIndex": function(item) {
                return EkstepEditorAPI._.findIndex(ctrl.items, function(i) {
                    return i.question.identifier === item.question.identifier
                });
            },
            "add": function(item) {
                this.items.push(item);
                var itemIndex = this.getItemIndex(item);
                ctrl.items[itemIndex].isSelected = true;
                ctrl.previewItem(item, true);
                EkstepEditorAPI.getAngularScope().safeApply();
            },
            "remove": function(item) {
                EkstepEditorAPI._.remove(this.items, function(cartItem) {
                    return item.question.identifier == cartItem.question.identifier;
                });
                var itemIndex = this.getItemIndex(item);
                if (itemIndex != -1) ctrl.items[itemIndex].isSelected = false;
                ctrl.activityOptions.total_items = this.items.length;
                EkstepEditorAPI.jQuery('.displayCount .text').html(ctrl.activityOptions.total_items);
                EkstepEditorAPI.getAngularScope().safeApply();
            }
        };

        ctrl.addActivityOptions = function() {
            ctrl.isFiltersShown = false;
            ctrl.activityOptions.total_items = ctrl.cart.items.length;
            ctrl.activityOptions.max_score = ctrl.activityOptions.total_items;
            ctrl.activityOptions.range = EkstepEditorAPI._.times(ctrl.activityOptions.total_items).splice(1);
            ctrl.activityOptions.range.push(ctrl.activityOptions.total_items);
            EkstepEditorAPI.jQuery('.displayCount .text').html(ctrl.activityOptions.total_items);
            EkstepEditorAPI.getAngularScope().safeApply();
        };

        ctrl.previewLoad = function() {
            setTimeout(function() {
                itemIframe = EkstepEditor.jQuery('#itemIframe')[0];
                if (itemIframe.src == "")
                    itemIframe.src = instance.previewURL;
                itemIframe.addEventListener('load', function() {
                    itemIframe.contentWindow.setContentData(null, ctrl.itemPreviewContent, config);
                });
            }, 2000);
        };
        ctrl.previewLoad();
        ctrl.previewItem = function(item) {
            EkstepEditorAPI.getService('assessmentService').getItem(item.question.identifier, function(err, resp) {
                if (!err && resp.statusText == "OK") {
                    item = resp.data.result.assessment_item ? resp.data.result.assessment_item : item;
                    ctrl.itemPreviewLoading = true;
                    ctrl.itemPreviewDisplay = "";
                    ctrl.activePreviewItem = item.identifier;
                    var templateRef = item.template_id ? item.template_id : item.template;
                    if (templateRef) {
                        EkstepEditorAPI.getService('assessmentService').getTemplate(templateRef, function(err, response) {
                            if (!err && response.statusText == "OK") {
                                var x2js = new X2JS({ attributePrefix: 'none', enableToStringFunc: false });
                                var templateJson = x2js.xml_str2json(response.data.result.content.body);
                                ctrl.itemPreviewContent = assessmentBrowserUtil.getQuestionPreviwContent(templateJson, item);
                                ctrl.itemPreviewDisplay = !EkstepEditorAPI._.isUndefined(ctrl.itemPreviewContent.error) ? ctrl.itemPreviewContent.error : '';
                                ctrl.itemPreviewLoading = false;
                                itemIframe.contentWindow.location.reload();
                                EkstepEditorAPI.getAngularScope().safeApply();
                            } else {
                                ctrl.itemPreviewContent = { "error": 'Preview could not be shown.' };
                                ctrl.itemPreviewDisplay = ctrl.itemPreviewContent.error;
                                ctrl.itemPreviewLoading = false;
                                EkstepEditorAPI.getAngularScope().safeApply();
                            }
                        });
                    } else {
                        ctrl.itemPreviewContent = { "error": 'Item does not have a template selected.' };
                        ctrl.itemPreviewDisplay = ctrl.itemPreviewContent.error;
                        ctrl.itemPreviewLoading = false;
                        EkstepEditorAPI.getAngularScope().safeApply();
                    }
                }
            });

        };

        ctrl.addItemActivity = function() {
            if (!EkstepEditorAPI._.isUndefined(instance.callback)) {
                instance.callback(ctrl.cart.items, ctrl.activityOptions);
                ctrl.cancel();
            }
        }

        ctrl.cancel = function() {
            $scope.closeThisDialog();
        };

        ctrl.searchQuestions();
        EkstepEditorAPI.dispatchEvent('org.ekstep.conceptselector:init', {
            element: 'assessmentConceptSelector',
            selectedConcepts: [], // All composite keys except mediaType
            callback: function(data) {
                ctrl.activityOptions.concepts = '(' + data.length + ') concepts selected';
                ctrl.activity.concepts = _.map(data, function(concept) {
                    return concept.id;
                });
                EkstepEditorAPI.getAngularScope().safeApply();
                ctrl.searchQuestions();
                console.log('concepts data received - ', ctrl.activity.concepts);
            }
        });
    }]);
//# sourceURL=assessmentbrowserapp.js
