
angular.module('collaboratorApp', ['ngTagsInput', 'Scope.safeApply'])
    .controller('collaboratorCtrl', ['$scope', '$timeout', 'instance', '$filter', function ($scope, $timeout, instance, $filter) {
        var ctrl = this;
        ctrl.defaultImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/default-avatar.jpg");
        ctrl.searchRes = { count: 0, content: [] };

        $scope.mode = ecEditor.getConfig('editorConfig').mode;
        $scope.contentId = ecEditor.getContext('contentId');
        $scope.currentCollaborators = [];
        $scope.userSelection = []; // Selected User object
        $scope.selectedUsersId = [];
        $scope.isAddCollaboratorPopup = false;
        $scope.searchResponse = [];
        $scope.usersList = [];
        $scope.isLoading = true;
        $scope.noResultFound = false;

        let searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
        let searchBody = {
            "request": {
                "query": "",
                "filters": {},
                "fields": ["email", "firstName", "identifier", "lastName", "organisations", "thumbnail"],
                "offset": 0,
                "limit": 100
            }
        };

        let updateCollaboratorRequest = {
            "request": {
                "content": {
                    "collaborators": []
                }
            }
        };


        $scope.init = function () {
            /*
                1. First check - Existing collaborators for the current content
                2. If there are existing collaborators show - collaborators list
                3. If there are no existing collaborators then show add collaborators screen
            */
            // Fetch collaborators list
            $scope.fetchCollaborators();
        }

        /**
        * Makes API call to fetch currently added collaborators/owners
        */
        $scope.fetchCollaborators = function () {
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getCollectionHierarchy({ contentId: ecEditor.getContext('contentId'), mode: 'edit' }, function (err, res) {
                if (err) {
                    console.error('Unable to fetch collaborators', err);
                    $scope.loadTemplate();
                } else if (res && res.data && res.data.responseCode === "OK") {
                    console.log('Content Collaborators Response=>', res.data.result.content.collaborators);

                    searchBody.request.filters.userId = res.data.result.content.collaborators;
                    $scope.selectedUsersId = res.data.result.content.collaborators;
                    searchService.userSearch(searchBody, function (err, res) {
                        if (err) {
                            console.error('Unable to fetch collaborators Profile=>', err);
                        } else {
                            if (res.data.result.response.content.length) {
                                $scope.currentCollaborators = res.data.result.response.content;
                                console.log("currentCOllaborators", $scope.currentCollaborators);
                                $scope.userSelection = _.cloneDeep(res.data.result.response.content);
                            }
                            console.log('Response collaborators object list', $scope.currentCollaborators);
                        }
                        $scope.loadTemplate();
                    });
                } else {
                    console.error('Unable to fetch collection hierarchy', res);
                    $scope.loadTemplate();
                }
            });
        }

        /**
         * Loads template based on availability of the collaborators
         */
        $scope.loadTemplate = function () {
            if ($scope.userSelection.length) {
                $scope.isAddCollaboratorPopup = false;
                $scope.isLoading = false;
                console.log("Current Collaborators=>", $scope.userSelection);
            } else {
                $scope.loadAllUsers();
            }
        }

        $scope.loadAllUsers = function () {
            $scope.isAddCollaboratorPopup = true;

            searchBody.request.query = "";
            searchBody.request.filters = {};
            searchService.userSearch(searchBody, function (err, res) {
                if (err) {
                    console.log('Unable to fetch All Users ', err);
                } else {
                    $scope.usersList = res.data.result.response.content;
                    $scope.isLoading = false;
                    console.log('All users response=>', $scope.usersList);
                    $timeout(function () {
                        ecEditor.jQuery('.checkbox').checkbox();
                    });
                    ctrl.applyAllJquery();

                    angular.element(document).ready(function () {
                        $timeout(function () {
                            ecEditor.jQuery('.checkbox').checkbox();
                        });
                    });

                }
            });
            $scope.$safeApply();
        }

        /**
         * Removed existing collaborators
         */
        $scope.removeCollaborator = function (user, index) {
            $scope.userSelection.splice(index, 1);
            console.log('After Removed Collaborator=>', $scope.userSelection);
        }

        /**
         * Updates collaborators
         */
        $scope.updateCollaborators = function () {

            console.log('currentCollaborators', $scope.currentCollaborators);
            console.log('selectedUsersId', $scope.selectedUsersId);

            if (_.isEqual($scope.currentCollaborators.map(user => user.identifier).sort(), $scope.selectedUsersId.sort())) {
                alert('Coming here');
                $scope.closePopup();
            } else {
                updateCollaboratorRequest.request.content.collaborators = $scope.selectedUsersId;

                var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);
                searchService.updateCollaborators(ecEditor.getContext('contentId'), updateCollaboratorRequest, function (err, res) {
                    if (err) {
                        console.log('Unable to update collaborator', err);
                    } else {
                        alert('Collaborator updated successfully');
                        $scope.closePopup();
                    }
                });
            }
        }

        // Close the popup
        $scope.closePopup = function (pageId) {
            $scope.closeThisDialog();
        };

        /**
         * Opens up window to add multiple collaborators
         */
        $scope.showUsersList = function () {
            if ($scope.showUsersList.length) {
                $scope.isAddCollaboratorPopup = true;
                $scope.noResultFound = false;
                //$scope.userSelection = [];
                //$scope.selectedUsersId = [];
                $timeout(function () {
                    ecEditor.jQuery('.checkbox').checkbox();
                });
            } else {
                $scope.isAddCollaboratorPopup = true;
                $scope.isLoading = true;
                $scope.loadAllUsers();
            }
        }

        // apply all jquery after dom render
        ctrl.applyAllJquery = function () {
            $timeout(function () {
                ecEditor.jQuery('.checkbox').checkbox();
            });
            $timeout(function () {
                ctrl.toggleUser($scope.usersList);
            }, 0);
        }

        // Add or Remove users
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

            console.log('currentCOllaborator', $scope.currentCollaborators);

        }

        /**
         * Selects User and show check mark checked
         */
        $scope.selectUser = function (user) {
            $scope.userSelection.push(user); // is newly selected, add to the selection list
            $scope.selectedUsersId.push(user.identifier);
            // $scope.returnSelectedUsers();
        }

        // Add or Remove user
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
                    console.log('User Search Failed:=>', err);
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
                    console.log('User Search Response=>', ctrl.searchRes);
                }
            });
        }

        /**
         * Shows Search Results in large screen
         */
        $scope.viewAllResults = function () {
            $scope.usersList = ctrl.searchRes.content;
        }

        $scope.refreshSearch = function () {
            this.searchKeyword = '';
        }

        $scope.returnSelectedUsers = function () {
            $scope.isAddCollaboratorPopup = false;
        }

        /**
         * Resets search values
         */
        $scope.resetSearch = function () {
            ctrl.searchRes.content = [];
            $scope.noResultFound = false;
        }

        /**
         * Generates telemetry
         */
        $scope.generateTelemetry = function (data) {
        }
        $scope.init();
    }]);

//# sourceURL=collaborator.js
