var MCQTemplate = MCQTemplate || {};
MCQTemplate.initTemplate = function(pluginInstance) {
  MCQTemplate.pluginInstance = pluginInstance;
};
MCQTemplate.loadTemplateContent = function() {
  return "<div id='preview-mcq-template'><div id='qc-mcqlayout'></div></div>";
},
MCQTemplate.renderQuestion = function(questionObj) {
  var template = _.template(MCQTemplate.getQuesLayout());
  $("#qc-mcqlayout").html(template({
    questionObj: questionObj
  }));
  MCQTemplate.renderTemplateLayout(questionObj);
},
/**
  * render template using underscore
  * @param {Object} questionObj from question set.
  * @memberof org.ekstep.questionunit.mcq.template_controller
*/
MCQTemplate.renderTemplateLayout = function(questionObj) {
  var layout = questionObj.questionConfig.layout;
  var template;
  switch (layout) {
    case "Grid":
      template = _.template(MCQTemplate.getGridTemplate(questionObj));
      break;
    case "Horizontal":
      template = _.template(MCQTemplate.getHorizontalTemplate(questionObj));
      break;
    case "Vertical":
      template = _.template(MCQTemplate.getVerticalTemplate(questionObj));
      break;
    default:
      template = _.template(MCQTemplate.getHorizontalTemplate(questionObj));
  }
  $("#qc-mcqlayout").append(template({
    questionObj: questionObj
  }));
},
/**
  * This question layout is common for all the template
  * @memberof org.ekstep.questionunit.mcq.template_controller
  * @returns {String} template.
*/
MCQTemplate.getQuesLayout = function() {
  return "<div id='mcq-question-header'> \
 <header id='mcq-question'> \
 <% if ( questionObj.question.image.length > 0 ){ %> \
    <div class='question-image'>\
      <img class='mcq-question-image' onclick='MCQTemplate.showImageModel(event)' src=<%=MCQTemplate.pluginInstance.checkBaseUrl( questionObj.question.image) %>> \
    </div>\
     <% } %> \
    <div class='mcq-question-text'>\
    <% if ( questionObj.question.text.length > 0 ){ %> \
      <% if(questionObj.question.text.length<85){ %> \
        <span><%= questionObj.question.text %></span> \
      <%}else{ %> \
        <div class='collapse-ques-text' onclick='MCQTemplate.expandQuestion(event)'><%= questionObj.question.text %></div> \
       <% } %> \
        <% } %> \
    </div>\
    <% if ( questionObj.question.audio.length > 0 ){ %> \
      <div class='mcq-question-audio'>\
      <img class='qc-question-audio-image' src=<%=MCQTemplate.pluginInstance.addAudioIcon() %> onclick=MCQTemplate.pluginInstance.playAudio('<%= questionObj.question.audio %>') > \
        </div>\
       <% } %> \
</header>\
</div>";
},
/**
  * image will be shown in popup
  * @memberof org.ekstep.questionunit.mcq.template_controller
*/
MCQTemplate.showImageModel = function() {
  var eventData = event.target.src;
  var modelTemplate = "<div class='popup' id='image-model-popup' onclick='MCQTemplate.hideImageModel()'><div class='popup-overlay' onclick='MCQTemplate.hideImageModel()'></div> \
    <div class='popup-full-body'> \
    <div class='font-lato assess-popup assess-goodjob-popup'> \
     <img class='qc-question-fullimage' src=<%= src %> /> \
      <div onclick='MCQTemplate.hideImageModel()' class='qc-popup-close-button'>X</div> \
      <div  class='qc-popup-close-button'>X</div> \
    </div></div>";
  var template = _.template(modelTemplate);
  var templateData = template({
    src: eventData
  })
  $("#preview-mcq-template").append(templateData);
},
/**
  * onclick overlay or X button the popup will be hide
  * @memberof org.ekstep.questionunit.mcq.template_controller
*/
MCQTemplate.hideImageModel = function() {
  $("#image-model-popup").remove();
},
/**
  * question text if long then handle using ellipse
  * @memberof org.ekstep.questionunit.mcq.template_controller
  * @param {Object} event from question set.
*/
MCQTemplate.expandQuestion = function(event) {
  if ($(event.target.parentElement).hasClass('collapse-ques-text')) {
    $(event.target.parentElement).removeClass("collapse-ques-text");
    $(event.target.parentElement).addClass("qc-expand-ques-text");
    $("#mcq-question").css('height', '65vh');
  } else {
    $(event.target.parentElement).addClass("collapse-ques-text");
    $(event.target.parentElement).removeClass("qc-expand-ques-text");
    $("#mcq-question").css('height', '17.7vh');
  }
};
//# sourceURL=MCQTemplate.js