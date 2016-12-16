EkstepEditor.basePlugin.extend({
    type: "htext",
    callStatus: false,
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        delete props.__text;
        this.editorObj = new fabric.ITextbox(this.attributes.__text, props);
        this.loadHtml(this);
    },
    loadHtml: function(parentInstance) {
        var instance = this;
        this.loadResource('editor/htext.html', 'html', function(err, response) {
            instance.openHtextPopup(err, response, parentInstance);
        });
    },
    openHtextPopup: function(err, data, instance) {
        EkstepEditorAPI.getService('popup').open({ template: data, data: { instance: instance } }, this.controllerCallback);
    },
    controllerCallback: function(ctrl, scope, data) {
        var instance = data.instance,
            karaoke;
        ctrl.readalongText = '';
        ctrl.showText = true;
        ctrl.audioSelected = false;

        ctrl.name = '10';
        ctrl.downloadurl = 'https://dev.ekstep.in/assets/public/content/18_1466489408404.mp3';
        ctrl.identifier = 'do_20076106';

        karaoke = new Karaoke();
        karaoke.audioObj.url = ctrl.downloadurl;
        karaoke.audioObj.wordMap = ctrl.wordMap ? ctrl.wordMap : '';
        karaoke.audioObj.wordTimes = ctrl.wordTimes ? ctrl.wordTimes : '';
        karaoke.audioObj.highlightColor = instance.highlightColor ? instance.highlightColor : '';

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
        karaoke.initPlayer();

        EkstepEditorAPI.jQuery('#AudioSync').draggable({
            handle: "#audio-drag-handle",
            scroll: false
        });

        ctrl.selectAudio = function(value) {
            ctrl.audioSelected = true;
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
                instance.editorObj.text = ctrl.readalongText;
                EkstepEditorAPI.render();
                EkstepEditorAPI.dispatchEvent('object:modified', { target: instance.editorObj });
                console.log('addReadAlong ', instance.editorObj, karaoke);
                instance.attributes.highlight = karaoke.audioObj.highlightColor ? karaoke.audioObj.highlightColor : karaoke.highlightColor;
                timings = [];
                _.each(karaoke.audioObj.wordTimes, function(n) {
                    timings.push(parseInt(n * 1000));
                });
                instance.attributes.timings = timings.join();
                instance.attributes.audio = ctrl.name;
            } else {
                instance.editorObj.remove();
                EkstepEditorAPI.render();
            }
            EkstepEditorAPI.jQuery('.ui.modal').modal('hide');

        };

        ctrl.cancel = function() {
            instance.editorObj.remove();
            EkstepEditorAPI.render();
            EkstepEditorAPI.jQuery('.ui.modal').modal('hide');
        };
    },
    getAttributes: function() {
        var attributes = _.omit(_.clone(this.attributes), ['top', 'left', 'width', 'height', 'fontFamily', 'fontfamily', 'fontSize', 'fontstyle', 'fontweight', 'scaleX', 'scaleY']);
        attributes.font = this.editorObj.get('fontFamily');
        attributes['__text'] = this.editorObj.get('text');
        attributes.fontsize = this.updateFontSize(this.editorObj.get('fontSize'), false);
        var fontWeight = _.isUndefined(this.editorObj.get("fontWeight")) ? "" : this.editorObj.get("fontWeight");
        var fontStyle = _.isUndefined(this.editorObj.get("fontStyle")) ? "" : this.editorObj.get("fontStyle");
        attributes.weight = (fontWeight + ' ' + fontStyle).trim();
        return attributes;
    },
    updateFontSize: function(initFontSize, flag) {
        var fontsize = undefined;
        if (flag) { // from ECML conversion
            var exp = this.attributes.w * (this.magicNumber / 100);
            var width = this.editorWidth * this.attributes.w / 100;
            fontsize = parseInt(Math.round(initFontSize * (width / exp)).toString());
        } else { // to ECML conversion
            var exp = (this.editorObj.width / this.magicNumber) * 100;
            var width = (this.editorObj.width / this.editorWidth) * 100;
            var newfontsize = (initFontSize * (this.editorObj.scaleX || 1))
            fontsize = parseFloat((newfontsize * (width / exp)).toFixed(2));
        }
        return fontsize;
    },
    convertToFabric: function(data) {
        var retData = _.clone(data);
        if (data.x) retData.left = data.x;
        if (data.y) retData.top = data.y;
        if (data.w) retData.width = data.w;
        if (data.h) retData.height = data.h;
        if (data.radius) retData.rx = data.radius;
        if (data.color) retData.fill = data.color;
        if (data.weight && _.includes(data.weight, 'bold')) {
            retData.fontWeight = "bold";
            data.fontweight = true;
        } else { data.fontweight = false; }
        if (data.weight && _.includes(data.weight, 'italic')) {
            retData.fontStyle = "italic";
            data.fontstyle = true;
        } else { data.fontstyle = false; }
        if (data.font) {
            retData.fontFamily = data.font;
            data.fontFamily = data.font
        }
        if (data.fontsize) {
            var fontSize = this.updateFontSize(data.fontsize, true);
            retData.fontSize = fontSize;
            data.fontSize = fontSize;
        };
        return retData;
    }
});
//# sourceURL=readalongplugin.js
