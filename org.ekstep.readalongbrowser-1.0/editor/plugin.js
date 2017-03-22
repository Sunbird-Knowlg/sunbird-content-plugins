/**
 * plugin is used to create or modifiy the readalong text in editor
 * @class readalongbrowser
 * @extends EkstepEditor.basePlugin
 * @author Kartheek Palla <kartheekp@ilimi.in>
 */

EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof readalongbrowser
     */
    type: "readalongbrowser",
    /**
     * Magic Number is used to calculate the from and to ECML conversion 
     * @member {Number} magicNumber
     * @memberof readalongbrowser
     */
    magicNumber: 1920,
    /**
     * Editor Width is used to calculate the from and to ECML conversion 
     * @member {Number} editorWidth
     * @memberof readalongbrowser
     */
    editorWidth: 720,
    /**
     * @member currentInstance
     * @memberof readalongbrowser
     */
    currentInstance: undefined,
    cb: undefined,
    text:undefined,
    /**
     * registers events
     * @memberof readalongbrowser
     */
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("delete:invoked", this.deleteObject, this);
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":showpopup", this.loadHtml, this);
        setTimeout(function() {
            var templatePath = EkstepEditorAPI.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/readalongbrowser.html");
            var controllerPath = EkstepEditorAPI.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/readalongbrowserapp.js");
            EkstepEditorAPI.getService('popup').loadNgModules(templatePath, controllerPath);
        }, 1000);

    },
    loadHtml: function(event, data) {
        currentInstance = this;
        this.cb = data.callback;
        this.attributes = data.textObj.attributes;
        this.attributes.__text = data.textObj.editorObj.text;
        this.config = data.textObj.config;
        if(data.textObj.attributes.textType == "readalong")
            this.editorObj = data.textObj.editorObj;
        EkstepEditorAPI.getService('popup').open({
            template: 'readalongbrowser',
            controller: 'readalongbrowsercontroller',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return currentInstance;
                }
            },
            width: 900,
            showClose: false,
            className: 'ngdialog-theme-plain'
        }, function() {
            if(!EkstepEditorAPI._.isUndefined(currentInstance.editorObj) && !currentInstance.editorObj.text) {
                currentInstance.editorObj.remove();
                EkstepEditorAPI.render();
            }
        });

    },
    invokeKaraoke: function(audioSrc, attrs) {
        var karaoke = new Karaoke();
        karaoke.audioObj.url = audioSrc;
        if (attrs) {
            var timings = !EkstepEditorAPI._.isEmpty(attrs.config.timings) ? EkstepEditorAPI._.split(attrs.config.timings, ',') : '',
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
            karaoke.audioObj.url = audioSrc;
            karaoke.audioObj.wordMap = words;
            karaoke.audioObj.wordTimes = wordTimes;
            karaoke.audioObj.highlightColor = attrs.config.highlight;
        } else {
            karaoke.audioObj.url = audioSrc;
            karaoke.audioObj.wordMap = '';
            karaoke.audioObj.wordTimes = '';
            karaoke.audioObj.highlightColor = '';
            EkstepEditorAPI.jQuery("#jplayerSync").data('jPlayer', "");
        }
        EkstepEditorAPI.jQuery('#syncSlider').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.changePlaybackRate, karaoke));
        EkstepEditorAPI.jQuery('#changeaudio').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.res, karaoke));
        EkstepEditorAPI.jQuery('#syncStart').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.startSync, karaoke));
        EkstepEditorAPI.jQuery('#pick-hcolor').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.setColor, karaoke));
        EkstepEditorAPI.jQuery('#stopAudio').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.stopAudio, karaoke));
        EkstepEditorAPI.jQuery('.slideStep').bind('drop', EkstepEditorAPI.jQuery.proxy(karaoke.handleWordDrop, karaoke));
        EkstepEditorAPI.jQuery('#syncMark').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.markWords, karaoke));
        EkstepEditorAPI.jQuery('#sync-play').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.playSyncedLayer, karaoke));
        EkstepEditorAPI.jQuery('#sync-pause').bind('click', EkstepEditorAPI.jQuery.proxy(karaoke.pauseAudio, karaoke));
        window.karaoke = karaoke;
        karaoke.initPlayer();
        return karaoke;
    },
});
//# sourceURL=readalongbrowserplugin.js
