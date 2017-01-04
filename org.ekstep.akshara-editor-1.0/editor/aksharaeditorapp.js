'use strict';

angular.module('aksharaEditorapp', [])
    .controller('aksharaEditorController', ['$scope', '$injector', 'instance', 'attrs', function($scope, $injector, instance, attrs) {

        ctrl = this;
        ctrl.isAksharaBrowser = true;
        ctrl.isWordBrowser = false;
        ctrl.isGameLevel = false;
        ctrl.language = [];
        ctrl.selectedWords = [];
        ctrl.selectedAksharas = [];
        ctrl.isSelected = [];
        ctrl.selectBtnDisable = true;
        ctrl.selectedProperty = {};
        ctrl.lessWordSelected = false;
        ctrl.selectedGameLevels = [];
        ctrl.noOfRepetition = 1;

        ctrl.levelMetaData = [{
            "selected": false,
            "level": "Level1",
            "tiles": {
                "one": ["audio", "text"],
                "two": ["text", "image", "audio"]
            }
        }, {
            "selected": false,
            "level": "Level2",
            "tiles": {
                "one": ["audio", "text"],
                "two": ["audio", "text"]
            }
        }, {
            "selected": false,
            "level": "Level3",
            "tiles": {
                "one": ["text", "audio"],
                "two": ["text"]
            }
        }, {
            "selected": false,
            "level": "Level4",
            "tiles": {
                "one": ["text"],
                "two": ["audio"]
            }
        }]


        /*########## Language Callback method which will be called after language api call ######*/
        function languageCb(err, res) {
            ctrl.language = res.data.result.languages;
        }

        instance.getLanguages(undefined, languageCb); //Call Method to get Languages


        /*########## Aksharas Callback method which will be called after Akshara api call ######*/
        function aksharaCb(err, cons, vow) {
            if (vow && vow.data.result.result) {
                ctrl.loadingImage = false;
                ctrl.aksharas = [];
                ctrl.aksharas = vow.data.result.result;
                if (cons && cons.data.result.result) {
                    for (var i = 0; i < cons.data.result.result.length; i++) {
                        ctrl.aksharas.push(cons.data.result.result[i]);
                    }
                }
            } else {
                ctrl.aksharas = [];
            };
            EkstepEditorAPI.getAngularScope().safeApply();
        };

        /*########## Update words array by adding akashara to each object ######*/
        ctrl.updateWords = function(words, ak) {
            for (var i = 0; i < words.length; i++) {
                words[i].akshara = ak;
                ctrl.words.push(words[i]);
            }
        }

        /*########## Word Callback method which will be called after Words api call ######*/
        function wordAssetCb(err, res, varna) {
            ctrl.isAksharaBrowser = false;
            ctrl.isWordBrowser = true;
            ctrl.isGameLevel = false;

            var words = [];
            if (res && res.data.result.words) {
                ctrl.loadingImage = false;

                words = res.data.result.words;
            } else {
                words = [];
            };
            if (words.length)
                ctrl.updateWords(words, varna);
            else {
                ctrl.selectedAksharas = _.reject(ctrl.selectedAksharas, function(o) {
                    return o.varna == varna;
                });
                ctrl.updateSelectedAksharas();
            }
            var obj = {};
            ctrl.aksharaWords.words.push(obj);
            EkstepEditorAPI.getAngularScope().safeApply();
        };

        /*########## Method to prepare proper query object and making Words api call ######*/
        ctrl.getWords = function() {
            ctrl.aksharaWords = {};
            ctrl.aksharaWords.words = [];
            ctrl.words = [];
            ctrl.akSelected;
            ctrl.updateSelectedAksharas();
            ctrl.selectedProperty.repetition = ctrl.noOfRepetition;
            _.each(ctrl.selectedAksharas, function(obj) {
                var serachText = {};
                serachText.language_id = [ctrl.languageSelected];
                serachText.objectType = ["Word"];
                serachText.lemma = {};
                serachText.lemma.startsWith = obj.varna;
                serachText.status = ["Live"];
                //ctrl.akSelected = ctrl.selectedAksharas[i].varna;
                instance.getWordAsset(serachText, obj.varna, wordAssetCb);
            });
        }


        /*########## Method to make akshara api call with selected languagae ######*/
        ctrl.searchAksharas = function(languageSelected) {
            instance.getAksharas(languageSelected, aksharaCb);
        }



        /*########## Method to update selected words array as user select and unselect the words in word browser ######*/
        ctrl.toggleWordSelection = function(identifier, word) {
            if (ctrl.isSelected[identifier] == 'word-selected') {
                ctrl.isSelected[identifier] = "";
                ctrl.selectedWords.splice(word, 1);
            } else {
                ctrl.isSelected[identifier] = 'word-selected';
                ctrl.selectedWords.push(word);
            }

        };

        /*########## Method to update selected akshara array as user select and unselect the akshara in akshara browser ######*/
        ctrl.toggleAksharaSelection = function(identifier, akshara) {
            if (ctrl.isSelected[identifier] == 'akshara-selected') {
                ctrl.isSelected[identifier] = "";
                ctrl.selectedAksharas.splice(akshara, 1);
            } else {
                ctrl.isSelected[identifier] = 'akshara-selected';
                ctrl.selectedAksharas.push(akshara);
            }
        };



        /*########## Method to collect all selected words and prepare a proper object structure ######*/
        ctrl.addWords = function() {
            ctrl.updateSelectedWords();
            var counter = 0;
            for (var i = 0; i < ctrl.selectedProperty.aksharas.length; i++) {
                var ak = ctrl.selectedProperty.aksharas[i].text;
                if (!angular.isUndefined(ctrl.selectedProperty.words[ak])) {
                    if (ctrl.selectedProperty.words[ak].one.length < ctrl.selectedProperty.repetition) {
                        counter++;
                    }
                } else {
                    counter++;
                }

            }
            if (counter > 0) {
                ctrl.lessWordSelected = true;
            } else {
                ctrl.lessWordSelected = false;
                ctrl.isAksharaBrowser = false;
                ctrl.isWordBrowser = false;
                ctrl.isGameLevel = true;
                ctrl.updateMedia();
            }

        }

        /*########## Method to add all media related to each word ######*/
        ctrl.updateMedia = function() {
            _.each(ctrl.selectedProperty.aksharas, function(obj) {
                instance.addMedia({
                    id: obj.audioAsset,
                    src: obj.audioSrc,
                    assetId: obj.audioAsset,
                    type: "sound",
                    preload: true
                });
                _.each(ctrl.selectedProperty.words[obj.text].one, function(o) {
                    instance.addMedia({
                        id: o.imageAsset,
                        src: o.imageSrc,
                        assetId: o.imageAsset,
                        type: "image",
                        preload: true
                    });
                    instance.addMedia({
                        id: o.audioAsset,
                        assetId: o.audioAsset,
                        src: o.audioSrc,
                        type: "sound",
                        preload: true
                    });
                });
                _.each(ctrl.selectedProperty.words[obj.text].two, function(o) {
                    instance.addMedia({
                        id: o.imageAsset,
                        src: o.imageSrc,
                        assetId: o.imageAsset,
                        type: "image",
                        preload: true
                    });
                    instance.addMedia({
                        id: o.audioAsset,
                        src: o.audioSrc,
                        assetId: o.audioAsset,
                        type: "sound",
                        preload: true
                    });
                });
            });
        }


        /*########## Method to switch to select akshara tab ######*/
        ctrl.Editakshara = function() {
            ctrl.isAksharaBrowser = true;
            ctrl.isWordBrowser = false;
            ctrl.isGameLevel = false;
        }

        /*########## Method to switch to select word tab ######*/
        ctrl.EditWord = function() {
            ctrl.isAksharaBrowser = false;
            ctrl.isWordBrowser = true;
            ctrl.isGameLevel = false;
        }


        /*########## Method to structure the words object as it is required for renderer plugin ######*/
        ctrl.updateSelectedWords = function() {
            ctrl.selectedProperty.words = {};
            var count = 1;
            angular.forEach(ctrl.selectedWords, function(value, key) {
                var word = {};
                word.text = value.lemma;
                word.audioSrc = value.pronunciations != undefined && value.pronunciations[0] != undefined ? value.pronunciations[0] : "";
                word.imageSrc = value.pictures != undefined && value.pictures[0] != undefined ? value.pictures[0] : "";
                word.id = count;
                word.imageAsset = value.identifier + "_image" + count;
                word.audioAsset = value.identifier + "_audio" + count;
                count++;
                if (EkstepEditorAPI._.isUndefined(ctrl.selectedProperty.words[value.akshara])) {
                    var obj = {};
                    obj.one = [];
                    obj.two = [];
                    obj.one.push(word);
                    ctrl.selectedProperty.words[value.akshara] = obj;
                } else {
                    ctrl.selectedProperty.words[value.akshara].one.push(word);
                }

            });
        }


        /*########## Method to structure the aksharas array as it is required for renderer plugin ######*/
        ctrl.updateSelectedAksharas = function() {
            ctrl.selectedProperty.aksharas = [];
            var count = 1;
            ctrl.updateRowsCols(ctrl.selectedAksharas.length);
            angular.forEach(ctrl.selectedAksharas, function(value, key) {
                var akshara = {};
                akshara.text = value.varna;
                akshara.audioSrc = value.audio != undefined ? value.audio : "";
                akshara.id = count;
                akshara.audioAsset = value.identifier + "_audio" + count;
                count++;
                ctrl.selectedProperty.aksharas.push(akshara);
            });
        }

        /*########## Method to update rows and cols based on the selected aksharas ######*/
        ctrl.updateRowsCols = function(length) {
            var cols;
            if (length <= 5) {
                cols = length;
            } else if (length > 5) {
                var rem5 = length % 5;
                var rem4 = length % 4;
                var rem3 = length % 3;
                if (rem5 == 0) {
                    cols = 5;
                } else if ((rem4 == 0 && rem3 == 0) || rem4 == 0) {
                    cols = 4;
                } else if (rem3 == 0) {
                    cols = 3;
                } else if (rem5 > 2) {
                    cols = 5;
                } else if (rem4 > 2) {
                    cols = 4;

                } else {
                    cols = 3;
                }
            }

            instance.attributes.columns = cols;


        }


        /*########## Method to add content to stage ######*/
        ctrl.addtoLesson = function() {
            var configObj = {};
            ctrl.updateGamelevel();
            ctrl.selectedProperty.gameLevels = ctrl.selectedGameLevels;
            configObj = ctrl.selectedProperty;
            instance.selectedProperty = configObj;
            instance.addObjectsToFabrics();
            ctrl.cancel();
        }

        /*########## Method to dismiss the modal ######*/
        ctrl.cancel = function() {

            $scope.closeThisDialog();
        }



        /*################## Method to select game levels ##########*/
        ctrl.addGamelevel = function(gameLevelObj) {
                for (var i = 0; i < ctrl.levelMetaData.length; i++) {
                    if (ctrl.levelMetaData[i].level == gameLevelObj.level) {
                       ctrl.levelMetaData[i].selected = !ctrl.levelMetaData[i].selected;
                    }
                }
        }


        /*################## Method to get selected game levels ##########*/
        ctrl.updateGamelevel = function() {
                for (var i = 0; i < ctrl.levelMetaData.length; i++) {
                if(ctrl.levelMetaData[i].selected){
                    ctrl.selectedGameLevels.push(ctrl.levelMetaData[i]);
                }
            }
        }



        /*########## Method to handle drag drop event for game levels ######*/
        ctrl.onLevelDragDrop = function(dragEl, dropEl) {
            ctrl.onLevelDragDrop1(EkstepEditor.jQuery('#' + dragEl).attr('data-id'), EkstepEditor.jQuery('#' + dropEl).attr('data-id'));
        }

        /*########## Method to update game levels array as user has changes the sequence  ######*/
        ctrl.onLevelDragDrop1 = function(srcLevelId, destLevelId) {
            var srcIdx = ctrl.getLevelIndexById(srcLevelId);
            var destIdx = ctrl.getLevelIndexById(destLevelId);
            if (srcIdx < destIdx) {
                var src = ctrl.levelMetaData[srcIdx];
                for (var i = srcIdx; i <= destIdx; i++) {
                    ctrl.levelMetaData[i] = ctrl.levelMetaData[i + 1];
                    if (i === destIdx) ctrl.levelMetaData[destIdx] = src;
                }
            }
            if (srcIdx > destIdx) {
                var src = ctrl.levelMetaData[srcIdx];
                for (var i = srcIdx; i >= destIdx; i--) {
                    ctrl.levelMetaData[i] = ctrl.levelMetaData[i - 1];
                    if (i === destIdx) ctrl.levelMetaData[destIdx] = src;
                }
            }
            EkstepEditorAPI.getAngularScope().safeApply();
        }

        ctrl.getLevelIndexById = function(levelId) {
            return _.findIndex(ctrl.levelMetaData, function(level) {
                return level.level == levelId;
            });
        }

    }]);
