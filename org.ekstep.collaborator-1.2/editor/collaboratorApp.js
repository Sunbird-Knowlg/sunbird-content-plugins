
angular.module('collaboratorApp', ['ngTagsInput', 'Scope.safeApply', 'angular-inview'])
    .controller('collaboratorCtrl', ['$scope', '$timeout', 'instance', '$filter', function ($scope, $timeout, instance, $filter) {
        var ctrl = this;
        var inViewLogs = [];
        ctrl.contentNotFoundImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/content_not_found.jpg");
        ctrl.searchRes = { count: 0, content: [] };

        $scope.mode = ecEditor.getConfig('editorConfig').mode;
        $scope.contentId = ecEditor.getContext('contentId');
        $scope.telemetry = { "pluginid": instance.manifest.id, "pluginver": instance.manifest.ver };
        $scope.selectedUsersId = [];
        $scope.removedUsersId = [];
        $scope.isAddCollaboratorTab = false;
        $scope.searchResponse = [];
        $scope.usersList = [];
        $scope.usersCount = 0;
        $scope.collaboratorsList = [];
        $scope.collaboratorsId = [];
        $scope.isLoading = true;
        $scope.noResultFound = false;
        $scope.defaultLimit = 200;
        $scope.isContentOwner = false;

        let userService = org.ekstep.contenteditor.api.getService(ServiceConstants.USER_SERVICE);
        let searchBody = {
            "request": {
                "query": "",
                "filters": {
                    "organisations.roles": ["CONTENT_CREATOR"],
                },
                "fields": ["email", "firstName", "identifier", "lastName", "organisations", "rootOrgName", "phone"],
                "offset": 0,
                "limit": $scope.defaultLimit
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
            $scope.getContentCollaborators();
        }

        $scope.getContentCollaborators = function () {
            ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContent(ecEditor.getContext('contentId'), function (err, res) {
                if (err) {
                    console.error('Unable to fetch collaborators', err);
                    $scope.isLoading = false;
                    $scope.closePopup();
                } else if (res) {
                    $scope.isContentOwner = (res.createdBy === ecEditor.getContext('uid')) ? true : false;
                    $scope.collaboratorsId = res.collaborators || [];
                    $scope.loadAllUsers();
                }
            });
        }

        $scope.selectTab = function (event) {
            if (event.currentTarget.dataset.tab === 'userListTab') {
                $scope.isAddCollaboratorTab = false;
                if (!$scope.collaboratorsList.length) {
                    $scope.isLoading = true;
                    $scope.fetchCollaborators();
                }
            } else {
                $scope.isLoading = false;
                $scope.isAddCollaboratorTab = true;
            }

            $('.menu .item').tab();
            $scope.$safeApply();
            $timeout(function () {
                ecEditor.jQuery('.profile').initial({ fontWeight: 700 });
                ecEditor.jQuery('.ui.dropdown').dropdown({
                    onChange: function (val) {
                        $scope.sortUsersList(val);
                    }
                });
            });
        }

        /**
        * Makes API call to fetch currently added collaborators/owners
        */
        $scope.fetchCollaborators = function () {
            if ($scope.collaboratorsId && $scope.collaboratorsId.length) {
                searchBody.request.filters.userId = $scope.collaboratorsId;
                userService.search(searchBody, function (err, res) {
                    if (err) {
                        console.error('Unable to fetch collaborators Profile=>', err);
                    } else {
                        if (res.data.result.response.content.length) {
                            $scope.collaboratorsList = res.data.result.response.content;
                            $scope.collaboratorsList.forEach((element) => {
                                element.isSelected = false;
                            });
                            $timeout(function () {
                                ecEditor.jQuery('.profile').initial({ fontWeight: 700 });
                            });
                        }
                    }
                    $scope.isLoading = false;
                    $scope.$safeApply();
                });
            }
        }

        $scope.loadAllUsers = function () {
            $scope.isAddCollaboratorTab = true;

            searchBody.request.query = "";
            if (searchBody.hasOwnProperty('userId')) {
                delete searchBody.request.userId;
            }

            userService.search(searchBody, function (err, res) {
                if (err) {
                    console.error('Unable to fetch All Users ', err);
                } else {
                    if ($scope.collaboratorsId && $scope.collaboratorsId.length) {
                        $scope.usersList = $scope.excludeCollaborators(res.data.result.response.content);
                    } else {
                        $scope.usersList = res.data.result.response.content;
                    }

                    $scope.usersCount = res.data.result.response.count < $scope.defaultLimit ? $scope.usersList.length : res.data.result.response.count;
                    $scope.usersList.forEach(element => {
                        element.isSelected = false;
                    });
                    $scope.isLoading = false;
                    $('.menu .item').tab();
                    ecEditor.jQuery('.ui.dropdown').dropdown({
                        onChange: function (val) {
                            $scope.sortUsersList(val);
                        }
                    });
                    $scope.$safeApply();
                    ecEditor.jQuery('.profile').initial({ fontWeight: 700 });
                }
            });
            $scope.$safeApply();
        }

        /**
         * Updates collaborators
         */
        $scope.updateCollaborators = function (target) {
            $scope.generateTelemetry({ type: 'click', subtype: 'update', target: target, targetid: 'done-button' });
            if ($scope.isAddCollaboratorTab) {
                updateCollaboratorRequest.request.content.collaborators = _.uniq($scope.selectedUsersId.concat($scope.collaboratorsId));
            } else {
                var updatedUsersId = [];
                $scope.collaboratorsId.forEach((element) => {
                    let index = $scope.removedUsersId.indexOf(element);
                    if (index === -1) {
                        updatedUsersId.push(element);
                    }
                });

                updateCollaboratorRequest.request.content.collaborators = updatedUsersId;
            }

            userService.updateCollaborators(ecEditor.getContext('contentId'), updateCollaboratorRequest, function (err, res) {
                if (err) {
                    ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                        message: 'Unable to update collaborator',
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                } else {
                    ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                        message: 'Collaborator updated successfully',
                        position: 'topCenter',
                        icon: 'fa fa-check-circle'
                    });
                    $scope.closePopup();
                }
            });
        }

        $scope.excludeCollaborators = function (result) {
            if ($scope.collaboratorsId && $scope.collaboratorsId.length) {
                $scope.collaboratorsId.forEach((id) => {
                    result.forEach((user, index) => {
                        if (user.identifier === id) {
                            result.splice(index, 1);
                            return;
                        }
                    });
                });
            }

            return result;
        }

        // Close the popup
        $scope.closePopup = function (pageId) {
            inViewLogs = [];
            $scope.generateTelemetry({ type: 'click', subtype: 'cancel', target: 'closePopup', targetid: 'close-button' });
            $scope.closeThisDialog();
        };

        $scope.toggleSelectionUser = function (user, index, usersId, list) {
            var idx = $scope[usersId].indexOf(user.identifier);
            if (idx > -1) {
                $scope.generateTelemetry({ type: 'click', subtype: 'uncheck', target: 'user', targetid: user.identifier });
                $scope[usersId].splice(idx, 1);
                $scope[list][index].isSelected = false;
            } else {
                $scope.generateTelemetry({ type: 'click', subtype: 'check', target: 'user', targetid: user.identifier });
                $scope[usersId].push(user.identifier);
                $scope[list][index].isSelected = true;
            }
            $scope.$safeApply();
        }

        /**
         * Sort Users List by Name and Organisation
         */
        $scope.sortUsersList = function (value) {
            if (value === 'firstName') {
                $scope.usersList = _.orderBy($scope.usersList, [user => user[value].toLowerCase()]);
            } else {
                 $scope.usersList = _.orderBy($scope.usersList, [user => user.organisations[0].orgName ? user.organisations[0].orgName.toLowerCase() : '' ]);
            }
            $scope.$safeApply();
        }

        /**
         * Selects User and show check mark checked
         */
        $scope.selectUser = function (user) {
            $scope.generateTelemetry({ type: 'click', subtype: 'select', target: 'user', targetid: user.identifier });
            $scope.selectedUsersId.push(user.identifier);
            $scope.addCollaborators();
        }

        $scope.searchByKeyword = function () {
            $scope.searchStatus = "start";
            ecEditor.jQuery('.search-Loader').addClass('active');

            searchBody.request.query = this.searchKeyword;
            $scope.generateTelemetry({ type: 'click', subtype: 'submit', target: 'search', targetid: 'search-button' });

            userService.search(searchBody, function (err, res) {
                if (err) {
                    ctrl.searchRes.content = [];
                    $scope.noResultFound = true;
                    ctrl.searchErr = "Oops! Something went wrong. Please try again later.";
                } else {
                    $scope.searchStatus = "end";

                    if (res.data.result.response.count) {
                        ctrl.searchRes.content = $scope.excludeCollaborators(res.data.result.response.content);
                        if (ctrl.searchRes.content.length) {
                            $scope.noResultFound = false;
                        }
                    } else {
                        $scope.noResultFound = true;
                        ctrl.searchRes.content = [];
                    }

                    ctrl.searchRes.count = res.data.result.response.count;
                    $scope.$safeApply();
                }
            });
        }

        /**
         * Shows Search Results in large screen
         */
        $scope.viewAllResults = function () {
            $scope.generateTelemetry({ type: 'click', subtype: 'submit', target: 'viewAll', targetid: "" });
            $scope.usersList = $scope.excludeCollaborators(ctrl.searchRes.content);
            $scope.usersCount = ctrl.searchRes.count < $scope.defaultLimit ? $scope.usersList.length : ctrl.searchRes.count;
            $timeout(function () {
                ecEditor.jQuery('.profile').initial({ fontWeight: 700 });
            });
        }

        $scope.refreshSearch = function () {
            $scope.generateTelemetry({ type: 'click', subtype: 'refresh', target: 'refreshSearch', targetid: "refresh-button" });
            this.searchKeyword = '';
        }

        $scope.addCollaborators = function () {
            $scope.generateImpression({ type: 'click', subtype: 'submit', pageid: 'AddCollaborator' });
            $scope.updateCollaborators();
            inViewLogs = [];
        }

        /**
         * Resets search values
         */
        $scope.resetSearch = function () {
            ctrl.searchRes.content = [];
            $scope.noResultFound = false;
        }

        $scope.getOrganisation = function (organisations) {
            return _.uniq(_.map(organisations, 'orgName')).toString();
        }

        /**
         * Generates telemetry
         */
        $scope.generateTelemetry = function (data) {
            if (data) {
                ecEditor.getService('telemetry').interact({
                    "type": data.type,
                    "subtype": data.subtype,
                    "target": data.target,
                    "targetid": data.targetid,
                    "pluginid": $scope.telemetry.pluginid,
                    "pluginver": $scope.telemetry.pluginver,
                    "objectid": '',
                });
            }
        }

        // Generate Impression telemetry
        $scope.generateImpression = function (data) {
            if (data) {
                ecEditor.getService('telemetry').impression({
                    "type": data.type,
                    "subtype": data.subtype || "",
                    "pageid": data.pageid || "",
                    "uri": window.location.href,
                    "visits": inViewLogs
                });
            }
        }

        $scope.lineInView = function (index, inview, item, section, pageSectionId) {
            let obj = inViewLogs.filter((log) => log.identifier === item.identifier);
            if (inview && !obj.length) {
                inViewLogs.push({
                    objid: item.identifier,
                    section: section,
                    index: index
                });
            }
        }

        $scope.init();
    }]);

//# sourceURL=collaborator.js
