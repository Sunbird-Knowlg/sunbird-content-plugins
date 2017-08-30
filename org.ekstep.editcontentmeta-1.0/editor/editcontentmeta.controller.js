'use strict';

angular.module('org.ekstep.editcontentmeta', []).controller('editcontentmetaController', ['$scope', '$q', '$rootScope', '$http', '$timeout', 'data', function ($scope, $q, $rootScope, $http, $timeout, data) {
    var ctrl = this;

    data = data || {};

    // Init controller data
    ctrl.plugin = {id: "org.ekstep.editcontentmeta", ver: "1.0"};
    ctrl.review = _.isUndefined(data.review) ? false : data.review;
    ctrl.submitted = false;
    ctrl.defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeBAMAAAA/BWopAAAAG1BMVEXMzMwAAABmZmZMTEx/f3+ZmZmysrIZGRkzMzNdPZZ6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAD00lEQVR4nO3cS1LbQBSFYQoMYdp5D8UOoh2YHUQ7gBHjTDJWdh4Cbl/ZrUd3u0rnKvV/KzhFUf65soqrKwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA40agHlLn5pF5Qpg0/1BNKXIfwUb2hxGMIYa8ekW/3Ojd8Ua/I1/3bG36qZ+S6e5sbfqt35Hp53/vtST0kz92vsKkf8P1hbviuXpLnT9wbevWUHDfHuWETUX6wvaFRj1m2G8wNn9Vrlj0O9/qP8u3JXP9Rfj7dG57Ug+YdWxE5b8bL2VzvUf5zvtd3M+6Tub6j3KZ7PR9y1yNzPR9yj2N7/TZjNzrXb5S78b1eD7m7ibnhq3rZuKQVkc9mJCk2LqM80orIZTPSFJtePS51MzPX4yH3MLfX3yE30YrIXTPGU2z26oGnbhfmejvkuqW9vqI804rIVTMmU2xcRXmuFVGvHmlmUmwcRbnN2evnkBs921JuDrn5FJtGPfTdQoqNkyh3uXt9NGMxxcZFlDNaEXloRkaKjYMoZ7UictCMnBSbXj139mxLyQ+53FZEjXZuZoqNOMpLZ1tqr5xb0IpI2oyufK8yykWtiITNKEixEUa5rBVRr5pblGIji3Jbt1d1yBWm2IiaUZpi0yjmZp9tKckh19XvVTSjIsVGEOWqVkTrN6MqxWb1KH+4aO76zahLsenXnVvdimjlQ+7CX9/1f4G7C/eu/Ql80cev4gO4/NIc2q++t/iSH1L8hdZesFfxF/AFH2map1L1yegle6uTLDrgqpuhegJR+Sel7AFEZTN0T9C6qr26B2hVJ6fyW8Oak74R7q1ohvYBe1u8V/tWQfEjP/U3cKVR7sV7C5sh/wa5MMr6L5C7or36NyCKouzhBYiSQ26vHntVdMj5eEMqP8qNeuqb7CjLXyY4yG1Grx56kBlldYqPMpuhb0WUFWV5ik1WMzy0Iuoy9upTbDIOOScvex4sN2OvnnhiMco+Umzahb1uXgY/WGiGm1YczUe5V89LzDbDUSui2Sj7SbHpZvY+qceNmImypxSb6UNur542ajLKvlJspqLcqIdNmDjkvJxtqfFm9OpZk0aj7C/FR6PN8NiKaCTKDlNsRv5lhdN/VnHQJXs9nW2ppBleWxGdR3mvHrTg7JDzdral2pO93s621EkzHLfiaBjlXj0mw6AZrlsRDaLsOcXmeVM/3sEh5/NsS8Vm+E6x2W0jxeb9kGvUM7K9HXJ+z7ZUu4kUm/ttpPjotRnbaEX0spFWRHfb+vECAAAAAAAAAAAAAAAAAAAAAAAAAAAAAID/yl+hBHJNz9INiwAAAABJRU5ErkJggg==';
    ctrl.gradeList = [];
    ctrl.languageList = [];
    ctrl.audienceList = [];
    ctrl.subjectList = [];
    ctrl.boardList = [];
    ctrl.contentId = org.ekstep.contenteditor.api.getContext('contentId');
    ctrl.contentMeta = ecEditor.getService('content').getContentMeta(ctrl.contentId);
    ctrl.originalContentMeta = _.clone(ctrl.contentMeta);
    ctrl.language = (_.isArray(ctrl.contentMeta.language) && ctrl.contentMeta.language.length > 0) ? ctrl.contentMeta.language[0] : '';
    ctrl.audience = (_.isArray(ctrl.contentMeta.audience) && ctrl.contentMeta.audience.length > 0) ? ctrl.contentMeta.audience[0] : '';
    ctrl.contentService = org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE);
    ctrl.popupService = org.ekstep.contenteditor.api.getService(ServiceConstants.POPUP_SERVICE);

    // If appIcon is empty, set it to null
    if (ctrl.contentMeta.appIcon && ctrl.contentMeta.appIcon.length <= 0) {
        ctrl.contentMeta.appIcon = null;
    }

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
            $scope.$safeApply();
        }
    });

    ctrl.launchImageBrowser = function () {
        ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
            type: 'image',
            search_filter: {}, // All composite keys except mediaType
            callback: function (data) {
                ctrl.contentMeta.appIcon = data.assetMedia.src;
            }
        });
    };

    ctrl.getUpdatedMetadata = function (originalMetadata, currentMetadata) {
        var metadata = {};
        if (_.isEmpty(originalMetadata)) {
            _.forEach(currentMetadata, function (value, key) {
                metadata[key] = value;
            });
        } else {
            _.forEach(currentMetadata, function (value, key) {
                if (_.isUndefined(originalMetadata[key])) {
                    metadata[key] = value;
                } else if (value != originalMetadata[key]) {
                    metadata[key] = value;
                }
            });
        }
        if (_.isUndefined(metadata['name'])) {
            metadata['name'] = originalMetadata['name'];
        }
        return metadata;
    };

    ctrl.validateMeta = function (meta) {
        var error = false;

        // Validate Name
        if (!(_.isString(meta.name) && meta.name.trim().length > 0)) {
            jQuery('#name').parent().parent().addClass('error');
            error = true;
        }

        // Following validations are mandatory for Review only
        if (ctrl.review) {
            // Validate App Icon
            if (!(_.isString(meta.appIcon) && meta.appIcon.length > 0)) {
                jQuery('#appIcon').addClass('required-error');
                jQuery('#appIcon').parent().addClass('error');
                error = true;
            }

            // Validate Description
            if (!(_.isString(meta.description) && meta.description.trim().length > 0)) {
                jQuery('#description').parent().parent().addClass('error');
                error = true;
            }

            // Validate Board
            if (!(_.isString(meta.board) && meta.board.trim().length > 0)) {
                jQuery('#board').parent().parent().addClass('error');
                error = true;
            }

            // Validate Subject
            if (!(_.isString(meta.subject) && meta.subject.trim().length > 0)) {
                jQuery('#subject').parent().parent().addClass('error');
                error = true;
            }

            // Validate Grade Level
            meta.gradeLevel = ctrl.removeEmptyItems(meta.gradeLevel);
            if (!(_.isArray(meta.gradeLevel) && meta.gradeLevel.length > 0)) {
                jQuery('#gradeLevel').parent().parent().addClass('error');
                error = true;
            }

            // Validate Medium/Language
            meta.language = ctrl.removeEmptyItems(meta.language);
            if (!(_.isArray(meta.language) && meta.language.length > 0)) {
                jQuery('#language').parent().parent().addClass('error');
                error = true;
            }

            // Validate Audience
            meta.audience = ctrl.removeEmptyItems(meta.audience);
            if (!(_.isArray(meta.audience) && meta.audience.length > 0)) {
                jQuery('#audience').parent().parent().addClass('error');
                error = true;
            }

            // Validate Attributions
            meta.attributions = ctrl.removeEmptyItems(meta.attributions);
            if (!(_.isArray(meta.attributions) && meta.attributions.length > 0)) {
                jQuery('#attributions').parent().parent().addClass('error');
                error = true;
            }

            // Validate Keywords
            meta.keywords = ctrl.removeEmptyItems(meta.keywords);
            if (!(_.isArray(meta.keywords) && meta.keywords.length > 0)) {
                jQuery('#keywords').parent().parent().addClass('error');
                error = true;
            }

            // Validate Concepts
            if (!(_.isArray(meta.concepts) && meta.concepts.length > 0)) {
                jQuery('#metaConceptSelector').parent().parent().addClass('error');
                error = true;
            }
        }

        return !error;
    };

    ctrl.removeEmptyItems = function (array) {
        var newArray = _.filter(array, function (item) {
            return (_.isString(item) && (item.length > 0));
        });
        return newArray;
    };

    ctrl.saveMeta = function (isValid) {
        ctrl.submitted = true;
        ctrl.contentMeta.keywords = jQuery('#keywords').val().replace(/\s*,\s*/g, ',').split(',');
        ctrl.contentMeta.attributions = jQuery('#attributions').val().replace(/\s*,\s*/g, ',').split(',');
        ctrl.contentMeta.language = [ctrl.language];
        ctrl.contentMeta.gradeLevel = $('#gradeLevel').val();
        var validated = ctrl.validateMeta(ctrl.contentMeta);
        // ctrl.contentMeta.board
        if (isValid && validated) {
            ecEditor.dispatchEvent('org.ekstep.contenteditor:save', {
                savingPopup: false,
                successPopup: !ctrl.review,
                failPopup: true,
                contentMeta: ctrl.getUpdatedMetadata(ctrl.originalContentMeta, ctrl.contentMeta),
                callback: function (err, res) {
                    ctrl.isLoading = false;
                    ctrl.active = '';
                    if (res && res.data && res.data.responseCode == "OK") {                        
                        if (ctrl.review) {
                            ctrl.sendForReview();                            
                        } else {
                            if (ctrl.contentMeta.name) ecEditor.dispatchEvent("content:title:update", ctrl.contentMeta.name);
                            ctrl.close();   
                        }
                    } else {
                        ctrl.notify('reviewError');
                    }
                }
            });
        }
    };

    ctrl.sendForReview = function () {
        ctrl.contentService.getContent(ctrl.contentId, function (err, content) {
            ctrl.close();
            ctrl.contentService.sendForReview({contentId: ctrl.contentId}, function (err, res) {
                if (err) {
                    ctrl.notify('reviewError');
                } else {
                    ctrl.notify('reviewSuccess');
                    if (ctrl.contentMeta.name) ecEditor.dispatchEvent("content:title:update", ctrl.contentMeta.name);
                    ctrl.close();  
                }
            });
        });
    };

    ctrl.notify = function (status) {
        var template = 'editor/templates/' + status + '.html';
        var config = {
            template: ecEditor.resolvePluginResource(ctrl.plugin.id, ctrl.plugin.ver, template),
            showClose: false,
            closeByEscape: false,
            closeByDocument: false
        }
        console.log('config', config);
        ctrl.popupService.open(config);
    };

    setTimeout(function () {
        ecEditor.jQuery('.ui.dropdown').dropdown();
        $('#board').dropdown('set selected', ctrl.contentMeta.board);
        $('#subject').dropdown('set selected', ctrl.contentMeta.subject);
        $('#gradeLevel').dropdown('set selected', ctrl.contentMeta.gradeLevel);
        $('#audience').dropdown('set selected', ctrl.audience);
        $('#language').dropdown('set selected', ctrl.language);
    }, 300);

    ctrl.close = function () {
        $scope.closeThisDialog();
    };

}]);

//# sourceURL=editcontentmeta.controller.js