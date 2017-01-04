EkstepEditor.basePlugin.extend({
    type: "ak_editor",
    /**
     * @member currentInstance
     * @memberof Htext
     */
    currentInstance: undefined,
    initialize: function() {
        setTimeout(function() {
            var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.akshara-editor-1.0/editor/aksharaEditorConfig.html';
            var controllerPath = EkstepEditor.config.pluginRepo + '/org.ekstep.akshara-editor-1.0/editor/aksharaeditorapp.js';
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);
    },
    newInstance: function() {
        delete this.configManifest;
      
        var props = this.convertToFabric(this.attributes);
        var rows = props.rows;
        var columns = props.columns;
        var padding = 5;
        var gridWidth = (500 - (padding * (columns - 1))) / columns;
        var gridHeight = (300 - (padding * (rows - 1))) / rows;
        var rects = [];
        this.addDefaultMedia();
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {
                var left = x * (gridWidth + padding) + 110;
                var top = y * (gridHeight + padding) + 52.5;
                var rect = new fabric.Rect({
                    id: UUID(),
                    left: left,
                    top: top,
                    fill: "#fff",
                    width: gridWidth,
                    height: gridHeight
                });
                rects.push(rect);
            }
        }

        this.editorObj = new fabric.Group(rects);
        console.log(this.editorObj);
        currentInstance = this;
        this.loadHtml(this);
    },

    addObjectsToFabrics: function(){
        var instance = this;
        console.log("inside add to fabric");
        if(!_.isUndefined(this.editorObj) && this.editorObj._objects){     
            EkstepEditorAPI._.forEachRight(this.editorObj._objects, function(obj, index) {
                instance.editorObj.remove(obj)
            })
        }
            console.log("New fabric group created:" ,this.attributes);
            //this.editorObj = new fabric.Group();
            var props = this.convertToFabric(this.attributes);
            var rows = props.rows;
            var columns = props.columns;
            var padding = 5;
            var gridWidth = (500 - (padding * (columns - 1))) / columns;
            var gridHeight = (300 - (padding * (rows - 1))) / rows;
            var rects = [];
             for (var y = 0; y < rows; y++) {
                for (var x = 0; x < columns; x++) {
                    var left = x * (gridWidth + padding) + 110;
                    var top = y * (gridHeight + padding) + 52.5;
                    var rect = new fabric.Rect({
                        id: UUID(),
                        left: left,
                        top: top,
                        fill: props.fill,
                        width: gridWidth,
                        height: gridHeight
                    });
                    rects.push(rect);
                }
            }
            this.editorObj.initialize(rects);
            EkstepEditorAPI.render();
        console.log("New fabric group initialization:", this.editorObj);

    },



  /**
     * This method overridden from Ekstepeditor.basePlugin and here we double click event is added
     * @memberof Htext
     */
    selected: function(instance) {
        fabric.util.addListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method overridden from Ekstepeditor.basePlugin and here we double click event is removed
     * @memberof Htext
     */
    deselected: function(instance, options, event) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    /**
     * This method is called when the object:unselected event is fired
     * It will remove the double click event for the canvas
     * @memberof Htext
     */
    objectUnselected: function(event, data) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.loadHtml);
    },
    /**
     * This method is callback for double click event which will call the textEditor to show the ediotor to add or modify text.
     * @param event {Object} event
     * @memberof Htext
     */
    dblClickHandler: function(event) {
        var leftSt = EkstepEditorAPI.jQuery("#canvas").offset().left + EkstepEditorAPI.getCurrentObject().editorObj.left;
        var leftEnd = leftSt + EkstepEditorAPI.getCurrentObject().editorObj.width;
        var topSt = EkstepEditorAPI.jQuery("#canvas").offset().top + EkstepEditorAPI.getCurrentObject().editorObj.top;
        var topEnd = topSt + EkstepEditorAPI.getCurrentObject().editorObj.height;
        if (event.clientX > leftSt && event.clientX < leftEnd && event.clientY > topSt && event.clientY < topEnd) {
            currentInstance.loadHtml();
        }
    },





    /*########## Method to all default media which is required in akshara teaching template ######*/
    addDefaultMedia: function(){
            this.addMedia({
                id: "goodjob_image",
                src: "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/content/do_10097663/artifact/goodjob_1483016659770.png",
                assetId: "goodjob_image",
                type: "image",
                preload: true
            });
            this.addMedia({
                id: "submit_image",
                src: "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/content/do_10097796/artifact/submit_1483351199308.png",
                assetId: "submit_image",
                type: "image",
                preload: true
            });
            this.addMedia({
                id: "submit_disabled_image",
                src: "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/content/do_10097800/artifact/submit_disabled_1483351751249.png",
                assetId: "submit_disabled_image",
                type: "image",
                preload: true
            });
            this.addMedia({
                id: "icon_sound_image",
                src: "https://ekstep-public.s3-ap-southeast-1.amazonaws.com/content/do_10097802/artifact/icon_sound_1483351957879.png",
                assetId: "icon_sound_image",
                type: "image",
                preload: true
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

        _.isUndefined(searchText) ? null : requestObj.request.filters = searchText;

        iservice.http.post(EkstepEditor.config.baseURL + '/api/language/v2/language/search', requestObj, requestHeaders, function(err,res){
                cb(err,res,varna);
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
        if (key === 'rows' || key === 'columns') {
            EkstepEditorAPI._.forEachRight(this.editorObj._objects, function(obj, index) {
                instance.editorObj.remove(obj)
            })
            var padding = 5;
            var gridWidth = (500 - (padding * (instance.attributes.columns - 1))) / instance.attributes.columns;
            var gridHeight = (300 - (padding * (instance.attributes.rows - 1))) / instance.attributes.rows;
            var rects = [];
            for (var y = 0; y < instance.attributes.rows; y++) {
                for (var x = 0; x < instance.attributes.columns; x++) {
                    rects.push(new fabric.Rect({
                        left: x * (gridWidth + padding) + 110,
                        top: y * (gridHeight + padding) + 52.5,
                        fill: instance.attributes.fill,
                        width: gridWidth,
                        height: gridHeight
                    }));
                }
            }
            this.editorObj.initialize(rects);
        }
        EkstepEditorAPI.render();
    },

    /*########## Method to get the configurations ######*/
    getConfig: function() {
        var config = {};
        if(this.selectedProperty){
        config = this.selectedProperty;
        }
           config.frontFaceColor = this.attributes.frontFaceColor;
           config.backFaceColor= this.attributes.backFaceColor;
           config.textColor= this.attributes.textColor;
           config.fixRows= this.attributes.fixRows;
        return config;
    },
  
});
//# sourceURL=aksharaplugin.js
