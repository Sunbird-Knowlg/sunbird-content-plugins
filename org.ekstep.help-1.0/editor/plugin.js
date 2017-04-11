/**
 * 
 * @class Help
 * @extends EkstepEditor.basePlugin
 *
 * @author Sunil A S <sunils@ilimi.in>
 */
EkstepEditor.basePlugin.extend({
    type: "help",
    initialize: function() {
        org.ekstep.contenteditor.api.addEventListener("config:help:show", this.showHelpTab, this);
        org.ekstep.contenteditor.api.addEventListener("object:selected", this.showHelpTab, this);
        org.ekstep.contenteditor.api.addEventListener("object:unselected", this.showHelpTab, this);
    },
    showHelpTab: function() {
        if (org.ekstep.contenteditor.api.getCurrentObject()) {
            org.ekstep.contenteditor.api.getCurrentObject().getHelp(function(helpText) {
                org.ekstep.contenteditor.api.jQuery("#pluginHelpContent").html(micromarkdown.parse(helpText));
            });
        } else {
            org.ekstep.contenteditor.api.getCurrentStage().getHelp(function(helpText) {
                org.ekstep.contenteditor.api.jQuery("#pluginHelpContent").html(micromarkdown.parse(helpText));
            });
        }
    }
});

//# sourceURL=helpPlugin.js
