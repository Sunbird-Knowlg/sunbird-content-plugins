/**
 * Plugin to create question
 * @class org.ekstep.question:createquestionController
 * Jagadish P<jagadish.pujari@tarento.com>
 */
'use strict';
angular.module('createquestionapp1', [])
    .controller('QuestionFormController1', ['$scope', '$sce', '$compile', function($scope, $sce, $compile) {
        var ctrl = this;
        ctrl.first = true;
        ctrl.second = false;
        ctrl.third = false;
        ctrl.selectedMenuItem = 'data';
        ctrl.Totalconcepts = 0;
        ctrl.qt = 0;
        $scope.questionUniTemplateURL = '';
        $scope.questionUnitController = undefined;
        $scope.viewController = '';
        ctrl.menuItems = {};
        ctrl.showPreview = true;
        ctrl.defaultActiveMenu = 'mcq';
        ctrl.metaDataFormData = {};
        ctrl.selectedTemplatePluginData = {};
        ctrl.questionCreationFormData = {};
        $scope.qcInput = undefined;
        ctrl.questionUnitValidated = false
        ctrl.defaultLang = 'Choose language';
        ctrl.level = ['Easy', 'Medium', 'difficult'];
        /**
         * [init description]
         * @return {[type]} [description]
         */
        ctrl.init = function() {
            /**
             * Invoke conceptselector plugin to get concepts
             * @param  {[type]}   data) {                           ctrl.Totalconcepts [description]
             * @return {Function}       [description]
             */
            ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
                element: 'conceptsTextBox',
                selectedConcepts: [], // All composite keys except mediaType
                callback: function(data) {
                    ctrl.Totalconcepts = data.length;
                    ctrl.selectedConceptsData = data;
                    $scope.$safeApply();
                }
            });

            ecEditor.getService('meta').getConfigOrdinals(function(err, res) {
                if (!err) {
                    ctrl.grades = res.data.result.ordinals.gradeLevel;
                    ctrl.languages = res.data.result.ordinals.language;
                    $scope.$safeApply();
                }
            });

            /**
             * Create menu
             */
            ctrl.menuItems['mcq'] = {
                'category': 'mcq',
                'data': { 'name': 'Multiple Choice', 'icon': 'list icon' },
                'templatesData': []
            };
            ctrl.menuItems['ftb'] = {
                'category': 'ftb',
                'data': { 'name': 'Fill in the Blanks', 'icon': 'minus square outline icon' },
                'templatesData': []
            };
            ctrl.menuItems['mtf'] = {
                'category': 'mtf',
                'data': { 'name': 'Match the following', 'icon': 'block layout icon' },
                'templatesData': []
            };
            ctrl.menuItems['other'] = {
                'category': 'other',
                'data': { 'name': 'Other', 'icon': 'ellipsis horizontal icon' },
                'templatesData': []
            };
            var questionplugininstance = org.ekstep.pluginframework.pluginManager.getPluginManifest('org.ekstep.question');
            _.each(questionplugininstance.editor.dependencies, function(val, key) {
                if (val.type == 'plugin') {
                    var instance = org.ekstep.pluginframework.pluginManager.getPluginManifest(val.plugin);
                    var pluginID = val.plugin;
                    var ver = val.ver;
                    if (instance.templates != undefined)
                        _.each(instance.templates, function(v, k) {
                            v.pluginID = pluginID;
                            v.ver = ver;
                            if (ctrl.menuItems.hasOwnProperty(v.category)) {
                                ctrl.menuItems[v.category].templatesData.push(v);
                            } else {
                                ctrl.menuItems['other'].templatesData = v;
                            }
                        });
                }
            });

            /**
             * By default always mcq is selected
             * @type {[type]}
             */
            ctrl.selectedMenuItemData = ctrl.menuItems[ctrl.defaultActiveMenu].templatesData;
            /**
             * [onLoadDropDown description]
             * @return {[type]} [description]
             */
            ctrl.onLoadDropDown = function() {
                setTimeout(function() {
                    $('.no.label.example .ui.dropdown')
                        .dropdown({
                            useLabels: false
                        });
                }, 500);

            }

        }

        /**
         * [cancel description]
         * @return {[type]} [Close the modal window]
         */
        ctrl.cancel = function() {
            $scope.closeThisDialog();
        }
        /**
         * [back description]
         * @return {[type]} [description]
         */
        ctrl.back = function() {
            if (ctrl.second) {
                ctrl.first = true;
                ctrl.second = false;
                ctrl.third = false;
                $("#breadcumb_1").addClass('activeBreadcumb').siblings().removeClass('activeBreadcumb');
            } else if (ctrl.third) {
                ctrl.first = false;
                ctrl.second = true;
                ctrl.third = false;
                $("#breadcumb_2").addClass('activeBreadcumb').siblings().removeClass('activeBreadcumb');
            }

        }
        /**
         * [switchTab description]
         * @param  {[type]} id  [description]
         * @param  {[type]} res [description]
         * @return {[type]}     [description]
         */
        ctrl.switchTab = function(id, res) {
            ctrl.selectedMenuItemData = ctrl.menuItems[res.category].templatesData;
            ecEditor.jQuery("#first_" + id).addClass('activeItem').siblings().removeClass('activeItem');
            //ecEditor.jQuery
        }
        /**
         * [addCreateQuestionForm description]
         * @param {[type]} obj [description]
         */
        ctrl.addCreateQuestionForm = function(obj) {
            ctrl.first = false;
            ctrl.second = true;
            ctrl.third = false;
            ecEditor.jQuery("#breadcumb_2").addClass('activeBreadcumb').siblings().removeClass('activeBreadcumb');
            ctrl.selectedTemplatePluginData.plugin = { // Question Unit Plugin Information  
                "id": obj.pluginID, // Id of plugin
                "version": obj.ver, // Version of plugin
                "templateId": obj.editor.template // Template Id of the question unit
            };
            var controllerPath = ecEditor.resolvePluginResource(obj.pluginID, obj.ver, obj.editor.controllerURL);
            var templatePath = ecEditor.resolvePluginResource(obj.pluginID, obj.ver, obj.editor.templateURL);
            $scope.questionUniTemplateURL = templatePath;
            $scope.questionUnitController = obj.editor.controller;
        }


        /**
         * [setPreviewData Get data form form and show in preivew]
         */
        ctrl.setPreviewData = function() {
            this.previewURL = (ecEditor.getConfig('previewURL') || 'content/preview/preview.html') + '?webview=true';
            var instance = this;
            var contentService = ecEditor.getService('content');
            var defaultPreviewConfig = { showEndpage: true };
            var previewContentIframe = ecEditor.jQuery('#previewContentIframe')[0];
            previewContentIframe.src = instance.previewURL;
            var userData = ecEditor.getService('telemetry').context;
            previewContentIframe.onload = function() {
                var configuration = {};
                userData.etags = userData.etags || {};
                configuration.context = {
                    'mode': 'edit',
                    'sid': userData.sid,
                    'uid': userData.uid,
                    'channel': userData.channel,
                    'pdata': userData.pdata,
                    'app': userData.etags.app,
                    'dims': userData.etags.dims,
                    'partner': userData.etags.partner,
                    'contentId': ecEditor.getContext('contentId'),
                };
                if (ecEditor.getConfig('previewConfig')) {
                    configuration.config = ecEditor.getConfig('previewConfig');
                } else {
                    configuration.config = defaultPreviewConfig;
                }
                configuration.metadata = ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta(ecEditor.getContext('contentId'));
                configuration.data = org.ekstep.contenteditor.stageManager.toECML();
                previewContentIframe.contentWindow.initializePreview(configuration);

            };
        }

        /**
         * Close the modal window
         * @return {[type]} [description]
         */
        $scope.cancel = function() {
            $scope.closeThisDialog();
        }

        /**
         * Dynamically created form validation
         * @return {[boolean]} based on form validation it will return true/false
         */
        ctrl.validateQuestionCreationForm = function() {
            console.log(ctrl.selectedTemplatePluginData);
            ecEditor.dispatchEvent(ctrl.selectedTemplatePluginData.plugin.id + ':val', ctrl.validateQuestionCreationFormCallBackFunc, ctrl);

        }

        ctrl.validateQuestionCreationFormCallBackFunc = function(valid, formData) {
            if (valid) {
                ctrl.first = false;
                ctrl.second = false;
                ctrl.third = true;
                ecEditor.jQuery("#breadcumb_3").addClass('activeBreadcumb').siblings().removeClass('activeBreadcumb');
                ctrl.questionCreationFormData = formData;
            } else {}
        }
        /**
         * Collect data from 3 screens
         * @return {[type]} [description]
         */
        ctrl.sendData = function() {
            var metadata = {};
            //Third screen data
            if ($scope.qcInput != undefined) {
                metadata.qcName = $scope.qcInput;
                $scope.qcTitle = false;
            } else {
                $scope.qcTitle = true;
            }
            if ($scope.qcLanguage != undefined) {
                metadata.qcLanguage = $scope.qcLanguage;
                $scope.qclangerr = false;
            } else {
                $scope.qclangerr = true;
            }
            if ($scope.qcLevel != undefined) {
                metadata.qcLevel = $scope.qcLevel;
                $scope.qclevelerr = false;
            } else {
                $scope.qclevelerr = true;
            }
            if ($scope.qcGrade != undefined) {
                metadata.qcLevel = $scope.qcGrade;
                $scope.qcgardeerr = false;
            } else {
                $scope.qcgardeerr = true;
            }
            if (ctrl.Totalconcepts > 0) {
                metadata.qcConcept = ctrl.selectedConceptsData;
                $scope.qcconcepterr = false;
            } else {
                $scope.qcconcepterr = true;
            }

            if (!$scope.qcTitle && !$scope.qclangerr && !$scope.qclevelerr && !$scope.qcgardeerr && !$scope.qcconcepterr) {
                ctrl.metaDataFormData.metadata = metadata;
                ctrl.metaDataFormData.max_time = 1;
                ctrl.metaDataFormData.max_score = 1;
                ctrl.metaDataFormData.partial_scoring = true;
                var questionUnitFinalData = {};
                questionUnitFinalData.media = [{
                    "id": "",
                    "src": "",
                    "assetId": "",
                    "type": "",
                    "preload": true
                }];
                questionUnitFinalData.questionID = "qid_" + Math.floor(Math.random() * 1000000000);
                questionUnitFinalData.data = ctrl.selectedTemplatePluginData;
                questionUnitFinalData.data.type = "unit";
                questionUnitFinalData.data.data = ctrl.questionCreationFormData;
                questionUnitFinalData.config = ctrl.metaDataFormData;
                console.log("Final object", questionUnitFinalData);
                /*Dispatch event from here*/
               //ecEditor.dispatchEvent(ctrl.selectedTemplatePluginData.plugin.id + ':val', ctrl.validateQuestionCreationFormCallBackFunc, ctrl);
            }
        }

        ctrl.init();
    }])
    /**
     * Dynamically add templates
     * @param  {String} )         {                                          return {            scope: { template: " [description]
     * @param  {String} template: '<div         ng-include [description]
     * @return {[type]}           [description]
     */
    .directive('questionUnit', function() {
        return {
            scope: { template: "=" },
            template: '<div ng-include="template"></div>'
        };
    });
//# sourceURL=question.js