angular.module('editorApp')
    .controller('org.ekstep.text:config-controller', ['$scope', function($scope) {
        $scope.openTransliterator = function() {
            ecEditor.dispatchEvent("org.ekstep.text:showpopup");
        };

        $scope.config = $scope.config;

        $scope.fontFamily = ["Arial", "Courier", "Georgia", "Helvetica", "Monospace", "Sans-serif", "Serif", "Tahoma", "Times", "Trebuchet MS", "Verdana", "NotoSans", "NotoSansKannada", "NotoSansGujarati", "NotoSansBengali", "NotoSansGurmukhi", "NotoSansOriya", "NotoSansDevanagari", "NotoSansTamil", "NotoSansTelugu", "NotoNastaliqUrdu", "NotoSansMalayalam"];
        $scope.fontSize = [18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96];
        $scope.fontGroupConfig = {
            "propertyName": "font",
            "dataType": "group",
            "description": "Choose fontweight and fontstyle",
            "config": [{
                "propertyName": "fontweight",
                "title": "Font Weight",
                "toolTip": "Bold",
                "description": "Select font size for the text",
                "dataType": "icon",
                "iconClass": "bold icon",
                "required": true,
                "defaultValue": false
            }, {
                "propertyName": "fontstyle",
                "title": "Font Style",
                "toolTip": "Italic",
                "description": "Select font style for the text",
                "dataType": "icon",
                "iconClass": "italic icon",
                "required": true,
                "defaultValue": false
            }]
        };

        $scope.textAlignmentConfig = {
            "propertyName": "align",
            "title": "Align Text",
            "dataType": "buttonToggle",
            "description": "Select text alignment",
            "options": [{
                "value": "left",
                "title": "Text Align Left",
                "toolTip": "Left Align",
                "description": "Align text to left",
                "dataType": "icon",
                "iconClass": "align left icon"
            }, {
                "value": "center",
                "title": "Text Align Center",
                "toolTip": "Center Align",
                "description": "Align text to center",
                "dataType": "icon",
                "iconClass": "align center icon"
            }, {
                "value": "right",
                "title": "Text Align Right",
                "toolTip": "Right Align",
                "description": "Align text to right",
                "dataType": "icon",
                "iconClass": "align right icon"
            }],
            "defaultValue": "left"
        }

        $scope.showColorpicker = function() {
            var eventData = {
                id: 'color',
                callback: function(key, value) {
                    org.ekstep.contenteditor.api.dispatchEvent('config:on:change', { key: key, value: value });
                },
                color: $scope.configData['color']
            };
            setTimeout(function() { org.ekstep.contenteditor.api.dispatchEvent("colorpicker:state", eventData) }, 500);
        };

        $scope.showColorpicker();

        $scope.textOpacityConfig = {
            "propertyName": "opacity",
            "title": "Transparency",
            "description": "Set the transparency for element",
            "dataType": "rangeslider",
            "labelSuffix": "%",
            "required": true,
            "defaultValue": 100,
            "minimumValue": 0,
            "maximumValue": 100
        };

        $scope.readAlongConfig = {
            "propertyName": "textType",
            "title": "Enable Interactive features",
            "dataType": "featureButtonToggle",
            "description": "Text Enhancement",
            "options": [{
                "value": "readalong",
                "title": "Read-along",
                // "toolTip": "Click to read-along",
                "description": "Readalong",
                "dataType": "icon",
                "iconClass": "icon icon-readalong",
                "state": true,
                "status": "HIDE",
                "onclick": {
                    "id": "org.ekstep.text:readalong:show"
                },
                "suboptions": [{
                    "toolTip": "Delete",
                    "dataType": "icon",
                    "iconClass": "trash icon",
                    "onclick": {
                        "id": "org.ekstep.text:delete:enhancement"
                    }
                }]
            }],
            "defaultValue": "text"
        };

        $scope.wordInfoConfig = {
            "propertyName": "textType",
            "title": "Enable Interactive features",
            "dataType": "featureButtonToggle",
            "description": "Text Enhancement",
            "options": [{
                "value": "wordinfo",
                "title": "Word Info",
                // "toolTip": "Click for word-info",
                "description": "Wordinfo",
                "state": true,
                "dataType": "icon",
                "iconClass": "icon icon-wordinfo",
                "status": "HIDE",
                "onclick": {
                    "id": "org.ekstep.text:wordinfo:show"
                },
                "suboptions": [{
                    "toolTip": "Delete",
                    "dataType": "icon",
                    "iconClass": "trash icon",
                    "onclick": {
                        "id": "org.ekstep.text:delete:enhancement"
                    }
                }]
            }]
        }
        ecEditor.jQuery('.ui.accordion').accordion({
            "collapsible": true,
            "duration": "500"
        });

        setTimeout(function() {
            ecEditor.jQuery('.font-face-dropdown').dropdown();
            ecEditor.jQuery('.font-size-dropdown').dropdown();
        }, 0);

    }]);