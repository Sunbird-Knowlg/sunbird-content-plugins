/**
 * Plugin to event handler
 * @extends base Plugin
 * @author Jagadish P <jagadish.pujari@tarento.com>
 */

/* istanbul ignore next */
Plugin.extend({
  _type: 'org.ekstep.keyboard',
  _render: true,
  inputValue: '',
  ftbInputTarget: '',
  targetInputValue: [],
  _keyboardInstance: undefined,
  initialize: function() {
    _keyboardInstance = this; // eslint-disable-line no-undef
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:invoke", this.showKeyboard);
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:hide", this.hideKeyboard);
  },
  showKeyboard: function(event, callback) {
    if (_.isFunction(callback)) {
      Keyboard.constant.callbackFromKeyboard = callback; // eslint-disable-line no-undef
    }
    var questionObj = event.target;
    targetInputValue = []; // eslint-disable-line no-undef
    var questionData = JSON.parse(questionObj.qData);
    $(Keyboard.constant.keyboardElement).show(); // eslint-disable-line no-undef

    var customButtons = '';
    inputValue = _.isUndefined(event.target.inputoldValue.value) ? '' : event.target.inputoldValue.value; // eslint-disable-line no-undef
    $(Keyboard.constant.keyboardInput).val(inputValue); // eslint-disable-line no-undef
    if (inputValue != " ") { // eslint-disable-line no-undef
      targetInputValue = inputValue.split(""); // eslint-disable-line no-undef
    }
    Keyboard.constant.ftbInputTarget = event.target.inputoldValue.id; // eslint-disable-line no-undef
    if (_.isUndefined(questionData.question.keyboardConfig) || questionData.question.keyboardConfig.keyboardType == 'Device') {
      $(Keyboard.constant.keyboardElement).hide(); // eslint-disable-line no-undef
    } else {
      if (questionData.question.keyboardConfig.keyboardType == "English") {
        customButtons = "Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M";
        Keyboard.createKeyboard(customButtons); // eslint-disable-line no-undef
      } else if (questionData.question.keyboardConfig.keyboardType == 'Custom') {
        customButtons = questionData.question.keyboardConfig.customKeys;
        customButtons = customButtons.toString();
        Keyboard.createKeyboard(customButtons); // eslint-disable-line no-undef
      }
      var template = _.template(Keyboard.htmlLayout); // eslint-disable-line no-undef
      if ($(Keyboard.constant.keyboardElement).length <= 0) { // eslint-disable-line no-undef
        $("#gameArea").append(template({ inputValue: inputValue })); // eslint-disable-line no-undef
      }
    }
  },
  hideKeyboard: function() {
    $(Keyboard.constant.keyboardElement).remove(); // eslint-disable-line no-undef
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