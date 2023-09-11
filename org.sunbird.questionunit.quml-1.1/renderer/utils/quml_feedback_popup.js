/**
 * Create Custom feedback popups
 * @extends EkstepRenderer.Plugin
 * @author Jagadish Pujari <jagadish.pujari@tarento.com>
 */
var QuMLFeedbackPopup = {};
QuMLFeedbackPopup._questionData = {};
QuMLFeedbackPopup.initTemplate = function (pluginInstance) {
  QuMLFeedbackPopup.pluginInstance = pluginInstance;
};
QuMLFeedbackPopup.createSolutionPopUpElement = function(){
  var solutionFeedback = '<div id="quml-solution-model-popup" style="position:absolute;width:100%;height:100%;z-index:999999;top:0;display:none;"></div>'
  $("#gameArea").append(solutionFeedback);
}
/**
 * Show Good job success model popup on navigation
 * @memberof org.ekstep.questionunit.quml.quml_feedback_popup#
 */
QuMLFeedbackPopup.showGoodJob = function() {
  var goodJobTemplate = _.template('<div class="popup" style="z-index: 9999999;"> <div class="popup-overlay"></div> <div class="popup-full-body"> <div class="feedback-popup-solution"><div class="feedback-overlay"><div class="feedback-content feedback-popup-content correct-answer-popup"><div class="left-section"><div class="result"><div class="banner"><img height="100%" width="100%" src="assets/icons/banner3.png"></div><div class="empty-layer"></div><div class="sign-board"><img width="40%" alt="Correct Icon" src="assets/icons/check.png"></div></div></div><div class="right-section"><button type="button" class="sb-btn sb-btn-primary sb-btn-normal sb-btn-responsive" onclick="QuMLFeedbackPopup.hidePopup();QuMLFeedbackPopup.moveToNextStage();">Next</button><% if(QuMLFeedbackPopup._questionData && QuMLFeedbackPopup._questionData.solutions && QuMLFeedbackPopup._questionData.solutions.length > 0) { %><button type="button" class="sb-btn sb-btn-normal sb-btn-outline-primary sb-btn-responsive" onclick="QuMLFeedbackPopup.showSolution();">Solution</button><% } %></div></div></div></div></div> </div>');
  $("#qs-feedback-model-popup").html(goodJobTemplate);
  $("#qs-feedback-model-popup").show();
  QuMLFeedbackPopup.createSolutionPopUpElement();
}
/**
 * Hide the model popup on navigation
 * @memberof org.ekstep.questionunit.quml.quml_feedback_popup#
 */
QuMLFeedbackPopup.hidePopup = function() {
  $("#qs-feedback-model-popup").hide();
  QuMLFeedbackPopup.logTelemetry('feedback_popup');
}
/**
 * Hide the solution model popup on done/close
 * @memberof org.ekstep.questionunit.quml.quml_feedback_popup#
 */
QuMLFeedbackPopup.hideSolutionPopup = function(){
  $("#quml-solution-model-popup").hide();
  var vid = document.getElementById("solutionVideo");
  vid && vid.pause();
  QuMLFeedbackPopup.logTelemetry('close_solution');
}
/**
 * move to next stage or next question
 * @memberof org.ekstep.questionunit.quml.quml_feedback_popup#
 */
QuMLFeedbackPopup.moveToNextStage = function() {
  EkstepRendererAPI.dispatchEvent('renderer:navigation:next');
  QuMLFeedbackPopup.logTelemetry('button-next');
  QuMLFeedbackPopup.hidePopup();
  if (_.isFunction(QuMLFeedbackPopup._callback)) {
    QuMLFeedbackPopup._callback(QuMLFeedbackPopup.result);
  }
}
/**
 * show try again model popup on navigation
 * @memberof org.ekstep.questionunit.quml.quml_feedback_popup#
 */
