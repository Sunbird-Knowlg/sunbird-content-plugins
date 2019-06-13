/**
 * Question Unit plugin to render a MCQ question
 * @class org.ekstep.questionunit.mcq
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Kartheek Palla <kartheekp@ilimi.in> & Bhabaranjan Panigrahi <bhabaranjan@ilimi.in>
 */
org.ekstep.questionunit.quml = {};
org.ekstep.questionunit.quml.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
    responseValueMap: {},
    preQuestionShow: function(event) {
        var questionData = JSON.parse(event.target._currentQuestion.data.__cdata);
        questionData.question = this.replaceAssetWithBaseURL(questionData.question);
        if (questionData.solution) {
            questionData.solution[0] = this.replaceAssetWithBaseURL(questionData.solution[0]);
        }
        event.target._currentQuestion.data.__cdata = JSON.stringify(questionData);
        this._super(event);
        if (this._question.data.solution && this._question.data.solution[0].length > 0) {
            this._question.template = "<div class='sb-question-dsp-body'> \
            <div class='sb-question-header question-bg'> \
              <span class='sb-question'></span><span class='sb-mark'>1 Marks</span> \
                <button  class='sb-btn sb-btn-primary sb-btn-normal' id='questionBtn' style='display: none;' type='button'>Question</button> \
                <button  class='sb-btn sb-btn-secondary sb-btn-normal mr-0' id='answerBtn' type='button' style='display: inline-block;'>Solution</button> \
            </div> \
            <div class='sb-question-content'> \
            <div class='page-section question-bg' id='question'> \
              <div class='sb-question'>Question<span class='sb-star-icon'><i class='star outline icon'></i></span></div>\
              <div class='sb-question-content-card'>" + questionData.question + "</div> \
            </div> \
            <div class='page-section answer-bg' id='answer'> \
              <div class='sb-answer'>Solution</div> \
              <div  class='sb-question-content-card'>" + questionData.solution[0] + "</div> \
            </div>\
            </div></div>";
        } else {
            this._question.template = questionData.question
        }
    },
    /**
     * Listen event after display the question
     * @memberof org.ekstep.questionunit.mcq
     * @param {Object} event from question set.
     */
    postQuestionShow: function() {
        var instance = this;
        QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
        if (this._question.state && _.has(this._question.state, 'val')) {
            this._selectedIndex = this._question.state.val;
        } else {
            this._selectedIndex = undefined;
        }
        $('.chevron').on('click', function(e) {
            $('.mcq-title').toggleClass('expand');
            $('.chevron').toggleClass('icon-active');
            e.preventDefault();
        });
        $('.mcq-options .mcq-option').on('click', function(e) {
            $(".mcq-options .mcq-option").removeClass("mcq-options-select");
            if (this.attributes.hasOwnProperty('data-simple-choice-interaction') === true) {
                $(this).addClass('mcq-options-select');
                var resVal = this.attributes['data-response-variable'].value;
                instance.responseValueMap[resVal] = this.attributes.value.value;
            }
        });
        if (this._question.data.solution && this._question.data.solution[0].length > 0) {
            document.getElementById('questionset').addClass = 'sb-question-dsp-container';
            document.getElementById('answerBtn').display = 'none'
            document.getElementById('answerBtn').onclick = function() {
                $('.sb-question-content').animate({
                    scrollTop: $('#answer').offset().top
                });
            }
            document.getElementById('questionBtn').onclick = function() {
                $('.sb-question-content').animate({
                    scrollTop: $('#question').offset().top
                });
            }
            $('.sb-question-content').scroll(function() {
                if ($('#answer').position().top <= ($('.sb-question-content').height()) / 2) {
                    $('#answerBtn').css('display', 'none')
                    $('#questionBtn').css('display', 'inline-block')
                } else {
                    $('#answerBtn').css('display', 'inline-block')
                    $('#questionBtn').css('display', 'none')
                }
            })
        }
    },
    /**
     * Question evalution
     * @memberof org.ekstep.questionunit.mcq
     * @param {Object} event from question set.
     */
    evaluateQuestion: function(event) {
        var instance = this;
        var callback = event.target;
        var telValues = {},
            result = {},
            correctAnswer = false;
        if (this._question.data.responseDeclaration) {
            var responseDeclaration = this._question.data.responseDeclaration;
            var key = _.keys(instance.responseValueMap);
            if (responseDeclaration[key[0]].correct_response.value === instance.responseValueMap[key[0]]) {
                correctAnswer = true;
            }
            result = {
                eval: correctAnswer,
                state: {
                    val: instance.responseValueMap[key[0]]
                },
                score: correctAnswer ? instance._question.config.max_score : 0,
                values: [telValues]
            }
        } else {
            result = {
                eval: correctAnswer
            }
        }
        if (_.isFunction(callback)) {
            callback(result);
        }
    },
    /**
     * provide media url to asset
     * @memberof org.ekstep.questionunit.mcq
     * @param {String} url from question set.
     * @returns {String} url.
     */
    replaceAssetWithBaseURL: function(questionData) {
        if (isbrowserpreview || _.isUndefined(isbrowserpreview)) { // eslint-disable-line no-undef
            return questionData.split('/assets/').join(EkstepRendererAPI.getBaseURL() + 'assets/');
        } else {
            return questionData.split('/assets/').join('file:///' + EkstepRendererAPI.getBaseURL() + 'assets/');
        }
    },
    logTelemetryInteract: function(event) {
        if (event != undefined) QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.TOUCH, { // eslint-disable-line no-undef
            type: QSTelemetryLogger.EVENT_TYPES.TOUCH, // eslint-disable-line no-undef
            id: event.target.id
        });
    }
});
//# sourceURL=questionunitQUMLPlugin.js