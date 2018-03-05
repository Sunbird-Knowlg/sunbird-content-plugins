/**
 * @class  org.ekstep.navigation.EditorPlugin
 */
org.ekstep.contenteditor.basePlugin.extend({

    /**
     * @memberOf org.ekstep.navigation.EditorPlugin#
     */
    initialize:function(){
        ecEditor.instantiatePlugin('org.ekstep.navigation',{});
    },
    newInstance: function() {}
});
//# sourceURL=navigationEditorPlugin.js
