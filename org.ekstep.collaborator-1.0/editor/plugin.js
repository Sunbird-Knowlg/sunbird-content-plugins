/**
 *
 * plugin for add collaborator to contents
 * @class collaborator
 * @extends EkstepEditor.basePlugin
 * @author Gourav More <gourav_m@tekditechnologies.com>
 * @listens collaborator:add
 */
EkstepEditor.basePlugin.extend({
    /**
     *   @member type {String} plugin title
     *   @memberof collaborator
     *
     */
    type: 'collaborator',
    /**
     *   registers events
     *   @memberof collaborator
     *
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener("collaborator:add", this.addCollaborator, this);
        var templatePath = EkstepEditor.config.pluginRepo + '/org.ekstep.collaborator-1.0/editor/popup.html';
        EkstepEditorAPI.getService('popup').loadNgModules(templatePath);
    },
    /**
     *   Load userlist to add collaborators
     *   @param event {Object} event object from event bus.
     *   @param data {Object} ecml
     *   @memberof collaborator
     */
    addCollaborator: function(event, data) {
        this.showPreview(function() {
            EkstepEditorAPI.jQuery('#colUsersDropdown').dropdown({
                apiSettings: {
                    url: EkstepEditor.config.baseURL + 'index.php?option=com_ekcontent&task=contentform.getUsersToInvite&id=' + window.context.id + '&isEditor=true&search={query}',
                    cache: true
                },
                saveRemoteData: true,
                fields: {
                    remoteValues: 'results',
                    values: 'values',
                    name: 'name',
                    text: 'text',
                    value: 'value'
                },
                forceSelection: false
            });
        });
        this.collaboratorsInfo();
    },
    /**
     *   load html template to show the popup
     *   @memberof collaborator
     */
    showPreview: function(callback) {
        var instance = this;
        var modalController = function($scope) {
            $scope.getUrlLink = instance.getUrlLink;
            $scope.viewContentLink = window.context.viewContentLink;
            $scope.sendInvites = instance.sendInvites;
            instance.copyAnswer = 'Copy';
            $scope.copyAnswer = instance.copyAnswer;
            $scope.notifyUser = instance.notifyUser;
            $scope.contentId = window.context.id;
            $scope.collaborators = instance.collaborators;
            $scope.loading = instance.loading;
            $scope.isLoading = instance.isLoading;
            $scope.isError = instance.isError;

            $scope.$on('ngDialog.opened', function(e, $dialog) {
                callback();
            });
        };

        EkstepEditorAPI.getService('popup').open({
            template: 'partials_org.ekstep.collaborator.html',
            controller: ['$scope', modalController],
            showClose: false,
            width: 900,
            className: 'ngdialog-theme-plain'
        });
    },
    /**
     *   function to copy content preview link
     *   @memberof collaborator
     */
    getUrlLink: function() {
        var instance = this;
        EkstepEditorAPI.jQuery("#copyTarget").select();

        try {
            var successful = document.execCommand('copy');
            successful ? instance.copyAnswer = 'Copied!' : instance.copyAnswer = 'Unable to copy!';
        } catch (err) {
            instance.copyAnswer = 'Unsupported Browser!';
        }
    },
    /**
     *   form validation
     *   @memberof collaborator
     */
    sendInvites: function() {
        var instance = this;
        EkstepEditorAPI.jQuery('#colInviteForm')
            .form({
                inline: true,
                fields: {
                    inviteUsers: {
                        identifier: 'inviteUsers',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please select usernames'
                        }]
                    },
                    invite_msg: {
                        identifier: 'invite_msg',
                        rules: [{
                            type: 'empty',
                            prompt: 'Invite message should not be blank'
                        }]
                    },
                },
                onSuccess: function(event, fields) {
                    instance.notifyUser(event, fields);
                },
                onFailure: function(formErrors, fields) {
                    console.log("fields validation failed");
                    return false;
                }
            });
    },
    /**
     *   send notification email to collaborators
     *   @param event {Object} event object.
     *   @param data {Object} data
     *   @memberof collaborator
     */
    notifyUser: function(event, fields) {
        var instance = this;
        EkstepEditorAPI.jQuery.ajax({
            url: EkstepEditor.config.baseURL + '/index.php?option=com_ekcontent&task=contentform.inviteUsers',
            headers: {
                'x-auth': 'session'
            },
            type: "POST",
            data: fields,
            async: false,
            beforeSend: function() {
                instance.loading = 'active';
                instance.isLoading = true;
                instance.isError = false;
                EkstepEditorAPI.getAngularScope().safeApply();
            },
            success: function(result) {
                if (result == true) {
                    instance.isLoading = false;
                    EkstepEditorAPI.jQuery('.collaborator_msg').transition('drop');
                    EkstepEditorAPI.getAngularScope().safeApply();
                    setTimeout(function() {
                        instance.closeThisDialog();
                    }, 1000);
                } else {
                    instance.isError = true;
                    EkstepEditorAPI.jQuery('.collaborator_msg').transition('drop');
                    EkstepEditorAPI.getAngularScope().safeApply();
                    setTimeout(function() {
                        instance.loading = '';
                        EkstepEditorAPI.getAngularScope().safeApply();
                    }, 1000);
                }
            },
            error: function() {
                console.log("Error");
            }
        });
    },
    /**
     *   get already invited collaborators info
     *   @memberof collaborator
     */
    collaboratorsInfo: function() {
        var instance = this;

        EkstepEditorAPI.jQuery.ajax({
            url: EkstepEditor.config.baseURL + '/index.php?option=com_api&app=ekcontent&resource=collaborator&format=raw',
            headers: {
                'x-auth': 'session'
            },
            type: "GET",
            data: { id: window.context.id },
            async: false,
            success: function(results) {
                if (results) {
                    instance.collaborators = results.result.collaborators;
                } else {
                    instance.collaborators = null;
                }
            },
            error: function() {
                console.log("Error");
            }
        });
    }
});

//# sourceURL=collaboratorplugin.js
