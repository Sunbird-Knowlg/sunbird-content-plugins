/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author Jagadish P <jagadish.pujari@tarento.com>
 */
org.ekstep.summaryRenderer = Plugin.extend({ // eslint-disable-line no-undef
  _type: 'org.ekstep.summary',
  _isContainer: true,
  _render: true,
  _qsSummary: {},
  _totalAttempted: 0,
  _totalSkipped: 0,
  _totalQuestions:0,
  initialize: function(){
    var instance = this;
    instance._qsSummary = {"attempted":[],"skipped":[]};
    //Question summary from questionSet plugin 
    EkstepRendererAPI.addEventListener('org.ekstep.questionset:addSummary', instance.addSummary,instance);
  },
  initPlugin: function(data) {
    var instance = this;
    var summaryElement = summaryTemplate.showTemplate();
    summaryTemplate.pluginInstance = instance;
    $("#gameArea").append(summaryElement);
  },
  addSummary: function(result){
    var instance = this;
    var attempted = result.target.attempted;
    var questionId = result.target.questionID;
    var isAttemptDefined = _.isUndefined(attempted) ? false : true;
    var isQuestionIdDefined = _.isUndefined(questionId) ? false : true;
    if(isAttemptDefined && isQuestionIdDefined)
    if(attempted){
      if(!_.includes(instance._qsSummary.attempted, questionId))
      instance._qsSummary.attempted.push(questionId);
      var index = instance._qsSummary.skipped.indexOf(questionId);
      if (index !== -1) instance._qsSummary.skipped.splice(index, 1);
    }else{
      if(!_.includes(instance._qsSummary.skipped, questionId))
      instance._qsSummary.skipped.push(questionId);
      var index = instance._qsSummary.attempted.indexOf(questionId);
      if (index !== -1) instance._qsSummary.attempted.splice(index, 1);
    }
    summaryTemplate._QSSummary = instance._qsSummary;
  },
  submitSummary: function(summary){
    var attemptedQ = summaryTemplate._QSSummary.attempted.length;
    var skippedQ = summaryTemplate._QSSummary.skipped.length;
    var summary = {};
    summary.totalQuestions = attemptedQ + skippedQ;
    summary.attemptedQuestions = attemptedQ;
    summary.skippedQuestions = skippedQ; 
    EkstepRendererAPI.dispatchEvent('question:score:submit',summary);
    EventBus.dispatch("actionNavigateNext", "next");
    EventBus.dispatch("nextClick");
  }
});

//# sourceURL=summaryRenderer.js
