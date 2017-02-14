EkstepEditor.basePlugin.extend({
    type: "reorder",
    picker: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener("reorder:sendtofront", this.sendToFront, this);
        EkstepEditorAPI.addEventListener("reorder:sendtoback", this.sendToBack, this);
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnSelected, this);
    },
    sendToFront: function(event, data) {
        EkstepEditorAPI.getCanvas().bringForward(EkstepEditorAPI.getEditorObject());        
        EkstepEditorAPI.render();        
        EkstepEditorAPI.dispatchEvent('object:modified', {id: EkstepEditorAPI.getEditorObject().id});
    },
    sendToBack: function(event, data) {
        EkstepEditorAPI.getCanvas().sendBackwards(EkstepEditorAPI.getEditorObject());        
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', {id: EkstepEditorAPI.getEditorObject().id});
    },
    objectSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenus([{ id: 'sendtofront', state: 'SHOW', data: {}}, { id: 'sendtoback', state: 'SHOW', data: {}}]);
    },
    objectUnSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenus([{ id: 'sendtofront', state: 'HIDE', data: {}}, { id: 'sendtoback', state: 'SHOW', data: {}}]);
    }
});
//# sourceURL=reorderplugin.js