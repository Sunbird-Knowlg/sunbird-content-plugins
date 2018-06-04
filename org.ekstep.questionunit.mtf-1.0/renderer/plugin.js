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
  _selectedAnswers: [],
  _dragulaContainers: [],
  setQuestionTemplate: function () {
    this._question.template = QS_MTFTemplate.htmlLayout;
  },
  preQuestionShow: function (event) {
    this._super(event);

    var instance = this;
    QS_MTFTemplate.optionsWidth = undefined;
    QS_MTFTemplate.selAns = [];
    this._selectedAnswers = [];
    //RHS options data shuffle
    this._question.data.option.optionsRHS = _.shuffle(this._question.data.option.optionsRHS);

    var lhsOptions = this._question.data.option.optionsLHS;
    for (var lhs = 0; lhs < lhsOptions.length; lhs++) {
      var emptyBox = {
        "index": lhsOptions[lhs].index,
        "selText": ""
      };
      QS_MTFTemplate.selAns.push(emptyBox);
    }
    if (this._question.state && this._question.state.val) {
      this._selectedAnswers = this._question.state.val.lhs;
      QS_MTFTemplate.selAns = this._question.state.val.lhs;
      this._question.data.option.optionsRHS = this._question.state.val.rhs;
    }
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
    if (lhsOptions.length == 3) {
      QS_MTFTemplate.optionsWidth = 'width33';
    } else if (lhsOptions.length == 4) {
      QS_MTFTemplate.optionsWidth = 'width25';
    } else if (lhsOptions.length == 5) {
      QS_MTFTemplate.optionsWidth = 'width20';
    }
    _.each(lhsOptions, function (v, k) {
      var lhs = 'left' + (k + 1);
      var rhs = 'right' + (k + 1);
      instance._dragulaContainers.push(lhs);
      instance._dragulaContainers.push(rhs);
    });
  },
  dragulaIsContainer: function (el) {
    return el.classList.contains('cont-dragula');
  },
  postQuestionShow: function (event) {
    var instance = this;
    var drake = dragula({
      isContainer: function (elem) {
        return instance.dragulaIsContainer(elem);
      },
      accepts: function (elem, target, source, sibling) {
        if ($(target).children().length > 0) {
          return false;
        }
        return true;
      }
    });
    drake.on('drop', function (elem, target, source, sibling) {
      instance.onDropElement(elem, target, source, sibling, instance._question);
    });
  },
  evaluateQuestion: function (event) {
    var instance = this;
    var callback = event.target;
    var correctAnswer = true;
    var telemetryValues = [];
    var tempCount = 0;
    var qLhsData = this._question.data.option.optionsLHS;
    if (!_.isUndefined(instance._selectedAnswers)) {
      _.each(qLhsData, function (val, key) {
        var telObj = {};
        if (!_.isUndefined(instance._selectedAnswers[key])) {
          telObj[qLhsData[key].text] = instance._selectedAnswers[key].selText;
          telemetryValues.push(telObj);
          var t = instance._selectedAnswers[key].mapIndex;
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
    var partialScore = (tempCount / qLhsData.length) * this._question.config.max_score;
    var result = {
      eval: correctAnswer,
      state: {
        val: {
          "lhs": instance._selectedAnswers,
          "rhs": this._question.data.option.optionsRHS
        }
      },
      score: partialScore,
      values: telemetryValues,
      correctAnsCount: tempCount,
      totalAns: qLhsData.length
    };
    if (_.isFunction(callback)) {
      callback(result);
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', result.state);
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result);
  },
  onDropElement: function (elem, target, source, sibling, question) {
    var instance = this;
    if (!_.isUndefined($(source).attr('mapIndex'))) {
      var rhsData = {};
      var text = $(target).text();
      rhsData.mapIndex = $(source).attr('mapIndex');
      rhsData.selText = text.trim();
      var existEle = _.contains(instance._selectedAnswers, rhsData);
      if (!existEle) {
        instance._selectedAnswers[Number($(target).attr('leftindex')) - 1] = rhsData;
        var responseData = [{
          lhs: question.data.option.optionsLHS[($(source).attr('mapIndex') - 1)].text,
          rhs: text.trim()
        }];
        instance.logTelemetryItemResponse(responseData);
      }
    } else {
      instance._selectedAnswers = _.filter(instance._selectedAnswers, function (item) {
        return item.mapIndex !== $(target).attr('mapIndex')
      });
    }
  },
  logTelemetryItemResponse: function (data) {
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, {"type": "INPUT", "values": data});
  }
});
//# sourceURL=questionunitMTFPlugin.js