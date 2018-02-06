/**
 * Plugin to create MCQ question
 * @class org.ekstep.questionunitmcq:mcqQuestionFormController
 * Jagadish P<jagadish.pujari@tarento.com>
 */

 angular.module('createquestionapp', [])
 .controller('mcqQuestionFormController', ['$scope', '$rootScope', function($scope, $rootScope) {

  $scope.formVaild = false;
  $scope.mcqConfiguartion = {'questionConfig':{'isText':true,'isImage':true,'isAudio':true,'isHint':true},
  'optionsConfig':[{'isText':true,'isImage':true,'isAudio':true,'isHint':true},
  {'isText':true,'isImage':true,'isAudio':true,'isHint':true}]
};
$scope.mcqFormData = {
  'question': { 'text': '', 'image': '', 'audio': '' },
  'options': [{ 'text': '', 'image': '', 'audio': '', 'isCorrect': false },
  { 'text': '', 'image': '', 'audio': '', 'isCorrect': false }
  ]
};

$scope.init = function() {
  $('.menu .item').tab();
  if (!ecEditor._.isUndefined($scope.questionEditData)) {
    var data = $scope.questionEditData.data;
    $scope.mcqFormData.question = data.question;
    $scope.mcqFormData.options = data.options;
    if (data.length > 2) {
      for (var j = 2; j < data.length; j++) {
        $scope.mcqFormData.options.push({ 'text': '', 'image': '', 'audio': '', 'isCorrect': false });
        //$scope.mcqConfiguartion.optionsConfig.push({'isText':true,'isImage':true,'isAudio':true,'isHint':true});
        $scope.$safeApply();
      }
    }
    if ($scope.mcqFormData.options.length < 2) {
      $scope.mcqFormData.options.splice(2, 1);
    }
  }

  $scope.$parent.$on('question:form:val', function(event) {
    if ($scope.formValidation()) {
      $scope.$emit('question:form:valid', $scope.mcqFormData);
    } else {
      $scope.$emit('question:form:inValid', $scope.mcqFormData);
    }
  })
}

$scope.addAnswerField = function() {
  var option = { 'text': '', 'image': '', 'audio': '', 'isCorrect': false };
  if ($scope.mcqFormData.options.length < 8)
    $scope.mcqFormData.options.push(option);
}

$scope.formValidation = function() {
  var opSel = false;
  var valid = false;
  var formValid = $scope.mcqForm.$valid;
  $scope.submitted=true;
  $scope.mcqFormData.media = [{}];
  if (!_.isUndefined($scope.selectedOption)) {
    _.each($scope.mcqFormData.options, function(k, v) {
      $scope.mcqFormData.options[v].isCorrect = false;
    });
    valid = true;
    $scope.mcqFormData.options[$scope.selectedOption].isCorrect = true;
  } else {
    _.each($scope.mcqFormData.options, function(k, v) {
      if (k.isCorrect) {
        valid = true;
      }
    });
  }
  if (valid) {
    opSel = true;
    $scope.selLbl = 'success';
  } else {
    opSel = false;
    $scope.selLbl = 'error';
  }
  console.log("Form data", $scope.mcqFormData);
  return (formValid && opSel) ? true : false;
}

$scope.deleteAnswer = function(id) {
  if (id >= 0)
    $scope.mcqFormData.options.splice(id, 1);
}

$scope.addImage = function(id){
  ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
    type: 'image',
    search_filter: {}, // All composite keys except mediaType
    callback: function(data) { 
      if(id == 'q'){
        $scope.mcqFormData.question.image = data.assetMedia.src;
      }
      else{
        $scope.mcqFormData.options[id].image = data.assetMedia.src;
      }
    }
  });
}

$scope.addAudio = function(id){
  ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
    type: 'audio',
    search_filter: {}, // All composite keys except mediaType
    callback: function(data) { 
      if(id == 'q'){
        $scope.mcqFormData.question.audio = data.assetMedia.src;
      }
      else{
        $scope.mcqFormData.options[id].audio = data.assetMedia.src;
      }
    }
  });
}

$scope.deleteImage = function(id){
  if(id == 'q'){
    $scope.mcqFormData.question.image = '';
  }
  else{
    $scope.mcqFormData.options[id].image = '';
  }
}

$scope.deleteAudio = function(id){
  if(id == 'q'){
    $scope.isPlayingQ = false;
    $scope.mcqFormData.question.audio = '';
  }
  else{
    $scope.mcqFormData.options[id].audio = '';
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
      "id": "org.ekstep.questionunit.mcq",
      "ver": "1.0"
    }
  })
}

}]);
//# sourceURL=horizontalMCQ.js