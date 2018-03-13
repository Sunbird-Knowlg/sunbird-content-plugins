'use strict';

angular.module('org.ekstep.metadataform', []).controller('metadataform', ['$scope', '$q', '$rootScope', '$http', '$timeout', 'configurations', function($scope, $q, $rootScope, $http, $timeout, configurations) {
    var ctrl = this;
    $scope.configurations = configurations;
    $scope.isSubmit = false;
    $scope.manifest = { id: "org.ekstep.metadata", ver: "1.2" };
    $scope.contentMeta = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId'));
    $scope.originalContentMeta = _.clone($scope.contentMeta);
    $scope.categoryList = {}
    let isRootNode = true;
    let isNewNode = false;

    /**
     * 
     * @param {String} event - Name of the event
     * @param {Object} data  - Data which is need to pass.  
     */
    ctrl.dispatchEvent = function(event, data) {
        ecEditor.dispatchEvent(event, data)
    };

    ctrl.getUpdatedMetadata = function(currentMetadata) {
        let metadata = {};
        if (_.isEmpty($scope.originalContentMeta)) {
            _.forEach(currentMetadata, function(value, key) {
                metadata[key] = value;
            });
        } else {
            _.forEach(currentMetadata, function(value, key) {
                if (_.isUndefined($scope.originalContentMeta[key])) {
                    metadata[key] = value;
                } else if (value != $scope.originalContentMeta[key]) {
                    metadata[key] = value;
                }
            });
        }
        if (_.isUndefined(metadata['name'])) {
            metadata['name'] = $scope.originalContentMeta['name'];
        }
        return metadata;
    };



    /**
     * @description     - Which is used to initialize the dropdown with selected values
     */
    $scope.initDropdown = function() {
        const DROPDOWN_INPUT_TYPES = ['select', 'multiSelect'];
        $timeout(function() {
            _.forEach(configurations, function(field) {
                if (_.includes(DROPDOWN_INPUT_TYPES, field.inputType)) {
                    $('#_select' + field.code).dropdown('set selected', $scope.contentMeta[field.code]);
                    $scope.$safeApply();
                    if (field.depends && field.depends.length) {
                        $scope.getAssociations($scope.contentMeta[field.code], field.range, function(associations) {
                            $scope.applayDependencyRules(field, associations);
                        });
                    }
                }
            });
        }, 0);
    }

    $scope.generateTelemetry = function(data) {
        if (data) ecEditor.getService('telemetry').interact({
            "type": data.type || "click",
            "subtype": data.subtype || "",
            "target": data.target || "",
            "pluginid": $scope.manifest.id,
            "pluginver": $scope.manifest.ver,
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
        //reset the depended field first
        // Update the depended field with associated value
        // Currently, supported only for the dropdown values
        let dependedValues;
        if (field.depends && field.depends.length) {
            _.forEach(field.depends, function(name) {
                $scope.resetSelectedField('#_select' + name);
                dependedValues = _.map(associations, i => _.pick(i, 'name'))
                $scope.updateDropDownList(name, dependedValues);
                $scope.$safeApply();
            });
        }


    }


    /**
     * @description            - Which updates the drop down value list 
     *                         - If the specified values are empty then drop down will get update with master list
     * @param {Object} field   - Field which is need to update.
     * @param {Object} values  - Values for the field
     */
    $scope.updateDropDownList = function(fieldCode, values) {
        if (values.length) {
            $scope.categoryList[fieldCode] = values;
        } else {
            $scope.mapMasterCategoryList(configurations, fieldCode);
        }
    }

    /**
     * @description     -Which is used to get fixedLayout section and Dynamic section layout fields
     */
    ctrl.getLayoutConfigurations = function() {
        const FIXED_FIELDS_CODE = ["name", "description", "keyword", "appIcon"];
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
        $scope.isSubmit = true;
        let successCB = function(err, res) {
            if (res) {
                $scope.closeThisDialog();
                console.info("Data is saved successfully.", res)
            } else {
                console.error("Fails to save the data", err)
            }
        }

        let form = {};
        form.metaData = ctrl.getUpdatedMetadata($scope.contentMeta);
        form.isRoot = isRootNode;
        form.isNew = isNewNode;
        form.nodeId = org.ekstep.contenteditor.api.getContext('contentId');
        // let keywords = $scope.categoryList[keyword];
        // if (keywords) {
        //     $scope.categoryList[keyword] = keywords.map(function(a) {
        //         return a.lemma ? a.lemma : a
        //     })
        // }
        ecEditor.dispatchEvent('editor:form:success', {
            isValid: $scope.metaForm.$valid,
            formData: form,
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


    /**
     * 
     * @description                     -
     * @param {Object} configurations   - Field configurations
     * @param {String} key              - Field uniq code
     */
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
     * @description             -
     * @param {Boolean} flag    -
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
        console.log("Dynamic layout config", $scope.dynamicLayoutConfigurations)
        $scope.enableMultiSelectDropDown(false);
        $scope.mapMasterCategoryList(configurations);
    };

    $scope.init()

}]);

//# sourceURL=metadataController.js