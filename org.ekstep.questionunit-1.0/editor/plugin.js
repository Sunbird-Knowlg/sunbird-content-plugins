/**
 * 
 * Question Unit Base Plugin that declares the interfaces that Question Unit Plugins must define.
 * @class org.ekstep.contenteditor.questionUnitPlugin
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.contenteditor.questionUnitPlugin = org.ekstep.contenteditor.basePlugin.extend({
	type: "org.ekstep.contenteditor.questionUnitPlugin",
	initialize: function() {
		CKEDITOR.basePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/libs/ck-editor/");
	}
	// TODO: Interfaces
});
//# sourceURL=questionsetPlugin.js