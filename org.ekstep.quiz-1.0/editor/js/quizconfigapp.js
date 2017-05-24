'use strict';

angular.module('quizconfigapp', ['ui.sortable'])
    .controller('quizconfigcontroller', ['$scope', 'quizInstance', function($scope, quizInstance) {
        var config = {"showStartPage": false, "showEndPage": false }, ctrl = this, itemIframe;
        ctrl.previewURL = 'preview/preview.html?webview=true', ctrl.activePreviewItem = '';
        var pluginId = 'org.ekstep.quiz', ver = '1.0';
        ctrl.currentQuestion;
        ctrl.enableQuestionConfig = false;
        ctrl.loadSelectedQuestions = function() {
            quizInstance.data.questionnaire && ctrl.setupQuestionsConfig();
        }
        ctrl.setupQuestionsConfig = function() {
            ctrl.activityOptions = {title: quizInstance.data.questionnaire.title, shuffle: quizInstance.data.questionnaire.shuffle, showImmediateFeedback: quizInstance.data.questionnaire.showImmediateFeedback, concepts: quizInstance.data.questionnaire.concepts }; 
            ctrl.cart = {"items": quizInstance.data.questionnaire.items[quizInstance.data.questionnaire.item_sets[0].id] };
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
            ctrl.activityOptions.total_items = quizInstance.data.questionnaire.total_items = ctrl.cart.items.length;
            $scope.$safeApply();
        }
        $scope.$on('ngDialog.opened', function(e, $dialog) {
            itemIframe = org.ekstep.contenteditor.jQuery('#itemIframe')[0];
            if (itemIframe.src == "")
                itemIframe.src = ctrl.previewURL;
            itemIframe.addEventListener('load', function() {
                if (ctrl.itemPreviewContent) {
                    itemIframe.contentWindow.setContentData(null, ctrl.itemPreviewContent, config)
                    itemIframe.contentWindow.onload = function() {
                        itemIframe.contentWindow.setContentData(null, ctrl.itemPreviewContent, config)
                    };
                } else {
                    ctrl.itemPreviewContent = {
                        "error": 'Preview could not be shown.'
                    };
                }

            });
        });
        ctrl.previewItem = function(item) {
            ctrl.enableQuestionConfig = false;
            var templateRef = item.template_id ? item.template_id : item.template;
            var templateData = _.filter(quizInstance.data.template, ['id', item.template]);
            ctrl.itemPreviewContent = quizBrowserUtil.getQuestionPreviwContent(templateData, item);
            ctrl.itemPreviewDisplay = !ecEditor._.isUndefined(ctrl.itemPreviewContent.error) ? ctrl.itemPreviewContent.error : '';
            itemIframe.contentWindow.location.reload();
        }
        ctrl.doneConfig = function() {
            $scope.closeThisDialog();
            ecEditor.dispatchEvent('delete:invoke');
            var _assessmentData = {};
            _assessmentData["data"] = {__cdata: JSON.stringify(quizInstance.data) }; 
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