QuMLFeedbackPopup.showTryAgain = function() {
  var tryAgainTemplate = _.template('<div class="popup" style="z-index: 9999999;"> <div class="popup-overlay"></div> <div class="popup-full-body"> <div class="feedback-popup-solution"><div class="feedback-overlay"><div class="feedback-content feedback-popup-content wrong-answer-popup"><div class="left-section"><div class="result"><div class="banner"><img height="100%" width="100%" src="assets/icons/banner1.png"></div><div class="empty-layer"></div><div class="sign-board"><img width="40%" alt="Incorrect Icon" src="assets/icons/incorrect.png"></div></div></div><div class="right-section"><button type="button" class="sb-btn sb-btn-primary sb-btn-normal sb-btn-responsive" onclick="QuMLFeedbackPopup.hidePopup();QuMLFeedbackPopup.showRetry();">Try Again</button><button type="button" class="sb-btn sb-btn-normal sb-btn-outline-primary sb-btn-responsive" onclick="QuMLFeedbackPopup.hidePopup();QuMLFeedbackPopup.moveToNextStage();">Next</button><% if(QuMLFeedbackPopup._questionData && QuMLFeedbackPopup._questionData.solutions &&QuMLFeedbackPopup._questionData.solutions.length > 0) { %><button type="button" class="sb-btn sb-btn-normal sb-btn-outline-primary sb-btn-responsive" onclick="QuMLFeedbackPopup.showSolution();">Solution</button><% } %></div></div></div></div></div> </div>');
  $("#qs-feedback-model-popup").html(tryAgainTemplate);
  $("#qs-feedback-model-popup").show();
  QuMLFeedbackPopup.createSolutionPopUpElement();
}
QuMLFeedbackPopup.getHtmlAsSolutionTemplate = function(solutionData){
  return '<div class="feedback-content"><div class="close-btn"> <img src="' + QuMLFeedbackPopup.pluginInstance.getDefaultAsset('feedback-close.svg') + '" alt="close" class="w-100" onclick="QuMLFeedbackPopup.hideSolutionPopup();"> </div> <div class="feedback-content-questions">'+ solutionData  +'</div>    <div class="feedback-action-buttons"> <button class="sb-btn sb-btn-primary sb-btn-normal sb-btn-responsive" onclick="QuMLFeedbackPopup.hideSolutionPopup();"> Done </button> </div> </div>';
}
QuMLFeedbackPopup.getVideoAsSolutionTemplate = function(videoPath){
  return '<div class="feedback-gallery-view"> <div class="close-btn"> <img src="' + QuMLFeedbackPopup.pluginInstance.getDefaultAsset('feedback-close.svg') + '" alt="close" class="w-100" onclick="QuMLFeedbackPopup.hideSolutionPopup();"> </div> <div class="feedback-gallery"> <video class="w-100 video-section" controls="" id="solutionVideo"> <source src="'+ videoPath +'" type="video/mp4"> </video> </div> </div>';
}
/**
 * show solution model popup
 * @memberof org.ekstep.questionunit.quml.quml_feedback_popup#
 */
QuMLFeedbackPopup.showSolution = function() {
  QuMLFeedbackPopup.logTelemetry('solution_btn');
  var template;
  if(QuMLFeedbackPopup._questionData.solutions[0].type == 'html'){
    var solutionData = QuMLFeedbackPopup.replaceAssetWithBaseURL(QuMLFeedbackPopup._questionData.solutions[0].value);
    template = QuMLFeedbackPopup.getHtmlAsSolutionTemplate(solutionData);
  }else if(QuMLFeedbackPopup._questionData.solutions[0].type == 'video'){
    var index = _.findIndex(QuMLFeedbackPopup._questionData.media, function(o) { return o.type == 'video' && o.id === QuMLFeedbackPopup._questionData.solutions[0].value; });
    if(index >= 0){
      var videoPath = QuMLFeedbackPopup._questionData.media[index].src;
      videoPath = QuMLFeedbackPopup.replaceAssetWithBaseURL(videoPath);
      template = QuMLFeedbackPopup.getVideoAsSolutionTemplate(videoPath);
    }
  }
  $("#quml-solution-model-popup").html(template);
  $("#quml-solution-model-popup").show();
}
QuMLFeedbackPopup.replaceAssetWithBaseURL = function(questionData) {
  return  (questionData) && questionData.split('/assets/public/').join(EkstepRendererAPI.getBaseURL() + 'assets/public/');
}

/**
 * hide try again model popup on navigation
 * @memberof org.ekstep.questionunit.quml.quml_feedback_popup#
 */
QuMLFeedbackPopup.showRetry = function() {
  EkstepRendererAPI.dispatchEvent('org.ekstep.questionunit.quml:feedback:retry');
  QuMLFeedbackPopup.logTelemetry('button-retry');
  QuMLFeedbackPopup.hidePopup();
}
/*
 * Log telemetry intract event on click on buttons
 * @memberof org.ekstep.questionunit.quml.quml_feedback_popup#
 * @param { string } elem_id.
 */
QuMLFeedbackPopup.logTelemetry = function(elem_id) {
  QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.TOUCH, { type: QSTelemetryLogger.EVENT_TYPES.TOUCH, id: elem_id });
}
//# sourceURL=qumlFeedbackPopup.js
