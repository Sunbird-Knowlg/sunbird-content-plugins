var MCQTemplate = MCQTemplate || {};
MCQTemplate.getVerticalTemplate = function () {
  return "<div class='qc-vertical-option-container'> \
  <table class='qc-vertical-option-table'> \
  <tr class='qc-vertical-option-outer'> \
  <% _.each(question.data.options, function(val,key,index) { %> \
   <td class='qc-vertical-option-td mcq-option-value' onclick=MCQTemplate.pluginInstance.logTelemetryInteract(event);MCQTemplate.checkOptioninVertical('<%= key %>');MCQTemplate.pluginInstance.selectedvalue(event,'<%= key %>')> \
   <div class='qc-vertical-option-value'> \
   <div class='mcq-selected-option'></div> \
   <div id=<%=key%> class='qc-option-vertical-text'> \
    <% if(val.audio.length > 0 && val.image.length == 0){%> \
      <div> \
       <img class='qc-vertical-audio-with-image' onclick=MCQTemplate.pluginInstance.playAudio('<%= val.audio %>')  src=<%=MCQTemplate.pluginInstance.checkBaseUrl() %>>\
      </div> \
      <%}%> \
    <% if(val.image.length>0){%> \
      <div class='qc-opt'> \
       <img class='qc-vertical-option-image' onclick='MCQTemplate.showImageModel(event)' src=<%=MCQTemplate.pluginInstance.checkBaseUrl( val.image) %>>\
      </div> \
      <%}%> \
      <% if(val.image.length == 0 && val.audio.length == 0) {%> \
         <div class='qc-option-txt' class='qc-opt'> \
         <%=val.text%> \
          </div>\
      <%}%> \
   </div> \
    <div class='qc-option-vertical-checkbox'> \
     <div> \
      <input type='radio' name='radio' value='pass' class='qc-option-input-checkbox' onclick=MCQTemplate.pluginInstance.logTelemetryInteract(event);MCQTemplate.pluginInstance.selectedvalue(event,'<%= key %>') id='option'> \
     </div> \
     <% if(val.audio.length > 0 && val.image.length > 0){%> \
      <div> \
       <img class='qc-horizontal-audio' onclick=MCQTemplate.pluginInstance.playAudio('<%= val.audio %>')  src=<%=MCQTemplate.pluginInstance.checkBaseUrl() %>>\
     </div>\
     <%}%> \
   </div> \
   </div> \
   </td> \
    <% }); %> \
  </tr> \
   </div> \
  </table> \
  </div>";
};
MCQTemplate.checkOptioninVertical = function (index) {
  $(".mcq-selected-option").removeClass("mcq-option-checked");
  $('.mcq-selected-option').eq(index).addClass('mcq-option-checked');
};