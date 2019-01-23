
angular.module('timetableApp', ['angular-inview'])
    .controller('timetableCtrl', ['$scope','$http', '$timeout', 'instance', function ($scope,$http, $timeout, instance) {
        
        $scope.isLoading = true;
        $scope.detailsView = [];
        $scope.userSearchBody = {
            "filters":{
                "objectType":["Content","AssessmentItem"],
                "status":["Live","Draft"],
                "subject":"subject_name",
                "keywords":["dc_sm","dc_prepm","dc_practm","dc_assmt"]
            },
            "exists":["keywords"],
            "fields":["identifier","name","topic","keywords"],
            "sort_by":{"lastUpdatedOn":"desc"}
        };

        $scope.showDetailedView = false;
        $scope.topic;
        $scope.type;
        $scope.flag = false;
  
        $scope.classDetails = ["class 3"];
        $scope.subjedDetails = ["evs"];

        $scope.init = function () {
            $scope.contentNotFoundImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/content_not_found.jpg");
            $scope.telemetry = { "pluginid": instance.manifest.id, "pluginver": instance.manifest.ver };
            $scope.contentId = ecEditor.getContext('contentId');
            $scope.userService = org.ekstep.contenteditor.api.getService(ServiceConstants.USER_SERVICE);
            $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
            $scope.getteacherProfile();
            $scope.getContentTimetable();
        }

        /**
         *  Call Api and get Teacher Details
         *
        */
        $scope.getteacherProfile = function() {
            if(window.context.dcUser) {
                $scope.classDetails = [];
                $scope.subjedDetails = [];

                $scope.classDetails.push(window.context.dcUser.gradeLevel);
                $scope.subjedDetails.push(window.context.dcUser.subject)

            }
            ;

        }

        $scope.getContentTimetable = function () {
            var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
            }
            var  data =  {"request": { 
                "filters":{
                    "objectType":["Content"],
                    "status":[],
                    "subject":$scope.subjedDetails[0],
                    "gradeLevel":$scope.classDetails[0],
                    "keywords":["dc_primary","dc_secondary","dc_preparatory","dc_practice","dc_assessment"]
                },
                "exists":["keywords"],
                "limit":50,
                "fields":["identifier","name","topic","keywords"],
                "sort_by":{"lastUpdatedOn":"desc"}
                }
            }
            var url = 'https://dev.ekstep.in/api/devcon/v3/search/table';
            $http.post(url, data, config)
            .then(function(response) {
                $scope.topic2 = response;
            }, function(err){
                console.log(err);
            }
        );
        
    }

        /**
         * This method is used for show details view of table content when click on number count
         */
        $scope.showDetailedRow = function(type, topic) {
            $scope.detailsView = [];
            type.forEach(function(data){
                $scope.detailsView.push(data.name);
            });
            $scope.topicTitle = topic;
            $scope.showDetailedView = true;
        }


        /**
         * It closes the popup
         */
        $scope.closePopup = function () {
            $scope.closeThisDialog();
        };

        $scope.applyJQuery = function () {
            ecEditor.jQuery('.ui.dropdown').dropdown({
                onChange: function (val) {
                    //$scope.sortUsersList(val);
                }
            });
        }

      
        $scope.init();
    }]);

//# sourceURL=timetableDashboardApp.js
