var MCQTemplate = MCQTemplate || {};
MCQTemplate.getGridTemplate = function () {
  return "<div class='qc-grid-option-container'>\
        <% _.each(question.data.topOptions, function(val,key,index) { %> \
<div class='qc-grid-option-outer-value'> \
<div class='qc-grid-option-value'> \
  <div class='qc-grid-option-text-outer' id=<%=key%>  onclick=MCQTemplate.pluginInstance.logTelemetryInteract(event);MCQTemplate.checkOptioninGrid(<%=val.keyIndex%>);MCQTemplate.pluginInstance.selectedvalue(event,<%=val.keyIndex%>) id='option'> \
  <div class='mcq-selected-option'></div> \
      <div class='qc-grid-option-text'>\
              <% if(val.option.audio.length > 0 && val.option.image.length == 0){%> \
          <div class='qc-opt'>\
                   <img class='qc-vertical-audio-with-image' onclick=MCQTemplate.pluginInstance.playAudio('<%= val.option.audio %>')  src=<%=MCQTemplate.pluginInstance.checkBaseUrl() %>>\
          </div>\
                <%}%> \
                  <% if(val.option.image.length>0){%> \
         <div class='qc-opt'>\
                  <img class='qc-grid-option-image' onclick='MCQTemplate.showImageModel(event)' src=<%=MCQTemplate.pluginInstance.checkBaseUrl( val.option.image) %>>\
         </div>\
                   <%}%> \
                 <% if(val.option.image.length == 0 && val.option.audio.length == 0){%> \
         <div class='qc-opt'>\
                 <%=val.option.text%> \
        </div>\
                <%}%> \
      </div>\
            <div class='qc-option-grid-checkbox'> \
                                <div class='grid-check-space'> \
                                    <input type='radio' name='radio' value='pass' class='qc-option-input-checkbox'> \
                                </div> \
                 <% if(val.option.audio.length>0 && val.option.image.length > 0){%> \
               <div>\
                      <img class='qc-grid-audio-with-image' onclick=MCQTemplate.pluginInstance.playAudio('<%= val.option.audio %>')  src=<%=MCQTemplate.pluginInstance.checkBaseUrl() %>>\
               </div>\
                <%}%> \
            </div>\
  </div> \
  </div> \
  </div> \
            <% }); %> \
</div> \
<div class='qc-grid-option-container'> \
<% if(question.data.bottomOptions.length != 0){%>\
  <div class='qc-grid-option-container'>\
  <% _.each(question.data.bottomOptions, function(val,key,index) { %> \
<div class='qc-grid-option-outer-value'> \
<div class='qc-grid-option-value'> \
  <div class='qc-grid-option-text-outer mcq-option-value' id=<%=key%> onclick=MCQTemplate.pluginInstance.logTelemetryInteract(event);MCQTemplate.checkOptioninGrid(<%=val.keyIndex%>);MCQTemplate.pluginInstance.selectedvalue(event,<%=val.keyIndex%>) id='option'> \
  <div class='mcq-selected-option'></div> \
      <div class='qc-grid-option-text'>\
              <% if(val.option.audio.length > 0 && val.option.image.length == 0){%> \
          <div class='qc-opt'>\
                   <img class='qc-vertical-audio-with-image' onclick=MCQTemplate.pluginInstance.playAudio('<%= val.option.audio %>')  src=<%=MCQTemplate.pluginInstance.checkBaseUrl(val.option.audio) %>>\
          </div>\
                <%}%> \
                  <% if(val.option.image.length>0){%> \
         <div class='qc-opt'>\
                  <img class='qc-grid-option-image' onclick='MCQTemplate.showImageModel(event)' src=<%=MCQTemplate.pluginInstance.checkBaseUrl( val.option.image) %>>\
         </div>\
                   <%}%> \
                 <% if(val.option.image.length == 0 && val.option.audio.length == 0){%> \
         <div class='qc-opt'>\
                 <%=val.option.text%> \
        </div>\
                <%}%> \
      </div>\
            <div class='qc-option-grid-checkbox'> \
                                <div class='grid-check-space'> \
                                    <input type='radio' name='radio' value='pass' class='qc-option-input-checkbox'> \
                                </div> \
                 <% if(val.option.audio.length>0 && val.option.image.length > 0){%> \
               <div>\
                      <img class='qc-grid-audio-with-image' onclick=MCQTemplate.pluginInstance.playAudio('<%= val.option.audio %>')  src=<%=MCQTemplate.pluginInstance.checkBaseUrl() %>>\
               </div>\
                <%}%> \
            </div>\
  </div> \
  </div> \
  </div> \
            <% }); %> \
</div> \
<%}%>\
      </div>";
};
MCQTemplate.checkOptioninGrid = function (index) {
  $(".mcq-selected-option").removeClass("mcq-option-checked");
  $('.mcq-selected-option').eq(index).addClass('mcq-option-checked');
};