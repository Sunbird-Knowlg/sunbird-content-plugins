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

        ctrl.showQuestionSet = true;

        $scope.showConfigForm = false;

        $scope.isQuestionSetConfig = false;



        $scope.questions = [{
            "questionId": "qTestId1",
            "data": {
                "plugin": { // Question Unit Plugin Information
                    "id": "testplugin1", // Id of plugin
                    "version": "1.0", // Version of plugin
                    "templateId": "testPluginTemp1" // Template Id of the question unit
                },
                "type": "unit", //Type of question (unit, set, dynamic) -- redundant?
                "data": {}, // Question Unit Form Data
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": "Addition of two numbers",
                    "description": "2 + 2",
                    "language": "english"
                },
                "max_time": 2, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "isSelected": false
        }, {
            "questionId": "qTestId2",
            "data": {
                "plugin": { // Question Unit Plugin Information
                    "id": "testplugin2", // Id of plugin
                    "version": "1.0", // Version of plugin
                    "templateId": "testPlugin2Temp1" // Template Id of the question unit
                },
                "type": "unit", //Type of question (unit, set, dynamic) -- redundant?
                "data": {}, // Question Unit Form Data
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": "Subtraction of two numbers",
                    "description": "12 - 5",
                    "language": "english"
                },
                "max_time": 2, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "isSelected": false
        }, {
            "questionId": "qTestId3",
            "data": {
                "plugin": { // Question Unit Plugin Information
                    "id": "testplugin3", // Id of plugin
                    "version": "1.0", // Version of plugin
                    "templateId": "testPlugin3Temp1" // Template Id of the question unit
                },
                "type": "unit", //Type of question (unit, set, dynamic) -- redundant?
                "data": {}, // Question Unit Form Data
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": "Multiplication of two numbers",
                    "description": "5 * 6",
                    "language": "english"
                },
                "max_time": 2, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "isSelected": false
        }, {
            "questionId": "qTestId4",
            "data": {
                "plugin": { // Question Unit Plugin Information
                    "id": "testplugin4", // Id of plugin
                    "version": "1.0", // Version of plugin
                    "templateId": "testPlugin3Temp1" // Template Id of the question unit
                },
                "type": "unit", //Type of question (unit, set, dynamic) -- redundant?
                "data": {}, // Question Unit Form Data
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": "Multiplication of two numbers",
                    "description": "5 * 6",
                    "language": "english"
                },
                "max_time": 2, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "isSelected": false
        }, {
            "questionId": "qTestId5",
            "data": {
                "plugin": { // Question Unit Plugin Information
                    "id": "testplugin5", // Id of plugin
                    "version": "1.0", // Version of plugin
                    "templateId": "testPlugin3Temp1" // Template Id of the question unit
                },
                "type": "unit", //Type of question (unit, set, dynamic) -- redundant?
                "data": {}, // Question Unit Form Data
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": "Multiplication of two numbers",
                    "description": "5 * 6",
                    "language": "english"
                },
                "max_time": 2, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "isSelected": false
        }, {
            "questionId": "qTestId6",
            "data": {
                "plugin": { // Question Unit Plugin Information
                    "id": "testplugin6", // Id of plugin
                    "version": "1.0", // Version of plugin
                    "templateId": "testPlugin3Temp1" // Template Id of the question unit
                },
                "type": "unit", //Type of question (unit, set, dynamic) -- redundant?
                "data": {}, // Question Unit Form Data
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": "Multiplication of two numbers",
                    "description": "5 * 6",
                    "language": "english"
                },
                "max_time": 2, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "isSelected": false
        }, {
            "questionId": "qTestId7",
            "data": {
                "plugin": { // Question Unit Plugin Information
                    "id": "testplugin7", // Id of plugin
                    "version": "1.0", // Version of plugin
                    "templateId": "testPlugin3Temp1" // Template Id of the question unit
                },
                "type": "unit", //Type of question (unit, set, dynamic) -- redundant?
                "data": {}, // Question Unit Form Data
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": "Multiplication of two numbers",
                    "description": "5 * 6",
                    "language": "english"
                },
                "max_time": 2, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "isSelected": false
        }, {
            "questionId": "qTestId8",
            "data": {
                "plugin": { // Question Unit Plugin Information
                    "id": "testplugin8", // Id of plugin
                    "version": "1.0", // Version of plugin
                    "templateId": "testPlugin3Temp1" // Template Id of the question unit
                },
                "type": "unit", //Type of question (unit, set, dynamic) -- redundant?
                "data": {}, // Question Unit Form Data
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": "Multiplication of two numbers",
                    "description": "5 * 6",
                    "language": "english"
                },
                "max_time": 2, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "isSelected": false
        }, {
            "questionId": "qTestId9",
            "data": {
                "plugin": { // Question Unit Plugin Information
                    "id": "testplugin9", // Id of plugin
                    "version": "1.0", // Version of plugin
                    "templateId": "testPlugin3Temp1" // Template Id of the question unit
                },
                "type": "unit", //Type of question (unit, set, dynamic) -- redundant?
                "data": {}, // Question Unit Form Data
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": "Multiplication of two numbers",
                    "description": "5 * 6",
                    "language": "english"
                },
                "max_time": 2, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "isSelected": false
        }]

        $scope.questionSetConfigObj = {
            "title": "",
            "max_score": 1,
            "allow_skip": true,
            "show_feedback": true,
            "shuffle_questions": false,
            "shuffle_options": false,
            "total_items" : 1
        };


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



        $scope.saveQuestionSet =  function(){
            $scope.questionSetConfigObj.total_items = $scope.selectedQuestions.length;
            $scope.isQuestionSetConfig = true;
        }


  $scope.addQuestionSet = function() {
            var questionSet = {};
            questionSet.data = [];
            questionSet.config = $scope.questionSetConfigObj;
            questionSet.data = $scope.selectedQuestions;
            console.log("----------------------questionSet data--------------", questionSet);
            ecEditor.dispatchEvent("org.ekstep.questionset:addQS", questionSet);
            $scope.cancel();
        }

        $scope.cancel = function() {
            $scope.closeThisDialog();
        }



    }])


//# sourceURL=questionbankctrl.js