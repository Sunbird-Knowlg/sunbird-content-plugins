
angular.module('collaboratorApp', ['ngTagsInput', 'Scope.safeApply'])
    .controller('collaboratorCtrl', ['$scope', '$timeout', 'instance', '$filter', function ($scope, $timeout, instance, $filter) {
        var ctrl = this;
        ctrl.defaultImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/default-avatar.jpg");
        ctrl.searchRes = { count: 0, content: [] };

        $scope.mode = ecEditor.getConfig('editorConfig').mode;

        let searchBody =  {
            "request": {
                "query": "",
                "filters": {},
                "fields": ["email", "firstName", "identifier", "lastName", "organisations", "thumbnail"],
                "offset": 0,
                "limit": 100
            }
        };

        $scope.userSelection = []; // Selected User object
        $scope.selectedUsersId = [];
        $scope.isAddCollaboratorPopup = false;
        $scope.searchResponse = [];
        $scope.mockUsersList = [];
        $scope.isLoading = true;
        $scope.noResultFound = false;

        // Close the popup
        $scope.closePopup = function (pageId) {
            $scope.closeThisDialog();
        };

        // apply all jquery after dom render
        ctrl.applyAllJquery = function () {
            $timeout(function () {
                ecEditor.jQuery('.checkbox').checkbox();
            });
            $timeout(function () {
                ctrl.toggleUser($scope.mockUsersList);
            }, 0);
        }

        // Add or Remove resources
        $scope.toggleSelectionUser = function (user) {
            var idx = $scope.selectedUsersId.indexOf(user.identifier);
            if (idx > -1) {
                ecEditor.jQuery('#checkBox_' + user.identifier + ' >.checkBox').prop('checked', false);
                $scope.userSelection.splice(idx, 1); // is currently selected, remove from selection list
                $scope.selectedUsersId.splice(idx, 1);
            } else {
                ecEditor.jQuery('#checkBox_' + user.identifier + ' >.checkBox').prop('checked', true);
                $scope.userSelection.push(user); // is newly selected, add to the selection list
                $scope.selectedUsersId.push(user.identifier);
            }
        }

        // Add or Remove resources
        ctrl.toggleUser = function (users) {
            angular.forEach(users, function (user) {
                if ($scope.selectedUsersId.indexOf(user.identifier) !== -1) {
                    ecEditor.jQuery('#checkBox_' + user.identifier + ' >.checkBox').prop('checked', true);
                } else {
                    ecEditor.jQuery('#checkBox_' + user.identifier + ' >.checkBox').prop('checked', false);
                }
            });
        }

        $scope.searchByKeyword = function () {
            $scope.searchStatus = "start";
            ecEditor.jQuery('.search-Loader').addClass('active');

            var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
            searchBody.request.query = this.searchKeyword;
            searchService.userSearch(searchBody, function (err, res) {
                if (err) {
                    console.log('Errror: ', err);
                    ctrl.searchRes.content = [];
                    $scope.noResultFound = true;
                    ctrl.searchErr = "Oops! Something went wrong. Please try again later.";
                } else {
                    $scope.searchStatus = "end";

                    if (res.data.result.response.content.length) {
                        ctrl.searchRes.content = res.data.result.response.content;
                    } else {
                        $scope.noResultFound = true;
                        ctrl.searchRes.content = res.data.result.response.content
                    }

                    ctrl.searchRes.count = res.data.result.response.count;
                    console.log('Response', ctrl.searchRes);
                }
            });

            // do search service call here.
        }

        $scope.refreshSearch = function () {
            this.searchKeyword = '';
        }

        $scope.returnSelectedUsers = function () {
            $scope.isAddCollaboratorPopup = false;
        }

        /**
         * Makes API call to fetch currently added collaborators/owners
         */
        $scope.fetchCollaborator = function () {

        }

        /**
         * Opens up window to add multiple collaborators
         */
        $scope.addCollaborators = function () {
            /* $scope.isAddCollaboratorPopup = true;
            $timeout(function () {
                ecEditor.jQuery('.checkbox').checkbox();
            }); */
            $scope.goBack();
        }

        /**
         * Removed existing collaborators
         */
        $scope.removeCollaborator = function (user, index) {
            $scope.userSelection.splice(index, 1);
        }

        /**
         * Resets search values
         */
        $scope.resetSearch = function () {
            ctrl.searchRes.content = [];
            $scope.noResultFound = false;
        }

        /**
         * Navigates to add collaboration window
         */
        $scope.goBack = function () {
            $scope.isAddCollaboratorPopup = true;
            $scope.noResultFound = false;
            $scope.userSelection = [];
            $scope.selectedUsersId = [];
            $timeout(function () {
                ecEditor.jQuery('.checkbox').checkbox();
            });
        }

        /**
         * Generates telemetry
         */
        $scope.generateTelemetry = function (data) {
        }

        $scope.init = function () {
            if ($scope.userSelection.length) {
                $scope.isAddCollaboratorPopup = false;
            } else {
                $scope.isAddCollaboratorPopup = true;
            }

            searchBody.request.query = "";
            var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
            searchService.userSearch(searchBody, function (err, res) {
                if (err) {
                    console.log('Errror: ', err);
                } else {
                    $scope.mockUsersList = res.data.result.response.content;
                    $scope.isLoading = false;
                    console.log('Response', $scope.mockUsersList);
                    $timeout(function () {
                        ecEditor.jQuery('.checkbox').checkbox();
                    });
                    $scope.$safeApply();
                }
            });

            ctrl.applyAllJquery();
        }

        angular.element(document).ready(function () {
            $timeout(function () {
                ecEditor.jQuery('.checkbox').checkbox();
            });
        });

        $scope.init();
    }]);
//# sourceURL=collaborator.js


        /* $scope.mockUsersList = [
            {
                "identifier": "1",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "2",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "3",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "4",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "5",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "6",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "7",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "8",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": ""
            },
            {
                "identifier": "9",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "10",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "11",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "12",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            },
            {
                "identifier": "13",
                "firstName": "John",
                "lastName": "Doe",
                "email": "johndoe@gmail.com",
                "organization": "Ekstep",
                "avatar": "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png"
            }];
 */
