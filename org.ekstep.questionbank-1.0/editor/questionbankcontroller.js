/**
 * Plugin to add questions in question set
 * @class QuestionFormController
 * Swati singh <Swati.singh@tarento.com>
 */
'use strict';
angular.module('createquestionapp', [])
  .controller('QuestionFormController', ['$scope', 'pluginInstance', function ($scope, pluginInstance) {
    $scope.currentUserId = ecEditor.getContext('user').id;
    $scope.isQuestionTab = true;
    $scope.selectedQuestions = [];
    $scope.showConfigForm = false;
    $scope.isQuestionSetConfig = false;
    $scope.selQuestionObj = {};
    $scope.filterObj = {};
    $scope.questions = [];
    $scope.itemRange = [];
    $scope.Totalconcepts;
    $scope.selectedConceptsData;
    $scope.selectedQueIndex;
    $scope.grades;
    $scope.languages;
    $scope.resultNotFound = 0;
    $scope.versions = [1, 2];
    $scope.filterForm = '';
    $scope.framework = ecEditor.getContext('framework');
    $scope.difficultyLevels = ['All', 'Easy', 'Medium', 'Difficult'];
    $scope.configScore = false;
    $scope.questionTypes = [{
      "name": "Multiple Choice Questions",
      "value": "mcq"
    }, {
      "name": "Fill in the Blanks",
      "value": "ftb"
    }, {
      "name": "Match the Following",
      "value": "mtf"
    }];
    $scope.filterObj = {};
    $scope.selectedIndex;
    $scope.conceptsText = '(0) Concepts';
    $scope.pluginIdObj = {
      "question_set_id": "org.ekstep.questionset",
      "question_create_id": "org.ekstep.question",
      "concepts_id": "org.ekstep.conceptselector"
    }
    $scope.filterData = {
      request: {
        "filters": {
          "objectType": [
            "AssessmentItem"
          ],
          "status": [],
          "medium": [
            "English"
          ]
        },
        "sort_by": {
          "name": "desc"
        },
        "limit": 200
      }
    };
    $scope.csspath = ecEditor.resolvePluginResource(pluginInstance.manifest.id, pluginInstance.manifest.ver, 'editor/style.css');
    $scope.contentNotFound = ecEditor.resolvePluginResource(pluginInstance.manifest.id, pluginInstance.manifest.ver, 'assets/contentnotfound.jpg');

    $scope.questionSetConfigObj = {
      "title": "",
      "max_score": 1,
      "allow_skip": true,
      "show_feedback": true,
      "shuffle_questions": false,
      "shuffle_options": false,
      "total_items": 1
    };

    $scope._constants = {
      previewPlugin: 'org.ekstep.questionset.preview',
      questionPlugin: 'org.ekstep.question',
      questionsetPlugin: 'org.ekstep.questionset',
      questionbankPlugin: 'org.ekstep.questionbank'
    };

    ecEditor.addEventListener('editor:form:change', function(event, data) {
      $scope.filterObj.concepts = [];
      if(data.key == "concepts")
        _.forEach(data.value, function(dataid) {
            $scope.filterObj.concepts.push(dataid.identifier);
        });
      $scope.searchQuestions($scope.filterObj);
    });

    $scope.searchQuestions = function (filterData) {
      // var activity = ctrl.activity;
      // ctrl.isItemAvailable = true;
      // ctrl.itemsLoading = true;
      var data = {
        request: {
          filters: {
            objectType: ["AssessmentItem"],
            status: []
          },

          sort_by: {"name": "desc"},
          limit: 200
        }
      };
      if (filterData) {
        $scope.filterObj = filterData;
      }

      if ($scope.filterObj.myQuestions) {
        var userId = $scope.currentUserId;
        data.request.filters.createdBy = userId;
      } else {}
      // setting filters values and title to request data
      ecEditor._.forEach($scope.filterObj, function(value, key) {
        if (value) {
          switch (key) {
            case "searchText":
              data.request.query = value;
              break;
            case "gradeLevel":
              if (value.length) {
                data.request.filters.gradeLevel = value;
              }
              break;
            case "medium":
              data.request.filters.medium = value;
              break;
            case "level":
              data.request.filters.qlevel = value;
              break;
            case "board":
              data.request.filters.board = value;
              break;
            case "subject":
              data.request.filters.subject = value;
              break;
            case "questionType":
              ecEditor._.forEach($scope.questionTypes, function(val, key) {
                if (value.length && value == val.name) {
                  data.request.filters.type = val.value;
                }
              });
              break;
            case "concepts":
              data.request.filters.concepts = value;
              break;
          }
        }
      });
      // get Questions from questions api
      ecEditor.getService('assessment').getQuestions(data, function (err, resp) {
        if (!err) {
          $scope.questions = resp.data.result.items;
          $scope.resultNotFound = resp.data.result.count;
          for (var i = 0; i < $scope.selectedQuestions.length; i++) {
            for (var j = 0; j < $scope.questions.length; j++) {
              if ($scope.selectedQuestions[i].identifier == $scope.questions[j].identifier) {
                $scope.questions[j].isSelected = true;
              }
            }
          }
          $scope.itemsLoading = false;
          $scope.$safeApply();
        } else {
          $scope.itemsLoading = false;
          $scope.errorMessage = true;
          $scope.$safeApply();
          return;
        }
      });
    };

    /**
     *  init funtion is called when html is loaded
     *  @memberof QuestionFormController
     */
    $scope.init = function () {
      $scope.itemsLoading = true;
      $scope.searchQuestions();
      $scope.selectedIndex = undefined;

      ecEditor.addEventListener('editor:template:loaded', function(event, object) {
        if(object.formAction == 'question-filter-view') {
          $scope.filterForm = object.templatePath;
        }
      })

      ecEditor.addEventListener(pluginInstance.manifest.id + ":saveQuestion", function (event, data) {
        if (!data.isSelected) {
          data.isSelected = true;
        }
        var selQueIndex = _.findLastIndex($scope.questions, {
          identifier: data.identifier
        });
        if (selQueIndex < 0) {
          $scope.questions.unshift(data);
        } else {
          $scope.questions[selQueIndex] = data;
        }
        selQueIndex = _.findLastIndex($scope.selectedQuestions, {
          identifier: data.identifier
        });
        if (selQueIndex < 0) {
          $scope.selectedQuestions.unshift(data);
        } else {

          $scope.selectedQuestions[selQueIndex] = data;
          $scope.$safeApply();
        }

        $scope.setDisplayandScore();
        $scope.editConfig($scope.selectedQuestions[0], 0);
        $scope.previewItem($scope.selectedQuestions[0], true);
        $scope.$safeApply();
      });


      if (pluginInstance.editData) {
        $scope.selectedQuestions = pluginInstance.editData.data;
        $scope.questionSetConfigObj = pluginInstance.editData.config;
        $scope.isQuestionTab = false;
        $scope.isQuestionSetConfig = true;
        $scope.createTotalItemRange();
        $scope.questions = $scope.selectedQuestions.concat($scope.questions);
        for (var i = 0; i < $scope.selectedQuestions.length; i++) {
          for (var j = 0; j < $scope.questions.length; j++) {
            if ($scope.selectedQuestions[i].identifier == $scope.questions[j].identifier) {
              $scope.questions[j].isSelected = true;
            }
          }
        }
        $scope.editConfig($scope.selectedQuestions[0], 0);
        $scope.previewItem($scope.selectedQuestions[0], true);


      }

      var filterMetaData = {};
      //ecEditor.dispatchEvent("org.ekstep.editcontentmeta:showpopup1", { action: 'question-filter-view', subType: 'questions', framework: "NCF", rootOrgId: "*", type: "content", popup: false, metadata: filterMetaData });
      ecEditor.dispatchEvent('org.ekstep.editcontentmeta:showpopup', { action: 'question-filter-view', subType: 'questions', framework: ecEditor.getContext('framework'), rootOrgId: ecEditor.getContext('channel'), type: 'content', popup: false, metadata: filterMetaData})
      ecEditor.dispatchEvent($scope.pluginIdObj.concepts_id + ':init', {
        element: 'queSetConceptsTextBox',
        selectedConcepts: [], // All composite keys except mediaType
        callback: function (data) {
          $scope.Totalconcepts = data.length;
          $scope.conceptsText = '(' + data.length + ') concepts selected';
          $scope.filterObj.concepts = _.map(data, function (concept) {
            return concept.id;
          });
          $scope.selectedConceptsData = data;
          $scope.searchQuestions();
          $scope.$safeApply();
        }
      });

      // Service call to get the question meta data filter values
      ecEditor.getService(ServiceConstants.META_SERVICE).getCategorys($scope.framework, function (error, response) {
        if (!error) {
          var categories = response.data.result.framework.categories;
          ecEditor._.forEach(categories, function (value, key) { // eslint-disable-line no-unused-vars
            var terms = [];
            ecEditor._.forEach(value.terms, function (val, key) { // eslint-disable-line no-unused-vars
              terms.push(val.name);
            })
            switch (value.code) {
              case "medium":
                $scope.languages = terms;
                $scope.languages.unshift("All");
                break;
              case "gradeLevel":
                $scope.grades = terms;
                break
            }
          })
          ecEditor.jQuery('.ui.dropdown.lableCls').dropdown({
            useLabels: false,
            forceSelection: false
          });
          $scope.$safeApply();
        } else {
          console.log(error);
        }
      })

    }

    /**
     *  creating range of number of items to display as per number of question selected
     *  @memberof QuestionFormController
     */
    $scope.createTotalItemRange = function () {
      $scope.itemRange = [];
      for (var i = 1; i <= $scope.selectedQuestions.length; i++) {
        $scope.itemRange.push(i);
      }
      $scope.$safeApply();
    }

    /**
     *  Creating list of selected questions for creating question set
     *  @memberof QuestionFormController
     *  @param {Object} selQuestion Selected question object
     */
    $scope.selectQuestion = function (selQuestion) {
      var isQuestionSelected = selQuestion.isSelected;
      if (ecEditor._.isUndefined(selQuestion.body)) {
        $scope.getItem(selQuestion, function (selQuestion) {
          var selObjindex = _.findLastIndex($scope.questions, {
            identifier: selQuestion.identifier
          });
          if (selObjindex > -1) {
            $scope.questions[selObjindex] = selQuestion;
            $scope.questions[selObjindex].isSelected = !isQuestionSelected;
          }
          $scope.$safeApply();
          $scope.selectQuestionData(selQuestion);
        });
      } else {
        $scope.selectQuestionData(selQuestion);
      }
    }


    /**
     *  Creating list of selected questions for creating question set
     *  @memberof QuestionFormController
     *  @param {Object} selQuestion Selected question object
     */
    $scope.selectQuestionData = function (selQuestion) {
      var selObjindex = _.findLastIndex($scope.selectedQuestions, {
        identifier: selQuestion.identifier
      });
      // var selObjindex = $scope.selectedQuestions.indexOf(selQuestion);
      if (selObjindex > -1) {
        $scope.selectedQuestions.splice(selObjindex, 1);
      } else {
        $scope.selectedQuestions.push(selQuestion);
      }
      $scope.$safeApply();
    }
    /**
     *  Funtion to edit the config data of question
     *  @memberof QuestionFormController
     *  @param {Object} quesObj Question Object
     *  @param {int} index Index of the question object
     */
    $scope.editConfig = function (quesObj, index) {
      $scope.selectedIndex = index;
      $scope.selQuestionObj = {};
      $scope.selQuestionObj = quesObj;
      $scope.showConfigForm = true;
    }


    /**
     *  Funtion to remove question from selected question list
     *  @memberof QuestionFormController
     *  @param {Object} selQuestion Selected question object
     */
    $scope.removeQuestion = function (selQuestion) {
      var selObjindex = $scope.selectedQuestions.indexOf(selQuestion);
      if (selObjindex > -1) {
        $scope.selectedQuestions.splice(selObjindex, 1);
        if ($scope.selectedIndex == selObjindex) {
          if ($scope.selectedIndex > ($scope.selectedQuestions.length - 1)) {
            $scope.editConfig($scope.selectedQuestions[$scope.selectedIndex - 1], ($scope.selectedIndex - 1));
          } else {
            $scope.editConfig($scope.selectedQuestions[$scope.selectedIndex], ($scope.selectedIndex));
          }
        }
      }

      selObjindex = _.findLastIndex($scope.questions, {
        identifier: selQuestion.identifier
      });
      if (selObjindex > -1) {
        $scope.questions[selObjindex].isSelected = false;
      }
      $scope.$safeApply();
      $scope.setDisplayandScore();
    }


    /**
     *  Funtion to remove question from selected question list
     *  @memberof QuestionFormController
     */
    $scope.saveConfig = function () {

      //Update max_score question->config->metadata
      var qBody = JSON.parse($scope.selQuestionObj.body);
      qBody.data.config.metadata.max_score = $scope.selQuestionObj.max_score;
      $scope.selQuestionObj.body = JSON.stringify(qBody);

      var selectedObjIndex = _.findLastIndex($scope.questions, {
        identifier: $scope.selQuestionObj.identifier
      });
      if (selectedObjIndex > -1) {
        $scope.questions[selectedObjIndex] = $scope.selQuestionObj;
      }

      delete $scope.questionObj;
    }

    $scope.closeConfigForm = function () {
      $scope.selQuestionObj = {};
      $scope.showConfigForm = false;
    }

    $scope.setDisplayandScore = function () {
      var length = $scope.selectedQuestions.length;
      $scope.questionSetConfigObj.total_items = length;
      var score = 0;

      for (var i = 0; i < length; i++) {
        score = score + $scope.selectedQuestions[i].max_score;
      }
      $scope.questionSetConfigObj.max_score = score;
      $scope.$safeApply();
      $scope.createTotalItemRange();
    }


    /**
     *  Funtion to save question set
     *  @memberof QuestionFormController
     */
    $scope.createQuestionSet = function () {
      _.each($scope.selectedQuestions, function (question) {
        if (question.version == 1 && question.template_id) {
          $scope.getv1Template(question.template_id, question, function (controller) {
            question.template = controller.template;
            if (controller.mediamanifest) question.mediamanifest = controller.mediamanifest;
          });
        }
      });
      $scope.isQuestionSetConfig = true;
      $scope.isQuestionTab = false;
      $scope.createTotalItemRange();
      $scope.setDisplayandScore();
      $scope.previewItem($scope.selectedQuestions[0], true);
      $scope.editConfig($scope.selectedQuestions[0], 0);
    }


    /**
     *  Funtion to add question set to editor. It dispatch an event to question set plugin for adding question set
     *  @memberof QuestionFormController
     */
    $scope.addQuestionSet = function () {
      var questionSet = {};
      var callback = pluginInstance.callback;
      questionSet.data = [];
      questionSet.config = $scope.questionSetConfigObj;
      questionSet.data = $scope.selectedQuestions;
      ecEditor.dispatchEvent($scope.pluginIdObj.question_set_id + ":addQS", {
        callback: callback,
        data: questionSet
      });
      $scope.closeThisDialog();
    }

    $scope.showSelectedQue = function (index) {
      delete $scope.selectedQueIndex;
      $scope.selectedQueIndex = index;
      var filterMetaData = {};
      //ecEditor.dispatchEvent("org.ekstep.editcontentmeta:showpopup1", { action: 'question-filter-view', subType: 'questions', framework: "NCF", rootOrgId: "*", type: "content", popup: false, metadata: filterMetaData });
      ecEditor.dispatchEvent('org.ekstep.editcontentmeta:showpopup', { action: 'question-filter-view', subType: 'questions', framework: ecEditor.getContext('framework'), rootOrgId: ecEditor.getContext('channel'), type: 'content', popup: false, metadata: filterMetaData})
    }


    /**  Funtion to dispatch event to question creation plugin for creating new questions
     *  @memberof QuestionFormController
     */
    $scope.createQuestion = function () {
      ecEditor.dispatchEvent($scope.pluginIdObj.question_create_id + ":showpopup", {});
    }

    $scope.editQuestion = function (questionObj) {
      if (ecEditor._.isUndefined(questionObj.body)) {
        $scope.getItem(questionObj, function (questionObj) {
          ecEditor.dispatchEvent($scope.pluginIdObj.question_create_id + ":showpopup", questionObj);
        });
      } else {
        ecEditor.dispatchEvent($scope.pluginIdObj.question_create_id + ":showpopup", questionObj);
      }
    }
    $scope.shuffleWarnPopUp = function(){
      if($scope.questionSetConfigObj.shuffle_questions){
        $scope.configScore = true;
        $scope.questionSetConfigObj.max_score = $scope.selectedQuestions.length;
        _.each($scope.selectedQuestions, function(question,key){
          $scope.selectedQuestions[key].max_score = 1;
          //JSON.parse($scope.selectedQuestions[key].body).data.config.metadata.max_score = 1;
          if($scope.selectedQuestions[key].body == undefined){
          	$scope.selectedQuestions[key].max_score = 1;
          }else{
          	JSON.parse($scope.selectedQuestions[key].body).data.config.metadata.max_score = 1;
          }				
          $scope.selQuestionObj.max_score = 1;
        });
          ecEditor.dispatchEvent("org.ekstep.toaster:info", {
              title: 'Each question will carry equal weightage of 1 mark when using Shuffle. To provide different weightage to individual questions please turn off Shuffle.',
              position: 'topCenter',
          });
      }else{
        $scope.configScore = false;
      }
    }

    $scope.previewItem = function (question, bool) { // eslint-disable-line no-unused-vars
      if (ecEditor._.isUndefined(question.body)) {
        $scope.getItem(question, function (questionData) {
          var selObjindex = _.findLastIndex($scope.questions, {
            identifier: questionData.identifier
          });
          // var selObjindex = $scope.selectedQuestions.indexOf(selQuestion);
          if (selObjindex > -1) {
            $scope.questions[selObjindex] = questionData;
          }
          $scope.$safeApply();
          $scope.showPreview(questionData);
        });
      } else {
        $scope.showPreview(question);
      }
    }

    $scope.showPreview = function (question, bool) { // eslint-disable-line no-unused-vars
      if (question.version == 1) {
        var templateRef = question.template_id;
        if (templateRef)
          $scope.getv1Template(templateRef, question, function (controller) {
            $scope.sendForPreview(controller, question.version);
          });
      } else {
        var questionBody;
        if (_.isString(question.body))
          questionBody = JSON.parse(question.body);
        else
          questionBody = question.body;
        $scope.sendForPreview(questionBody, question.version);
      }

    }

    $scope.getv1Template = function (templateRef, question, callback) {
      ecEditor.getService('assessment').getTemplate(templateRef, function (err, response) {
        if (!err) {
          var x2js = new X2JS({ // eslint-disable-line no-undef
            attributePrefix: 'none',
            enableToStringFunc: false
          });
          var templateJson = x2js.xml_str2json(response.data.result.content.body); // eslint-disable-line no-undef
          var questionSets = {},
            config = {},
            quesBody = {
              "questionnaire": {},
              "template": [],
              "mediamanifest": {
                "media": []
              }
            };
          questionSets[question.identifier] = [];
          questionSets[question.identifier].push(question);
          if (_.isArray(question.media)) {
            question.media.forEach(function (mediaItem) {
              quesBody.mediamanifest.media.push(mediaItem);
            });
          }
          quesBody.questionnaire["items"] = questionSets;
          quesBody.questionnaire["item_sets"] = [{
            "count": "1",
            "id": question.identifier
          }]
          quesBody["questionnaire"] = ecEditor._.assign(quesBody.questionnaire, config);
          quesBody["template"].push(templateJson.theme.template);
          if (!(ecEditor._.isUndefined(templateJson.theme.manifest)) && !(ecEditor._.isUndefined(templateJson.theme.manifest.media)) && _.isArray(templateJson.theme.manifest.media)) {
            templateJson.theme.manifest.media.forEach(function (mediaItem) {
              quesBody.mediamanifest.media.push(mediaItem);
            });
          } else if (!(ecEditor._.isUndefined(templateJson.theme.manifest)) && !(ecEditor._.isUndefined(templateJson.theme.manifest.media))) {
            quesBody.mediamanifest.media.push(templateJson.theme.manifest.media);
          }
          callback(quesBody);
        }
      });
    }

    $scope.sendForPreview = function (quesBody, version) {
      var qObj;
      if (version == 1) {
        qObj = {
          "data": {
            __cdata: JSON.stringify(quesBody)
          },
          "config": {
            __cdata: JSON.stringify({
              "type": "items",
              "var": "item"
            })
          },
          "pluginId": "org.ekstep.questionset.quiz",
          "pluginVer": "1.0",
          "id": "80532057-749a-4534-812b-ec702c99b4b8",
          "type": "mcq",
          "templateId": "horizontalMCQ",
          "rotate": "0",
          "z-index": "0",
          "w": "80",
          "x": "9",
          "h": "85",
          "y": "6"
        };
      } else {
        qObj = {
          "config": JSON.stringify(quesBody.data.config),
          "data": JSON.stringify(quesBody.data.data),
          "id": "c943d0a907274471a0572e593eab49c2",
          "pluginId": quesBody.data.plugin.id,
          "pluginVer": quesBody.data.plugin.version,
          "templateId": quesBody.data.plugin.templateId,
          "type": "unit"
        };
      }
      var questions = [];
      var data = {
        "org.ekstep.questionset": {}
      }
      questions.push(qObj);
      data[$scope._constants.questionsetPlugin][$scope._constants.questionPlugin] = questions;
      var confData = {
        "contentBody": {},
        "parentElement": true,
        "element": "#itemIframe"
      };

      document.getElementById("itemIframe").contentDocument.location.reload(true);
      var pluginInstances = ecEditor.getPluginInstances();
      var previewInstance = _.find(pluginInstances, function (pi) {
        return pi.manifest.id === $scope._constants.previewPlugin
      });
      if (_.isUndefined(previewInstance)) {
        previewInstance = ecEditor.instantiatePlugin($scope._constants.previewPlugin);
      }
      confData.contentBody = previewInstance.getQuestionPreviwContent(data[$scope._constants.questionsetPlugin]);
      ecEditor.dispatchEvent("atpreview:show", confData);
    }

    $scope.cancel = function () {
      $scope.closeThisDialog();
    }

    $scope.getItem = function (item, callback) {
      ecEditor.getService('assessment').getItem(item.identifier, function (err, resp) {
        if (!err) {
          item = resp.data.result.assessment_item ? resp.data.result.assessment_item : item;
        }
        callback(item);
      });
    }

    $scope.generateTelemetry = function (data, event) {
      var eventId;
      if (event.target) eventId = event.target.id;
      else eventId = event;
      if (data) ecEditor.getService('telemetry').interact({
        "type": data.type,
        "subtype": data.subtype,
        "id": data.id,
        "pageId": ecEditor.getCurrentStage().id,
        "target": {
          "id": eventId,
          "ver": "1.0",
          "type": data.type
        },
        "plugin": {
          "id": pluginInstance.manifest.id,
          "ver": pluginInstance.manifest.ver
        }
      })
    }


  }])


//# sourceURL=questionbankctrl.js