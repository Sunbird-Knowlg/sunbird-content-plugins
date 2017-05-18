'use strict';

angular.module('quizconfigapp', ['ui.sortable'])
    .controller('quizconfigcontroller', ['$scope', '$injector', 'quizInstance', function($scope, $injector, quizInstance) {
        ecEditor.jQuery('.modal').addClass('item-activity');
        var config = {
                "showStartPage": false,
                "showEndPage": false
            },
            ctrl = this,
            itemIframe;
        ctrl.previewURL = 'preview/preview.html?webview=true', ctrl.activePreviewItem = '';
        ctrl.currentQuestion;
        ctrl.enableQuestionConfig = false;

        ctrl.loadSelectedQuestions = function() {
            ctrl.seteupQuestionsConfig();
            ctrl.itemsLoading = false;
        }

        ctrl.seteupQuestionsConfig = function() {
            if (ecEditor._.isUndefined(quizInstance.questionnaire)) {
                ctrl.activityOptions = {
                    title: quizInstance.questionnaire.title,
                    shuffle: quizInstance.questionnaire.shuffle,
                    showImmediateFeedback: quizInstance.questionnaire.showImmediateFeedback,
                    concepts: quizInstance.questionnaire.concepts
                };
                ctrl.cart = {
                    "items": quizInstance.questionnaire.items[quizInstance.questionnaire.item_sets[0].id]
                };
                ctrl.activityOptions.total_items = ctrl.cart.items.length;
                ctrl.activityOptions.max_score = ctrl.activityOptions.total_items;
                ctrl.activityOptions.range = ecEditor._.times(ctrl.activityOptions.total_items).splice(1);
                ctrl.activityOptions.range.push(ctrl.activityOptions.total_items);
                $scope.$safeApply();
            }
        }
        $scope.changeClass = function() {
            angular.element('#questionTitle').removeClass("error");
        }
        ctrl.handleQuestionScoreConfig = function(position, cartItem) {
            ctrl.enableQuestionConfig = true;
            angular.forEach(cartItem, function(item, $index) {
                if (position != $index) {
                    item.checked = false;
                }
            });
            ctrl.currentQuestion = cartItem[position];
            ctrl.updateScoreToquestion();
            /*ctrl.previewItem(cartItem[position], true);*/
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

        ctrl.cart = {
            "items": (ecEditor._.isUndefined(quizInstance.questionnaire)) ? [] : quizInstance.questionnaire.items[quizInstance.questionnaire.item_sets[0].id],
            "remove": function(item) {
                ecEditor._.remove(this.items, function(cartItem) {
                    return item.identifier == cartItem.identifier;
                });
                var itemIndex = this.getItemIndex(item);
                ctrl.activityOptions.total_items = this.items.length;
                $scope.$safeApply();
            }
        };
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
                ecEditor.getService('assessment').getTemplate(templateRef, function(err, response) {
                    if (!err) {
                        var x2js = new X2JS({
                            attributePrefix: 'none',
                            enableToStringFunc: false
                        });
                        var templateJson = x2js.xml_str2json(response.data.result.content.body);
                        ctrl.itemPreviewContent = assessmentBrowserUtil.getQuestionPreviwContent(templateJson, item);
                        ctrl.itemPreviewDisplay = !ecEditor._.isUndefined(ctrl.itemPreviewContent.error) ? ctrl.itemPreviewContent.error : '';
                        ctrl.itemPreviewLoading = false;
                        itemIframe.contentWindow.location.reload();
                        $scope.$safeApply();
                    } else {
                        ctrl.itemPreviewContent = {
                            "error": 'Preview could not be shown.'
                        };
                        ctrl.itemPreviewDisplay = ctrl.itemPreviewContent.error;
                        ctrl.itemPreviewLoading = false;
                        ctrl.errorMessage = true;
                        $scope.$safeApply();
                        return;
                    }
                });
            } else {
                ctrl.itemPreviewContent = {
                    "error": 'Item does not have a template selected.'
                };
                ctrl.itemPreviewDisplay = ctrl.itemPreviewContent.error;
                ctrl.itemPreviewLoading = false;
                $scope.$safeApply();
            }
        }
        ctrl.doneConfig = function() {
            $scope.closeThisDialog();
        };
        ctrl.showQuestionConfig = function(){
            ctrl.enableQuestionConfig = true;
        }
        ctrl.loadSelectedQuestions();
        ctrl.generateTelemetry = function(data) {
            if (data) ecEditor.getService('telemetry').interact({
                "type": data.type,
                "subtype": data.subtype,
                "target": data.target,
                "pluginid": "org.ekstep.quiz",
                "pluginver": "1.0",
                "objectid": "",
                "stage": ecEditor.getCurrentStage().id
            })
        }
    }]);
//# sourceURL=quizConfigApp.js