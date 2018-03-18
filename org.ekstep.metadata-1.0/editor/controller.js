'use strict';
/**
 * @description     - Metadata form controller
 * @module          - 'org.ekstep.metadataform'
 */

angular.module('org.ekstep.metadataform', []).controller('metadataForm', ['$scope', 'configurations', function($scope, configurations) {

    /**
     * @property        - Form configurations which should contains the 'framework, config, resourceBundle' information
     */
    $scope.configurations = configurations;

    /**
     * @property        - Which defines is form is submitted or not.
     */
    $scope.isSubmit = false;

    /**
     * @property        - Plugin manifest object
     */
    $scope.manifest = { id: "org.ekstep.metadata", ver: "1.0" };

    /**
     * @property        - Which holds the category List values 
     * @example         -{subject:{name:"English"},{name:"Kannada"}}
     */
    $scope.categoryList = {}

    /** 
     * 
     * @property        - Which defines the is form for rootNode or not     
     * 
     */
    let isRootNode = true;

    /** 
     * @property        - Which defines is selected form node is New or already Existing node
     */
    let isNewNode = false;

    /**
     * @description          - Which is used to dispatch an event.
     * @param {String} event - Name of the event.
     * @param {Object} data  - Data which is need to pass.  
     */
    $scope.dispatchEvent = function(event, data) {
        ecEditor.dispatchEvent(event, data)
    };

    $scope.validation = {};

    $scope.DEFAULT_ERROR_MESSAGE = 'Invalid Input'

    /**
     * @description     - It Initialize the dropdown with selected values
     */
    $scope.initDropdown = function() {
        const DROPDOWN_INPUT_TYPES = ['select', 'multiSelect'];
        _.forEach(configurations, function(field) {
            if (_.includes(DROPDOWN_INPUT_TYPES, field.inputType)) {
                if (field.depends && field.depends.length) {
                    $scope.getAssociations($scope.contentMeta[field.code], field.range, function(associations) {
                        $scope.applayDependencyRules(field, associations, false);
                    });
                }
            }
        });
        $scope.configureDropdowns();
    }

    /**
     * @description             - Which is used to generate the telemetry.
     * @param {Object} data     - Telemetry interact event data.
     */
    $scope.generateTelemetry = function({ type, subtype, target, objectid, targetid, stage } = {}) {
        ecEditor.getService('telemetry').interact({
            "type": type || "click",
            "subtype": subtype,
            "target": target,
            "pluginid": $scope.manifest.id,
            "pluginver": $scope.manifest.ver,
            "objectid": objectid,
            "targetid": targetid,
            "stage": stage
        })
    };

    /**
     *@description            - Which is used to update the form when vlaues is get changes
     * @param {String} event  - Name of the event.
     * @param {Object} object - Field information
     */
    $scope.onConfigChange = function(event, object) {
        $scope.isSubmit = false;
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
     * @description                    - Which is used to get the association object by mapping key and range object
     * @param {String | Array} keys    - To the associactio object for particular key's
     * @param {Object} range           - Which refers to framework terms/range object
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
     * @param {Boolean} resetSelected  - @default true Which defines while resolving the dependency dropdown
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
     * @description             - Which is used to get fixedLayout section and Dynamic section layout fields
     * @returns {Object}        - Which returns object which contains both fixedLayout and dynamicLayout configurations
     */
    $scope.getLayoutConfigurations = function() {
        const FIXED_FIELDS_CODE = ["name", "description", "keywords", "appicon"];
        let fixedLayout = [];
        let dynamicLayout = [];
        _.map(configurations, function(field) {
            if (field.validation) {
                _.forEach(field.validation, function(value, key) {
                    if (value.type === 'regex') {
                        value.value = new RegExp(value.value);
                    }
                    field.validation[value.type] = value;
                })
            }
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
        !$scope.metaForm.$valid && $scope.updateErrorMessage($scope.metaForm);
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
     * 
     * @param {*} errorInfo 
     */
    $scope.updateErrorMessage = function() {
        let errorKeys = undefined;
        _.forEach(configurations, function(value, key) {
            if ($scope.metaForm[value.code] && $scope.metaForm[value.code].$invalid) {
                $scope.validation[value.code] = {}
                switch (_.keys($scope.metaForm[value.code].$error)[0]) {
                    case 'pattern':
                        $scope.validation[value.code]["errorMessage"] = value.validation.regex.message;
                        break;
                    case 'required':
                        $scope.validation[value.code]["errorMessage"] = 'Plese Input a value';
                        break;
                    case "maxlength":
                        $scope.validation[value.code]["errorMessage"] = value.validation.max.message;
                        break;
                    default:
                        $scope.validation[value.code]["errorMessage"] = "Invalid Input";
                }
            }
        });
    }

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
            $('#_select' + id).dropdown('clear');
            $scope.contentMeta[id] = undefined;
            $scope.$safeApply();
        }, 0)
    }


    /**
     * 
     * @description                     -
     * @param {Object} configurations   - Field configurations
     * @param {String} key              - Field uniq code value
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
     * @param {Object} currentMetadata  -@default Object Current field values
     * @returns {Object}                - Whihc returns only changed metadata values
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
        }!metadata['name'] && (metadata['name'] = $scope.originalContentMeta['name']);
        !metadata['contentType'] && (metadata['contentType'] = $scope.originalContentMeta['contentType']);
        !metadata['mimeType'] && (metadata['mimeType'] = $scope.originalContentMeta['mimeType']);
        return metadata;
    };



    /**
     * @description                      - Which is used to configure the symantic ui drop down
     *                                     to enable/disable the force selection field and multiSelect fields with tags format 
     *
     * @param {Boolean} labels           - @default false Which defines the MultiSelect should be tag format design or not
     * @param {Boolean} forceSelection   - @default false Which defines the force selection should enalbe or not
     */
    $scope.configureDropdowns = function(labels = false, forceSelection = true) {
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
        ecEditor.addEventListener('editor:form:change', $scope.onConfigChange, $scope);
        $scope.contentMeta = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId'));
        $scope.originalContentMeta = _.clone($scope.contentMeta);
        let layoutConfigurations = $scope.getLayoutConfigurations();
        $scope.fixedLayoutConfigurations = _.uniqBy(layoutConfigurations.fixedLayout, 'code');
        $scope.dynamicLayoutConfigurations = _.sortBy(_.uniqBy(layoutConfigurations.dynamicLayout, 'code'), 'index');
        $scope.mapMasterCategoryList(configurations);
    };
    $scope.init()

}]);

//# sourceURL=metadataController.js