/**
 * Plugin to create MCQ question
 * @class org.ekstep.questionunitmcq:mcqQuestionFormController
 * Jagadish P<jagadish.pujari@tarento.com>
 */

angular.module('ftbApp', [])

  .controller('ftbQuestionFormController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.formVaild = false;
    $scope.ftbConfiguartion = {
      'questionConfig': {
        'isText': true,
        'isImage': false,
        'isAudio': false,
        'isHint': false
      }
    };
    $scope.ftbFormData = {
      'question': { 'text': '', 'image': '', 'audio': '', 'hint' : '' },
      'answer': [],
      'parsedQuestion': { 'text': '', 'image': '', 'audio': '', 'hint' : ''},
      'questionCount': 0
    };

    var questionInput = CKEDITOR.replace('ftbQuestion', {
      customConfig: CKEDITOR.basePath + "config.js",
      skin: 'moono-lisa,' + CKEDITOR.basePath + "skins/moono-lisa/",
      contentsCss: CKEDITOR.basePath + "contents.css"
    });
    questionInput.on('change', function() {
      $scope.ftbFormData.question.text = this.getData();
    });
    $scope.init = function() {
      $('.menu .item').tab();
      $('.ui.dropdown').dropdown({ useLabels: false });

      if (!ecEditor._.isUndefined($scope.questionEditData)) {
        var data = $scope.questionEditData.data;
        $scope.ftbFormData.question = data.question;
      }

      $scope.$parent.$on('question:form:val', function(event) {
        var regexForAns = /(?:^|)\[\[(.*?)(?:\]\]|$)/g;
        var index = 0;
        $scope.ftbFormData.answer = $scope.getMatches($scope.ftbFormData.question.text, regexForAns, 1).map(function(a) {
          return a.toLowerCase().trim();
        });
        if ($scope.formValidation()) {
          /*f dynamic question assign how many questions are create that count to $scope.mcqFormData.questionCount
          Or else assign 1*/
          $scope.ftbFormData.questionCount = 1;
          $scope.ftbFormData.parsedQuestion.text = $scope.ftbFormData.question.text.replace(/\[\[.*?\]\]/g, function(a, b) {
            index = index + 1;
            return '<input type="text" class="ans-field" id=ans-field' + index + '>';
          })
          $scope.$emit('question:form:valid', $scope.ftbFormData);
        } else {
          $scope.$emit('question:form:inValid', $scope.ftbFormData);
        }
      })
      ckeditor.editor.on('change', function() {
        ngModel.$setViewValue(this.getData());
      });
    }



    $scope.getMatches = function(string, regex, index) {
      index || (index = 1); // default to the first capturing group
      var matches = [];
      var match;
      while (match = regex.exec(string)) {
        matches.push(match[index]);
      }
      return matches;
    }


    $scope.formValidation = function() {
      $scope.submitted = true;
      var formValid = $scope.ftbForm.$valid && /\[\[.*?\]\]/g.test($scope.ftbFormData.question.text);
      if (formValid) {
        return true;
      } else {
        $scope.ftbForm.ftbQuestion.$valid = false;
        return false;
      }

    }

  $scope.addHint = function(id) {
    if (id == 'q') {
      $scope.qHint = true;
    }
  }

  $scope.deleteHint = function(id) {
    if (id == 'q') {
      $scope.qHint = false;
      $scope.ftbFormData.question.hint = '';
    }
  }

  $scope.generateTelemetry = function(data, event) {
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
          "id": "org.ekstep.questionunit.ftb",
          "ver": "1.0"
        }
      })
    }

  }]);
//# sourceURL=horizontalFTB.js