angular.module('org.ekstep.contenteditorfunctions:cefuntions', []).controller('ceFunctionsController', ['$scope', function($scope) {

    var plugin = { id: "org.ekstep.contenteditorfunctions", ver: "1.0" };
    $scope.editorState = undefined;
    $scope.telemetryService = org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE);
    $scope.lastSaved;
    $scope.popUpValues = {};

    $scope.setEditorState = function(event, data) {
        if (data) $scope.editorState = data;
    };

    $scope.reviewContent = function(event, callback) {
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
                    message: 'Sending for review failed, please try again later...',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
            callback && callback(err, res);
        });
    };

    $scope.resolveSaveFn = function(event, data) {
        var meta = ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta(ecEditor.getContext('contentId'));
        switch (meta.mimeType) {
            case "application/vnd.ekstep.ecml-archive":
                $scope.saveContent(event, data);
                break;
            case "application/vnd.ekstep.content-collection":
                $scope.saveCollectionContent(event, data);
                break;
            default:
                data.callback && data.callback("unable to resolve save call for the mimetype");                
                break;
        }
    };  

    $scope.saveContent = function(event, options) {
        console.log('Save invoked:', event, options)
        options = ecEditor._.assign({ savingPopup: true, successPopup: true, failPopup: true, callback: function(){} }, options);
        if (options.savingPopup) $scope.saveNotification('saving');

        var contentMeta = {};
        if (options.contentMeta) {
            contentMeta = options.contentMeta;
        }
        contentMeta.stageIcons = JSON.stringify(org.ekstep.contenteditor.stageManager.getStageIcons());

        org.ekstep.pluginframework.eventManager.dispatchEvent('content:before:save');
        // TODO: Show saving dialog
        var contentBody = org.ekstep.contenteditor.stageManager.toECML();
        $scope.patchContent(contentMeta, contentBody, function(err, res) {
            if (err) {
                if (res && !ecEditor._.isUndefined(res.responseJSON)) {
                    // This could be converted to switch..case to handle different error codes
                    if (res.responseJSON.params.err == "ERR_STALE_VERSION_KEY")
                        $scope.showConflictDialog(options);
                } else {
                    if(options && options.failPopup) {
                        if (!options.savingPopup) $scope.saveNotification();
                        $scope.changePopupValues('error');
                    }
                    
                }
            } else if (res && res.data.responseCode == "OK") {
                if(options && options.successPopup) {
                    if (!options.savingPopup) $scope.saveNotification();
                    $scope.changePopupValues('success');
                }
                ecEditor.dispatchEvent("org.ekstep.contenteditor:after-save", {});
            }
            if (typeof options.callback === "function") options.callback(err, res);
        }, options);
    }

    $scope.saveBrowserContent = function(event, options) {
        // Fetch latest versionKey and then save the content from browser
        $scope.fetchPlatformContentVersionKey(function(platformContentVersionKey) {
            //Invoke save function here...
            $scope.saveContent(event, options);
        });
    }

    $scope.patchContent = function(metadata, body, cb, options) {
        if (org.ekstep.contenteditor.migration.isMigratedContent()) {
            if (!metadata) metadata = {};
            metadata.oldContentBody = $scope.oldContentBody;
            metadata.editorState = JSON.stringify($scope.editorState);
            var migrationPopupCb = function(err, res) {
                if (res) $scope.contentService.saveContent(org.ekstep.contenteditor.api.getContext('contentId'), metadata, body, cb);
                if (err) options && options.callback('save action interrupted by user');
            }
            $scope.showMigratedContentSaveDialog(migrationPopupCb);
        } else {
            metadata.editorState = JSON.stringify($scope.editorState);
            $scope.contentService.saveContent(org.ekstep.contenteditor.api.getContext('contentId'), metadata, body, cb);
        }
    }

    $scope.showMigratedContentSaveDialog = function(callback) {
        var instance = $scope;
        $scope.popupService.open({
            template: ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/partials/migratedContentSaveMsg.html"),
            controller: ['$scope', function($scope) {
                $scope.saveContent = function() {
                    org.ekstep.contenteditor.migration.clearMigrationFlag();                    
                    callback(undefined, true);
                }

                $scope.enableSaveBtn = function() {
                    instance.saveBtnEnabled = true;
                    callback(true, undefined);
                }
            }],
            showClose: false,
            closeByDocument: false,
            closeByEscape: false
        });
    };

    $scope.saveNotification = function(message) {
        var template = "editor/partials/saveMessage.html";
        var config = {
            template: ecEditor.resolvePluginResource(plugin.id, plugin.ver, template),
            scope: $scope,
            showClose: false,
            closeByEscape: false,
            closeByDocument: false
        }
        console.log('config', config);
        $scope.changePopupValues(message);
        $scope.popupService.open(config);
    };

    $scope.changePopupValues = function(message) {
        if (message === 'success') {
            $scope.popUpValues.headerMsg = 'Content Saved!';
            $scope.popUpValues.popUpIcon = 'circle check green';
            $scope.popUpValues.showCloseButton = true;
            $scope.popUpValues.saveNotificationCloseButton = 'saveSuccessNotificationCloseButton';
            $scope.$safeApply();
        } else
        if (message === 'error') {
            $scope.popUpValues.headerMsg = 'Failed to save Content';
            $scope.popUpValues.popUpIcon = 'circle remove red';
            $scope.popUpValues.showCloseButton = true;
            $scope.popUpValues.saveNotificationCloseButton = 'saveFailNotificationCloseButton';
            $scope.$safeApply();
        }
        if (message === 'saving') {
            $scope.popUpValues.headerMsg = 'Saving content please wait...';
            $scope.popUpValues.showCloseButton = false;
            $scope.$safeApply();
        }
    }

    $scope.showConflictDialog = function(options) {
        var instance = $scope;
        $scope.popupService.open({
            template: ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/partials/conflictDialog.html"),
            controller: ['$scope', function($scope) {
                //Platform copy
                $scope.previewPlatformContent = function() {
                    instance.previewPlatformContent();
                };
                $scope.saveBrowserContent = function() {
                    instance.saveBrowserContent(undefined, options);
                    $scope.closeThisDialog();
                };
                //Existing copy
                $scope.previewContent = function() {
                    instance.previewContent();
                };
                $scope.refreshContent = function() {
                    instance.refreshContent();
                };
                $scope.firetelemetry = function(menu, menuType) {
                    instance.telemetryService.interact({ "type": "click", "subtype": "popup", "target": menuType, "pluginid": 'org.ekstep.contenteditorfunctions', 'pluginver': '1.0', "objectid": menu.id, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
                };
                $scope.showAdvancedOption = false;
            }],
            className: 'ngdialog-theme-plain header-conflict-dialog',
            showClose: false,
            closeByDocument: true,
            closeByEscape: true
        });
    };

    $scope.previewContent = function(fromBeginning) {
        var currentStage = _.isUndefined(fromBeginning) ? true : false;
        org.ekstep.pluginframework.eventManager.dispatchEvent("atpreview:show", { contentBody: org.ekstep.contenteditor.stageManager.toECML(), 'currentStage': currentStage });
    };

    $scope.refreshContent = function() {
        // Refresh the browser as user want to fetch the version from platform
        location.reload();
    }

    $scope.previewPlatformContent = function() {
        // Fetch latest content body from Platform and then show preview
        $scope.fetchPlatformContentBody(function(platformContentBody) {
            org.ekstep.pluginframework.eventManager.dispatchEvent("atpreview:show", { contentBody: platformContentBody, 'currentStage': true });
        });
    };

    $scope.fetchPlatformContentVersionKey = function(cb) {
        // Get the latest VersionKey and then save content
        org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE).getContentVersionKey(org.ekstep.contenteditor.api.getContext('contentId'), function(err, content) {
            if (err) {
                alert("Failed to get updated version key. Please report an issue.");
            }
            // if versionKey is available, pass success and save
            if (content.versionKey) {
                cb(content);
            }
        });
    };

    $scope.fetchPlatformContentBody = function(cb) {
        // Get the latest VersionKey and then save content
        org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE).getContent(org.ekstep.contenteditor.api.getContext('contentId'), function(err, content) {
            if (err) {
                alert("Failed to get updated content. Please report an issue.");
            }
            if (content && content.body) {
                try {
                    var contentBody = JSON.parse(content.body);
                    cb(contentBody);
                } catch (e) {
                    alert("Failed to parse body from platform. Please report an issue.");
                    //contentBody = $scope.convertToJSON(content.body);
                }
            }
        });
    };

    $scope.publishContent = function(event, data) {
        var contentId = ecEditor.getContext('contentId');
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).publishContent({ contentId:  contentId}, function(err, res) {
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
        });
    };

    $scope.rejectContent = function(event, data){
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
        });
    };

    $scope.acceptContentFlag = function(event, data){
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).acceptContentFlag({ contentId: ecEditor.getContext('contentId') }, function(err, res) {
            if (res && res.data && res.data.responseCode == "OK") {
                ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                    title: 'Content flag accepted successfully!',                    
                    position: 'topCenter',
                    icon: 'fa fa-check-circle'
                });
            }else {
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Unable to accept content flag, try again!',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
            data.callback && data.callback(err, res);
        });
    }

    $scope.discardContentFlag = function(event, data){
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).discardContentFlag({ contentId: ecEditor.getContext('contentId') }, function(err, res) {
            if (res && res.data && res.data.responseCode == "OK") {
                ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                    title: 'Content flag discarded successfully!',                    
                    position: 'topCenter',
                    icon: 'fa fa-check-circle'
                });
            }else {
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Unable to discard content flag, try again!',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
            data.callback && data.callback(err, res);
        });
    };

    $scope.retireContent = function(event, data){
        ecEditor.getService(ServiceConstants.CONTENT_SERVICE).retireContent({ contentId: ecEditor.getContext('contentId') }, function(err, res) {
            if (res && res.data && res.data.responseCode == "OK") {
                ecEditor.dispatchEvent("org.ekstep.toaster:success", {
                    title: 'Content retired successfully!',                    
                    position: 'topCenter',
                    icon: 'fa fa-check-circle'
                });
            }else {
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Unable to retire content, try again!',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
            data.callback && data.callback(err, res);
        });
    };

    $scope.saveCollectionContent = function(event, data) {
        data = data || {};
        var contentBody = org.ekstep.collectioneditor.api.getService('collection').getCollectionHierarchy();
        if (contentBody) {
            //angular.toJson to remove $$hashKey from scope object
            contentBody = JSON.parse(angular.toJson(contentBody));
        }
        console.log('contentBody', contentBody);

        var isValidSave = function() {
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

        // validate save data
        if (!isValidSave()) {
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
                    message: 'Unable to save the content, try again!',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
            }
            data.callback && data.callback(err, res);
        });
    };

    ecEditor.addEventListener('org.ekstep.editorstate:state', $scope.setEditorState, $scope);    
    ecEditor.addEventListener('org.ekstep.contenteditor:save', $scope.resolveSaveFn, $scope);
    ecEditor.addEventListener('org.ekstep.contenteditor:preview', function(event, data) {
        $scope.previewContent(data.fromBeginning);
    }, $scope);
    ecEditor.addEventListener('org.ekstep.contenteditor:save:force', $scope.saveBrowserContent, $scope);
    ecEditor.addEventListener('org.ekstep.contenteditor:review', $scope.reviewContent, $scope);
    ecEditor.addEventListener("org.ekstep.contenteditor:publish", $scope.publishContent, $scope);
    ecEditor.addEventListener("org.ekstep.contenteditor:reject", $scope.rejectContent, $scope);
    ecEditor.addEventListener("org.ekstep.contenteditor:acceptFlag", $scope.acceptContentFlag, $scope);
    ecEditor.addEventListener("org.ekstep.contenteditor:discardFlag", $scope.discardContentFlag, $scope);
    ecEditor.addEventListener("org.ekstep.contenteditor:retire", $scope.retireContent, $scope);


}]);