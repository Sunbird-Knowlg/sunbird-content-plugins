/**
 *
 * Question Unit plugin to render a FTB question
 * @class org.ekstep.questionunit.ftb
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Gourav More <gourav_m@tekditechnologies.com>
 */
org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.ftb',
  _isContainer: true,
  _render: true,
  _selectedanswere: undefined,
  ftbQuestionData: {},
  ftbQuestionConfig: {},
  initPlugin: function(data) {

  },
  /**
   * renderer:questionunit.ftb:showEventListener.
   * @event renderer:questionunit.ftb:show
   * @memberof org.ekstep.questionunit.ftb
   */
  initialize: function() {
    this._template = QS_FTBTemplate;
    this._super();
  },
  postShow: function(currentquesObj) {
    ftbQuestionData = currentquesObj.questionData;
    ftbQuestionConfig = currentquesObj.questionConfig;
    QS_FTBTemplate.questionObj = currentquesObj.questionData;
    $(QS_FTBTemplate.constant.ftbText).html(questionData.parsedQuestion.text);
    $(QS_FTBTemplate.constant.parentDiv).off('click');
    $(QS_FTBTemplate.constant.parentDiv).on('click', '.ans-field', QS_FTBTemplate.doTextBoxHandle);

    if (currentquesObj.qState && currentquesObj.qState.val) {
      QS_FTBTemplate.textboxtarget.state = currentquesObj.qState.val;
      QS_FTBTemplate.setStateInput();
    }
  },
  /**
   * renderer:questionunit.ftb:evaluateEventListener.
   * @event renderer:questionunit.ftb:evaluate
   * @memberof org.ekstep.questionunit.ftb
   */
  evaluateQuestion: function(event) {
    var telemetryAnsArr = [], //array have all answer
      correctAnswer = false,
      answerArray = [],
      ansObj = {};
    //check for evalution
    //get all text box value inside the class
    var textBoxCollection = $(QS_FTBTemplate.constant.ftbQuestionClass).find("input[type=text]");
    _.each(textBoxCollection, function(element, index) {
      answerArray.push(element.value.toLowerCase().trim());
      ansObj = {
        ["ans" + index]: element.value
      }
      telemetryAnsArr.push(ansObj);
    });
    //compare two array
    if (_.isEqual(answerArray, ftbQuestionData.answer)) {
      correctAnswer = true;
    }
    // Calculate partial score   
    var tempCount = 0;
    _.each(ftbQuestionData.answer, function(ans, index) {
      if (ans == answerArray[index]) {
        tempCount++;
      }
    });

    var partialScore = (tempCount / ftbQuestionData.answer.length) * ftbQuestionConfig.max_score;

    var result = {
      eval: correctAnswer,
      state: {
        val: answerArray
      },
      score: partialScore,
      values: telemetryAnsArr,
      noOfCorrectAns: tempCount,
      totalAns: ftbQuestionData.answer.length
    }
    var callback = event.target;
    if (_.isFunction(callback)) {
      callback(result);
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', result.state);

    console.log("FTB Tel", telemetryAnsArr);
  }
});
//# sourceURL=questionunitFtbRendererPlugin.js