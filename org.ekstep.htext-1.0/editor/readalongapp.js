'use strict';

angular.module('readalongapp', [])
    .controller('readalongcontroller', ['$scope', '$injector', 'instance', 'attrs', function($scope, $injector, instance, attrs) {
        var karaoke,
            ctrl = this;
        ctrl.readalongText = '';
        ctrl.showText = true;
        ctrl.audioSelected = false;
        ctrl.showNext = false;
        ctrl.name = '';

        ctrl.selectAudio = function(value) {
            ctrl.audioSelected = true;
            EkstepEditorAPI.dispatchEvent('org.ekstep.assetbrowser:show', {
                type: 'audio',
                search_filter: {}, // All composite keys except mediaType
                callback: function(data) { 
                    console.log('data ', data.assetMedia);
                    ctrl.name = data.assetMedia.id;
                    ctrl.downloadurl = data.assetMedia.src;
                    ctrl.identifier = data.assetMedia.id;
                    if(ctrl.readalongText.length > 0 && data.assetMedia.src){
                        ctrl.showNext = true;
                    }
                    EkstepEditorAPI.getAngularScope().safeApply();
                    ctrl.invokeKaraoke();
                }
            });
        };

        ctrl.invokeKaraoke = function(){
            karaoke = new Karaoke();
            if(attrs){
                var timings = !EkstepEditorAPI._.isEmpty(attrs.attributes.timings) ? EkstepEditorAPI._.split(attrs.attributes.timings, ',') : '',
                    wordTimes = [],
                    words = [],
                    wordsArr = EkstepEditorAPI._.split(attrs.attributes.__text, ' '),
                    wordIdx = 0;
                EkstepEditorAPI._.each(timings, function(key, value) {
                    wordIdx += 1;
                    words.push({
                        word: wordsArr[value],
                        stepNo: (parseFloat(key / 1000).toFixed(1)) * 10,
                        wordIdx: wordIdx
                    });
                    wordTimes.push(parseFloat(key / 1000).toFixed(1));
                }); 
                karaoke.audioObj.url = ctrl.downloadurl;
                karaoke.audioObj.wordMap = words;
                karaoke.audioObj.wordTimes = wordTimes;
                karaoke.audioObj.highlightColor = attrs.attributes.highlight;
            }else{
                karaoke.audioObj.url = ctrl.downloadurl;
                karaoke.audioObj.wordMap = ctrl.wordMap ? ctrl.wordMap : '';
                karaoke.audioObj.wordTimes = ctrl.wordTimes ? ctrl.wordTimes : '';
                karaoke.audioObj.highlightColor = instance.highlightColor ? instance.highlightColor : '';
            }

            setTimeout(function() {
                var slider = EkstepEditorAPI.jQuery('#syncSlider').slider({
                    min: 1,
                    max: 3,
                    value: 1,
                    step: 1,
                    change: karaoke.changePlaybackRate
                });
                EkstepEditorAPI.jQuery('#syncStart').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.startSync, karaoke));
                EkstepEditorAPI.jQuery('#pick-hcolor').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.setColor, karaoke));
                EkstepEditorAPI.jQuery('#stopAudio').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.stopAudio, karaoke));
                EkstepEditorAPI.jQuery('.slideStep').bind('drop', EkstepEditorAPI.jQuery.proxy(karaoke.handleWordDrop, karaoke));
                EkstepEditorAPI.jQuery('#syncMark').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.markWords, karaoke));
                EkstepEditorAPI.jQuery('#sync-play').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.playSyncedLayer, karaoke));
                EkstepEditorAPI.jQuery('#sync-pause').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.pauseAudio, karaoke));
                window.karaoke = karaoke;
                karaoke.initPlayer();
            }, 3000);
        };

        if(attrs){
            var media = _.keyBy(attrs.media, attrs.attributes.audio);
            ctrl.showNext = true;
            ctrl.audioSelected = true;
            ctrl.readalongText = attrs.attributes.__text;
            ctrl.autoplay = attrs.attributes.autoplay;
            ctrl.name = attrs.attributes.audio;
            ctrl.downloadurl = media.src;
            ctrl.invokeKaraoke();
            EkstepEditorAPI.getAngularScope().safeApply();
        }

        ctrl.finalText = function() {
            ctrl.showText = false;
            var text = $('#readalongText').val().trim(),
                textArray = text.split(' '),
                str = '';
            if (text.length > 0) {
                ctrl.showText = false;
            }
            _.forEach(textArray, function(text, key) {
                key = key + 1;
                str += '<span class="word" id="word-' + key + '">' + text + ' </span>';
            });
            EkstepEditorAPI.jQuery('#main-text-block').html(str);
        }

        ctrl.addReadAlong = function() {
            if (ctrl.readalongText && karaoke.audioObj.wordTimes.length > 0) {
                instance.addMedia({
                    id: ctrl.name,
                    src: ctrl.downloadurl,
                    type: 'audio'
                });
                instance.editorObj.text = instance.attributes.__text = ctrl.readalongText;
                instance.attributes.autoplay = ctrl.autoplay;
                EkstepEditorAPI.render();
                EkstepEditorAPI.dispatchEvent('object:modified', { target: instance.editorObj });
                instance.attributes.highlight = karaoke.audioObj.highlightColor ? karaoke.audioObj.highlightColor : karaoke.highlightColor;
                var timings = [];
                EkstepEditorAPI._.each(karaoke.audioObj.wordTimes, function(n) {
                    timings.push(parseInt(n * 1000));
                });
                instance.attributes.timings = timings.join();
                instance.attributes.audio = ctrl.name;
            } else {
                instance.editorObj.remove();
                EkstepEditorAPI.render();
            }
            $scope.closeThisDialog();
        };

        ctrl.cancel = function() {
            instance.editorObj.remove();
            EkstepEditorAPI.render();
            $scope.closeThisDialog();
        };
    }]);
