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
    type: "config",
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
        EkstepEditorAPI.addEventListener("org.ekstep.config:invoke", this.invoke, this);
        EkstepEditorAPI.addEventListener("org.ekstep.config:toggleStageEvent", this.toggleEventToStage, this);
        EkstepEditorAPI.addEventListener("config:updateValue", this.updateConfig, this);
        EkstepEditorAPI.addEventListener("config:on:change", this._onConfigChange, this);
    },
    updateConfig: function(event, data) {
        var instance = this;
        var changedValues = EkstepEditorAPI._.reduce(data.oldValue, function(result, value, key) {
            return EkstepEditorAPI._.isEqual(value, data.newValue[key]) ? result : result.concat(key);
        }, []);
        EkstepEditorAPI._.forEach(changedValues, function(cv) {
            instance.onConfigChange(cv, data.newValue[cv]);
        })
    },
    /**
     * This will call the selected plugin onConfigChange method with key and value which is recevied as params
     * @param  key {String}
     * @param  value {Any}
     * @memberof Config
     */
    _onConfigChange: function(event, data) {
        this.onConfigChange(data.key, data.value);
    },
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
    toggleEventToStage: function(event, data) {
        var currentStage = EkstepEditorAPI.getCurrentStage();
        var eventIndex = -1;
        if (currentStage.event) {
            _.forEach(currentStage.event, function(e, i) {
                if (EkstepEditorAPI._.isArray(e.action)) {
                    if (e.action[0].asset === data.id) {
                        eventIndex = i;
                    }
                } else if (EkstepEditorAPI._.isObject(e.action)) {
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
    }
});
//# sourceURL=configplugin.js
