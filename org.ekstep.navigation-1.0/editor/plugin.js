/**
 * @class  org.ekstep.customnavigation.EditorPlugin
 */
org.ekstep.navigation.EditorPlugin = org.ekstep.contenteditor.basePlugin.extend({

    /**
     * @memberOf org.ekstep.customnavigation.EditorPlugin#
     */
    initialize:function(){
        ecEditor.instantiatePlugin('org.ekstep.navigation',{});
    },
    newInstance: function() {}
});
//# sourceURL=customnavigationEditorPlugin.js
