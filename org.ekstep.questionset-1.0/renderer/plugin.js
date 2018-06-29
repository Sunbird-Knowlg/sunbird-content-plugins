/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author sachin.kumar@goodworklabs.com>
 */
org.ekstep.questionsetRenderer = IteratorPlugin.extend({ // eslint-disable-line no-undef
  _type: 'org.ekstep.questionset',
  _isContainer: true,
  _render: true,
  _questionSetConfig: {
    'total_items': 1,
    'show_feedback': true,
    'shuffle_questions': false
  },
  _masterQuestionSet: [],
  _renderedQuestions: [],
  _questionStates: {},
  _firstQuestion: false,
  _lastQuestion: false,
  _currentQuestion: undefined,
  _currentQuestionState: undefined,
  _stageObject: undefined,
  _displayedPopup: false,
  _constants: {
    questionPluginId: 'org.ekstep.question',
    qsElement: '#questionset',
    qsPopup:'qs-feedback-model-popup',
    questionsetCSS: {
      width: '100%',
      position: 'absolute',
      top: '2%',
      left: 0,
      height: '100%'
    },
    feedbackCSS: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      'z-index': 999999,
      top: 0,
      display: 'none'
    },
    qsPrefix: 'qs',
    qsQuizPlugin: 'org.ekstep.questionset.quiz'
  },
  _questionUnitPlugins: [],
  initPlugin: function(data) {
    var instance = this;
    // Register for navigation hooks
    this.registerNavigation(instance);
    // On content replay, reset all question set information.
    EkstepRendererAPI.addEventListener('renderer:content:replay', function() {
      instance.resetQS.call(instance);
      this.registerNavigation(instance);
    }, instance);
    // Remove duplicate event listener
    EventBus.listeners['org.ekstep.questionset:feedback:retry'] = [];
    EkstepRendererAPI.addEventListener('org.ekstep.questionset:feedback:retry', function() {
      this._displayedPopup = false;
    }, instance);
    // Event handler to save question state
    EventBus.listeners['org.ekstep.questionset:saveQuestionState'] = undefined;
    EkstepRendererAPI.addEventListener(instance._data.pluginType + ':saveQuestionState', function(event) {
      var state = event.target;
      if (instance._currentQuestion) {
        instance.saveQuestionState(instance._currentQuestion.id, state);
      }
    }, this);
    // Load the DOM container that houses the unit templates
    this.loadTemplateContainer();
    this._questionSetConfig = this._data.config ? JSON.parse(this._data.config.__cdata) : this._questionSetConfig;
    // this.setupNavigation();
    // Get all questions in the question set
    var quesArray = angular.copy(data[this._constants.questionPluginId]);
    // this._masterQuestionSet = _.isArray(quesArray) ? quesArray : _.toArray({quesArray});
    this._masterQuestionSet = _.isArray(quesArray) ? quesArray : _.toArray(quesArray);
    // If this isn't the first time the question set is being rendered, restore its earlier state
    this._questionStates = {};
    this._renderedQuestions = [];
    var question = undefined;
    var savedQSState = this.getQuestionSetState();
    if (savedQSState) {
      this._renderedQuestions = savedQSState.renderedQuestions;
      question = savedQSState.currentQuestion;
      this._questionStates = savedQSState.questionStates;
      this._currentQuestionState = this.getQuestionState(this._currentQuestion.id);
    } else {
      question = this.getNextQuestion();
    }
    this.saveQuestionSetState();
    // Render the question
    this.renderQuestion(question);
  },
  renderQuestion: function(question) {
    var instance = this;
    // If this is not the first question, hide the current question
    if (instance._currentQuestion) {
      EkstepRendererAPI.dispatchEvent(instance._currentQuestion.pluginId + ':hide', instance);
      jQuery('#' + instance._currentQuestion.id).remove();
    }
    if (question.pluginId === this._constants.qsQuizPlugin) {
      //if question is quiz then remove question set div
      this.removeTemplateContainer();
      // Mark the question as rendered
      instance._currentQuestion = question;
      this.setRendered(question);
      // Set current question for telmetry to log events from question-unit
      QSTelemetryLogger.setQuestion(instance._currentQuestion, instance.getRenderedIndex()); // eslint-disable-line no-undef
      setTimeout(function() {
        Renderer.update = true;
      }, 500);
      // For V1 questions, invoke the 'questionset.quiz' plugin.
      // TODO: Move state saving of V1 questions from questionset.quiz to here, like V2 questions
      PluginManager.invoke(question.pluginId, question, this._stage, this._stage, this._theme);
    } else {
      this.loadTemplateContainer();
      // For V2 questions, load the AngularJS template and controller and invoke the event to render the question
      // Fetch the question state if it was already rendered before
      this._currentQuestionState = this.getQuestionState(question.id);
      // Mark the question as rendered
      instance._currentQuestion = question;
      // Set current question for telmetry to log events from question-unit
      QSTelemetryLogger.setQuestion(instance._currentQuestion, instance.getRenderedIndex()); // eslint-disable-line no-undef
      this.setRendered(question);
      EkstepRendererAPI.dispatchEvent(question.pluginId + ':show', instance);
    }
  },
  setRendered: function(question) {
    var instance = this,
      element;
    // Mark the question as rendered in the _masterQuestionSet
    // This is to ensure that we do not re-render the same question twice (in case of shuffle)
    element = _.find(instance._masterQuestionSet, function(item) {
      return item.id === question.id;
    });
    element.rendered = true;
    // Add the rendered question to the _renderedQuestions array - this will be saved for future
    // when the question set may be re-rendered when revisiting the stage
    // This array also helps in navigation between already rendered questions.
    var renderedQuestion = _.find(instance._renderedQuestions, function(q) {
      return q.id === question.id
    });
    if (_.isUndefined(renderedQuestion)) {
      instance._renderedQuestions.push(question);
    }
    // Set first/last question flags
    // this._firstQuestion = (this.getRenderedIndex() === 0);
    // this._lastQuestion = (this._renderedQuestions.length + 1 >= this._questionSetConfig.total_items);
    this._itemIndex = this.getRenderedIndex();
  },
  endOfQuestionSet: function() {
    return (this._renderedQuestions.length >= this._questionSetConfig.total_items);
  },
  nextQuestion: function() {
    // Trigger the evaluation for the question
    var instance = this;
    if (!this._displayedPopup) {
      EkstepRendererAPI.dispatchEvent(this._currentQuestion.pluginId + ":evaluate", function(result) {
        if (instance._questionSetConfig.show_feedback == true) {
          // Display feedback popup (tryagain or goodjob)
          // result.pass is added to handle sorting-template(Custom IEvaluator) issue. This can be generic solution for other
          instance.displayFeedback(result);
        } else {
          // If show_feedback is set to false, move to next question without displaying feedback popup
          instance.renderNextQuestion();
        }
      });
    } else {
      this._displayedPopup = false;
      instance.renderNextQuestion();
    }
  },
  displayFeedback: function(result) {
    var res = result.eval ? result.eval : result.pass;
    if (res === true) {
      QSFeedbackPopup.showGoodJob(); // eslint-disable-line no-undef
    } else {
      if (result.score > 0) {
        var partialScoreRes = result.noOfCorrectAns + ' / ' + result.totalAns;
        QSFeedbackPopup.qsPartialCorrect(partialScoreRes); // eslint-disable-line no-undef
      }
      else {
        QSFeedbackPopup.showTryAgain(); // eslint-disable-line no-undef
      }
    }
    this._displayedPopup = true;
  },
  renderNextQuestion: function() {
    // Get the next question to be rendered
    var instance = this;
    var nextQ = this.getNextQuestion();
    if (nextQ) {
      this.renderQuestion(nextQ);
      this.generateNavigateTelemetry(null, this._currentQuestion.id);
    } else {
      // If no question is remaining, it is the end of the question set, move to next stage after
      // hiding the last question and some housekeeping
      this.saveQuestionSetState();
      this.generateNavigateTelemetry('next', 'ContentApp-EndScreen');
      EkstepRendererAPI.dispatchEvent(this._currentQuestion.pluginId + ':hide', instance);
      // this.resetNavigation();
      this.resetListeners();
      this.resetTemplates();
      if (!this._displayedPopup) {
        this.deregisterNavigation(this);
      }
      OverlayManager.skipAndNavigateNext();
    }
  },
  prevQuestion: function() {
    this.renderPrevQuestion();
  },
  renderPrevQuestion: function() {
    // Get the previous question to be rendered
    var instance = this;
    var prevQ = this.getPrevQuestion();
    if (prevQ) {
      this.renderQuestion(prevQ);
      this.generateNavigateTelemetry(null, this._currentQuestion);
    } else {
      // If no question is remaining, it is the beginning of the question set, move to previous stage after
      // hiding the first question and some housekeeping
      this.saveQuestionSetState();
      this.generateNavigateTelemetry('previous', 'ContentApp-StartScreen');
      EkstepRendererAPI.dispatchEvent(this._currentQuestion.pluginId + ':hide', instance);
      // this.resetNavigation();
      this.resetListeners();
      this.resetTemplates();
      this.deregisterNavigation(this);
      OverlayManager.navigatePrevious();
    }
  },
  getNextQuestion: function() {
    // Check if the next question has already been rendered (are we moving back and forth within the question set?)
    var renderIndex = this.getRenderedIndex();
    if ((renderIndex + 1 >= this._renderedQuestions.length) && !this.endOfQuestionSet()) {
      // The next question should be picked from the master question array, so fetch the list of all questions
      // that are NOT marked as 'rendered'
      var unRenderedQuestions = this._masterQuestionSet.filter(function(q) {
        return (_.isUndefined(q.rendered)) ? true : !q.rendered;
      });
      // If shuffle is on, return a random question from the list of NOT rendered questions
      if (this._questionSetConfig.shuffle_questions) {
        return _.sample(unRenderedQuestions);
      }
      // If shuffle is off, return the next question in the list
      return unRenderedQuestions.shift();
    } else {
      // If the next question has already been rendered, fetch it from the _renderedQuestions array
      return this._renderedQuestions[renderIndex + 1];
    }
  },
  getPrevQuestion: function() {
    // The previous question is always obtained from the _renderedQuestions array.
    // If the index becomes < 0, it means that we have already returned the first question
    // and can go back any further
    var renderIndex = this.getRenderedIndex();
    if (renderIndex - 1 < 0) {
      return undefined;
    }
    return this._renderedQuestions[renderIndex - 1];
  },
  getRenderedIndex: function() {
    var instance = this;
    var index = _.findIndex(this._renderedQuestions, function(q) {
      return q.id === instance._currentQuestion.id;
    });
    return index;
  },
  //remove question set div inside the game area
  removeTemplateContainer:function(){
    $(this._constants.qsElement).remove();
  },
  //add questionset div inside the game Area
  loadTemplateContainer: function() {
    var qsElement = $('<div />', {
      id: this._constants.qsElement.replace('#', ''),
      class: ''
    }).css(this._constants.questionsetCSS);
    if ($(this._constants.qsElement).length === 0) {
      var qsFeedback  = $('<div />', {
        id: this._constants.qsPopup,
      }).css(this._constants.feedbackCSS);
      $("#gameArea").append(qsElement);
      $("#gameArea").append(qsFeedback);
    }
  },
  getQuestionState: function(questionId) {
    return this._questionStates[questionId];
  },
  getQuestionSetState: function() {
    return Renderer.theme.getParam(this._data.id);
  },
  saveQuestionState: function(questionId, state) {
    if (state) {
      var qsState = this.getQuestionSetState();
      qsState = _.isUndefined(qsState) ? {} : qsState;
      this._questionStates[questionId] = state;
      qsState.questionStates = this._questionStates;
      Renderer.theme.setParam(this._data.id, JSON.parse(JSON.stringify(qsState)));
    }
  },
  saveQuestionSetState: function() {
    var qsState = {
      masterQuestionSet: this._masterQuestionSet,
      renderedQuestions: this._renderedQuestions,
      currentQuestion: this._currentQuestion,
      questionStates: this._questionStates
    };
    Renderer.theme.setParam(this._data.id, JSON.parse(JSON.stringify(qsState)));
  },
  resetTemplates: function() {
    // Remove all templates loaded for the question set
    jQuery(this._constants.qsElement).remove();
  },
  resetQS: function() {
    // this.resetNavigation();
    var instance = this;
    Renderer.theme.setParam(this._data.id, undefined);
    this.deregisterNavigation(instance);
    setTimeout(function() {
      instance.resetListeners();
    }, 100);
  },
  resetListeners: function() {
    // The following code will unregister all event listeners added by the question unit plugins
    // This is to ensure that the event listeners do not overlap when there are two or more question sets
    // in the same content.
    _.forEach(this._questionUnitPlugins, function(value){
      for (var key in EventBus.listeners) {
        if (key.indexOf(value) !== -1) {
          if (EventBus.listeners.hasOwnProperty(key)) {
            EventBus.listeners[key] = undefined;
          }
        }
      }
    })

  },
  generateNavigateTelemetry: function(buttonId, currentQuestion) {
    var stageTo, objid;
    var stageid = EkstepRendererAPI.getCurrentStageId();
    if (buttonId) {
      stageTo = EkstepRendererAPI.getCurrentStage().getParam(buttonId);
      objid = stageTo;
      objid = objid ? objid : currentQuestion;
      stageTo = stageTo ? stageTo : currentQuestion;
    } else {
      stageTo = stageid;
      objid = currentQuestion;
    }
    var data = {
      "type": "view",
      "subtype": "Paginate",
      "pageid": stageid,
      "uri": "",
      "visits": {
        "objid": objid,
        "objtype": ""
      }
    };
    TelemetryService.navigate(stageid, stageTo, data); // eslint-disable-line no-undef
  },
  handleNext: function() {
    this.nextQuestion();
  },
  handlePrevious: function() {
    this.prevQuestion();
  }
});
//# sourceURL=questionSetRenderer.js