/**
 * 
 * plugin to support copy paste functionality
 * @class copyPaste
 * @extends EkstepEditor.basePlugin
 *
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 * @listens copy:copyItem
 * @listens copy:copyItem
 * @listens object:selected
 * @listens object:unselected
 */
EkstepEditor.basePlugin.extend({
    type: "copypaste",
    /**
     *   @member clipboard {Object}  
     *   @memberof copyPaste
     *   
     */
    clipboard: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener('copy:copyItem', this.copyItem, this);
        EkstepEditorAPI.addEventListener('paste:pasteItem', this.pasteItem, this);
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnSelected, this);
    },
    /**
     *
     *   get current active plugin instance from stage to copy
     *   update context menu to show paste icon
     *   @memberof copyPaste
     */
    copyItem: function() {
        this.clipboard = EkstepEditorAPI.getCurrentObject() ? EkstepEditorAPI.getCurrentObject() : EkstepEditorAPI.getCurrentGroup();
        EkstepEditorAPI.updateContextMenu({ id: 'paste', state: 'SHOW', data: {} });
    },
    /**
     *
     *   get copied plugin instance from clipboard and instantiate.
     *   update context menu to hide paste icon
     *   @memberof copyPaste
     */
    pasteItem: function() {
        if (_.isArray(this.clipboard)) {
            EkstepEditorAPI.getCanvas().discardActiveGroup();
            this.clipboard.forEach(function(instance){
                EkstepEditorAPI.cloneInstance(instance);
            });
        }
        else EkstepEditorAPI.cloneInstance(this.clipboard);
        this.clipboard = undefined;
        EkstepEditorAPI.updateContextMenu({ id: 'paste', state: 'HIDE', data: {} });
    },
    /**
     *
     *  shows copy icon in context menu 
     *   @memberof copyPaste
     *   
     */
    objectSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenu({ id: 'copy', state: 'SHOW', data: {} });
    },
    /**
     *
     *  hide copy icon in context menu 
     *   @memberof copyPaste
     *   
     */
    objectUnSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenu({ id: 'copy', state: 'HIDE', data: {} });
    }
});
//# sourceURL=copypasteplugin.js
