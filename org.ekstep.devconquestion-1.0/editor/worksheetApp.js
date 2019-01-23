
angular.module('worksheetApp', ['angular-inview'])
    .controller('worksheetCtrl', ['$scope', '$timeout', 'instance', function ($scope, $timeout, instance) {
        $scope.isLoading = false;
        $scope.loadingText = 'Loading';
        $scope.init = function () {
            $('input[type=file]').on('dragenter', function () {
                $('div.drop-area').addClass('dragover');
            });

            $('input[type=file]').on('dragleave', function () {
                $('div.drop-area').removeClass('dragover');
            });
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
                            "gradeLevel": ["KG"],
                            "subject": "English",
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
                            "body": JSON.stringify(body),
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
                            "subject": "English",
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
            // console.log("Parsed", JSON.parse(data.request.assessment_item.metadata.body));
        }

        $scope.uploadFile = function (e) {
            // $("#filename").text($(this).val());
            $scope.isLoading = true;
            $scope.loadingText = 'Uploading file';
            var filePath = document.getElementById('inputFile').value;
            var allowedExtensions = /(\.pdf)$/i;

            if (!allowedExtensions.exec(filePath)) {
                $scope.isLoading = false;
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Please upload pdf file only',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
                document.getElementById('inputFile').value = '';
                $scope.$safeApply();
                return false;
            } else {
                var data = new FormData();
                data.append("file", document.getElementById('inputFile').files[0]);

                $.ajax({
                    type: "POST",
                    "async": true,
                    "crossDomain": true,
                    url: "/pdf2text/uploadFile",
                    headers: {
                        "cache-control": "no-cache",
                    },
                    data: data,
                    "processData": false,
                    "contentType": false,
                    "mimeType": "multipart/form-data",
                    success: function (data) {
                        $scope.getQuestions(JSON.parse(data).text);
                    },
                    error: function (e) {
                        $scope.isLoading = false;
                        $scope.$safeApply();
                        ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                            message: 'Unable to upload file, please choose other file',
                            position: 'topCenter',
                            icon: 'fa fa-warning'
                        });
                    }
                });
            }
        };

        $scope.getQuestions = function (text) {
            $scope.loadingText = 'Fetching questions';
            $scope.$safeApply();
            var data = {
                "request": {
                    "text": text,
                    "num_of_questions": "5",
                    "session_id": "aAbB12345",
                    "model": "genQuest"
                }
            };

            $.ajax({
                method: "POST",
                url: "https://dev.ekstep.in/api/devcon/v3/generate/qb",
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log("success", data);
                    _.forEach(data.result.questions, function (element) {
                        $scope.generateRequest(element);
                    });
                    $scope.isLoading = false;
                    ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                        message: 'Question Created Successfully',
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                    $scope.$safeApply();
                },
                error: function (e) {
                    $scope.isLoading = false;
                    ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                        message: 'Unable to create question',
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                    console.log(e);
                    $scope.$safeApply();
                }
            });
        }

        $scope.init();
    }]);

//# sourceURL=worksheetApp.js


