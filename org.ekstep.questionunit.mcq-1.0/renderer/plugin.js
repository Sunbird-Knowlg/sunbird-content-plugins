/**
 *
 * Question Unit plugin to render a MCQ question
 * @class org.ekstep.questionunit.mcq
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.questionunitmcq = {};
org.ekstep.questionunitmcq.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.mcq',
  _isContainer: true,
  _render: true,
  _selectedanswere: undefined,
  _constant: {
    gridLayout: "Grid",
    mcqParentDiv: "#qs-mcq-template",
    mcqSelectOption: ".mcq-option-value",
    optionSelectionUI: "qsselectedopt"
  },
  _selectedIndex: undefined,
  _lastAudio: undefined,
  _currentAudio: undefined,
  setQuestionTemplate: function () {
    this._question.template = MCQTemplate.loadTemplateContent(); // eslint-disable-line no-undef
    MCQTemplate.initTemplate(this);// eslint-disable-line no-undef
  },
  /**
   * Listen show event
   * @memberof org.ekstep.questionunit.mcq
   * @param {Object} event from question set.
   * @returns {currentquesObj} current question object.
   */
  preQuestionShow: function (event) {
    this._super();
    if (this._question.config.layout == this._constant.gridLayout) { // eslint-disable-line no-undef
      this.divideOption(this._question.data); // eslint-disable-line no-undef
    }
    if (this._question.config.isShuffleOption) {
      this._question.data.options = _.shuffle(this._question.data.options);
    }
  },
  postQuestionShow: function (event) {
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS);// eslint-disable-line no-undef
    MCQTemplate.renderQuestion(); // eslint-disable-line no-undef
    if (this._question.state && _.has(this._question.state, 'val')) {
      this._selectedIndex = this._question.state.val;
      $("input[name='radio']", $(this._constant.mcqParentDiv))[this._selectedIndex].checked = true; // eslint-disable-line no-undef
    } else {
      this._selectedIndex = undefined;
    }
  },
  /**
   * grid layout divide option
   * @memberof org.ekstep.questionunit.mcq
   * @param {Object} questionData from question set.
   * @returns {_questionData} current question object.
   */
  divideOption: function (questionData) {
    questionData.topOptions = [], questionData.bottomOptions = [];
    questionData.options.forEach(function (option, key) {
      if (questionData.options.length <= 4 || questionData.options.length > 6) {
        if (key < 4) questionData.topOptions.push({
          'option': option,
          'keyIndex': key
        });
        else questionData.bottomOptions.push({
          'option': option,
          'keyIndex': key
        });
      } else if (questionData.options.length == 5 || questionData.options.length == 6) {
        if (key < 3) questionData.topOptions.push({
          'option': option,
          'keyIndex': key
        });
        else questionData.bottomOptions.push({
          'option': option,
          'keyIndex': key
        });
      }
    });
    // return questionData;
  },
  /**
   * Question evalution
   * @memberof org.ekstep.questionunit.mcq
   * @param {callback} event from question set.
   */
  evaluateQuestion: function (event) {
    var callback = event.target;
    var correctAnswer = false, telValues = {}, selectedAnsData, selectedAns, result = {};
    selectedAnsData = MCQTemplate.pluginInstance._question.data.options[MCQTemplate.pluginInstance._selectedIndex]; // eslint-disable-line no-undef
    selectedAns = _.isUndefined(selectedAnsData) ? false : selectedAnsData.isCorrect;
    MCQTemplate.pluginInstance._question.data.options.forEach(function (option) { // eslint-disable-line no-undef
      if (option.isCorrect === selectedAns) {
        correctAnswer = option.isCorrect;
      }
    });
    if (!_.isUndefined(MCQTemplate.pluginInstance._selectedIndex)) telValues['option' + MCQTemplate.pluginInstance._selectedIndex] = selectedAnsData.image.length > 0 ? selectedAnsData.image : selectedAnsData.text; // eslint-disable-line no-undef
    result = {
      eval: correctAnswer,
      state: {
        val: MCQTemplate.pluginInstance._selectedIndex, // eslint-disable-line no-undef
        options: MCQTemplate.pluginInstance._question.data.options // eslint-disable-line no-undef
      },
      score: correctAnswer ? MCQTemplate.pluginInstance._question.config.max_score : 0, // eslint-disable-line no-undef
      values: [telValues]
    }
    if (_.isFunction(callback)) {
      callback(result);
    }
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result); // eslint-disable-line no-undef
  },
  /**
   * provide media url to audio and image
   * @memberof org.ekstep.questionunit.mcq
   * @param {String} url from question set.
   * @returns {String} url.
   */
  checkBaseUrl: function (url) {
    if (isbrowserpreview) { // eslint-disable-line no-undef
      return _.isUndefined(url) ? org.ekstep.pluginframework.pluginManager.resolvePluginResource("org.ekstep.questionunit.mcq", "1.0", "renderer/assets/audio.png") : url;
    } else {

      return 'file:///' + EkstepRendererAPI.getBaseURL() + _.isUndefined(url) ? "/content-plugins/org.ekstep.questionunit.mcq-1.0/renderer/assets/audio.png" : url;
    }
  },
  /**
   * play audio once at a time
   * @memberof org.ekstep.questionunit.mcq
   * @param {String} audio from question set.
   */
  playAudio: function (audio) {
    audio = this.checkBaseUrl(audio);
    if (this._lastAudio && (this._lastAudio != audio)) { // eslint-disable-line no-undef
      this._currentAudio.pause(); // eslint-disable-line no-undef
    }
    if (!this._currentAudio || this._currentAudio.paused) { // eslint-disable-line no-undef
      this._currentAudio = new Audio(audio); // eslint-disable-line no-undef
      this._currentAudio.play(); // eslint-disable-line no-undef
      this._lastAudio = audio; // eslint-disable-line no-undef
    } else {
      this._currentAudio.pause(); // eslint-disable-line no-undef
      this._currentAudio.currentTime = 0 // eslint-disable-line no-undef
    }
  },
  /**
   * onclick option the function call
   * @memberof org.ekstep.questionunit.mcq
   * @param {event} event from question set.
   * @param {Integer} index from question set.
   */
  selectedvalue: function (event, index) {
    var state = {}, value, telValues = {};
    $(this._constant.mcqSelectOption).removeClass(this._constant.optionSelectionUI);
    $('input:radio[name=radio]')[index].checked = true;
    if (!_.isUndefined(event)) {
      this.selectOptionUI(event);//eslint-disable-line no-undef
    }
    value = this._question.data.options[index];
    this._selectedIndex = index; // eslint-disable-line no-undef
    state = {
      val: this._selectedIndex, // eslint-disable-line no-undef
      options: this._question.data.options, // eslint-disable-line no-undef
      score: this._question.config.max_score // eslint-disable-line no-undef
    };
    telValues['option' + index] = value.image.length > 0 ? value.image : value.text;
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, { // eslint-disable-line no-undef
      "type": "MCQ",
      "values": [telValues]
    });
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', state);
  },
  selectOptionUI: function (event) {
    if ($(event.target).hasClass(this._constant.mcqSelectOption.replace(".", ""))) {
      $(event.target).addClass(this._constant.optionSelectionUI);
    } else {
      $(event.target).parents(this._constant.mcqSelectOption).addClass(this._constant.optionSelectionUI);
    }
    //event.stopPropagation(); //stop event because its added in all child template
  },
  logTelemetryInteract: function (event) {
    if (event != undefined) QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.TOUCH, { // eslint-disable-line no-undef
      type: QSTelemetryLogger.EVENT_TYPES.TOUCH, // eslint-disable-line no-undef
      id: event.target.id
    });
  }
});
//# sourceURL=questionunitMCQPlugin.js