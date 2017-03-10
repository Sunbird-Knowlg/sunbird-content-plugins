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
        EkstepEditorAPI.addEventListener("config:show", this.refreshConfig, this);
        EkstepEditorAPI.addEventListener("stage:render:complete", this.stageSelect, this);
        EkstepEditorAPI.addEventListener("config:help", this.showHelp, this);
        EkstepEditorAPI.addEventListener("config:actions", this.showActions, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:colorpicker", this.showColorPicker, this);
        //EkstepEditorAPI.addEventListener("object:modified", this.objectModified, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:invoke", this.invoke, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:addAction", this.addAction, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:removeAction", this.removeAction, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:toggleStageEvent", this.toggleEventToStage, this);
        EkstepEditorAPI.addEventListener("config:customize", this.showCustomize, this);
        EkstepEditorAPI.addEventListener("config:properties", this.showProperties, this);
        EkstepEditorAPI.addEventListener("config:settings:show", this.showSettingsTab, this);
        EkstepEditorAPI.addEventListener("config:help:show", this.showHelpTab, this);
        EkstepEditorAPI.addEventListener("config:comments:show", this.showCommentsTab, this);
        EkstepEditorAPI.addEventListener("config:developer:show", this.showdeveloperTab, this);
        

        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.selectedConfigCategory = 'settings';
            angScope.selectedObjectForConfig = 'stage';
            angScope.selectedConfig = 'customize';
        });

        angScope.$watch('configData', function(newValue, oldValue) {
            instance.updateConfig(newValue, oldValue);
        }, true);  
        this.canvasOffset = $("#canvas").offset();
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
            angScope.selectedConfigCategory = 'settings';
            angScope.selectedObjectForConfig = 'plugin';
        });
        this.refreshConfig(event, data);
    },
    objectUnselected: function(event, data) {
        if(this.selectedPluginId == data.id){
            var angScope = EkstepEditorAPI.getAngularScope();
            EkstepEditorAPI.ngSafeApply(angScope, function() {
                angScope.selectedConfigCategory = 'settings';
                angScope.selectedObjectForConfig = 'stage';
            });
            this.refreshConfig(event, data);
        }
    },
    stageSelect: function(event, data) {
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.selectedObjectForConfig = 'stage';
        });
        this.refreshConfig(event, data);
    },
    refreshConfig: function(event, data) {
        var angScope = EkstepEditorAPI.getAngularScope();
        switch(angScope.selectedConfigCategory) {
            case 'comments':
                this.showCommentsTab(event, data);
                break;
            case 'help':
                this.showHelpTab(event, tab);
                break;
            default:
                this.showSettingsTab(event, data);
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
        });
        EkstepEditorAPI._.forEach(instance.pluginConfigManifest, function(config) {
            instance._invoke(config, instance.configData)
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
        if (config.dataType === 'inputSelect') {
            if(!_.includes(config.range, parseInt(instance.configData[config.propertyName]))){
                config.range.push(instance.configData[config.propertyName]);
            }
            setTimeout(function() { 
                EkstepEditorAPI.jQuery('#' + config.propertyName).dropdown({
                    allowAdditions: true,
                    forceSelection: false,
                    className: {
                        dropdown: 'ui search dropdown'
                    },
                    action: function(text, value, element){
                        if (isNaN(parseInt(text, 10)) || parseInt(text, 10) < config.minValue || parseInt(text, 10) > config.maxValue) {
                            instance.configData[config.propertyName] = config.defaultValue;
                            instance.onConfigChange(config.propertyName, config.defaultValue);
                            EkstepEditorAPI.jQuery('#' + config.propertyName).parent().dropdown('set text', config.defaultValue);
                        } else {
                            instance.configData[config.propertyName] = parseInt(text);
                            if(!_.includes(config.range, parseInt(instance.configData[config.propertyName]))){
                                config.range.push(instance.configData[config.propertyName]);
                            }
                            instance.onConfigChange(config.propertyName, parseInt(text));
                            EkstepEditorAPI.jQuery('#' + config.propertyName).parent().dropdown('set text', parseInt(text));
                        }
                    }
                });
            }, 1000);
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
        var plugin = EkstepEditorAPI.getCurrentObject() ? EkstepEditorAPI.getCurrentObject() : EkstepEditorAPI.getCurrentStage();
        if (!EkstepEditorAPI._.isUndefined(value) && plugin) {
            plugin._onConfigChange(key, value);
            plugin.onConfigChange(key, value);
            if (key === 'autoplay') {
                this.toggleEventToStage('', { 'flag': value, 'id': plugin.id });
            }
        }
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
            angScope.selectedConfig = 'actions';
        });
        this.highlightTargetObject();
        this.updateActions();
        this.updateTargetOptions();
        this.restoreOnObjectSelect();
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
        var pluginInstances = EkstepEditorAPI.getStagePluginInstances(EkstepEditorAPI.getCurrentStage().id, null, ['org.ekstep.audio'], [EkstepEditorAPI.getCurrentObject().id]);
        EkstepEditorAPI._.forEach(pluginInstances, function(pi) {
            pluginInstanceIds[pi.id] = pi.id;
        })
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.actionTargetObjects = pluginInstanceIds;
        });
    },
    setPlayableObjects: function() {
        var pluginInstances = EkstepEditorAPI.getStagePluginInstances(EkstepEditorAPI.getCurrentStage().id, ['org.ekstep.audio'], null, [EkstepEditorAPI.getCurrentObject().id]);
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
            angScope.selectedConfig = 'properties';
        });
    },
    showCustomize: function(event, data) {
        this.showConfig(event, data);
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.selectedConfig = 'customize';
        });
    },
    showSettingsTab: function(event, data) {
        var angScope = EkstepEditorAPI.getAngularScope();
        switch(angScope.selectedConfig) {
            case 'properties':
                this.showProperties(event, data);
                break;
            case 'actions':
                this.showActions(event, data);
                break;
            default:
                this.showCustomize(event, data);
        }
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.selectedConfigCategory = 'settings';
        });
    },
    showHelpTab: function(event, data) {
        this.showHelp(event, data);
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.selectedConfigCategory = 'help';
        });
    },
    showCommentsTab: function(event, data) {
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.selectedConfigCategory = 'comments';
        });
    },
    showdeveloperTab: function(event, data) {
        var angScope = EkstepEditorAPI.getAngularScope();
        EkstepEditorAPI.ngSafeApply(angScope, function() {
            angScope.selectedConfigCategory = 'developer';
        });
        EkstepEditorAPI.dispatchEvent("org.ekstep.developer:getPlugins");
    }
});
//# sourceURL=configplugin.js
