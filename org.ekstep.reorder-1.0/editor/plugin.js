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
        EkstepEditorAPI.getCanvas().bringToFront(EkstepEditorAPI.getEditorObject());
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', {id: EkstepEditorAPI.getEditorObject().id});
    },
    sendToBack: function(event, data) {
        EkstepEditorAPI.getCanvas().sendToBack(EkstepEditorAPI.getEditorObject());
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', {id: EkstepEditorAPI.getEditorObject().id});
    },
    objectSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenu({ id: 'reorder', state: 'SHOW', data: {}});
    },
    objectUnSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenu({ id: 'reorder', state: 'HIDE', data: {}});
    }
});
//# sourceURL=reorderplugin.js