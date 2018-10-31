angular.module('editorApp')
    .controller('org.ekstep.richtext:config-richcontroller', ['$scope', function($scope) {
        
        // $scope.openTransliterator = function() {
        //     ecEditor.dispatchEvent("org.ekstep.text:showpopup");
        // };

        $scope.config = $scope.config;
        $scope.textTypeSelected;
        $scope.refreshTab = true;
        $scope.activeTextPluginControlItem = "";
        $scope.wordInfoColorpicker = [{
            id: "wordfontcolorpicker",
            title: "Word Color"
        }, {
            id: "wordhighlightcolorpicker",
            title: "Word Highlight Color"
        }, {
            id: "wordunderlinecolorpicker",
            title: "Word Underline Color"
        }];

        $scope.readAlongColorpicker = [{
            id: "highlightcolorpicker",
            title: "Highlight Color"
        }];

        $scope.showColorpicker = function(id, color) {
            var eventData = {
                id: id,
                callback: function(key, value) {
                    org.ekstep.contenteditor.api.dispatchEvent('config:on:change', { key: key, value: value });
                },
                color: color
            };
            setTimeout(function() { org.ekstep.contenteditor.api.dispatchEvent("colorpicker:state", eventData) }, 500);
        };

        $scope.showColorpicker('textcolor', $scope.configData['color']);


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


        ecEditor.jQuery("#WordInfo").click(function(event){
            if (!$(this).hasClass('disabled') && !$(this).hasClass('word-info-enabled')) {
                $scope.fireEvent({id:'org.ekstep.richtext:wordinfo:show'});
                event.stopImmediatePropagation();
            }
        });

        ecEditor.jQuery("#readAlong").click(function(event){
            if (!$(this).hasClass('disabled') && !$(this).hasClass('read-along-enabled')) {
                $scope.fireEvent({id:'org.ekstep.richtext:readalong:show'});
                event.stopImmediatePropagation();
            }
        });

        // ecEditor.jQuery("#transliterate").click(function(event){
        //     $scope.openTransliterator();
        //     event.stopImmediatePropagation();
        // });

        ecEditor.jQuery('.ui.accordion').accordion();

        $scope.disabledIndicator = function(){
            ecEditor.jQuery("#disabledReadAlongIndicator").click(function(event){
                event.stopImmediatePropagation();
            });

            ecEditor.jQuery("#disabledWordInfoIndicator").click(function(event){
                event.stopImmediatePropagation();
            });
        };
        
        $scope.collapseAllAccordionItems = function(){
            ecEditor.jQuery(".sidebar-accordion > .title").removeClass('active');
            ecEditor.jQuery('#textFormatting').addClass('active');
            $scope.activeTextPluginControlItem='textFormatting';
            ecEditor.jQuery('.sidebar-accordion').accordion({active:0});
        }

        setTimeout(function() {
            ecEditor.jQuery('.font-face-dropdown').dropdown();
            ecEditor.jQuery('.font-size-dropdown').dropdown();
            ecEditor.jQuery("#readalongautoplay").checkbox({
                onChecked: function() {
                    $scope.configData.autoplay = true;
                },
                onUnchecked: function() {
                    $scope.configData.autoplay = false;
                }
            });
            if ($scope.configData.autoplay) ecEditor.jQuery("#readalongautoplay").checkbox('set checked');
        }, 0);

        $scope.onTextSelect = function(event, data) {
            data = ecEditor.getCurrentObject() || data;
            if (data && data.attributes.textType == "readalong") {
                $scope.hasReadAlong = true;
                $scope.hasWordInfo = false;
                $scope.textTypeSelected = "readalong";
                $scope.updateAdvancedTab();
                $scope.showReadAlong(data);
            } else if (data && data.attributes.textType == "wordinfo") {
                $scope.hasWordInfo = true;
                $scope.hasReadAlong = false;
                $scope.textTypeSelected = "wordinfo";
                $scope.updateAdvancedTab();
                $scope.showWordInfo(data);
            } else {
                $scope.textTypeSelected = undefined;
                $scope.hasReadAlong = false;
                $scope.hasWordInfo = false;
                $scope.updateAdvancedTab();
            }
            $scope.$safeApply();
        };


        $scope.updateAdvancedTab = function() {
            $scope.refreshTab = false;
            $scope.refreshTab = true;
            $scope.$safeApply();
        };

        $scope.showReadAlong = function(data) {
            $scope.showColorpicker('highlightcolorpicker', data.config.highlight || '#FFFF00');
        };

        $scope.showWordInfo = function(data) {
            $scope.showColorpicker('wordfontcolorpicker', data.config.wordfontcolor || '#0000FF');
            $scope.showColorpicker('wordhighlightcolorpicker', data.config.wordhighlightcolor || '#FFFF00');
            $scope.showColorpicker('wordunderlinecolorpicker', data.config.wordunderlinecolor || '#0000FF');
        };

        $scope.onTextSelect();

        //remove listeners on object:unselect. controller is executed everytime object is selected, 
        //so everytime listeners are registered with new scope.
        //if we dont clean up the listeners, it will pile up the eventbus and causes performance issue.

        ecEditor.jQuery('.sidebar-accordion').accordion();

        setTimeout(function() {
            ecEditor.jQuery('.font-face-dropdown').dropdown();
            ecEditor.jQuery('.font-size-dropdown').dropdown();
        }, 0);


        $scope.toggleActiveAcordionTitle = function(clickEvent) {
            let targetId = $scope.activeTextPluginControlItem = clickEvent.target.id;
            ecEditor.jQuery(".sidebar-accordion>.title").removeClass('active');
            ecEditor.jQuery('#' + targetId + '').addClass('active');

        };


        $scope.unregisterListeners = function() {
            ecEditor.removeEventListener("org.ekstep.richtext:addWordInfo", $scope.onTextSelect, $scope);
            ecEditor.removeEventListener("org.ekstep.richtext:addReadAlong", $scope.onTextSelect, $scope);
            ecEditor.removeEventListener("org.ekstep.richtext:add", $scope.onTextSelect, $scope);
            ecEditor.removeEventListener("org.ekstep.text:modified", $scope.onTextSelect, $scope);
            ecEditor.removeEventListener("org.ekstep.richtext:unselected", $scope.unregisterListeners, $scope);
            ecEditor.removeEventListener("config:show", $scope.onTextSelect, $scope);
        };

        ecEditor.addEventListener("org.ekstep.richtext:addWordInfo", $scope.onTextSelect, $scope);
        ecEditor.addEventListener("org.ekstep.richtext:addReadAlong", $scope.onTextSelect, $scope);
        ecEditor.addEventListener("org.ekstep.richtext:add", $scope.onTextSelect, $scope);
        ecEditor.addEventListener("org.ekstep.text:modified", $scope.onTextSelect, $scope);
        ecEditor.addEventListener("org.ekstep.richtext:unselected", $scope.unregisterListeners, $scope);
        ecEditor.addEventListener("config:show", $scope.onTextSelect, $scope);
    }]);