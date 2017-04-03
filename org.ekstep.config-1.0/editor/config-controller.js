angular.module('editorApp')
    .controller('org.ekstep.config:configController', ['$scope', '$timeout', '$ocLazyLoad', function($scope, $timeout, $ocLazyLoad) {

        var visibleActionsList = {
            "show": "Show",
            "hide": "Hide"
        };

        var playableActionsList = {
            "play": "Play",
            "pause": "Pause",
            "stop": "Stop"
        };

        var stageActionsList = { "link": "Link To" };

        $scope.pluginConfig = undefined;
        $scope.configData = undefined;
        $scope.actionTargetObject = {};

        $scope.allActionsList = {
            "show": "Show",
            "hide": "Hide",
            "play": "Play",
            "pause": "Pause",
            "stop": "Stop",
            "link": "Link To"
        };


        $scope.showActions = function() {
            $scope.currentObjectActions = [];
            $scope.allActionsList = $scope.allActionsList;
            $scope.settingsCategory.selected = 'actions';
            $scope.highlightTargetObject();
            $scope.updateActions();
            //$scope.updateTargetOptions();
            $scope.restoreOnObjectSelect();
        };

        $scope.showCustomize = function(event, data) {
            $scope.showConfig();
            $scope.$safeApply();
        };


        $scope.showConfig = function() {
            var pluginConfigManifest = org.ekstep.contenteditor.api._.clone(org.ekstep.contenteditor.api.getCurrentObject() ? org.ekstep.contenteditor.api.getCurrentObject().getConfigManifest() : org.ekstep.contenteditor.api.getCurrentStage().getConfigManifest());
            $scope.pluginConfig = pluginConfigManifest;
            $scope.configData = org.ekstep.contenteditor.api._.clone(org.ekstep.contenteditor.api.getCurrentObject() ? org.ekstep.contenteditor.api.getCurrentObject().getConfig() : org.ekstep.contenteditor.api.getCurrentStage().getConfig());
            if (org.ekstep.contenteditor.api._.isUndefined(pluginConfigManifest)) {
                pluginConfigManifest = [];
                org.ekstep.contenteditor.api.getCurrentObject() ? org.ekstep.contenteditor.api.getCurrentObject().renderConfig() : org.ekstep.contenteditor.api.getCurrentStage().renderConfig();
            };

            org.ekstep.contenteditor.api._.forEach(pluginConfigManifest, function(config) {
                $scope._showConfig(config, $scope.configData);
            });
        };

        $scope._showConfig = function(config, configData) {
            var instance = this;
            configData = configData || {};
            if (config.dataType === 'colorpicker') {
                var eventData = {
                    id: config.propertyName,
                    callback: function(key, value) {
                        org.ekstep.contenteditor.api.dispatchEvent('config:on:change', { key: key, value: value });
                    },
                    color: configData[config.propertyName]
                };
                setTimeout(function() { org.ekstep.contenteditor.api.dispatchEvent("colorpicker:state", eventData) }, 500);
            }
            if (config.dataType === 'rangeslider') {
                setTimeout(function() {
                    org.ekstep.contenteditor.api.jQuery('#' + config.propertyName).on("change mouseclick", function() {
                        org.ekstep.contenteditor.api.jQuery('#' + config.propertyName + 'label').html(org.ekstep.contenteditor.api.jQuery(this).val());
                        org.ekstep.contenteditor.api.dispatchEvent('config:on:change', config.propertyName, org.ekstep.contenteditor.api.jQuery(this).val());
                    });
                }, 500);
            }
            if (config.dataType === 'inputSelect') {
                if (!_.includes(config.range, parseInt(instance.configData[config.propertyName]))) {
                    config.range.push(instance.configData[config.propertyName]);
                }
                setTimeout(function() {
                    org.ekstep.contenteditor.api.jQuery('#' + config.propertyName).dropdown({
                        allowAdditions: true,
                        forceSelection: false,
                        className: {
                            dropdown: 'ui search dropdown'
                        },
                        action: function(text, value, element) {
                            if (isNaN(parseInt(text, 10)) || parseInt(text, 10) < config.minValue || parseInt(text, 10) > config.maxValue) {
                                instance.configData[config.propertyName] = config.defaultValue;
                                org.ekstep.contenteditor.api.dispatchEvent('config:on:change', config.propertyName, config.defaultValue);
                                org.ekstep.contenteditor.api.jQuery('#' + config.propertyName).parent().dropdown('set text', config.defaultValue);
                            } else {
                                instance.configData[config.propertyName] = parseInt(text);
                                if (!_.includes(config.range, parseInt(instance.configData[config.propertyName]))) {
                                    config.range.push(instance.configData[config.propertyName]);
                                }
                                org.ekstep.contenteditor.api.dispatchEvent('config:on:change', config.propertyName, parseInt(text));
                                org.ekstep.contenteditor.api.jQuery('#' + config.propertyName).parent().dropdown('set text', parseInt(text));
                            }
                        }
                    });
                }, 1000);
            }
        };

        $scope.addAction = function(data) {
            if (data.command && data.asset) {
                if (data.command) {
                    org.ekstep.contenteditor.api.getCurrentObject().addEvent({ 'type': 'click', 'action': [{ 'id': UUID(), 'type': 'command', 'command': 'transitionTo', 'asset': 'theme', 'value': data.asset }] });
                } else {
                    org.ekstep.contenteditor.api.getCurrentObject().addEvent({ 'type': 'click', 'action': [{ 'id': UUID(), 'type': 'command', 'command': data.command, 'asset': data.asset, name: $scope.actionTargetObject[data.asset] }] });
                }
            };
            $scope.updateActions();
            setTimeout(function() {
                org.ekstep.contenteditor.api.jQuery("#actionTargetDropdown").dropdown('restore defaults');
                org.ekstep.contenteditor.api.jQuery("#actionTypeDropdown").dropdown('restore defaults');
            }, 500);
        };

        $scope.updateActions = function() {            
            var events = org.ekstep.contenteditor.api.getCurrentObject().event;
            var eventsActionList = [];
            if (events && events.length) {
                org.ekstep.contenteditor.api._.forEach(events, function(e) {
                    if (e.action && e.action.length) { eventsActionList.push(e.action[0]) }
                })
            };            
            if(eventsActionList.length) {
                $scope.currentObject.actions = true;
                $scope.currentObjectActions = eventsActionList;
            } else {
                $scope.currentObject.actions = false;
            }
            $scope.$safeApply();
        };

        $scope.highlightTargetObject = function() {
            var instance = this;
            instance.canvasOffset = $("#canvas").offset();
            org.ekstep.contenteditor.api.jQuery("#actionTargetDropdown:not(.addClick)").parent().on('click', function() {
                org.ekstep.contenteditor.api.jQuery("#actionTargetDropdown").nextAll(".menu.transition").find(".item").mouseover(function(event) {
                    var id = org.ekstep.contenteditor.api.jQuery(event.target).text();
                    var pluginInstance = org.ekstep.contenteditor.api.getPluginInstance(id);
                    if (pluginInstance && pluginInstance['editorObj']) {
                        var editorObj = pluginInstance['editorObj'];
                        var left = instance.canvasOffset.left + editorObj.left - 5;
                        var top = instance.canvasOffset.top + editorObj.top - 5;
                        org.ekstep.contenteditor.api.jQuery("#objectPointer")
                            .show().offset({ 'left': left, 'top': top })
                            .css({ 'height': editorObj.getHeight() + 10, 'width': editorObj.getWidth() + 10 });
                    }
                });
                org.ekstep.contenteditor.api.jQuery(this).mouseleave(function() {
                    org.ekstep.contenteditor.api.jQuery("#objectPointer").hide();
                });
            }).addClass("addClick");
        };

        org.ekstep.contenteditor.api.jQuery("#actionTypeDropdown:not(.addChange)").on('change', function(e) {
            $scope.actionTargetObject = {};

            var selectedOption = org.ekstep.contenteditor.api.jQuery(this).val().split(':')[1];
            if (visibleActionsList[selectedOption]) {
                $scope.setVisibleObjects();
            }
            if (playableActionsList[selectedOption]) {
                $scope.setPlayableObjects();
            }
            if (stageActionsList[selectedOption]) {
                $scope.setStageObjects();
            }
            setTimeout(function() {
                org.ekstep.contenteditor.api.jQuery("#actionTargetDropdown").dropdown('clear');
            }, 500);
        }).addClass('addChange');

        $scope.setVisibleObjects = function() {
            var pluginInstanceIds = {};
            var pluginInstances = org.ekstep.contenteditor.api.getStagePluginInstances(org.ekstep.contenteditor.api.getCurrentStage().id, null, ['org.ekstep.audio'], [org.ekstep.contenteditor.api.getCurrentObject().id]);
            org.ekstep.contenteditor.api._.forEach(pluginInstances, function(pi) {
                pluginInstanceIds[pi.id] = pi.id;
            })

            $scope.actionTargetObject = pluginInstanceIds;
        };

        $scope.setPlayableObjects = function() {
            var pluginInstances = org.ekstep.contenteditor.api.getStagePluginInstances(org.ekstep.contenteditor.api.getCurrentStage().id, ['org.ekstep.audio'], null, [org.ekstep.contenteditor.api.getCurrentObject().id]);
            var optionsList = {};
            org.ekstep.contenteditor.api._.forEach(pluginInstances, function(pi) {
                if (pi.media) {
                    var mediaObj = pi.media[Object.keys(pi.media)[0]];
                    optionsList[mediaObj.id] = mediaObj.id;
                }
            });
            $scope.actionTargetObject = optionsList;
        };

        $scope.setStageObjects = function() {
            var stageOptions = {};
            org.ekstep.contenteditor.api._.forEach(org.ekstep.contenteditor.api._.clone(org.ekstep.contenteditor.api.getAllStages(), true), function(stage, i) {
                var stageKey = 'Stage ' + (i + 1);
                stageOptions[stage.id] = stageKey;
            });
            delete stageOptions[org.ekstep.contenteditor.api.getCurrentStage().id];
            $scope.actionTargetObject = stageOptions;
            $scope.$safeApply();
        };

        $scope.restoreOnObjectSelect = function() {
            setTimeout(function() {
                org.ekstep.contenteditor.api.jQuery("#actionTargetDropdown").dropdown('clear');
                org.ekstep.contenteditor.api.jQuery("#actionTypeDropdown").dropdown('clear');
            }, 500);
        };

        $scope.removeAction = function(data) {
            if (data.index > -1) {
                org.ekstep.contenteditor.api.getCurrentObject().event.splice(parseInt(data.index), 1);
                $scope.updateActions();
            }
        };

        $scope.refreshConfig = function(event, data) {
            switch ($scope.configCategory.selected) {
                case 'comments':
                    $scope.showCommentsTab(event, data);
                    break;
                case 'help':
                    $scope.showHelpTab(event, data);
                    break;
                default:
                    $scope.showSettingsTab(event, data);
            }
            $scope.$safeApply();
        };

        
        $scope.objectSelected = function(event, data) {
            $scope.selectedPluginId = data.id;
            $scope.configCategory.selected = 'settings';
            $scope.selectedObject.stage = false;
            $scope.updateActions();
            $scope.refreshConfig(event, data);
        };

        $scope.objectUnselected = function(event, data) {
            if ($scope.selectedPluginId == data.id) {
                $scope.configCategory.selected = 'settings';
                $scope.selectedObject.stage = true; 
                $scope.updateActions();               
                $scope.refreshConfig(event, data);
            }
        };

        $scope.stageSelect = function(event, data) {
            $scope.selectedObject.stage = true;
            $scope.refreshConfig(event, data);
        };

        (function($scope) {
            if (!org.ekstep.contenteditor.sidebarManager.configControllerRegistered) {
                org.ekstep.contenteditor.sidebarManager.configControllerRegistered = true;
                $scope.$watch('configData', function(newValue, oldValue) {
                    org.ekstep.contenteditor.api.dispatchEvent("config:updateValue", { newValue: newValue, oldValue: oldValue });
                }, true);
                org.ekstep.contenteditor.api.addEventListener("object:selected", $scope.objectSelected, $scope);
                org.ekstep.contenteditor.api.addEventListener("object:unselected", $scope.objectUnselected, $scope);
                org.ekstep.contenteditor.api.addEventListener("config:show", $scope.refreshConfig, $scope);
                org.ekstep.contenteditor.api.addEventListener("stage:render:complete", $scope.stageSelect, $scope);
                org.ekstep.contenteditor.api.addEventListener("config:settings:show", $scope.showSettingsTab, $scope);                
                org.ekstep.contenteditor.api.addEventListener("config:comments:show", $scope.showCommentsTab, $scope);
                org.ekstep.contenteditor.api.addEventListener('config:show:actions', $scope.showActions, $scope);
                org.ekstep.contenteditor.api.addEventListener("config:show:customise", $scope.showConfig, $scope);
            }
        })($scope);

    }]);
