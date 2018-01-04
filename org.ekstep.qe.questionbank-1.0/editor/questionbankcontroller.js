/**
 * Plugin to add questions in question set
 * @class QuestionFormController
 * Swati singh <Swati.singh@tarento.com>
 */
'use strict';
angular.module('createquestionapp', [])
    .controller('QuestionFormController', ['$scope', 'instance', function($scope, instance) {
        var ctrl = this;

        $scope.isQuestionTab = true;

        $scope.selectedQuestions = [];

        $scope.showConfigForm = false;

        $scope.isQuestionSetConfig = false;

        $scope.filterObj = {};
        $scope.questions = [];

        $scope.questionSetConfigObj = {
            "title": "",
            "max_score": 1,
            "allow_skip": true,
            "show_feedback": true,
            "shuffle_questions": false,
            "shuffle_options": false,
            "total_items": 1
        };
        $scope.createTotalItemRange = function() {
            $scope.item_range = [];
            for (var i = 1; i <= $scope.selectedQuestions.length; i++) {
                $scope.item_range.push(i);
            }
        }


        if (instance.editData) {
            $scope.selectedQuestions = instance.editData.data;
            $scope.questionSetConfigObj = instance.editData.config;
            $scope.isQuestionTab = false;
            $scope.isQuestionSetConfig  = true;
            $scope.createTotalItemRange();
            for (var i = 0; i < $scope.selectedQuestions.length; i++) {
                for (var j = 0; j < $scope.questions.length; j++) {
                    if ($scope.selectedQuestions[i].questionId == $scope.questions[j].questionId) {
                        $scope.questions[j].isSelected = true;
                    }
                }
            }
        }


        ecEditor.addEventListener("org.ekstep.qe.questionbank:saveQuestion", function(event, data) {
            data.isSelected = false;
            $scope.questions.push(data);

        }, false);






        $scope.selectQuestion = function(selQuestion) {
            $scope.selectedQuestions.push(selQuestion);
        }

        $scope.editConfig = function(quesObj) {
            $scope.questionObj = angular.copy(quesObj);
            $scope.showConfigForm = true;
        }


        $scope.removeQuestion = function(selQuestion) {
            for (var i = 0; i < $scope.selectedQuestions.length; i++) {
                if (selQuestion.questionId == $scope.selectedQuestions[i].questionId) {
                    $scope.selectedQuestions.splice(i, 1);
                }
            }
            for (var i = 0; i < $scope.questions.length; i++) {
                if (selQuestion.questionId == $scope.questions[i].questionId) {
                    $scope.questions[i].isSelected = false;
                }
            }
        }

        $scope.saveConfig = function() {
            for (var i = 0; i < $scope.selectedQuestions.length; i++) {
                if ($scope.questionObj.questionId == $scope.selectedQuestions[i].questionId) {
                    $scope.selectedQuestions[i] = $scope.questionObj;
                    $scope.showConfigForm = false;
                }
            }
            for (var i = 0; i < $scope.questions.length; i++) {
                if ($scope.questionObj.questionId == $scope.questions[i].questionId) {
                    $scope.selectedQuestions[i] = $scope.questionObj;
                }
            }
            delete $scope.questionObj;
        }



        $scope.saveQuestionSet = function() {
            $scope.questionSetConfigObj.total_items = $scope.selectedQuestions.length;
            $scope.isQuestionSetConfig = true;
            $scope.createTotalItemRange();
        }


        $scope.addQuestionSet = function() {
            var questionSet = {};
            questionSet.data = [];
            questionSet.config = $scope.questionSetConfigObj;
            questionSet.data = $scope.selectedQuestions;
            console.log("----------------------questionSet data--------------", questionSet);
            ecEditor.dispatchEvent("org.ekstep.questionset:addQS", {callback: instance.callback, data:questionSet});
            $scope.cancel();
        }

        $scope.createQuestion = function() {
            ecEditor.dispatchEvent("org.ekstep.question:showpopup", {});
        }


        ctrl.previewItem = function(item) {

            item = resp.data.result.assessment_item ? resp.data.result.assessment_item : item;
            ctrl.itemPreviewLoading = true;
            ctrl.itemPreviewDisplay = "";
            ctrl.activePreviewItem = item.questionId;
            var templateRef = item.template_id ? item.template_id : item.template;
            if (templateRef) {
                ecEditor.getService('assessment').getTemplate(templateRef, function(err, response) {
                    if (!err) {
                        var x2js = new X2JS({ attributePrefix: 'none', enableToStringFunc: false });
                        var templateJson = x2js.xml_str2json(response.data.result.content.body);
                        ctrl.itemPreviewContent = assessmentBrowserUtil.getQuestionPreviwContent(templateJson, item);
                        ctrl.itemPreviewDisplay = !ecEditor._.isUndefined(ctrl.itemPreviewContent.error) ? ctrl.itemPreviewContent.error : '';
                        ctrl.itemPreviewLoading = false;
                        itemIframe.contentWindow.location.reload();
                        $scope.$safeApply();
                    } else {
                        ctrl.itemPreviewContent = { "error": 'Preview could not be shown.' };
                        ctrl.itemPreviewDisplay = ctrl.itemPreviewContent.error;
                        ctrl.itemPreviewLoading = false;
                        $scope.$safeApply();
                        return;
                    }
                });
            } else {
                ctrl.itemPreviewContent = { "error": 'Item does not have a template selected.' };
                ctrl.itemPreviewDisplay = ctrl.itemPreviewContent.error;
                ctrl.itemPreviewLoading = false;
                $scope.$safeApply();
            }



        };

        $scope.cancel = function() {
            $scope.closeThisDialog();
        }



    }])


//# sourceURL=questionbankctrl.js