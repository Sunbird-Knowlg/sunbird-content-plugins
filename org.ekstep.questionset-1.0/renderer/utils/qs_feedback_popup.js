var QSFeedbackPopup = {}
QSFeedbackPopup.addGoodJobPopup = function() {
	var goodJobTemplate = _.template('<div class="popup" style="z-index: 9999999;"> <div class="popup-overlay"></div> <div class="popup-full-body"> <div class="font-lato assess-popup assess-goodjob-popup"> <div class="correct-answer" style=" text-align: center;"> <div class="banner"> <img height="100%" width="100%" src="assets/icons/banner1.png"> </div> <div class="sign-board"> <img id="correctButton" width="40%" src="assets/icons/check.png"> </div> </div> <div id="popup-buttons-container"> <div onclick="QSFeedbackPopup.hideGoodJobPopup();QSFeedbackPopup.moveNextStage();" class="primary center button">Next</div> </div> </div> </div> </div>');
	$("#qs-good-job").append(goodJobTemplate);
	$("#qs-good-job").show();
}
QSFeedbackPopup.hideGoodJobPopup = function() {
	$("#qs-good-job").hide();
}
QSFeedbackPopup.moveNextStage = function() {
	EkstepRendererAPI.dispatchEvent('renderer:navigation:next');
	QSFeedbackPopup.hidePopup();
}
QSFeedbackPopup.addTryAgainPopup = function() {
	var goodJobTemplate = _.template('<div class="popup" style="z-index: 9999999;"> <div class="popup-overlay"></div> <div class="popup-full-body"> <div class="font-lato assess-popup assess-tryagain-popup"> <div class="wrong-answer" style=" text-align: center;"> <div class="banner"> <img height="100%" width="100%" src="assets/icons/banner2.png"> </div> <div class="sign-board"><img width="40%" id="incorrectButton" src="assets/icons/incorrect.png"> </div> </div> <div id="popup-buttons-container"> <div onclick="QSFeedbackPopup.tryAgainHidePopup();QSFeedbackPopup.moveNextStage();" class="left button">Next</div> <div onclick="QSFeedbackPopup.tryAgainSameQ();" class="right primary button">Try Again</div> </div> </div> </div> </div>');
	$("#qs-try-again").append(goodJobTemplate);
	$("#qs-try-again").show();
}
QSFeedbackPopup.tryAgainHidePopup = function() {
	$("#qs-try-again").hide();
}
QSFeedbackPopup.moveNextStage = function() {
	EkstepRendererAPI.dispatchEvent('renderer:navigation:next');
	QSFeedbackPopup.tryAgainHidePopup();
	$("#qs-try-again").hide();
}
QSFeedbackPopup.tryAgainSameQ = function() {
	EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:feedback:retry');
	QSFeedbackPopup.tryAgainHidePopup();
	$("#qs-try-again").hide();
}
//# sourceURL=goodJob.js