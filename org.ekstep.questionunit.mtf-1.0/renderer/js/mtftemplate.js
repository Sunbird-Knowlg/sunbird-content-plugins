var QS_MTFTemplate = {};
QS_MTFTemplate.constant = {
    parentDiv: "#preview-mtf-horizontal"
};
//QS_MTFTemplate.rhsData = shuffleRHSOptions();
QS_MTFTemplate.htmlLayout = "<div class='mtf-layout'>\
    <header class='mtf-header'>\
      <div class='mtf-question-text'><%= questionObj.question.text %>\</div>\
    </header>\
    <div class='mtf-hori-container'>\
      <% _.each(questionObj.option.optionsLHS,function(val,key){ %>\
        <div class='mtf-hori-option width33'>\
          <div class='mtf-hori-ques-option'>\
            <div class='mtf-hori-ques-text'>\
              <div class='mtf-hori-ques-text-inner'><%= val.text %></div>\
            </div>\
          </div>\
        </div>\
      <% });%>\
    </div>\
    <div class='mtf-hori-container panel panel-body'>\
      <% _.each(questionObj.option.optionsLHS,function(val,key){ %>\
        <div class='mtf-hori-option width33'>\
          <div class='mtf-hori-ques-option'>\
            <div class='mtf-hori-ques-text'>\
              <div class='mtf-hori-ques-text-inner cont-dragula' id='left<%= (key+1) %>'></div>\
            </div>\
          </div>\
        </div>\
      <% });%>\
    </div>\
    <div class='mtf-hori-container panel panel-body'>\
      <% _.each(questionObj.option.optionsRHS,function(val,key){ %>\
        <div class='mtf-hori-option width33'>\
          <div class='mtf-hori-ques-option'>\
            <div class='mtf-hori-ques-text'>\
              <div class='mtf-hori-ques-text-inner cont-dragula' id='right<%= (key+1) %>' mapIndex='<%= val.mapIndex %>'><p><%= val.text %></p></div>\
            </div>\
          </div>\
        </div>\
      <% });%>\
    </div>\
</div>";

function shuffleRHSOptions(){
  debugger;
  //console.log("Sorting======",questionObj.option.optionsRHS.sort(() => Math.random() - 0.5));
}
//# sourceURL=QS_MTFTemplate.js