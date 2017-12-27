/**
 * Plugin to create question
 * @class org.ekstep.plugins.mcqplugin:createquestionController
 * Jagadish P<jagadish.pujari@tarento.com>
 */
'use strict';
angular.module('createquestionapp', [])
    .controller('QuestionFormController', ['$scope', function($scope) {
        var ctrl = this;

        $scope.isQuestionTab = true;

        $scope.selectedQuestions = [];

        ctrl.showQuestionSet = true;

        //ctrl.selectedMenuItemData = ctrl.config[0].data;
        ctrl.cancel = function() {
            $scope.closeThisDialog();
        }

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


        $scope.selectQuestion = function(selQuestion){
        	$scope.selectedQuestions.push(selQuestion);


        }


        $scope.cancel = function() {
            $scope.closeThisDialog();
        }



    }])


//# sourceURL=createquestion.js