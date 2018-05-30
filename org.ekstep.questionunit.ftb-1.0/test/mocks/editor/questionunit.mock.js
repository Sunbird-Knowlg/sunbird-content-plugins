org.ekstep.contenteditor.questionUnitPlugin = org.ekstep.contenteditor.basePlugin.extend({
	type: "org.ekstep.contenteditor.questionUnitPlugin"
});
var CKEDITOR = {};
CKEDITOR.replace = function(object) {
	var questionInput = document.createElement('textarea');
	questionInput.setAttribute("name", "ftbQuestion");
	return $(questionInput);
};