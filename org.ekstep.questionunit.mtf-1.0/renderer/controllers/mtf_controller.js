// TODO: Controller for horizontalTemplate.html
'use strict';
var app = angular.module('genie-canvas');
app.controllerProvider.register("MTFRendererController", function($scope, $rootScope) {
  //var ctrl = this;
  $scope.showTemplate = true;
  $scope.question;
  $scope.selectedAns;
  $scope.events = { "show": "", "hide": "", "eval": "" };
  $scope.droppedObjects1 = [];

  $scope.onDropComplete1 = function(index, data, evt) {
    console.log(evt.event.target.id);
    if ($scope.droppedObjects1[evt.event.target.id].mapIndex == data.mapIndex) {
      var t = $scope.droppedObjects1[index];
      $scope.droppedObjects1.splice(index, 1, data);
      $scope.droppedObjects1.splice(evt.event.target.id, 1, t);

    }
    for (var i = 0; i < $scope.draggableObjects.length; i++) {
      if ($scope.draggableObjects[i].mapIndex == data.mapIndex) {
        if (evt.event.target.id && angular.element(evt.event.target).data().$ngModelController.$modelValue.mapIndex != undefined) {
          var t = angular.element(evt.event.target).data().$ngModelController.$modelValue;
          $scope.draggableObjects.push(t);
        }
        $scope.droppedObjects1.splice(evt.event.target.id, 1, data);
        $scope.draggableObjects.splice(i, 1);
      }
    }
  }
  $scope.onDropComplete2 = function(data, evt) {
    var ctrlScope = angular.element('#mtf-renderer').scope();
    for (var i = 0; i < $scope.droppedObjects1.length; i++) {
      if ($scope.droppedObjects1[i].mapIndex == data.mapIndex) {
        $scope.droppedObjects1.splice(i, 1, ctrlScope.questionObj.lhs_options[i]);
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
    if (qState && qState.val) {
      ctrlScope.selectedIndex = qState.val;
    }
    var qConfig = ctrlScope.question._currentQuestion.config;
    ctrlScope.questionObj = questionData;
    $scope.draggableObjects = angular.copy(ctrlScope.questionObj.rhs_options);
    $scope.droppedObjects1 = angular.copy(ctrlScope.questionObj.lhs_options);
    ctrlScope.showTemplate = true;
    ctrlScope.questionObj.questionConfig = JSON.parse(qConfig);
    ctrlScope.safeApply();
  }

  $scope.hideEventListener = function(event) {
    // var ctrlScope = angular.element('#preview-mcq-horizontal').scope();
    // ctrlScope.showTemplate = false;
    // ctrlScope.safeApply();
    //code commented beause on click reply scope object not find
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
    var ctrlScope = angular.element('#mtf-renderer').scope();
    for (var i = 0; i < ctrlScope.questionObj.lhs_options.length; i++) {
      if ($scope.droppedObjects1[i].mapIndex != ctrlScope.questionObj.lhs_options[i].index) {
        correctAnswer = false;
      }
    }
    var result = {
      eval: correctAnswer,
      state: {
        val: 1
      }
    }
    if (_.isFunction(callback)) {
      callback(result);
    }
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