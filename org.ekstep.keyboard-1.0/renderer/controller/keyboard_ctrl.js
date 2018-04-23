'use strict';
app.controllerProvider.register("KeyboardCtrl", function($scope) {
  $scope.keyboardVisible = false;
  $scope.answerText = undefined;
  $scope.answerText = '';
  $scope.numerickeys = false;

  EkstepRendererAPI.addEventListener("org.ekstep.keyboard:invoke", function(e, callback) {
    $scope.callback = callback;
    $scope.config = JSON.parse(e.target.qData);
    $scope.question = $scope.config.question.text.replace(/\[\[.*?\]\]/g, '____');
    $scope.keyboardVisible = true;
    var customButtons = '';
    $scope.answerText = _.isUndefined(e.target.inputoldValue.value) ? '' : e.target.inputoldValue.value;
    if ($scope.config.question.keyboardConfig.keyboardType == "English") {
      customButtons = "Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M";
      $scope.createKeyboard(customButtons, $scope.config);
    } else if ($scope.config.question.keyboardConfig.keyboardType == 'Custom') {
      customButtons = '';
      _.each($scope.config.question.keyboardConfig.customKeys, function(key, val) {
        if(val < $scope.config.question.keyboardConfig.customKeys.length)
        customButtons = customButtons + key + ',';
      });
      $scope.createKeyboard(customButtons, $scope.config);
    } else if ($scope.config.question.keyboardConfig.keyboardType == 'Device') {
      $scope.keyboardVisible = false;
    }
    $scope.safeApply();
  });

  EkstepRendererAPI.addEventListener("org.ekstep.keyboard:hide", function() {
    $scope.keyboardVisible = false;
    $scope.safeApply();
  }); 

  $scope.erasIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/eras_icon.png");
  $scope.langIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/language_icon.png");

  $scope.createKeyboard = function(customButtons, config) {
    var customButtons = customButtons;
    customButtons = customButtons.replace(/ /g,'');
    customButtons = customButtons.split(',');
    customButtons = _.uniq(customButtons);
    $scope.buttons = customButtons.splice(0, customButtons.length);
    var splitButtonto = parseInt($scope.buttons.length / 2);
    $scope.buttons.firstRow = $scope.buttons.slice(0, splitButtonto);
    $scope.buttons.secondRow = $scope.buttons.slice(splitButtonto, $scope.buttons.length);
    $scope.keyWidth = parseInt(100 / $scope.buttons.secondRow.length);;
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