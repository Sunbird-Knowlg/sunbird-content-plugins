/**
 *
 * Question Unit plugin to render a MCQ question
 * @class org.ekstep.questionunit.mcq
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.mcq',
  _isContainer: true,
  _render: true,
  _selectedanswere: undefined,
  _instance: undefined,
  initPlugin: function() {
    //TODO: Implement logic and define interfaces from org.ekstep.questionunit
    //TODO: Remove placeholder images from assets (no.png and yes.png)
  },
  initialize: function() {
    _instance = this;
    EkstepRendererAPI.addEventListener(this._manifest.id + ":show", this.showEventListener);
  },
  showEventListener: function(event) {
    var eventData = event.target;
    var qData = eventData._currentQuestion.data.__cdata || eventData._currentQuestion.data;
    var questionData = JSON.parse(qData);
    var qConfig = eventData._currentQuestion.config.__cdata || eventData._currentQuestion.config;
    qConfig = JSON.parse(qConfig);
    mcq_horizontal_template.createLayout(questionData);
  },
  checkBaseUrl: function(url) {
    if (isbrowserpreview) {
      return url;
    } else {
      return 'file:///' + EkstepRendererAPI.getBaseURL() + url;
    }
  },
  evaluate: function(data) { // eslint-disable-line no-unused-vars
    EkstepRendererAPI.dispatchEvent(this._manifest.id + ":evaluate");
    // var evaluator = new mcqEvaluator();
    // return evaluator.evaluate(data);
  }
});
//# sourceURL=questionunitMCQPlugin.js