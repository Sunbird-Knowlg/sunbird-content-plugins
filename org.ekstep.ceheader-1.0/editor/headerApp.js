angular.module('org.ekstep.ceheader:headerApp', []).controller('mainController', ['$scope', function($scope) {

    var plugin = { id: "org.ekstep.ceheader", ver: "1.0" }, lastSavedTime;
    $scope.editorState = undefined;
    $scope.saveBtnEnabled = true;
    $scope.userDetails = !_.isUndefined(window.context) ? window.context.user : undefined;
    $scope.telemetryService = org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE);
    $scope.ekstepLogo = ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/images/ekstep_logo_white.png");
    $scope.internetStatusObj = {
        'status':navigator.onLine,
        'text': 'Internet Connection not available'
    };
    $scope.lastSaved;
    $scope.popUpValues = {};

    $scope.setEditorState = function(event, data) {
        if (data) $scope.editorState = data;
    };


    $scope.saveContent = function(event, options) {
        options = options || { savingPopup: true, successPopup: true, failPopup: true, callback: function(){} };
        if ($scope.saveBtnEnabled) {
            if (options.savingPopup) $scope.saveNotification('saving');
            $scope.saveBtnEnabled = false;
            org.ekstep.pluginframework.eventManager.dispatchEvent('content:before:save');
            // TODO: Show saving dialog
            var contentBody = org.ekstep.contenteditor.stageManager.toECML();
            $scope.patchContent({ stageIcons: JSON.stringify(org.ekstep.contenteditor.stageManager.getStageIcons()) }, contentBody, function(err, res) {
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
                    lastSavedTime = new Date(Date.now());
                    $scope.calculateSaveTime();
                    if(options && options.successPopup) {
                        if (!options.savingPopup) $scope.saveNotification();
                        $scope.changePopupValues('success');
                    }
                }
                $scope.saveBtnEnabled = true;
                if (typeof options.callback === "function") options.callback(err, res);
            }, options);
        }
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

    $scope.routeToContentMeta = function(save) {
        if (save) {
            org.ekstep.pluginframework.eventManager.dispatchEvent('content:before:save');
            var contentBody = org.ekstep.contenteditor.stageManager.toECML();
            $scope.patchContent({ stageIcons: JSON.stringify(org.ekstep.contenteditor.stageManager.getStageIcons()) }, contentBody, function(err, res) {
                if (res) {
                    $scope.saveNotification();
                    $scope.changePopupValues('success');
                    window.location.assign(window.context.editMetaLink);
                }
                if (err) {
                    $scope.saveNotification();
                    $scope.changePopupValues('error');
                };
            });
        } else {
            window.location.assign(window.context.editMetaLink);
        }
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
                    instance.telemetryService.interact({ "type": "click", "subtype": "popup", "target": menuType, "pluginid": 'org.ekstep.ceheader', 'pluginver': '1.0', "objectid": menu.id, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
                };
                $scope.showAdvancedOption = false;
            }],
            className: 'ngdialog-theme-plain header-conflict-dialog',
            showClose: false,
            closeByDocument: true,
            closeByEscape: true
        });
    };

    $scope.editContentMeta = function() {
        var config = {
            template: ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/partials/editContentMetaDialog.html"),
            controller: ['$scope', 'mainCtrlScope', function($scope, mainCtrlScope) {
                $scope.routeToContentMeta = function(save) {
                    $scope.closeThisDialog();
                    mainCtrlScope.routeToContentMeta(save);
                }

                $scope.fireTelemetry = function(data) {
                    mainCtrlScope.telemetryService.interact({ "type": "click", "subtype": data.subtype, "target": data.target, "pluginid": 'org.ekstep.ceheader', 'pluginver': '1.0', "objectid": data.id, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
                }
            }],
            resolve: {
                mainCtrlScope: function() {
                    return $scope;
                }
            },
            showClose: false
        };

        org.ekstep.contenteditor.api.getService('popup').open(config);
    }

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

    $scope.fireEvent = function(event) {
        if (event) org.ekstep.contenteditor.api.dispatchEvent(event.id, event.data);
    };

    $scope.fireTelemetry = function(menu, menuType) {
        $scope.telemetryService.interact({ "type": "click", "subtype": "menu", "target": menuType, "pluginid": 'org.ekstep.ceheader', 'pluginver': '1.0', "objectid": menu.id, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
    };

    $scope.internetStatusFn = function(event) {
        $scope.$safeApply(function() {
            $scope.internetStatusObj.status = navigator.onLine;
        })
    };

    $scope.calculateSaveTime = function() {
        if (lastSavedTime) {
            var seconds = Math.floor((new Date() - lastSavedTime) / 1000);
            var interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                $scope.lastSaved = "Last Saved: "+ interval + " days ago";
                $scope.$safeApply();
                return 
            }
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
                $scope.lastSaved = "Last Saved: " + interval + " hours ago";
                $scope.$safeApply();
                return;
            }
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                $scope.lastSaved = "Last Saved: " + interval + " minutes ago";
                $scope.$safeApply();
                return;
            }
            $scope.lastSaved = "Last Saved: " + Math.floor(seconds) + " seconds ago";
            $scope.$safeApply();
        }
    };

    setInterval($scope.calculateSaveTime, 60000)

    $scope.setSaveStatus = function() {
        if (!lastSavedTime) {
            $scope.lastSaved = 'You have unsaved changes';
            $scope.$safeApply();
            ecEditor.removeEventListener('object:modified',  $scope.setSaveStatus, $scope);
        }
    }

    window.onbeforeunload = function(e) {
        return "You have unsaved unsaved changes";
    }
    window.addEventListener('online',  $scope.internetStatusFn, false);
    window.addEventListener('offline', $scope.internetStatusFn, false);
    ecEditor.addEventListener('object:modified', $scope.setSaveStatus, $scope);
    ecEditor.addEventListener('org.ekstep.editorstate:state', $scope.setEditorState, $scope);
    ecEditor.addEventListener('org.ekstep.ceheader:save', $scope.saveContent, $scope);
    ecEditor.addEventListener('org.ekstep.ceheader:save:force', $scope.saveBrowserContent, $scope);
    ecEditor.addEventListener('org.ekstep.ceheader:meta:edit', $scope.editContentMeta, $scope);
    org.ekstep.contenteditor.api.jQuery('.browse.item.at').popup({ on: 'click', setFluidWidth: false, position: 'bottom right' });

}]);
