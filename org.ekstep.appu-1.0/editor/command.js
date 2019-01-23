var processOtherCommands = function(text){

}
var executeCommand = function(text){
    commands = [
        {action: "get content", view: "portal", event: ""},
        {action: "get images", view: "editor", event: "openImageBrowser",type:'image'},
        {action: "get audios", view: "editor", event: "openAudioBrowser",type:'audio'},
        {action: "get questions", view: "editor" , event: "openQuestionBrowser"}
    ];
    text = text.toLowerCase();
    text = text.trim();
    var selectedAction;
    _.forEach(commands, function(command) {
        if(text.indexOf(command.action) >= 0 && command.view == window.screenView){
            selectedAction = command;
            return false;
        }        
      });
    //var validCommand =  _.indexOf(editorActions, text)
    if(selectedAction){
        var commandQuery = text.replace(selectedAction.action, '').trim(); //text.substr(_.lastIndexOf(editorActions, text), text.length);
        _.each(['for', 'of'], function(value){ 
            if(_.indexOf(commandQuery, value)) {
                commandQuery = commandQuery.replace(value, '').trim()
            }
        });

        queryParams = commandQuery.split(" ");

        var value, key =  '';
        if(queryParams.length == 1){
            value = queryParams[0];
        } else {
            value = queryParams[0]
            key = queryParams[1]
        }
        hanldeQuery(selectedAction, key, value);
    } else {
        var evData = {message:'Invalid command'};
        ecEditor.dispatchEvent('org.ekstep.appu:message',evData);
    }
 
}

function hanldeQuery(item, key, value){
    console.log('------------handleQuery :', key , value);
    if(item && item.event != "" && value){
        ecEditor.dispatchEvent('org.ekstep.appu:stopSpeechListener');
        var evData = {key:key,value:value,item:item};
        ecEditor.dispatchEvent('org.ekstep.appu:'+item.event,evData);
        
    }
}

ecEditor.addEventListener("org.ekstep.appu:openQuestionBrowser", function(event, data){
    ecEditor.dispatchEvent("org.ekstep.questionbank:showpopup", {'topic': data.key, 'value': data.value});
}, this);