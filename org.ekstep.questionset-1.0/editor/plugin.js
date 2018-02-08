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
    instance.config.btn_edit = "Edit";
    var _parent = this.parent;
    this.parent = undefined;
    /*istanbul ignore else*/
    if (!this.attributes.x) {
      this.attributes.x = 10;
      this.attributes.y = 3;
      this.attributes.w = 78;
      this.attributes.h = 94;
      this.percentToPixel(this.attributes);
    }
    var props = this.convertToFabric(this.attributes);
    delete props.width;
    delete props.height;

    instance._questions = data.data ? data.data : [];
    // Add all question media to media manifest
    if (_.isArray(this._questions)) {
      this._questions.forEach(function(question) {
        if (_.isArray(question.media)) {
          question.media.forEach(function(mediaItem) {
            instance.addMedia(mediaItem);
          });
        }
      });
    }

    // Add stage object
    var stageImage = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, 'editor/assets/quizimage.png');
    instance.addMedia({
      id: "QuizImage",
      src: stageImage,
      assetId: "QuizImage",
      type: "image",
      preload: true
    });
    fabric.Image.fromURL(stageImage, function(img) {
      var count = instance.config.total_items + '/' + instance.data.length;
      var quizDetails = instance.getPropsForEditor(instance.config.title, count, instance.config.max_score);
      instance.editorObj = new fabric.Group([img, quizDetails]);
      //instance.editorObj = img;
      instance.parent = _parent;
      instance.editorObj.scaleToWidth(props.w);
      instance.postInit();
    }, props);
  },
  getPropsForEditor: function(qTittle, qCount, maxscore) {
    /* Display the all properties(title,count and maxscore) on the editor*/
    var instance = this;
    qTittle = new fabric.Text(qTittle.toUpperCase(), { fontSize: 15, fill: 'black', textAlign: 'center', top: 33, left: 105 });
    qCount = new fabric.Text(qCount + "  Questions,", { fontSize: 12, fill: 'black', top: 50, left: 105 });
    maxscore = new fabric.Text(maxscore + " Marks", { fontSize: 12, fill: 'black', top: 50, left: 190, });
    fabricGroup = new fabric.Group([qTittle, qCount, maxscore]);
    return fabricGroup;
  },
  addQS: function(event, dataObj) {
    var instance = this;
    var questions = [];
    if (_.isArray(dataObj.data.data)) {
      dataObj.data.data.forEach(function(question) {
        questions.push(question);
      });
    }
    var qdata = {};
    qdata.config = { __cdata: JSON.stringify(dataObj.data.config) };
    qdata.data = questions;

    if (!ecEditor._.isUndefined(dataObj.callback)) {
      ecEditor.dispatchEvent('delete:invoke');
    }
    ecEditor.dispatchEvent(this.manifest.id + ':create', qdata);
  },
  toECML: function() {
    var instance = this;

    // Generate the questionSet ECML by using the basePlugin `toECML` function.
    var questionSetECML = this._super();

    if (_.isArray(instance.data)) {
      instance.data.forEach(function(question) {
        if (_.isUndefined(questionSetECML[instance._questionPlugin])) questionSetECML[instance._questionPlugin] = [];

        var questionBody = JSON.parse(question.body);
        // Build Question ECML for each question that is added.
        var questionECML = {
          id: UUID(),
          type: question.type,
          pluginId: questionBody.data.plugin.id,
          pluginVer: questionBody.data.plugin.version,
          templateId: questionBody.data.plugin.templateId,
          data: { __cdata: JSON.stringify(questionBody.data.data) },
          config: { __cdata: JSON.stringify(questionBody.data.config) }
        };

        // Instantiate the question unit plugin to add it to <plugin-manifest>
        ecEditor.instantiatePlugin(questionBody.data.plugin.id, {});
        // delete questionSetECML.data;
        ecEditor._.forEach(questionBody.data.media, function(asset) {
          instance.addMedia(asset);
        });
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
  onConfigChange: function(key, value) {
    if (!_.isUndefined(value)) {
      var itemLength = this.data.length;
      switch (key) {
        case 'title':
          this.config.title = value;
          this.editorObj._objects[1]._objects[0].setText(value.toUpperCase());
          break;
        case 'total_items':
          this.config.total_items = value;
          this.editorObj._objects[1]._objects[1].setText(value + "/" + itemLength + "Questions,");
          break;
        case 'max_score':
          this.config.max_score = value;
          this.editorObj._objects[1]._objects[2].setText(value + "Marks");
          break;
        case 'shuffle_questions':
          this.config.shuffle_questions = value;
          break;
        case 'show_feedback':
          this.config.show_feedback = value;
          break;
        case 'optionShuffle':
          this.config.optionShuffle = value;
          break;
        case 'btn_edit':
          ecEditor.dispatchEvent('delete:invoke');
          break;
      }
    }
    ecEditor.render();
    ecEditor.dispatchEvent('object:modified', {
      target: ecEditor.getEditorObject()
    });
  },
  /**
   *
   * open question bank.
   * @memberof questionset
   *
   */
  openQuestionBank: function(event, callback) {
    var data;
    if (ecEditor._.isUndefined(callback)) {
      data = undefined;
    } else {
      callback = callback.callback;
      data = { data: ecEditor.getCurrentObject().data, config: ecEditor.getCurrentObject().config };
    }

    ecEditor.dispatchEvent('org.ekstep.questionbank:showpopup', { callback: callback, data: data });
  }
});
//# sourceURL=questionsetPlugin.js
