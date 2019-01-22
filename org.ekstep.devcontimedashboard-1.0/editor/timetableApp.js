
angular.module('timetableApp', ['angular-inview'])
    .controller('timetableCtrl', ['$scope', '$timeout', 'instance', function ($scope, $timeout, instance) {
        
        $scope.isLoading = true;
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

        $scope.topics = {
            "topic1": {
              "dc_practice": [
                {
                  "identifier": "do_1126520449306705921230",
                  "name": "topic 1 paracice",
                  "objectType": "Content",
                  "topic": [
                    "topic1"
                  ],
                  "keywords": [
                    "dc_practice"
                  ]
                }
              ],
              "dc_assessment": [
                {
                  "identifier": "do_1126520449306705921230",
                  "name": "1.2.1 Methods",
                  "objectType": "Content",
                  "topic": [
                    "topic1"
                  ],
                  "keywords": [
                    "dc_assessment"
                  ]
                },
                {
                  "identifier": "do_1126520449306705921230",
                  "name": "topic 1 dc_assessment",
                  "objectType": "Content",
                  "topic": [
                    "topic1"
                  ],
                  "keywords": [
                    "dc_assessment"
                  ]
                }
              ],
              "dc_primary": [
                {
                  "identifier": "do_1126520449306705921230",
                  "name": "1.2.1 Methods",
                  "objectType": "Content",
                  "topic": [
                    "topic1"
                  ],
                  "keywords": [
                    "dc_primary"
                  ]
                }
              ],
              "dc_preparatory": [
                {
                  "identifier": "do_1126520449306705921230",
                  "name": "1.2.1 Methods",
                  "objectType": "Content",
                  "topic": [
                    "topic1"
                  ],
                  "keywords": [
                    "dc_preparatory"
                  ]
                }
              ]
            },
            "topic2": {
              "dc_preparatory": [
                {
                  "identifier": "do_1126520449306705921229",
                  "name": "topic2 dc_preparatory",
                  "objectType": "Content",
                  "topic": [
                    "topic2"
                  ],
                  "keywords": [
                    "dc_preparatory"
                  ]
                }
              ]
            },
            "topic5": {
              "dc_preparatory": [
                {
                  "identifier": "do_1126520449306705921229",
                  "name": "topic 5 dc_preparatory",
                  "objectType": "Content",
                  "topic": [
                    "topic5"
                  ],
                  "keywords": [
                    "dc_preparatory"
                  ]
                }
              ]
            },
            "topic4": {}
          }

          $scope.records = [
            "Alfreds Futterkiste",
            "Berglunds snabbköp",
            "Centro comercial Moctezuma",
            "Ernst Handel",
          ]

        $scope.showDetailedView = false;
        $scope.topic;
        $scope.type;
        $scope.flag = false;
  
        $scope.userDetails = ['Class 1', 'Geography'];

        $scope.init = function () {
            $scope.contentNotFoundImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/content_not_found.jpg");
            $scope.telemetry = { "pluginid": instance.manifest.id, "pluginver": instance.manifest.ver };
            $scope.contentId = ecEditor.getContext('contentId');
            $scope.userService = org.ekstep.contenteditor.api.getService(ServiceConstants.USER_SERVICE);
            $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);
            $scope.getContentTimetable();
        }

        $scope.getContentTimetable = function () {
        
        }

        $scope.showDetailedRow = function(type, topic) {
            if ($scope.topic && $scope.type && ($scope.topic === topic && $scope.type === type)) {
              $scope.flag = !$scope.flag;
            } else {
              $scope.flag = true;
            }
            console.log($scope.flag);
            $scope.topic = topic;
            $scope.type = type;
            if ($scope.flag) {
              $scope.showDetailedView = true;
            } else {
              $scope.showDetailedView = false;
            }
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
