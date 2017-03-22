EkstepEditor.basePlugin.extend({
    type: "delete",
    picker: undefined,
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener("delete:invoke", this.deleteObject, this);
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnSelected, this);
        EkstepEditorAPI.registerKeyboardCommand('del', function() {
            instance.deleteObject();
        });
    },
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
    remove: function(object) {
        EkstepEditorAPI.dispatchEvent('delete:invoked', { 'editorObj': EkstepEditorAPI.getPluginInstance(object.id).attributes });
        EkstepEditorAPI.getCanvas().remove(object);
        EkstepEditorAPI.dispatchEvent('stage:modified', { id: object.id });
    },
    objectSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenu({ id: 'delete', state: 'SHOW', data: {} });
    },
    objectUnSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenu({ id: 'delete', state: 'HIDE', data: {} });
    }
});
//# sourceURL=deleteplugin.js
