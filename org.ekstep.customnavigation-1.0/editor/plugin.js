/**
 * @class  org.ekstep.customnavigation.EditorPlugin
 */
org.ekstep.customnavigation.EditorPlugin = org.ekstep.contenteditor.basePlugin.extend({

    /**
     * @memberOf org.ekstep.customnavigation.EditorPlugin#
     */
    initialize:function(){
        ecEditor.instantiatePlugin('org.ekstep.nextcustomnavigation',{});
        ecEditor.instantiatePlugin('org.ekstep.previouscustomnavigation',{});
    },
    newInstance: function() {}
});
//# sourceURL=customnavigationEditorPlugin.js
