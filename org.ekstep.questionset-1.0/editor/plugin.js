/**
 *
 * Plugin to create question set and add it to stage.
 * @class questionset
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.contenteditor.basePlugin.extend({
    type: "org.ekstep.questionset",
    _questions: [],
    _questionPlugin: 'org.ekstep.question',
    /**
     * Register events.
     * @memberof questionset
     */
    initialize: function() {
		var instance = this;
        ecEditor.addEventListener(instance.manifest.id + ":showPopup", instance.openQuestionBank, instance);
        ecEditor.addEventListener(instance.manifest.id + ":addQS", instance.addQS, instance);
    },
    newInstance: function() {
       var instance = this;
        delete this.configManifest;
        var _parent = this.parent;
        this.parent = undefined;
        /*istanbul ignore else*/
        if (!this.attributes.x) {
            this.attributes.x = 10;
            this.attributes.y = 10;
            this.attributes.w = 80;
            this.attributes.h = 80;
            this.percentToPixel(this.attributes);
        }
        var props = this.convertToFabric(this.attributes);
        delete props.width;
        delete props.height;

        // Add all question media to media manifest
        if (_.isArray(this._questions)) {
            this._questions.forEach(function (question) {
                if (_.isArray(question.media)) {
                    question.media.forEach(function (mediaItem) {
                        instance.addMedia(mediaItem);
                    });
                }
            });
        }

        // Add stage object
        var stageImage = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, 'editor/assets/QuizImage.png');
        instance.addMedia({
            id: "QuizImage",
            src: stageImage,
            assetId: "QuizImage",
            type: "image",
            preload: true
        });
        fabric.Image.fromURL(stageImage, function (img) {
            instance.editorObj = img;
            instance.parent = _parent;
            instance.editorObj.scaleToWidth(props.w);
            instance.postInit();
        }, props);
    },
    addQS: function (event, data) {
        var instance = this;
        if(_.isArray(data.data)) {
            data.data.forEach(function(question) {
                instance._questions.push(question);
            });
        }
        var qdata = {};
        qdata.config = {__cdata: JSON.stringify(data.config)};
        qdata.data = instance._questions;
        ecEditor.dispatchEvent(this.manifest.id + ':create', qdata);
    },
    toECML: function () {
        var instance = this;

        // Generate the questionSet ECML by using the basePlugin `toECML` function.
        var questionSetECML = this._super();

        if (_.isArray(this._questions)) {
            this._questions.forEach(function (question) {
                if (_.isUndefined(questionSetECML[instance._questionPlugin])) questionSetECML[instance._questionPlugin] = [];

                // Build Question ECML for each question that is added.
                var questionECML = {
                    id: UUID(),
                    type: question.data.type,
                    pluginId: question.data.plugin.id,
                    pluginVer: question.data.plugin.version,
                    templateId: question.data.plugin.templateId,
                    data: {__cdata: JSON.stringify(question.data.data)},
                    config: {__cdata: JSON.stringify(question.config)}
                };

                // Instantiate the question unit plugin to add it to <plugin-manifest>
                ecEditor.instantiatePlugin(question.data.plugin.id, {});

                questionSetECML[instance._questionPlugin].push(questionECML);
            });
        }
        return questionSetECML;
    },
    getConfig: function() {
        var instance = this;
        var config = instance._super();
        config.title = instance.config.title;
        config.max_score = instance.config.max_score;
        config.allow_skip = instance.config.allow_skip;
        config.show_feedback = instance.config.show_feedback;
        config.shuffle_questions = instance.config.shuffle_questions;
        config.shuffle_options = instance.config.shuffle_options;
        config.total_items = instance.config.total_items;
      
        return config;
    },
    /**    
     *      
     * open question bank. 
     * @memberof questionset
     * 
     */
    openQuestionBank: function(event, callback) {
        var data;        
        if(ecEditor._.isUndefined(callback)){
            data = undefined;
        }else{
            callback = callback.callback;
            data = {data : ecEditor.getCurrentObject().data, config : ecEditor.getCurrentObject().config};
        }
        ecEditor.dispatchEvent('org.ekstep.qe.questionbank:showpopup', data); 
    }
});
//# sourceURL=questionsetPlugin.js
