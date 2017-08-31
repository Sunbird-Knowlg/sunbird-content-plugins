angular.module('org.ekstep.sunbirdcommonheader:app', ["Scope.safeApply", "yaru22.angular-timeago"]).controller('headerController', ['$scope', function($scope) {

    var plugin = { id: "org.ekstep.sunbirdcommonheader", ver: "1.0" };
    $scope.contentDetails = {
        contentTitle: "",
        contentImage: ""
    };
    $scope.internetStatusObj = {
        'status': navigator.onLine,
        'text': 'No Internet Connection!'
    };
    $scope.disableSaveBtn = true;
    $scope.disableReviewBtn = false;
    $scope.lastSaved;
    $scope.alertOnUnload = ecEditor.getConfig('alertOnUnload');
    $scope.pendingChanges = false;
    $scope.hideReviewBtn = false;
    $scope.publishMode = ecEditor.getConfig('editorConfig') && ecEditor.getConfig('editorConfig').publishMode || false;
    $scope.isFalgReviewer = ecEditor.getConfig('editorConfig') && ecEditor.getConfig('editorConfig').isFalgReviewer || false;
    $scope.editorEnv = "";

    $scope.setEditorDetails = function() {
        var meta = ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta(ecEditor.getContext('contentId'));
        switch (meta.mimeType) {
            case "application/vnd.ekstep.ecml-archive":
                $scope.editorEnv = "ECML"
                break;
            case "application/vnd.ekstep.content-collection":
                $scope.editorEnv = "COLLECTION"
                break;
            default:
                $scope.editorEnv = "NON-ECML"
                break;
        };
        $scope.contentDetails = {
            contentImage: ecEditor.getConfig('headerLogo') || meta.appIcon || ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/images/sunbird_logo.png"),
            contentTitle: meta.name
        }
        $scope.$safeApply();
    };

    $scope.saveContent = function(cb) {
        $scope.disableSaveBtn = true;
        ecEditor.dispatchEvent("org.ekstep.contenteditor:save", {
            showNotification: true,
            callback: function(err, res) {
                if (res && res.data && res.data.responseCode == "OK") {
                    $scope.lastSaved = Date.now();
                    $scope.pendingChanges = false;
                    $scope.disableReviewBtn = false;
                    if ($scope.editorEnv == "COLLECTION") $scope.sendForeReviewBtnFn();
                } else {
                    $scope.disableSaveBtn = false;
                    $scope.disableReviewBtn = true;
                }
                cb && cb(err, res);
                $scope.$safeApply();
            }
        });
    };

    $scope.previewContent = function(fromBeginning) {
        ecEditor.dispatchEvent('org.ekstep.contenteditor:preview', { fromBeginning: fromBeginning });
    }

    $scope.editContentMeta = function() {
        ecEditor.dispatchEvent("org.ekstep.editcontentmeta:showpopup");
    }

    $scope._sendReview = function() {
        ecEditor.dispatchEvent("org.ekstep.contenteditor:review", function(err, res) {
            if (err) {
                $scope.disableReviewBtn = false;
            }
            $scope.$safeApply();
        });
    };

    $scope.sendForReview = function() {
        $scope.disableReviewBtn = true;
        var meta = ecEditor.getService(ServiceConstants.CONTENT_SERVICE).getContentMeta(ecEditor.getContext('contentId'));
        if (meta.status === "Draft") {
            ecEditor.dispatchEvent("org.ekstep.editcontentmeta:showpopup", {
                callback: function(err, res) {
                    if (res) {
                        $scope.saveContent(function(err, res) {
                            if (res) {
                                $scope._sendReview()
                            }
                        });
                    } else {
                        ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                            message: 'Unable to save content, try again!',
                            position: 'topCenter',
                            icon: 'fa fa-warning'
                        });
                    }
                }
            });
            $scope.disableReviewBtn = false;
        } else {
            $scope._sendReview();
        }
    };

    $scope.publishContent = function() {
        ecEditor.dispatchEvent("org.ekstep.contenteditor:publish", {
            callback: function(err, res) {
                if (!err)
                    window.parent.$('#' + ecEditor.getConfig('modalId')).iziModal('close');
            }
        });
    };

    $scope.rejectContent = function() {
        ecEditor.dispatchEvent("org.ekstep.contenteditor:reject", {
            callback: function(err, res) {
                if (!err)
                    window.parent.$('#' + ecEditor.getConfig('modalId')).iziModal('close');
            }
        });
    };

    $scope.acceptContentFlag = function() {
        ecEditor.dispatchEvent("org.ekstep.contenteditor:acceptFlag", {
            callback: function(err, res) {
                if (!err)
                    window.parent.$('#' + ecEditor.getConfig('modalId')).iziModal('close');
            }
        });
    };

    $scope.discardContentFlag = function() {
        ecEditor.dispatchEvent("org.ekstep.contenteditor:discardFlag", {
            callback: function(err, res) {
                if (!err)
                    window.parent.$('#' + ecEditor.getConfig('modalId')).iziModal('close');
            }
        });
    };

    $scope.retireContent = function() {
        ecEditor.dispatchEvent("org.ekstep.contenteditor:retire", {
            callback: function(err, res) {
                if (!err)
                    window.parent.$('#' + ecEditor.getConfig('modalId')).iziModal('close');
            }
        });
    };

    $scope.setPendingChangingStatus = function(event, data) {
        $scope.pendingChanges = true;
        $scope.disableSaveBtn = false;
        $scope.disableReviewBtn = true;
        $scope.$safeApply();
    };

    $scope.showNoContent = function() {
        $scope.closeEditor();
    };

    $scope.closeEditor = function() {
        if ($scope.alertOnUnload === true && $scope.pendingChanges === true) {
            if (window.confirm("You have unsaved changes! Do you want to leave?")) {
                window.parent.$('#' + ecEditor.getConfig('modalId')).iziModal('close');
            }
        } else {
            window.parent.$('#' + ecEditor.getConfig('modalId')).iziModal('close');
        }
    }

    $scope.telemetry = function(data) {
        org.ekstep.services.telemetryService.interact({ "type": 'click', "subtype": data.subtype, "target": data.target, "pluginid": plugin.id, "pluginver": plugin.ver, "objectid": ecEditor.getCurrentStage().id, "stage": ecEditor.getCurrentStage().id });
    };

    $scope.internetStatusFn = function(event) {
        $scope.$safeApply(function() {
            $scope.internetStatusObj.status = navigator.onLine;
        });
    };

    $scope.sendForeReviewBtnFn = function() {
        var nodeData = ecEditor.jQuery("#collection-tree").fancytree("getRootNode").getFirstChild();
        $scope.disableReviewBtn = (!nodeData.children) ? true : false;
        $scope.$safeApply();
    };

    $scope.getContentMetadata = function() {
        var rootNode = org.ekstep.services.collectionService.getNodeById(ecEditor.getContext('contentId'));
        var status = rootNode.data.metadata.status;
        $scope.hideReviewBtn = (status === 'Draft' || status === 'FlagDraft') ? false : true;
        $scope.sendForeReviewBtnFn();
        $scope.$safeApply();
    };

    $scope.updateTitle = function(event, data) {
        $scope.contentDetails.contentTitle = data;
        document.title = data;
        $scope.$safeApply();
    };

    $scope.onSave = function() {
        $scope.pendingChanges = false;
        $scope.lastSaved = Date.now();
        $scope.$safeApply();
    }

    window.addEventListener('online', $scope.internetStatusFn, false);
    window.addEventListener('offline', $scope.internetStatusFn, false);
    // Collection editor events
    ecEditor.addEventListener("org.ekstep.collectioneditor:node:added", $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener("org.ekstep.collectioneditor:node:modified", $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener("org.ekstep.collectioneditor:node:removed", $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener("org.ekstep.collectioneditor:node:reorder", $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener("org.ekstep.collectioneditor:content:notfound", $scope.showNoContent, $scope);
    ecEditor.addEventListener("org.ekstep.collectioneditor:content:load", $scope.getContentMetadata, $scope);
    ecEditor.addEventListener("content:title:update", $scope.updateTitle, $scope);
    ecEditor.addEventListener("org.ekstep.collectioneditor:content:load", $scope.setEditorDetails, $scope);
    ecEditor.addEventListener("content:load:complete", $scope.setEditorDetails, $scope);

    // content editor events
    ecEditor.addEventListener('object:modified', $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener('object:added', $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener('stage:add', $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener('stage:delete', $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener('stage:duplicate', $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener('stage:reorder', $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener('object:removed', $scope.setPendingChangingStatus, $scope);
    ecEditor.addEventListener('org.ekstep.contenteditor:save', $scope.onSave, $scope);
}]);
//# sourceURL=sunbirdheaderapp.js