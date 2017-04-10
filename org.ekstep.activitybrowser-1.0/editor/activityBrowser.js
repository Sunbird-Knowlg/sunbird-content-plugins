'use strict';
angular.module('activityBrowserApp', [])
    .controller('activityBrowserCtrl', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {
        var ctrl = this,
            angScope = EkstepEditorAPI.getAngularScope();

        ctrl.errorLoadingActivities = false;
        ctrl.activitiesList = [];
        ctrl.noActivities = false;
        ctrl.loading = false;
        ctrl.defaultActivityImage = EkstepEditorAPI.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/default-activity.png");
        ctrl.activityOptions = {
            searchQuery: "",
            conceptsPlaceHolder: '(0) Concepts',
            concepts: {},
            categories: {}

        };
        ctrl.categories = {
            "core": "core",
            "learning": "learning",
            "literacy": "literacy",
            "math": "math",
            "science": "science",
            "time": "time",
            "wordnet": "wordnet",
            "game": "game",
            "mcq": "mcq",
            "mtf": "mtf",
            "ftb": "ftb"
        };


        ctrl.getActivities = function() {
            ctrl.loading = true;
            ctrl.errorLoadingActivities = false;
            ctrl.noActivities = false;
            ctrl.activitiesList = [];
            $scope.$safeApply();
            var data = {
                "request": {
                    "query": ctrl.activityOptions.searchQuery,
                    "filters": {
                        "objectType": ["Content"],
                        "contentType": ["plugin"],
                        "status": ["live"],
                        "concepts": ctrl.activityOptions.concepts,
                        "category": ctrl.activityOptions.categories
                    },
                    "sort_by": { "lastUpdatedOn": "desc" },
                    "limit": 200
                }
            };
            EkstepEditorAPI.getService('search').search(data, function(err, resp) {
                ctrl.loading = false;
                $scope.$safeApply();
                if (err) {
                    ctrl.errorLoadingActivities = true;
                    return;
                }
                if (resp.data.result.count <= 0) {
                    ctrl.noActivities = true;
                    return;
                }
                ctrl.activitiesList = resp.data.result.content;
                applyDimmerToCard();
            });
        };
        ctrl.addPlugin = function(activity) {
            var publishedDate = new Date((activity['lastPublishedOn'] || new Date().toString())).getTime();
            EkstepEditorAPI.loadAndInitPlugin(activity.code, activity.semanticVersion, publishedDate);
            $scope.closeThisDialog();
        }
        ctrl.getActivities();
        EkstepEditorAPI.dispatchEvent('org.ekstep.conceptselector:init', {
            element: 'activityConceptSelector',
            selectedConcepts: [], // All composite keys except mediaType
            callback: function(data) {
                ctrl.activityOptions.conceptsPlaceHolder = '(' + data.length + ') concepts selected';
                ctrl.activityOptions.concepts = _.map(data, function(concept) {
                    return concept.id;
                });
                $scope.$safeApply();
                ctrl.getActivities();
            }
        });

        function applyDimmerToCard() {
            setTimeout(function() {
                EkstepEditorAPI.jQuery("#activity-cards .image").dimmer({
                    on: 'hover'
                });
            }, 500);
        }
        setTimeout(function () {
            EkstepEditorAPI.jQuery('.ui.dropdown.lableCls').dropdown({ useLabels: false, forceSelection: false});    
        },1000);

        ctrl.generateTelemetry = function(data) {
            if(data){
                org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE).interact({ 
                    "type": data.type, "subtype": data.subtype, "target": data.target, 
                    "pluginid": instance.manifest.id, "pluginver": instance.manifest.ver, "objectid": "", 
                    "stage": EkstepEditorAPI.getCurrentStage().id 
                });
            }
        };
        

    }]);
