var MCQController = MCQController || {};
MCQController.initTemplate = function (pluginInstance) {
  MCQController.pluginInstance = pluginInstance;
};
MCQController.loadTemplateContent = function () {
  return "<div id='qs-mcq-template'><div id='qc-mcqlayout'></div></div>";
},
  MCQController.renderQuestion = function () {
    var template = _.template(MCQController.getQuesLayout());
    $("#qc-mcqlayout").html(template({
      question: MCQController.pluginInstance._question
    }));
    MCQController.renderTemplateLayout(MCQController.pluginInstance._question);
  },
  /**
   * render template using underscore
   * @param {Object} question from question set.
   * @memberof org.ekstep.questionunit.mcq.template_controller
   */
  MCQController.renderTemplateLayout = function (question) {
    var layout = question.config.layout;
    var template;
    switch (layout) {
      case "Grid":
        template = _.template(MCQController.getGridTemplate(question));
        break;
      case "Horizontal":
        template = _.template(MCQController.getHorizontalTemplate(question));
        break;
      case "Vertical":
        template = _.template(MCQController.getVerticalTemplate(question));
        break;
      default:
        template = _.template(MCQController.getHorizontalTemplate(question));
    }
    $("#qc-mcqlayout").append(template({
      question: question
    }));
  },
  /**
   * This question layout is common for all the template
   * @memberof org.ekstep.questionunit.mcq.template_controller
   * @returns {String} template.
   */
  MCQController.getQuesLayout = function () {
    return "<div id='mcq-question-header'> \
 <header id='mcq-question'> \
 <% if ( question.data.question.image.length > 0 ){ %> \
    <div class='question-image'>\
      <img class='mcq-question-image' onclick='MCQController.showImageModel(event)' src=<%=MCQController.pluginInstance.getAssetUrl( question.data.question.image) %>> \
    </div>\
     <% } %> \
    <div class='mcq-question-text'>\
    <% if ( question.data.question.text.length > 0 ){ %> \
      <% if(question.data.question.text.length<85){ %> \
        <span><%= question.data.question.text %></span> \
      <%}else{ %> \
        <div class='collapse-ques-text' onclick='MCQController.expandQuestion(event)'><%= question.data.question.text %></div> \
       <% } %> \
        <% } %> \
    </div>\
    <% if ( question.data.question.audio.length > 0 ){ %> \
      <div class='mcq-question-audio'>\
      <img class='qc-question-audio-image' src=<%=MCQController.pluginInstance.getAudioIcon() %> onclick=MCQController.pluginInstance.playAudio('<%= question.data.question.audio %>') > \
        </div>\
       <% } %> \
</header>\
</div>";
  },
  /**
   * image will be shown in popup
   * @memberof org.ekstep.questionunit.mcq.template_controller
   */
  MCQController.showImageModel = function () {
    var eventData = event.target.src;
    var modelTemplate = "<div class='popup' id='image-model-popup' onclick='MCQController.hideImageModel()'><div class='popup-overlay' onclick='MCQController.hideImageModel()'></div> \
    <div class='popup-full-body'> \
    <div class='font-lato assess-popup assess-goodjob-popup'> \
     <img class='qc-question-fullimage' src=<%= src %> /> \
      <div onclick='MCQController.hideImageModel()' class='qc-popup-close-button'>X</div> \
      <div  class='qc-popup-close-button'>X</div> \
    </div></div>";
    var template = _.template(modelTemplate);
    var templateData = template({
      src: eventData
    })
    $("#qs-mcq-template").append(templateData);
  },
  /**
   * onclick overlay or X button the popup will be hide
   * @memberof org.ekstep.questionunit.mcq.template_controller
   */
  MCQController.hideImageModel = function () {
    $("#image-model-popup").remove();
  },
  /**
   * question text if long then handle using ellipse
   * @memberof org.ekstep.questionunit.mcq.template_controller
   * @param {Object} event from question set.
   */
  MCQController.expandQuestion = function (event) {
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
//# sourceURL=MCQController.js