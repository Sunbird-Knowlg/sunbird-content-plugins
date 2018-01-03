/**
 * @class  org.ekstep.question.
 *@author Jagadish P <jagadish.pujari@tarento.com>
 */
org.ekstep.question.EditorPlugin = org.ekstep.contenteditor.basePlugin.extend({

    /**
     * @memberOf org.ekstep.plugins.EditorPlugin#
     */
    currentInstance: undefined,
    initialize: function() {  
        var instance = this;
        ecEditor.addEventListener("org.ekstep.question:showpopup", this.loadHtml, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/question.html');
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/question.js');
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
        
    },

    /**
     *  Open window to add question and options
     *  @memberof org.ekstep.question.EditorPlugin#
     */
    loadHtml: function(event, data) {
        var currentInstance = this;
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).open({
            template: 'QuestionFormTemplate1',
            controller: 'QuestionFormController1',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return currentInstance;
                },
                'questionData': function() {
                    return data;
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
    }
});
//# sourceURL=questionEditorPlugin.js
 