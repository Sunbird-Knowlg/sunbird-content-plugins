org.ekstep.contenteditor.basePlugin.extend({
    type: "editor",
    appuVoice: false,
    loadWindow: function () {
      var template = `<div class="chatbot-container"> <div class="chat-grid"> <div class="chat-header"> Appu </div><div class="chat-body"> <div class="chat chat-end"> <div class="chat-msg user-msg"> Hi how are you </div></div><div class="chat chat-start"> <div class="chat-msg reply-msg"> I'm fine and how about you! </div></div><div class="chat chat-end"> <div class="chat-msg user-msg"> Hi how are you </div></div><div class="chat chat-start"> <div class="chat-msg reply-msg"> I'm fine and how about you! </div></div></div><div class="chat-input-container"> <input type="text" name="chat-input" class="chat-input" value="" placeholder="How can I help you ?"> <div class="voice-container"> <div class="voice-rounded"> </div></div></div></div></div>`;
       var node = document.createElement("div");
       node.id = 'dv-chat-bot';
      node.innerHTML = template;
      var _body = document.getElementsByTagName('body') [0];
      _body.appendChild(node);

    },
    setVoiceRecognition: function () {
        var instance = this;
        /*-----------------------------
            Voice Recognition 
        ------------------------------*/

        // If false, the recording will stop after a few seconds of silence.
        // When true, the silence period is longer (about 15 seconds),
        // allowing us to keep recording even when the user pauses. 
        window.recognition.continuous = true;

        // This block is called every time the Speech APi captures a line. 
        window.recognition.onresult = function (event) {

            // event is a SpeechRecognitionEvent object.
            // It holds all the lines we have captured so far. 
            // We only need the current one.
            var current = event.resultIndex;

            // Get a transcript of what was said.
            var transcript = event.results[current][0].transcript;

            // Add the current transcript to the contents of our Note.
            // There is a weird bug on mobile, where everything is repeated twice.
            // There is no official solution so far so we have to handle an edge case.
            var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

            if (!mobileRepeatBug) {
                console.log('received : ' + transcript);
                executeCommand(transcript)
            }
        };

        window.recognition.onstart = function () {
            console.log('Voice recognition activated. Try speaking into the microphone.');
        }

        window.recognition.onspeechend = function () {
            console.log('You were quiet for a while so voice recognition turned itself off.');
            instance.stopSpeechListener();
            setTimeout(function () {
                instance.startSpeechListener();
            },2000);
        }

        window.recognition.onerror = function (event) {
            if (event.error == 'no-speech') {
                console.log('No speech was detected. Try again.');
                instance.stopSpeechListener();
                setTimeout(function () {
                    instance.startSpeechListener();
                },2000);
            };
        }

    },
    startSpeechListener: function () {
        if (this.appuVoice === false && window.recognition) {
            window.recognition.start();
            this.appuVoice = true;
        }
    },
    stopSpeechListener: function () {
        window.recognition.stop();
        this.appuVoice = false;
    },
    initialize: function () {
        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            window.recognition = new SpeechRecognition();
            console.log('plugin ' + this.manifest.id + ' initalized');
            this.loadWindow();
            this.setVoiceRecognition();
            ecEditor.addEventListener(this.manifest.id + ":startSpeechListener", this.startSpeechListener, this);
        }
        catch (e) {
            console.error(e);
            $('.no-browser-support').show();
            $('.app').hide();
        }

    }

});