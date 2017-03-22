/**
 * 
 * plugin to get assessments (Questions) from learning platform
 * @class assessmentBrowser
 * @extends EkstepEditor.basePlugin
 * @author Kartheek Palla <kartheekp@ilimi.in>
 * @fires assessment:addassessment to stage
 * @listens org.ekstep.assessmentbrowser:show
 */

EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof assessment
     */
    type: "assessmentbrowser",
    /**
     * Preview URL is used to append src to iframe
     * @member {string} previewURL
     * @memberof assessment
     */
    previewURL: 'preview/preview.html?webview=true',
    /**
     *   @memberof callback {Funtion} callback
     *   @memberof assessmentBrowser
     */
    callback: function() {},
    /**
     *   registers events
     *   @memberof assessmentBrowser
     *
     */
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener(this.manifest.id + ":show", this.showAssessmentBrowser, this);
        setTimeout(function() {
            var templatePath = EkstepEditorAPI.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/assessmentbrowser.html");
            var controllerPath = EkstepEditorAPI.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/assessmentbrowserapp.js");
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);

    },
    /**        
     *   invokes popup service to show the popup window
     *   @param event {Object} event
     *   @param callback {Function} callback to be fired when data is available.
     *   @memberof assessmentBrowser
     */
    showAssessmentBrowser: function(event, callback) {
        var instance = this;
        this.callback = callback;
        // this.loadResource('editor/assessmentbrowser.html', 'html', function(err, response) {
        //     instance.showAssessmentBrowser(err, response);
        // });
        EkstepEditorAPI.getService('popup').open({
            template: 'assessmentbrowser',
            controller: 'assessmentbrowsercontroller',
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
//# sourceURL=assessmentbrowserplugin.js
