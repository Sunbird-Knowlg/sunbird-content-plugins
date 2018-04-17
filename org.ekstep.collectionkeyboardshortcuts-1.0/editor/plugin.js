/**
 * 
 * plugin to add keyboard shortcuts to interact with editor
 * @class Shortcuts
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Akash Gupta<akash.gupta@tarento.com>
 * 
 */

org.ekstep.contenteditor.basePlugin.extend({
    type: "shortcuts",
    initialize: function() {
        var instance = this;
        var config = org.ekstep.services.collectionService.config;
        var fancyTreeElem = ecEditor.jQuery("#collection-tree");
        ecEditor.registerKeyboardCommand('alt+mod+shift+n', function (event) {
            if (config.mode === 'Edit') {
                event.preventDefault();
                ecEditor.jQuery(fancyTreeElem).trigger("nodeCommand", { cmd: "addSibling" });
                return false;
            }
        })

        ecEditor.registerKeyboardCommand('alt+mod+a', function (event) {
            if (config.mode === 'Edit') {
                event.preventDefault();
                ecEditor.jQuery(fancyTreeElem).trigger("nodeCommand", { cmd: "addLesson" });
                return false;
            }
        })

        ecEditor.registerKeyboardCommand(['alt+ctrl+n', 'alt+command+`'], function (event) {
            if (config.mode === 'Edit') {
                event.preventDefault();
                ecEditor.jQuery(fancyTreeElem).trigger("nodeCommand", { cmd: "addChild" });
                return false;
            }
        })

        ecEditor.registerKeyboardCommand(['del', 'ctrl+del', 'mod+backspace'], function (event) {
            if (config.mode === 'Edit') {
                event.preventDefault();
                ecEditor.jQuery(fancyTreeElem).trigger("nodeCommand", { cmd: "remove" });
                return false;
            }
        })

        ecEditor.registerKeyboardCommand('mod+/', function (event) {
            if (config.mode === 'Edit') {
                event.preventDefault();
                ecEditor.jQuery(fancyTreeElem).trigger("nodeCommand", { cmd: "showMenu" });
                return false;
            }
        })

    }
});

//# sourceURL=collection-shortcutsplugin.js