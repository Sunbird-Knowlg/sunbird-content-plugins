'use strict';

angular.module('quizconfigapp', ['ui.sortable'])
    .controller('quizconfigcontroller', ['$scope', '$injector', 'quizInstance', function($scope, $injector, quizInstance) {
        var config = {"showStartPage": false, "showEndPage": false }, ctrl = this, itemIframe;
        ctrl.previewURL = 'preview/preview.html?webview=true', ctrl.activePreviewItem = '';
        var pluginId = 'org.ekstep.quiz', ver = '1.0';
        ctrl.currentQuestion;
        ctrl.enableQuestionConfig = false;
        ctrl.loadSelectedQuestions = function() {
            quizInstance.questionnaire && ctrl.setupQuestionsConfig();
        }
        ctrl.setupQuestionsConfig = function() {
            ctrl.activityOptions = {title: quizInstance.questionnaire.title, shuffle: quizInstance.questionnaire.shuffle, showImmediateFeedback: quizInstance.questionnaire.showImmediateFeedback, concepts: quizInstance.questionnaire.concepts }; 
            ctrl.cart = {"items": quizInstance.questionnaire.items[quizInstance.questionnaire.item_sets[0].id] };
            ctrl.activityOptions.total_items = ctrl.cart.items.length;
            ctrl.activityOptions.max_score = ctrl.activityOptions.total_items;
            ctrl.activityOptions.range = ecEditor._.times(ctrl.activityOptions.total_items).splice(1);
            ctrl.activityOptions.range.push(ctrl.activityOptions.total_items);
            $scope.$safeApply();
        }
        $scope.sortableOptions = {
            update: function(e, ui) {
                ctrl.generateTelemetry({type: 'click', subtype: 'reorder', target: 'question'})
            },
            'ui-floating': true
        };
        ctrl.handleQuestionScoreConfig = function(position, cartItem) {
            ctrl.enableQuestionConfig = true;
            ctrl.currentQuestion = cartItem[position];
            ctrl.updateScoreToquestion();
        };
        ctrl.updateScoreToquestion = function() {
            var options = ctrl.parseObject(ctrl.currentQuestion);
            ctrl.distributedScore(options, ctrl.currentQuestion.max_score);
        };
        ctrl.distributedScore = function(options, max_score) {
            var answerCoutn;
            answerCoutn = ctrl.currentQuestion.type === 'ftb' ? _.size(_.map(_.filter(options, 'value'))) : _.size(_.map(_.filter(options, ['answer', true])))
            if (answerCoutn != 0) {
                var distScore = max_score / answerCoutn;
                var actualScore = distScore / max_score
                jQuery.each(options, function(index, val) {
                    if (!_.isUndefined(val) || !_.isEmpty(val)) {
                        val.score = Number(actualScore.toFixed(1));
                    }
                });
            }
        };
        ctrl.parseObject = function(question) {
            jQuery.each(question, function(key, value) {
                if (key === 'options' || key === 'rhs_options' || key === 'answer') {
                    question[key] = !_.isObject(question[key]) ? JSON.parse(question[key]) : question[key];
                }
            });
            return question.options || question.rhs_options || question.answer;
        };
        ctrl.removeItem = function(item) {
            ecEditor._.remove(ctrl.cart.items, function(cartItem) {
                return item.identifier == cartItem.identifier;
            });
            ctrl.activityOptions.total_items = quizInstance.questionnaire.total_items = ctrl.cart.items.length;
            $scope.$safeApply();
        }
        $scope.$on('ngDialog.opened', function(e, $dialog) {
            itemIframe = org.ekstep.contenteditor.jQuery('#itemIframe')[0];
            if (itemIframe.src == "")
                itemIframe.src = ctrl.previewURL;
            itemIframe.addEventListener('load', function() {
                itemIframe.contentWindow.setContentData(null, ctrl.itemPreviewContent, config)
                itemIframe.contentWindow.onload = function() {
                    itemIframe.contentWindow.setContentData(null, ctrl.itemPreviewContent, config)
                };
            });
        });

        ctrl.previewItem = function(item) {
            ctrl.enableQuestionConfig = false;
            var templateRef = item.template_id ? item.template_id : item.template;
            if (templateRef) {
                ecEditor.getService('assessment').getTemplate(templateRef, function(err, res) {
                    if (!err) {
                        var x2js = new X2JS({
                            attributePrefix: 'none',
                            enableToStringFunc: false
                        });
                        var templateJson;
                        if (!_.isNull(res.data.result.content.body)) {
                            if (res.data.result.content.body.lastIndexOf('{', 0) === 0) {
                                templateJson = JSON.parse(res);
                            } else {
                                templateJson = x2js.xml_str2json(res.data.result.content.body);
                            }
                        }
                        ctrl.itemPreviewContent = assessmentBrowserUtil.getQuestionPreviwContent(templateJson, item);
                        ctrl.itemPreviewDisplay = !ecEditor._.isUndefined(ctrl.itemPreviewContent.error) ? ctrl.itemPreviewContent.error : '';
                        itemIframe.contentWindow.location.reload();
                        $scope.$safeApply();
                    } else {
                        ctrl.itemPreviewContent = {
                            "error": 'Preview could not be shown.'
                        };
                    }
                });
            } else {
                ctrl.itemPreviewContent = {
                    "error": 'Item does not have a template selected.'
                };
                ctrl.itemPreviewDisplay = ctrl.itemPreviewContent.error;
                $scope.$safeApply();
            }
        }
        ctrl.doneConfig = function() {
            $scope.closeThisDialog();
            ecEditor.dispatchEvent('delete:invoke');
            var _assessmentData = {};
            _assessmentData["data"] = {__cdata: JSON.stringify(quizInstance) }; 
            _assessmentData["config"] = {__cdata: JSON.stringify({"type": "items", "var": "item"}) };
            ecEditor.dispatchEvent(pluginId + ':create', _assessmentData);
        };
        ctrl.showQuestionConfig = function() {
            ctrl.enableQuestionConfig = true;
        }
        ctrl.loadSelectedQuestions();
        ctrl.generateTelemetry = function(data) {
            if (data) ecEditor.getService('telemetry').interact({"type": data.type, "subtype": data.subtype, "target": data.target, "pluginid": pluginId, "pluginver": ver, "objectid": "", "stage": ecEditor.getCurrentStage().id }) 
        }
    }]);
//# sourceURL=quizConfigApp.js