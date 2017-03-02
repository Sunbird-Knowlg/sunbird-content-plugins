/**
 * plugin is used to create or modifiy the word meaning text in editor
 * @class wordinfotext
 * @extends EkstepEditor.basePlugin
 * @author Kartheek Palla <kartheekp@ilimi.in>
 */

EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof wordinfotext
     */
    type: "wordinfotext",
    currentInstance: undefined,
    cb: undefined,
    text:undefined,
    /**
     * registers events
     * @memberof wordinfotext
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("delete:invoked", this.deleteObject, this);
        EkstepEditorAPI.addEventListener("org.ekstep.wordinfotext:showpopup", this.loadHtml, this);
        setTimeout(function() {
            var templatePath = EkstepEditorAPI.getPluginRepo() + '/org.ekstep.wordinfotext-1.0/editor/wordinfotext.html';
            var controllerPath = EkstepEditorAPI.getPluginRepo() + '/org.ekstep.wordinfotext-1.0/editor/wordinfotextapp.js';
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);
    },
    /**        
     *   load html template into the popup
     *   @param parentInstance 
     *   @param attrs attributes
     *   @memberof wordinfotext
     */
    loadHtml: function(event, data) {
        currentInstance = this;
        this.cb = data.callback;
        this.text = this.attributes.__text = data.textObj.editorObj.text;
        this.attributes = data.textObj.config;
        if(data.textObj.attributes.textType == "wordinfo")
            this.editorObj = data.textObj.editorObj;
        EkstepEditorAPI.getService('popup').open({
            template: 'wordinfotext',
            controller: 'wordinfotextcontroller',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return currentInstance;
                },
            },
            width: 900,
            showClose: false,
            className: 'ngdialog-theme-plain'
        }, function() {

        });

    }
});
//# sourceURL=wordinfotextplugin.js
