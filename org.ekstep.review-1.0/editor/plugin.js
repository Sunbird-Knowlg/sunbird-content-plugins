/**
 *
 * plugin to send content for review
 * @class reviewContent
 * @extends EkstepEditor.basePlugin
 * @author Amol Ghatol <amol_g@techjoomla.com>
 * @listens org.ekstep.review:show
 */

EkstepEditor.basePlugin.extend({
    /**
     * This explains the type of the plugin
     * @member {String} type
     * @memberof review
     */
    type: "review",
    /**
     *   registers events
     *   @memberof review
     */
    initialize: function() {
        /**Add event listeners**/
        EkstepEditorAPI.addEventListener(this.manifest.id + ":show", this.loadHtml, this);
        EkstepEditorAPI.addEventListener(this.manifest.id + ":show", this.getContent, this);
        EkstepEditorAPI.addEventListener(this.manifest.id + ":showDialog", this.showDialog, this);

        /**load html templates**/
        var templatePath = EkstepEditorAPI.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/review.html");
        var controllerPath = EkstepEditorAPI.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/reviewapp.js");
        var ngModuleTemplatePath = EkstepEditorAPI.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/editMetaDialog.html");

        /**get ngModule service**/
        EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        EkstepEditorAPI.getService('popup').loadNgModules(ngModuleTemplatePath);
    },
    /**
     *   load html template to show the popup
     *   @param event {Object} event
     *   @memberof review
     */
    loadHtml: function(event) {
        var instance = this;

        EkstepEditorAPI.getService('popup').open({
            template: 'partials/review.html',
            controller: 'reviewcontroller',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return instance;
                },
            },
            width: 900,
            showClose: false,
            className: 'ngdialog-theme-default'
        });
    },
    /**
     *   load html template to show the dialogbox
     *   @param event {Object} event
     *   @param data {Object} data
     *   @memberof review
     */
    showDialog: function(event, data) {
        var instance = this;
        var modalController = function($scope) {
            $scope.dialogMainText = data.dialogMainText;
            $scope.dialogSubtext = data.dialogSubtext;
            $scope.isRedirect = data.isRedirect;
            $scope.redirectToEditMeta = instance.redirectToEditMeta;
            $scope.isError = data.isError;
        };
        EkstepEditorAPI.getService('popup').open({
            template: 'partials/editMetaDialog.html',
            controller: ['$scope', modalController],
            showClose: false,
            width: 500,
            className: 'ngdialog-theme-default'
        });
    },
    /**
     *   redirect to edit metadata form
     *   @memberof review
     */
    redirectToEditMeta: function() {
        window.location.href = window.context.editMetaLink;
    },
    /**
     *   Get the content
     *   @param event {Object} Event
     *   @memberof review
     */
    getContent: function(event) {
        var instance = this;
        instance.contentObj = EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id);
    }
});
//# sourceURL="reviewplugin.js"
