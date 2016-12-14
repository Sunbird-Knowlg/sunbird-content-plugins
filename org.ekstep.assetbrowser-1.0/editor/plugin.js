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

        // $('.ui.dropdown').dropdown();
        // $('.menu .item').tab();
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
                    "name": [],
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
        _.isUndefined (owner) ? null : requestObj.request.filters.owner = owner;
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
    *   File size and mime type validation
    *   @param id {fieldId} Id of the field
    *   @memberof assetBrowser
    */
    fileValidation: function(fieldId, allowedFileSize, allowedMimeTypes) {
        var instance = this;

        /*Check for browser support for all File API*/
        if (window.File && window.FileList && window.Blob) {
            /*Get file size and file type*/
            var fsize = $('#' + fieldId)[0].files[0].size;
            var ftype = $('#' + fieldId)[0].files[0].type;

            /*Check file size*/
            if (fsize > allowedFileSize) {
                alert('File size is higher than the allowed size!');
                return false;
            }

            /*Check mime type*/
            if (ftype){
                if ($.inArray(ftype, allowedMimeTypes) == -1) {
                    alert("File type is not allowed!");
                    return false;
                }
            }
            /*If no file type is detected, return true*/
            else{
                return true;
            }

            return true;
        }
        /*If no browser suppoer for File apis, return true*/
        else{
            return true;
        }
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
			assetId,
            imagedata = {},
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
        ctrl.uploadTabEnabled = false;
        ctrl.loadingImage = true;
        ctrl.languagecode = 'en';
        ctrl.owner = undefined;
        ctrl.asset = {
            'requiredField':'',
        };
        ctrl.hideField = false;
        ctrl.keywordsText;
        ctrl.languageText = "English";
        ctrl.optional = true;
        ctrl.uploadingAsset = false;
        ctrl.assetMeta = {
			'body': '',
            'name': '',
            'keywords': [],
            'creator': '',
            'status': 'Draft',
            'owner': 'Ekstep',
            'code': "org.ekstep"+ Math.random(),
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
        ctrl.upload =  (instance.mediaType == 'image') ? true: false;
        ctrl.fileTypes = (instance.mediaType == "image") ? "jpeg, jpg, png, svg" : "mp3, mp4, mpeg, ogg, wav, webm";
        ctrl.fileSize = (instance.mediaType == "image") ? '1 MB' : '6 MB';

        if (instance.mediaType == 'image') {
            ctrl.allowedFileSize = (1 * 1024 * 1024);
            ctrl.allowedMimeTypes = ['image/jpeg','image/jpg','image/png','image/svg+xml'];
        }
        else if (instance.mediaType == 'audio') {
            ctrl.allowedFileSize = (6 * 1024 * 1024);
            ctrl.allowedMimeTypes = ['audio/mp3','audio/mp4','audio/mpeg','audio/ogg','audio/webm','audio/x-wav','audio/wav'];
        }

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
        if (instance.mediaType == 'image') {
            instance.getAsset(undefined, instance.mediaType, undefined, imageAssetCb);
        }
        else{
            instance.getAsset(undefined, instance.mediaType, undefined, audioAssetCb);   
        }

        ctrl.imageTab = function() {
            imageTabSelected = true;
            audioTabSelected = false;
            ctrl.selectBtnDisable = _.isUndefined(lastSelectedImage) ? true : false;
            ctrl.uploadTabEnabled = false;
            // $('.menu .item').tab();
        }

        ctrl.audioTab = function() {
            audioTabSelected = true;
            imageTabSelected = false;
            ctrl.selectBtnDisable = _.isUndefined(lastSelectedAudio) ? true : false;
            //instance.getAsset(undefined, "audio", undefined, audioAssetCb);
            ctrl.uploadTabEnabled = false;
            // $('.menu .item').tab();
        };

        ctrl.assetUpload = function() {
            ctrl.uploadTabEnabled = true;
            imageTabSelected = false;
            audioTabSelected = false;
            // $('.menu .item').tab();
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

            callback && instance.getAsset(searchText, instance.mediaType, ctrl.owner, callback);
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

        EkstepEditor.assessmentService.getLanguages(function(err, resp) {
            if (!err && resp.statusText == "OK") {
                var assetlanguages = {};
                _.forEach(resp.data.result.languages, function(lang) {
                    assetlanguages[lang.code] = lang.name;
                });
                ctrl.asset.language = _.values(assetlanguages);
                EkstepEditorAPI.getAngularScope().safeApply();
            }
        });

        ctrl.setPublic = function(){
            ctrl.assetMeta.license ="Creative Commons Attribution (CC BY)";
            ctrl.asset.requiredField = 'required';
            ctrl.hideField = false;
            ctrl.optional = false;
        }

        ctrl.viewMore = function(){
            $('.removeError').each(function(){ $(this).removeClass('error')});
            ctrl.hideField = false;
        }

        ctrl.setPrivate = function(){
            delete ctrl.assetMeta.license;
            ctrl.asset.requiredField = '';
            ctrl.optional = true;
            ctrl.hideField = true;
        }

        ctrl.uploadAsset = function(event, fields){
            var requestObj,
                content = ctrl.assetMeta,
                data = new FormData();
            
            ctrl.uploadingAsset = true;

            EkstepEditorAPI.getAngularScope().safeApply();

            $.each($('#assetfile')[0].files, function(i, file) {
                data.append('file', file);
                ctrl.assetMeta.mimeType = file.type;

                // @Todo for audio
                ctrl.assetMeta.mediaType = instance.mediaType;
            });

            /** Convert language into array **/
            if ((!_.isUndefined(ctrl.languageText)) && (ctrl.languageText) != null) {
                content.language = [ctrl.languageText];
            }
            else {
                delete content.language;
            }

            /** Convert keywords in to array **/
            if ((!_.isUndefined(ctrl.keywordsText)) && (ctrl.keywordsText) != null) {
                content.keywords = ctrl.keywordsText.split(",");
            }
            else {
                delete content.keywords;
            }

            console.log(content);
            // Create the content for asset
            EkstepEditor.assetService.saveAsset(assetId, content, function(err, resp) {
                if (resp) {
                    $.ajax({
                        url:"https://dev.ekstep.in/api/learning/v2/content/upload/" + resp.data.result.node_id,
                        type: 'POST',
                        contentType:false,
                        data: data,
                        cache: false,
                        processData: false,
                        beforeSend : function(request) {
                            request.setRequestHeader("user-id", "mahesh");
                        },
                        success: function (resp) {
                            console.log('response');
                            console.log(resp);
                            imagedata.asset = resp.result.node_id;
                            imagedata.assetMedia = resp;
                            imagedata.assetMedia.id = resp.result.node_id;
                            imagedata.assetMedia.src = resp.result.content_url;
                            imagedata.assetMedia.type = instance.mediaType;
                            
                            console.log("Passing data");
                            console.log(imagedata.assetMedia);

                            instance.cb(imagedata);
                            alert((instance.mediaType).charAt(0).toUpperCase() + (instance.mediaType).slice(1) + ' successfully uploaded');
                            ctrl.cancel();
                        },
                        complete:function()
                        {
                            ctrl.uploadingAsset = false;
                        },
                        error:function()
                        {
                            alert('Error in Uploading image, please try again!');
                        }
                    });
                }
            });
        }

		ctrl.doUpload = function(mediaType) {
            $('.ui.form')
              .form({
                inline : true,
                fields: {
                  assetfile: {
                    identifier  : 'assetfile',
                    rules: [
                      {
                        type   : 'empty',
                        prompt: 'Please select file'
                      }
                    ]
                  },
                  ccByContribution: {
                    identifier : 'ccByContribution',
                    rules: [
                        {
                            type : 'checked',
                            prompt: 'Please select Copyright & License'
                        }
                    ]
                  },
                  assetName : {
                    identifier : 'assetName',
                    rules : [
                        {
                            type : 'empty',
                            prompt: 'Please enter asset caption'
                        }
                    ]
                  },

                  keywords : {
                    identifier : 'keywords',
                    optional : true,
                    rules : [
                        {
                            type : 'empty',
                            prompt: 'Please enter enter tags'
                        }
                    ]
                  },

                  language : {
                    identifier : 'language',
                    optional:true,
                    rules : [
                        {
                            type : 'empty',
                        }
                    ]
                  },

                  creator : {
                    identifier : 'creator',
                    optional: ctrl.optional,
                    rules : [
                        {
                            type : 'empty',
                            prompt: 'Please enter creator name'
                        }
                    ]
                  },

                  copyright : {
                    identifier : 'copyright',
                    optional: ctrl.optional,
                    rules : [
                        {
                            type : 'empty',
                            prompt: 'Please enter copyright details'
                        }
                    ]
                  },
                },
                onSuccess: function (event, fields){
                    // validate file
                    var validateFile = instance.fileValidation('assetfile', ctrl.allowedFileSize, ctrl.allowedMimeTypes);
                    
                    if (validateFile) {
                         ctrl.uploadAsset(event, fields);
                    }
                    else {
                        return false;
                    }
                },
                onFailure: function (formErrors, fields){
                    console.log("fields validation failed");
                    return false;
                }
              });
		}

        setTimeout(function(){
            $('.menu .item').tab();
            $('.ui.dropdown').dropdown();
            $('.ui.radio.checkbox').checkbox();

            /** Asset Owner filter: Show my or all assets **/
            $('.ui.myAssets.checkbox')
              .checkbox()
              .first().checkbox({
                onChecked: function() {
                  // @Todo Replace it with user id
                  ctrl.owner = "Ekstep";
                  ctrl.search();
                },
                onUnchecked: function() {
                  ctrl.owner = undefined;
                  ctrl.search();
                }
              })
            ;
        }, 100); 
    }
});
//# sourceURL=assetbrowserplugin.js