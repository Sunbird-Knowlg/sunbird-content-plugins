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
  initPlugin: function(data) {
    var instance = this;
    instance._qsSummary = {"attempted":[],"skipped":[]};
    instance.addSummary();
    var summaryElement = summaryTemplate.showTemplate();
    summaryTemplate.pluginInstance = instance;
    $("#gameArea").append(summaryElement);
  },
  addSummary: function(){
    var instance = this;
    var assessTelemetryData = org.ekstep.service.content.getTelemetryEvents();
    _.forEach(assessTelemetryData.assess, function(value,key) {
      var item = value.edata.item;
      switch(item.type){
        case 'ftb': if(_.isEmpty(value.edata.resvalues)){
                      instance.setSkippedQuestion(key);                        
                    }else{
                      instance.setAttemptedQuestion(key);
                    }
                    break;
        case 'mcq': if(_.isEmpty(value.edata.resvalues[0])){
                      instance.setSkippedQuestion(key);
                    }else{
                      instance.setAttemptedQuestion(key);
                    }
                    break;
        case 'reorder': if(_.isEmpty(value.edata.resvalues)){
                      instance.setSkippedQuestion(key);
                    }else{
                      instance.setAttemptedQuestion(key);
                    }
                    break;
        case 'mtf': if(_.isEqual(item.params[1], value.edata.resvalues[1])){
                      instance.setSkippedQuestion(key);                        
                    }else{
                      instance.setAttemptedQuestion(key);
                    }
                    break;
        // case 'sequence': delete item.params[2];
        //             if(_.isEqual(item.params, value.edata.resvalues)){
        //               instance.setSkippedQuestion(key);                        
        //             }else{
        //               instance.setAttemptedQuestion(key);
        //             }
        //             break;
      }
    });
    summaryTemplate._QSSummary = instance._qsSummary;
  },
  setAttemptedQuestion: function(questionId){
    var instance = this;
    if(!_.includes(instance._qsSummary.attempted, questionId))
      instance._qsSummary.attempted.push(questionId);
      var index = instance._qsSummary.skipped.indexOf(questionId);
      if (index !== -1) instance._qsSummary.skipped.splice(index, 1);
  },
  setSkippedQuestion: function(questionId){
    var instance = this;
    if(!_.includes(instance._qsSummary.skipped, questionId))
      instance._qsSummary.skipped.push(questionId);
      var index = instance._qsSummary.attempted.indexOf(questionId);
      if (index !== -1) instance._qsSummary.attempted.splice(index, 1);
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
