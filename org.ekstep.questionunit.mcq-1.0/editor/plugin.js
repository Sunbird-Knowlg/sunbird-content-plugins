/**
 * 
 * Question Unit plugin to create a MCQ question
 * @class org.ekstep.questionunit.mcq
 * @extends org.ekstep.contenteditor.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.contenteditor.questionUnitPlugin.extend({
    type: "org.ekstep.questionunit.mcq",
    initialize: function() {
        var templatePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, 'editor/templates/horizontalTemplate.html');
        var controllerPath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, 'editor/controllers/horizontalTemplate.js');
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
    },
});
//# sourceURL=questionunitMCQPlugin.js
