'use strict';

angular.module('richtexteditorapp', [])
    .controller('richtexteditorcontroller', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {
        var ctrl = this;
        ctrl.text = '';
        $scope.$on('ngDialog.opened', function (e, $dialog) {
            var richTextElement = document.getElementsByClassName('richtextEditor_1');
            richTextElement = richTextElement[0];
            richTextElement.addEventListener('click', function(event) {
                var data = ctrl.mapElementWithName(event.srcElement);
                if (data) {
                    ctrl.generateTelemetry({'type': 'click', 'subtype': data.subtype, 'target': data.target});
                }
            });
            ctrl.selectedText = false;
            CKEDITOR.basePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/libs/");
            CKEDITOR.replace( 'editor1', {
                customConfig: CKEDITOR.basePath + "config.js",
                skin: 'moono-lisa,'+CKEDITOR.basePath + "skins/moono-lisa/",
                contentsCss: CKEDITOR.basePath + "contents.css",
            });
            var textObj = ecEditor.getCurrentObject();
            if(e.currentScope.ngDialogData && e.currentScope.ngDialogData.textSelected && textObj) {
                ctrl.selectedText = true;
                CKEDITOR.instances.editor1.setData(textObj.config.text);
            }
        });
        ctrl.generateTelemetry = function(data) {
            if (data) {
                org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE).interact({
                        "type": data.type,
                        "subtype": data.subtype,
                        "target": data.target,
                        "pluginid": instance.manifest.id,
                        "pluginver": instance.manifest.ver,
                        "objectid": ctrl.selectedText ? org.ekstep.contenteditor.api.getCurrentObject().id : "",
                        "stage": ecEditor.getCurrentStage().id
                });
            }
        };
        ctrl.addText = function() {
            var textObj = ecEditor.getCurrentObject();
            if(textObj && ctrl.selectedText){
                textObj.config.text = CKEDITOR.instances.editor1.getData();
                textObj.attributes.__text = textObj.config.text;
                ecEditor.jQuery("#richtext-wrapper div#"+textObj.id).html(textObj.config.text);
                var currentObject = org.ekstep.contenteditor.api.getCurrentObject();
                 currentObject.editorObj.width = $('#' + textObj.id).width();
                 currentObject.editorObj.height = $('#' + textObj.id).height();
                ecEditor.render();
            }else{
                ecEditor.dispatchEvent('org.ekstep.richtext:create', {
                    "__text":  CKEDITOR.instances.editor1.getData(),
                    "type": "rect",
                    "x": 10,
                    "y": 20,
                    "fill": "rgba(0, 0, 0, 0)",
                    "stroke": "rgba(255, 255, 255, 0)",
                    "strokeWidth": 1,
                    "opacity": 1
                });
            }
            $scope.closeThisDialog();
        };
        ctrl.mapElementWithName = function(element) {
            var data = {};
            var subType = {select: 'select', dropdown: 'dropdown'};
            var elementTitle = element.title || element.parentElement.title || element.outerText || element.parentElement.text;
            switch (elementTitle) {
                case 'Bold (Ctrl+B)':
                    data.target = 'Bold';
                    data.subtype = subType.select;
                    break;
                case 'Italic (Ctrl+I)':
                    data.target = 'Italic';
                    data.subtype = subType.select;
                    break;
                case 'Strikethrough':
                    data.target = elementTitle;
                    data.subtype = subType.select;
                    break;
                case 'Remove Format':
                    data.target = 'RemoveFromat';
                    data.subtype = subType.select;
                    break;
                case 'Insert/Remove Numbered List':
                    data.target = 'NumberedList';
                    data.subtype = subType.select;
                    break;
                case 'Insert/Remove Bulleted List':
                    data.target = 'BulletList';
                    data.subtype = subType.select;
                    break;
                case 'Align Left':
                    data.target = 'AlignLeft';
                    data.subtype = subType.select;
                    break;
                case 'Center':
                    data.target = 'AlignCenter';
                    data.subtype = subType.select;
                    break;
                case 'Align Right':
                    data.target = 'AlignRight';
                    data.subtype = subType.select;
                    break;
                case 'Justify':
                    data.target = 'Justify';
                    data.subtype = subType.select;
                    break;
                case 'Paragraph Format':
                    data.target = 'ParagraphFromat';
                    data.subtype = subType.dropdown;
                    break;
                case 'Font Name':
                    data.target = 'FontName';
                    data.subtype = subType.dropdown;
                    break;
                case 'Font Size':
                    data.target = 'FontSize';
                    data.subtype = subType.dropdown;
                    break;
                case 'Text Color':
                    data.target = 'TextColor';
                    data.subtype = subType.select;
                    break;
                case 'Background Color':
                    data.target = 'BackgroundColor';
                    data.subtype = subType.select;
                    break;
                case 'Cancel':
                    data.target = 'Cancel';
                    data.subtype = subType.select;
                    break;
                case 'Add To Lesson':
                    data.target = 'AddToLesson';
                    data.subtype = subType.select;
                    break;
            }
            return data;
        }

    }]);
