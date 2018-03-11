'use strict';

angular.module('org.ekstep.metadataform', []).controller('metadataform', ['$scope', '$q', '$rootScope', '$http', '$timeout', 'configurations', function($scope, $q, $rootScope, $http, $timeout, configurations) {
    var ctrl = this;
    var data = configurations || {};
    $scope.configurations = configurations;
    $scope.submitted = false;
    ctrl.plugin = { id: "org.ekstep.metadata", ver: "1.2" };
    ctrl.callback = _.isFunction(data.callback) ? data.callback : null;
    ctrl.contentId = org.ekstep.contenteditor.api.getContext('contentId');

    $scope.parseKeywords = function(keywords) {
        if (_.isString(keywords)) {
            return JSON.parse(keywords);
        } else {
            return keywords;
        }
    }
    $scope.metaform = {}
    var metaInfo = ecEditor.getService('content').getContentMeta(ctrl.contentId);
    metaInfo.keywords = $scope.parseKeywords(metaInfo.keywords)
    if (data.contentMeta) {
        data.contentMeta.keywords = $scope.parseKeywords(data.contentMeta.keywords);
    }
    $scope.contentMeta = data.contentMeta || metaInfo;
    ctrl.originalContentMeta = _.clone($scope.contentMeta);
    $scope.categoryList = {}

    // Create array of content concept Ids to use with the concept selector
    ctrl.conceptIds = [];
    if (!_.isUndefined($scope.contentMeta.concepts)) {
        if ($scope.contentMeta.concepts.length > 0) {
            _.forEach($scope.contentMeta.concepts, function(concept) {
                ctrl.conceptIds.push(concept.identifier);
            });
        }
    } else {
        $scope.contentMeta.concepts = [];
    }


    ctrl.launchImageBrowser = function() {

    };

    /**
     * 
     * @param {String} event - Name of the event
     * @param {Object} data  - Data which is need to pass.  
     */
    ctrl.dispatchEvent = function(event, data) {
        ecEditor.dispatchEvent(event, data)
    };

    ctrl.getUpdatedMetadata = function(originalMetadata, currentMetadata) {
        var metadata = {};
        if (_.isEmpty(originalMetadata)) {
            _.forEach(currentMetadata, function(value, key) {
                metadata[key] = value;
            });
        } else {
            _.forEach(currentMetadata, function(value, key) {
                if (_.isUndefined(originalMetadata[key])) {
                    metadata[key] = value;
                } else if (value != originalMetadata[key]) {
                    metadata[key] = value;
                }
            });
        }
        if (_.isUndefined(metadata['name'])) {
            metadata['name'] = originalMetadata['name'];
        }
        return metadata;
    };



    /**
     * @description     - Which is used to initialize the dropdown with selected values
     */
    $scope.initDropdown = function() {
        const DROPDOWN_INPUT_TYPE = 'select';
        $timeout(function() {
            _.forEach(configurations, function(key, value) {
                if (key.inputType === DROPDOWN_INPUT_TYPE) {
                    $('#_select' + key.code).dropdown('set selected', $scope.contentMeta[key.code]);
                    $scope.$safeApply();
                }
            });
        }, 0);
    }

    $scope.generateTelemetry = function(data) {
        if (data) ecEditor.getService('telemetry').interact({
            "type": data.type || "click",
            "subtype": data.subtype || "",
            "target": data.target || "",
            "pluginid": ctrl.plugin.id,
            "pluginver": ctrl.plugin.ver,
            "objectid": "",
            "targetid": "",
            "stage": ""
        })
    };

    /**
     *@description            - Which is used to update the form when vlaues is get changes
     * @param {String} event  - Name of the event.
     * @param {Object} object - Field information
     */
    $scope.onConfigChange = function(event, object) {
        $scope.updateForm(object);
    }

    /**
     * @description            - Which is used to update the form when vlaues is get changes
     * @param {Object} object  - Field information
     */
    $scope.updateForm = function(object) {
        if (object.field.range) {
            $scope.getAssociations(object.value, object.field.range, function(associations) {
                $scope.applayDependencyRules(object.field, associations);
            });
        }
    };

    /** 
     * @param {String | Array} keys    -
     * @description - 
     */
    $scope.getAssociations = function(keys, range, callback) {
        let associations = [];
        var values = _.filter(range, function(res) { return _.includes(keys, res.name); });
        _.forEach(values, function(key, value) {
            if (key.associations) {
                _.forEach(key.associations, function(key, value) {
                    associations.push(key);
                })
            }
        });
        callback && callback(associations);
    }

    /**
     * @description                    - Which is used to resolve the dependency. 
     * @param {Object} field           - Which field need need to get change.
     * @param {Object} associations    - Association values of the respective field.
     */
    $scope.applayDependencyRules = function(field, associations) {
        if (field.depends) {
            //reset the depended field first
            // Update the depended field with associated value
            $scope.resetSelectedField('#_select' + field.depends);
            var dependedValues = _.map(associations, i => _.pick(i, 'name'))
            $scope.updateDropDownList(field, dependedValues);
            $scope.$safeApply();
        }
    }


    /**
     * @description            - Which updates the drop down value list 
     *                         - If the specified values are empty then drop down will get update with master list
     * @param {Object} field   - Field which is need to update.
     * @param {Object} values  - Values for the field
     */
    $scope.updateDropDownList = function(field, values) {
        if (values.length) {
            $scope.categoryList[field.depends] = values;
        } else {
            $scope.mapMasterCategoryList(configurations, field.depends);
        }
    }

    /**
     * @description Which is used to get fixedLayout section and Dynamic section layout fields
     */
    ctrl.getLayoutConfigurations = function() {
        const FIXED_FIELDS_CODE = ["name", "description", "keyword", "image"];
        var fixedLayout = [];
        var dynamicLayout = [];
        _.map(configurations, function(field) {
            if (_.includes(FIXED_FIELDS_CODE, field.code)) {
                fixedLayout.push(field)
            } else {
                dynamicLayout.push(field);
            }

        });
        return { fixedLayout: fixedLayout, dynamicLayout: dynamicLayout };
    };


    /** 
     * @description - Which is used to invoke an action on click of the submit button.
     * @fires       - 'editor:form:success'
     */
    $scope.successFn = function() {
        $scope.submitted = true;
        let successCB = function(err, res) {
            if (res) {
                $scope.closeThisDialog();
                console.info("Data is saved successfully.", res)
            } else {
                console.error("Fails to save the data", err)
            }
        }
        ecEditor.dispatchEvent('editor:form:success', {
            isValid: $scope.metaForm.$valid,
            formData: ctrl.getUpdatedMetaData(),
            callback: successCB
        })
    };

    /** 
     * @description - Which is used take a action on click of the cancel button.
     * @fires       - 'editor:form:cancel'
     */
    $scope.cancelFn = function() {
        // Note: Reset the all selected fields (If required)
        ecEditor.dispatchEvent('editor:form:cancel', { callback: $scope.closeThisDialog })
    }

    /** 
     * @description         - Which is used to restore the dropdown slected value.
     * @param {String} id   - To restore the specific dropdown field value 
     */
    $scope.resetSelectedField = function(id) {
        setTimeout(function() {
            $(id).dropdown('restore defaults');
            $scope.$safeApply();
        }, 0)
    }

    $scope.mapMasterCategoryList = function(configurations, key) {
        _.forEach(configurations, function(field, value) {
            if (key) {
                if (field.code === key) {
                    $scope.categoryList[field.code] = field.range
                }
            } else {
                field.range && ($scope.categoryList[field.code] = field.range);
            }
        })
    }

    /**
     * 
     */
    $scope.enableMultiSelectDropDown = function(flag) {
        setTimeout(function() {
            $(".ui.dropdown").dropdown({
                useLabels: flag
            });
        }, 0)
    }

    /** 
     * @description - Initialization of the controller
     *              - Which partions the fixedLayout and dynamic layout section fields
     */
    $scope.init = function() {
        ecEditor.addEventListener('editor:form:change', $scope.onConfigChange, $scope);
        var layoutConfigurations = ctrl.getLayoutConfigurations();
        $scope.fixedLayoutConfigurations = _.uniqBy(layoutConfigurations.fixedLayout, 'code');
        $scope.dynamicLayoutConfigurations = _.sortBy(_.uniqBy(layoutConfigurations.dynamicLayout, 'code'), 'index');
        $scope.enableMultiSelectDropDown(false);
        $scope.mapMasterCategoryList(configurations);
    };

    $scope.init()
}]);

//# sourceURL=metadataController.js