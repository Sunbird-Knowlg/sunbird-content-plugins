// Renderer plugin can't be tested as of now
// Please move the logic to other classes and test them independently
// Let the plugin class delegate functionality to these classes
Plugin.ftbplugin = {};

/* istanbul ignore next */
Plugin.ftbplugin.RendererPlugin = Plugin.extend({
    _type: 'ftbplugin',
    _isContainer: false,
    _render: true,
    _templatePath: undefined,
    _render: true,
    _pluginData: undefined,
    _selectedAnswere: null,
    _questionAudio : null,
    initPlugin: function(data) {
        console.info('FTB template plugin Renderer init');
        EkstepRendererAPI.dispatchEvent('renderer:overlay:show');
        EkstepRendererAPI.dispatchEvent('renderer:stagereload:hide');
        _pluginData = JSON.parse(data.config.__cdata);
        if(_pluginData.question.audio != null || _pluginData.question.audio != undefined){
            _questionAudio = new Audio(_pluginData.question.audio); 
        }
        this.initContent();
    },
    initContent: function(event, data) {
        //jQuery('#gameCanvas').remove();
        var mainDiv = $("#mainDiv").length ? $("#mainDiv").remove() : "<div id='mainDiv'></div>";
        //jQuery('#gameArea').css({ left: '10%', top: '-10px', width: "80%", height: "90%", margin: "5% 0 0 0" });
        jQuery('#gameArea').append(mainDiv);
        this.createLayout();
    },
    createLayout: function() {
        instance = this;
        instance.headerSection();
        instance.optionforAnswere();
        instance.handleOptionUi();
        instance.addClickEvent();
        EventBus.addEventListener('previousClick', function() {
            if ($("#mainDiv").length) {
                instance.showCustomNavigation();
            } else {
                instance.showDefaultNavigation();
            }
        });
    },
    headerSection: function() {
        $("#header").remove();
        var headerDiv = jQuery('<h5>', { id: 'header', text: _pluginData.question.text }).addClass("headerSection");
        jQuery('#mainDiv').append(this.headerWithImageAudio(headerDiv));
        if(_pluginData.question.audio) instance.addPlayEvent();
    },
    headerWithImageAudio: function(headerDiv) {
        instance=this;
        var audioImage = _pluginData.question.audio ? EkstepRendererAPI.resolvePluginResource("org.ekstep.plugins.mcqplugin", "1.0", "renderer/assets/audio.png") : "";
        if (_pluginData.question.image && _pluginData.question.audio) {
            headerDiv.append("<div><img src=" + audioImage + " id='header-audio-image' class='addPlayEvent'/><img src=" + _pluginData.question.image + " id='header-image'><div>");
            
        } else if (_pluginData.question.image) {
            headerDiv.append("<div><img src=" + _pluginData.question.image + " id='header-image'><div>");
        } else {
            headerDiv.append("<div><img src=" + audioImage + " id='header-image' class='addPlayEvent'><div>");
        }
        return headerDiv;
    },
    addPlayEvent:function(){
        instance=this;
        $(".addPlayEvent").click(function(event) {
        if (_questionAudio != null) {
            // var audio = new Audio(_pluginData.question.audio);   
            if(!_questionAudio.paused && !_questionAudio.ended && 0 < _questionAudio.currentTime){
                _questionAudio.pause();
            }
            else{
                _questionAudio.play();
            }
        }
    });
    },
    optionforAnswere: function() {
        if ($("#mainDiv").length) {
            jQuery("#overlay .nav-next").css('display', 'none');
            this.showCustomNavigation();
        }
        instance = this;
        optionText = _pluginData.answers;
        $("#optionContainer").remove();
        var optionContainer = $("<div id='optionContainer'/>").css({
            width: '100%',
            'margin-top': '95px',
            display: 'flex',
            "flex-wrap": "wrap"
        });
        $('#mainDiv').append(optionContainer);
        $.each(optionText, function(index, value) {
            Promise.resolve(instance.renderOption(index, value)).then(function() {
                instance.addClickEvent();
            });
        });
    },
    renderOption: function(index, value) {
        $('<div />', {
            id: index,
            text: value.text,
        }).css({
            "background-image": "url('" + value.image + "')",
            "background-size": "contain",
            "background-repeat": "no-repeat",
            border: "2px solid #9b9b9b",
            padding: "10px",
            "text-align": "center",
            "background-position": "center",
            display: "inline-block",
            margin: "10px 0 0 10px",
            "flex-grow": 1,
            height: "auto",
            "min-height": "84px",
            width: "calc(100% * (1/4) - 10px - 1px)"
        }).appendTo('#optionContainer');
        if (value.audio) {
            var imageSrc = EkstepRendererAPI.resolvePluginResource("org.ekstep.plugins.mcqplugin", "1.0", "renderer/assets/audio.png");
            var img = $('<img />', { src: imageSrc, id: "auido-icon-top" });
            img.appendTo("#" + index);
        }
    },
    addClickEvent: function() {
        var instance = this;
        $("#optionContainer  div").click(function(event) {
            $(this).addClass("option-selected").siblings().removeClass("option-selected");
            instance.getTargetPropertise(event);
            instance.Telemetryintract(event);
        });

    },
    getTargetPropertise: function(event) {
        instance = this;
        _selectedAnswere = instance.getallProperties(event.target.id);
        if (_selectedAnswere.audio != null) {
            var audio = new Audio(_selectedAnswere.audio);
            audio.play();
        }
    },
    getallProperties: function(id) {
        return _pluginData.answers[+id];

    },
    handleOptionUi: function() {
        //if option less than four then set space randomly
        if ($("#optionContainer > div").length <= 4) $("#optionContainer").addClass("option-space");
    },
    checkAnswere: function() {
        instance = this;
        if (typeof _selectedAnswere == "undefined" || _selectedAnswere.isAnswerCorrect == false) {
            renderValue = '<div id="Error-popup-model"><div class="white-popup"><div class="font-lato assess-popup assess-tryagain-popup"><div class="wrong-answer" style=" text-align: center;">' +
                '<div class="banner"><img ng-src="assets/icons/banner2.png" height="100%" width="100%" src="assets/icons/banner2.png"></div>' +
                '<div class="sign-board"><img ng-src="assets/icons/incorrect.png" width="40%" id="incorrectButton" src="assets/icons/incorrect.png"></div></div><div id="popup-buttons-container"><div class="left button" id="next-stage">Next</div>' +
                '<div class="right primary button" id="tryagain">Try Again</div></div></div></div></div>';
            instance.showModelPopup(renderValue);

        } else {
            renderValue = '<div id="success-model-popup"><div class="white-popup"><div class="font-lato assess-popup assess-goodjob-popup"><div class="correct-answer" style=" text-align: center;"><div class="banner"> <img src="assets/icons/banner3.png" height="100%" width="100%" src="assets/icons/banner3.png"> </div><div class="sign-board"> <img src="assets/icons/check.png" id="correctButton" width="40%" src="assets/icons/check.png"> </div></div><div id="popup-buttons-container"><div class="primary center button" id="next-stage">Next</div></div></div></div></div>';
            instance.showModelPopup(renderValue);
        }
        instance.telemetryAssesEnd();
    },
    showModelPopup: function(renderValue) {
        instance = this;
        $.magnificPopup.open({
            items: {
                src: renderValue,
                type: 'inline'
            },
            callbacks: {
                open: function() {
                    $('#tryagain').on('click', function(event) {
                        event.preventDefault();
                        $.magnificPopup.close();
                    });
                    $('#next-stage').on('click', function(event) {
                        $("#mainDiv").remove();
                        $.magnificPopup.close();
                        event.preventDefault();
                        if (instance._stage.params.next) {
                            OverlayManager.skipAndNavigateNext();
                        } else {
                            EkstepRendererAPI.dispatchEvent('renderer:content:end');
                        }
                        instance.showDefaultNavigation();
                        instance.telemetryAssesEnd();
                    });
                }
            },
            showCloseBtn: false
        });
    },
    hideDefaultNavigation: function() {
        jQuery("#overlay .nav-next").css('display', 'none');
    },
    showDefaultNavigation: function() {
        jQuery("#overlay .nav-next").css('display', 'block');
    },
    showCustomNavigation: function() {
        instance = this;
        var imageSrc = $('.nav-next').find('img').attr("src"); //take default image path
        var img = $('<img />', { src: imageSrc, id: "show-custom-navigation", class: "" });
        img.on("click", function() {
            instance.checkAnswere();
        });
        img.appendTo('#mainDiv');
    },
    telemetryAssesEnd: function() {
        var assessStartEvent = TelemetryService.assess(getCurrentStageId(), "LIT", "MEDIUM", {
            maxscore: 1
        }).start();
        var data = {
            pass: true,
            score: _selectedAnswere ? 1 : 0,
            res: _selectedAnswere.text,
            mmc: "MCq",
            qindex: "1",
            mc: "",
            qtitle: "ftbqauestion",
            qdesc: ""
        };
        TelemetryService.assessEnd(assessStartEvent, data)
    },
    Telemetryintract: function(evt) {
        var data = {
            stageid: getCurrentStageId()
        }
        TelemetryService.interact("touch", "next", "", data);
        var data = {
            itemId: "Q.01",
            res: [{
                "option": _selectedAnswere.text
            }],
            state: "SELECTED",
            optionTag: "FTB"
        };
        TelemetryService.itemResponse(data);
    },

    drawBorder: function() {}
});
//#sourceURL=ftbpluginRendererPlugin.js