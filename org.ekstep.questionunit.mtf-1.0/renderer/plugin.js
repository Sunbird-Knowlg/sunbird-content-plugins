/**
 *
 * Question Unit plugin to render a MCQ question
 * @class org.ekstep.questionunit.mcq
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.questionunitmtf = {}; 
org.ekstep.questionunitmtf.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.mtf',
  _isContainer: true,
  _render: true,
  _selectedAanswers: [],
  _mtfData: undefined,
  _mtfConfig: undefined,
  _dragularContainers: [],
  initTemplate: function() {
    this._template = QS_MTFTemplate.htmlLayout;
  },
  preQuestionShow: function(event) {
    var instance = this;
    QS_MTFTemplate.optionsWidth = undefined;
    QS_MTFTemplate.selAns = [];
    instance._selectedAanswers = [];
    var questionsetInstance = event.target;
    var qData = questionsetInstance._currentQuestion.data.__cdata || questionsetInstance._currentQuestion.data;
    questionData = JSON.parse(qData);
    instance._mtfData = questionData;
    //RHS options data shuffle
    questionData.option.optionsRHS = _.shuffle(questionData.option.optionsRHS);
    var qConfig = questionsetInstance._currentQuestion.config.__cdata || questionsetInstance._currentQuestion.config;
    questionConfig = JSON.parse(qConfig);
    instance._mtfConfig = questionConfig;
    var qState = questionsetInstance._currentQuestionState;
    var currentquesObj = {
      "questionData": questionData,
      "questionConfig": questionConfig,
      "qState": qState
    };
    for (var lhs = 0; lhs < questionData.option.optionsLHS.length; lhs++) {
      var emptyBox = {
        "index": questionData.option.optionsLHS[lhs].index,
        "selText": " "
      };
      QS_MTFTemplate.selAns.push(emptyBox);
    }
    if (qState && qState.val) {
      instance._selectedAanswers = qState.val.lhs;
      QS_MTFTemplate.selAns = qState.val.lhs;
      instance._mtfData.option.optionsRHS = qState.val.rhs;
    }
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
    if (instance._mtfData.option.optionsLHS.length == 3) {
      QS_MTFTemplate.optionsWidth = 'width33';
    } else if (instance._mtfData.option.optionsLHS.length == 4) {
      QS_MTFTemplate.optionsWidth = 'width25';
    } else if (instance._mtfData.option.optionsLHS.length == 5) {
      QS_MTFTemplate.optionsWidth = 'width20';
    }
    _.each(instance._mtfData.option.optionsLHS, function(v, k) {
      var lhs = 'left' + (k + 1);
      var rhs = 'right' + (k + 1);
      instance._dragularContainers.push(lhs);
      instance._dragularContainers.push(rhs);
    });
    return currentquesObj;
  },
  dragulaIsContainer: function(el){
    return el.classList.contains('cont-dragula');
  },
  postQuestionShow: function(currentquesObj) {
    var instance = this;
    var responseData = {};
    var left1 = $('#left1')
    var drake = dragula({
      isContainer: function (elem) {
        return instance.dragulaIsContainer(elem);
        },
      accepts: function(elem, target, source, sibling) {
        if ($(target).children().length > 0) {
          return false;
        }
        return true;
      }
    });
    var leftList = document.querySelector('#left1');
    var rightList = document.querySelector('#right1');
    drake.on('drop', function(elem, target, source, sibling) {
      instance.onDropElement(elem, target, source, sibling,currentquesObj);
    });
  },
  evaluateQuestion: function(event){
    var instance = this;
    var cb = event.target;
    var correctAnswer = true;
    var telemetryValues = []; 
    var tempCount = 0;
    var qLhsData = instance._mtfData.option.optionsLHS;
    if (!_.isUndefined(instance._selectedAanswers)) {
      _.each(instance._mtfData.option.optionsLHS,function(val,key){
        var telObj = {};
        if (!_.isUndefined(instance._selectedAanswers[key])) {
          telObj[qLhsData[key].text] = instance._selectedAanswers[key].selText;
          telemetryValues.push(telObj);
          var t = instance._selectedAanswers[key].mapIndex;
          if (qLhsData[key].index != Number(t)) {
            correctAnswer = false;
          } else {
            tempCount++;
          }
        } else {
          correctAnswer = false;
        }
      });
    }
    var partialScore = (tempCount / qLhsData.length) * instance._mtfConfig.max_score;
    var result = {
      eval: correctAnswer,
      state: {
        val: {
          "lhs": instance._selectedAanswers,
          "rhs": instance._mtfData.option.optionsRHS
        }
      },
      score: partialScore,
      values: telemetryValues,
      correctAnsCount: tempCount,
      totalAns: qLhsData.length
    }
    if (_.isFunction(cb)) {
      cb(result);
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState',result.state);
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result);
  },
  onDropElement: function(elem, target, source, sibling,currentquesObj){
    var instance = this;
    if (!_.isUndefined($(source).attr('mapIndex'))) {
        var rhsData = {};
        var targetNode = $(target)[0].childNodes[0];
        var text = $(target).text();
        rhsData.mapIndex = $(source).attr('mapIndex');
        rhsData.selText = text.trim();
        var existEle = _.contains(instance._selectedAanswers,rhsData);
        if (!existEle) {
          instance._selectedAanswers[Number($(target).attr('leftindex'))-1] = rhsData;
          responseData = [{
            "lhs": currentquesObj.questionData.option.optionsLHS[($(source).attr('mapIndex')-1)].text,
            "rhs": text.trim()
          }];
          instance.logTelemetryItemResponse(responseData);
        } else {
          //console.log("Remove element dont remove");
        }
      } else {
        instance._selectedAanswers = _.filter(instance._selectedAanswers, function(item) {
          return item.mapIndex !== $(target).attr('mapIndex')
        });
      }
  },
  logTelemetryItemResponse: function(data) { 
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, { "type": "INPUT", "values": data });
  }
});
//# sourceURL=questionunitMTFPlugin.js