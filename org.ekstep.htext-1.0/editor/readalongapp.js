'use strict';

angular.module('readalongapp', [])
    .controller('readalongcontroller', ['$scope', '$injector', 'instance', function($scope, $injector, instance) {
        var karaoke,
            media,
            ctrl = this;
        ctrl.readalongText = instance.text;
        ctrl.audioObj = '';
        ctrl.audioChanged = false;
        ctrl.oldAudioName = '';
        ctrl.showText = true;
        ctrl.audioSelected = false;
        ctrl.name = '';
        ctrl.highlightColor = '#FFFF00';
        if(!EkstepEditorAPI._.isUndefined(instance.editorObj)){
            media = instance.attributes.audioObj.assetMedia;
            ctrl.audioObj = instance.attributes.audioObj;
            ctrl.downloadurl = !EkstepEditorAPI._.isUndefined(media) ?  media.src : '';
            ctrl.audioSelected = true;
            ctrl.readalongText = instance.attributes.__text;
            ctrl.autoplay = instance.attributes.autoplay;
            ctrl.name = instance.attributes.audio;
            ctrl.highlightColor = instance.attributes.highlight;
            $scope.$safeApply();
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
                    $scope.$safeApply();
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
            var timings = [];
            EkstepEditorAPI._.each(karaoke.audioObj.wordTimes, function(n) {
                timings.push(parseInt(n * 1000));
            });
            var dataArr = {
                "text" : ctrl.readalongText,
                "audio": ctrl.name,
                "timings": timings.join(),
                "autoplay": ctrl.autoplay,
                "highlight": ctrl.highlightColor,
                "audioObj":  ctrl.audioObj
            }
            instance.cb(dataArr);

            $scope.closeThisDialog();
        };

        ctrl.cancel = function() {
            instance.cb();
            $scope.closeThisDialog();
        };

        ctrl.generateTelemetry = function(data) {
          if (data) EkstepEditorAPI.getService('telemetry').interact({ "type": data.type, "subtype": data.subtype, "target": data.target, "pluginid": instance.manifest.id, "pluginver": instance.manifest.ver, "objectid": "", "stage": EkstepEditorAPI.getCurrentStage().id })
        }
    }]);