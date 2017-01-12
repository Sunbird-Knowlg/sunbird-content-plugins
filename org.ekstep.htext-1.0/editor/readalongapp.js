'use strict';

angular.module('readalongapp', [])
    .controller('readalongcontroller', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {
        var karaoke,
            media,
            ctrl = this;
        ctrl.readalongText = '';
        ctrl.audioObj = '';
        ctrl.audioChanged = false;
        ctrl.oldAudioName = '';
        ctrl.showText = true;
        ctrl.audioSelected = false;
        ctrl.name = '';
        ctrl.highlightColor = '#FFFF00';
        if(!EkstepEditorAPI._.isUndefined(instance.editorObj)){
            media = EkstepEditorAPI.getMedia(instance.editorObj.audio)
            ctrl.downloadurl = !EkstepEditorAPI._.isUndefined(media) ?  media.src : '';
            ctrl.audioSelected = true;
            ctrl.readalongText = instance.attributes.__text;
            ctrl.autoplay = instance.attributes.autoplay;
            ctrl.name = instance.attributes.audio;
            ctrl.highlightColor = instance.attributes.highlight;
            EkstepEditorAPI.getAngularScope().safeApply();
            setTimeout(function(){
                karaoke = instance.invokeKaraoke(ctrl.downloadurl, instance);
            }, 1000);
        }
        ctrl.selectAudio = function(value) {
            EkstepEditorAPI.dispatchEvent('org.ekstep.assetbrowser:show', {
                type: 'audio',
                search_filter: {},
                callback: function(data) { 
                    data.assetMedia.preload = true;
                    ctrl.audioObj = '';
                    ctrl.oldAudioName = ctrl.name;
                    if(karaoke)
                        karaoke.reset();
                    ctrl.name = data.assetMedia.id;
                    ctrl.downloadurl = data.assetMedia.src;
                    ctrl.identifier = data.assetMedia.id;
                    ctrl.audioObj = data;
                    karaoke = instance.invokeKaraoke(ctrl.downloadurl);
                    ctrl.audioSelected = true;
                    if(!EkstepEditorAPI._.isUndefined(instance.editorObj))
                        ctrl.audioChanged = true;
                    EkstepEditorAPI.getAngularScope().safeApply();
                }
            });
        };

        ctrl.finalText = function() {
            var text = $('#readalongText').val().trim(),
                textArray = text.split(' '),
                str = '';
            if (text.length > 0) {
                ctrl.showText = false;
            }
            EkstepEditorAPI._.forEach(textArray, function(text, key) {
                key = key + 1;
                str += '<span class="word" id="word-' + key + '">' + text + ' </span>';
            });
            EkstepEditorAPI.jQuery('#main-text-block').html(str);
        }

        ctrl.addReadAlong = function() {
            if(!EkstepEditorAPI._.isUndefined(instance.editorObj)){
                instance.editorObj.text = instance.attributes.__text = ctrl.readalongText;
                instance.attributes.autoplay = ctrl.autoplay;
                instance.attributes.highlight = ctrl.highlightColor;
                var timings = [];
                EkstepEditorAPI._.each(karaoke.audioObj.wordTimes, function(n) {
                    timings.push(parseInt(n * 1000));
                });
                instance.attributes.timings = timings.join();
                instance.attributes.audio = ctrl.name;
                EkstepEditorAPI._.forEach(instance.event, function (e,i) {
                    if(e.action[0].asset === instance.id){
                        instance.event.splice(i, 1);
                    }
                })
                instance.addEvent({ 'type':'click', 'action' : [{'type':'command', 'command' : 'togglePlay' , 'asset': instance.id}]});
                if(ctrl.audioChanged && ctrl.oldAudioName != ''){
                    if(!EkstepEditorAPI._.isUndefined(ctrl.audioObj.assetMedia)){
                        EkstepEditor.mediaManager.addMedia(ctrl.audioObj.assetMedia);
                        EkstepEditorAPI.dispatchEvent('org.ekstep.stageconfig:remove', {'asset': ctrl.oldAudioName});
                        EkstepEditorAPI.dispatchEvent("org.ekstep.stageconfig:addcomponent", { 
                            stageId: EkstepEditorAPI.getCurrentStage().id,
                            type: 'audio', 
                            title: (EkstepEditorAPI._.isUndefined(ctrl.audioObj.assetMedia.name)) ? ctrl.audioObj.assetMedia.id : ctrl.audioObj.assetMedia.name,
                            id: ctrl.audioObj.assetMedia.id,
                            url: ctrl.audioObj.assetMedia.src
                        });
                    }
                   // EkstepEditorAPI.dispatchEvent('org.ekstep.audio:create', ctrl.audioObj)
                }
                EkstepEditorAPI.render();
            }else{
                if (ctrl.readalongText && karaoke.audioObj.wordTimes.length > 0) {
                    var timings = [];
                    EkstepEditorAPI._.each(karaoke.audioObj.wordTimes, function(n) {
                        timings.push(parseInt(n * 1000));
                    });
                    EkstepEditorAPI.dispatchEvent("org.ekstep.htext:create", {
                        "__text": ctrl.readalongText,
                        "x": 10,
                        "y": 20,
                        "fontFamily": "Verdana",
                        "fontSize": 18,
                        "minWidth": 20,
                        "w": 35,
                        "maxWidth": 500,
                        "fill": "#000000",
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "stroke": "rgba(255, 255, 255, 0)",
                        "strokeWidth": 1,
                        "opacity": 1,
                        "editable": false,
                        "audio": ctrl.name,
                        "timings": timings.join(),
                        "autoplay": ctrl.autoplay,
                        "highlight": ctrl.highlightColor,
                        "audioObj":  ctrl.audioObj
                    });
                    EkstepEditorAPI.render();
                }
            }
            $scope.closeThisDialog();
        };

        ctrl.cancel = function() {
            $scope.closeThisDialog();
        };
    }]);