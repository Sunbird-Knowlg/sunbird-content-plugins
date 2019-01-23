
angular.module('worksheetApp', ['angular-inview'])
    .controller('worksheetCtrl', ['$scope', '$timeout', 'instance', function ($scope, $timeout, instance) {
        $scope.init = function () {
            console.log("in init");
            let questions = [{
                "question": "The sun is [[sun]]",
                "answer": "sun"
            }, {
                "question": "Tejas is in class [[seventh]]",
                "answer": "seventh"
            }, {
                "question": "Today is [[Sunday]]",
                "answer": "Sunday"
            }];

            // let newQuestions = _.map(questions, function (value) {
            //     return "<p>" + value.question + "</p>"
            // }).join("\n\n");

            // _.forEach(questions, function (value) {
            //     $scope.generateRequest(value);
            // })
        }

        $scope.generateRequest = function (question) {
            let body = {
                "data": {
                    "plugin": {
                        "id": "org.ekstep.questionunit.ftb",
                        "version": "1.0",
                        "templateId": "ftbtemplate"
                    },
                    "data": {
                        "question": {
                            "text": question.question,
                            "image": "",
                            "audio": "",
                            "audioName": "",
                            "keyboardConfig": {
                                "keyboardType": "Device",
                                "customKeys": []
                            }
                        },
                        "answer": [question.answer],
                        "media": [
                            {
                                "id": "org.ekstep.keyboard.eras_icon",
                                "src": "/content-plugins/org.ekstep.keyboard-1.0/renderer/assets/eras_icon.png",
                                "assetId": "org.ekstep.keyboard.eras_icon",
                                "type": "image",
                                "preload": true
                            },
                            {
                                "id": "org.ekstep.keyboard.language_icon",
                                "src": "/content-plugins/org.ekstep.keyboard-1.0/renderer/assets/language_icon.png",
                                "assetId": "org.ekstep.keyboard.language_icon",
                                "type": "image",
                                "preload": true
                            },
                            {
                                "id": "org.ekstep.keyboard.hide_keyboard",
                                "src": "/content-plugins/org.ekstep.keyboard-1.0/renderer/assets/keyboard.svg",
                                "assetId": "org.ekstep.keyboard.hide_keyboard",
                                "type": "image",
                                "preload": true
                            }
                        ]
                    },
                    "config": {
                        "metadata": {
                            "max_score": 1,
                            "isShuffleOption": false,
                            "isPartialScore": true,
                            "evalUnordered": false,
                            "templateType": "Horizontal",
                            "name": "Fill in the blanks",
                            "title": "Fill in the blanks",
                            "board": "CBSE",
                            "topic": [window.isSecureContext.dcTopic],
                            "medium": "English",
                            "gradeLevel": [
                                "KG"
                            ],
                            "subject": "Mathematics",
                            "qlevel": "EASY",
                            "category": "FTB"
                        },
                        "max_time": 0,
                        "max_score": 1,
                        "partial_scoring": true,
                        "layout": "Horizontal",
                        "isShuffleOption": false,
                        "questionCount": 1,
                        "evalUnordered": false
                    },
                    "media": [
                        {
                            "id": "org.ekstep.keyboard.eras_icon",
                            "src": "/content-plugins/org.ekstep.keyboard-1.0/renderer/assets/eras_icon.png",
                            "assetId": "org.ekstep.keyboard.eras_icon",
                            "type": "image",
                            "preload": true
                        },
                        {
                            "id": "org.ekstep.keyboard.language_icon",
                            "src": "/content-plugins/org.ekstep.keyboard-1.0/renderer/assets/language_icon.png",
                            "assetId": "org.ekstep.keyboard.language_icon",
                            "type": "image",
                            "preload": true
                        },
                        {
                            "id": "org.ekstep.keyboard.hide_keyboard",
                            "src": "/content-plugins/org.ekstep.keyboard-1.0/renderer/assets/keyboard.svg",
                            "assetId": "org.ekstep.keyboard.hide_keyboard",
                            "type": "image",
                            "preload": true
                        }
                    ]
                }
            }

            let data = {
                "request": {
                    "assessment_item": {
                        "objectType": "AssessmentItem",
                        "metadata": {
                            "code": "NA",
                            "isShuffleOption": false,
                            "body": body,
                            "itemType": "UNIT",
                            "version": 2,
                            "category": "FTB",
                            "createdBy": ecEditor.getContext('user').id, //"4c4530df-0d4f-42a5-bd91-0366716c8c24", 
                            "channel": "01231711180382208027",
                            "type": "ftb",
                            "template": "NA",
                            "template_id": "NA",
                            "framework": "NCF",
                            "max_score": 1,
                            "isPartialScore": true,
                            "evalUnordered": false,
                            "templateType": "Horizontal",
                            "name": "Fill in the blanks \n",
                            "title": "Fill in the blanks\n",
                            "board": "CBSE",
                            "topic": [],
                            "medium": "English",
                            "gradeLevel": [
                                "KG"
                            ],
                            "subject": "Mathematics",
                            "qlevel": "EASY",
                            "answer": [
                                {
                                    "answer": true,
                                    "value": {
                                        "type": "text",
                                        "asset": "1"
                                    }
                                }
                            ]
                        },
                        "outRelations": []
                    }
                }
            }

            $scope.createQuestion(data);
        }
        $scope.createQuestion = function (requestObj) {
            ecEditor.getService(ServiceConstants.ASSESSMENT_SERVICE).saveQuestionV3(undefined, requestObj, function (err, res) {
                if (err) {
                    ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                        message: 'Unable to create Question',
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                } else {
                    ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                        message: 'Question created successfully',
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                }
            })
            console.log("Parsed", JSON.parse(data.request.assessment_item.metadata.body));
        }
        $scope.uploadFile = function (e) {
            let r = new FileReader();

            var filePath = document.getElementById('inputFile').value;
            var allowedExtensions = /(\.pdf)$/i;

            if (!allowedExtensions.exec(filePath)) {
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Please upload pdf file only',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
                document.getElementById('inputFile').value = '';
                return false;
            } else {
                // var form = $('#fileUploadForm')[0];
                var data = new FormData();
                data.append("file", document.getElementById('inputFile').files[0]);
                // data.append("file", "/home/ttpllt44/Downloads/Ticket_6323075888.pdf");

                $.ajax({
                    type: "POST",
                    "async": true,
                    "crossDomain": true,
                    url: "/pdf2ecml/uploadFile",
                    headers: {
                        "cache-control": "no-cache",
                      },                    
                    data: data,
                    "processData": false,
                    "contentType": false,
                    "mimeType": "multipart/form-data",
                    success: function (data) {
                        alert("Success");
                    },
                    error: function (e) {
                        alert("Error");
                        console.log(e);

                    }
                });
            }
        };

        $scope.init();
    }]);

//# sourceURL=collaborator.js


