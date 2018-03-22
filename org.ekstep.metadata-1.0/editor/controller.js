'use strict';
/**
 * @description     - Metadata form controller
 * @module          - 'org.ekstep.metadataform'
 */

angular.module('org.ekstep.metadataform', []).controller('metadataForm', ['$scope', 'configurations', function($scope, configurations) {

    /**
     * @property        - Form configurations which should contains the 'framework, config, resourceBundle' information
     */
    $scope.fields = configurations.fields;


    /**
     * 
     */
    $scope.tempalteName = configurations.template;

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
     * @property        -
     */
    $scope.validation = {};

    /**
     * @property       - Default error message for the fields
     */
    $scope.DEFAULT_ERROR_MESSAGE = 'Invalid Input'


    /**
     * 
     */
    $scope.isNew = true;

    /**
     * @description          - Which is used to dispatch an event.
     * 
     * @param {String} event - Name of the event.
     * 
     * @param {Object} data  - Data which is need to pass.  
     */
    $scope.dispatchEvent = function(event, data) {
        ecEditor.dispatchEvent(event, data)
    };



    /**
     * @description     - It Initialize the dropdown with selected values
     */
    $scope.initDropdown = function() {
        const DROPDOWN_INPUT_TYPES = ['select', 'multiSelect'];
        _.forEach($scope.fields, function(field) {
            if (_.includes(DROPDOWN_INPUT_TYPES, field.inputType)) {
                if (field.depends && field.depends.length) {
                    $scope.getAssociations($scope.contentMeta[field.code], field.range, function(associations) {
                        $scope.applayDependencyRules(field, associations, false);
                    });
                }
            }
        });
        $scope.configureDropdowns(false, false);
    }

    /**
     * @description             - Which is used to generate the telemetry.
     * 
     * @param {Object} data     - Telemetry interact event data.
     */
    $scope.generateTelemetry = function(data) {
        ecEditor.getService('telemetry').interact({
            "type": data.type || "click",
            "subtype": data.subtype,
            "target": data.target,
            "pluginid": $scope.manifest.id,
            "pluginver": $scope.manifest.ver,
            "objectid": data.objectid,
            "targetid": data.targetid,
            "stage": data.stage
        })
    };

    /**
     * @description            - Which is used to update the form when vlaues is get changes
     * 
     * @param {String} event  - Name of the event.
     * 
     * @param {Object} object - Field information
     */
    $scope.onConfigChange = function(event, object) {
        $scope.isSubmit = false;
        !$scope.metaForm.$valid && $scope.updateErrorMessage();
        $scope.updateForm(object);
    }

    /**
     * @description            - Which is used to update the form when vlaues is get changes
     * 
     * @param {Object} object  - Field information
     */
    $scope.updateForm = function(object) {
        if (object.field.range) {
            $scope.getAssociations(object.value, object.field.range, function(associations) {
                $scope.applayDependencyRules(object.field, associations, true);
            });
        }
    };

    /** 
     * @description                    - Which is used to get the association object by mapping key and range object
     * 
     * @param {String | Array} keys    - To the associactio object for particular key's
     * 
     * @param {Object} range           - Which refers to framework terms/range object
     */
    $scope.getAssociations = function(keys, range, callback) {
        var associations = [];
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
     * 
     * @param {Object} field           - Which field need need to get change.
     * 
     * @param {Object} associations    - Association values of the respective field.
     * 
     * @param {Boolean} resetSelected  - @default true Which defines while resolving the dependency dropdown
     *                                   Should reset the selected values of the field or not
     */
    $scope.applayDependencyRules = function(field, associations, resetSelected) {
        //reset the depended field first
        // Update the depended field with associated value
        // Currently, supported only for the dropdown values
        var dependedValues;
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
     *                           If the specified values are empty then drop down will get update with master list
     * @param {Object} field   - Field which is need to update.
     * 
     * @param {Object} values  - Values for the field
     */
    $scope.updateDropDownList = function(fieldCode, values) {
        if (values.length) {
            $scope.categoryList[fieldCode] = values;
        } else {
            $scope.mapMasterCategoryList($scope.fields, fieldCode);
        }
    }

    /**
     * @description             - Which is used to get fixedLayout section and Dynamic section layout fields
     * 
     * @returns {Object}        - Which returns object which contains both fixedLayout and dynamicLayout configurations
     */
    $scope.getLayoutConfigurations = function() {
        var FIXED_FIELDS_CODE = this.getFixedFieldCode($scope.tempalteName);
        var fixedLayout = [];
        var dynamicLayout = [];
        _.map($scope.fields, function(field) {
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
     * 
     * @fires       - 'editor:form:success'
     */
    $scope.successFn = function() {
        $scope.isSubmit = true;
        !$scope.metaForm.$valid && $scope.updateErrorMessage();
        var successCB = function(err, res) {
            if (res) {
                $scope.closeThisDialog();
                console.info("Data is saved successfully.", res)
            } else {
                console.error("Fails to save the data", err)
            }
        }
        var form = {};
        form.metaData = $scope.getUpdatedMetadata($scope.contentMeta);
        form.nodeId = org.ekstep.contenteditor.api.getContext('contentId');
        ecEditor.dispatchEvent('editor:form:success', {
            isValid: $scope.metaForm.$valid,
            formData: form,
            callback: successCB
        })
    };

    /**
     * 
     * @description             - Which is used to show an error message to resepective field 
     */
    $scope.updateErrorMessage = function() {
        if ($scope.metaForm.$valid) return
        var errorKeys = undefined;
        _.forEach($scope.fields, function(value, key) {
            if ($scope.metaForm[value.code] && $scope.metaForm[value.code].$invalid) {
                $scope.validation[value.code] = {}
                switch (_.keys($scope.metaForm[value.code].$error)[0]) {
                    case 'pattern': // When input validation of type is regex
                        $scope.validation[value.code]["errorMessage"] = value.validation.regex.message;
                        break;
                    case 'required': // When input validation of type is required
                        $scope.validation[value.code]["errorMessage"] = 'Plese Input a value';
                        break;
                    case "maxlength": // When input validation of type is max
                        $scope.validation[value.code]["errorMessage"] = value.validation.max.message;
                        break;
                    default:
                        $scope.validation[value.code]["errorMessage"] = "Invalid Input";
                }
            }
        });
    }

    /** 
     * @description      -   Which is used take a action on click of the cancel button.
     * 
     * @fires            -   'editor:form:cancel'
     */
    $scope.cancelFn = function() {
        // Note: Reset the all selected fields (If required)
        ecEditor.dispatchEvent('editor:form:cancel', { callback: $scope.closeThisDialog })
    }

    /** 
     * @description         - Which is used to restore the dropdown slected value.
     * 
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
     * @description                     - Which is used to map with the master framework list
     * 
     * @param {Object} configurations   - Field configurations
     * 
     * @param {String} key              - Field uniq code value
     */
    $scope.mapMasterCategoryList = function(configurations, key) {
        _.forEach($scope.fields, function(field, value) {
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
     * 
     * @param {Object} currentMetadata  -@default Object Current field values
     * 
     * @returns {Object}                - Whihc returns only changed metadata values
     */
    $scope.getUpdatedMetadata = function(currentMetadata) {
        var metadata = {};
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
        if (metadata.keywords) {
            var keys = metadata.keywords
            metadata.keywords = keys.map(function(a) {
                return a.lemma ? a.lemma : a
            })
        }
        // Passing mandatory fields when save is invoked
        !metadata['name'] && (metadata['name'] = $scope.originalContentMeta['name']);
        !metadata['contentType'] && (metadata['contentType'] = $scope.originalContentMeta['contentType']);
        !metadata['mimeType'] && (metadata['mimeType'] = $scope.originalContentMeta['mimeType']);
        var result = $scope.validateDataTypes(metadata, $scope.fields)
        return result;
    };



    /**
     * @description                      - Which is used to configure the symantic ui drop down
     *                                     to enable/disable the force selection field and multiSelect fields with tags format 
     *
     * @param {Boolean} labels           - @default false Which defines the MultiSelect should be tag format design or not
     * 
     * @param {Boolean} forceSelection   - @default false Which defines the force selection should enalbe or not
     */
    $scope.configureDropdowns = function(labels, forceSelection) {
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
        var contentMeta = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId'))
        if (!_.isEmpty(contentMeta) && _.has(contentMeta, ['name'])) {
            $scope.isNew = false
        }
        $scope.originalContentMeta = _.clone($scope.contentMeta);
        var layoutConfigurations = $scope.getLayoutConfigurations();
        $scope.fixedLayoutConfigurations = _.uniqBy(layoutConfigurations.fixedLayout, 'code');
        $scope.dynamicLayoutConfigurations = _.sortBy(_.uniqBy(layoutConfigurations.dynamicLayout, 'code'), 'index');
        $scope.mapMasterCategoryList($scope.fields);
    };

    $scope.getFixedFieldCode = function(tempalteName) {
        var map = {
            'defaultTemplate': ["name", "description", "keywords", "appicon"]
        }
        if (tempalteName === 'defaultTemplate') {
            return map.defaultTemplate;
        } else {
            return {}
        }

    }

    $scope.validateDataTypes = function(selectedFields, configurations) {
        _.forEach(configurations, function(configureValue, configureKey) {
            _.forEach(selectedFields, function(selectedValue, selectedKey) {
                if (configureValue.code === selectedKey) {
                    var result = $scope.updateFieldDataType(configureValue.dataType, selectedValue);
                    selectedFields[selectedKey] = result;
                }
            })
        })
        return selectedFields
    };

    $scope.updateFieldDataType = function(dataType, value) {
        var result = undefined;
        // currently, supporting for list
        // Need to update for other data types
        if (dataType == 'list') {
            if (_.isString(value)) {
                result = value.split(',')
            }
        }
        return result || value

    }
    $scope.init()

}]);

//# sourceURL=metadataController.js