// TODO: Controller for horizontalTemplate.html
'use strict';
angular.module('genie-canvas').controllerProvider.register("MCQRendererController", function ($scope, $rootScope, $sce) {
  //var ctrl = this;
  $scope.pluginInstance;
  $scope.showTemplate = true;
  $scope.question;
  // $scope.qData;
  $scope.qConfig;
  $scope.selectedAns;
  $scope.events = {
    "show": "",
    "hide": "",
    "eval": ""
  };
  $scope.currentAudio;
  $scope.lastAudio;
  $scope.isShuffleOptions;
  $scope.bigImage = false;
  $scope.expandQ = false;
  //$scope.collapseQ = true;
  $scope.audioImage;
  $scope.init = function () {
    $scope.pluginInstance = EkstepRendererAPI.getPluginObjs("org.ekstep.questionunit.mcq");
    $scope.pluginInstance.initPlugin($scope.pluginInstance);
    $scope.events.eval = $scope.pluginInstance._manifest.id + ":evaluate";
    $scope.events.show = $scope.pluginInstance._manifest.id + ":show";
    $scope.events.hide = $scope.pluginInstance._manifest.id + ":hide";
    $scope.addAudioIcon();
    $scope.removeEvents();
    $scope.registerEvents();
    if (!$rootScope.isMCQRendererd) {
      $rootScope.isMCQRendererd = true;
    }
    if (EventBus.hasEventListener($scope.events.eval)) {
      if (EventBus.listeners[$scope.events.eval].length > 1) EventBus.removeEventListener($scope.events.eval, $scope.evalListener)
    }
  }
  $scope.registerEvents = function () {
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
  /**
   * renderer:questionunit.ftb:question set add audio icon in device and browser.
   * @event renderer:questionunit.ftb:load
   * @memberof org.ekstep.questionunit.ftb
   */
  $scope.addAudioIcon = function () {
    if (isbrowserpreview) { // eslint-disable-line no-undef
      $scope.audioImage = org.ekstep.pluginframework.pluginManager.resolvePluginResource("org.ekstep.questionunit.mcq", "1.0", "renderer/assets/audio.png");
    } else {
      $scope.audioImage = 'file:///' + EkstepRendererAPI.getBaseURL() + "/content-plugins/org.ekstep.questionunit.mcq-1.0/renderer/assets/audio.png";
    }
  }
  $scope.removeEvents = function () {
    EventBus.listeners[$scope.events.show] = undefined;
    EkstepRendererAPI.removeEventListener($scope.events.hide, $scope.hideEventListener, undefined);
    //EkstepRendererAPI.removeEventListener($scope.events.show, $scope.showEventListener, undefined);
    EkstepRendererAPI.removeEventListener($scope.events.eval, $scope.evalListener, undefined);
  }
  $scope.loadAudio = function () {
    $("#preview-mcq-horizontal audio").on("play", function () {
      $("audio").not(this).each(function (index, audio) {
        audio.pause();
      });
    });
  }
  $scope.showImageModel = function (imgUrl) {
    $scope.bigImage = true;
    $scope.imageUrl = imgUrl;
  }
  $scope.hideImagePopup = function () {
    $scope.bigImage = false;
  }
  $scope.expandQuestion = function (event) { // eslint-disable-line no-unused-vars
    if ($scope.expandQ) {
       $(event.target.parentElement.parentElement).css('height','21vh');
       $(".qc-question-audio-image").css("margin-top",'0%');
      $scope.expandQ = false;
    } else {
       $(event.target.parentElement.parentElement).css('height','50vh');
        $(".qc-question-audio-image").css("margin-top",'-8%');
      $scope.expandQ = true;
    }
  }
  $scope.checkBaseUrl = function (url) {
    if (isbrowserpreview) { // eslint-disable-line no-undef
      return url;
    } else {
      return 'file:///' + EkstepRendererAPI.getBaseURL() + url;
    }
  }
  $scope.showEventListener = function (event) {
    var ctrlScope = angular.element('#preview-mcq-horizontal').scope();
    ctrlScope.question = event.target;
    var qData = ctrlScope.question._currentQuestion.data.__cdata || ctrlScope.question._currentQuestion.data;
    var questionData = JSON.parse(qData);
    var qConfig = ctrlScope.question._currentQuestion.config.__cdata || ctrlScope.question._currentQuestion.config;
    $scope.qConfig = JSON.parse(qConfig);
    // if (isbrowserpreview) {
    //     _.map(questionData.media, function(url) {
    //         url.src = 'file:///' + EkstepRendererAPI.getBaseURL() + url.src;
    //     })
    // }
    $scope.isShuffleOptions = $scope.qConfig.isShuffleOption;
    if ($scope.isShuffleOptions) {
      questionData.options = _.shuffle(questionData.options);
    }
    var qState = ctrlScope.question._currentQuestionState;
    if (qState && qState.val) {
      ctrlScope.selectedIndex = qState.val;
    }
    if (qState && qState.options) {
      questionData.options = qState.options;
    }
    ctrlScope.questionObj = questionData;
    ctrlScope.questionObj.plainQuestion = $scope.extractHTML(ctrlScope.questionObj.question.text);
    ctrlScope.questionObj.topOptions = [];
    ctrlScope.questionObj.bottomOptions = [];
    ctrlScope.questionObj.options.forEach(function (option, key) {
      if (ctrlScope.questionObj.options.length <= 4 || ctrlScope.questionObj.options.length > 6) {
        if (key < 4) ctrlScope.questionObj.topOptions.push({
          'option': option,
          'key': key
        });
        else ctrlScope.questionObj.bottomOptions.push({
          'option': option,
          'key': key
        });
      } else if (ctrlScope.questionObj.options.length == 5 || ctrlScope.questionObj.options.length == 6) {
        if (key < 3) ctrlScope.questionObj.topOptions.push({
          'option': option,
          'key': key
        });
        else ctrlScope.questionObj.bottomOptions.push({
          'option': option,
          'key': key
        });
      }
    })
    ctrlScope.showTemplate = true;
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
    ctrlScope.questionObj.questionConfig = JSON.parse(qConfig);
    var state = {
      val: ctrlScope.selectedIndex,
      options: questionData.options
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', state);
    ctrlScope.safeApply();
  }
  $scope.hideEventListener = function (event) { // eslint-disable-line no-unused-vars
    // var ctrlScope = angular.element('#preview-mcq-horizontal').scope();
    // ctrlScope.showTemplate = false;
    // ctrlScope.safeApply();
    //code commented beause on click reply scope object not find
    $scope.showTemplate = false;
    $scope.safeApply();
  }
  $scope.evalListener = function (event) {
    var ctrlScope = angular.element('#preview-mcq-horizontal').scope();
    var callback = event.target;
    ctrlScope.evaluate(callback);
    ctrlScope.safeApply();
  }
  $scope.selectedvalue = function (val, index) {
    $scope.selectedIndex = index;
    $scope.selectedAns = val.isCorrect;
    var state = {
      val: $scope.selectedIndex,
      options: $scope.questionObj.options,
      score: $scope.qConfig.max_score
    }
    var telValues = {};
    telValues['option' + index] = val.image.length > 0 ? val.image : val.text;
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, { // eslint-disable-line no-undef
      "type": "MCQ",
      "values": [telValues]
    });
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', state);
  }

  $scope.trustAsHtml = function (string) {
    return $sce.trustAsHtml(string);
  }

  $scope.extractHTML = function (htmlElement) {
    var divElement = document.createElement('div');
    divElement.innerHTML = htmlElement;
    return divElement.textContent || divElement.innerText;
  }

  $scope.evaluate = function (callback) {
    var correctAnswer;
    var telValues = {};
    var ctrlScope = angular.element('#preview-mcq-horizontal').scope();
    var selectedAnsData = ctrlScope.questionObj.options[ctrlScope.selectedIndex - 1];
    var selectedAns = _.isUndefined(selectedAnsData) ? false : selectedAnsData.isCorrect;
    ctrlScope.questionObj.options.forEach(function (option) {
      if (option.isCorrect === selectedAns) {
        correctAnswer = option.isCorrect;
      }
    });
    if (!_.isUndefined(ctrlScope.selectedIndex)) telValues['option' + ctrlScope.selectedIndex] = selectedAnsData.image.length > 0 ? selectedAnsData.image : selectedAnsData.text;
    var result = {
      eval: correctAnswer,
      state: {
        val: ctrlScope.selectedIndex,
        options: ctrlScope.questionObj.options
      },
      score: correctAnswer ? $scope.qConfig.metadata.max_score : 0,
      values: [telValues]
    }
    if (_.isFunction(callback)) {
      callback(result);
    }
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result); // eslint-disable-line no-undef
  }
  $scope.logTelemetryInteract = function (event) {
    if (event != undefined) QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.TOUCH, { // eslint-disable-line no-undef
      type: QSTelemetryLogger.EVENT_TYPES.TOUCH, // eslint-disable-line no-undef
      id: event.target.id
    });
  }
  $scope.playAudio = function (audio) {
    audio = $scope.checkBaseUrl(audio);
    if ($scope.lastAudio && ($scope.lastAudio != audio)) {
      $scope.currentAudio.pause();
    }
    if (!$scope.currentAudio || $scope.currentAudio.paused) {
      $scope.currentAudio = new Audio(audio);
      $scope.currentAudio.play();
      $scope.lastAudio = audio;
    } else {
      $scope.currentAudio.pause();
      $scope.currentAudio.currentTime = 0
    }
  }
});
//# sourceURL=questionunitmcqcontroller.js