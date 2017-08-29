'use strict';

angular.module('org.ekstep.editcontentmeta', []).controller('editcontentmetaController', ['$scope', '$q', '$rootScope', '$http', 'instance', function ($scope, $q, $rootScope, $http, instance) {
    var ctrl = this;

    console.log(instance); //DEBUG!
    // Init controller data
    ctrl.review = instance.data.review;
    ctrl.gradeList = [];
    ctrl.languageList = [];
    ctrl.audienceList = [];
    ctrl.subjectList = [];
    ctrl.boardList = [];
    ctrl.originalContentMeta = ctrl.contentMeta = instance.contentMeta;

    // Create array of content concept Ids to use with the concept selector
    ctrl.conceptIds = [];
    if (!_.isUndefined(ctrl.contentMeta.concepts)) {
        if (ctrl.contentMeta.concepts.length > 0) {
            _.forEach(ctrl.contentMeta.concepts, function (concept) {
                ctrl.conceptIds.push(concept.identifier);
            });
        }
    } else {
        ctrl.contentMeta.concepts = [];
    }

    // Init concept selector
    ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
        element: 'metaConceptSelector',
        selectedConcepts: ctrl.conceptIds,
        callback: function (data) {
            ctrl.contentMeta.concepts = _.map(data, function (concept) {
                return {"identifier": concept.id, "name": concept.name};
            });
            ctrl.conceptIds = [];
            _.forEach(ctrl.contentMeta.concepts, function (concept) {
                ctrl.conceptIds.push(concept.identifier);
            });
            $scope.$safeApply();
            console.log(ctrl.contentMeta, ctrl.conceptIds); //DEBUG!
        }
    });

    // Init basic form data
    ecEditor.getService('meta').getConfigOrdinals(function (err, res) {
        if (!err) {
            ctrl.gradeList = res.data.result.ordinals.gradeLevel;
            ctrl.languageList = res.data.result.ordinals.language;
            ctrl.audienceList = res.data.result.ordinals.audience;
            ctrl.subjectList = res.data.result.ordinals.language;
            //TODO: Replace below list with API response, once available
            ctrl.boardList = ["CBSE", "NCERT", "ICSE", "MSCERT", "Other"];
            console.log(ctrl); //DEBUG!
            $scope.$safeApply();
        }
    });

    //Init semantic ui dropdowns
    $scope.initDropdown = function() {
        $timeout(function() {
            $('#board').dropdown('set selected', ctrl.contentMeta.board);
            $('#medium').dropdown('set selected', ctrl.contentMeta.medium);
            $('#subject').dropdown('set selected', ctrl.contentMeta.subject);
            $('#gradeLevel').dropdown('set selected', ctrl.contentMeta.gradeLevel);
            $('#audience').dropdown('set selected', ctrl.contentMeta.audience);
            $('#language').dropdown('set selected', ctrl.contentMeta.language);
        });
    }

    ctrl.close = function () {
        $scope.closeThisDialog();
    };
}]);