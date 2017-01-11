EkstepEditor.basePlugin.extend({
    type: "ak_editor",
    initialize: function() {
        EkstepEditorAPI.addEventListener("org.ekstep.akshara-editor:showpopup", this.loadHtml, this);
        setTimeout(function() {
            var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.akshara-editor-1.0/editor/aksharaEditorConfig.html';
            var controllerPath = EkstepEditor.config.pluginRepo + '/org.ekstep.akshara-editor-1.0/editor/aksharaeditorapp.js';
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);
    },
    newInstance: function() {
        delete this.configManifest;
        var props = this.convertToFabric(this.attributes.attr.__cdata);
        var att= JSON.parse(props);
        this.updateAttributes(att);
        if(this.attributes.frontFaceColor)
            att.frontFaceColor= this.attributes.frontFaceColor;
        var rows = att.rows;
        var columns = att.columns;
        var padding = 5;
        var gridWidth = (500 - (padding * (columns - 1))) / columns;
        var gridHeight = (300 - (padding * (rows - 1))) / rows;
        var rects = [];
        this.addAllMedia();
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {
                var left = x * (gridWidth + padding) + 110;
                var top = y * (gridHeight + padding) + 52.5;
                var rect = new fabric.Rect({
                    id: UUID(),
                    left: left,
                    top: top,
                    fill: att.frontFaceColor,
                    width: gridWidth,
                    height: gridHeight
                });
                rects.push(rect);            }
        }

        this.editorObj = new fabric.Group(rects);
        currentInstance = this;
    },

    updateAttributes: function(att){     
        this.attributes.x= att.x;
        this.attributes.y= att.y;
        this.attributes.w= att.w;
        this.attributes.h= att.h;
        if(EkstepEditorAPI._.isUndefined(this.attributes.frontFaceColor))
            this.attributes.frontFaceColor= att.frontFaceColor;
        if(EkstepEditorAPI._.isUndefined(this.attributes.backFaceColor))
            this.attributes.backFaceColor= att.backFaceColor;
        if(EkstepEditorAPI._.isUndefined(this.attributes.textColor))
            this.attributes.textColor= att.textColor;
        if(EkstepEditorAPI._.isUndefined(this.attributes.fixRows))
            this.attributes.fixRows= att.fixRows;

    },

    
    /*########## Method to add all default media and medias related to each word ######*/
    addAllMedia: function(){
        var data= this.config;
        var defaultMediaAssests = [{
                id: "goodjob_image",
                src: "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/content/do_10097663/artifact/goodjob_1483016659770.png",
                assetId: "goodjob_image",
                type: "image",
                preload: true
            },{
                id: "submit_image",
                src: "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/content/do_10097796/artifact/submit_1483351199308.png",
                assetId: "submit_image",
                type: "image",
                preload: true
            },
            {
                id: "submit_disabled_image",
                src: "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/content/do_10097800/artifact/submit_disabled_1483351751249.png",
                assetId: "submit_disabled_image",
                type: "image",
                preload: true
            },
            {
                id: "icon_sound_image",
                src: "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/content/do_10097802/artifact/icon_sound_1483351957879.png",
                assetId: "icon_sound_image",
                type: "image",
                preload: true
            },
            {
               id: "tiles",
               src: EkstepEditor.config.absURL +"/plugins/org.ekstep.akshara-editor-1.0/renderer/TilesPlugin.js",
               assetId: "tiles",
               type: "plugin",
               preload: true
           },
           {
               id: "tile",
               src: EkstepEditor.config.absURL +"/plugins/org.ekstep.akshara-editor-1.0/renderer/TilePlugin.js",
               assetId: "tile",
               type: "plugin",
               preload: true
           },
           {
               id: "cmtf",
               src: EkstepEditor.config.absURL +"/plugins/org.ekstep.akshara-editor-1.0/renderer/customMtfPlugin.js",
               assetId: "cmtf",
               type: "plugin",
               preload: true
           },
           {
               id: "coptions",
               src: EkstepEditor.config.absURL +"/plugins/org.ekstep.akshara-editor-1.0/renderer/customOptionsPlugin.js",
               assetId: "coptions",
               type: "plugin",
               preload: true
           },
           {
               id: "coption",
               src: EkstepEditor.config.absURL +"/plugins/org.ekstep.akshara-editor-1.0/renderer/customOptionPlugin.js",
               assetId: "coption",
               type: "plugin",
               preload: true
           },
           {
               id: "audiManager",
               src: EkstepEditor.config.absURL +"/plugins/org.ekstep.akshara-editor-1.0/renderer/audiManager.js",
               assetId: "audiManager",
               type: "js",
               preload: true
           }

        ];
        EkstepEditorAPI._.each(data.aksharas, function(obj) {
            var akMedia= {
                id: obj.audioAsset,
                src: obj.audioSrc,
                assetId: obj.audioAsset,
                type: "sound",
                preload: true
            }
            defaultMediaAssests.push(akMedia);
            EkstepEditorAPI._.each(data.words[obj.text].one, function(o) {
                var wimgMedia= {
                    id: o.imageAsset,
                    src: o.imageSrc,
                    assetId: o.imageAsset,
                    type: "image",
                    preload: true
                }
                defaultMediaAssests.push(wimgMedia);
                var waudMedia= {
                    id: o.audioAsset,
                    assetId: o.audioAsset,
                    src: o.audioSrc,
                    type: "sound",
                    preload: true
                }
                defaultMediaAssests.push(waudMedia);
            });
            EkstepEditorAPI._.each(data.words[obj.text].two, function(o) {
                var wimgMedia= {
                    id: o.imageAsset,
                    src: o.imageSrc,
                    assetId: o.imageAsset,
                    type: "image",
                    preload: true
                }
                defaultMediaAssests.push(wimgMedia);
                var waudMedia= {
                    id: o.audioAsset,
                    src: o.audioSrc,
                    assetId: o.audioAsset,
                    type: "sound",
                    preload: true
                }
                defaultMediaAssests.push(waudMedia);
            });
        });


        var ins = this;
        EkstepEditorAPI._.forEach(defaultMediaAssests, function(defaultMedia) {
            ins.addMedia(defaultMedia);
        });


          
    },

    /*########## Method to open the modal ######*/
    loadHtml: function(parentInstance, attrs) {
        var instance = this;
        EkstepEditorAPI.getService('popup').open({
            template: 'akshara-editor',
            controller: 'aksharaEditorController',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return instance;
                },
                'attrs': function() {
                    return attrs;
                }
            },
            width: 900,
            showClose: false,
        });


    },

    /*########## Calling Api to get languages ######*/
    getLanguages: function(searchText, cb) {
        var instance = this,
            iservice = new EkstepEditor.iService(),
            requestObj,
            requestHeaders;

        requestHeaders = {
            "headers": {
                "content-type": "application/json",
                "user-id" : "rayuluv"
            }
        };
        iservice.http.get(EkstepEditor.config.baseURL + '/api/learning/v1/language', requestHeaders, cb);

    },

    /*########## Calling Api to get akshara ######*/
    getAksharas: function(searchText, cb) {
        var instance = this,
            iservice = new EkstepEditor.iService(),
            requestObj,
            requestHeaders;
        data = searchText;

        requestHeaders = {
            "headers": {
                "content-type": "application/json"
            }
        };
        iservice.http.get(EkstepEditor.config.baseURL + '/api/language/v1/language/dictionary/varna/Vowel/list/' + data, requestHeaders, function(err,res){
            var resp1 = res;
            iservice.http.get(EkstepEditor.config.baseURL + '/api/language/v1/language/dictionary/varna/Consonant/list/' + data, requestHeaders, function(err,res){
                cb(err, res, resp1);
            });
        });

    },

    /*########## Calling Api to get words ######*/
    getWordAsset: function(searchText,varna, cb) {
        var instance = this,
            iservice = new EkstepEditor.iService(),
            requestObj,
            requestHeaders;

        requestObj = {
            "request": {
                "filters": {
                    "objectType": ["Word"],
                    "status": ["Live"],
                    "graph_id": ['hi'],
                    "pos": [],
                    "grade": []
                },
                "exists":["pictures", "pronunciations"]
            }
        }

        requestHeaders = {
            "headers": {
                 'Content-Type': 'application/json',
                 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI5OGNlN2RmNmNkOTk0YWQ5YjZlYTRjNDJlNmVjYjY5MCJ9.rtr4188EwDYZywtP7S9uuv1LsivoucFxOvJFDCWvq0Y'
            }
        };

        EkstepEditorAPI._.isUndefined(searchText) ? null : requestObj.request.filters = searchText;

        iservice.http.post(EkstepEditor.config.baseURL + '/api/language/v2/language/search', requestObj, requestHeaders, function(err,res){
            //cb(err,res,varna);
                var startRes = res;
                requestObj.request.filters.lemma.value = requestObj.request.filters.lemma.startsWith;
                delete requestObj.request.filters.lemma.startsWith;
                iservice.http.post(EkstepEditor.config.baseURL + '/api/language/v2/language/search', requestObj, requestHeaders, function(err,res){
                  // var conRes = res;
                    var conRes = {};
                    cb(err,startRes,conRes,varna);
                });
        });

    },

    openHtextPopup: function(err, data, instance) {
        EkstepEditorAPI.getService('popup').open({ template: data, data: { instance: instance } }, this.controllerCallback);

    },
    controllerCallback: function(ctrl, scope, data) {
    },


    /*########## Method to update respective object when we change configurations ######*/
    onConfigChange: function(key, value) {
        var instance = this;
        switch (key) {
            case 'frontFaceColor':
                this.editorObj.setFill(value);
                this.attributes.frontFaceColor = value;
                EkstepEditorAPI._.forEach(this.editorObj._objects, function(obj) {
                    obj.setFill(value)
                })
                break;
            case 'backFaceColor':
                this.attributes.backFaceColor = value;
                break;
            case 'textColor':
                this.attributes.textColor = value;
                break;
            case 'fixRows':
                this.attributes.fixRows = value;
                break;
        }
        
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },

    /*########## Method to get the configurations ######*/
    getConfig: function() {
        var config = {};
        if(!EkstepEditorAPI._.isUndefined(this.config)){
            config = this.config;
        }
           config.frontFaceColor = this.attributes.frontFaceColor;
           config.backFaceColor= this.attributes.backFaceColor;
           config.textColor= this.attributes.textColor;
           config.fixRows= this.attributes.fixRows;
        return config;
    },
  
});
//# sourceURL=aksharaplugin.js
