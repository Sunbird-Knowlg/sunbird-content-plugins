var MCQController = MCQController || {};
MCQController.getHorizontalTemplate = function () {
  return "<div class='qc-option-container'> \
   <% if(question.config.layout == 'Horizontal' || (question.config.layout == undefined)){ %> \
     <% _.each(question.data.options, function(val,key,index) { %> \
      <div class='qc-option-value mcq-option-value' onclick=MCQController.pluginInstance.logTelemetryInteract(event);MCQController.pluginInstance.selectedvalue(event,<%= key %>)> \
      <div class='qc-option-text'> \
      <% if(val.image.length>0){%> \
      <div class='qc-opt'>\
      <img class='qc-option-image' onclick='MCQController.showImageModel(event)' src=<%=MCQController.pluginInstance.checkBaseUrl( val.image) %>>\
      </div>\
      <% } %> \
        <% if(val.audio.length>0){%> \
      <div class='qc-opt'>\
      <img class='qc-horizontal-audio' onclick=MCQController.pluginInstance.playAudio('<%= val.audio %>')  src=<%=MCQController.pluginInstance.checkBaseUrl() %>>\
      </div>\
      <% } %> \
        <% if(val.audio.length>0 || val.image.length>0){%> \
      <div class='qc-opt'> \
      <span class='qc-option-txt'> \
      <%=val.text%> \
      </span> \
       </div>\
        <% }else{ %>  \
            <div class='qc-opt qc-option-txt-only'> \
      <%=val.text%> \
       </div>\
      <%}%> \
         </div> \
        <div class='qc-option-checkbox'> \
          <input type='radio' name='radio' value='pass' class='qc-option-input-checkbox' id='option'> \
        </div> \
        </div> \
       <% }); %> \
    <% } %> \
</div>";
};