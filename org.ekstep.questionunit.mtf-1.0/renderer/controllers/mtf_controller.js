// TODO: Controller for horizontalTemplate.html
'use strict';
var app = angular.module('genie-canvas');
app.controllerProvider.register("MTFRendererController", function($scope, $rootScope) {
  $scope.showTemplate = true;
  $scope.question;
  $scope.selectedAns;
  $scope.events = { "show": "", "hide": "", "eval": "" };
  $scope.droppableObjects = [];

  $scope.onDropToLHS = function(index, data, evt) {
    if ($scope.droppableObjects[evt.event.target.id].mapIndex == data.mapIndex) {
      var t = $scope.droppableObjects[index];
      $scope.droppableObjects.splice(index, 1, data);
      $scope.droppableObjects.splice(evt.event.target.id, 1, t);

    } else if ($scope.droppableObjects[evt.event.target.id].mapIndex == data.mapIndex) {
      var t = $scope.droppableObjects[index];
      $scope.droppableObjects.splice(index, 1, data);
      $scope.droppableObjects.splice(evt.event.target.id, 1, $scope.questionObj.option.emptyBoxs[evt.event.target.id]);
    }
    for (var i = 0; i < $scope.draggableObjects.length; i++) {
      if ($scope.draggableObjects[i].mapIndex == data.mapIndex) {
        if (evt.event.target.id && angular.element(evt.event.target).data().$ngModelController.$modelValue.mapIndex != undefined) {
          var t = angular.element(evt.event.target).data().$ngModelController.$modelValue;
          $scope.draggableObjects.push(t);
        }
        $scope.droppableObjects.splice(evt.event.target.id, 1, data);
        $scope.draggableObjects.splice(i, 1);
      }
    }
  }
  $scope.onDropToRHS = function(data, evt) {
    var ctrlScope = angular.element('#mtf-renderer').scope();
    for (var i = 0; i < $scope.droppableObjects.length; i++) {
      if ($scope.droppableObjects[i].mapIndex == data.mapIndex) {
        $scope.droppableObjects.splice(i, 1, ctrlScope.questionObj.option.emptyBoxs[i]);
        $scope.draggableObjects.push(data);
      }
    }
  }


  $scope.init = function() {
    $scope.cssPath = org.ekstep.pluginframework.pluginManager.resolvePluginResource("org.ekstep.questionunit.mtf", "1.0", "renderer/styles/style.css");
    $scope.pluginInstance = EkstepRendererAPI.getPluginObjs("org.ekstep.questionunit.mtf");
    $scope.pluginInstance.initPlugin($scope.pluginInstance);

    $scope.events.eval = $scope.pluginInstance._manifest.id + ":evaluate";
    $scope.events.show = $scope.pluginInstance._manifest.id + ":show";
    $scope.events.hide = $scope.pluginInstance._manifest.id + ":hide";

    $scope.removeEvents();
    $scope.registerEvents();
    if (!$rootScope.isMCQRendererd) {
      $rootScope.isMCQRendererd = true;
    }
    if (EventBus.hasEventListener($scope.events.eval)) {
      if (EventBus.listeners[$scope.events.eval].length > 1)
        EventBus.removeEventListener($scope.events.eval, $scope.evalListener)
    }
  }

  $scope.registerEvents = function() {
    /**
     * renderer:questionunit.ftb:dispatch an event in question set with question data.
     * @event renderer:questionunit.ftb:dispatch
     * @memberof org.ekstep.questionunit.ftb
     */
    EkstepRendererAPI.addEventListener($scope.events.show, $scope.showEventListener);
    /**
     * renderer:questionunit.ftb:hide template on question set navigation.
     * @event renderer:questionunit.ftb:dispatch
     * @memberof org.ekstep.questionunit.ftb
     */
    EkstepRendererAPI.addEventListener($scope.events.hide, $scope.hideEventListener);
    /**
     * renderer:questionunit.ftb:question set call evalution using plugin instance.
     * @event renderer:questionunit.ftb:click
     * @memberof org.ekstep.questionunit.ftb
     */
    EkstepRendererAPI.addEventListener($scope.events.eval, $scope.evalListener);
  }

  $scope.removeEvents = function() {
    EkstepRendererAPI.removeEventListener($scope.events.hide, $scope.hideEventListener, undefined);
    EkstepRendererAPI.removeEventListener($scope.events.show, $scope.showEventListener, undefined);
    EkstepRendererAPI.removeEventListener($scope.events.eval, $scope.evalListener, undefined);
  }

  $scope.showEventListener = function(event) {
    var ctrlScope = angular.element('#mtf-renderer').scope();
    ctrlScope.question = event.target;
    var qData = ctrlScope.question._currentQuestion.data.__cdata || ctrlScope.question._currentQuestion.data;
    var questionData = JSON.parse(qData);
    var qState = ctrlScope.question._currentQuestionState;
    var qConfig = ctrlScope.question._currentQuestion.config;
    ctrlScope.questionObj = questionData;
    ctrlScope.questionObj.option.emptyBoxs = [];
    $scope.draggableObjects = angular.copy(ctrlScope.questionObj.option.optionsRHS);
    for (var l = 0; l < ctrlScope.questionObj.option.optionsLHS.length; l++) {
      var emptyBox = {
        "index": ctrlScope.questionObj.option.optionsLHS[l].index,
        "text": " "
      };
      ctrlScope.questionObj.option.emptyBoxs.push(emptyBox)
      $scope.droppableObjects.push(emptyBox);
    }
    if (qState && qState.val) {
      for (var i = 0; i < qState.val.length; i++) {
        if (qState.val[i].mapIndex != undefined) {
          $scope.droppableObjects.splice(i, 1, qState.val[i]);
        }
        for (var l = 0; l < $scope.draggableObjects.length; l++) {
          if ($scope.draggableObjects[l].mapIndex == qState.val[i].mapIndex) {
            $scope.draggableObjects.splice(l, 1);
          }
        }
      }

    }
    ctrlScope.showTemplate = true;
    var qconfigData = qConfig.__cdata || qConfig;
    ctrlScope.questionObj.questionConfig = JSON.parse(qconfigData);
    ctrlScope.safeApply();
  }

  $scope.hideEventListener = function(event) {
    $scope.showTemplate = false;
    $scope.safeApply();

  }

  $scope.evalListener = function(event) {
    var ctrlScope = angular.element('#mtf-renderer').scope();
    var callback = event.target;
    ctrlScope.evaluate(callback);
    ctrlScope.safeApply();
  }

  $scope.evaluate = function(callback) {
    var correctAnswer = true;
    var stateArray = [];
    var ctrlScope = angular.element('#mtf-renderer').scope();
    for (var i = 0; i < ctrlScope.questionObj.option.optionsLHS.length; i++) {
      stateArray.push($scope.droppableObjects[i]);
      if ($scope.droppableObjects[i].mapIndex != ctrlScope.questionObj.option.optionsLHS[i].index) {
        correctAnswer = false;
      }
    }
    var result = {
      eval: correctAnswer,
      state: {
        val: stateArray
      }
    }
    if (_.isFunction(callback)) {
      callback(result);
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', result.state);
    //commented because when feedback popup shown its becaome null
    //ctrlScope.selectedIndex = null;
  }
  $scope.generateItemResponse = function(val, index) {
    var edata = {
      "target": {
        "id": $scope.pluginInstance._manifest.id ? $scope.pluginInstance._manifest.id : "",
        "ver": $scope.pluginInstance._manifest.ver ? $scope.pluginInstance._manifest.ver : "1.0",
        "type": $scope.pluginInstance._manifest.type ? $scope.pluginInstance._manifest.type : "plugin"
      },
      "type": "CHOOSE",
      "values": [{ index: val.text }]
    }
    TelemetryService.itemResponse(edata);
  }

  $scope.telemetry = function(event) {
    TelemetryService.interact("TOUCH", event.target.id, "TOUCH", {
      stageId: Renderer.theme._currentStage
    });
  }
});
//# sourceURL=questionunitmtfcontroller.js