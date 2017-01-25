'use strict';
angular.module('activityBrowserApp', [])
    .controller('activityBrowserCtrl', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {
        var ctrl = this;

        ctrl.usePluginBtnDisable = true;
        ctrl.selectedActivity = {};
        ctrl.errorLoadingActivities = false;
        ctrl.activitiesList = [];
        ctrl.noActivities = false;
        ctrl.loading = false;
        ctrl.defaultActivityImage = EkstepEditorAPI.getPluginRepo() + "/org.ekstep.activitybrowser-1.0/assets/default-activity.png";
        ctrl.selectActivity = function($index, activity) {
            ctrl.selectedActivity = activity;
            ctrl.selectedActivityIndex = $index;
            ctrl.usePluginBtnDisable = false;
        }
        ctrl.getActivities = function() {
            ctrl.loading = true;
            ctrl.errorLoadingActivities = false;
            ctrl.noActivities = false;
            EkstepEditorAPI.getAngularScope().safeApply();
            var data = {
                "request": {
                    "filters": {
                        "objectType": ["Content"],
                        "contentType": ["plugin"],
                        "status": ["Live"]
                    }
                }
            };
            EkstepEditorAPI.getService('activityService').getActivities(data, function(err, resp) {
                ctrl.loading = false;
                EkstepEditorAPI.getAngularScope().safeApply();
                if (err) {
                    ctrl.errorLoadingActivities = true;
                    return
                }
                if (resp.data.result.count <= 0) {
                    ctrl.noActivities = true;
                    return;
                }
                ctrl.activitiesList = resp.data.result.content;

            })
        }
        ctrl.usePlugin = function() {
            EkstepEditorAPI.loadPlugin(ctrl.selectedActivity.code, ctrl.selectedActivity.semanticVersion);
            $scope.closeThisDialog();
        }
        ctrl.getActivities();
    }]);
