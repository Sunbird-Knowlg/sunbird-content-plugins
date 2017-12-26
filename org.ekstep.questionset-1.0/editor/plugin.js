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
        ecEditor.addEventListener(instance.manifest.id + ":showpopup", instance.showpopup, instance);
        setTimeout(function() {
			var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/popup.html");
			var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/questionsetapp.js");
			ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
		}, 1000);
    },
    newInstance: function() {
        // TODO: Logic here
    },
    showpopup: function (event, questions) {
        var instance = this;
        instance.questions = [{"data":{"plugin":{"id":"String","version":"String","templateId":"String"},"type":"String","data":{"name": "first question name"}},"config":{"metadata":{"title":"Question title","description":"Question description","language":"question language","type":"mcq","qlevel":"EASY"},"max_time":"","max_score":"","partial_scoring":false}},{"data":{"plugin":{"id":"String","version":"String","templateId":"String"},"type":"String","data":{"name": "second question name"}},"config":{"metadata":{"title":"Question title second","description":"Question description","language":"question language","type":"mcq","qlevel":"EASY"},"max_time":"","max_score":"","partial_scoring":false}}];
        ecEditor.getService('popup').open({
            template: 'questionsetbrowser',
            controller: 'questionsetcontroller',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return instance;
                },
            },
            width: 900,
            showClose: false,
            className: 'ngdialog-theme-plain'
        });
    }
});
//# sourceURL=questionsetPlugin.js
