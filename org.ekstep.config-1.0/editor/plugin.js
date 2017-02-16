/**
 * Config
 * The purpose of {@link Configplugin} is to encapsulate configurable properties and providing a UI for changing values
 *
 * @class Config
 * @extends EkstepEditor.basePlugin
 *
 * @author Harishkumar Gangula <harishg@ilimi.in>
 */
EkstepEditor.basePlugin.extend({
    /** @member {undefined|Object} canvasOffset
     * @memberof Config
     */
    canvasOffset: undefined,
    /** @member {undefined|String} selectedPluginId
     * @memberof Config
     */
    selectedPluginId: undefined,
    margin: {
        left: 68,
        top: 56,
    },
    /** @member {undefined|Array} pluginConfigManifest
     * @memberof Config
     */
    pluginConfigManifest: undefined,
    /** @member {undefined|Array} configData
     * @memberof Config
     */
    configData: undefined,
    allActionsList: {
        "show": "Show",
        "hide": "Hide",
        "play": "Play",
        "pause": "Pause",
        "stop": "Stop",
        "link": "Link To"
    },
    playableActionsList: {
        "play": "Play",
        "pause": "Pause",
        "stop": "Stop"
    },
    visibleActionsList: {
        "show": "Show",
        "hide": "Hide"
    },
    stageActionsList: { "link": "Link To" },
    /**
     * 
     * The events are registred which are used to update the selected editor object
     * <br/>Assign canvasOffset using <b>jquery</b> offset method
     * <br/>Initialize toolbar 
     * @override
     * @memberof Config
     */
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("config:show", this.showConfig, this);
        EkstepEditorAPI.addEventListener("stage:unselect", this.stageUnselect, this);
        EkstepEditorAPI.addEventListener("config:help", this.showHelp, this);
        EkstepEditorAPI.addEventListener("config:actions", this.showActions, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:colorpicker", this.showColorPicker, this);
        EkstepEditorAPI.addEventListener("object:modified", this.objectModified, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:invoke", this.invoke, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:addAction", this.addAction, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:removeAction", this.removeAction, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:toggleStageEvent", this.toggleEventToStage, this);
        EkstepEditorAPI.addEventListener("config:properties", this.showProperties, this);
        EkstepEditorAPI.addEventListener("config:showSettingsTab", this.showSettingsTab, this);
        EkstepEditorAPI.addEventListener("config:showHelpTab", this.showHelpTab, this);
        EkstepEditorAPI.addEventListener("config:showCommentsTab", this.showCommentsTab, this);

        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.contextToolbar = instance.manifest.editor.data.toolbars;
        });

        this.canvasOffset = EkstepEditorAPI.jQuery('#canvas').offset();
        EkstepEditorAPI.jQuery("#plugin-toolbar-container").draggable({
            containment: "document",
            cursor: "move",
            stop: function() {
                EkstepEditorAPI.jQuery("#plugin-toolbar-container").css('height', 'auto');
            }
        })
    },
    /**
     * Place config toolbar on top of plugin, based on its location
     * @param event object:selected
     * @param data id of the selected plugin
     * @memberof Config
     */
    objectSelected: function(event, data) {
        this.selectedPluginId = data.id;
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.showConfigContainer = true;
        });
        this.showSettingsTab(event, data);
        this.showConfig(event, data);
        EkstepEditorAPI.jQuery('.sidebarConfig .item').removeClass('active');
        EkstepEditorAPI.jQuery('#settingsTab').addClass('active');
        EkstepEditorAPI.jQuery('.sidebarConfigDiv').removeClass('active');
        EkstepEditorAPI.jQuery('#settingsContent').addClass('active');
    },
    objectUnselected: function(event, data) {
        if(this.selectedPluginId == data.id){
            var angScope = EkstepEditorAPI.getAngularScope();
            EkstepEditorAPI.ngSafeApply(angScope, function() {
                angScope.showConfigContainer = false;
                angScope.stageConfigStatus = EkstepEditorAPI.getCurrentObject() ? false : true;
            });
            if(!EkstepEditorAPI.getCurrentObject()){
                this.showSettingsTab();
            }
        }
    },
    /**
     *  Show configuration
     *  <br/> 1. Gets the selected object from canvas and toolbar is location is set and based on selected object location in canvas
     *  <br/> 2. Get the selected plugin manifest and config data and assign it to angular scope to render the view and update angular model with config data
     *  <br/> 3. Watches the config data with angular watch method and on change of config data calls updateConfig method
     *  <br/> 4. Iterates pluginConfigManifest  and invoke method is called
     *  @param event config:show is the event called
     *  @param data Object type is sent to method
     *  @memberof Config
     */
    showConfig: function(event, data) {
        var instance = this;
        this.pluginConfigManifest = EkstepEditorAPI._.clone(EkstepEditorAPI.getCurrentObject() ? EkstepEditorAPI.getCurrentObject().getConfigManifest() : EkstepEditorAPI.getCurrentStage().getConfigManifest());
        this.configData = EkstepEditorAPI._.clone(EkstepEditorAPI.getCurrentObject() ? EkstepEditorAPI.getCurrentObject().getConfig() : EkstepEditorAPI.getCurrentStage().getConfig());
        if (EkstepEditorAPI._.isUndefined(this.pluginConfigManifest)) {
            this.pluginConfigManifest = [];
            EkstepEditorAPI.getCurrentObject() ? EkstepEditorAPI.getCurrentObject().renderConfig() : EkstepEditorAPI.getCurrentStage().renderConfig();
        }
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.pluginConfig = instance.pluginConfigManifest;
            angScope.configData = instance.configData;
            angScope.$watch('configData', function(newValue, oldValue) {
                instance.updateConfig(newValue, oldValue);
            }, true);
            angScope.stageConfigStatus = EkstepEditorAPI.getCurrentObject() ? false : true;
        });
        EkstepEditorAPI._.forEach(instance.pluginConfigManifest, function(config) {
            instance._invoke(config, instance.configData)
        });
        //this.setToolBarContainerLocation("Configuration");
        /*
        semantic ui apply
         */
        // setTimeout(function() {
        //     EkstepEditorAPI.jQuery("#plugin-toolbar-container .ui.dropdown").dropdown();
        // }, 500);
    },
    /**
     * This is called on stage unselect event fired 
     * This will hide toolbar if it is visible on DOM
     * @param data {Object}
     * @memberof Config
     */
    stageUnselect: function(data) {
        EkstepEditorAPI.jQuery('#toolbarOptions').hide();
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.showConfigContainer = false;
        });
    },
    /**
     * This method invokes any config items require to  initialize before showing in config toolbar
     * @param  config {Array}
     * @param  configData {Array}
     * @memberof Config
     */
    _invoke: function(config, configData) {
        var instance = this;
        var fontSizeConfig, counter = 0;
        configData = configData || {};
        if (config.dataType === 'colorpicker') {
            var eventData = { id: config.propertyName, callback: this.onConfigChange, color: configData[config.propertyName] };
            setTimeout(function() { EkstepEditorAPI.dispatchEvent("colorpicker:state", eventData) }, 500);
        }
        if (config.dataType === 'rangeslider') {
            setTimeout(function() {
                EkstepEditorAPI.jQuery('#' + config.propertyName).on("change mouseclick", function() {
                    EkstepEditorAPI.jQuery('#' + config.propertyName + 'label').html(EkstepEditorAPI.jQuery(this).val());
                    instance.onConfigChange(config.propertyName, EkstepEditorAPI.jQuery(this).val());
                });
            }, 500);
        }
        if (config.dataType === 'addselect') {
            setTimeout(function() {
                EkstepEditorAPI._.forEach(instance.pluginConfigManifest, function(config, index) {
                    if(config.propertyName === "fontsize"){
                        fontSizeConfig = config;
                        EkstepEditorAPI._.forEach(fontSizeConfig.range, function(value) {
                            if(instance.configData.fontsize === parseInt(value)){
                                counter++;
                            }
                        });
                        if(counter === 0){
                            fontSizeConfig.range.push(instance.configData.fontsize);
                        }
                        /*EkstepEditorAPI.jQuery('#' + config.propertyName).parent().dropdown({
                            allowAdditions: true
                        }).dropdown('set text', instance.configData.fontsize);*/
                    }
                });
                EkstepEditorAPI.jQuery('#' + config.propertyName).parent().dropdown({
                    allowAdditions: true,
                    action: function(text, value, element){
                        if (isNaN(parseInt(text, 10)) || parseInt(text, 10) < fontSizeConfig.minValue || parseInt(text, 10) > fontSizeConfig.maxValue) {
                            instance.configData.fontsize = fontSizeConfig.defaultValue;
                            instance.onConfigChange(fontSizeConfig.propertyName, fontSizeConfig.defaultValue);
                            EkstepEditorAPI.jQuery('#' + fontSizeConfig.propertyName).parent().dropdown('set text', fontSizeConfig.defaultValue);
                        } else {
                            instance.configData.fontsize = parseInt(text);
                            counter = 0;
                            EkstepEditorAPI._.forEach(fontSizeConfig.range, function(rangeValue) {
                                if(instance.configData.fontsize === parseInt(rangeValue)){
                                    counter++;
                                }
                            });
                            if(counter === 0){
                                fontSizeConfig.range.push(instance.configData.fontsize);
                            }
                            instance.onConfigChange(config.propertyName, parseInt(text));
                            EkstepEditorAPI.jQuery('#' + config.propertyName).parent().dropdown('set text', parseInt(text));
                        }
                    }
                });
            }, 1000);
        }
        if (config.dataType === 'groupToggle') {
            setTimeout(function() {
                var angScope = EkstepEditorAPI.getAngularScope();
                EkstepEditorAPI.jQuery('.popup-button2').popup({
                    popup : EkstepEditorAPI.jQuery('.custom.popup'),
                    on : 'click',
                    position: 'bottom left'
                });
                EkstepEditorAPI.ngSafeApply(angScope, function() {
                    angScope.textAlignClick = function(conf, ddObj, configDataObj){
                        var configList;
                        if(conf) configList = conf.config;
                        else configList = config.config;
                        console.log(configDataObj);
                        EkstepEditorAPI._.forEach(configList, function(configObj, index) {
                            if(configObj.id === ddObj.id){
                                if((configDataObj[configObj.propertyName] === ddObj.propertyValue) && (configDataObj[configObj.propertyName] !== configList[0].propertyValue)){
                                    configDataObj[configObj.propertyName] = configList[0].propertyValue; 
                                } else {
                                    configDataObj[configObj.propertyName] = ddObj.propertyValue; 
                                }
                            } 
                        });
                    };
                });
            }, 500);
        }

    },
    /**
     * This method gets the old and new config data and compares the both and calls the onConfigChange method with the key and value of new value
     * @param  newValue {Object}
     * @param  oldValue {Object}
     * @memberof Config
     */
    updateConfig: function(newValue, oldValue) {
        var instance = this;
        var changedValues = EkstepEditorAPI._.reduce(oldValue, function(result, value, key) {
            return EkstepEditorAPI._.isEqual(value, newValue[key]) ?
                result : result.concat(key);
        }, []);
        EkstepEditorAPI._.forEach(changedValues, function(cv) {
            instance.onConfigChange(cv, newValue[cv]);
        })
    },
    /**
     * This will call the selected plugin onConfigChange method with key and value which is recevied as params
     * @param  key {String}
     * @param  value {Any}
     * @memberof Config
     */
    onConfigChange: function(key, value) {
        if (!EkstepEditorAPI._.isUndefined(value)) {
            EkstepEditorAPI.getCurrentObject().__proto__.__proto__.onConfigChange(key, value);
            EkstepEditorAPI.getCurrentObject().onConfigChange(key, value);
            if (key === 'autoplay') {
                this.toggleEventToStage('', { 'flag': value, 'id': EkstepEditorAPI.getCurrentObject().id });
            }
        }
    },
    /**
     * This is lifecycle method called when object saves the all the config data at a time
     * @param  config {Object}
     * @memberof Config
     */
    saveConfig: function(config) {
        EkstepEditorAPI.getCurrentObject().saveConfig(config);
    },
    /**
     * This method called when config:help event is fired  
     * <br/> It will show the help data for the selected plugin 
     * @param  event {Object}
     * @param  data {Object}
     *  @memberof Config
     */
    showHelp: function(event, data) {
        var instance = this;
        if(EkstepEditorAPI.getCurrentObject()){
            EkstepEditorAPI.getCurrentObject().getHelp(function(helpText) {
                EkstepEditorAPI.jQuery("#pluginHelpContent").html(micromarkdown.parse(helpText));
            });
        }else{
            EkstepEditorAPI.getCurrentStage().getHelp(function(helpText) {
                EkstepEditorAPI.jQuery("#pluginHelpContent").html(micromarkdown.parse(helpText));
            });
        }
    },
    /**
     * This method called when config:properties event is fired  
     * It shows the properties of the selected plugin
     * @param  event {Object}
     * @param  data {Object}
     * @memberof Config
     */
    showActions: function(event, data) {
        var instance = this;
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.currentObjectActions = [];
            angScope.allActionsList = instance.allActionsList;
        });
        //this.setToolBarContainerLocation("Actions");
        this.highlightTargetObject();
        this.updateActions();
        this.updateTargetOptions();
        this.restoreOnObjectSelect();
    },
    /**
     * * This method called when object:moving or object:scaling events is fired 
     * It will moves the toolbar with plugin object when moving and scaling in canvas 
     * @param  event {Object}
     * @param  data {Object}  
     * @memberof Config   
     */
    objectModified: function(event, data) {
        if (data && data.id) {
            this.selectedPlugin = data.id;
            var plugin = EkstepEditorAPI.getPluginInstance(data.id);
            if (!EkstepEditorAPI._.isUndefined(plugin) && !EkstepEditorAPI._.isUndefined(plugin.editorObj)) {
                this.setToolBarPosition();
                var containerLeft = this.canvasOffset.left + plugin.editorObj.left + plugin.editorObj.getWidth() + 30;
                var maxLeft = this.canvasOffset.left + EkstepEditorAPI.jQuery("#canvas").width() + 5;
                var minLeft = this.canvasOffset.left + EkstepEditorAPI.jQuery("#toolbarOptions").width() + 5;
                if (containerLeft > maxLeft) { containerLeft = maxLeft; }
                if (containerLeft < minLeft) { containerLeft = minLeft; }
                EkstepEditorAPI.jQuery('#plugin-toolbar-container').offset({
                    top: (this.canvasOffset.top),
                    left: containerLeft
                });
            } else {
                EkstepEditorAPI.jQuery('#toolbarOptions').hide();
                var angScope = EkstepEditorAPI.getAngularScope();
                EkstepEditorAPI.ngSafeApply(angScope, function() {
                    angScope.showConfigContainer = false;
                });
            }
        }
    },
    setToolBarContainerLocation: function(title) {
        var instance = this;
        var angScope = EkstepEditorAPI.getAngularScope();
        var selectedPluginObj = EkstepEditorAPI.getPluginInstance(instance.selectedPluginId).editorObj;
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.showConfigContainer = true;
            angScope.configHeaderText = title;
            angScope.configStyle = {
                'top': instance.canvasOffset.top,
                'left': (instance.canvasOffset.left + selectedPluginObj.left + selectedPluginObj.getWidth() + 30)
            }
        });
    },
    invoke: function(event, data) {
        var instance = this;
        if (data.type) {
            switch (data.type) {
                case 'imagebrowser':
                    EkstepEditorAPI.dispatchEvent('org.ekstep.assetbrowser:show', {
                        type: 'image',
                        callback: function(data) { instance.onConfigChange('asset', data) }
                    });
                    break;
                default:
                    break;
            }
        }
    },
    setToolBarPosition: function() {
        if (this.selectedPluginId) {
            var selectedPluginObj = EkstepEditorAPI.getPluginInstance(this.selectedPluginId).editorObj;
            var topPosition = this.canvasOffset.top + selectedPluginObj.top - this.margin.top;
            var leftPosition = this.canvasOffset.left + selectedPluginObj.left + selectedPluginObj.getWidth() / 2 - this.margin.left;
            var canvasBottom = this.canvasOffset.top + EkstepEditorAPI.jQuery("#canvas").height() - EkstepEditorAPI.jQuery("#toolbarOptions").height()
            var canvasRight = this.canvasOffset.left + EkstepEditorAPI.jQuery("#canvas").width() - EkstepEditorAPI.jQuery("#toolbarOptions").width();
            /* toolbar location reset based on object location*/
            if (topPosition < this.canvasOffset.top) {
                topPosition = this.canvasOffset.top + selectedPluginObj.top + selectedPluginObj.height + 16;
            }
            if (leftPosition < this.canvasOffset.left) { leftPosition = this.canvasOffset.left; }
            if (leftPosition > canvasRight) { leftPosition = canvasRight; }
            if (topPosition > canvasBottom) { topPosition = canvasBottom; }
            EkstepEditorAPI.jQuery('#toolbarOptions').css({
                position: 'absolute',
                display: 'block',
                top: topPosition - 15,
                left: leftPosition - 5
            })
        }
    },
    addAction: function(event, data) {
        if (data.command && data.asset) {
            if (this.stageActionsList[data.command]) {
                EkstepEditorAPI.getCurrentObject().addEvent({ 'type': 'click', 'action': [{ 'id': UUID(), 'type': 'command', 'command': 'transitionTo', 'asset': 'theme', 'value': data.asset }] });
            } else {
                EkstepEditorAPI.getCurrentObject().addEvent({ 'type': 'click', 'action': [{ 'id': UUID(), 'type': 'command', 'command': data.command, 'asset': data.asset }] });
            }
        }
        this.updateActions();
        setTimeout(function() {
            EkstepEditorAPI.jQuery("#actionTargetDropdown").dropdown('restore defaults');
            EkstepEditorAPI.jQuery("#actionTypeDropdown").dropdown('restore defaults');
        }, 500);
    },
    removeAction: function(event, data) {
        if (data.index > -1) {
            EkstepEditorAPI.getCurrentObject().event.splice(parseInt(data.index), 1);
            this.updateActions();
        }
    },
    updateActions: function() {
        var instance = this;
        var angScope = EkstepEditorAPI.getAngularScope();
        var events = EkstepEditorAPI.getCurrentObject().event;
        var eventsActionList = [];
        if (events && events.length) {
            EkstepEditorAPI._.forEach(events, function(e) {
                if (e.action && e.action.length) { eventsActionList.push(e.action[0]) }
            })
        }
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.currentObjectActions = eventsActionList;
        });
    },
    highlightTargetObject: function() {
        var instance = this;
        EkstepEditorAPI.jQuery("#actionTargetDropdown:not(.addClick)").parent().on('click', function() {
            EkstepEditorAPI.jQuery("#actionTargetDropdown").nextAll(".menu.transition").find(".item").mouseover(function(event) {
                var id = EkstepEditorAPI.jQuery(event.target).text();
                var pluginInstance = EkstepEditorAPI.getPluginInstance(id);
                if (pluginInstance && pluginInstance['editorObj']) {
                    var editorObj = pluginInstance['editorObj'];
                    var left = instance.canvasOffset.left + editorObj.left - 5;
                    var top = instance.canvasOffset.top + editorObj.top - 5;
                    EkstepEditorAPI.jQuery("#objectPointer")
                        .show().offset({ 'left': left, 'top': top })
                        .css({ 'height': editorObj.getHeight() + 10, 'width': editorObj.getWidth() + 10 });
                }
            });
            EkstepEditorAPI.jQuery(this).mouseleave(function() {
                EkstepEditorAPI.jQuery("#objectPointer").hide();
            });
        }).addClass("addClick");
    },
    restoreOnObjectSelect: function() {
        setTimeout(function() {
            EkstepEditorAPI.jQuery("#actionTargetDropdown").dropdown('clear');
            EkstepEditorAPI.jQuery("#actionTypeDropdown").dropdown('clear');
        }, 500);
    },
    updateTargetOptions: function() {
        var instance = this;
        var angScope = EkstepEditorAPI.getAngularScope();

        EkstepEditorAPI.jQuery("#actionTypeDropdown:not(.addChange)").on('change', function(e) {
            EkstepEditorAPI.ngSafeApply(angScope, function() {
                angScope.actionTargetObjects = [];
            });

            var selectedOption = EkstepEditorAPI.jQuery(this).val().split(':')[1];
            if (instance.visibleActionsList[selectedOption]) {
                instance.setVisibleObjects();
            }
            if (instance.playableActionsList[selectedOption]) {
                instance.setPlayableObjects();
            }
            if (instance.stageActionsList[selectedOption]) {
                instance.setStageObjects();
            }
            setTimeout(function() {
                EkstepEditorAPI.jQuery("#actionTargetDropdown").dropdown('clear');
            }, 500);
        }).addClass('addChange');

    },
    setVisibleObjects: function() {
        var angScope = EkstepEditorAPI.getAngularScope();
        var pluginInstanceIds = [];
        var pluginInstances = EkstepEditorAPI.getAllPluginInstanceByTypes(EkstepEditorAPI.getCurrentObject().id, ['org.ekstep.audio'], false);
        EkstepEditorAPI._.forEach(pluginInstances, function(pi) {
            pluginInstanceIds[pi.id] = pi.id;
        })
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.actionTargetObjects = pluginInstanceIds;
        });
    },
    setPlayableObjects: function() {
        var pluginInstances = EkstepEditorAPI.getAllPluginInstanceByTypes(EkstepEditorAPI.getCurrentObject().id, ['org.ekstep.audio'], true);
        var optionsList = [];
        EkstepEditorAPI._.forEach(pluginInstances, function(pi) {
            if (pi.media) {
                var mediaObj = pi.media[Object.keys(pi.media)[0]];
                optionsList[mediaObj.id] = mediaObj.id;
            }
        });
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.actionTargetObjects = optionsList;
        });
    },
    setStageObjects: function() {
        var stageOptions = [];
        EkstepEditorAPI._.forEach(EkstepEditorAPI._.clone(EkstepEditorAPI.getAllStages(), true), function(stage, i) {
            var stageKey = 'Stage ' + (i + 1);
            stageOptions[stage.id] = stageKey;
        });
        delete stageOptions[EkstepEditorAPI.getCurrentStage().id];
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.actionTargetObjects = stageOptions;
        });
    },
    toggleEventToStage: function(event, data) {
        var currentStage = EkstepEditorAPI.getCurrentStage();
        var eventIndex = -1;
        if (currentStage.event) {
            _.forEach(currentStage.event, function(e, i) {
                if(EkstepEditorAPI._.isArray(e.action)){
                    if (e.action[0].asset === data.id) {
                        eventIndex = i;
                    }
                }else if(EkstepEditorAPI._.isObject(e.action)){
                    if (e.action.asset === data.id) {
                        eventIndex = i;
                    }
                }
            })
        }
        if (data.flag === true && eventIndex === -1) {
            currentStage.addEvent({ 'type': 'enter', 'action': [{ 'id': UUID(), 'type': 'command', 'command': 'play', 'asset': data.id }] })
        } else if (data.flag === false && eventIndex !== -1) {
            currentStage.event.splice(eventIndex, 1);
        }
    },
    showProperties: function(event, data) {
        var angScope = EkstepEditorAPI.getAngularScope();
        var properties = EkstepEditorAPI.getCurrentObject() ? EkstepEditorAPI.getCurrentObject().getProperties() : EkstepEditorAPI.getCurrentStage().getProperties();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.pluginProperties = properties;
        });
        //this.setToolBarContainerLocation("Properties");
    },
    showSettingsTab: function(event, data) {
        EkstepEditorAPI.jQuery("#configMenu .ui.button").removeClass('active');
        EkstepEditorAPI.jQuery("#configMenu #settingsMenu").addClass('active');
        EkstepEditorAPI.jQuery('.sidebarConfig .item').removeClass('active');
        EkstepEditorAPI.jQuery('#settingsTab').addClass('active');
        EkstepEditorAPI.jQuery('.sidebarConfigDiv').removeClass('active');
        EkstepEditorAPI.jQuery('#settingsContent').addClass('active');
        this.showConfig(event, data);
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.showSettingContainer = true;
            angScope.showHelpContainer = false;
            angScope.showCommentsContainer = false;
        });
    },
    showHelpTab: function(event, data) {
        EkstepEditorAPI.jQuery("#configMenu .ui.button").removeClass('active');
        EkstepEditorAPI.jQuery("#configMenu #helpMenu").addClass('active');
        EkstepEditorAPI.jQuery('.sidebarHelp .item').removeClass('active');
        EkstepEditorAPI.jQuery('#helpTab').addClass('active');
        EkstepEditorAPI.jQuery('.sidebarHelpDiv').removeClass('active');
        EkstepEditorAPI.jQuery('#helpContent').addClass('active');
        this.showHelp(event, data);
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.showSettingContainer = false;
            angScope.showHelpContainer = true;
            angScope.showCommentsContainer = false;
        });
    },
    showCommentsTab: function(event, data) {
        EkstepEditorAPI.jQuery("#configMenu .ui.button").removeClass('active');
        EkstepEditorAPI.jQuery("#configMenu #commentsMenu").addClass('active');
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.showSettingContainer = false;
            angScope.showHelpContainer = false;
            angScope.showCommentsContainer = true;
        });
    }
});
//# sourceURL=configplugin.js
