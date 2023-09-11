var summaryTemplate = summaryTemplate || {};

summaryTemplate.showTemplate = function(){
    var template = summaryTemplate.getTemplate();
    return template;
}
summaryTemplate.getTemplate = function () {
    var summaryTemplateHTML = '<div class="popup" id="assess-summary"style="z-index: 9999999;top:0%;background-color: #fff4f4;">\
    <div class="assessment-overlay">\
    <div class="assessment-content assessment-result-content">\
      <div class="assessment-content-title">Submit to continue.</div>\
      <div class="assessment-content-description">\
        <div class="assessment-scorelist text-center">\
          <div class="assessment-scoreitem">Total questions: <span class="score"><%= summaryTemplate._QSSummary.attempted.length +  summaryTemplate._QSSummary.nonAttempted.length%></span></div>\
          <div class="assessment-scoreitem">Questions answered: <span class="score"><%= summaryTemplate._QSSummary.attempted.length %></span></div>\
          <div class="assessment-scoreitem">Questions skipped: <span class="score"><%= summaryTemplate._QSSummary.nonAttempted.length %></span></div>\
        </div>\
      </div>\
      <div class="assessment-action-buttons">\
        <button type="button" class="sb-btn sb-btn-normal sb-btn-outline-primary sb-btn-responsive mr-24" onclick=summaryTemplate.pluginInstance.goBackSummary()> Review </button>\
        <button type="submit" class="sb-btn sb-btn-primary sb-btn-normal sb-btn-responsive" onclick=summaryTemplate.pluginInstance.submitSummary()> Submit </button>\
      </div>\
    </div>\
  </div>\
</div>';
    return _.template(summaryTemplateHTML);
}

//# sourceURL=summaryTemplateRenderer.js