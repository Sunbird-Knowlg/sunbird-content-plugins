'use strict';

angular.module('wordinfotextapp', []).controller('wordinfotextcontroller', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {
    var ctrl = this;
    ctrl.selectedSentence = instance.attributes.__text;
    ctrl.showTypeownText = false;
    ctrl.textList = {};
    ctrl.keywords = [];
    ctrl.slectedWords = [];
    ctrl.prevSlectedWords = [];
    ctrl.loading = false;
    ctrl.isThisWordSlected = false;
    ctrl.noKeywords = false;
    ctrl.step1 = true;
    ctrl.errorLoadingKeywords = false;

    ctrl.selectWords = function($index, word, $event) {
        if (EkstepEditorAPI._.indexOf(ctrl.slectedWords, word) != -1) {
            ctrl.slectedWords.splice(EkstepEditorAPI._.indexOf(ctrl.slectedWords, word), 1);
            $(event.target).removeClass('teal');
            $scope.$safeApply();
        } else {
            ctrl.slectedWords.push(word);
            $(event.target).addClass('teal');
            $scope.$safeApply();
        }
    }

    ctrl.getKeywords = function() {
        ctrl.loading = true;
        ctrl.errorLoadingKeywords = false;
        ctrl.keywords = [];
        var requestData = {
            "request": {
                "language_id": 'en',
                "wordSuggestions": true,
                "relatedWords": true,
                "translations": true,
                "equivalentWords": true,
                "content": ctrl.selectedSentence
            }
        };
        EkstepEditorAPI.getService('languageService').getKeyWords(requestData, function(err, response) {
            ctrl.loading = false;
            if (err) {
                ctrl.errorLoadingKeywords = true;
                $scope.$safeApply();
                return;
            }
            var count = Object.keys(response.data.result).length;
            if (count <= 0) {
                ctrl.noKeywords = true;
                $scope.$safeApply();
                return;
            } else {
                EkstepEditorAPI._.forEach(response.data.result, function(value, key) {
                    ctrl.keywords.push(key);
                    $scope.$safeApply();
                });
            }
        });
    }
    ctrl.getKeywords();
    ctrl.addToLesson = function() {
        var requestData = {
            "request": {
                "filters": {
                    "lemma": ctrl.slectedWords,
                    "objectType": ["Word"]
                }
            }
        };
        EkstepEditorAPI.getService('searchService').search(requestData, function(err, response) {
            if (!err) {
                var dictionary = {},
                    wordinfotextData = {};
                EkstepEditorAPI._.forEach(response.data.result.words, function(w) {
                    dictionary[w.lemma] = {
                        lemma: w.lemma,
                        gloss: EkstepEditorAPI._.isUndefined(w.meaning) ? "" : w.meaning
                    }
                });
                var configData = {
                    "controller": dictionary,
                    "template": {
                        "id": "infoTemplate",
                        "g": {
                            "x": "0",
                            "y": "0",
                            "w": "100",
                            "h": "100",
                            "image": { "asset": "popupTint", "x": "0", "y": "0", "w": "100", "h": "100", "visible": "true", "id": "popup-Tint" },
                            "text": [{ "x": "25", "y": "25", "w": "50", "h": "9", "visible": "true", "editable": "true", "model": "word.lemma", "weight": "normal", "font": "helvetica", "color": "rgb(0,0,0)", "fontsize": "75", "align": "left", "z-index": "1", "id": "lemma" }, { "x": "25", "y": "35", "w": "50", "h": "40", "visible": "true", "editable": "true", "model": "word.gloss", "weight": "normal", "font": "helvetica", "color": "rgb(0,0,0)", "fontsize": "43", "align": "left", "z-index": "2", "id": "gloss" }],
                            "shape": { "x": "20", "y": "20", "w": "60", "h": "60", "visible": "true", "editable": "true", "type": "roundrect", "radius": "10", "opacity": "1", "fill": "#45b3a5", "stroke-width": "1", "z-index": "0", "id": "textBg" },
                            "event": {
                                "type": "click",
                                "action": [
                                    { "type": "command", "command": "SHOWHTMLELEMENTS", "asset": "textBg" },
                                    { "type": "command", "command": "hide" , "parent": "true" }
                                ]
                            }
                        }
                    }
                };
                var dataArr = {
                    "text" : ctrl.selectedSentence,
                    "words": ctrl.slectedWords.join(),
                    "wordfontcolor": "#0000FF",
                    "wordhighlightcolor" : "#FFFF00",
                    "wordunderlinecolor" : "#0000FF"
                }
                instance.cb(dataArr, configData);
                $scope.closeThisDialog();
            }
        });
    }

    ctrl.showAvailableSentences = function() {
        ctrl.showTypeownText = false;
        ctrl.noKeywords = false;
        $scope.$safeApply();
    }

    ctrl.getObjectLength = function() {
        return Object.keys(ctrl.textList).length > 0 ? true : false;
    }

    if (!EkstepEditorAPI._.isUndefined(instance.editorObj)) {
        ctrl.selectedSentence = instance.attributes.__text;
        ctrl.prevSlectedWords = ctrl.slectedWords = !EkstepEditorAPI._.isUndefined(instance.config.words) ? instance.config.words.split(',') : [];
        $scope.$safeApply();
    } 
}]);
//# sourceURL=wordinfotextapp.js
