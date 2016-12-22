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
        EkstepEditorAPI.addEventListener(this.manifest.id + ":show", this.loadHtml, this);
        setTimeout(function() {
            var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.assessmentbrowser-1.0/editor/assessmentbrowser.html';
            var controllerPath = EkstepEditor.config.pluginRepo + '/org.ekstep.assessmentbrowser-1.0/editor/assessmentbrowserapp.js';
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);

    },
    /**        
     *   load html template to show the popup
     *   @param event {Object} event
     *   @param callback {Function} callback to be fired when data is available.
     *   @memberof assessmentBrowser
     */
    loadHtml: function(event, callback) {
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
        });

    },
    /**    
    *   invokes popup service to show the popup window
    *   @param err {Object} err when loading template async
    *   @param data {String} template HTML 
    *   @memberof assessmentBrowser
    */
    showAssessmentBrowser: function(err, data) {
        var instance = this,
            popupConfig;

        popupConfig = {
            template: data,            
            data: { instance: instance }           
        };

        EkstepEditorAPI.getService('popup').open(popupConfig, instance.controllerCallback);
    },

    /**
    *   angular controller for popup service as callback
    *   @param ctrl {Object} popupController object
    *   @param scope {Object} popupController scope object
    *   @param resolvedData {Object} data passed to uib config
    *   @memberof assetBrowser
    */

    controllerCallback: function(ctrl, scope, data) {
        
    }

});
//# sourceURL=assessmentbrowserplugin.js
