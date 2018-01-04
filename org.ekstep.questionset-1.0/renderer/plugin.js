/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author sachin.kumar@goodworklabs.com>
 */
Plugin.extend({
    _type: 'org.ekstep.questionset',
    _isContainer: true,
    _render: true,
    _pluginConfig: {},
    _pluginQuestionSet: [],
    _renderedQuestions: [],
    _currentQuestionIndex: 0,
    _shuffle: undefined,
    _nextQuestionIndex: 0,
    _currentQuestion: undefined,
    _prevQuestionarr: [],
    initPlugin: function(data) {
        console.log("question set plugin initialize", data);
        var instance = this,
            qobj;
        this._pluginConfig = JSON.parse(data.config.__cdata);
        this._shuffle = JSON.parse(this._pluginConfig.isShuffle);
        this._pluginQuestionSet = data['org.ekstep.question'];
        this._pluginQuestionSet = this.getQuestion();
        qobj = _.first(instance._pluginQuestionSet);
        if (qobj) {
            //showing custom nevigation for next question
            this.showCustomNextNavigation();
            this._prevQuestionarr.push(qobj);
            //render the view of first question
            this.setRendredQuestion(qobj);
        }
        console.log(this._renderedQuestions);
    },


    setRendredQuestion: function(qobj) {
        console.log("first question--" + qobj);
        quesPlugin = {
            id: qobj.pluginId,
            templateId: qobj.templateId,
            ver: "1.0"
        };
        this.questionloadngModule(quesPlugin);
    },
    showCustomNextNavigation: function() {
        instance = this;
        $('.nav-next').css("display", "none");
        var imageSrc = $('.nav-next').find('img').attr("src"); //take default image path

        var img = $('<img />', { src: imageSrc, id: "show-nextcustom-navigation", class: "" }).css({
            cursor: "pointer",
            position: "absolute",
            width: "7.5%",
            top: "44%",
            right: "1%"
        });
        img.on("click", function() {
            instance.showNextQuestion();
        });
        img.appendTo('#gameArea');
    },
    showCsutomPrevNavigation: function() {
        instance = this;
        $('.nav-previous').hide();
        var imageSrc = $('.nav-previous').find('img').attr("src");
        var img = $('<img />', { src: imageSrc, id: "show-prevcustom-navigation", class: "" }).css({
            cursor: "pointer",
            position: "absolute",
            width: "7.5%",
            top: "44%",
            left: "1%"
        });
        img.on("click", function() {
            instance.showPrevQuestion();
        });
        img.appendTo('#gameArea');
    },
    showDefaultPrevNavigation: function() {
        $("#show-prevcustom-navigation").hide()
        $('.nav-previous').show();
    },
    showPrevQuestion: function() {
        console.log(this._prevQuestionarr);
        var PrevQuest = this._prevQuestionarr.pop();
        EkstepRendererAPI.dispatchEvent(PrevQuest.pluginId + ":hide");
        EkstepRendererAPI.dispatchEvent(this._prevQuestionarr[this._prevQuestionarr.length - 1].pluginId + ":show");
        if (this._prevQuestionarr.length == 1) {
            this.showDefaultPrevNavigation();

        }
    },

    /**
     * renderer:questionset:based on the question id load the manifest.
     * @event renderer:questionset:load
     * @memberof org.ekstep.questionset
     */
    questionloadngModule: function(quesPlugin) {
        var getPluginManifest, questionTemplateCollection, getLoadTemplateData, templatePath, controllerPath;
        getPluginManifest = org.ekstep.pluginframework.pluginManager.pluginObjs[quesPlugin.id];
        questionTemplateCollection = getPluginManifest._manifest.templates;

        questionTemplateCollection.forEach(function(data) {
            if (data.id == quesPlugin.templateId) {
                getLoadTemplateData = data.renderer;
            }
        });

        var pluginObj = { pluginId: quesPlugin.id, pluginVer: quesPlugin.ver, templateURL: getLoadTemplateData.templateURL, controllerURL: getLoadTemplateData.controllerURL,};

        this.loadQuestionTemplate(pluginObj)
    },
    /**
     * renderer:questionset:based on the question id load the manifest.
     * @event renderer:questionset:load
     * @memberof org.ekstep.questionset
     */
    loadQuestionTemplate: function(pluginObj) {
        this._currentQuestion = pluginObj;
        templatePath = org.ekstep.pluginframework.pluginManager.resolvePluginResource(pluginObj.pluginId, pluginObj.pluginVer, pluginObj.templateURL);
        controllerPath = org.ekstep.pluginframework.pluginManager.resolvePluginResource(pluginObj.pluginId, pluginObj.pluginVer, pluginObj.controllerURL);
        org.ekstep.service.controller.loadNgModules(templatePath, controllerPath, function() {
            // setTimeout(function(){
            // EkstepRendererAPI.dispatchEvent(pluginObj.pluginId+":show");
            // }, 300);
        });

        this._nextQuestionIndex++;
    },
    /**
         * renderer:questionset:check shuffle question and end question
         * @event getQuestion
         * @fires getQuestion
         * @memberof org.ekstep.questionset
         */
    getQuestion: function() {
        var instance = this;
        if (this.endOfQuestions()) {
            return undefined;
        } else if (this._shuffle) {
            return instance._pluginQuestionSet.sort(function() { return 0.5 - Math.random() })
        } else {
            return instance._pluginQuestionSet;
        }
    },
    setRendred: function(qobj) {
        var instance = this,
            element;
        element = _.find(instance._pluginQuestionSet, function(item) {
            return item.id === qobj.id;
        });
        element.rendered = true;
    },
    endOfQuestions: function() {
        if (this._currentQuestionIndex === this._pluginConfig.questionCount) {
            return true;
        } else {
            return false;
        }
    },
     /**
     * renderer:questionset:show next question.
     * @event renderer:questionset:click
     * @memberof org.ekstep.questionset
     */
    showNextQuestion: function() {
        var quesobj = this._pluginQuestionSet[this._nextQuestionIndex];
        if (this._nextQuestionIndex >= 1 && this._pluginQuestionSet.length - 1 && !$("#show-prevcustom-navigation").length) {
            this.showCsutomPrevNavigation();
        }
        if (quesobj) {
            this._prevQuestionarr.push(this._pluginQuestionSet[this._nextQuestionIndex]);
            EkstepRendererAPI.dispatchEvent(this._currentQuestion.pluginId + ":hide");
            this._renderedQuestions.push(quesobj);
            this._currentQuestionIndex = this._renderedQuestions.length;
            this.setRendredQuestion(quesobj);

        } else {}
    }
});
//# sourceURL=questionSetRenderer.js