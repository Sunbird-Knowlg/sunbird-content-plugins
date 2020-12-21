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
  _totalNonAttempted: 0,
  _totalQuestions:0,
  initPlugin: function(data) {
    var instance = this;
    instance._qsSummary = {"attempted":[],"nonAttempted":[]};
    instance.addSummary();
    var summaryElement = summaryTemplate.showTemplate();
    summaryTemplate.pluginInstance = instance;
    $("#gameArea").append(summaryElement);
  },
  addSummary: function(){
    var instance = this;
    var assessTelemetryData = org.ekstep.service.content.getTelemetryEvents();
    _.forEach(assessTelemetryData.assess, function(value,key) {
      if(_.isEmpty(value.edata.resvalues)){
        instance.setNonAttemptedQuestion(key);
      }else{
        instance.setAttemptedQuestion(key);
      }
    });
    summaryTemplate._QSSummary = instance._qsSummary;
  },
  setAttemptedQuestion: function(questionId){
    var instance = this;
    if(!_.includes(instance._qsSummary.attempted, questionId))
      instance._qsSummary.attempted.push(questionId);
      var index = instance._qsSummary.nonAttempted.indexOf(questionId);
      if (index !== -1) instance._qsSummary.nonAttempted.splice(index, 1);
  },
  setNonAttemptedQuestion: function(questionId){
    var instance = this;
    if(!_.includes(instance._qsSummary.nonAttempted, questionId))
      instance._qsSummary.nonAttempted.push(questionId);
      var index = instance._qsSummary.attempted.indexOf(questionId);
      if (index !== -1) instance._qsSummary.attempted.splice(index, 1);
  },
  submitSummary: function(summary){
    EkstepRendererAPI.getTelemetryService().interact("TOUCH", "Submit_button", "TOUCH", {
      stageId: Renderer.theme._currentStage,
      subtype: ''
    });
    var attemptedQ = summaryTemplate._QSSummary.attempted.length;
    var nonAttemptedQ = summaryTemplate._QSSummary.nonAttempted.length;
    var summary = {};
    var origin = "";
    summary.totalQuestions = attemptedQ + nonAttemptedQ;
    summary.attemptedQuestions = attemptedQ;
    summary.nonAttemptedQuestions = nonAttemptedQ;
    if (!window.location.origin) {
      origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    } else {
      origin = window.location.origin
    }
    window.postMessage('renderer:question:submitscore',origin);
    EventBus.dispatch("actionNavigateNext", "next");
    EventBus.dispatch("nextClick");
  },
  goBackSummary: function(){

    EkstepRendererAPI.getTelemetryService().interact("TOUCH", "Review_button", "TOUCH", {
      stageId: Renderer.theme._currentStage,
      subtype: ''
    });
    const allStagesList = EkstepRendererAPI.getAllStages();
    const firstContentStage = EkstepRendererAPI.getContentData();
    var latestquestionsetID = '';
     _.find(firstContentStage.stage, (obj) => {
      var questionsetData = _.first(obj['org.ekstep.questionset']);
      latestquestionsetID = questionsetData ? questionsetData.id : '';
      return !!(questionsetData);
    });

    /* Check the getAllStages ID equal to the firstContentStage ID,
     * GOTO the first Assessment Slide 
     */
     allStagesList.forEach((stageItem) => {
       if(firstContentStage.startStage === stageItem.id) {
        $(".popup").remove();
        EkstepRendererAPI.dispatchEvent('renderer:plugin:reset',{"data":'true',"questionsetId": latestquestionsetID});
        //GOTO the First Slide using ID
        Renderer.theme.invokeStage(stageItem.id);
       }
    });
  }
});

//# sourceURL=summaryRenderer.js
