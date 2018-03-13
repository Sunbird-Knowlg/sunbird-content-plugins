'use strict';

angular.module('org.ekstep.metadataform', []).controller('metadataform', ['$scope', '$q', '$rootScope', '$http', '$timeout', 'configurations', function($scope, $q, $rootScope, $http, $timeout, configurations) {
    let ctrl = this;
    $scope.configurations = configurations;
    $scope.isSubmit = false;
    $scope.manifest = { id: "org.ekstep.metadata", ver: "1.2" };
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
                            $scope.applayDependencyRules(field, associations, false);
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
        let values = _.filter(range, function(res) { return _.includes(keys, res.name); });
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
     * @param {Boolean} resetSelected  - Which defines while resolving the dependency dropdown
     *                                   Should reset the selected values of the field or not
     */
    $scope.applayDependencyRules = function(field, associations, resetSelected = true) {
        //reset the depended field first
        // Update the depended field with associated value
        // Currently, supported only for the dropdown values
        let dependedValues;
        if (field.depends && field.depends.length) {
            _.forEach(field.depends, function(id) {
                resetSelected && $scope.resetSelectedField(id);
                dependedValues = _.map(associations, i => _.pick(i, 'name'))
                $scope.updateDropDownList(id, dependedValues);
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
        let fixedLayout = [];
        let dynamicLayout = [];
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
        form.metaData = $scope.getUpdatedMetadata($scope.contentMeta);
        form.isRoot = isRootNode;
        form.isNew = isNewNode;
        form.nodeId = org.ekstep.contenteditor.api.getContext('contentId');
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
            $scope.contentMeta[id] = [];
            $('#_select' + id).dropdown('clear');
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
     * @description                     - Which used to get only modied filed values
     * @param {Object} currentMetadata  -Current field values
     */
    $scope.getUpdatedMetadata = function(currentMetadata = {}) {
        let metadata = {};
        // TODO:
        // Which trmis out the lemma keyword 
        // Example - [{lemma:'key1'},{lemma:'key2'}] => ['key1','key2']
        if (currentMetadata['keywords']) {
            let keywords = currentMetadata['keywords'];
            currentMetadata.keywords = keywords.map(function(a) {
                return a.lemma ? a.lemma : a
            })
        }
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
     * @description                      -
     * @param {Boolean} labels           -
     * @param {Boolean} forceSelection   -
     */
    $scope.configureDropdowns = function(labels = false, forceSelection = false) {
        // TODO: Need to remove the timeout
        setTimeout(function() {
            $(".ui.dropdown").dropdown({
                useLabels: labels,
                forceSelection: forceSelection
            });
        }, 0)
    }

    /** 
     * @description - Initialization of the controller
     *              - Which partions the fixedLayout and dynamic layout section fields
     */
    $scope.init = function() {
        $scope.contentMeta = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId'));
        $scope.originalContentMeta = _.clone($scope.contentMeta);
        ecEditor.addEventListener('editor:form:change', $scope.onConfigChange, $scope);
        let layoutConfigurations = ctrl.getLayoutConfigurations();
        $scope.fixedLayoutConfigurations = _.uniqBy(layoutConfigurations.fixedLayout, 'code');
        $scope.dynamicLayoutConfigurations = _.sortBy(_.uniqBy(layoutConfigurations.dynamicLayout, 'code'), 'index');
        $scope.mapMasterCategoryList(configurations);
        $scope.configureDropdowns();
    };
    $scope.init()

}]);

//# sourceURL=metadataController.js