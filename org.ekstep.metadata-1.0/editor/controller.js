'use strict';

angular.module('org.ekstep.metadataform', []).controller('metadataform', ['$scope', '$q', '$rootScope', '$http', '$timeout', 'configurations', function($scope, $q, $rootScope, $http, $timeout, configurations) {
    var ctrl = this;
    var data = configurations || {};
    ctrl.plugin = { id: "org.ekstep.metadata", ver: "1.2" };
    ctrl.callback = _.isFunction(data.callback) ? data.callback : null;
    ctrl.defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeBAMAAAA/BWopAAAAG1BMVEXMzMwAAABmZmZMTEx/f3+ZmZmysrIZGRkzMzNdPZZ6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAD00lEQVR4nO3cS1LbQBSFYQoMYdp5D8UOoh2YHUQ7gBHjTDJWdh4Cbl/ZrUd3u0rnKvV/KzhFUf65soqrKwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA40agHlLn5pF5Qpg0/1BNKXIfwUb2hxGMIYa8ekW/3Ojd8Ua/I1/3bG36qZ+S6e5sbfqt35Hp53/vtST0kz92vsKkf8P1hbviuXpLnT9wbevWUHDfHuWETUX6wvaFRj1m2G8wNn9Vrlj0O9/qP8u3JXP9Rfj7dG57Ug+YdWxE5b8bL2VzvUf5zvtd3M+6Tub6j3KZ7PR9y1yNzPR9yj2N7/TZjNzrXb5S78b1eD7m7ibnhq3rZuKQVkc9mJCk2LqM80orIZTPSFJtePS51MzPX4yH3MLfX3yE30YrIXTPGU2z26oGnbhfmejvkuqW9vqI804rIVTMmU2xcRXmuFVGvHmlmUmwcRbnN2evnkBs921JuDrn5FJtGPfTdQoqNkyh3uXt9NGMxxcZFlDNaEXloRkaKjYMoZ7UictCMnBSbXj139mxLyQ+53FZEjXZuZoqNOMpLZ1tqr5xb0IpI2oyufK8yykWtiITNKEixEUa5rBVRr5pblGIji3Jbt1d1yBWm2IiaUZpi0yjmZp9tKckh19XvVTSjIsVGEOWqVkTrN6MqxWb1KH+4aO76zahLsenXnVvdimjlQ+7CX9/1f4G7C/eu/Ql80cev4gO4/NIc2q++t/iSH1L8hdZesFfxF/AFH2map1L1yegle6uTLDrgqpuhegJR+Sel7AFEZTN0T9C6qr26B2hVJ6fyW8Oak74R7q1ohvYBe1u8V/tWQfEjP/U3cKVR7sV7C5sh/wa5MMr6L5C7or36NyCKouzhBYiSQ26vHntVdMj5eEMqP8qNeuqb7CjLXyY4yG1Grx56kBlldYqPMpuhb0WUFWV5ik1WMzy0Iuoy9upTbDIOOScvex4sN2OvnnhiMco+Umzahb1uXgY/WGiGm1YczUe5V89LzDbDUSui2Sj7SbHpZvY+qceNmImypxSb6UNur542ajLKvlJspqLcqIdNmDjkvJxtqfFm9OpZk0aj7C/FR6PN8NiKaCTKDlNsRv5lhdN/VnHQJXs9nW2ppBleWxGdR3mvHrTg7JDzdral2pO93s621EkzHLfiaBjlXj0mw6AZrlsRDaLsOcXmeVM/3sEh5/NsS8Vm+E6x2W0jxeb9kGvUM7K9HXJ+z7ZUu4kUm/ttpPjotRnbaEX0spFWRHfb+vECAAAAAAAAAAAAAAAAAAAAAAAAAAAAAID/yl+hBHJNz9INiwAAAABJRU5ErkJggg==';
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
    ctrl.contentMeta = data.contentMeta || metaInfo;
    ctrl.originalContentMeta = _.clone(ctrl.contentMeta);
    $scope.categoryModelList = {};
    $scope.categoryListofFramework = {};
    $scope.categoryValues = '';

    var categoryMasterList = _.cloneDeep(org.ekstep.services.collectionService.categoryList);

    _.forEach(categoryMasterList, function(category) {
        $scope.categoryListofFramework[category.index] = category.terms || [];
        var categoryName = 'category_' + category.index;
        $scope[categoryName] = category;
        $scope.categoryModelList[category.index] = category.code;
    });
    $scope.$safeApply();

    // Create array of content concept Ids to use with the concept selector
    ctrl.conceptIds = [];
    if (!_.isUndefined(ctrl.contentMeta.concepts)) {
        if (ctrl.contentMeta.concepts.length > 0) {
            _.forEach(ctrl.contentMeta.concepts, function(concept) {
                ctrl.conceptIds.push(concept.identifier);
            });
        }
    } else {
        ctrl.contentMeta.concepts = [];
    }


    ctrl.launchImageBrowser = function() {
        ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
            type: 'image',
            search_filter: {}, // All composite keys except mediaType
            callback: function(data) {
                ctrl.contentMeta.appIcon = data.assetMedia.src;
            }
        });
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

    $scope.initDropdown = function() {
        const DROPDOWN_INPUT_TYPE = 'select';
        $timeout(function() {
            ecEditor.jQuery('.ui.dropdown').dropdown({
                useLabels: false,
                forceSelection: false
            });
            _.forEach(configurations, function(key, value) {
                if (key.inputType === DROPDOWN_INPUT_TYPE) {
                    $('#_select' + key.code).dropdown('set selected', ctrl.contentMeta[key.code]);
                    $scope.$safeApply();
                }
            });
        }, 500);
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

    $scope.selectedTemplate = function(a, b) {
        console.log("a", a);
        console.log("b", b);
    }

    $scope.getAssociations = function(selectedCategory, categoryList) {
        var associations = [];
        if (_.isArray(selectedCategory)) {
            _.forEach(selectedCategory, function(val) {
                var categoryObj = _.find(categoryList, function(o) {
                    return o.name.toUpperCase() === val.toUpperCase();
                });
                associations = _.concat(categoryObj.associations, associations);
            });
        } else if (selectedCategory) {
            var categoryObj = _.find(categoryList, function(o) {
                return o.name === selectedCategory;
            });
            associations = categoryObj.associations || [];
        }
        return associations;
    }

    $scope.onConfigChange = function(event, object) {
        $scope.updateForm(object);
    }

    $scope.updateForm = function(object) {
        if (object.field.range) {
            var selectedItem = _.filter(object.field.range, { name: object.value });
            selectedItem.length && selectedItem[0].associations && $scope.updateCategoryFields(selectedItem[0].associations, object.value);
        }
    };

    $scope.updateCategoryFields = function(associations) {
        if (associations.length) {
            _.forEach(associations, function(key, value) {
                setTimeout(function() {
                    var val = getAssociationsByKey(key);
                    $scope.$safeApply();
                }, 0)
            })
        }
    }


    /**
     * @description Which is used to get fixedLayout section and Dynamic section layout fields
     */
    ctrl.getFieldLayoutConfigurations = function() {
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
        ecEditor.dispatchEvent('editor:form:cancel', { callback: $scope.closeThisDialog })
    }

    /** 
     * @description - Initialization of the controller
     *              - Which partions the fixedLayout and dynamic layout section fields
     */
    $scope.init = function() {
        ecEditor.addEventListener('editor:form:change', $scope.onConfigChange, $scope);
        var layoutConfigurations = ctrl.getFieldLayoutConfigurations();
        $scope.fixedLayoutConfigurations = _.uniqBy(layoutConfigurations.fixedLayout, 'code');
        $scope.dynamicLayoutConfigurations = _.sortBy(_.uniqBy(layoutConfigurations.dynamicLayout, 'code'), 'index');

    };
    setTimeout(function() {
        $(".ui.dropdown").dropdown({
            useLabels: false
        });
    }, 0)
    $scope.init()
}]);

//# sourceURL=metadataController.js