'use strict';

angular.module('org.ekstep.review', [])
    .controller('reviewcontroller', ['$scope', '$injector', 'instance', '$rootScope', function($scope, $injector, instance, $rootScope) {
        var ctrl = this;

        /**Set contentMeta object to display info in send for review popup**/
        ctrl.contentMeta = instance.contentObj;
        /**Show dialog messages**/
        ctrl.editContentMeta = function(dialogMsg, responseMsg) {
            if (ecEditor._.isUndefined(dialogMsg) && ecEditor._.isUndefined(responseMsg)) {
                ecEditor.dispatchEvent('org.ekstep.review:showDialog', {
                    dialogMainText: 'Have you saved your changes?',
                    dialogSubtext: 'Navigating to content details page',
                    isRedirect: true
                });
            } else if (dialogMsg && ecEditor._.isUndefined(responseMsg)) {
                ecEditor.dispatchEvent('org.ekstep.review:showDialog', {
                    dialogMainText: dialogMsg,
                    dialogSubtext: 'Click on Edit Details to edit Content details',
                    isRedirect: false
                });
            } else {
                ecEditor.dispatchEvent('org.ekstep.review:showDialog', {
                    dialogMainText: dialogMsg,
                    dialogSubtext: '',
                    isRedirect: false,
                    isError: ctrl.success ? false : true
                });
            }
        }

        /**Close send for reivew popup after success messages**/
        ctrl.closeThisDialog = function(success) {
            if (success) {
                $scope.closeThisDialog();
            } else {
                ctrl.active = '';
            }
        }

        /**send for review content**/
        ctrl.sendForReview = function() {
            var isValid = 1,
                fieldsToFill = [],
                mandatoryFields = {
                    "appIcon": "Lesson Icon",
                    "name": "Title",
                    "description": "Description",
                    "contentType": "Lesson Type",
                    "language": "Language",
                    "domain": "Domain",
                    "owner": "Author",
                    "ageGroup": "Age Group",
                    "gradeLevel": "Grades"
                };
            /**Check for mandatory fields**/
            if (ctrl.contentMeta['name'] == "Untitled lesson") {
                isValid = 0;
                fieldsToFill.push('Title');
            }
            ecEditor._.each(mandatoryFields, function(value, key) {
                if (typeof ctrl.contentMeta[key] == 'undefined' || ctrl.contentMeta[key] == "") {
                    isValid = 0;
                    fieldsToFill.push(value);
                } else if (Array.isArray(ctrl.contentMeta[key]) && ctrl.contentMeta[key].length == 0) {
                    isValid = 0;
                    fieldsToFill.push(value);
                }
            });

            /**Check if it is valid**/
            if (isValid == 1) {
                var contentBody = org.ekstep.contenteditor.stageManager.toECML();
                $rootScope.patchContent({ stageIcons: JSON.stringify(org.ekstep.contenteditor.stageManager.getStageIcons()) }, contentBody, function() {
                    ctrl.message = "Saving content";
                    ctrl.active = "active";
                    ctrl.isLoading = true;
                    ctrl.success = false;
                    ctrl.success_msg = "";

                    ecEditor.ngSafeApply($scope);

                    /**Call portal task to send for review content**/
                    ecEditor.jQuery.ajax({
                        url: ecEditor.getConfig('baseURL') + "/index.php?option=com_ekcontent&task=contentform.sendForReview",
                        type: 'POST',
                        data: {
                            identifier: window.context.content_id,
                        },
                        cache: false,
                        beforeSend: function() {
                            ctrl.message = "Sending for reviewer";
                        },
                        success: function(resp) {
                            if (resp.status === 'success') {
                                ctrl.success = true;
                                ctrl.success_msg = resp.msg;
                            } else {
                                ctrl.success_msg = resp.msg;
                                ctrl.success = false;
                            }
                        },
                        complete: function() {
                            ctrl.isLoading = false;
                            ctrl.active = '';
                            ctrl.responseMsg = true;
                            ecEditor.ngSafeApply($scope);
                            ctrl.editContentMeta(ctrl.success_msg, ctrl.responseMsg);
                        },
                        error: function() {
                            ctrl.success_msg = "Something went wrong! Try again later";
                            ctrl.success = false;
                        }
                    });
                });

            } else {
                /**If madatory fields are not fill then show error message**/
                ctrl.editContentMeta("Please fill out these fields: " + fieldsToFill.join(","));
            }
        }
    }]);
//# sourceURL="reviewapp.js"
