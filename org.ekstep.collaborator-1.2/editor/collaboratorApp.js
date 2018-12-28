
angular.module('collaboratorApp', ['angular-inview'])
    .controller('collaboratorCtrl', ['$scope', '$timeout', 'instance', function ($scope, $timeout, instance) {
        $scope.inViewLogs = [];
        $scope.searchRes = { count: 0, content: [], isEmptyResponse: false, errorMessage: '', searchStatus: 'start' };
        $scope.isAddCollaboratorTab = false;
        $scope.isLoading = true;
        $scope.defaultLimit = 200;
        $scope.isContentOwner = false;
        $scope.users = [];
        $scope.collaborators = [];
        $scope.currentCollaborators = []; //existingCollaborators
        $scope.userSearchBody = {
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
        $scope.updateCollaboratorRequest = {
            "request": {
                "content": {
                    "collaborators": []
                }
            }
        };

        $scope.init = function () {
            $scope.contentNotFoundImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/content_not_found.jpg");
            $scope.telemetry = { "pluginid": instance.manifest.id, "pluginver": instance.manifest.ver };
            $scope.contentId = ecEditor.getContext('contentId');
            $scope.userService = org.ekstep.contenteditor.api.getService(ServiceConstants.USER_SERVICE);
            $scope.contentService = ecEditor.getService(ServiceConstants.CONTENT_SERVICE);

            /* Close popup on press of ESCAPE key */
            ecEditor.jQuery(document).keydown(function (e) {
                if (e.keyCode == 27) {
                    $scope.closePopup();
                }
            });
            $scope.getContentCollaborators();
        }

        $scope.getContentCollaborators = function () {
            $scope.contentService.getContent(ecEditor.getContext('contentId'), function (err, res) {

                if (err) {
                    console.error('Unable to fetch collaborators', err);
                    $scope.isLoading = false;
                    ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                        message: 'Unable to fetch collaborators',
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                    $scope.generateError({ status: '', error: err });
                    $scope.closePopup();
                } else if (res) {
                    $scope.isContentOwner = (res.createdBy === ecEditor.getContext('uid')) ? true : false;
                    $scope.currentCollaborators = res.collaborators || [];
                    if ($scope.isContentOwner) {
                        $scope.loadAllUsers();
                    } else {
                        $scope.fetchCollaborators();
                    }
                }
            });
        }

        /**
         * Changes Tab
         * @param {Object} event 
         */
        $scope.selectTab = function (event) {
            if (event.currentTarget.dataset.tab === 'userListTab') {
                $scope.generateTelemetry({ type: 'click', subtype: 'changeTab', target: 'manageCollaborator', targetid: 'userListTab' });
                $scope.isAddCollaboratorTab = false;


                /* istanbul ignore else */
                if (!$scope.collaborators.length) {
                    $scope.isLoading = true;
                    $scope.fetchCollaborators();
                }
            } else {
                $scope.generateTelemetry({ type: 'click', subtype: 'changeTab', target: 'addCollaborator', targetid: 'addCollaboratorTab' });
                $scope.isLoading = false;
                $scope.isAddCollaboratorTab = true;
            }

            ecEditor.jQuery('.menu .item').tab();
            $scope.$safeApply();
            $timeout(function () {
                ecEditor.jQuery('.profile-avatar').initial();
                $scope.applyJQuery();
            }, 0);
        }

        $scope.resetSearchRequest = function () {
            $scope.userSearchBody.request.filters = {
                "organisations.roles": ["CONTENT_CREATOR"],
            }
            $scope.userSearchBody.request.query = "";
        }

        /**
        * Makes API call to fetch currently added collaborators/owners
        */
        $scope.fetchCollaborators = function () {
            if ($scope.currentCollaborators && $scope.currentCollaborators.length) {
                $scope.userSearchBody.request.filters.userId = $scope.currentCollaborators;
                $scope.userService.search($scope.userSearchBody, function (err, res) {
                    if (err) {
                        console.error('Unable to fetch collaborators Profile=>', err);
                        $scope.generateError({ status: '', error: err });
                    } else {
                        /* istanbul ignore else */
                        if (res && res.data && res.data.result && res.data.result.response && res.data.result.response.content && res.data.result.response.content.length) {
                            $scope.collaborators = res.data.result.response.content;
                            $scope.collaborators.selectedCount = 0;

                            $timeout(function () {
                                ecEditor.jQuery('.profile-avatar').initial();
                            }, 0);
                        }
                    }
                    $scope.isLoading = false;
                    $scope.$safeApply();
                });
            } else {
                $scope.isLoading = false;
                $scope.$safeApply();
            }
        }

        /**
         * Fetches users having content creation role
         */
        $scope.loadAllUsers = function () {
            $scope.isAddCollaboratorTab = true;
            $scope.resetSearchRequest();
            $scope.userService.search($scope.userSearchBody, function (err, res) {
                if (err) {
                    console.error('Unable to fetch All Users ', err);
                    $scope.generateError({ status: '', error: err });
                } else {
                    if ($scope.currentCollaborators && $scope.currentCollaborators.length) {
                        $scope.users = $scope.excludeCollaborators(res.data.result.response.content);
                    } else {
                        /*istanbul ignore else */
                        if (res && res.data && res.data.result && res.data.result.response && res.data.result.response.content) {
                            $scope.users = res.data.result.response.content;
                            $scope.users.count = res.data.result.response.content.length;
                        }
                    }

                    $scope.users.selectedCount = 0;
                    $scope.isLoading = false;

                    $('.menu .item').tab();
                    $timeout(function () {
                        ecEditor.jQuery('.profile-avatar').initial();
                        $scope.applyJQuery();
                    }, 0);
                    $scope.$safeApply();
                }
            });
        }

        /**
         * Updates collaborators
         * @param {Array<string>} newCollaborators - List of new collaborators id.
         */
        $scope.updateCollaborators = function (newCollaborators) {
            $scope.updateCollaboratorRequest.request.content.collaborators = newCollaborators;
            $scope.userService.updateCollaborators(ecEditor.getContext('contentId'), $scope.updateCollaboratorRequest, function (err, res) {
                if (err) {
                    ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                        message: 'Unable to update collaborator',
                        position: 'topCenter',
                        icon: 'fa fa-warning'
                    });
                } else {
                    ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                        message: 'Collaborators updated successfully',
                        position: 'topCenter',
                        icon: 'fa fa-check-circle'
                    });
                    var metaData = $scope.contentService.getContentMeta(ecEditor.getContext('contentId'));

                    /* istanbul ignore else */
                    if (res.data.result && res.data.result.versionKey) {
                        metaData.versionKey = res.data.result.versionKey;
                    }
                    $scope.contentService._setContentMeta(ecEditor.getContext('contentId'), metaData);
                    $scope.closePopup();
                }
            });
        }

        /**
         * It excludes users those are already a collaborator.
         * @param {Object} users - User search API Result
         * @returns Users list with excluding existing collaborators
         */
        $scope.excludeCollaborators = function (users) {
            users.count = users.length;

            /*istanbul ignore else */
            if ($scope.currentCollaborators && $scope.currentCollaborators.length) {
                _.find(users, function (val, index) {
                    if (_.indexOf($scope.currentCollaborators, val.identifier) >= 0) {
                        users[index].isCollaborator = true;
                        users.count -= 1;
                    }
                });
            }

            return users;
        }

        /**
         * It closes the popup
         */
        $scope.closePopup = function () {
            ecEditor.jQuery(document).off('keydown');
            $scope.inViewLogs = [];
            $scope.generateTelemetry({ type: 'click', subtype: 'cancel', target: 'closePopup', targetid: 'close-button' });
            $scope.closeThisDialog();
        };

        /**
         * It selects or unselects users from the list
         * @param {Object} user  - User Object
         * @param {Number} index - Index of the user in the userList
         * @param {String} list  -Variable to hold whole object - users | collaborators
         */
        $scope.toggleSelectionUser = function (user, index, list) {
            if ($scope[list][index].isSelected) {
                $scope.generateTelemetry({ type: 'click', subtype: 'uncheck', target: 'user', targetid: user.identifier });
                $scope[list][index].isSelected = false;
                $scope[list].selectedCount -= 1;
            } else {
                $scope.generateTelemetry({ type: 'click', subtype: 'check', target: 'user', targetid: user.identifier });
                $scope[list][index].isSelected = true;
                $scope[list].selectedCount += 1;
            }

            $scope.$safeApply();
        }

        /**
         * Sort Users List by Name and Organisation
         * @param {String} value - Sort by value - firstName | organisations
         */
        $scope.sortUsersList = function (value) {
            if (value === 'firstName') {
                $scope.users = _.orderBy($scope.users, [user => user[value].toLowerCase()]);
            } else {
                $scope.users = _.orderBy($scope.users, [user => user.organisations[0].orgName ? user.organisations[0].orgName.toLowerCase() : '']);
            }
            $scope.$safeApply();
        }

        /**
         * Selects User and added to list with checked mark
         * @param {Object} user User's object
         */
        $scope.selectUser = function (user) {
            var index = _.findIndex($scope.users, (element) => { return element.identifier === user.identifier; });
            user.isSelected = true;
            $scope.users.selectedCount += 1;

            /* If New user other than existing users */
            if (index === -1) {
                $scope.users.count += 1;
            } else {
                $scope.users.splice(index, 1);
            }
            $scope.users.unshift(user);

            $scope.generateTelemetry({ type: 'click', subtype: 'select', target: 'user', targetid: user.identifier });
            $timeout(function () {
                ecEditor.jQuery('.profile-avatar').initial();
            }, 0);
            $scope.$safeApply();
        }

        $scope.searchByKeyword = function () {
            ecEditor.jQuery('.search-Loader').addClass('active');
            $scope.resetSearchRequest();
            $scope.userSearchBody.request.query = this.searchKeyword;

            $scope.userService.search($scope.userSearchBody, function (err, res) {
                if (err) {
                    $scope.searchRes.content = [];
                    $scope.searchRes.isEmptyResponse = true;
                    $scope.searchRes.errorMessage = "Oops! Something went wrong. Please try again later.";
                } else {
                    $scope.searchRes.searchStatus = "end";

                    if (res.data.result.response.count) {
                        $scope.searchRes.content = $scope.excludeCollaborators(res.data.result.response.content);

                        if ($scope.searchRes.content.length) {
                            $scope.searchRes.isEmptyResponse = false;
                        }
                    } else {
                        $scope.searchRes.isEmptyResponse = true;
                        $scope.searchRes.content = [];
                    }

                    $scope.searchRes.count = res.data.result.response.count;
                    $scope.$safeApply();
                }
            });
            $scope.generateTelemetry({ type: 'click', subtype: 'submit', target: 'search', targetid: 'search-button' });
        }

        $scope.filterSearch = function (user) {
            return !user.isCollaborator;
        }

        /**
         * Shows Search Results in large screen
         */
        $scope.viewAllResults = function () {
            $scope.generateTelemetry({ type: 'click', subtype: 'submit', target: 'viewAll', targetid: "view-all-results" });
            $scope.users = $scope.searchRes.content;
            $timeout(function () {
                ecEditor.jQuery('.profile-avatar').initial();
            }, 0);
        }

        $scope.refreshSearch = function () {
            $scope.generateTelemetry({ type: 'click', subtype: 'refresh', target: 'refreshSearch', targetid: "refresh-button" });
            this.searchKeyword = '';
        }

        $scope.addCollaborators = function () {
            $scope.generateImpression({ type: 'click', subtype: 'submit', pageid: 'AddCollaborator' });
            var newCollaborators = _.map(_.filter($scope.users, (user) => { return user.isSelected || user.isCollaborator }), 'identifier');
            $scope.updateCollaborators(_.uniq(newCollaborators.concat($scope.currentCollaborators)));
            $scope.inViewLogs = [];
        }

        $scope.removeCollaborators = function () {
            $scope.generateImpression({ type: 'click', subtype: 'submit', pageid: 'RemoveCollaborator' });
            var newCollaborators = _.difference($scope.currentCollaborators, _.map(_.filter($scope.collaborators, (collaborator) => { return collaborator.isSelected }), 'identifier'));
            $scope.updateCollaborators(newCollaborators);
            $scope.inViewLogs = [];
        }

        /**
         * Resets search values
         */
        $scope.resetSearch = function () {
            $scope.searchRes.content = [];
            $scope.searchRes.isEmptyResponse = false;
        }

        $scope.applyJQuery = function () {
            ecEditor.jQuery('.ui.dropdown').dropdown({
                onChange: function (val) {
                    $scope.sortUsersList(val);
                }
            });
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

        /**
         * Generates Impression telemetry
         */
        $scope.generateImpression = function (data) {
            if (data) {
                ecEditor.getService('telemetry').impression({
                    "type": data.type,
                    "subtype": data.subtype || "",
                    "pageid": data.pageid || "",
                    "uri": window.location.href,
                    "visits": $scope.inViewLogs
                });
            }
        }

        $scope.generateError = function (error) {
            if (error) {
                ecEditor.getService('telemetry').error({
                    "env": 'content',
                    "stage": '',
                    "action": 'download',
                    "objectid": "",
                    "objecttype": "",
                    "err": error.status,
                    "type": "API",
                    "data": error,
                    "severity": "fatal"
                });
            }
        }

        /**
         * Makes records of available dom elements currently visible in the browser viewport
         * @param {Number} index   - Index of the element in the list
         * @param {Array} inview   - Object of the logs currently available in the viewport 
         * @param {Object} item    - Object of the individual item in the viewport
         * @param {String} section - Section name  
         */
        $scope.lineInView = function (index, inview, item, section) {
            var obj = $scope.inViewLogs.filter((log) => log.identifier === item.identifier);
            if (inview && !obj.length) {
                $scope.inViewLogs.push({
                    objid: item.identifier,
                    section: section,
                    index: index
                });
            }
        }

        $scope.init();
    }]);

//# sourceURL=collaborator.js
