/**
 *
 * Plugin to create question set and add it to stage.
 * @class questionset
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.contenteditor.basePlugin.extend({
    type: "org.ekstep.questionset",
    /**
     * Register events.
     * @memberof questionset
     */
    initialize: function() {
		var instance = this;
        ecEditor.addEventListener(instance.manifest.id + ":openQuestionBrowser", instance.openQuestionBrowser, instance);
        ecEditor.addEventListener(this.manifest.id + ":questionset", this.addToStage, this);
    },
    newInstance: function() {
       alert(1);
    },
    addToStage: function (event, data) {
        var instance = this;
        ecEditor.dispatchEvent(instance.manifest.id + ':create', []);
    },
    /**    
     *      
     * open question bank. 
     * @memberof assessment
     * 
     */
    openQuestionBrowser: function(event, callback) {
        var instance = this,
            data = undefined;        
        
        callback = function(data) {
            var questionsetData = {"data":{"plugin":{"id":"String","version":"String","templateId":"String"},"type":"String","data":{"name": "first Questoin name"}},"config":{"metadata":{"title":"Question title second","description":"Question description","language":"question language","type":"mcq","qlevel":"EASY"},"max_time":"","max_score":"","partial_scoring":false}};
            ecEditor.dispatchEvent(instance.manifest.id + ':renderQuestionset', questionsetData);
        };
     
        ecEditor.dispatchEvent("org.ekstep.assessmentbrowser:show", {callback : callback, data : data});  
    }
});
//# sourceURL=questionsetPlugin.js
