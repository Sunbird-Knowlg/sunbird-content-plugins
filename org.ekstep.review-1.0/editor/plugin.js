/**
 *
 * plugin to send content for review
 * @class reviewContent
 * @extends EkstepEditor.basePlugin
 * @author Amol Ghatol <amol_g@techjoomla.com>
 * @listens org.ekstep.review:show
 */

org.ekstep.contenteditor.basePlugin.extend({
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
        ecEditor.addEventListener(this.manifest.id + ":show", this.loadHtml, this);
        ecEditor.addEventListener(this.manifest.id + ":show", this.getContent, this);
        ecEditor.addEventListener(this.manifest.id + ":showDialog", this.showDialog, this);

        /**load html templates**/
        var templatePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/review.html");
        var controllerPath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/reviewapp.js");
        var ngModuleTemplatePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/editMetaDialog.html");

        /**get ngModule service**/
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
        ecEditor.getService('popup').loadNgModules(ngModuleTemplatePath);
    },
    /**
     *   load html template to show the popup
     *   @param event {Object} event
     *   @memberof review
     */
    loadHtml: function(event) {
        var instance = this;

        ecEditor.getService('popup').open({
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
        ecEditor.getService('popup').open({
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
        instance.contentObj = ecEditor.getService('content').getContentMeta(window.context.content_id);
    }
});
//# sourceURL="reviewplugin.js"
