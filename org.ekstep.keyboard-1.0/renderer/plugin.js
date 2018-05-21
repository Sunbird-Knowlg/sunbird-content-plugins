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
	eraserIcon: undefined,
	languageIcon: undefined,
	answer: [],
	initialize: function() {
		EkstepRendererAPI.addEventListener("org.ekstep.keyboard:invoke", this.showKeyboard);
		EkstepRendererAPI.addEventListener("org.ekstep.keyboard:hide", this.hideKeyboard);
		eraserIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/eras_icon.png");
		languageIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/language_icon.png");
	},
	showKeyboard: function(event, callback) {
		if (_.isFunction(callback)) {
			QS_FTB_Keyboard.constant.callbackFromKeyboard = callback;
		}
		var questionObj = event.target;
		answer = [];
		var questionData = JSON.parse(questionObj.qData);
		questionText = questionData.question.text.replace(/\[\[.*?\]\]/g, '____');
		$("#qs_keyboard").show();
		var customButtons = '';
		answerText = _.isUndefined(event.target.inputoldValue.value) ? '' : event.target.inputoldValue.value;
		QS_FTB_Keyboard.constant.ftbInputTarget = event.target.inputoldValue.id;
		if (_.isUndefined(questionData.question.keyboardConfig) || questionData.question.keyboardConfig.keyboardType == 'Device') {
			$("#qs_keyboard").hide();
		} else {
			if (questionData.question.keyboardConfig.keyboardType == "English") {
				$("#qs-ftb-text").hide();
				customButtons = "Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M";
				QS_FTB_Keyboard.createKeyboard(customButtons);
			} else if (questionData.question.keyboardConfig.keyboardType == 'Custom') {
				$("#qs-ftb-text").hide();
				customButtons = questionData.question.keyboardConfig.customKeys;
				customButtons = customButtons.toString();
				QS_FTB_Keyboard.createKeyboard(customButtons);
			}
			var template = _.template(QS_FTB_Keyboard.htmlLayout);
			if ($("#qs_keyboard").length <= 0) {
				$("#questionset").append(template({ questionText: questionText, answerText: answerText }));
			} else {
				$("#qs_keyboard").html(template({ questionText: questionText, answerText: answerText }));
			}
			$("#questionset #preview-ftb-horizontal").hide();
		}
	},
	hideKeyboard: function() {
		$("#qs_keyboard").remove();
	}
});

//# sourceURL=keyboardPlugin.js