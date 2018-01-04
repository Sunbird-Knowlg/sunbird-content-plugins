/**
 * Plugin to add questions in question set
 * @class QuestionFormController
 * Swati singh <Swati.singh@tarento.com>
 */
'use strict';
angular.module('createquestionapp', [])
    .controller('QuestionFormController', ['$scope', 'instance', function($scope, instance) {

        $scope.isQuestionTab = true;
        $scope.selectedQuestions = [];
        $scope.showConfigForm = false;
        $scope.isQuestionSetConfig = false;
        $scope.filterObj = {};
        $scope.questions = [];
        $scope.itemRange = [];
        $scope.pluginIdObj = {}

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
            },
            {
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
            },
            {
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
            }
        ]






        $scope.questionSetConfigObj = {
            "title": "",
            "max_score": 1,
            "allow_skip": true,
            "show_feedback": true,
            "shuffle_questions": false,
            "shuffle_options": false,
            "total_items": 1
        };


        $scope.init = function() {
            if (instance.editData) {
                $scope.selectedQuestions = instance.editData.data;
                $scope.questionSetConfigObj = instance.editData.config;
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


            ecEditor.addEventListener("org.ekstep.questionbank:saveQuestion", function(event, data) {
                data.isSelected = false;
                $scope.questions.push(data);

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
            $scope.selectedQuestions.push(selQuestion);
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
            questionSet.data = [];
            questionSet.config = $scope.questionSetConfigObj;
            questionSet.data = $scope.selectedQuestions;
            ecEditor.dispatchEvent("org.ekstep.questionset:addQS", questionSet);
            $scope.closeThisDialog();
        }



        /**  Funtion to dispatch event to question creation plugin for creating new questions
         *  @memberof QuestionFormController
         */
        $scope.createQuestion = function() {
            ecEditor.dispatchEvent("org.ekstep.question:showpopup", {});
        }


        ctrl.previewItem = function() {};

        $scope.cancel = function() {
            $scope.closeThisDialog();
        }



    }])


//# sourceURL=questionbankctrl.js