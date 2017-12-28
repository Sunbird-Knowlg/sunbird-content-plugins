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
        //ecEditor.addEventListener(instance.manifest.id + ":addQ", instance.addQ, instance);
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
    /*addToStage: function (event, data) {
        var instance = this;
        ecEditor.dispatchEvent(instance.manifest.id + ':create', []);
    },*/
    addQS: function () {
        this.addQ();
        var qdata = {};
        var config =  {
            "allow_skip": true, // true/false. Allow user to skip this question
            "show_feedback": true, // true/false. Allow user to show feedback question set
            "reattempts": 2,// Number of times user to reattempt the question Ex:2
            "shuffle_questions": true, // true/false.  
            "shuffle_options": true // true/false.  
        };
        //TODO: Replace this with questionSet config from question plugin
        qdata.config = {__cdata: JSON.stringify({config: config})};
        ecEditor.dispatchEvent(this.manifest.id + ':create', qdata);
    },
    addQ: function () {
        // TODO: Replace this with actual questions from question plugin
        var mock_question = {
            "data": {
                "plugin": {  // Question Unit Plugin Information
                    "id": 'org.ekstep.questionunit.mcq', // Id of plugin
                    "version": '1.0', // Version of plugin
                    "templateId": 'horizontalMCQ'// Template Id of the question unit
                },
                "type": 'unit', //Type of question (unit, set, dynamic) -- redundant?
                "data": { // Question Unit Form Data
                    "title": 'What is the answer?',
                    "options": [
                        {
                            "text": 'Yes',
                            "image": 'renderer/assets/yes.png'
                        },
                        {
                            "text": 'No',
                            "image": 'renderer/assets/no.png'
                        }
                    ]
                },
            },
            "config": { // Default question configuration applicable to all questions
                "metadata": { // Question Metadata fields
                    "title": 'question title',
                    "description": 'question description',
                    "language": 'English'
                },
                "max_time": 0, // Maximum time allowed for solving question (0 for no limit)
                "max_score": 1, // Maximum score for the correct answer
                "partial_scoring": false // Allow partial score to be awarded in case user answers
            },
            "media": [
                {
                    "id": 'yes.png', // Unique identifier
                    "src": ecEditor.resolvePluginResource('org.ekstep.questionunit.mcq', '1.0', 'renderer/assets/yes.png'), // Media URL
                    "assetId": 'yes.png', // Asset identifier
                    "type": 'image', // Type of asset (image, audio, etc)
                    "preload": true // true or false
                },
                {
                    "id": 'no.png', // Unique identifier
                    "src": ecEditor.resolvePluginResource('org.ekstep.questionunit.mcq', '1.0', 'renderer/assets/no.png'), // Media URL
                    "assetId": 'no.png', // Asset identifier
                    "type": 'image', // Type of asset (image, audio, etc)
                    "preload": true // true or false
                }
            ]
        };
        this._questions.push(mock_question);
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
        var config = this._super();
        config.allow_skip =  true; // true/false. Allow user to skip this question
        config.show_feedback = true; // true/false. Allow user to show feedback question set
        config.reattempts = 2; // Number of times user to reattempt the question Ex:2
        config.shuffle_questions = true; // true/false.
      
        return config;
    },
    /**    
     *      
     * open question bank. 
     * @memberof questionset
     * 
     */
    openQuestionBank: function(event, callback) {    
        ecEditor.dispatchEvent('org.ekstep.qe.questionbank:showpopup', []); 
    }
});
//# sourceURL=questionsetPlugin.js
