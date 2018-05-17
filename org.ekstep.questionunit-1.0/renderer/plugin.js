org.ekstep.contentrenderer.questionUnitPlugin = Plugin.extend({
	_type: 'org.ekstep.questionUnitPlugin',
	_render: true,
	questionData: {},
	questionConfig: {},
	//TODO: Interfaces
	initPlugin: function(data) { // eslint-disable-line no-unused-vars

	},
	initialize: function(data) { // eslint-disable-line no-unused-vars
		EkstepRendererAPI.addEventListener(this._manifest.id + ":show", this.showQuestion, this);
		EkstepRendererAPI.addEventListener(this._manifest.id + ":hide", this.hideQeustion);
		EkstepRendererAPI.addEventListener(this._manifest.id + ":evaluate", this.evaluateQuestion);
	},
	showQuestion: function(event) {
		var instance = this;
		var questionObj = event.target;
		var qData = questionObj._currentQuestion.data.__cdata || questionObj._currentQuestion.data;
		questionData = JSON.parse(qData);

		var qConfig = questionObj._currentQuestion.config.__cdata || questionObj._currentQuestion.config;
		questionConfig = JSON.parse(qConfig);

		var qState = questionObj._currentQuestionState;

		$("#questionset").html("<div id=" + instance._template.constant.parentDiv.replace('#', '') + "></div>");
		var template = _.template(instance._template.htmlLayout);
		$(instance._template.constant.parentDiv).html(template({ questionObj: questionData }));

		var currentquesObj = {
			"questionData": questionData,
			"questionConfig": questionConfig,
			"qState": qState
		};
		this.postShow(currentquesObj);
	},

	postShow: function(currentquesObj) { // eslint-disable-line no-unused-vars
		// overridden by MCQ or FTB or MTF if additional events has to be added.
	},
	hideQuestion: function() {
		this.postHide();
	},
	postHide: function() {
		// overridden by MCQ or FTB or MTF if additional events has to be removed.
	},
	evaluateQuestion: function(event) { // eslint-disable-line no-unused-vars
		// overridden by MCQ or FTB or MTF for the evaluation of question.
	}
});
//# sourceURL=questionUnitRenderer.js