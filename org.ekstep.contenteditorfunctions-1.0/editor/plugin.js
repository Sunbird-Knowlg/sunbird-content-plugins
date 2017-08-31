org.ekstep.contenteditor.basePlugin.extend({
	initialize: function() {
    ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules("editor/partials/contenteditorfunctions.html", "editor/contenteditorfunctions.js");
  }
});