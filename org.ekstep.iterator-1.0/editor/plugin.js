/**
 * @class  org.ekstep.iterator.EditorPlugin
 */
org.ekstep.iterator.EditorPlugin = org.ekstep.contenteditor.basePlugin.extend({

    /**
     * @memberOf org.ekstep.iterator.EditorPlugin#
     */
    initialize:function(){
        ecEditor.instantiatePlugin('org.ekstep.navigation',{});
    },
    newInstance: function() {}
});
//# sourceURL=iteratorEditorPlugin.js
