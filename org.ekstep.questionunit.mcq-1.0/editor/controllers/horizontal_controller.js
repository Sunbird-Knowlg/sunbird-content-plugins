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
  'question': { 'text': '', 'image': '', 'audio': '','hint':''},
  'options': [{ 'text': '', 'image': '', 'audio': '', 'hint':'',  'isCorrect': false },
  { 'text': '', 'image': '', 'audio': '','hint':'' , 'isCorrect': false }
  ]
};
$scope.oHint = [];
$scope.questionMedia = {};
$scope.optionsMedia = {'image':[],'audio':[]};
$scope.mcqFormData.media = [];
$scope.editMedia = [];
$scope.init = function() {
  $('.menu .item').tab();
  if (!ecEditor._.isUndefined($scope.questionEditData)) {
    var data = $scope.questionEditData.data;
    $scope.mcqFormData.question = data.question;
    $scope.mcqFormData.options = data.options;
    $scope.editMedia = $scope.questionEditData.media;
    //$scope.mcqFormData.media = $scope.questionEditData.media;
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
  //$scope.mcqFormData.media = [];
  var tempArray = [];
  _.isEmpty($scope.questionMedia.image) ? 0 : tempArray.push($scope.questionMedia.image);
  _.isEmpty($scope.questionMedia.audio) ? 0 : tempArray.push($scope.questionMedia.audio);
  _.each($scope.optionsMedia.image,function(key,val){
    tempArray.push(key);
  });
  _.each($scope.optionsMedia.audio,function(key,val){
    tempArray.push(key);
  });
  var temp = tempArray.filter(function( element ) {
   return element !== undefined;
 });
  $scope.editMedia = _.isEmpty(temp) ? 0 : _.union($scope.editMedia,temp);
  $scope.mcqFormData.media = _.isEmpty($scope.editMedia[0]) ? temp : $scope.editMedia;
  console.log("Form data",$scope.mcqFormData);
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
      var tempImage = {
            "id": Math.floor(Math.random() * 1000000000), // Unique identifier
            "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
            "assetId": data.assetMedia.id, // Asset identifier
            "type": "image", // Type of asset (image, audio, etc)
            "preload": false // true or false
          };
      //$scope.mcqFormData.media.push(tempImage);
      if(id == 'q'){
        $scope.mcqFormData.question.image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
        $scope.questionMedia.image = tempImage;
      }
      else{
        $scope.mcqFormData.options[id].image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
        $scope.optionsMedia.image[id] = tempImage;
      }
    }
  });
}

$scope.addAudio = function(id){
  ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
    type: 'audio',
    search_filter: {}, // All composite keys except mediaType
    callback: function(data) {
      var tempAudio = {
            "id": Math.floor(Math.random() * 1000000000), // Unique identifier
            "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
            "assetId": data.assetMedia.id, // Asset identifier
            "type": "audio", // Type of asset (image, audio, etc)
            "preload": false // true or false
          };
          if(id == 'q'){
            $scope.mcqFormData.question.audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.questionMedia.audio = tempAudio;
          }
          else{
            $scope.mcqFormData.options[id].audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.optionsMedia.audio[id] = tempAudio;
          }
        }
      });
}

$scope.addHint = function(id){
  if(id == 'q'){
    $scope.qHint = true;
  }
  else{
    $scope.oHint[id] = true;
  }
}

$scope.deleteImage = function(id){
  if(id == 'q'){
    $scope.mcqFormData.question.image = '';
    delete $scope.questionMedia.image;
  }
  else{
    $scope.mcqFormData.options[id].image = '';
    //$scope.optionsMedia.image.splice(id,1);
    delete $scope.optionsMedia.image[id];
  }
}

$scope.deleteAudio = function(id){
  if(id == 'q'){
    $scope.isPlayingQ = false;
    $scope.mcqFormData.question.audio = '';
    delete $scope.questionMedia.audio;
  }else{
    $scope.mcqFormData.options[id].audio = '';
    //$scope.optionsMedia.audio.splice(id,1);
    delete $scope.optionsMedia.audio[id];
  }
}

$scope.deleteHint = function(id){
   if(id == 'q'){
    $scope.qHint = false;
    $scope.mcqFormData.question.hint = '';
  }
  else{
    $scope.oHint[id] = false;
    $scope.mcqFormData.options[id].hint = '';
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