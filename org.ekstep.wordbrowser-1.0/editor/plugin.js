/**
 * 
 * plugin to get asset (image/audio) from learning platform
 * @class wordBrowser
 * @extends EkstepEditor.basePlugin
 * @author Swati
 * @fires stagedecorator:addcomponent 
 * @listens org.ekstep.wordbrowser:show
 */

EkstepEditor.basePlugin.extend({
    type: 'wordbrowser',
    initData: undefined,
    /**
    *   registers events
    *   @memberof assetBrowser
    *
    */    
    initialize: function() {
        console.log("initialized word browser")
        EkstepEditorAPI.addEventListener(this.manifest.id + ":show", this.initPreview, this);
    },
     cb: function(){},
    /**        
    *   load html template to show the popup
    *   @param event {Object} event
    *   @param cb {Function} callback to be fired when asset is available.
    *   @memberof assetBrowser
    */
    initPreview: function(event, data) {
        console.log("initpriview : word browser");
        var instance = this;
        this.cb = data.callback;
        this.mediaType = data.type;
        this.search_filter = data.search_filter;
        this.loadResource('editor/wordBrowser.html', 'html', function(err, response) {
            instance.showAssetBrowser(err, response);
        });
    },
    
    /**
    *   registers events
    *   @memberof assetBrowser
    *
    */    
    getAsset: function(searchText, cb) {
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
                }
            }
        }

         requestHeaders = {
        "headers": {
            "content-type": "application/json",
            "user-id": "ilimi"
        }
    };

       // _.isUndefined(searchText) ? null : requestObj.request.filters.name = [searchText];

        iservice.http.post(EkstepEditor.config.baseURL + '/api/search/v2/search', requestObj, requestHeaders, cb);

    },
     showAssetBrowser: function(err, data) {
         EkstepEditorAPI.getService('popup').open({ template: data, data: { instance: this } }, this.browserController);
    },
    browserController: function(ctrl, $injector, resolvedData) {
        var audiodata = {},
            imagedata = { "x": 20, "y": 20, "w": 50, "h": 50 },
            searchText,
            instance = resolvedData.instance;
            ctrl.grades = [];
            ctrl.types = ['Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection'];
            ctrl.attributes = [{ value: 'pictures', name: 'Image' },
                { value: 'primaryMeaningId', name: 'Meaning' },
                { value: 'pronunciations', name: 'Pronunciation' },
                { value: 'pos', name: 'POS' },
                { value: 'exampleSentences', name: 'Example Sentences' },
                { value: 'hasSynonyms', name: 'Synonyms' },
                { value: 'hasAntonyms', name: 'Antonyms' }
                ];
            //mainScope = EkstepEditorAPI.getAngularScope();
        ctrl.selectedWords = [];
        ctrl.isSelected = [];
        ctrl.selectBtnDisable = true;
   


        function wordAssetCb(err, res) {
            if (res && res.data.result.words) {
                ctrl.loadingImage = false;
                ctrl.words = [];
                ctrl.words = res.data.result.words;
                console.log("===============words================");
                console.log(ctrl.words);


            } else {
                ctrl.words = [];
            };

            EkstepEditorAPI.getAngularScope().safeApply();
        };

      

        function trustResource(src) {
            return $sce.trustAsResourceUrl(src);
        }

        //load words on opening window
        instance.getAsset(undefined, wordAssetCb);

      

        ctrl.searchKeyPress = function() {
            // function for searching words with given fillters
        }

        ctrl.cancel = function() {
           EkstepEditorAPI.jQuery('.ui.modal').modal('hide');
        };



 ctrl.toggleSelection = function(identifier, word) {
    console.log(word);
        if (ctrl.isSelected[identifier] == 'word-selected') {
            ctrl.isSelected[identifier] =  "";
            ctrl.selectedWords.splice(word,1);
        } else{
            ctrl.isSelected[identifier] = 'word-selected';
            ctrl.selectedWords.push(word);
        }
        console.log(identifier);
        console.log(ctrl.selectedWords);


    };





        ctrl.select = function() {
           // code to get selected words
            instance.cb(ctrl.selectedWords);
             ctrl.cancel();
        }
    }
   
});
//# sourceURL=assetbrowserplugin.js
