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
        this.loadResource('editor/assetBrowser.html', 'html', function(err, response) {
            instance.showAssetBrowser(err, response);
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
    getAsset: function(searchText, mediaType, cb) {
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
                    "name": []
                }
            }
        };

        requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'user-id': 'ATTool'
            }
        };

        _.isUndefined(searchText) ? null : requestObj.request.filters.name = [searchText];
        allowableFilter = _.omit(this.search_filter, ['mediaType', 'license']);
        _.merge(requestObj.request.filters, allowableFilter);

        iservice.http.post(EkstepEditor.config.baseURL + '/api/search/v2/search', requestObj, requestHeaders, cb);

    },
    /**    
    *   invokes popup service to show the popup window
    *   @param err {Object} err when loading template async
    *   @param data {String} template HTML 
    *   @memberof assetBrowser
    */
    showAssetBrowser: function(err, data) {
        EkstepEditorAPI.getService('popup').open({ template: data, data: { instance: this } }, this.browserController);
    },
    /**
    *   @memberof assetBrowser
    *   angular controller for popup service as callback
    *   @param ctrl {Object} popupController object
    *   @param scope {Object} popupController scope object    
    *   @param resolvedData {Object} data passed to popup config    
    *   @memberof assetBrowser
    */
    browserController: function(ctrl, $injector, resolvedData) {
        var audiodata = {},
            imagedata = { "x": 20, "y": 20, "w": 50, "h": 50 },
            searchText,
            instance = resolvedData.instance,
            lastSelectedAudio,
            lastSelectedImage,
            audioTabSelected = false,
            imageTabSelected = true;
        //mainScope = EkstepEditorAPI.getAngularScope();

        var $sce = $injector.get('$sce');
        ctrl.selected_images = {};
        ctrl.selected_audios = {};
        ctrl.selectBtnDisable = true;
        ctrl.loadingImage = true;
        ctrl.loadingAudio = true;
        ctrl.imageBrowser = (instance.mediaType == 'image');

        $('.menu .item').tab();

        function imageAssetCb(err, res) {
            if (res && res.data.result.content) {
                ctrl.loadingImage = false;
                ctrl.imageList = res.data.result.content;
                ctrl.initPopup(res.data.result.content);
            } else {
                ctrl.imageList = [];
            };

            EkstepEditorAPI.getAngularScope().safeApply();
        };

        function audioAssetCb(err, res) {
            if (res && res.data.result.content) {
                ctrl.loadingAudio = false;
                ctrl.audioList = [];
                _.forEach(res.data.result.content, function(obj, index) {
                    ctrl.audioList.push({ downloadUrl: trustResource(obj.downloadUrl), identifier: obj.identifier });
                });
            } else {
                ctrl.audioList = [];
            };

            EkstepEditorAPI.getAngularScope().safeApply();
        };

        function trustResource(src) {
            return $sce.trustAsResourceUrl(src);
        }

        //load image on opening window
        instance.getAsset(undefined, "image", imageAssetCb);

        ctrl.imageTab = function() {
            imageTabSelected = true;
            audioTabSelected = !audioTabSelected;
            ctrl.selectBtnDisable = _.isUndefined(lastSelectedImage) ? true : false;
        }

        ctrl.audioTab = function() {
            audioTabSelected = true;
            imageTabSelected = !imageTabSelected;
            ctrl.selectBtnDisable = _.isUndefined(lastSelectedAudio) ? true : false;
            instance.getAsset(undefined, "audio", audioAssetCb);
        };

        ctrl.search = function() {
            var callback,
                searchText;

            searchText = ctrl.query;
            (searchText === "") ? searchText = undefined: null;
            callback = (instance.mediaType === "image") ? imageAssetCb : callback;
            callback = (instance.mediaType === "audio") ? audioAssetCb : callback;
            callback && ctrl.toggleImageCheck() && ctrl.toggleAudioCheck()
            ctrl.selectBtnDisable = true;
            callback && instance.getAsset(searchText, instance.mediaType, callback);
        }

        ctrl.cancel = function() {
            $('.ui.modal').modal('hide');
        };

        ctrl.ImageSource = function(event, $index) {
            imagedata.asset = event.target.attributes.data_id.value;
            imagedata.assetMedia = {
                id: imagedata.asset,
                src: event.target.attributes.src.value,
                type: 'image'
            }
            ctrl.selectBtnDisable = false;
            ctrl.toggleImageCheck($index);
        };

        ctrl.toggleImageCheck = function($index) {
            if (!_.isUndefined(lastSelectedImage)) {
                ctrl.selected_images[lastSelectedImage].selected = false;
            }
            lastSelectedImage = $index;
            return true;
        }

        ctrl.AudioSource = function(url, id, $index) {
            var audioElem;
            document.getElementById('audio-' + $index).play();
            audiodata.asset = id;
            audiodata.assetMedia = {
                id: audiodata.asset,
                src: url.toString(),
                type: 'audio'
            }
            ctrl.selectBtnDisable = false;
            ctrl.toggleAudioCheck($index);
        };

        ctrl.toggleAudioCheck = function($index) {
            if (!_.isUndefined(lastSelectedAudio)) {
                ctrl.selected_audios[lastSelectedAudio].selected = false;
                audioElem = document.getElementById('audio-' + lastSelectedAudio);
                audioElem.pause();
                audioElem.currentTime = 0.0;
            }
            lastSelectedAudio = $index;
            return true;
        };

        ctrl.initPopup = function(item) {
            _.forEach(item, function(obj, index) {
                $('#assetbrowser-' + index).popup({
                    hoverable: true,
                    position: 'right center'
                });
                obj.sizeinbytes = ctrl.convertToBytes(obj.size);
            });
        };

        ctrl.convertToBytes = function(bytes) {
            if(_.isUndefined(bytes)) return " N/A";
            bytes = parseInt(bytes);
            var precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }

        ctrl.select = function() {
            if (imagedata && imagedata.asset && imageTabSelected) {
                instance.cb(imagedata);
                ctrl.cancel();
            }

            if (audiodata && audiodata.asset && audioTabSelected) {
                //instance.cb(audiodata);
                console.log('audiodata', audiodata);
                EkstepEditorAPI.dispatchEvent("stagedecorator:addcomponent", { component: 'audio', title: audiodata.asset });
                ctrl.cancel();
            }
        }
    }
});
//# sourceURL=assetbrowserplugin.js
