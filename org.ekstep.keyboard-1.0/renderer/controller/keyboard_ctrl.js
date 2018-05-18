'use strict';
angular.module('genie-canvas')
.controllerProvider.register("KeyboardCtrl", function($scope) {
  $scope.keyboardVisible = false;
  $scope.answerText = undefined;
  $scope.answerText = '';
  $scope.numerickeys = false;
  $scope.ftbInputTarget = '';

  EkstepRendererAPI.addEventListener("org.ekstep.keyboard:invoke", function(e, callback) {
    $scope.callback = callback;
    $scope.answer = [];
    $scope.config = JSON.parse(e.target.qData);
    $scope.question = $scope.config.question.text.replace(/\[\[.*?\]\]/g, '____');
    $scope.keyboardVisible = true;
    var customButtons = '';
    $scope.answerText = _.isUndefined(e.target.inputoldValue.value) ? '' : e.target.inputoldValue.value;
    $scope.ftbInputTarget = e.target.inputoldValue.id;
    if (!_.isUndefined($scope.config.question.keyboardConfig)) {
      if ($scope.config.question.keyboardConfig.keyboardType == "English") {
        $("#qs-ftb-text").hide();
        customButtons = "Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M";
        $scope.createKeyboard(customButtons);
      } else if ($scope.config.question.keyboardConfig.keyboardType == 'Custom') {
        $("#qs-ftb-text").hide();
        customButtons = $scope.config.question.keyboardConfig.customKeys;
        $scope.createKeyboard(customButtons);
      } else if ($scope.config.question.keyboardConfig.keyboardType == 'Device') {
        $scope.keyboardVisible = false;
      }
    }else{
      $scope.keyboardVisible = false;
    }
    $scope.safeApply();
  });

  EkstepRendererAPI.addEventListener("org.ekstep.keyboard:hide", function(){
    $scope.keyboardVisible = false;
    $scope.safeApply();
  });

  $scope.erasIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/eras_icon.png");
  $scope.langIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/language_icon.png");

  $scope.createKeyboard = function(customButtons) {
    //var customButtons = customButtons;
    customButtons = customButtons.replace(/ /g,'');
    customButtons = customButtons.split(',');
    customButtons = _.uniq(customButtons);
    $scope.buttons = customButtons.splice(0, customButtons.length);
    var splitButtonto = parseInt($scope.buttons.length / 2);
    $scope.buttons.firstRow = $scope.buttons.slice(0, splitButtonto);
    $scope.buttons.secondRow = $scope.buttons.slice(splitButtonto, $scope.buttons.length);
    $scope.keyWidth = parseInt(100 / $scope.buttons.secondRow.length);
  }

  $scope.changeToNumeric = function() {
    $scope.numerickeys = true;
  }

  $scope.changeToAlphabet = function() {
    $scope.numerickeys = false;
  }

  $scope.addLetter = function(event) {
    if (!_.isUndefined($scope.answerText)) {
      if (event.target.innerText != '123') {
        $scope.answer.push(event.target.innerText);
        $scope.answerText = $scope.answer.join("");
      }
    } else {
      if (event.target.innerText != '123') $scope.answerText = event.target.innerText;
    }
    $("#" + $scope.ftbInputTarget).val($scope.answerText);
    $scope.safeApply();
  }

  $scope.deleteText = function() {
    $scope.answer.pop();
    $scope.answerText = $scope.answer.join("");
    $scope.safeApply();
  }

  $scope.hideKeyboard = function() {
    $scope.keyboardVisible = false;
    $scope.callback($scope.answerText);
  }
});
//# sourceURL=keyboardCtrl.js