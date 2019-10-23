var summaryTemplate = summaryTemplate || {};

summaryTemplate.showTemplate = function(){
    var template = summaryTemplate.getTemplate();
    return template;
}
summaryTemplate.getTemplate = function () {
    var summaryTemplateHTML = '<div style="width: 100%;position: absolute;top: 14%;left: 0px;height: 100%;">\
    <div class="assessment-content assessment-result-content">\
    <div class="assessment-content-title">Submit your assessment to check your score.</div>\
    <div class="assessment-content-description mt-16">\
      <div class="text-center">\
        <div>Total questions: <span class="score"><%= summaryTemplate._QSSummary.attempted.length +  summaryTemplate._QSSummary.skipped.length%></span></div>\
        <div class="pt-8">Questions attempted: <span class="score"><%= summaryTemplate._QSSummary.attempted.length %></span></div>\
        <div class="pt-8">Questions skipped: <span class="score"><%= summaryTemplate._QSSummary.skipped.length %></span></div>\
      </div>\
    </div>\
    <div class="assessment-action-buttons mt-32">\
      <button type="submit" class="sb-btn sb-btn-primary sb-btn-normal sb-btn-responsive" onclick=summaryTemplate.pluginInstance.submitSummary()> Submit </button>\
    </div>\
    </div>\
  </div>';
    return _.template(summaryTemplateHTML);
}

//# sourceURL=summaryTemplateRenderer.js