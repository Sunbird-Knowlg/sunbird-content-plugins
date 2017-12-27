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

        ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
            element: 'conceptsTextBox',
            selectedConcepts: [], // All composite keys except mediaType
            callback: function(data) {
                ctrl.Totalconcepts = data.length;
                ctrl.selectedConceptsData = data;
                $scope.$safeApply();
            }
        });

        // ctrl.config = [{ 'menuName': 'Multiple Choice', 'icon': 'list icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }, { 'header': 'Header 2', 'content': 'Content 2' }, { 'header': 'Header 2', 'content': 'Content 2' }] },
        //     { 'menuName': 'Fill in the Blanks', 'icon': 'minus square outline icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }, { 'header': 'Header 2', 'content': 'Content 2' }, { 'header': 'Header 2', 'content': 'Content 2' }] },
        //     { 'menuName': 'Classify, Match & Order', 'icon': 'block layout icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }] },
        //     { 'menuName': 'Written & Spoken', 'icon': 'write icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }] },
        //     { 'menuName': 'Highlight', 'icon': 'crosshairs icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }] },
        //     { 'menuName': 'Math', 'icon': 'superscript icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }] },
        //     { 'menuName': 'Graphing', 'icon': 'line chart icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }] },
        //     { 'menuName': 'Charts', 'icon': 'bar chart icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }] },
        //     { 'menuName': 'Chemistry', 'icon': 'lab icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }] },
        //     { 'menuName': 'Other', 'icon': 'ellipsis horizontal icon', 'data': [{ 'header': 'Header 1', 'content': 'Content 1' }, { 'header': 'Header 2', 'content': 'Content 2' }] }
        // ];


        ctrl.menuItems = {};
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

        // console.log("All menu items", ctrl.menuItems);
        ctrl.selectedMenuItemData = ctrl.menuItems['mcq'].templatesData;
        ctrl.cancel = function() {
            $scope.closeThisDialog();
        }
        ctrl.back = function() {
            if (ctrl.second) {
                ctrl.first = true;
                ctrl.second = false;
                ctrl.third = false;
            } else if (ctrl.third) {
                ctrl.first = false;
                ctrl.second = true;
                ctrl.third = false;
            }

        }
        ctrl.onLoadDropDown = function() {
            setTimeout(function() {
                $('.no.label.example .ui.dropdown')
                    .dropdown({
                        useLabels: false
                    });
            }, 500);

        }


        ctrl.switchTab = function(id, res) {
            //console.log(res);
            ctrl.selectedMenuItemData = ctrl.menuItems[res.category].templatesData;
            $("#first_" + id).addClass('activeItem').siblings().removeClass('activeItem');
        }
        ctrl.addCreateQuestionForm = function(obj) {
            console.log("Check", obj);
            ctrl.first = false;
            ctrl.second = true;
            ctrl.third = false;
            var templatePath = ecEditor.resolvePluginResource(obj.pluginID, obj.ver, obj.editor.templateURL);
            var controllerPath = ecEditor.resolvePluginResource(obj.pluginID, obj.ver, obj.editor.controllerURL);
            ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);

            $scope.dynamicTemplatesData = {
                'templateURL': templatePath, //$sce.trustAsResourceUrl(templatePath),
                'templateController': obj.editor.controller //$sce.trustAsResourceUrl(controllerPath)
            };

        }
        // Preview
        ctrl.showPreview = true;
        ctrl.setPreviewData = function() {
            $scope.getdetails();
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

        $scope.cancel = function() {
            $scope.closeThisDialog();
        }



        ctrl.sendData = function() {
            var qt = false;
            var lang = false;
            var lev = false;
            var grad = false;
            var conc = false;
            if ($("#questionTitle").val().length > 0) {
                var questionTitle = $("#questionTitle").val();
                $(".qt_title").css('color', 'inherit');
                qt = true;
            } else {
                $(".qt_title").css('color', 'red');
                qt = false;

            }

            if ($('.lang').find(":selected").val().length > 0) {
                var language = $('.lang').find(":selected").val();
                $(".lang1").css('color', 'inherit');
                lang = true;
            } else {
                $(".lang1").css('color', 'red');
                lang = false;

            }
            if ($('.level').find(":selected").val().length > 0) {
                var level = $('.level').find(":selected").val();
                $(".level1").css('color', 'inherit');
                lev = true;
            } else {
                $(".level1").css('color', 'red');
                lev = false;

            }

            if ($('.grade').find(":selected").val() != undefined) {
                var grade = $('.grade').find(":selected").val();
                $(".grade1").css('color', 'inherit');
                grad = true;
            } else {
                $(".grade1").css('color', 'red');
                grad = false;

            }

            if (ctrl.Totalconcepts > 0) {
                var concepts = ctrl.selectedConceptsData;
                $(".con").css('color', 'inherit');
                conc = true;
            } else {
                $(".con").css('color', 'red');
                conc = false;
            }

            if (qt && lang && lev && grad && conc) {
                console.log("All data", questionTitle, language, level, grade, concepts);
            }
        }
    }])

    .directive('angularData', function() {
        return {
            //template: false,
            restrict: 'A',
            //scope: true,
            link: function postLink(scope, element, attrs) {
                var tempURL;
                scope.$watch(attrs.angularData, function(value) {
                    // console.log("Value---->", value);
                    if (value != undefined) {
                        tempURL = value.templateURL;
                    }
                });
                // }
                scope.getContentUrl = function() {
                    //console.log("return URL",tempURL);
                    return tempURL;
                }
            },
            controller: 'QuestionFormController',
            template: '<div ng-include="getContentUrl()"></div>',
        }
    });
//# sourceURL=question.js