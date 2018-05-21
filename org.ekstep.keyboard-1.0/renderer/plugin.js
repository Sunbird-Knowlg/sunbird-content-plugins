/**
 * Plugin to event handler
 * @extends base Plugin
 * @author Jagadish P <jagadish.pujari@tarento.com>
 */

/* istanbul ignore next */
Plugin.extend({
  _type: 'org.ekstep.keyboard',
  _render: true,
  questionText: '',
  answerText: '',
  ftbInputTarget: '',
  eraserIcon: undefined, // eslint-disable-line no-undef
  languageIcon: undefined, // eslint-disable-line no-undef
  answer: [],
  initialize: function() {
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:invoke", this.showKeyboard);
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:hide", this.hideKeyboard);
    eraserIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/eras_icon.png"); // eslint-disable-line no-undef
    languageIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/language_icon.png"); // eslint-disable-line no-undef
  },
  showKeyboard: function(event, callback) {
    if (_.isFunction(callback)) {
      QS_FTB_Keyboard.constant.callbackFromKeyboard = callback; // eslint-disable-line no-undef
    }
    var questionObj = event.target;
    answer = []; // eslint-disable-line no-undef
    var questionData = JSON.parse(questionObj.qData);
    questionText = questionData.question.text.replace(/\[\[.*?\]\]/g, '____'); // eslint-disable-line no-undef
    $("#qs_keyboard").show();
    var customButtons = '';
    answerText = _.isUndefined(event.target.inputoldValue.value) ? '' : event.target.inputoldValue.value; // eslint-disable-line no-undef
    QS_FTB_Keyboard.constant.ftbInputTarget = event.target.inputoldValue.id; // eslint-disable-line no-undef
    if (_.isUndefined(questionData.question.keyboardConfig) || questionData.question.keyboardConfig.keyboardType == 'Device') {
      $("#qs_keyboard").hide();
    } else {
      if (questionData.question.keyboardConfig.keyboardType == "English") {
        $("#qs-ftb-text").hide();
        customButtons = "Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M";
        QS_FTB_Keyboard.createKeyboard(customButtons); // eslint-disable-line no-undef
      } else if (questionData.question.keyboardConfig.keyboardType == 'Custom') {
        $("#qs-ftb-text").hide();
        customButtons = questionData.question.keyboardConfig.customKeys;
        customButtons = customButtons.toString();
        QS_FTB_Keyboard.createKeyboard(customButtons); // eslint-disable-line no-undef
      }
      var template = _.template(QS_FTB_Keyboard.htmlLayout); // eslint-disable-line no-undef
      if ($("#qs_keyboard").length <= 0) {
        $("#questionset").append(template({ questionText: questionText, answerText: answerText })); // eslint-disable-line no-undef
      } else {
        $("#qs_keyboard").html(template({ questionText: questionText, answerText: answerText })); // eslint-disable-line no-undef
      }
      $("#questionset #preview-ftb-horizontal").hide();
    }
  },
  hideKeyboard: function() {
    $("#qs_keyboard").remove();
  }
});

//# sourceURL=keyboardPlugin.js