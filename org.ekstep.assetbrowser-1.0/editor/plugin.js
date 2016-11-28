EkstepEditor.basePlugin.extend({
    type: 'assetbrowser',
    initData: undefined,
    cb: function(){},    
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":show", this.initPreview, this);
    },
    initPreview: function(event, cb) {
        var instance = this;
        this.cb = cb;       
        this.loadResource('editor/assetBrowser.html', 'html', function(err, response) {
            instance.showAssetBrowser(err, response);
        });
    },
    getAsset: function(searchText, mediaType, cb) {
        var instance = this,
            iservice = new EkstepEditor.iService(),
            requestObj,
            requestHeaders;

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

        iservice.http.post(EkstepEditor.config.baseURL + '/api/search/v2/search', requestObj, requestHeaders, cb);

    },
    showAssetBrowser: function(err, data) {
        EkstepEditorAPI.getService('popup').open({ template: data, size: 'lg', resolve: { data: { instance: this } } }, this.browserController);
    },
    browserController: function(ctrl, scope, $uibModalInstance, resolvedData, $sce) {
        var audiodata = {},
            imagedata = { "x": 20, "y": 20, "w": 50, "h": 50 },
            searchText,
            instance = resolvedData.instance,
            lastSelectedAudio,
            lastSelectedImage,
            audioTabSelected = false,
            imageTabSelected = true;
            //mainScope = EkstepEditorAPI.getAngularScope();


        ctrl.selected_images = {};
        ctrl.selected_audios = {};
        ctrl.selectBtnDisable = true;
        ctrl.loadingImage = true;
        ctrl.loadingAudio = true;


        function imageAssetCb(err, res) {
            if (res && res.data.result.content) {
                ctrl.loadingImage = false;
                ctrl.imageList = [];
                _.forEach(res.data.result.content, function(obj, index) {
                    ctrl.imageList.push({ downloadUrl: trustResource(obj.downloadUrl), identifier: obj.identifier });
                });
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

        ctrl.searchKeyPress = function(mediaType) {
            var callback,
                searchText;

            searchText = (mediaType === "image") ? $('#searchTextImage').val() : $('#searchTextAudio').val();
            (searchText === "") ? searchText = undefined: null;
            callback = (mediaType === "image") ? imageAssetCb : callback;
            callback = (mediaType === "audio") ? audioAssetCb : callback;
            callback && ctrl.toggleImageCheck() && ctrl.toggleAudioCheck()
            ctrl.selectBtnDisable = true;
            callback && instance.getAsset(searchText, mediaType, callback);
        }

        ctrl.cancel = function() {
            $uibModalInstance.dismiss('cancel');
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

        ctrl.select = function() {
            if (imagedata && imagedata.asset && imageTabSelected) {
                instance.cb(imagedata);
                ctrl.cancel();
            }

            /*if (audiodata && audiodata.asset && audioTabSelected) {
                instance.cb(audiodata);
                console.log('audiodata', audiodata);
                //EkstepEditorAPI.dispatchEvent("stagedecorator:addcomponent", { component: 'audio', title: audiodata.asset });
                ctrl.cancel();
            }*/
        }
    }
});
//# sourceURL=assetbrowserplugin.js
