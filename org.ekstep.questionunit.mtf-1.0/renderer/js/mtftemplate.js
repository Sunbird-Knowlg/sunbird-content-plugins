var QS_MTFTemplate = {};
QS_MTFTemplate.constant = {
    parentDiv: "#preview-mtf-horizontal"
};
QS_MTFTemplate.htmlLayout = "<div class='mtf-layout'>\
  <header class='mtf-header'>\
    <div class='mtf-question-text'><%= questionObj.question.text %>\</div>\
  </header>\
  </div>\
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
  <div class='mtf-hori-container list flex flex-column list-reset'>\
  <% _.each(questionObj.option.optionsLHS,function(val,key){ %>\
    <div class='mtf-hori-option width33 mtf-lhs' id='<%= key %>'>\
      <div class='mtf-hori-ques-option'>\
        <div class='mtf-hori-ques-text'>\
          <div class='mtf-hori-ques-text-inner'></div>\
        </div>\
      </div>\
    </div>\
    <% });%>\
  </div>\
  <div class='mtf-hori-container mtf-rhs list flex flex-column list-reset'>\
  <% _.each(questionObj.option.optionsRHS,function(val1,key){ %>\
    <div class='mtf-hori-option width33' id='<%= key %>'>\
      <div class='mtf-hori-ques-option width100'>\
        <div class='mtf-hori-ques-text'>\
          <div class='mtf-hori-ques-text-inner'><%= val1.text %></div>\
        </div>\
      </div>\
    </div>\
    <% });%>\
  </div>";
    
//# sourceURL=QS_MTFTemplate.js