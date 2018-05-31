var QS_FTBAnsTemplate = QS_FTBAnsTemplate || {};
QS_FTBAnsTemplate.htmlLayout = ' <!-- FTB answer input -->\
<% if(ansFieldConfig.keyboardType != "undefined" && (ansFieldConfig.keyboardType == "English" || ansFieldConfig.keyboardType == "Custom")) %> \
	<input type="text" class="ans-field" id="ans-field<%= ansFieldConfig.index %>" readonly style="cursor: pointer;" onclick="QS_FTBTemplate.logTelemetryInteract(event);">\
<% else %> \
	<input type="text" class="ans-field" id="ans-field<%= ansFieldConfig.index %>" onclick="QS_FTBTemplate.logTelemetryInteract(event);">';
//# sourceURL=QS_FTBAnsTemplate.js