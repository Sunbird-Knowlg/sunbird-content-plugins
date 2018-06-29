org.ekstep.contentrenderer.questionUnitPlugin = Plugin.extend({
  _type: 'org.ekstep.questionUnitPlugin',
  _render: true,
  _question: {
    template: undefined,
    data: {},
    config: {},
    state: undefined
  },
  /**
   * Initialize the plugin
   * @listens module:org.ekstep.contentrenderer.questionUnitPlugin~org.ekstep.questionunit:show
   * @listens module:org.ekstep.contentrenderer.questionUnitPlugin~org.ekstep.questionunit:hide
   * @listens module:org.ekstep.contentrenderer.questionUnitPlugin~org.ekstep.questionunit:evaluate
   * @param {object} data Plugin data
   */
  initialize: function (data) { // eslint-disable-line no-unused-vars
    EkstepRendererAPI.addEventListener(this._manifest.id + ":show", this.showQuestion, this);
    EkstepRendererAPI.addEventListener(this._manifest.id + ":hide", this.hideQuestion, this);
    EkstepRendererAPI.addEventListener(this._manifest.id + ":evaluate", this.evaluateQuestion, this);
  },
  /**
   * Listener for ':show' event.
   * @param {object} event - Event object
   */
  showQuestion: function (event) {
    this.preQuestionShow(event);

    var template = _.template(this._question.template);
    var questionsetInstance = event.target;
    $(questionsetInstance._constants.qsElement).html(template({question: this._question}));

    this.postQuestionShow(event);
  },
  /**
   * Set the question properties - data, config and state.
   * This method may be overridden by the question unit plugin, if additional pre-processing is required.
   * @param {object} event - Event object
   */
  preQuestionShow: function (event) {
    this.setQuestionTemplate();
    
    var questionsetInstance = event.target;
    var qData = questionsetInstance._currentQuestion.data.__cdata || questionsetInstance._currentQuestion.data;
    this.setQuestionData(JSON.parse(qData));

    var qConfig = questionsetInstance._currentQuestion.config.__cdata || questionsetInstance._currentQuestion.config;
    this.setQuestionConfig(JSON.parse(qConfig));

    var qState = questionsetInstance._currentQuestionState;
    this.setQuestionState(qState);
  },
  /**
   * Actions to be performed after the question is rendered.
   * This method may be overridden if HTML actions needs to be binded or for state management
   * @param {object} event
   */
  postQuestionShow: function (currentquesObj) { // eslint-disable-line no-unused-vars
    // overridden by MCQ or FTB or MTF if additional actions have to be handled.
  },
  hideQuestion: function (event) {
    this.preHideQuestion(event);

    var questionsetInstance = event.target;
    $(questionsetInstance._constants.qsElement).children().remove();

    this.postHideQuestion(event);
  },
  preHideQuestion: function (event) {
    // overridden by MCQ or FTB or MTF if additional events has to be removed.
  },
  postHideQuestion: function () {
    // overridden by MCQ or FTB or MTF if additional events has to be removed.
  },
  evaluateQuestion: function (event) { // eslint-disable-line no-unused-vars
    // overridden by MCQ or FTB or MTF for the evaluation of question.
  },
  /**
   * Saves the question state
   * @emits org.ekstep.questionset:saveQuestionState
   * @param {object} state - State of the question to save
   */
  saveQuestionState: function (state) {
    this.setQuestionState(state);
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', state);
  },
  /**
   * Set the HTML template needed for rendering the question.
   * This method should be overridden by question unit plugin.
   */
  setQuestionTemplate: function () {
    // Override Usage:
    // this._question.template = "<html string>";
    console.error('Template not set for question.');
  },
  /**
   * Get the HTML Template for the question
   * @returns {string} Question HTML template
   */
  getQuestionTemplate: function () {
    return this._question.template;
  },
  /**
   * Set the question data
   * @param {object} data - question data
   */
  setQuestionData: function(data) {
    this._question.data = data;
  },
  /**
   * Get question data
   */
  getQuestionData: function() {
    return this._question.data;
  },
  /**
   * Set the question configuration object.
   * @param {object} config - question config
   */
  setQuestionConfig: function (config) {
    this._question.config = config;
  },
  /**
   * Get question configuration
   */
  getQuestionConfig: function() {
    return this._question.config;
  },
  /**
   * Set question state
   * @param {object} state - question state
   */
  setQuestionState: function(state) {
    this._question.state = state;
  },
  /**
   * Get Question state
   */
  getQuestionState: function() {
    return this._question.state;
  }
});
//# sourceURL=questionUnitRenderer.js