/**
 * Plugin to create MCQ question
 * @class org.ekstep.questionunitmcq:mcqQuestionFormController
 * Jagadish P<jagadish.pujari@tarento.com>
 */

angular.module('createquestionapp', [])
 .controller('ftbQuestionFormController', ['$scope', '$rootScope', function($scope, $rootScope) {

  $scope.formVaild = false;
  $scope.ftbFormData = {
    'question': { 'text': '', 'image': '', 'audio': '' },
    'answer': { 'text': '' }
  };

  $scope.init = function() {
    $('.menu .item').tab();
    $('.ui.dropdown').dropdown({ useLabels: false });

    if (!ecEditor._.isUndefined($scope.questionEditData)) {
      var data = $scope.questionEditData.data;
      $scope.ftbFormData.question = data.question;
      $scope.ftbFormData.answer = data.answer;
    }

    $scope.$parent.$on('question:form:val', function(event) {
      if ($scope.formValidation()) {
        $scope.$emit('question:form:valid', $scope.ftbFormData);
      } else {
        $scope.$emit('question:form:inValid', $scope.ftbFormData);
      }
    })
  }

  $scope.formValidation = function() {
    $scope.submitted=true;
    var formValid = $scope.ftbForm.$valid;
    return (formValid) ? true : false;
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