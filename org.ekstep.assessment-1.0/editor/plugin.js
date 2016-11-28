EkstepEditor.basePlugin.extend({
    type: "assessment",
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":showPopup", this.openAssessmentBrowser, this);
    },
    openAssessmentBrowser: function(event, callback) {
        var callback = function(items){
            console.log('Items ', items);
        };
        EkstepEditorAPI.dispatchEvent("org.ekstep.assessmentbrowser:show", callback);
    }
});
//# sourceURL=assessmentplugin.js
