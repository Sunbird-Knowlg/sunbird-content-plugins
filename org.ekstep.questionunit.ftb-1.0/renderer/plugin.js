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
  /**
   * renderer:questionunit.ftb:showEventListener.
   * @event renderer:questionunit.ftb:show
   * @memberof org.ekstep.questionunit.ftb
   */
  setQuestionTemplate: function() {
    this._question.template = QS_FTBTemplate.htmlLayout; // eslint-disable-line no-undef
  },
  preQuestionShow: function(event) {
    this._super(event);
    this._question.data = QS_FTBTemplate.generateHTML(this._question.data); // eslint-disable-line no-undef
  },
  postQuestionShow: function(event) { // eslint-disable-line no-unused-vars
    QS_FTBTemplate.question = this._question; // eslint-disable-line no-undef

    $(QS_FTBTemplate.constant.qsFtbElement).off('click'); // eslint-disable-line no-undef
    $(QS_FTBTemplate.constant.qsFtbElement).on('click', '.ans-field', QS_FTBTemplate.invokeKeyboard); // eslint-disable-line no-undef

    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
    /*istanbul ignore else*/
    if (this._question.state && this._question.state.val) {
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
      };
      telemetryAnsArr.push(ansObj);
    });
    //compare two array
    /*istanbul ignore else*/
    if (_.isEqual(answerArray, this._question.data.answer)) { // eslint-disable-line no-undef
      correctAnswer = true;
    }
    // Calculate partial score
    var tempCount = 0;
    _.each(this._question.data.answer, function(ans, index) { // eslint-disable-line no-undef
      /*istanbul ignore else*/
      if (ans.toLowerCase().trim() == answerArray[index].toLowerCase().trim()) {
        tempCount++;
      }
    });

    var partialScore = (tempCount / this._question.data.answer.length) * this._question.config.max_score; // eslint-disable-line no-undef

    var result = {
      eval: correctAnswer,
      state: {
        val: answerArray
      },
      score: partialScore,
      values: telemetryAnsArr,
      noOfCorrectAns: tempCount,
      totalAns: this._question.data.answer.length
    };

    var callback = event.target;
    /*istanbul ignore else*/
    if (_.isFunction(callback)) {
      callback(result);
    }

    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', result.state);

    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, { "type": "INPUT", "values": telemetryAnsArr }); // eslint-disable-line no-undef
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result); // eslint-disable-line no-undef
  }
});
//# sourceURL=questionunitFtbRendererPlugin.js