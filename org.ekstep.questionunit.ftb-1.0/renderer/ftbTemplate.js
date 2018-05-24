var QS_FTBTemplate = {};

QS_FTBTemplate.textboxtarget = {};
QS_FTBTemplate.questionObj = undefined;
QS_FTBTemplate.htmlLayout = '<div id="preview-ftb-horizontal">\
  <div class="qc-ftb-layout">\
		<div class="ftb-question-header">\
				<div class="qc-ftb-question-text" id="qs-ftb-text" class="qc-text-cls">\
					<%= questionObj.question.text %>\
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
	var textBoxCollection = $("#qs-ftb-text").find("input[type=text]");
	_.each(textBoxCollection, function(element, index) {
		$("#" + element.id).val(QS_FTBTemplate.textboxtarget.state[index]);
	});
}

/**
 * renderer:questionunit.ftb:set target and value.
 * @event renderer:questionunit.ftb:click
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.invokeKeyboard = function(event) {
	var qConfig = {
		'qData': JSON.stringify(QS_FTBTemplate.questionObj),
		'inputoldValue': QS_FTBTemplate.textboxtarget
	}
	QS_FTBTemplate.textboxtarget.id = this.id;
	QS_FTBTemplate.textboxtarget.value = this.value.trim();
	if (!(isbrowserpreview && (_.isUndefined(QS_FTBTemplate.questionObj.question.keyboardConfig) || QS_FTBTemplate.questionObj.question.keyboardConfig.keyboardType == "Device"))) {
		$(".qc-ftb-layout").addClass("qcalgin");
	}
	$("#" + QS_FTBTemplate.textboxtarget.id).addClass("highlightInput");
	$("#" + QS_FTBTemplate.textboxtarget.id).siblings().removeClass("highlightInput");
	EkstepRendererAPI.dispatchEvent("org.ekstep.keyboard:invoke", qConfig, QS_FTBTemplate.callbackFromKeyboard);
};

/**
 * renderer:questionunit.ftb:callback from the keyboard with answer.
 * @event renderer:questionunit.ftb:doTextBoxHandle
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.callbackFromKeyboard = function(ans) {
	$("#" + QS_FTBTemplate.textboxtarget.id).val(ans);
	$(".qc-ftb-layout").removeClass("qcalgin");
}

/**
 * renderer:questionunit.ftb:get currentQuesData.
 * @event renderer:questionunit.ftb:doTextBoxHandle
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.generateHTML = function(quesData) {
	var index = 0;
	// Add parsedQuestion to the currentQuesData
	quesData.question.text = quesData.question.text.replace(/\[\[.*?\]\]/g, function(a, b) {
		index = index + 1;
		if (!_.isUndefined(quesData.question.keyboardConfig) && quesData.question.keyboardConfig.keyboardType == 'English' || quesData.question.keyboardConfig.keyboardType == 'Custom') {
			return '<input type="text" class="ans-field" id="ans-field' + index + '" readonly style="cursor: pointer;"  onclick="QS_FTBTemplate.logTelemetryInteract(event);">';
		} else {
			return '<input type="text" class="ans-field" id="ans-field' + index + '"  onclick="QS_FTBTemplate.logTelemetryInteract(event);">';
		}
	})
	return quesData;
}

/**
 * renderer:questionunit.ftb:show keyboard in device.
 * @event renderer:questionunit.ftb:click
 * @memberof org.ekstep.questionunit.ftb
 */
window.addEventListener('native.keyboardshow', function(e) {
	$(".qc-ftb-layout").addClass("qcalgin");
	$("#tempanswertext").val($("#" + QS_FTBTemplate.textboxtarget.id).val());
	$('#tempanswertext').focus();
});

/**
 * renderer:questionunit.ftb:hide keyboard in device.
 * @event renderer:questionunit.ftb:click
 * @memberof org.ekstep.questionunit.ftb
 */
window.addEventListener('native.keyboardhide', function() {
	$(".qc-ftb-layout").removeClass("qcalgin");
	$("#" + QS_FTBTemplate.textboxtarget.id).val($("#tempanswertext").val().trim());
});

QS_FTBTemplate.logTelemetryInteract = function(event) {
	QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.TOUCH, { type: QSTelemetryLogger.EVENT_TYPES.TOUCH, id: event.target.id });
}
//# sourceURL=QS_FTBTemplate.js