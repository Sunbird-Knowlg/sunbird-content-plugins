/**
 * Plugin to add questions in question set
 * @class QuestionFormController
 * Swati singh <Swati.singh@tarento.com>
 */
'use strict';
angular.module('createquestionapp', [])
  .controller('QuestionFormController', ['$scope', 'pluginInstance', function($scope, pluginInstance) {

    $scope.isQuestionTab = true;
    $scope.selectedQuestions = [];
    $scope.showConfigForm = false;
    $scope.isQuestionSetConfig = false;
    $scope.filterObj = {};
    $scope.questions = [];
    $scope.itemRange = [];
    $scope.Totalconcepts;
    $scope.selectedConceptsData;
    $scope.grades;
    $scope.languages = [];
    $scope.difficultyLevels = ['Easy', 'Medium', 'Difficult'];
    $scope.questionTypes = ['mcq', 'ftb', 'mtf'];
    $scope.filterObj = {};
    $scope.pluginIdObj = {
      "question_set_id": "org.ekstep.questionset",
      "question_create_id": "org.ekstep.question",
      "concepts_id": "org.ekstep.conceptselector"
    }
    $scope.csspath = ecEditor.resolvePluginResource(pluginInstance.manifest.id, pluginInstance.manifest.ver, 'editor/style.css');

    $scope.questionSetConfigObj = {
      "title": "",
      "max_score": 1,
      "allow_skip": true,
      "show_feedback": true,
      "shuffle_questions": false,
      "shuffle_options": false,
      "total_items": 1
    };

    /**
     *  init funtion is called when html is loaded
     *  @memberof QuestionFormController
     */
    $scope.init = function() {
      if (pluginInstance.editData) {
        $scope.selectedQuestions = pluginInstance.editData.data;
        $scope.questionSetConfigObj = pluginInstance.editData.config;
        $scope.isQuestionTab = false;
        $scope.isQuestionSetConfig = true;
        $scope.createTotalItemRange();
        for (var i = 0; i < $scope.selectedQuestions.length; i++) {
          for (var j = 0; j < $scope.questions.length; j++) {
            if ($scope.selectedQuestions[i].questionId == $scope.questions[j].questionId) {
              $scope.questions[j].isSelected = true;
            }
          }
        }
      }

      ecEditor.dispatchEvent($scope.pluginIdObj.concepts_id + ':init', {
        element: 'queSetConceptsTextBox',
        selectedConcepts: [], // All composite keys except mediaType
        callback: function(data) {
          $scope.Totalconcepts = data.length;
          $scope.selectedConceptsData = data;
          $scope.$safeApply();
        }
      });

      ecEditor.getService('meta').getConfigOrdinals(function(err, res) {
        if (!err) {
          $scope.grades = res.data.result.ordinals.gradeLevel;
          $scope.languages = res.data.result.ordinals.language;
          $scope.$safeApply();
        }
        ecEditor.jQuery('.ui.dropdown.lableCls').dropdown({ useLabels: false, forceSelection: false });
      });

      ecEditor.addEventListener(pluginInstance.manifest.id + ":saveQuestion", function(event, data) {
        data.isSelected = false;
        var selQueIndex = _.findLastIndex($scope.questions, {
          questionId: data.questionId
        });
        if (selQueIndex < 0) {
          $scope.questions.push(data);
        } else {
          $scope.questions[selQueIndex] = data;
        }


      }, false);

    }

    /**
     *  creating range of number of items to display as per number of question selected
     *  @memberof QuestionFormController
     */
    $scope.createTotalItemRange = function() {
      $scope.itemRange = [];
      for (var i = 1; i <= $scope.selectedQuestions.length; i++) {
        $scope.itemRange.push(i);
      }
    }

    /**
     *  Creating list of selected questions for creating question set
     *  @memberof QuestionFormController
     */
    $scope.selectQuestion = function(selQuestion) {
      var selObjindex = $scope.selectedQuestions.indexOf(selQuestion);
      if (selObjindex > -1) {
        $scope.selectedQuestions.splice(selObjindex, 1);
      } else {
        $scope.selectedQuestions.push(selQuestion);
      }

    }

    /**
     *  Funtion to edit the config data of question
     *  @memberof QuestionFormController
     */
    $scope.editConfig = function(quesObj) {
      $scope.selQuestionObj = angular.copy(quesObj);
      $scope.showConfigForm = true;
    }


    /**
     *  Funtion to remove question from selected question list
     *  @memberof QuestionFormController
     */
    $scope.removeQuestion = function(selQuestion) {
      var selObjindex = $scope.selectedQuestions.indexOf(selQuestion);
      if (selObjindex > -1) {
        $scope.selectedQuestions.splice(selObjindex, 1);
      }
      selObjindex = $scope.questions.indexOf(selQuestion);
      if (selObjindex > -1) {
        $scope.questions[selObjindex].isSelected = false;
      }
    }


    /**
     *  Funtion to remove question from selected question list
     *  @memberof QuestionFormController
     */
    $scope.saveConfig = function() {
      var selectedObjIndex = _.findLastIndex($scope.selectedQuestions, {
        questionId: $scope.selQuestionObj.questionId
      });
      if (selectedObjIndex > -1) {
        $scope.selectedQuestions[selectedObjIndex] = $scope.selQuestionObj;
        $scope.showConfigForm = false;
      }
      selectedObjIndex = _.findLastIndex($scope.questions, {
        questionId: $scope.selQuestionObj.questionId
      });
      if (selectedObjIndex > -1) {
        $scope.questions[selectedObjIndex] = $scope.selQuestionObj;
      }

      delete $scope.questionObj;
    }



    /**
     *  Funtion to save question set
     *  @memberof QuestionFormController
     */
    $scope.createQuestionSet = function() {
      $scope.questionSetConfigObj.total_items = $scope.selectedQuestions.length;
      $scope.isQuestionSetConfig = true;
      $scope.isQuestionTab = false;
      $scope.createTotalItemRange();
    }


    /**
     *  Funtion to add question set to editor. It dispatch an event to question set plugin for adding question set
     *  @memberof QuestionFormController
     */
    $scope.addQuestionSet = function() {
      var questionSet = {};
      var callback = pluginInstance.callback;
      questionSet.data = [];
      questionSet.config = $scope.questionSetConfigObj;
      questionSet.data = $scope.selectedQuestions;
      ecEditor.dispatchEvent($scope.pluginIdObj.question_set_id + ":addQS", { callback: callback, data: questionSet });
      $scope.closeThisDialog();
    }



    /**  Funtion to dispatch event to question creation plugin for creating new questions
     *  @memberof QuestionFormController
     */
    $scope.createQuestion = function() {
      ecEditor.dispatchEvent($scope.pluginIdObj.question_create_id + ":showpopup", {});
    }

    /**
     * [createQuestion description]
     * @return {[type]} [description]
     */
    $scope.editQuestion = function(questionObj) {
      ecEditor.dispatchEvent($scope.pluginIdObj.question_create_id + ":showpopup", questionObj);
    }

    ctrl.previewItem = function() {};

    $scope.cancel = function() {
      $scope.closeThisDialog();
    }

    $scope.generateTelemetry = function(data,event) {
      var eventId;
      if(event.target) eventId = event.target.id;
      else eventId = event;
      if (data) ecEditor.getService('telemetry').interact({
        "type": data.type,
        "subtype": data.subtype,
        "id": data.id,
        "pageId": ecEditor.getCurrentStage().id ,
        "target": {
          "id": eventId,
          "ver": "1.0",
          "type": data.type
        },
        "plugin": {
          "id": pluginInstance.manifest.id,
          "ver": pluginInstance.manifest.ver
        }
      })
    }


  }])


//# sourceURL=questionbankctrl.js