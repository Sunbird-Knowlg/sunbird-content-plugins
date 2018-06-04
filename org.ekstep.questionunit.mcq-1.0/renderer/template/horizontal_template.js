var MCQTemplate = MCQTemplate || {};
MCQTemplate.getHorizontalTemplate = function() {
  return "<div class='qc-option-container'> \
   <% if(questionObj.questionConfig.layout == 'Horizontal' || (questionObj.questionConfig.layout == undefined)){ %> \
     <% _.each(questionObj.options, function(val,key,index) { %> \
      <div class='qc-option-value mcq-option-value' onclick=MCQTemplate.pluginInstance.logTelemetryInteract(event);MCQTemplate.pluginInstance.selectedvalue(event,<%= key %>)> \
      <div class='qc-option-text'> \
      <% if(val.image.length>0){%> \
      <div class='qc-opt'>\
      <img class='qc-option-image' onclick='MCQTemplate.showImageModel(event)' src=<%=MCQTemplate.pluginInstance.checkBaseUrl( val.image) %>>\
      </div>\
      <% } %> \
        <% if(val.audio.length>0){%> \
      <div class='qc-opt'>\
      <img class='qc-horizontal-audio' onclick=MCQTemplate.pluginInstance.playAudio('<%= val.audio %>')  src=<%=MCQTemplate.pluginInstance.addAudioIcon(val.audio) %>>\
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