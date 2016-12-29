/**
 *
 * plugin to get asset (image/audio) from learning platform
 * @class assetBrowser
 * @extends EkstepEditor.basePlugin
 * @author Sunil A S <sunils@ilimi.in>
 * @fires stagedecorator:addcomponent
 * @listens org.ekstep.assetbrowser:show
 */
EkstepEditor.basePlugin.extend({
    type: 'assetbrowser',
    initData: undefined,
    /**
     *   @memberof cb {Funtion} callback
     *   @memberof assetBrowser
     */
    cb: undefined,
    /**
    *   registers events
    *   @memberof assetBrowser
    *
    */
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":show", this.initPreview, this);
        setTimeout(function() {
            var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.assetbrowser-1.0/editor/assetBrowser.html';
            var controllerPath = EkstepEditor.config.pluginRepo + '/org.ekstep.assetbrowser-1.0/editor/assetbrowserapp.js';

            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);


        }, 1000);
    },
    /**
    *   load html template to show the popup
    *   @param event {Object} event
    *   @param cb {Function} callback to be fired when asset is available.
    *   @memberof assetBrowser
    */
    initPreview: function(event, data) {
        var instance = this;
        this.cb = data.callback;
        this.mediaType = data.type;
        this.search_filter = data.search_filter;
        EkstepEditorAPI.getService('popup').open({
            template: 'partials/assetbrowser.html',
            controller: 'browsercontroller',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return instance;
                }
            },
            width: 900,
            showClose: false,
            className: 'ngdialog-theme-plain'
        });
    },

    /**
    *   get asset from Learning platfrom
    *   @param {String} name of the asset
    *   @param {String} type of media
    *   @param {Function} callback to be fired when XHR request is completed
    *   @memberof assetBrowser
    *
    */
    getAsset: function(searchText, mediaType, owner, cb) {
        var instance = this,
            iservice = new EkstepEditor.iService(),
            requestObj,
            requestHeaders,
            allowableFilter;

        requestObj = {
            "request": {
                "filters": {
                    "mediaType": [mediaType],
                    "license": ["Creative Commons Attribution (CC BY)"],
                },
                "limit":30
            }
        };

        requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'user-id': 'ATTool'
            }
        };

        EkstepEditorAPI._.isUndefined(searchText) ? null : requestObj.request.query = searchText;
        EkstepEditorAPI._.isUndefined (owner) ? null : requestObj.request.owner = owner;
        allowableFilter = EkstepEditorAPI._.omit(this.search_filter, ['mediaType', 'license', 'limit']);
        EkstepEditorAPI._.merge(requestObj.request.filters, allowableFilter);

        iservice.http.post(EkstepEditor.config.baseURL + '/api/search/v2/search', requestObj, requestHeaders, cb);
    },
    /**
    *   invokes popup service to show the popup window
    *   @param err {Object} err when loading template async
    *   @param data {String} template HTML
    *   @memberof assetBrowser
    */
    showAssetBrowser: function(err, data) {

    },
    /**
    *   File size and mime type validation
    *   @param id {fieldId} Id of the field
    *   @memberof assetBrowser
    */
    fileValidation: function(fieldId, allowedFileSize, allowedMimeTypes) {
        var instance = this;

        /*Check for browser support for all File API*/
        if (window.File && window.FileList && window.Blob) {
            /*Get file size and file type*/
            var fsize = EkstepEditorAPI.jQuery('#' + fieldId)[0].files[0].size;
            var ftype = EkstepEditorAPI.jQuery('#' + fieldId)[0].files[0].type;

            /*Check file size*/
            if (fsize > allowedFileSize) {
                alert('File size is higher than the allowed size!');
                return false;
            }

            /*Check mime type*/
            if (ftype) {
                if (EkstepEditorAPI.jQuery.inArray(ftype, allowedMimeTypes) == -1) {
                    alert("File type is not allowed!");
                    return false;
                }
            }
            /*If no file type is detected, return true*/
            else {
                return true;
            }

            return true;
        }
        /*If no browser suppoer for File apis, return true*/
        else {
            return true;
        }
    }
});
//# sourceURL=assetbrowserplugin.js
