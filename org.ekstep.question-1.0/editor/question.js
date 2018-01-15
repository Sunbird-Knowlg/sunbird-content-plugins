/**
 * Plugin to create question
 * @class org.ekstep.question:createquestionController
 * Jagadish Pujari<jagadish.pujari@tarento.com>
 */
angular.module('org.ekstep.question', [])
  .controller('QuestionCreationFormController', ['$scope', 'instance', 'questionData', function($scope, instance, questionData) {
    var ctrl = this;
    ctrl.screens = {
      'template': "S1",
      'form': "S2",
      'metadata': "S3"
    };
    ctrl.screenName = ctrl.screens.template;
    ctrl.templatesScreen = true;
    ctrl.createQuestionScreen = false;
    ctrl.metadaFormScreen = false;
    ctrl.Totalconcepts = 0;
    ctrl.category = '';
    ctrl.questionUnitTemplateURL = '';
    ctrl.menuItems = {};
    ctrl.showPreview = true;
    ctrl.defaultActiveMenu = 'mcq';
    ctrl.selectedTemplatePluginData = {};
    ctrl.questionCreationFormData = {};
    ctrl.TotalconceptsData = [];
    ctrl.selectedConceptsData = [];
    ctrl.questionUnitValidated = false
    ctrl.level = ['Easy', 'Medium', 'Difficult'];
    ctrl.selected = 0;
    ctrl.questionID = 0;
    ctrl.conceptsCheck = false;
    ctrl.questionData = {};
    ctrl.assessmentId = undefined;
    ctrl.plugins = { 'concepts': 'org.ekstep.conceptselector:init' };

    ctrl.menuItems['mcq'] = {
      'category': 'mcq',
      'data': { 'name': 'Multiple Choice', 'icon': 'list icon' },
      'templatesData': []
    };
    ctrl.menuItems['ftb'] = {
      'category': 'ftb',
      'data': { 'name': 'Fill in the Blanks', 'icon': 'minus square outline icon' },
      'templatesData': []
    };
    ctrl.menuItems['mtf'] = {
      'category': 'mtf',
      'data': { 'name': 'Match the following', 'icon': 'block layout icon' },
      'templatesData': []
    };
    ctrl.menuItems['other'] = {
      'category': 'other',
      'data': { 'name': 'Other', 'icon': 'ellipsis horizontal icon' },
      'templatesData': []
    };

    $('.ui.dropdown')
      .dropdown({
        useLabels: false
      });
    setTimeout(function() {
      $('.ui.dropdown')
        .dropdown({
          useLabels: false
        });
    }, 300);
    /**
     * OnLoad of the controller
     * @return {[type]} [description]
     */
    ctrl.init = function() {

      if (!ecEditor._.isEmpty(questionData)) {
        // console.log("Edit mode--->",questionData.request);
        ctrl.questionData = questionData;
        ctrl.questionID = questionData.questionId;
        ctrl.questionData.qcLanguage = questionData.config.metadata.language;
        ctrl.questionData.questionTitle = questionData.config.metadata.title;
        ctrl.questionData.qcLevel = questionData.config.metadata.qlevel;
        ctrl.questionData.qcGrade = questionData.config.metadata.gradeLevel;
        ctrl.Totalconcepts = questionData.config.metadata.concepts.length; //_.isUndefined(questionData.config.metadata.concepts) ? questionData.config.metadata.concepts.length : 0;
        ctrl.TotalconceptsData = questionData.config.metadata.concepts;
        ctrl.conceptsCheck = true;
        $scope.$safeApply();
        $scope.questionEditData = questionData; //Using this variable in question unit plugin for editing question
        ctrl.templatesScreen = false;
        ctrl.createQuestionScreen = true;
        ctrl.metadaFormScreen = false;
        var pluginID = questionData.data.plugin.id;
        var pluginVer = questionData.data.plugin.version;
        var pluginTemplateId = questionData.data.plugin.templateId;
        var editCreateQuestionFormInstance = org.ekstep.pluginframework.pluginManager.getPluginManifest(questionData.data.plugin.id);
        _.each(editCreateQuestionFormInstance.templates, function(value, key) {
          if (value.editor.template == questionData.data.plugin.templateId) {
            var controllerPathEdit = ecEditor.resolvePluginResource(pluginID, pluginVer, value.editor.controllerURL);
            var templatePathEdit = ecEditor.resolvePluginResource(pluginID, pluginVer, value.editor.templateURL);
            ctrl.questionUnitTemplateURL = templatePathEdit;
            $scope.$safeApply();
          }
        });

        ctrl.selectedTemplatePluginData.plugin = { // Question Unit Plugin Information  
          "id": pluginID, // Id of plugin
          "version": pluginVer, // Version of plugin
          "templateId": pluginTemplateId // Template Id of the question unit
        };
      }
      /**
       * Invoke conceptselector plugin to get concepts
       * @param  {[type]}   data) {                           ctrl.Totalconcepts [description]
       * @return {Function}       [description]
       */
      ecEditor.dispatchEvent(ctrl.plugins.concepts, {
        element: 'conceptsTextBoxMeta',
        selectedConcepts: ctrl.TotalconceptsData, // All composite keys except mediaType
        callback: function(data) {
          ctrl.Totalconcepts = data.length;
          if (data.length > 0)
            ctrl.conceptsCheck = true;
          _.each(data, function(val, key) {
            ctrl.selectedConceptsData[key] = val.id;
          });
          $scope.$safeApply();
        }
      });
      ecEditor.getService('meta').getConfigOrdinals(function(err, res) {
        if (!err) {
          ctrl.grades = res.data.result.ordinals.gradeLevel;
          ctrl.languages = res.data.result.ordinals.language;
        }
      });

      var questionplugininstance = org.ekstep.pluginframework.pluginManager.getPluginManifest(instance.manifest.id);
      _.each(questionplugininstance.editor.dependencies, function(val, key) {
        if (val.type == 'plugin') {
          var instance = org.ekstep.pluginframework.pluginManager.getPluginManifest(val.plugin);
          var pluginID = val.plugin;
          var ver = val.ver;
          if (!_.isUndefined(instance.templates))
            _.each(instance.templates, function(v, k) {
              v.pluginID = pluginID;
              v.ver = ver;
              var thumbnail = ecEditor.resolvePluginResource(pluginID, ver, v.thumbnail); //Get image source and update in template object
              v.thumbnail1 = thumbnail;
              if (ctrl.menuItems.hasOwnProperty(v.category)) {
                ctrl.menuItems[v.category].templatesData.push(v);
              } else {
                ctrl.menuItems['other'].templatesData = v;
              }
            });
        }
      });
      ctrl.select = function(parentIndex, index) {
        ctrl.selected = parentIndex + '.' + index;
      };


      /**
       * By default always mcq is selected
       * @type {[type]}
       */
      ctrl.selectedMenuItemData = ctrl.menuItems[ctrl.defaultActiveMenu].templatesData;

      $scope.$on('question:form:valid', ctrl.formValid);
      $scope.$on('question:form:inValid', ctrl.formInValid);
    }

    /**
     * Validate question form to preview the question
     * @return {function} to check question form is valid/not 
     * @return {object} actual form data filled by user for the question template
     */
    ctrl.valideateFormForPreview = function(valid, formData) {
      if (valid) {
        ctrl.questionCreationFormData = formData;
      } else {
        ctrl.questionCreationFormData = null;
      }
    }

    /**
     * To create questionset or question content body
     * @return {object} actual content/theme object which can be used to preview the question/question-set
     */
    ctrl.setPreviewData = function() {
      //ecEditor.dispatchEvent(ctrl.selectedTemplatePluginData.plugin.id + ':val', ctrl.valideateFormForPreview, ctrl);
      //ctrl.validateQuestionCreationForm();
      $scope.$broadcast('question:form:val');
      var qObj = {
        "config": "{'metadata':{'title':'question title','description':'question description','language':'English'},'max_time':0,'max_score':1,'partial_scoring':false}",
        "data": ctrl.questionCreationFormData,
        "id": "c943d0a907274471a0572e593eab49c2",
        "pluginId": "org.ekstep.questionunit.mcq",
        "pluginVer": "1.0",
        "templateId": "horizontalMCQ",
        "type": "unit"
      }
      var quetions = [];
      var data = {
        "org.ekstep.questionset": {}
      }

      quetions.push(qObj);
      data["org.ekstep.questionset"]['org.ekstep.question'] = quetions;
      var confData = { "contentBody": {}, "parentElement": true, "element": "#iframeArea" };
      var questionSetInstance = ecEditor.instantiatePlugin('org.ekstep.questionset.preview');
      confData.contentBody = questionSetInstance.getQuestionPreviwContent(data['org.ekstep.questionset']);
      ecEditor.dispatchEvent("atpreview:show", confData);
    }

    /**
     * [cancel description]
     * @return {[type]} [Close the modal window]
     */
    ctrl.cancel = function() {
      $scope.closeThisDialog();
    }
    /**
     * [back description]
     * @return {[type]} [description]
     */
    ctrl.back = function() {
      if (ctrl.createQuestionScreen) {
        ctrl.templatesScreen = true;
        ctrl.createQuestionScreen = false;
        ctrl.metadaFormScreen = false;
      } else if (ctrl.metadaFormScreen) {
        ctrl.templatesScreen = false;
        ctrl.createQuestionScreen = true;
        ctrl.metadaFormScreen = false;
      }
    }
    /**
     * [switchTab description]
     * @param  {[type]} id  [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    ctrl.switchTab = function(id, res) {
      ctrl.selectedMenuItemData = ctrl.menuItems[res.category].templatesData;
    }
    /**
     * [addCreateQuestionForm description]
     * @param {[type]} obj [description]
     */
    ctrl.addCreateQuestionForm = function(obj) {
      ctrl.category = obj.category;
      ctrl.templatesScreen = false;
      ctrl.createQuestionScreen = true;
      ctrl.metadaFormScreen = false;
      ctrl.templateName = obj.title;
      ctrl.selectedTemplatePluginData.plugin = { // Question Unit Plugin Information  
        "id": obj.pluginID, // Id of plugin
        "version": obj.ver, // Version of plugin
        "templateId": obj.editor.template // Template Id of the question unit
      };
      ctrl.unitPlugin = obj.pluginID;
      ctrl.pluginVer = obj.ver;
      ctrl.templateId = obj.editor.template;
      var controllerPath = ecEditor.resolvePluginResource(obj.pluginID, obj.ver, obj.editor.controllerURL);
      var templatePath = ecEditor.resolvePluginResource(obj.pluginID, obj.ver, obj.editor.templateURL);
      ctrl.questionUnitTemplateURL = templatePath + '?BUILDNUMBER';
    }
    /**
     * Dynamically created form validation
     * @return {[boolean]} based on form validation it will return true/false
     */
    ctrl.validateQuestionCreationForm = function() {
      // ecEditor.dispatchEvent(ctrl.selectedTemplatePluginData.plugin.id + ':val', ctrl.validateQuestionForm, ctrl);
      $scope.$broadcast('question:form:val');
    }

    ctrl.formValid = function(event, data) {
      ctrl.questionCreationFormData = data;
      ctrl.formIsValid();
    }

    ctrl.formInValid = function(event, data) {

    }

    ctrl.formIsValid = function() {
      ctrl.templatesScreen = false;
      ctrl.createQuestionScreen = false;
      ctrl.metadaFormScreen = true;
    }
    ctrl.saveQuestion = function(assessmentId, data){
      ecEditor.getService('assessment').saveQuestionV3(assessmentId, data, function(err, resp) {
            if (!err) {
              ctrl.qFormData.request.assessment_item.identifier = resp.data.result.node_id;
              $scope.$safeApply();
            } else {
              ctrl.itemsLoading = false;
              ctrl.errorMessage = true;
              $scope.$safeApply();
              return;
            }
          });
    }
    /**
     * Collect data from 3 screens
     * @return {[type]} [description]
     */
    ctrl.sendData = function(isValid) {
      var metadata = {};
      if (isValid && ctrl.Totalconcepts > 0) {
        var questionFormData = {};
        var data = {};
        var metadataObj = {title: ctrl.questionData.questionTitle, language: ctrl.questionData.qcLanguage, description:ctrl.questionData.questionDesc};
        data.plugin = ctrl.selectedTemplatePluginData.plugin;
        data.data = {"question":ctrl.questionCreationFormData.question.text,"options":ctrl.questionCreationFormData.options};
        data.config = {"metadata":metadataObj};
        data.media = ctrl.questionCreationFormData.media;
        questionFormData.data = data;
        ctrl.qFormData = {
          "request": {
            "assessment_item": {
              "objectType": "AssessmentItem",
              "metadata": {
                "code": "NA",
                "name": ctrl.questionData.questionTitle,
                "type": ctrl.category,
                "template": "NA",
                "template_id": "NA",
                "qlevel": ctrl.questionData.qcLevel,
                "title": ctrl.questionData.questionTitle,
                "question": ctrl.questionCreationFormData.question,
                "options": [{
                  "answer": true,
                  "value": {
                    "type": "text",
                    "asset": "1"
                  }
                }],
                "max_score": ctrl.questionData.questionMaxScore,
                "body": JSON.stringify(questionFormData),
                "itemType": "unit",
                "version": 2,
                "category": ctrl.category,
                "channel": "ekstep",
                "description": ctrl.questionData.questionDesc
              }
            }
          }
        };
        //console.log("Final data",qFormData);
        /*Save data and get response and dispatch event with response to questionbank plugin*/
        // console.log("Before",ctrl.qFormData);
        ctrl.saveQuestion(ctrl.assessmentId, ctrl.qFormData);
        // console.log("After",ctrl.qFormData);
        /*Dispatch event from here*/
        //ecEditor.dispatchEvent('org.ekstep.questionbank:saveQuestion', ctrl.qFormData);
        $scope.closeThisDialog();

      } else {
        ctrl.qcconcepterr = true;
      }

    }

    ctrl.generateTelemetry = function(data, event) {
      if (data) ecEditor.getService('telemetry').interact({
        "type": data.type,
        "subtype": data.subtype,
        "id": data.id,
        "pageId": ecEditor.getCurrentStage().id,
        "target": {
          "id": event.target.id,
          "ver": "1.0",
          "type": data.type
        },
        "plugin": {
          "id": instance.manifest.id,
          "ver": instance.manifest.ver
        }
      })
    }
    ctrl.init();
  }]);

//# sourceURL=question.js