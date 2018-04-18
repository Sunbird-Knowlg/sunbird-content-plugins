'use strict';
app.controllerProvider.register("KeyboardCtrl", function($scope) {
  $scope.keyboardVisible = false;
  $scope.answerText = undefined;
  $scope.answerText = '';
  $scope.numerickeys = false;
  EkstepRendererAPI.addEventListener("renderer:keyboard:invoke", function(e, callback) {
    $scope.callback = callback;
    $scope.config = JSON.parse(e.target.qData);
    $scope.question = $scope.config.question.text.replace(/\[\[.*?\]\]/g, '____');
    $scope.keyboardVisible = true;
    var customButtons = '';
    $scope.answerText = _.isUndefined(e.target.inputoldValue.value) ? '' : e.target.inputoldValue.value;
    if ($scope.config.question.keyboardConfig.keyboardType == "English") {
      $("#qs-ftb-text").hide();
      customButtons = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
      $scope.createKeyboard(customButtons, $scope.config);
    } else if ($scope.config.question.keyboardConfig.keyboardType == 'Custom') {
      $("#qs-ftb-text").hide();
      _.each($scope.config.question.keyboardConfig.customKeys, function(key, val) {
        customButtons = customButtons + key + ',';
      });
      $scope.createKeyboard(customButtons, $scope.config);
    } else if ($scope.config.question.keyboardConfig.keyboardType == 'Device') {
      $scope.keyboardVisible = false;
    }
    $scope.safeApply();
  });
  $scope.erasIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/eras_icon.png");
  $scope.langIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/language_icon.png");
  $scope.createKeyboard = function(customButtons, config) {
    var customButtons = customButtons;
    customButtons = customButtons.replace(/ /g, '');
    customButtons = customButtons.split(',');
    customButtons = _.uniq(customButtons);
    $scope.buttons = customButtons.splice(0, customButtons.length);
    if ($scope.buttons.length > 13) {
      var splitButtonto = parseInt($scope.buttons.length / 2);
      $scope.buttons.firstRow = $scope.buttons.slice(0, splitButtonto);
      $scope.buttons.secondRow = $scope.buttons.slice(splitButtonto, $scope.buttons.length - 1);
      $scope.keyWidth = parseInt(90 / $scope.buttons.secondRow.length);;
    } else {
      $scope.buttons.secondRow = $scope.buttons;
      $scope.keyWidth = parseInt(100 / $scope.buttons.length);;
    }
  }
  $scope.changeToNumeric = function() {
    $scope.numerickeys = true;
  }
  $scope.changeToAlphabet = function() {
    $scope.numerickeys = false;
  }
  $scope.addLetter = function(event) {
    if (!_.isUndefined($scope.answerText)) {
      if (event.target.innerText != '123') $scope.answerText = $scope.answerText + event.target.innerText;
    } else {
      if (event.target.innerText != '123') $scope.answerText = event.target.innerText;
    }
    $scope.safeApply();
  }
  $scope.deleteText = function() {
    $scope.answerText = $scope.answerText.substring(0, $scope.answerText.length - 1);
    $scope.safeApply();
  }
  $scope.hideKeyboard = function() {
    $scope.keyboardVisible = false;
    $scope.callback($scope.answerText);
  }
});
//# sourceURL=keyboardCtrl.js