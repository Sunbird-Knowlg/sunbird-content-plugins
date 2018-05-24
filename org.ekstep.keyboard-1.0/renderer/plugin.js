/**
 * Plugin to event handler
 * @extends base Plugin
 * @author Jagadish P <jagadish.pujari@tarento.com>
 */

/* istanbul ignore next */
Plugin.extend({
  _type: 'org.ekstep.keyboard',
  _render: true,
  answerText: '',
  ftbInputTarget: '',
  answer: [],
  _instance: undefined,
  initialize: function() {
    _instance = this;
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:invoke", this.showKeyboard);
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:hide", this.hideKeyboard);
  },
  showKeyboard: function(event, callback) {
    if (_.isFunction(callback)) {
      QS_FTB_Keyboard.constant.callbackFromKeyboard = callback; // eslint-disable-line no-undef
    }
    var questionObj = event.target;
    answer = []; // eslint-disable-line no-undef
    var questionData = JSON.parse(questionObj.qData);
    $("#qs_keyboard").show();

    var customButtons = '';
    answerText = _.isUndefined(event.target.inputoldValue.value) ? '' : event.target.inputoldValue.value; // eslint-disable-line no-undef
    $("#txtfillblank1").val(answerText);
    if (answerText != " ") {
      answer = answerText.split("");
    }
    QS_FTB_Keyboard.constant.ftbInputTarget = event.target.inputoldValue.id; // eslint-disable-line no-undef
    if (_.isUndefined(questionData.question.keyboardConfig) || questionData.question.keyboardConfig.keyboardType == 'Device') {
      $("#qs_keyboard").hide();
    } else {
      if (questionData.question.keyboardConfig.keyboardType == "English") {
        customButtons = "Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M";
        QS_FTB_Keyboard.createKeyboard(customButtons); // eslint-disable-line no-undef
      } else if (questionData.question.keyboardConfig.keyboardType == 'Custom') {
        customButtons = questionData.question.keyboardConfig.customKeys;
        customButtons = customButtons.toString();
        QS_FTB_Keyboard.createKeyboard(customButtons); // eslint-disable-line no-undef
      }
      var template = _.template(QS_FTB_Keyboard.htmlLayout); // eslint-disable-line no-undef
      if ($("#qs_keyboard").length <= 0) {
        $("#gameArea").append(template({ answerText: answerText })); // eslint-disable-line no-undef
      }
    }
  },
  hideKeyboard: function() {
    $("#qs_keyboard").remove();
  },
  addImageIcon: function(imgURL) {
    if (isbrowserpreview) { // eslint-disable-line no-undef
      return org.ekstep.pluginframework.pluginManager.resolvePluginResource("org.ekstep.keyboard", "1.0", imgURL);
    } else {
      return 'file:///' + EkstepRendererAPI.getBaseURL() + "content-plugins/org.ekstep.keyboard-1.0/" + imgURL;
    }
  }
});

//# sourceURL=keyboardPlugin.js