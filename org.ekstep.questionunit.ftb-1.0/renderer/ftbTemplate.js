var QS_FTBTemplate = {};
QS_FTBTemplate.constant = {
	parentDiv: "#preview-ftb-horizontal",
	ftbText: "#qs-ftb-text",
	ftbQuestionClass: ".ftb-question-header",
	tempanswertext: "#tempanswertext",
	qcquestion: true,
	qcblank: false
};
QS_FTBTemplate.textboxtarget = {};
QS_FTBTemplate.questionObj = undefined;
QS_FTBTemplate.htmlLayout = '<div class="qc-ftb-layout">\
		<div class="ftb-question-header">\
			<% if(QS_FTBTemplate.constant.qcquestion) { %> \
				<div class="qc-ftb-question-text" id="qs-ftb-text" class="qc-text-cls">\
					<%= questionObj.parsedQuestion.text %>\
				</div>\
			<% } %> \
		</div>\
		<% if(QS_FTBTemplate.constant.qcblank) { %> \
			<div class="ftbanswer-container">\
				<input id="tempanswertext" class="qc-answertxt" type="text" name="answer" onclick="logTelemetryInteract($event);" autofocus>\
			</div>\
		<% } %> \
	</div>';


/**
 * renderer:questionunit.ftb:set state in the text box.
 * @event renderer:questionunit.ftb:show
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.setStateInput = function() {
	var textBoxCollection = $(QS_FTBTemplate.constant.ftbQuestionClass).find("input[type=text]");
	_.each(textBoxCollection, function(element, index) {
		$("#" + element.id).val(QS_FTBTemplate.constant.textboxtarget.state[index]);
	});
}

/**
 * renderer:questionunit.ftb:set target and value.
 * @event renderer:questionunit.ftb:click
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.doTextBoxHandle = function() {
	var qConfig = {
		'qData': JSON.stringify(QS_FTBTemplate.questionObj),
		'inputoldValue': QS_FTBTemplate.textboxtarget
	}
	if (isbrowserpreview) {
		QS_FTBTemplate.constant.qcblank = false;
	} else if (_.isUndefined(QS_FTBTemplate.questionObj.question.keyboardConfig)) {
		QS_FTBTemplate.constant.qcblank = true;
	} else {
		if (QS_FTBTemplate.questionObj.question.keyboardConfig.keyboardType == "Device" && !isbrowserpreview) {
			QS_FTBTemplate.constant.qcblank = true;
		} else {
			QS_FTBTemplate.constant.qcblank = false;
		}
	}
	QS_FTBTemplate.textboxtarget.id = this.id;
	QS_FTBTemplate.textboxtarget.value = this.value.trim();
	EkstepRendererAPI.dispatchEvent("org.ekstep.keyboard:invoke", qConfig, QS_FTBTemplate.callbackFromKeyboard);
};

/**
 * renderer:questionunit.ftb:callback from the keyboard with answer.
 * @event renderer:questionunit.ftb:doTextBoxHandle
 * @memberof org.ekstep.questionunit.ftb
 */
QS_FTBTemplate.callbackFromKeyboard = function(ans) {
	$("#qs-ftb-text").show();
	$("#" + QS_FTBTemplate.textboxtarget.id).val(ans);
}

/**
 * renderer:questionunit.ftb:show keyboard in device.
 * @event renderer:questionunit.ftb:click
 * @memberof org.ekstep.questionunit.ftb
 */
window.addEventListener('native.keyboardshow', function(e) {
	QS_FTBTemplate.qcquestion = false;
	QS_FTBTemplate.qcblank = true;
	$(QS_FTBTemplate.constant.tempanswertext).val($("#" + QS_FTBTemplate.textboxtarget.id).val());
	//for text focus
	$(QS_FTBTemplate.constant.tempanswertext).focus();
	//for text focus
	$('#tempanswertext').focus();
});

/**
 * renderer:questionunit.ftb:hide keyboard in device.
 * @event renderer:questionunit.ftb:click
 * @memberof org.ekstep.questionunit.ftb
 */
window.addEventListener('native.keyboardhide', function() {
	QS_FTBTemplate.constant.qcquestion = true;
	QS_FTBTemplate.constant.qcblank = false;
	$("#" + QS_FTBTemplate.textboxtarget.id).val($(QS_FTBTemplate.constant.tempanswertext).val().trim());
});
//# sourceURL=QS_FTBTemplate.js