/**
 * Plugin to event handler
 * @extends base Plugin
 * @author Jagadish P <jagadish.pujari@tarento.com>
 */

/* istanbul ignore next */
org.ekstep.contentrenderer.keyboardRenderer = Plugin.extend({
  _type: 'org.ekstep.keyboardPlugin',
  _render: true,
  initialize: function() {
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:invoke", this.showKeyboard);
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:hide", this.hideKeyboard);
  },
  showKeyboard: function(event, callback) {
    var customButtons = '';
    if (_.isFunction(callback)) {
      Keyboard.callbackFromKeyboard = callback; // eslint-disable-line no-undef
    }
    var questionObj = event.target;
    var questionData = JSON.parse(questionObj.qData);
    Keyboard.keyboardShow(questionObj);
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
        $("#gameArea").append(template({ inputValue: Keyboard.inputValue })); // eslint-disable-line no-undef
      }
    }
  },
  hideKeyboard: function() {
    $(Keyboard.constant.keyboardElement).remove(); // eslint-disable-line no-undef
  }
});

//# sourceURL=keyboardPlugin.js