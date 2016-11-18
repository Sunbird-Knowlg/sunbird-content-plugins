EkstepEditor.basePlugin.extend({
    type: "copypaste",
    clipboard: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener('copy:copyItem', this.copyItem, this);
        EkstepEditorAPI.addEventListener('paste:pasteItem', this.pasteItem, this);
        EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnSelected, this);
    },
    copyItem: function() {
        this.clipboard = EkstepEditorAPI.getCurrentObject();
        EkstepEditorAPI.updateContextMenu({ id: 'paste', state: 'SHOW', data: {} });
    },
    pasteItem: function() {
        if (this.clipboard) EkstepEditorAPI.cloneInstance(this.clipboard);
        this.clipboard = undefined;
        EkstepEditorAPI.updateContextMenu({ id: 'paste', state: 'HIDE', data: {} });
    },
    objectSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenu({ id: 'copy', state: 'SHOW', data: {} });
    },
    objectUnSelected: function(event, data) {
        EkstepEditorAPI.updateContextMenu({ id: 'copy', state: 'HIDE', data: {} });
    }
});
//# sourceURL=copypasteplugin.js