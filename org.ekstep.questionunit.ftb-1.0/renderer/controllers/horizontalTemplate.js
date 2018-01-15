'use strict';
angular.module('FTBRendererApp', []).controller("FTBRendererController", function($scope) {
  $scope.showTemplate = true;
  $scope.question;
  $scope.ftbAnswer;
  $scope.qcquestion = true;
  $scope.qcblank = true;
  $scope.cssPath = org.ekstep.pluginframework.pluginManager.resolvePluginResource("org.ekstep.questionunit.ftb", "1.0", "renderer/styles/horizontalTemplate.css");
  $scope.init = function() {
    $scope.pluginInstance = EkstepRendererAPI.getPluginObjs("org.ekstep.questionunit.ftb");
    // To show template/plugin  
        /**
     * renderer:questionunit.ftb:dispatch an event in question set with question data.
     * @event renderer:questionunit.ftb:dispatch
     * @memberof org.ekstep.questionunit.ftb
     */
    EkstepRendererAPI.addEventListener($scope.pluginInstance._manifest.id + ":show", function(event, question) {
      $scope.question = event.target;
      var questionData = JSON.parse($scope.question._currentQuestion.data);
      $scope.questionObj = questionData;
      $scope.showTemplate = true;
      $scope.safeApply();
    });
    /**
     * renderer:questionunit.ftb:hide template on question set navigation.
     * @event renderer:questionunit.ftb:dispatch
     * @memberof org.ekstep.questionunit.ftb
     */
    EkstepRendererAPI.addEventListener($scope.pluginInstance._manifest.id + ":hide", function(event) {
      $scope.showTemplate = false;
      $scope.safeApply();
    });
    /**
     * renderer:questionunit.ftb:question set call evalution using plugin instance.
     * @event renderer:questionunit.ftb:click
     * @memberof org.ekstep.questionunit.ftb
     */
    EkstepRendererAPI.addEventListener($scope.pluginInstance._manifest.id + ":evaluate", function(event) {
      $scope.evaluate();
      $scope.safeApply();
    });

  }
  $scope.init();
  /**
     * renderer:questionunit.ftb:show keyboard in device.
     * @event renderer:questionunit.ftb:click
     * @memberof org.ekstep.questionunit.ftb
     */
  window.addEventListener('native.keyboardshow', function(e) {
    $scope.qcquestion = false;
    $scope.safeApply();
  });
   /**
     * renderer:questionunit.ftb:hide keyboard in device.
     * @event renderer:questionunit.ftb:click
     * @memberof org.ekstep.questionunit.ftb
     */
  window.addEventListener('native.keyboardhide', function() {
    $scope.qcquestion = true;
    $scope.qcblank = true;
    $scope.safeApply();
  });

  $scope.evaluate = function() {
    var correctAnswer = false;
    if ($scope.questionObj.answers[0].text.toLowerCase().replace(/ /g, '') === $scope.ftbAnswer.toLowerCase().replace(/ /g, '')) {
      correctAnswer = true;
    }
    if (correctAnswer) {
      alert("right ftbAnswer");

    } else {
      alert("wrong ftbAnswer");
    }
  }
});
//# sourceURL=questionunitFtbRenderereTmpPlugin.js