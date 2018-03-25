'use strict';
/**
 * @description     - Metadata form controller
 * @module          - 'org.ekstep.metadataform'
 */

angular.module('org.ekstep.metadataform', []).controller('metadataForm', ['$scope', function($scope) {


    /**
     * @property        - Which defines is form is submitted or not.
     */
    $scope.isSubmit = false;

    /**
     * @property        - Which holds the category List values 
     * @example         -{subject:{name:"English"},{name:"Kannada"}}
     */
    $scope.categoryList = {}


    /**
     * 
     */
    $scope.validation = {};

    /**
     * @property       - Default error message for the fields
     */
    $scope.DEFAULT_ERROR_MESSAGE = 'Invalid Input'

    /**
     * @property        - Form configurations which should contains the 'framework, config, resourceBundle' information
     */
    $scope.fields = undefined;

    /**
     * @property  - template name
     */
    $scope.tempalteName = undefined;

    /**
     * 
     */
    $scope.manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.metadata");


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
                        $scope.applyDependencyRules(field, associations, false);
                    });
                }
            }
        });
        $scope.configureDropdowns(false, false);
    }

    /**
     * @description            - Which is used to update the form when vlaues is get changes
     * 
     * @param {String} event  - Name of the event.
     * 
     * @param {Object} object - Field information
     */
    $scope.onConfigChange = function(object) {
        $scope.isSubmit = false;
        !object.form.$valid && $scope.updateErrorMessage(object.form);
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
                $scope.applyDependencyRules(object.field, associations, true);
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
    $scope.applyDependencyRules = function(field, associations, resetSelected) {
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
            if (field.code === 'dialcode') { invokeDialCode() }
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
    $scope.success = function(event, object) {
        $scope.isSubmit = true;
        !object.form.$valid && $scope.updateErrorMessage(object.form);
        var successCB = function(err, res) {
            if (res) {
                console.info("Data is saved successfully.", res)
            } else {
                console.error("Fails to save the data", err);
            }
            $scope.closeThisDialog();
        }
        var form = {};
        form.metaData = getUpdatedMetadata($scope.contentMeta, $scope.originalContentMeta, $scope.fields);
        form.nodeId = org.ekstep.contenteditor.api.getContext('contentId');
        ecEditor.dispatchEvent('editor:form:success', {
            isValid: object.form.$valid,
            formData: form,
            callback: successCB
        })
    };

    /**
     * 
     * @description             - Which is used to show an error message to resepective field 
     */
    $scope.updateErrorMessage = function(form) {
        if ($scope.metaForm.$valid) return
        var errorKeys = undefined;
        _.forEach($scope.fields, function(value, key) {
            if (form[value.code] && form[value.code].$invalid) {
                $scope.validation[value.code] = {}
                switch (_.keys(form[value.code].$error)[0]) {
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
    $scope.cancel = function() {
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
        ecEditor.addEventListener('metadata:form:onsuccess', $scope.success, $scope);
        ecEditor.addEventListener('metadata:form:oncancel', $scope.cancel, $scope);
        var callbackFn = function(config) {
            $scope.fields = config.fields;
            $scope.tempalteName = config.template;
            $scope.contentMeta = config.model;
            $scope.originalContentMeta = _.clone($scope.contentMeta);
            var layoutConfigurations = $scope.getLayoutConfigurations();
            $scope.fixedLayoutConfigurations = _.uniqBy(layoutConfigurations.fixedLayout, 'code');
            $scope.dynamicLayoutConfigurations = _.sortBy(_.uniqBy(layoutConfigurations.dynamicLayout, 'code'), 'index');
            $scope.mapMasterCategoryList($scope.fields);
        }
        ecEditor.dispatchEvent("editor:form:getconfig", callbackFn);
    };

    $scope.getFixedFieldCode = function(tempalteName) {
        var map = { 'defaultTemplate': ["name", "description", "keywords", "appicon"] }
        return map[$scope.tempalteName] || {}
    }
    $scope.init()

}]);

//# sourceURL=metadataController.js