'use strict';

angular.module('org.ekstep.review', [])
    .controller('reviewcontroller', ['$scope', '$injector', 'instance', '$rootScope', function($scope, $injector, instance, $rootScope) {
        var ctrl = this;

        /**Set contentMeta object to display info in send for review popup**/
        ctrl.contentMeta = instance.contentObj;

        /**Show dialog messages**/
        ctrl.showReviewMsg = function(dialogMsg, responseMsg) {
            if (ctrl.success) {
                ecEditor.dispatchEvent('org.ekstep.review:showDialog', {
                    dialogMainText: 'Sent for reivew Successfully..!!',
                    dialogSubtext: dialogMsg,
                    isRedirect: false,
                    isError: false
                });
            } else {
                ecEditor.dispatchEvent('org.ekstep.review:showDialog', {
                    dialogMainText: dialogMsg,
                    dialogSubtext: '',
                    isRedirect: false,
                    isError: true
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

        /**Close send for reivew popup after success messages**/
        ctrl.editContentMeta = $rootScope.editContentMeta;

        /**save content**/
        ctrl.saveBeforeReview = function() {
            var contentBody = org.ekstep.contenteditor.stageManager.toECML();
            $rootScope.patchContent({ stageIcons: JSON.stringify(org.ekstep.contenteditor.stageManager.getStageIcons()) }, contentBody, function(err, res) {
                if (err) {
                    if (res && !ecEditor._.isUndefined(res.responseJSON)) {
                        // This could be converted to switch..case to handle different error codes
                        if (res.responseJSON.params.err == "ERR_STALE_VERSION_KEY")
							ecEditor.dispatchEvent('org.ekstep.review:showConflictDialog');
                    } else {
                        $rootScope.saveNotification('error');
                    }
                } else if (res && res.data.responseCode == "OK") {
                    ctrl.sendForReview();
                }
                $rootScope.saveBtnEnabled = true;
            });
        }

        /**save content**/
        ctrl.forceUpdate = function() {
			$rootScope.fetchPlatformContentVersionKey(function(platformContentVersionKey) {
                //Invoke saveBeforeReview function here...
				ctrl.saveBeforeReview();
            });
		}

        /**send for review content**/
        ctrl.sendForReview = function() {
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
                    ctrl.showReviewMsg(ctrl.success_msg, ctrl.responseMsg);
                },
                error: function() {
                    ctrl.success_msg = "Something went wrong! Try again later";
                    ctrl.success = false;
                }
            });
        }
    }]);
//# sourceURL="reviewapp.js"
