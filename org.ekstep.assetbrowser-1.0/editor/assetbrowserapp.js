'use strict';
angular.module('assetbrowserapp', ['angularAudioRecorder']).config(['recorderServiceProvider', function(recorderServiceProvider){
        recorderServiceProvider.forceSwf(false);
        
        // @todo change this to correct path
        if(EkstepEditorAPI._.isUndefined(window.contetInfo)){
            var lameJsUrl =  EkstepEditor.config.pluginRepo + '/org.ekstep.assetbrowser-1.0/editor/recorder/lib2/lame.min.js';
        }
        else{
            var lameJsUrl = window.contetInfo.baseURL + EkstepEditor.config.pluginRepo + '/org.ekstep.assetbrowser-1.0/editor/recorder/lib2/lame.min.js';
        }
        
        var config = {lameJsUrl:lameJsUrl, bitRate: 92};

      recorderServiceProvider.withMp3Conversion(true, config);
  }]);
angular.module('assetbrowserapp').controller('browsercontroller', ['$scope','$injector', 'instance', function($scope ,$injector, instance) {
        var audiodata = {},
            assetMedia,
            assetdata = {},
            searchText,
            lastSelectedAudio,
            lastSelectedImage,
            audioTabSelected = false,
            imageTabSelected = true,
            ctrl = this;

        var $sce = $injector.get('$sce');
        ctrl.selected_images = {};
        ctrl.selected_audios = {};
        ctrl.selectBtnDisable = true;
        ctrl.buttonToShow = 'select';
        ctrl.loadingImage = true;
        ctrl.uploadView = false;
        ctrl.languagecode = 'en';
        ctrl.owner = EkstepEditorAPI._.isUndefined(window.contetInfo) ? 'amolg' : window.contetInfo.user.id;
        ctrl.asset = {
            'requiredField': '',
        };
        ctrl.hideField = false;
        ctrl.keywordsText;
        ctrl.languageText = "English";
        ctrl.optional = true;
        ctrl.uploadingAsset = false;
        ctrl.assetId = undefined;
        ctrl.tabSelected = "my";
        ctrl.assetMeta = {
            'body': '',
            'name': '',
            'keywords': [],
            'creator': '',
            'status': 'Draft',
            'owner': EkstepEditorAPI._.isUndefined(window.contetInfo) ? 'amolg' : window.contetInfo.user.id,
            'code': "org.ekstep" + Math.random(),
            'mimeType': "",
            'mediaType': "",
            'contentType': "Asset",
            'osId': "org.ekstep.quiz.app",
            'copyright': "",
            'sources': "",
            'publisher': ""
        };

        ctrl.loadingAudio = true;
        ctrl.plugin = instance.mediaType;
        ctrl.upload = (instance.mediaType == 'image') ? true : false;
        ctrl.fileTypes = (instance.mediaType == "image") ? "jpeg, jpg, png, svg" : "mp3, mp4, mpeg, ogg, wav, webm";
        ctrl.fileSize = (instance.mediaType == "image") ? '1 MB' : '6 MB';

        if (instance.mediaType == 'image') {
            ctrl.allowedFileSize = (1 * 1024 * 1024);
            ctrl.allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
        } else if (instance.mediaType == 'audio') {
            ctrl.allowedFileSize = (6 * 1024 * 1024);
            ctrl.allowedMimeTypes = ['audio/mp3', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/webm', 'audio/x-wav', 'audio/wav'];
        }

        function imageAssetCb(err, res) {
            ctrl.loadingImage = false;

            if (res && res.data.result.content) {    
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
                ctrl.initPopup(res.data.result.content);
                EkstepEditorAPI._.forEach(res.data.result.content, function(obj, index) {
                    ctrl.audioList.push({ downloadUrl: trustResource(obj.downloadUrl), identifier: obj.identifier, name:obj.name, mimeType:obj.mimeType, license:obj.license });
                });
            } else {
                ctrl.audioList = [];
            };

            if (res.data.result.count == 0) {
            }

            EkstepEditorAPI.getAngularScope().safeApply();
        };

        function trustResource(src) {
            return $sce.trustAsResourceUrl(src);
        }

        //load image on opening window
        if (instance.mediaType == 'image') {
            instance.getAsset(undefined, instance.mediaType, ctrl.owner, imageAssetCb);
        } else {
            instance.getAsset(undefined, instance.mediaType, ctrl.owner, audioAssetCb);
        }

        ctrl.myAssetTab = function() {
            var callback,
                searchText = ctrl.query;
            ctrl.selectBtnDisable = false;
            ctrl.buttonToShow = 'select';
            ctrl.tabSelected = "my";
            ctrl.loadingImage = true;

            imageTabSelected = true;
            audioTabSelected = false;
            ctrl.selectBtnDisable = EkstepEditorAPI._.isUndefined(lastSelectedImage) ? true : false;
            ctrl.buttonToShow = 'select';

            (searchText === "") ? searchText = undefined: null;
            callback = (instance.mediaType === "image") ? imageAssetCb : callback;
            callback = (instance.mediaType === "audio") ? audioAssetCb : callback;
            callback && ctrl.toggleImageCheck() && ctrl.toggleAudioCheck()
            ctrl.selectBtnDisable = true;

            callback && instance.getAsset(searchText, instance.mediaType, ctrl.owner, callback);
        }

        ctrl.allAssetTab = function() {
            var callback,
                searchText = ctrl.query;
            ctrl.tabSelected = "all";
            ctrl.loadingImage = true;
            imageTabSelected = true;
            audioTabSelected = false;
            ctrl.selectBtnDisable = EkstepEditorAPI._.isUndefined(lastSelectedImage) ? true : false;
            ctrl.buttonToShow = 'select';

            (searchText === "") ? searchText = undefined: null;
            callback = (instance.mediaType === "image") ? imageAssetCb : callback;
            callback = (instance.mediaType === "audio") ? audioAssetCb : callback;
            callback && ctrl.toggleImageCheck() && ctrl.toggleAudioCheck()
            ctrl.selectBtnDisable = true;

            callback && instance.getAsset(searchText, instance.mediaType, undefined, callback);

        }

        ctrl.uploadClick = function() {
            setTimeout(function() {
                EkstepEditorAPI.jQuery('#uploadtab').trigger('click');
            }, 100);
        }

        ctrl.audioTab = function() {
            audioTabSelected = true;
            imageTabSelected = false;
            ctrl.selectBtnDisable = EkstepEditorAPI._.isUndefined(lastSelectedAudio) ? true : false;
            ctrl.buttonToShow = 'select';
        };

        ctrl.assetUpload = function() {
            ctrl.buttonToShow = 'upload';
            imageTabSelected = false;
            audioTabSelected = false;
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

            if (ctrl.tabSelected == "my") {
                callback && instance.getAsset(searchText, instance.mediaType, ctrl.owner, callback);
            } else {
                callback && instance.getAsset(searchText, instance.mediaType, undefined, callback);
            }

        }

        ctrl.cancel = function() {
            $scope.closeThisDialog();
        };

        ctrl.ImageSource = function(event, $index) {
            assetdata.asset = event.target.attributes.data_id.value;
            assetdata.assetMedia = {
                id: assetdata.asset,
                src: event.target.attributes.src.value,
                type: 'image'
            }
            ctrl.selectBtnDisable = false;
            ctrl.toggleImageCheck($index);
        };

        ctrl.toggleImageCheck = function($index) {
            if (!EkstepEditorAPI._.isUndefined(lastSelectedImage)) {
                ctrl.selected_images[lastSelectedImage].selected = false;
            }
            lastSelectedImage = $index;
            return true;
        }

        ctrl.AudioSource = function(audio, $index) {
            var audioElem;
            document.getElementById('audio-' + $index).play();
            audiodata.asset = audio.identifier;
            audiodata.assetMedia = {
                id: audiodata.asset,
                src: audio.downloadUrl.toString(),
                type: 'audio'
            }
            ctrl.selectBtnDisable = false;
            ctrl.toggleAudioCheck($index);
        };

        ctrl.toggleAudioCheck = function($index) {
            var audioElem;
            if (!EkstepEditorAPI._.isUndefined(lastSelectedAudio)) {
                ctrl.selected_audios[lastSelectedAudio].selected = false;
                audioElem = document.getElementById('audio-' + lastSelectedAudio);
                audioElem.pause();
                audioElem.currentTime = 0.0;
            }
            lastSelectedAudio = $index;
            return true;
        };

        ctrl.initPopup = function(item) {
            setTimeout(function(){
                EkstepEditorAPI.jQuery('.infopopover')
                  .popup({
                    inline: true,
                    position: 'bottom center',
                  })
                ;
            },100)
        };

        ctrl.convertToBytes = function(bytes) {
            if (EkstepEditorAPI._.isUndefined(bytes)) return " N/A";
            bytes = parseInt(bytes);
            var precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }

        ctrl.select = function() {
            if (assetdata && assetdata.asset && instance.mediaType == "image") {
                instance.cb(assetdata);
                ctrl.cancel();
            }

            if (audiodata && audiodata.asset && instance.mediaType == "audio") {
                console.log("audiodata")
                console.log(audiodata);
                EkstepEditorAPI.dispatchEvent("org.ekstep.stageconfig:addcomponent", { stageId: EkstepEditorAPI.getCurrentStage().id,type: 'audio', title: audiodata.asset });
                instance.cb(audiodata);
                ctrl.cancel();
            }
        }

        EkstepEditor.assessmentService.getLanguages(function(err, resp) {
            if (!err && resp.statusText == "OK") {
                var assetlanguages = {};
                EkstepEditorAPI._.forEach(resp.data.result.languages, function(lang) {
                    assetlanguages[lang.code] = lang.name;
                });
                ctrl.asset.language = EkstepEditorAPI._.values(assetlanguages);
                EkstepEditorAPI.getAngularScope().safeApply();
            }
        });

        ctrl.setPublic = function() {
            ctrl.assetMeta.license = "Creative Commons Attribution (CC BY)";
            ctrl.asset.requiredField = 'required';
            ctrl.hideField = false;
            ctrl.optional = false;
        }

        ctrl.viewMore = function() {
            EkstepEditorAPI.jQuery('.removeError').each(function() { EkstepEditorAPI.jQuery(this).removeClass('error') });
            ctrl.hideField = false;
        }

        ctrl.setPrivate = function() {
            delete ctrl.assetMeta.license;
            ctrl.asset.requiredField = '';
            ctrl.optional = true;
            ctrl.hideField = true;
        }

        ctrl.uploadAsset = function(event, fields) {
            var requestObj,
                content = ctrl.assetMeta,
                data = new FormData();

            ctrl.uploadingAsset = true;

            EkstepEditorAPI.getAngularScope().safeApply();


            if (ctrl.record == true) {           
                var dataurl = EkstepEditorAPI.jQuery('#recorded-audio-mainAudio').attr('src');
                var file = ctrl.urltoFile(dataurl,'audio.mp3');

                ctrl.assetMeta.mimeType = 'audio/mp3';
                ctrl.assetMeta.mediaType = instance.mediaType;
                data.append('file', file);
            }
            else {
                EkstepEditorAPI.jQuery.each(EkstepEditorAPI.jQuery('#assetfile')[0].files, function(i, file) {
                    data.append('file', file);
                    ctrl.assetMeta.mimeType = file.type;

                    // @Todo for audio
                    ctrl.assetMeta.mediaType = instance.mediaType;
                });
            }

            /** Convert language into array **/
            if ((!EkstepEditorAPI._.isUndefined(ctrl.languageText)) && (ctrl.languageText) != null) {
                content.language = [ctrl.languageText];
            } else {
                delete content.language;
            }

            /** Convert keywords in to array **/
            if ((!EkstepEditorAPI._.isUndefined(ctrl.keywordsText)) && (ctrl.keywordsText) != null) {
                content.keywords = ctrl.keywordsText.split(",");
            } else {
                delete content.keywords;
            }

            var requestObj = {};
            angular.forEach(content, function(value, key) {

                if ((EkstepEditorAPI._.isUndefined(value) || value == null || value == "") && key != 'body') {
                    delete content[key];
                }

            }, null);

            console.log(content);

            // Create the content for asset
            EkstepEditor.assetService.saveAsset(ctrl.assetId, content, function(err, resp) {
                if (resp) {
                    ctrl.uploadFile(resp, data);
                }
            });
        }


        ctrl.urltoFile = function(dataurl, filename){
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        }

        ctrl.uploadFile = function(resp, data) {
            EkstepEditorAPI.jQuery.ajax({
                // @Todo Use the correct URL
                url: EkstepEditor.config.baseURL + "/api/learning/v2/content/upload/" + resp.data.result.node_id,
                type: 'POST',
                contentType: false,
                data: data,
                cache: false,
                processData: false,
                beforeSend: function(request) {
                    request.setRequestHeader("user-id", "mahesh");
                },
                success: function(resp) {
                    console.log('response');
                    console.log(resp);
                    assetdata.asset = resp.result.node_id;
                    assetdata.assetMedia = resp;
                    assetdata.assetMedia.id = resp.result.node_id;
                    assetdata.assetMedia.src = resp.result.content_url;
                    assetdata.assetMedia.type = instance.mediaType;

                    console.log("Passing data");
                    console.log(assetdata.assetMedia);

                    instance.cb(assetdata);
                    ctrl.uploadingAsset = false;
                    alert((instance.mediaType).charAt(0).toUpperCase() + (instance.mediaType).slice(1) + ' successfully uploaded');
                    ctrl.cancel();
                },
                complete: function() {
                    ctrl.uploadingAsset = false;
                },
                error: function() {
                    alert('Error in Uploading image, please try again!');
                }
            });
        }

        ctrl.doUpload = function(mediaType) {
            EkstepEditorAPI.jQuery('.ui.form')
                .form({
                    inline: true,
                    fields: {
                        assetfile: {
                            identifier: 'assetfile',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please select file'
                            }]
                        },
                        ccByContribution: {
                            identifier: 'ccByContribution',
                            rules: [{
                                type: 'checked',
                                prompt: 'Please select Copyright & License'
                            }]
                        },
                        assetName: {    
                            identifier: 'assetName',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter asset caption'
                            }]
                        },

                        keywords: {
                            identifier: 'keywords',
                            optional: true,
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter enter tags'
                            }]
                        },

                        language: {
                            identifier: 'language',
                            optional: true,
                            rules: [{
                                type: 'empty',
                            }]
                        },

                        creator: {
                            identifier: 'creator',
                            optional: ctrl.optional,
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter creator name'
                            }]
                        },

                        copyright: {
                            identifier: 'copyright',
                            optional: ctrl.optional,
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter copyright details'
                            }]
                        },
                    },
                    onSuccess: function(event, fields) {
                        if (ctrl.record == true)
                        {
                            // @Todo file size validation for recorded file
                            ctrl.uploadAsset(event, fields);    
                        }
                        else
                        {
                            // Validate file if not editing meta data
                            var validateFile = instance.fileValidation('assetfile', ctrl.allowedFileSize, ctrl.allowedMimeTypes);

                            if (validateFile) {
                                ctrl.uploadAsset(event, fields);
                            } else {
                                return false;
                            }
                        }
                    },
                    onFailure: function(formErrors, fields) {
                        console.log("fields validation failed");
                        return false;
                    }
                });
        }

        ctrl.switchToUpload = function(){
            ctrl.uploadView = true;
        }

        setTimeout(function() {
            EkstepEditorAPI.jQuery('.assetbrowser .menu .item').tab();
            EkstepEditorAPI.jQuery('.assetbrowser .ui.dropdown').dropdown();
            EkstepEditorAPI.jQuery('.assetbrowser .ui.radio.checkbox').checkbox();
        }, 100);

    }]);