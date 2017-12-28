/**
 *
 * Plugin to add questions in question stage.
 * @class questionbank
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Swati Singh <swati.singh@tarento.com>
 */
org.ekstep.contenteditor.basePlugin.extend({
    type: "org.ekstep.qe.questionbank",
    /**
     * Register events.
     * @member of questionbank
     */
    initialize: function() {
         var instance = this;
        ecEditor.addEventListener("org.ekstep.qe.questionbank:showpopup", this.loadHtml, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/questionbankmodal.html');
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/questionbankcontroller.js');
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);

    },
    newInstance: function() {
        // TODO: Logic here
    },
     /**
     *  Open window to add question and options
     *  @memberof org.ekstep.qe.questionbank
     */
    loadHtml: function() {
        var currentInstance = this;
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).open({
            template: 'QuestionFormTemplate',
            controller: 'QuestionFormController',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return currentInstance;
                }
            },
            width: 900,
            showClose: false,
        }, function() {
             if (!ecEditor._.isUndefined(currentInstance.editorObj)) {
                 //currentInstance.editorObj.remove();
                 ecEditor.render();
             }
         });
    },
});
//# sourceURL=questionBankPlugin.js
