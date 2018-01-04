/**
 * Plugin to create question
 * @class org.ekstep.question:createquestionController
 * Jagadish Pujari<jagadish.pujari@tarento.com>
 */
angular.module('createQuestionApp', [])
    .controller('QuestionCreationFormController', ['$scope', '$sce', '$compile', 'instance', 'questionData', function($scope, $sce, $compile, instance, questionData) {
        var ctrl = this;
        ctrl.templatesScreen = true;
        ctrl.createQuestionScreen = false;
        ctrl.metadaFormScreen = false;
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
        $scope.selected = 0;
        $scope.questionID = 0;

        if (!ecEditor._.isEmpty(questionData)) {
            console.log("Edit mode", questionData);
            $scope.questionID = questionData.questionID;
            $scope.qcLanguage = questionData.config.metadata.language;
            $scope.qcInput = questionData.config.metadata.title;
            $scope.qcLevel = questionData.config.metadata.qlevel;
            $scope.qcGrade = questionData.config.metadata.gradeLevel;
            ctrl.Totalconcepts = questionData.config.metadata.concepts.length;
            ctrl.questionData = questionData;
            $scope.questionEditData = questionData;
            ctrl.templatesScreen = false;
            ctrl.createQuestionScreen = true;
            ctrl.metadaFormScreen = false;
            var editCreateQuestionFormInstance = org.ekstep.pluginframework.pluginManager.getPluginManifest(questionData.data.plugin.id);
            _.each(editCreateQuestionFormInstance.templates, function(value, key) {
                if (value.editor.template == questionData.data.plugin.templateId) {
                    var controllerPathEdit = ecEditor.resolvePluginResource(questionData.data.plugin.id, questionData.data.plugin.version, value.editor.controllerURL);
                    var templatePathEdit = ecEditor.resolvePluginResource(questionData.data.plugin.id, questionData.data.plugin.version, value.editor.templateURL);
                    $scope.questionUniTemplateURL = templatePathEdit;
                    ctrl.questionUniTemplateURL = templatePathEdit;
                    $scope.questionUnitController = value.editor.controller;
                    $scope.$safeApply();
                }
            });

            ctrl.selectedTemplatePluginData.plugin = { // Question Unit Plugin Information  
                "id": questionData.data.plugin.id, // Id of plugin
                "version": questionData.data.plugin.version, // Version of plugin
                "templateId": questionData.data.plugin.template // Template Id of the question unit
            };
        }

        /**
         * OnLoad of the controller
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

            var questionplugininstance = org.ekstep.pluginframework.pluginManager.getPluginManifest(instance.manifest.id);
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

            $scope.select = function(parentIndex, index) {
                $scope.selected = parentIndex + '.' + index;
            };


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
            if (ctrl.createQuestionScreen) {
                ctrl.templatesScreen = true;
                ctrl.createQuestionScreen = false;
                ctrl.metadaFormScreen = false;
            } else if (ctrl.metadaFormScreen) {
                ctrl.templatesScreen = false;
                ctrl.createQuestionScreen = true;
                ctrl.metadaFormScreen = false;
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
        }
        /**
         * [addCreateQuestionForm description]
         * @param {[type]} obj [description]
         */
        ctrl.addCreateQuestionForm = function(obj) {
            ctrl.templatesScreen = false;
            ctrl.createQuestionScreen = true;
            ctrl.metadaFormScreen = false;
            ctrl.selectedTemplatePluginData.plugin = { // Question Unit Plugin Information  
                "id": obj.pluginID, // Id of plugin
                "version": obj.ver, // Version of plugin
                "templateId": obj.editor.template // Template Id of the question unit
            };
            ctrl.unitPlugin = obj.pluginID;
            ctrl.pluginVer = obj.ver;
            ctrl.templateId = obj.editor.template;
            var controllerPath = ecEditor.resolvePluginResource(obj.pluginID, obj.ver, obj.editor.controllerURL);
            var templatePath = ecEditor.resolvePluginResource(obj.pluginID, obj.ver, obj.editor.templateURL);
            $scope.questionUniTemplateURL = templatePath;
            ctrl.questionUniTemplateURL = templatePath;
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
            ecEditor.dispatchEvent(ctrl.selectedTemplatePluginData.plugin.id + ':val', ctrl.validateQuestionCreationFormCallBackFunc, ctrl);

        }

        ctrl.validateQuestionCreationFormCallBackFunc = function(valid, formData) {
            if (valid) {
                ctrl.templatesScreen = false;
                ctrl.createQuestionScreen = false;
                ctrl.metadaFormScreen = true;
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
                metadata.title = $scope.qcInput;
                $scope.qcTitle = false;
            } else {
                $scope.qcTitle = true;
            }
            if ($scope.qcLanguage != undefined) {
                metadata.language = $scope.qcLanguage;
                $scope.qclangerr = false;
            } else {
                $scope.qclangerr = true;
            }
            if ($scope.qcLevel != undefined) {
                metadata.qlevel = $scope.qcLevel;
                $scope.qclevelerr = false;
            } else {
                $scope.qclevelerr = true;
            }
            if ($scope.qcGrade != undefined) {
                metadata.gradeLevel = $scope.qcGrade;
                $scope.qcgardeerr = false;
            } else {
                $scope.qcgardeerr = true;
            }
            if (ctrl.Totalconcepts > 0) {
                metadata.concepts = ctrl.selectedConceptsData;
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
                questionUnitFinalData.questionID = $scope.questionID.length > 0 ? $scope.questionID : "qid_" + Math.floor(Math.random() * 1000000000);
                // if ($scope.questionID.length > 0) {
                //     questionUnitFinalData.questionID = $scope.questionID;
                // } else {
                //     questionUnitFinalData.questionID = "qid_" + Math.floor(Math.random() * 1000000000);
                // }
                console.log(questionUnitFinalData.questionID);
                questionUnitFinalData.data = ctrl.selectedTemplatePluginData;
                questionUnitFinalData.data.type = "unit";
                questionUnitFinalData.data.data = ctrl.questionCreationFormData;
                questionUnitFinalData.config = ctrl.metaDataFormData;
                /*Dispatch event from here*/
                ecEditor.dispatchEvent('org.ekstep.qe.questionbank:saveQuestion', questionUnitFinalData);
                $scope.closeThisDialog();
            }
        }

        ctrl.init();

        ctrl.getUnitTemplate = function() {
            return ctrl.questionUniTemplateURL;
        }
    }])
    /**
     * Dynamically add templates
     * @param  {String} )         {                                          return {            scope: { template: " [description]
     * @param  {String} template: '<div         ng-include [description]
     * @return {[type]}           [description]
     */
    .directive('questionUnit', function() {
        return {
            restrict: 'E',
            scope: { qtemplate: "=", questionData: "=" },
            template: '<div ng-include="getTemplateURL()" ng-transclude"></div>',
            controller: ['$scope', function($scope) {
                $scope.getTemplateURL = function() {
                    return $scope.qtemplate;
                }
                $scope.loadData = function() {
                    //$scope.
                }
            }]
        };
    });
//# sourceURL=question.js