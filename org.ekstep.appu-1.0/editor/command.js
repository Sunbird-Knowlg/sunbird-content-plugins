var processOtherCommands = function(text){

}
var executeCommand = function(text){
    commands = [
        {action: "get content", view: "portal", api: "search?_key_=_value_"},
        {action: "get images", view: "editor"},
        {action: "get audios", view: "editor"},
        {action: "get questions", view: "editor"}
    ];
    text = text.toLowerCase();
    text = text.trim();
    var viewCommands = _.map(commands, function(obj){ if(obj.view == "editor") return obj});
    var editorActions = _.map(viewCommands, "action");
    var action = _.forEach(editorActions, function(value) {
        if(text.indexOf(value) >= 0){
            return value;
        }
        
      });
    //var validCommand =  _.indexOf(editorActions, text)
    if(action){
        var commandQuery = text.replace(action, '').trim(); //text.substr(_.lastIndexOf(editorActions, text), text.length);
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
        hanldeQuery(action, key, value);
    } else {
        // show message, invalid command please try again
    }

    

    switch(action) {
        
     case 'hi':
     case 'hello':
     case 'hey':
     case 'hi appu':
     case 'hello appu':
     case 'hey appu':
     case 'appu':
     {
         console.log('Hi,This is Appu,What can i do for you....');
     }
     break;

     case 'get all crow images':
     ecEditor && ecEditor.dispatchEvent('org.ekstep.image:assetbrowser:open');
     setTimeout(function(){         
         $('#allImagesTab').click();
         $("#searchAllImageAssets").val("crow");
         $('#searchAllImageAssets').parent().children('i').click();
     },3000);
     break;

     default:
     console.log('Enter valid command');
     break;
 } 
}

function hanldeQuery(action, key, value){
    var api = _map(commands, function(obj){
        if(obj.action == action) return obj.api;
    });

    api.replace('_key_', key);
    api.replace('_value_', value);
}