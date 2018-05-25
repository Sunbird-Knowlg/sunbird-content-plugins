/**
 *
 * Question Unit plugin to render a FTB question
 * @class org.ekstep.questionunit.ftb
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Gourav More <gourav_m@tekditechnologies.com>
 */
org.ekstep.questionunitFTB = {};
org.ekstep.questionunitFTB.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.ftb',
  _isContainer: true,
  _render: true,
  _selectedanswere: undefined,
  ftbQuestionData: {}, // eslint-disable-line no-undef
  ftbQuestionConfig: {}, // eslint-disable-line no-undef

  /**
   * renderer:questionunit.ftb:showEventListener.
   * @event renderer:questionunit.ftb:show
   * @memberof org.ekstep.questionunit.ftb
   */
  initTemplate: function() {
    this._template = QS_FTBTemplate.htmlLayout; // eslint-disable-line no-undef
  },
  preQuestionShow: function(event) {
    var instance = this;
    var questionsetInstance = event.target;
    var qData = questionsetInstance._currentQuestion.data.__cdata || questionsetInstance._currentQuestion.data;
    var quesData = JSON.parse(qData);
    questionData = QS_FTBTemplate.generateHTML(quesData); // eslint-disable-line no-undef
    var qConfig = questionsetInstance._currentQuestion.config.__cdata || questionsetInstance._currentQuestion.config;
    questionConfig = JSON.parse(qConfig);

    var qState = questionsetInstance._currentQuestionState;
    var currentquesObj = {
      "questionData": questionData,
      "questionConfig": questionConfig,
      "qState": qState
    };
    return currentquesObj;
  },
  postQuestionShow: function(currentquesObj) {
    ftbQuestionData = currentquesObj.questionData; // eslint-disable-line no-undef
    ftbQuestionConfig = currentquesObj.questionConfig; // eslint-disable-line no-undef
    QS_FTBTemplate.questionObj = currentquesObj.questionData; // eslint-disable-line no-undef

    $(QS_FTBTemplate.constant.qsFtbElement).off('click'); // eslint-disable-line no-undef
    $(QS_FTBTemplate.constant.qsFtbElement).on('click', '.ans-field', QS_FTBTemplate.invokeKeyboard); // eslint-disable-line no-undef

    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
    if (currentquesObj.qState && currentquesObj.qState.val) {
      QS_FTBTemplate.textboxtarget.state = currentquesObj.qState.val; // eslint-disable-line no-undef
      QS_FTBTemplate.setStateInput(); // eslint-disable-line no-undef
    }
  },
  postHideQuestion: function() {
    EkstepRendererAPI.dispatchEvent("org.ekstep.keyboard:hide");
  },
  /**
   * renderer:questionunit.ftb:evaluateEventListener.
   * @event renderer:questionunit.ftb:evaluate
   * @param {Object} event object from questionset
   * @memberof org.ekstep.questionunit.ftb
   */
  evaluateQuestion: function(event) {
    var telemetryAnsArr = [], //array have all answer
      correctAnswer = false,
      answerArray = [],
      ansObj = {};
    //check for evalution
    //get all text box value inside the class
    var textBoxCollection = $(QS_FTBTemplate.constant.qsFtbQuestion).find("input[type=text]"); // eslint-disable-line no-undef
    _.each(textBoxCollection, function(element, index) {
      answerArray.push(element.value.toLowerCase().trim());
      var key = "ans" + index; // eslint-disable-line no-unused-vars
      ansObj = {
        key: element.value
      }
      telemetryAnsArr.push(ansObj);
    });
    //compare two array
    if (_.isEqual(answerArray, ftbQuestionData.answer)) { // eslint-disable-line no-undef
      correctAnswer = true;
    }
    // Calculate partial score
    var tempCount = 0;
    _.each(ftbQuestionData.answer, function(ans, index) { // eslint-disable-line no-undef
      if (ans == answerArray[index]) {
        tempCount++;
      }
    });

    var partialScore = (tempCount / ftbQuestionData.answer.length) * ftbQuestionConfig.max_score; // eslint-disable-line no-undef

    var result = {
      eval: correctAnswer,
      state: {
        val: answerArray
      },
      score: partialScore,
      values: telemetryAnsArr,
      noOfCorrectAns: tempCount,
      totalAns: ftbQuestionData.answer.length // eslint-disable-line no-undef
    }
    var callback = event.target;
    if (_.isFunction(callback)) {
      callback(result);
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', result.state);

    //console.log("FTB Tel", telemetryAnsArr);
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, { "type": "INPUT", "values": telemetryAnsArr }); // eslint-disable-line no-undef
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result); // eslint-disable-line no-undef
  }
});
//# sourceURL=questionunitFtbRendererPlugin.js