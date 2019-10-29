var summaryTemplate = summaryTemplate || {};

summaryTemplate.showTemplate = function(){
    var template = summaryTemplate.getTemplate();
    return template;
}
summaryTemplate.getTemplate = function () {
    var summaryTemplateHTML = '<div class="popup" style="z-index: 9999999;top:0%;background-color: #fff4f4;">\
    <div class="popup-overlay">\
    </div>\
    <div class="popup-full-body-summary">\
        <div >\
            <div class="assessment-content assessment-result-content">\
                <div class="assessment-content-title">Submit your assessment to check your score.\
                </div>\
                <div class="assessment-content-description mt-16">\
                    <div class="text-center">\
                        <div>Total questions: <span class="score"><%= summaryTemplate._QSSummary.attempted.length +  summaryTemplate._QSSummary.nonAttempted.length%></span>\
                        </div>\
                        <div class="pt-8">Questions answered: <span class="score"><%= summaryTemplate._QSSummary.attempted.length %></span></div>\
                        <div class="pt-8">Questions skipped: <span class="score"><%= summaryTemplate._QSSummary.nonAttempted.length %></span></div>\
                    </div>\
                </div>\
                <div class="assessment-action-buttons mt-32">\
                  <button type="button" class="sb-btn sb-btn-normal sb-btn-outline-primary sb-btn-responsive mr-24" onclick=summaryTemplate.pluginInstance.goBackSummary()> Go Back </button>\
                  <button type="submit" class="sb-btn sb-btn-primary sb-btn-normal sb-btn-responsive" onclick=summaryTemplate.pluginInstance.submitSummary()> Submit </button>\
                </div>\
            </div>\
        </div> \
    </div> \
</div>';
    return _.template(summaryTemplateHTML);
}

//# sourceURL=summaryTemplateRenderer.js