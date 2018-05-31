org.ekstep.contentrenderer.questionUnitPlugin = Plugin.extend({
  _type: 'org.ekstep.questionUnitPlugin',
  _render: true,
  questionData: {},
  questionConfig: {},
  //TODO: Interfaces
  initialize: function(data) { // eslint-disable-line no-unused-vars
    this.initTemplate(this);
    EkstepRendererAPI.addEventListener(this._manifest.id + ":show", this.showQuestion, this);
    EkstepRendererAPI.addEventListener(this._manifest.id + ":hide", this.hideQuestion, this);
    EkstepRendererAPI.addEventListener(this._manifest.id + ":evaluate", this.evaluateQuestion);
  },
  initTemplate: function() {

  },
  showQuestion: function(event) {
    var instance = this;
    var currentquesObj = this.preQuestionShow(event);
    var template = _.template(instance._template);
    var questionsetInstance = event.target;
    $(questionsetInstance._constants.qsElement).html(template({ questionObj: currentquesObj.questionData }));

    this.postQuestionShow(currentquesObj);
  },
  preQuestionShow: function(event) {
    var instance = this;
    var questionsetInstance = event.target;
    var qData = questionsetInstance._currentQuestion.data.__cdata || questionsetInstance._currentQuestion.data;
    questionData = JSON.parse(qData);

    var qConfig = questionsetInstance._currentQuestion.config.__cdata || questionsetInstance._currentQuestion.config;
    questionConfig = JSON.parse(qConfig);

    var qState = questionsetInstance._currentQuestionState;
    var currentquesObj = {
      "questionData": questionData,
      "questionConfig": questionConfig,
      "qState": qState
    };
    return currentquesObj;
    // overridden by MCQ or FTB or MTF if additional events has to be added.
  },
  postQuestionShow: function(currentquesObj) { // eslint-disable-line no-unused-vars
    // overridden by MCQ or FTB or MTF if additional events has to be added.
  },
  hideQuestion: function(event) {
    this.preHideQuestion(event);
    var questionsetInstance = event.target;
    $(questionsetInstance._constants.qsElement).children().remove();
    this.postHideQuestion();
  },
  preHideQuestion: function(event) {
    // overridden by MCQ or FTB or MTF if additional events has to be removed.
  },
  postHideQuestion: function() {
    // overridden by MCQ or FTB or MTF if additional events has to be removed.
  },
  evaluateQuestion: function(event) { // eslint-disable-line no-unused-vars
    // overridden by MCQ or FTB or MTF for the evaluation of question.
  }
});
//# sourceURL=questionUnitRenderer.js