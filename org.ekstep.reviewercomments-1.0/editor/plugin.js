/**
 * Plugin to get comments from portal
 * @class reviewerComments
 * @constructor
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Revathi P 
 * @listens stage:select
 */

org.ekstep.contenteditor.basePlugin.extend({
    initialize: function() {
        ecEditor.addEventListener("stage:select", this.initShowComments, this);
    },
    initShowComments: function(event, data) {
        ctrl = this;           
        ctrl.initializeComments();     
        ctrl.context = org.ekstep.contenteditor.globalContext;
        ctrl.initializeComments = function() { 
            // If context is not undefined and contentId is not null
            // Call getReviewComments function to get the comments 
            instance.getReviewComments(data);
                // where data is var data = {
                //             "request":{
                //                 "contextDetails":{
                //                     "contentId":"do_1126123493235097601168",
                //                     "version":"1539593562554",
                //                     "contentType":"application/vnd.ekstep.ecml-archive",
                //                     "stageId":""
                //                 }
                //             }
                //         };
           },
        ctrl.getReviewComments = function(data, callback) {
            //Do Api call and get the response  
            
            if (!error) {
                instance.response = response;
            //Loop through the response and generate the comments Thread
            }
            callback();
      
    }
}
});
//# sourceURL=reviewercomments.js
