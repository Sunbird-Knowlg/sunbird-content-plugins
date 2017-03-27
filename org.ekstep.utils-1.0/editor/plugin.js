/**
 * 
 * plugin to add utilities to other plugins
 * @class Utils
 * @extends EkstepEditor.basePlugin
 *
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 * @listens copy:copyItem
 * @listens copy:copyItem
 * @listens reorder:sendtofront
 * @listens reorder:sendtoback
 * @listens delete:invoke
 * @listens object:selected
 * @listens object:unselected
 * 
 */
EkstepEditor.basePlugin.extend({
    type: "utils",
    picker: undefined,
    /**
     *   @member clipboard {Object}  
     *   @memberof Utils
     *   
     */
    clipboard: undefined,
    initialize: function() {
        var instance = this;

        EkstepEditorAPI.addEventListener("reorder:sendtofront", this.sendToFront, this);
        EkstepEditorAPI.addEventListener("reorder:sendtoback", this.sendToBack, this);
        EkstepEditorAPI.addEventListener('copy:copyItem', this.copyItem, this);
        EkstepEditorAPI.addEventListener('paste:pasteItem', this.pasteItem, this);
        EkstepEditorAPI.addEventListener("delete:invoke", this.deleteObject, this);
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnSelected, this);

        EkstepEditorAPI.registerKeyboardCommand('ctrl+c', function() {
            instance.copyItem();
        });
        EkstepEditorAPI.registerKeyboardCommand('ctrl+v', function() {
            instance.pasteItem();
        });
        EkstepEditorAPI.registerKeyboardCommand('shift+del', function() {
            instance.deleteObject();
        });
    },
    /**
     *
     *   send the object to one step front in the canvas
     *   fires the object:modified event to update stage and renders
     *   @memberof Utils
     */
    sendToFront: function(event, data) {
        EkstepEditorAPI.getCanvas().bringForward(EkstepEditorAPI.getEditorObject());        
        EkstepEditorAPI.render();        
        EkstepEditorAPI.dispatchEvent('object:modified', {id: EkstepEditorAPI.getEditorObject().id});
    },
    /**
     *
     *   send the object to one step back in the canvas
     *   fires the object:modified event to update stage and renders
     *   @memberof Utils
     */
    sendToBack: function(event, data) {
        EkstepEditorAPI.getCanvas().sendBackwards(EkstepEditorAPI.getEditorObject());        
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', {id: EkstepEditorAPI.getEditorObject().id});
    },
    /**
     *
     *   get current active plugin instance from stage to copy
     *   update context menu to show paste icon
     *   @memberof Utils
     */
    copyItem: function() {
        this.clipboard = EkstepEditorAPI.getCurrentObject() ? EkstepEditorAPI.getCurrentObject() : EkstepEditorAPI.getCurrentGroup();
        if(this.clipboard) {
            EkstepEditorAPI.updateContextMenu({ id: 'paste', state: 'SHOW', data: {} });
        }
    },
    /**
     *
     *   get copied plugin instance from clipboard and instantiate.
     *   update context menu to hide paste icon
     *   @memberof Utils
     */
    pasteItem: function() {
        if(this.clipboard) {
            if (_.isArray(this.clipboard)) {
                EkstepEditorAPI.getCanvas().discardActiveGroup();
                this.clipboard.forEach(function(instance){
                    EkstepEditorAPI.cloneInstance(instance);
                });
            }
            else EkstepEditorAPI.cloneInstance(this.clipboard);
            this.clipboard = undefined;
            EkstepEditorAPI.updateContextMenu({ id: 'paste', state: 'HIDE', data: {} });
        }
    },
    /**
     *
     *   deletes the object or group from the canvas 
     *   invokes remove method
     *   @memberof Utils
     */
    deleteObject: function(event, data) {
        var activeGroup = EkstepEditorAPI.getEditorGroup(), activeObject = EkstepEditorAPI.getEditorObject(), id, instance = this;

        if (activeObject) {
            instance.remove(activeObject);
        } else if (activeGroup) {
            EkstepEditorAPI.getCanvas().discardActiveGroup();
            activeGroup.getObjects().forEach(function(object) {
                instance.remove(object);
            });
        }
    },
    /**
     *
     *   it is invoked on object delete
     *   @memberof Utils
     */
    remove: function(object) {
        EkstepEditorAPI.dispatchEvent('delete:invoked', { 'editorObj': EkstepEditorAPI.getPluginInstance(object.id).attributes });
        EkstepEditorAPI.getCanvas().remove(object);
        EkstepEditorAPI.dispatchEvent('stage:modified', { id: object.id });
    },
    /**
     *
     *   on selection of the object it is invoked and updates the context menu
     *   @memberof Utils
     */
    objectSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenus([{ id: 'reorder', state: 'SHOW', data: {}}, 
                                            { id: 'copy', state: 'SHOW', data: {} },
                                            { id: 'delete', state: 'SHOW', data: {} }]);
    },
    /**
     *
     *   on Unselection of the object it is invoked and updates the context menu
     *   @memberof Utils
     */
    objectUnSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenus([{ id: 'reorder', state: 'HIDE', data: {}},
                                            { id: 'copy', state: 'HIDE', data: {} },
                                            { id: 'delete', state: 'HIDE', data: {} }]);
    }
});
//# sourceURL=utilsplugin.js