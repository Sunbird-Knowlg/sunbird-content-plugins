/**
 * Plugin to create MCQ question
 * @class org.ekstep.questionunitmcq:mcqQuestionFormController
 * Jagadish P<jagadish.pujari@tarento.com>
 */
angular.module('ftbApp', []).controller('ftbQuestionFormController', ['$scope', '$rootScope', function($scope, $rootScope)
{
  $scope.keyboardConfig = {
    keyboardType: 'Device',
    customKeys: []
  };
  $scope.formVaild = false;
  $scope.ftbConfiguartion = {
    'questionConfig':
    {
      'isText': true,
      'isImage': false,
      'isAudio': false,
      'isHint': false
    }
  };
  //$scope.customTag = false;
  $scope.keyboardTypes = ['Device', 'English', 'Custom'];
  $scope.ftbFormData = {
    question:
    {
      text: '',
      image: '',
      audio: '',
      keyboardConfig:$scope.keyboardConfig
    },
    answer: [],
    parsedQuestion:
    {
      text: '',
      image: '',
      audio: ''
    }
  };
  $scope.init = function()
  {
    $('.menu .item').tab();
    $('.ui.dropdown').dropdown(
    {
      useLabels: false
    });
    if (!ecEditor._.isUndefined($scope.questionEditData))
    {
      var data = $scope.questionEditData.data;
      $scope.ftbFormData.question = data.question;
    }
    $scope.$parent.$on('question:form:val', function(event)
    {
      var regexForAns = /(?:^|)\[\[(.*?)(?:\]\]|$)/g;
      var index = 0;
      $scope.ftbFormData.answer = $scope.getMatches($scope.ftbFormData.question.text, regexForAns, 1).map(function(a)
      {
        return a.toLowerCase().trim();
      });
      if ($scope.formValidation())
      {
        $scope.ftbFormData.parsedQuestion.text = $scope.ftbFormData.question.text.replace(/\[\[.*?\]\]/g, function(a, b)
        {
          index = index + 1;
          if ($scope.ftbFormData.question.keyboardConfig.keyboardType == 'English' || $scope.ftbFormData.question.keyboardConfig.keyboardType == 'Custom')
          {
            return '<input type="text" class="ans-field" id="ans-field' + index + '" readonly style="cursor: pointer;">';
          }
          else
          {
            return '<input type="text" class="ans-field" id="ans-field' + index + '">';
          }
        })
        $scope.$emit('question:form:valid', $scope.ftbFormData);
      }
      else
      {
        $scope.$emit('question:form:inValid', $scope.ftbFormData);
      }
    })
  }
  // $scope.selectKeyboardType = function()
  // {
  //   if ($scope.ftbFormData.question.keyboardConfig.keyboardType == 'Custom')
  //   {
  //     $scope.customTag = true;
  //   }
  //   else
  //   {
  //     $scope.customTag = false;
  //   }
  // }
  // $scope.tokenizeTags = function(event)
  // {
  //   $scope.tags = event.target.value;
  //   if ($scope.tags.length > 0)
  //   {
  //     var tagsArr = $scope.tags.split(",");
  //     // $scope.keys = [];
  //     _.each(tagsArr, function(val, key)
  //     {
  //       if (val.length > 1)
  //       {
  //         var subChar = val.split('');
  //         _.each(subChar, function(val1, key1)
  //         {
  //           $scope.ftbFormData.question.keyboardConfig.customKeys.push(val1);
  //         });
  //       }
  //       else
  //       {
  //         $scope.ftbFormData.question.keyboardConfig.customKeys.push(val);
  //       }
  //     });
  //   }
  //   //console.log("Final keys", $scope.ftbFormData);
  // }
  //}]);
  $scope.getMatches = function(string, regex, index)
  {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string))
    {
      matches.push(match[index]);
    }
    return matches;
  }
  $scope.formValidation = function()
  {
    $scope.submitted = true;
    var formValid = $scope.ftbForm.$valid && /\[\[.*?\]\]/g.test($scope.ftbFormData.question.text);
    if (formValid)
    {
      return true;
    }
    else
    {
      $scope.ftbForm.ftbQuestion.$valid = false;
      return false;
    }
  }
  $scope.generateTelemetry = function(data, event)
  {
    if (data) ecEditor.getService('telemetry').interact(
    {
      "type": data.type,
      "subtype": data.subtype,
      "id": data.id,
      "pageId": ecEditor.getCurrentStage().id,
      "target":
      {
        "id": event.target.id,
        "ver": "1.0",
        "type": data.type
      },
      "plugin":
      {
        "id": "org.ekstep.questionunit.ftb",
        "ver": "1.0"
      }
    })
  }
}]);
//# sourceURL=horizontalFTB.js