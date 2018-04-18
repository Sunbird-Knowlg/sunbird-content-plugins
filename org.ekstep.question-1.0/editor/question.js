/**
 * Plugin to create question
 * @class org.ekstep.question:createquestionController
 * Jagadish Pujari<jagadish.pujari@tarento.com>
 */
 angular.module('org.ekstep.question', ['org.ekstep.metadataform'])
 .controller('QuestionCreationFormController', ['$scope', 'instance', 'questionData', function($scope, instance, questionData) {
  var ctrl = this;
  ctrl.templatesScreen = true;
  ctrl.questionMetadataScreen = false;
  ctrl.Totalconcepts = 0;
  ctrl.category = '';
  ctrl.editState = false;
  ctrl.questionUnitTemplateURL = '';
  ctrl.editMode = false;
  ctrl.menuItems = {};
  ctrl.defaultActiveMenu = 'MCQ';
  ctrl.selectedTemplatePluginData = {};
  ctrl.questionCreationFormData = {};
  ctrl.TotalconceptsData = [];
  ctrl.selectedConceptsData = [];
  ctrl.questionUnitValidated = false
  ctrl.level = ['EASY', 'MEDIUM', 'DIFFICULT'];
  ctrl.conceptsCheck = false;
  ctrl.questionData = { 'questionMaxScore' : 1};
  ctrl.plugins = { 'concepts': 'org.ekstep.conceptselector:init' };
  ctrl.templatesType = ['Horizontal','Vertical','Grid'];
  ctrl.questionData.isShuffleOption = false;
  ctrl.questionData.isPartialScore = true;
  ctrl.questionData.templateType = ctrl.templatesType[0];
  ctrl.refreshPreview = false;
  ctrl.noTemplatesFound = "";
  ctrl.allMenuItems = [];
  ctrl.questionMetaData = {};
  ctrl.menuItems['MCQ'] = {
    'category': 'MCQ',
    'data': { 'name': 'Multiple Choice', 'icon': 'list icon' },
    'templatesData': []
  };
  ctrl.menuItems['FTB'] = {
    'category': 'FTB',
    'data': { 'name': 'Fill in the Blanks', 'icon': 'minus square outline icon' },
    'templatesData': []
  };
  ctrl.menuItems['MTF'] = {
    'category': 'MTF',
    'data': { 'name': 'Match the following', 'icon': 'block layout icon' },
    'templatesData': []
  };
  ctrl.menuItems['OTHER'] = {
    'category': 'OTHER',
    'data': { 'name': 'Other', 'icon': 'ellipsis horizontal icon' },
    'templatesData': []
  };
  ctrl._constants = {
    previewPlugin: 'org.ekstep.questionset.preview',
    questionPlugin: 'org.ekstep.question',
    questionsetPlugin: 'org.ekstep.questionset',
    questionbankPlugin: 'org.ekstep.questionbank'
  };

  ctrl.init = function() {
    ecEditor.addEventListener('editor:template:loaded', function(event, object) {
      ctrl.metadataform = object.templatePath;
     })
    
    ecEditor.getService('meta').getConfigOrdinals(function(err, res) {
      if (!err) {
        ctrl.grades = res.data.result.ordinals.gradeLevel;
        ctrl.languages = res.data.result.ordinals.language;
        $scope.$safeApply();
      }
    });

    if (!ecEditor._.isEmpty(questionData)) {
      ctrl.editState = true;
      ctrl.showQuestionForm();
    } else {
      ctrl.showTemplates();
    }

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

    ctrl.selectedMenuItemData = ctrl.menuItems[ctrl.defaultActiveMenu].templatesData;

    $scope.$on('question:form:valid', ctrl.formValid);
    $scope.$on('question:form:inValid', ctrl.formInValid);
    EventBus.listeners['editor:form:data'] = undefined;
    ecEditor.addEventListener('editor:form:data', ctrl.saveMetaData);
  }

  ctrl.showTemplates = function(){
    ctrl.templatesScreen = true;
    ctrl.questionMetadataScreen = false;
    if(ctrl.allMenuItems.length == 0){
      var questionplugininstance = org.ekstep.pluginframework.pluginManager.getPluginManifest(instance.manifest.id);
        _.each(questionplugininstance.editor.dependencies, function(val, key) {
        if (val.type == 'plugin') {
          var instance = org.ekstep.pluginframework.pluginManager.getPluginManifest(val.plugin);
          var pluginID = val.plugin;
          var ver = val.ver;
          if (!_.isUndefined(instance.templates)){
          _.each(instance.templates, function(v, k) {
            v.pluginID = pluginID;
            v.ver = ver;
              var thumbnail = ecEditor.resolvePluginResource(pluginID, ver, v.thumbnail); //Get image source and update in template object
              v.thumbnail1 = thumbnail;
              var allMenus = v;
              allMenus.data = ctrl.menuItems[v.category].data;
              ctrl.allMenuItems.push(allMenus);
              if (ctrl.menuItems.hasOwnProperty(v.category)) {
                ctrl.menuItems[v.category].templatesData.push(v);
              } else {
                ctrl.menuItems['other'].templatesData = v;
              }
            });
          } else {
            ctrl.noTemplatesFound = "There are not templates available";
          }
        }
      });
    }
  }

    ctrl.showQuestionForm = function(){
      ctrl.templatesScreen = false;
      ctrl.questionMetadataScreen = false;
      ctrl.editMode = true;
      var questionData1 = typeof questionData.body == "string" ? JSON.parse(questionData.body) : questionData.body;
      ctrl.assessmentId = questionData.identifier;
      ctrl.questionData = questionData1;
      ctrl.questionCreationFormData = questionData1.data.data;
      ctrl.questionData.qcLanguage = questionData1.data.config.metadata.language[0];
      ctrl.questionData.questionTitle = questionData1.data.config.metadata.title;
      ctrl.questionData.qcLevel = questionData1.data.config.metadata.qlevel;
      ctrl.questionData.templateType = questionData1.data.config.layout;
      ctrl.questionData.isPartialScore = questionData1.data.config.partial_scoring;
      ctrl.questionData.qcGrade = questionData1.data.config.metadata.gradeLevel;
      ctrl.questionData.isShuffleOption = questionData1.data.config.isShuffleOption;
      ctrl.category = questionData.category;
      if(questionData1.data.config.metadata.concepts){
        ctrl.Totalconcepts = questionData1.data.config.metadata.concepts.length; 
      }//_.isUndefined(questionData.config.metadata.concepts) ? questionData.config.metadata.concepts.length : 0;
      ctrl.questionData.concepts = questionData1.data.config.metadata.concepts;
      ctrl.selectedConceptsData = questionData1.data.config.metadata.concepts;
      ctrl.questionData.questionDesc = questionData1.data.config.metadata.description;
      ctrl.questionData.questionMaxScore = questionData1.data.config.metadata.max_score;
      ctrl.conceptsCheck = true;
      $scope.questionEditData = questionData1.data; //Using this variable in question unit plugin for editing question
      var pluginID = questionData1.data.plugin.id;
      var pluginVer = questionData1.data.plugin.version;
      var pluginTemplateId = questionData1.data.plugin.templateId;
      var editCreateQuestionFormInstance = org.ekstep.pluginframework.pluginManager.getPluginManifest(questionData1.data.plugin.id);
      _.each(editCreateQuestionFormInstance.templates, function(value, key) {
        if (value.editor.template == questionData1.data.plugin.templateId) {
          var controllerPathEdit = ecEditor.resolvePluginResource(pluginID, pluginVer, value.editor.controllerURL);
          var templatePathEdit = ecEditor.resolvePluginResource(pluginID, pluginVer, value.editor.templateURL);
          ctrl.questionUnitTemplateURL = templatePathEdit;
        }
      });

      ctrl.selectedTemplatePluginData.plugin = { // Question Unit Plugin Information  
        "id": pluginID, // Id of plugin
        "version": pluginVer, // Version of plugin
        "templateId": pluginTemplateId // Template Id of the question unit
      };
      $scope.$safeApply();
    }

  ctrl.setPreviewData = function() {
    var confData = {};
    var qObj = {
      "config": '{"metadata":{"title":"question title","description":"question description","language":"English"},"max_time":0,"max_score":1,"partial_scoring":'+ctrl.questionData.isPartialScore +',"isShuffleOption":'+ctrl.questionData.isShuffleOption +',"layout":'+JSON.stringify(ctrl.questionData.templateType)+'}',
      "data": JSON.stringify(ctrl.questionCreationFormData),
      "id": "c943d0a907274471a0572e593eab49c2",
      "pluginId": ctrl.selectedTemplatePluginData.plugin.id,
      "pluginVer": ctrl.selectedTemplatePluginData.plugin.version,
      "templateId": ctrl.selectedTemplatePluginData.plugin.templateId,
      "type": "unit"
    }
    var questions = [];
    var data = {
      "org.ekstep.questionset": {}
    }

    questions.push(qObj);
    data[ctrl._constants.questionsetPlugin][ctrl._constants.questionPlugin] = questions;
    confData = { "contentBody": {}, "parentElement": true, "element": "#iframeArea" };
    document.getElementById("iframeArea").contentDocument.location.reload(true);
    var pluginInstances = ecEditor.getPluginInstances();
    var previewInstance = _.find(pluginInstances, function (pi) {
      return pi.manifest.id === ctrl._constants.previewPlugin
    });
    if(_.isUndefined(previewInstance)) {
      previewInstance = ecEditor.instantiatePlugin(ctrl._constants.previewPlugin);
    }
    confData.contentBody = previewInstance.getQuestionPreviwContent(data[ctrl._constants.questionsetPlugin]);
    ecEditor.dispatchEvent("atpreview:show", confData);
  }

  ctrl.loadPreview = function(){
    if (ctrl.editMode === true) {
      setTimeout(function(){ ctrl.setPreviewData(); }, 100);
    }
  }

  ctrl.loadDropdown = function(){
    $('.ui.dropdown').dropdown({});
  }

  ctrl.updatePreview = function(){
    console.log("Selected template type:-",ctrl.questionData.templateType);
    ctrl.showPreview();
  }

  ctrl.showMetaform = function(){
    ctrl.refreshPreview = false;
    ctrl.validateQuestionCreationForm();
  }

  ctrl.showPreview = function(){
    ctrl.refreshPreview = true;
    if(!ctrl.questionMetadataScreen){
      ctrl.validateQuestionCreationForm();
    } else {
      ctrl.setPreviewData();
    }
  }

  ctrl.cancel = function() {
    $scope.closeThisDialog();
  }

  ctrl.setBackButtonState = function() {
    if (ctrl.editState){
      if(ctrl.questionMetadataScreen){
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  ctrl.back = function() {
    if (!ctrl.questionMetadataScreen) {
      ctrl.questionMetadataScreen = true;
      ctrl.templatesScreen = true;
      ctrl.showTemplates();
    } else {
      ctrl.questionMetadataScreen = false;
    }
  }

  ctrl.switchTab = function(id, res) {
    ctrl.selectedMenuItemData = ctrl.menuItems[res.category].templatesData;
  }

  ctrl.addCreateQuestionForm = function(obj) {
    $('.ui.dropdown').dropdown({});
    ctrl.category = obj.category;
    ctrl.templatesScreen = false;
    ctrl.questionMetadataScreen = false;
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

  ctrl.validateQuestionCreationForm = function(event) {
    // ctrl.refreshPreview = false;
    $scope.$broadcast('question:form:val');
  }

  ctrl.formValid = function(event, data) {
    ctrl.questionCreationFormData = data;
    ctrl.setPreviewData();
    if (!ctrl.refreshPreview) {
      ctrl.formIsValid();
    }
  }

  ctrl.formInValid = function(event, data) {

  }

  ctrl.formIsValid = function() {
    ctrl.questionMetadataScreen = true;
    //comment because in edit question the question and question title are not
    if(ctrl.category == 'FTB'){
      ctrl.questionData.questionTitle = _.isUndefined(ctrl.questionData.questionTitle) ? ctrl.questionCreationFormData.question.text.replace(/\[\[.*?\]\]/g,'____') : ctrl.questionData.questionTitle; 
    }else{
      ctrl.questionData.questionTitle = _.isUndefined(ctrl.questionData.questionTitle) ? ctrl.questionCreationFormData.question.text : ctrl.questionData.questionTitle;
    }
     $('.QuestionMetaForm .ui.dropdown').dropdown({});
      ctrl.questionMetaData.name = ctrl.questionData.questionTitle;
      ctrl.questionMetaData.medium = ctrl.questionData.qcLanguage;
      ctrl.questionMetaData.level = ctrl.questionData.qcLevel;
      ctrl.questionMetaData.description = ctrl.questionData.questionDesc;
      ctrl.questionMetaData.max_score = ctrl.questionData.questionMaxScore;
      ctrl.questionMetaData.gradeLevel = ctrl.questionData.qcGrade;
      ctrl.questionMetaData.concepts = ctrl.questionData.concepts;
      if(ctrl.questionMetaData.concepts){
        ctrl.questionMetaData.conceptData = "(" + ctrl.questionData.concepts.length + ") concepts selected";
      }

      ecEditor.dispatchEvent('org.ekstep.editcontentmeta:showpopup', { action: 'question-meta-save', subType: 'questions', framework: ecEditor.getContext('framework'), rootOrgId: ecEditor.getContext('channel'), type: 'content', popup: false, metadata: ctrl.questionMetaData})
      //ecEditor.dispatchEvent("org.ekstep.editcontentmeta:showpopup1", { action: 'question-meta-save', subType: 'questions', framework: "NCF", rootOrgId: "*", type: "content", popup: false, metadata: ctrl.questionMetaData });
  }

  ctrl.saveQuestion = function(assessmentId, data) {
    //If identifier present update the question data
    ecEditor.getService('assessment').saveQuestionV3(assessmentId, data, function(err, resp) {
      if (!err) {
        var qMetadata = ctrl.qFormData.request.assessment_item.metadata;
        qMetadata.identifier = resp.data.result.node_id;
        ecEditor.dispatchEvent(ctrl._constants.questionbankPlugin + ':saveQuestion', qMetadata);
        $scope.closeThisDialog();
      } else {
        //toast with error message
        ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                       title: 'Failed to save question...',
                       position: 'topCenter',
                   });
      }
    });
  }

   ctrl.sendMetaData = function() {
     // body...
     var formScope = $("#content-meta-form");
     var frmScope = formScope.scope().metaForm;
     ecEditor.dispatchEvent("metadata:form:onsuccess", { form: frmScope });
 }

  ctrl.saveMetaData = function(event, object) {
    var metaDataObject = object.formData.metaData;
      for (var property in object.formData.metaData) {
        if (metaDataObject[property]) {
            ctrl.questionMetaData[property] = metaDataObject[property];
        }
      }
      var questionFormData = {};
      var data = {}; // TODO: You have to get this from Q.Unit plugin(getData())
      data.plugin = ctrl.selectedTemplatePluginData.plugin;
      data.data = ctrl.questionCreationFormData; 

      var metadataObj = { category: ctrl.category, title:  ctrl.questionMetaData.name, language: [ ctrl.questionMetaData.medium], qlevel:  ctrl.questionMetaData.level, gradeLevel:  ctrl.questionMetaData.gradeLevel, concepts:  ctrl.questionMetaData.concepts, description:  ctrl.questionMetaData.description, max_score:  ctrl.questionMetaData.max_score };
      data.config = { "metadata": metadataObj, "max_time": 0, "max_score": ctrl.questionData.questionMaxScore, "partial_scoring": ctrl.questionData.isPartialScore, "layout": ctrl.questionData.templateType, "isShuffleOption" : ctrl.questionData.isShuffleOption, "questionCount": ctrl.questionCreationFormData.questionCount};
      data.media = ctrl.questionCreationFormData.media;
      questionFormData.data = data;
      var bodyData = '';
      var metadata = {
        "code": "NA",
        "name": ctrl.questionMetaData.name,
        "qlevel": ctrl.questionMetaData.level,
        "title": ctrl.questionMetaData.name,
        "question": ctrl.questionCreationFormData.question.text,
        "max_score": ctrl.questionMetaData.max_score,
        "isShuffleOption" : ctrl.questionData.isShuffleOption,
        "body": JSON.stringify(questionFormData),
        "language": [ctrl.questionMetaData.medium],
        "itemType": "UNIT",
        "version": 2,
        "category": ctrl.category,
        "description": ctrl.questionMetaData.description,
        "createdBy": window.context.user.id,
        "channel": "in.ekstep", //default value
        "type": ctrl.category.toLowerCase(), // backward compatibility
        "template": "NA", // backward compatibility
        "template_id": "NA", // backward compatibility
      }
      var dynamicOptions = [{ "answer": true, "value": { "type": "text", "asset": "1" } }];
       var mtfoptions = [{
        "value": {
          "type": "mixed",
          "text": "इक",
          "image": "",
          "count": "",
          "audio": "",
          "resvalue": "इक",
          "resindex": 0
        },
        "index": 0
      }];
      switch (ctrl.category) {
        case 'MCQ':
        metadata.options = dynamicOptions;
        break;
        case 'FTB':
        metadata.answer = dynamicOptions;
        break;
        case 'MTF':
        metadata.lhs_options = mtfoptions;
        metadata.rhs_options = mtfoptions;
        break;
        default:
        metadata.options = dynamicOptions;
        break;
      }
      ctrl.qFormData = {
        "request": {
          "assessment_item": {
            "objectType": "AssessmentItem",
            "metadata": metadata
          }
        }
      };

      /*Save data and get response and dispatch event with response to questionbank plugin*/
      ctrl.saveQuestion(ctrl.assessmentId, ctrl.qFormData);
    
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