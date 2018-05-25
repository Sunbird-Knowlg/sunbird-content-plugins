/**
 *
 * Question Unit plugin to render a MCQ question
 * @class org.ekstep.questionunit.mcq
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
 org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.mtf',
  _isContainer: true,
  _render: true,
  _selectedAanswers: [],
  _mtfData: undefined,
  initTemplate: function(){
    this._template = QS_MTFTemplate.htmlLayout;
  },
  preQuestionShow: function(event) {
    var instance = this;
    var questionsetInstance = event.target;
    var qData = questionsetInstance._currentQuestion.data.__cdata || questionsetInstance._currentQuestion.data;
    questionData = JSON.parse(qData);
    instance._mtfData = questionData;
    //RHS options data shuffle
    questionData.option.optionsRHS.sort(() => Math.random() - 0.5);
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
    var instance = this;
    console.log("Current obj",currentquesObj);
    var drake = dragula([left1, right1, left2, right2, left3, right3], {
      accepts: function(el, t, s, si) {
        if ($(t).children().length > 0) {
          return false;
        }
        return true;
      }
    });
    var leftList = document.querySelector('#left1');
    var rightList = document.querySelector('#right1');
    drake.on('drop', function(el, t, s, si) {
      if(!_.isUndefined($(s).attr('mapIndex'))){
        var rhsData = {};
        var ts = $(t)[0].childNodes[0];
        var text = $(ts).html();
        rhsData.mapIndex = $(s).attr('mapIndex');
        rhsData.selText = text;
        instance._selectedAanswers.push(rhsData);
      }
    });
  },
  evaluateQuestion: function(callback) {
    var instance = this;
    var cb = callback.target;
    var correctAnswer = true;
    var teleValues = [];
    var tempCount = 0;
    var qLhsData = instance._mtfData.option.optionsLHS;
    if(!_.isUndefined(instance._selectedAanswers)){
      for(var i=0; i< instance._mtfData.option.optionsLHS.length; i++){
        var telObj = {};
        if(!_.isUndefined(instance._selectedAanswers[i])){
          telObj[qLhsData[i].text] = instance._selectedAanswers[i].selText;
          teleValues.push(telObj);
          if(qLhsData[i].index != instance._selectedAanswers[i].mapIndex){
            correctAnswer = false;
          } else {
            tempCount++;
          }
        }else{
          correctAnswer = false;
        }
      }
    }
    var partialScore = (tempCount / qLhsData.length) * 3;
    var result = {
      eval: correctAnswer,
      state: {
        val: {
          "lhs": instance._selectedAanswers,
          "rhs": instance._mtfData.option.optionsRHS
        }
      },
      score: partialScore,
      values: teleValues,
      noOfCorrectAns: tempCount,
      totalAns: instance._mtfData.option.optionsLHS.length
    }
    if (_.isFunction(cb)) {
      cb(result);
    }
  }
});
//# sourceURL=questionunitMTFPlugin.js