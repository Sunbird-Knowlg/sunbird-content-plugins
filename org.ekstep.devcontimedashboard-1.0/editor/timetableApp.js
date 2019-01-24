angular.module('timetableApp', ['angular-inview'])
    .controller('timetableCtrl', ['$scope', '$http', '$timeout', 'instance', function ($scope, $http, $timeout, instance) {
  
        $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
        $scope.isLoading = true;
        $scope.detailsView = [];
        $scope.userSearchBody = {
            "filters": {
                "objectType": ["Content", "AssessmentItem"],
                "status": ["Live", "Draft"],
                "subject": "subject_name",
                "keywords": ["dc_sm", "dc_prepm", "dc_practm", "dc_assmt"]
            },
            "exists": ["keywords"],
            "fields": ["identifier", "name", "topic", "keywords"],
            "sort_by": {
                "lastUpdatedOn": "desc"
            }
        };

        $scope.showDetailedView = false;
        $scope.topic;
        $scope.type;
        $scope.flag = false;

        $scope.classDetails = ["class 4"];
        $scope.subjedDetails = ["geography"];

        $scope.init = function () {
           
           
            $scope.contentNotFoundImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/content_not_found.jpg");
            $scope.telemetry = {
                "pluginid": instance.manifest.id,
                "pluginver": instance.manifest.ver
            };
            $scope.contentId = ecEditor.getContext('contentId');
            $scope.userService = org.ekstep.contenteditor.api.getService(ServiceConstants.USER_SERVICE);
            $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
            $scope.getteacherProfile();
            $scope.getContentTimetable();
            $scope.selectedElement = undefined;

            setTimeout(function() {
                var header = document.getElementById("myDIV");
                var btns = header.getElementsByClassName("btn");
                for (var i = 0; i < btns.length; i++) {
                btns[i].addEventListener("click", function() {
                var current = document.getElementsByClassName("active");
                console.log(current);
                if (current.length >= 10) { 
                    current[9].className = current[9].className.replace("btn selectable active", "btn selectable");
                }
                this.className += " active";
                });
                }
                ecEditor.jQuery('.ui.dropdown')
                .dropdown();
            }, 1000)
        }

        /**
         *  Call Api and get Teacher Details
         *
         */
        $scope.getteacherProfile = function () {
            if (window.context.dcUser) {
                $scope.classDetails = [];
                $scope.subjedDetails = [];

                $scope.classDetails.push(window.context.dcUser.gradeLevel);
                $scope.subjedDetails.push(window.context.dcUser.subject)

            };

        }

        $scope.getContentTimetable = function () {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var data = {
                "request": {
                    "filters": {
                        "objectType": ["Content"],
                        "status": [],
                        "subject": $scope.subjedDetails[0],
                        "gradeLevel": $scope.classDetails[0],
                        "keywords": ["dc_primary", "dc_secondary", "dc_preparatory", "dc_practice", "dc_assessment"]
                    },
                    "exists": ["keywords"],
                    "limit": 50,
                    "fields": ["identifier", "name", "topic", "keywords"],
                    "sort_by": {
                        "lastUpdatedOn": "desc"
                    }
                }
            }
            var url = 'https://dev.ekstep.in/api/devcon/v3/search/table';
            $http.post(url, data, config)
                .then(function (response) {
                    $scope.topic2 = response;
                }, function (err) {
                    console.log(err);
                });

        }

        /**
         * This method is used for show details view of table content when click on number count
         */
        $scope.showDetailedRow = function (type, topic) {
            $scope.detailsView = [];
            type.forEach(function (data) {
                $scope.detailsView.push({
                    'id': data.identifier,
                    'name': data.name
                });
                $scope.topicName = data.topic[0];
            });
           
            $scope.topicTitle = topic;
            $scope.showDetailedView = true;
        }

        /**
         * This method is used for show details of each topic and redirct 
         * the corresponding content page
         */
        $scope.showTopicsDetails = function (contentId) {
            var url = 'https://dev.sunbirded.org/resources/play/content';
            var urlCombine = url + '/' + contentId
            window.open(urlCombine, '_blank');
        }


        /**
         * It closes the popup
         */
        $scope.closePopup = function () {
            window.context.dcUser;
            $scope.createNewContent();
            $scope.closeThisDialog();
        };

        $scope.createNewContent = function() {
                // Create Content
                var data = {
                    request: {
                        content: {
                            "name": "Untitled Content",
                            "code": UUID(),
                            "mimeType": 'application/vnd.ekstep.ecml-archive',
                            "createdBy": ecEditor.getContext('user').id,
                            "createdFor": ['devcon'],
                            "contentType": "Resource",
                            "resourceType": "Learn",
                            "creator": ecEditor.getContext('user').name,
                            "framework": 'devcon-appu',
                            "organisation": ['devcon']
                        }
                    }
                }
    
                $scope.contentService.createContent(data, function(err, res) {
                    if (err) {
                        ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                            message: 'Unable to create content!',
                            position: 'topCenter',
                            icon: 'fa fa-warning'
                        });                   
                    } else {
                        var result = res.data.result;
                        window.open('http://localhost:3000/app/?contentId=' + result.node_id, '_blank');
                        //ecEditor.setContext('contentId', result.node_id);
                        var resourceInfo = {
                            "identifier": result.node_id,
                            "mimeType": mimeType,
                            "framework": ecEditor.getContext('framework'),
                            "contentType": "Resource",
                        }
                        var creatorInfo = {
                            "name": ecEditor.getContext('user').name,
                            "id": ecEditor.getContext('user').id
                        }
                    }
                });
        }

        $scope.init();
    }]);

//# sourceURL=timetableDashboardApp.js