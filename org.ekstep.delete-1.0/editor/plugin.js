EkstepEditor.basePlugin.extend({
	type: "delete",
	picker: undefined,
	initialize: function() {
		EkstepEditorAPI.addEventListener("delete:invoke", this.deleteObject, this);
		EkstepEditorAPI.addEventListener("object:selected", this.objectSelected, this);
		EkstepEditorAPI.addEventListener("object:unselected", this.objectUnSelected, this);
	},
	deleteObject: function(event, data) {
		var id = EkstepEditorAPI.getEditorObject().id;
		EkstepEditorAPI.dispatchEvent('delete:invoked',{'editorObj':EkstepEditorAPI.getCurrentObject().attributes});
		EkstepEditorAPI.getCanvas().remove(EkstepEditorAPI.getEditorObject());
		EkstepEditorAPI.dispatchEvent('object:modified', {id: id});
	},
	objectSelected: function(event, data) {
		EkstepEditorAPI.updateContextMenu({id: 'delete', state: 'SHOW', data: {}});
	},
	objectUnSelected: function(event, data) {
		EkstepEditorAPI.updateContextMenu({id: 'delete', state: 'HIDE', data: {}});
	}
});
//# sourceURL=deleteplugin.js