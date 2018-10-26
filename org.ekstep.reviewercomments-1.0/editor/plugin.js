/**
 * Plugin to get comments from portal
 * @class reviewerComments
 * @constructor
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Revathi P 
 * @listens stage:select
 */

org.ekstep.contenteditor.basePlugin.extend({
    isApiCalled: false,
    initialize: function () {
        ecEditor.addEventListener("stage:select", this.initShowComments, this);
        this.initShowComments();
    },
    initShowComments: function (event) {
        var instance = this;
        this.callAPI(function () {
            setTimeout(function () {
                instance.initializeComments();
            }, 1000);
        });
    },
    callAPI: function (callback) {
        var instance = this;
        if (!instance.isApiCalled) {
            this.context = org.ekstep.contenteditor.globalContext;
            if (!ecEditor._.isUndefined(this.context)) {
                if (!ecEditor._.isUndefined(this.context.contentId) && this.context.contentId != "") {
                    var instance = this;
                    var data = {
                    };
                    //Do Api call and get the response  
                    ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getComments(data, function (error, response) {
                        if (!error) {
                            this.items = [];
                            instance.response = response;
                            //Loop through the response and generate the comments Thread
                            instance.comments = instance.response.data.result.comments
                            instance.isApiCalled = true;
                            callback();
                        }
                    });
                }
            }
        } else {
            callback();
        }
    },

    initializeComments: function () {
        // console.log('event:', event)
        var instance = this;
        var items = [];
        if (instance.comments !== undefined) {
            //Display the comments by filtering the stage id from the instance.comments
            var filtered_comments = _.filter(instance.comments, ['stageId', ecEditor.getCurrentStage().id]);

            sortedComments = _.sortBy(filtered_comments, function (dateObj) {
                return new Date(dateObj.createdOn);
            });
            if (filtered_comments.length == 0) {
                jQuery('#reviewerComments').html('<div>No review comments</div>');
                jQuery('a[data-content ="comments"]').removeClass('highlight');
            } else {
                ecEditor._.forEach(sortedComments, function (value, key) {
                    item = {};
                    item = value;
                    if (item.stageId === ecEditor.getCurrentStage().id) {
                        var date = new Date(item.createdOn);
                        let getMonthName = date.toLocaleString('en-us', {
                            month: "long"
                        });
                        var logoImage = item.userInfo.logo ? item.userInfo.logo : ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'assets/reviewer_icon.png')
                        var commentThread = " <div class='comment'><a class='avatar'> <img src='" + logoImage + "'></a>" +
                            "<div class='content'><div class='flex-class'><a class='author'>" + item.userInfo.name + "</a> " +
                            "<span class='date'>" + getMonthName.toString().substr(0, 3) + " " + date.getDate() + "</span></div><div class='text'>" +
                            item.body
                            + " </div> </div> </div>";
                        items.push(commentThread);
                        //Add highlight class to the comments tab
                        jQuery('a[data-content ="comments"]').addClass('highlight');
                    }
                });
                jQuery('#reviewerComments').html(items);
            }

            ecEditor.jQuery("#reviewerCommentsLoader").removeClass('active');
        } else {
            jQuery('#reviewerComments').html('<div>No review comments</div>');
        }
    }
});
//# sourceURL=reviewercomments.js
