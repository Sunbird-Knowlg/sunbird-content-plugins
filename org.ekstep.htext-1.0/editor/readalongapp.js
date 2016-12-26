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
        ctrl.highlightColor = '#FFFF00';
        if(attrs){
            var media = _.get(attrs.media, attrs.attributes.audio);
            ctrl.showNext = true;
            ctrl.audioSelected = true;
            ctrl.readalongText = attrs.attributes.__text;
            ctrl.autoplay = attrs.attributes.autoplay;
            ctrl.name = attrs.attributes.audio;
            ctrl.downloadurl = media.src;
            ctrl.highlightColor = attrs.attributes.highlight;
            EkstepEditorAPI.getAngularScope().safeApply();
            setTimeout(function(){
                karaoke = instance.invokeKaraoke(ctrl.downloadurl, attrs);
            }, 1000);
        }

        ctrl.selectAudio = function(value) {
            ctrl.name = '';
            ctrl.downloadurl = '';
            ctrl.identifier = '';
            ctrl.audioSelected = false;
            EkstepEditorAPI.dispatchEvent('org.ekstep.assetbrowser:show', {
                type: 'audio',
                search_filter: {},
                callback: function(data) { 
                    EkstepEditorAPI.dispatchEvent('org.ekstep.audio:create', data)
                    ctrl.name = data.assetMedia.id;
                    ctrl.downloadurl = data.assetMedia.src;
                    ctrl.identifier = data.assetMedia.id;
                    karaoke = instance.invokeKaraoke(ctrl.downloadurl);
                    ctrl.audioSelected = true;
                    ctrl.showNext = true;
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
                instance.attributes.highlight = ctrl.highlightColor;
                var timings = [];
                EkstepEditorAPI._.each(karaoke.audioObj.wordTimes, function(n) {
                    timings.push(parseInt(n * 1000));
                });
                instance.attributes.timings = timings.join();
                instance.attributes.audio = ctrl.name;
                instance.addEvent({ 'type':'click', 'action' : [{'type':'command', 'command' : 'togglePlay' , 'asset': instance.id}]});
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