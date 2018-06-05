var QS_FTBTemplate = {};
QS_FTBTemplate.constant = {
  qsFtbElement: "#ftb-template",
  qsFtbContainer: ".qs-ftb-container",
  qsFtbQuestion: "#qs-ftb-question",
  keyboardPlugin: 'org.ekstep.keyboard'
};
QS_FTBTemplate.textboxtarget = {};
QS_FTBTemplate.question = undefined;
QS_FTBTemplate.htmlLayout = '<div id="ftb-template">\
  <div class="qs-ftb-container">\
    <div class="qs-ftb-content">\
        <div class="qs-ftb-question" id="qs-ftb-question">\
          <%= question.data.question.text %>\
        </div>\
    </div>\
  </div>\
</div>';


/**
 * renderer:questionunit.ftb:set state in the text box.
 * @event renderer:questionunit.ftb:show
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.setStateInput = function() {
  var textBoxCollection = $(QS_FTBTemplate.constant.qsFtbQuestion).find("input[type=text]");
  _.each(textBoxCollection, function(element, index) {
    $("#" + element.id).val(QS_FTBTemplate.question.state.val[index]);
  });
};

/**
 * renderer:questionunit.ftb:set target and value.
 * @event renderer:questionunit.ftb:click
 * @param {Object} event from question set plugin
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.invokeKeyboard = function(event) { // eslint-disable-line no-unused-vars
  var keyboardConfig = {
    type: QS_FTBTemplate.question.data.question.keyboardConfig.keyboardType,
    keys: QS_FTBTemplate.question.data.question.keyboardConfig.customKeys,
    targetInput: event.target
  };
  /*istanbul ignore else*/
  if (!(isbrowserpreview && (_.isUndefined(QS_FTBTemplate.question.data.question.keyboardConfig) || QS_FTBTemplate.question.data.question.keyboardConfig.keyboardType == "Device"))) { // eslint-disable-line no-undef
    $(QS_FTBTemplate.constant.qsFtbContainer).addClass("align-question");
  }
  var target = $('#' + event.target.id);
  target.addClass("highlightInput");
  target.siblings().removeClass("highlightInput");

  EkstepRendererAPI.dispatchEvent(QS_FTBTemplate.constant.keyboardPlugin + ":invoke", keyboardConfig, QS_FTBTemplate.keyboardCallback);
};

/**
 * renderer:questionunit.ftb:callback from the keyboard with answer.
 * @event renderer:questionunit.ftb:doTextBoxHandle
 * @param {Object} ans object
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.keyboardCallback = function(ans) { // eslint-disable-line no-unused-vars
  //TODO: check
  // $("#" + QS_FTBTemplate.textboxtarget.id).val(ans);
  $(QS_FTBTemplate.constant.qsFtbContainer).removeClass("align-question");
};

/**
 * renderer:questionunit.ftb:get currentQuesData.
 * @event renderer:questionunit.ftb:doTextBoxHandle
 * @param {Object} quesData object without HTML
 * @returns {Object} quesData
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.generateHTML = function(quesData) {
  var index = 0,
    template, ansTemplate;
  // Add parsedQuestion to the currentQuesData
  quesData.question.text = quesData.question.text.replace(/\[\[.*?\]\]/g, function(a, b) { // eslint-disable-line no-unused-vars
    index = index + 1;
    template = _.template(QS_FTBAnsTemplate.htmlLayout); // eslint-disable-line no-undef
    var ansFieldConfig = {
      "index": index,
      "keyboardType": quesData.question.keyboardConfig.keyboardType
    };
    ansTemplate = template({ ansFieldConfig: ansFieldConfig });
    return ansTemplate;
  });
  return quesData;
};

/**
 * renderer:questionunit.ftb:show keyboard in device.
 * @event renderer:questionunit.ftb:click
 * @memberof org.ekstep.questionunit.ftb
 */
window.addEventListener('native.keyboardshow', function() { // eslint-disable-line no-unused-vars
  $(QS_FTBTemplate.constant.qsFtbContainer).addClass("align-question");
});

/**
 * renderer:questionunit.ftb:hide keyboard in device.
 * @event renderer:questionunit.ftb:click
 * @memberof org.ekstep.questionunit.ftb
 */
window.addEventListener('native.keyboardhide', function() {
  $(QS_FTBTemplate.constant.qsFtbContainer).removeClass("align-question");
});

QS_FTBTemplate.logTelemetryInteract = function(event) {
  QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.TOUCH, { type: QSTelemetryLogger.EVENT_TYPES.TOUCH, id: event.target.id }); // eslint-disable-line no-undef
};

//# sourceURL=QS_FTBTemplate.js