var QS_MTFTemplate = {}; 

QS_MTFTemplate.htmlLayout = "<div class='mtf-layout'>\
    <header class='mtf-header'>\
      <div class='mtf-question-text'><%= questionObj.question.text %>\</div>\
    </header>\
    <div class='mtf-hori-container'>\
      <% _.each(questionObj.option.optionsLHS,function(val,key){ %>\
        <div class='mtf-hori-option <%= QS_MTFTemplate.optionsWidth %>'>\
          <div class='mtf-hori-ques-option'>\
            <div class='mtf-hori-ques-text'>\
              <div class='mtf-hori-ques-text-inner'><%= val.text %></div>\
            </div>\
          </div>\
        </div>\
      <% });%>\
    </div>\
    <div class='mtf-hori-container panel panel-body' id='left'>\
      <% _.each(QS_MTFTemplate.selAns,function(val,key){ %>\
        <div class='mtf-hori-option <%= QS_MTFTemplate.optionsWidth %>'>\
          <div class='mtf-hori-ques-option'>\
            <div class='mtf-hori-ques-text'>\
              <div class='mtf-hori-ques-text-inner cont-dragula' id='left<%= (key+1) %>' leftindex='<%= val.index %>'><% if(val.selText.length > 0){ %> <p><%= val.selText  %> </p> <% }else{ %><%= val.selText %><% } %></div>\
            </div>\
          </div>\
        </div>\
      <% });%>\
    </div>\
    <div class='mtf-hori-container panel panel-body'>\
      <% _.each(questionObj.option.optionsRHS,function(val,key){ %>\
        <div class='mtf-hori-option <%= QS_MTFTemplate.optionsWidth %>'>\
          <div class='mtf-hori-ques-option'>\
            <div class='mtf-hori-ques-text'>\
              <div class='mtf-hori-ques-text-inner cont-dragula' id='right<%= (key+1) %>' mapIndex='<%= val.mapIndex %>'><% if(QS_MTFTemplate.selAns[key].selText < 1){ %> <p><%= val.text %></p> <% } %></div>\
            </div>\
          </div>\
        </div>\
      <% });%>\
    </div>\
</div>";

//# sourceURL=QS_MTFTemplate.js