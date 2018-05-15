var mcq_horizontal_template = {};
mcq_horizontal_template.constant = {
  mcqParentDiv: "#preview-mcq-horizontal",
}
mcq_horizontal_template.createLayout = function(questionObj) {
  var mcqDiv = "<div id=" + mcq_horizontal_template.constant.mcqParentDiv.replace('#', '') + "></div>";
  $("#questionset").html(mcqDiv);
  mcq_horizontal_template.headerRenderer(questionObj);
};
mcq_horizontal_template.headerRenderer = function(questionObj) {
  var template = _.template(mcq_horizontal_template.setheaderRenderer());
  $(mcq_horizontal_template.constant.mcqParentDiv).html(template({
    questionObj: questionObj
  }));
};
mcq_horizontal_template.setheaderRenderer = function() {
  return "<div id='mcq-question-header'> \
 <header class='mcq-question'> \
 		<div>\
 		<% if ( questionObj.question.image.length > 0 ){ %> \
 			<img class='mcq-question-image' src=<%=_instance.checkBaseUrl( questionObj.question.image) %>> \
 		   <% } %> \
 		</div>\
 		<div class='mcq-question-text'>\
 		<% if ( questionObj.question.text.length > 0 ){ %> \
 		<span><%= questionObj.question.text %></span> \
 		   <% } %> \
 		</div>\
 		<div class='mcq-question-audio'>\
 		<% if ( questionObj.question.audio.length > 0 ){ %> \
 			<img src='questionObj.question.audio'> \
 		   <% } %> \
 		</div>\
</header>\
</div>";
}
//# sourceURL=mcq_template.js