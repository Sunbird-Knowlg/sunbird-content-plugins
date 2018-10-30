/**
 * Plugin to get comments from portal
 * @class reviewerComments
 * @constructor
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Revathi P 
 * @listens stage:select
 * @listens stage:render:complete
 */

org.ekstep.contenteditor.basePlugin.extend({
    initialize: function () {
        ecEditor.addEventListener("stage:select", this.initializeComments, this);
        ecEditor.addEventListener("stage:render:complete", this.showComments, this)
    },
    initializeComments: function (event, callback) {
        var instance = this;
        if (instance.comments == undefined) {
            this.context = org.ekstep.contenteditor.globalContext;
            if (!ecEditor._.isUndefined(this.context)) {
                if (!ecEditor._.isUndefined(this.context.contentId) && this.context.contentId != "") {
                    var instance = this;
                    var data = {
                        "request": {
                            "contextDetails": {
                                'cotentId': this.context.contentId
                            }
                        }
                    };
                    //Do Api call and get the response  
                    ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getComments(data, function (error, response) {
                        if (!error) {

                            //Loop through the response and generate the comments Thread
                            instance.comments = response.data.result.comments
                            instance.showComments();
                        }
                    });
                }
            }
        }
    },
    //Show comments after getting the apiResponse
    showComments: function () {
        var instance = this;
        var sortedComments = {}
        if (instance.comments !== undefined && instance.comments.length > 0) {
            //Display the comments by filtering the stage id from the instance.comments
            var filtered_comments = _.filter(instance.comments, ['stageId', ecEditor.getCurrentStage().id]);
            if (filtered_comments.length == 0) {
                instance.displayNoComments();
            } else {
                sortedComments = _.sortBy(filtered_comments, function (dateObj) {
                    return new Date(dateObj.createdOn);
                });
                instance.mapComment(sortedComments);
            }
        } else {
            instance.displayNoComments();
        }
    },
    //To show the 'No review message to the user
    displayNoComments: function () {
        jQuery('a[data-content ="comments"]').removeClass('highlight');
        jQuery('#reviewerComments').html('<div>No review comments</div>');
    },
    //Function to format the date 
    getMonthName: function (date) {
        var date = new Date(date);
        return date.toLocaleString('en-us', {
            month: "long"
        }).toString().substr(0, 3) + " " + date.getDate();
    },
    //To map the comments from the apiResponse
    mapComment: function (sortedComments) {
        var instance = this;
        displayComments = [];
        var result = _.map(sortedComments, function (item) {
            var commentThread = {};
            commentThread.username = item.userInfo.name
            commentThread.logo = item.userInfo.logo ? item.userInfo.logo : ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/reviewer_icon.png");
            commentThread.username = item.userInfo.name;
            commentThread.date = instance.getMonthName(item.createdOn);
            commentThread.body = item.body
            commentThread.stageId = item.stageId
            displayComments.push(commentThread);
        });
        //update the mapped comments to the template
        instance.displayStageComments(displayComments);
    },

    displayStageComments: function (displayComments) {
        var commentTemplate = _.template(
            '<% _.each(displayComments, function(item) { %>' +
            '<div class="comment"> ' +
            '<div class="avatar"><img src= " <%-item.logo %> "/></div>' +
            '<div class="content"><div class="flex-class"><span class="author"><%- item.username %></span>' +
            '<span class="date"><%- item.date %> </span></div>' +
            '<div class="text"> <%-item.body  %> ' +
            '</div></div></div>' +
            '<% }); %>');

        //Add highlight class to the comments tab
        ecEditor.jQuery('a[data-content ="comments"]').addClass('highlight');
        ecEditor.jQuery('#reviewerComments').html(commentTemplate);
    }
});
//# sourceURL=reviewercomments.js