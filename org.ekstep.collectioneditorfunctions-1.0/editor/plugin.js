org.ekstep.collectioneditor.basePlugin.extend({
	initialize: function() {
		ecEditor.addEventListener(this.manifest.id + ':save', this.saveContent, this);
	},
	saveContent: function(event, data) {
		var contentBody = org.ekstep.collectioneditor.api.getService('collection').getCollectionHierarchy();
        console.log('contentBody', contentBody);
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
                    message: 'Unable to save the content, try again!',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
            data.callback && data.callback(err, res);
        });
	}
});
//# sourceURL=collectioneditorfunctions.js