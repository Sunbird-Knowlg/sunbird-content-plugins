org.ekstep.collectioneditor.basePlugin.extend({
	initialize: function() {
		ecEditor.addEventListener(this.manifest.id + ':save', this.saveContent, this);
        ecEditor.addEventListener(this.manifest.id + ':review', this.reviewContent, this);
        ecEditor.addEventListener(this.manifest.id + ':publish', this.publishContent, this);
        ecEditor.addEventListener(this.manifest.id + ':reject', this.rejectContent, this);
	},
	saveContent: function(event, data) {
		var contentBody = org.ekstep.collectioneditor.api.getService('collection').getCollectionHierarchy();
        console.log('contentBody', contentBody);
        // validate save data
        if (!this.isValidSave()) {
            if (data.showNotification) ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: 'Please update the collection details before save',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
            data.callback && data.callback("mandatory fields are missing in the data!");
            return false;
        }

        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).saveCollectionHierarchy({ body: contentBody }, function(err, res) {
            if (res && res.data && res.data.responseCode == "OK") {
                if (data.showNotification) ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                    title: 'Content saved successfully!',                    
                    position: 'topCenter',
                    icon: 'fa fa-check-circle'
                });
                org.ekstep.collectioneditor.api.getService('collection').clearCache();
                // update node id's of collection
                ecEditor._.forIn(res.data.result.identifiers, function(newId, oldId) {
                   var node = ecEditor.getService(ServiceConstants.COLLECTION_SERVICE).getNodeById(oldId);    
                   if (node) node.data.id = newId;
                });
            } else {
                if (data.showNotification) ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Sending for review failed, please try again later...',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
            data.callback && data.callback(err, res);
        });
	},
    reviewContent: function(event, data){
        var contentId = ecEditor.getContext('contentId');
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).sendForReview({ contentId: contentId }, function(err, res) {
            if (res && res.data && res.data.responseCode == "OK") {
                ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                    title: 'Content sent for review...',                    
                    position: 'topCenter',
                    icon: 'fa fa-check-circle'
                });
            }else {
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Unable to send for review, try again!',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
            data.callback && data.callback(err, res);
        });
    },
    publishContent: function(){
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).publishContent({ contentId: ecEditor.getContext('contentId') }, function(err, res) {
        if (res && res.data && res.data.responseCode == "OK") {
            ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                title: 'Content published successfully!',                    
                position: 'topCenter',
                icon: 'fa fa-check-circle'
            });
        }else {
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: 'Unable to publish content, try again!',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
        }
        data.callback && data.callback(err, res);
    },
    rejectContent: function(){
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).rejectContent({ contentId: ecEditor.getContext('contentId') }, function(err, res) {
        if (res && res.data && res.data.responseCode == "OK") {
            ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                title: 'Content rejected successfully!',                    
                position: 'topCenter',
                icon: 'fa fa-check-circle'
            });
        }else {
            ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                message: 'Unable to reject content, try again!',
                position: 'topCenter',
                icon: 'fa fa-warning'
            });
        }
        data.callback && data.callback(err, res);
    },
    isValidSave: function() {
        var isValid = true;
        var mandatoryFields = ["name", "contentType", "description", "mimeType"];
        ecEditor._.forIn(org.ekstep.collectioneditor.cache.nodesModified, function(data, id) {
            if (data.isNew) {
                mandatoryFields.forEach(function(key) {
                    if (!data.metadata.hasOwnProperty(key)) isValid = false;
                });
            }
        });
        return isValid;
    }
});
//# sourceURL=collectioneditorfunctions.js