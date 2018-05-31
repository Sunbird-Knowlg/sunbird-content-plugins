describe('QS_FTBTemplate', function() {
  var deviceQuesData, engQuesData, expectedEngQuesData, expectedDeviceQuesData, qsFTBTemplate;
  qsFTBTemplate = QS_FTBTemplate; // eslint-disable-line no-undef
  beforeEach(function() {
    qsFTBTemplate.questionObj = {
      "question": {
        "text": "<p>English a  <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"> c  <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"></p>\n",
        "image": "",
        "audio": "",
        "keyboardConfig": {
          "keyboardType": "English",
          "customKeys": []
        }
      },
      "answer": [
        "b",
        "d"
      ],
      "parsedQuestion": {
        "text": "<p>English a <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\"> c <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\"></p>\n",
        "image": "",
        "audio": ""
      }
    };
    qsFTBTemplate.textboxtarget = {};
    deviceQuesData = {
      "question": {
        "text": "<p>Device a [[b]] c [[d]]</p>\n",
        "image": "",
        "audio": "",
        "keyboardConfig": {
          "keyboardType": "Device",
          "customKeys": []
        }
      },
      "answer": [
        "b",
        "d"
      ],
      "parsedQuestion": {
        "text": "<p>Device a <input type=\"text\" class=\"ans-field\" id=\"ans-field1\"> c <input type=\"text\" class=\"ans-field\" id=\"ans-field2\"></p>\n",
        "image": "",
        "audio": ""
      }
    }
    engQuesData = {
      "question": {
        "text": "<p>English a [[b]] c [[d]]</p>\n",
        "image": "",
        "audio": "",
        "keyboardConfig": {
          "keyboardType": "English",
          "customKeys": []
        }
      },
      "answer": [
        "b",
        "d"
      ],
      "parsedQuestion": {
        "text": "<p>English a <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\"> c <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\"></p>\n",
        "image": "",
        "audio": ""
      }
    };
    expectedEngQuesData = {
      "question": {
        "text": "<p>English a  <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"> c  <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"></p>\n",
        "image": "",
        "audio": "",
        "keyboardConfig": {
          "keyboardType": "English",
          "customKeys": []
        }
      },
      "answer": [
        "b",
        "d"
      ],
      "parsedQuestion": {
        "text": "<p>English a <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\"> c <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\"></p>\n",
        "image": "",
        "audio": ""
      }
    };
    expectedDeviceQuesData = {
      "question": {
        "text": "<p>Device a  <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"> c  <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"></p>\n",
        "image": "",
        "audio": "",
        "keyboardConfig": {
          "keyboardType": "Device",
          "customKeys": []
        }
      },
      "answer": [
        "b",
        "d"
      ],
      "parsedQuestion": {
        "text": "<p>Device a <input type=\"text\" class=\"ans-field\" id=\"ans-field1\"> c <input type=\"text\" class=\"ans-field\" id=\"ans-field2\"></p>\n",
        "image": "",
        "audio": ""
      }
    };
    //spyOn("qsFTBTemplate", invokeKeyboard).and.callThrough();

  });

  describe('invokeKeyboard function', function() {
    var event;
    beforeEach(function() {
      var currentquesObj = {
        "questionData": {
          "question": {
            "text": "<p>English a  <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"> c  <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"></p>\n",
            "image": "",
            "audio": "",
            "keyboardConfig": {
              "keyboardType": "English",
              "customKeys": []
            }
          },
          "answer": [
            "b",
            "d"
          ],
          "parsedQuestion": {
            "text": "<p>English a <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\"> c <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\"></p>\n",
            "image": "",
            "audio": ""
          }
        },
        "questionConfig": {
          "metadata": {
            "category": "FTB",
            "title": "English a ____ c ____\n",
            "language": [
              "English"
            ],
            "qlevel": "EASY",
            "gradeLevel": [
              "Kindergarten"
            ],
            "concepts": [{
              "identifier": "do_112300246933831680110",
              "name": "abcd"
            }],
            "description": "English a ____ c ____",
            "max_score": 1
          },
          "max_time": 0,
          "max_score": 1,
          "partial_scoring": true,
          "layout": "Horizontal",
          "isShuffleOption": false
        },
        "qState": {
          "val": [
            "b",
            "d"
          ]
        }
      };
      var questionset = document.createElement('div');
      questionset.setAttribute("id", "questionset");
      $(document.body).append(questionset);
      var template = _.template(QS_FTBTemplate.htmlLayout); // eslint-disable-line no-undef
      var questionData = qsFTBTemplate.generateHTML(currentquesObj.questionData);
      $("#questionset").html(template({ questionObj: questionData }));
      $("#ans-field1").val("b");
      $("#ans-field2").val("d");
      
      spyOn(qsFTBTemplate, "invokeKeyboard").and.callThrough();
      spyOn(EkstepRendererAPI, "dispatchEvent").and.callThrough();
      spyOn(qsFTBTemplate, "generateHTML").and.callThrough();
      spyOn(qsFTBTemplate, "callbackFromKeyboard").and.callThrough();
      spyOn($.fn, "removeClass");
      spyOn(qsFTBTemplate, "logTelemetryInteract").and.callThrough();
      // spyOn(qsFTBTemplate, "nativeKeyboardHide").and.callThrough();
      // spyOn(qsFTBTemplate, "nativeKeyboardShow").and.callThrough();
      //spyOn(qsFTBTemplate, "setStateInput").and.callThrough();
      spyOn(window, "addEventListener");
      spyOn(QSTelemetryLogger, "logEvent").and.callThrough(); // eslint-disable-line no-undef
      spyOn($.fn, "addClass");
      spyOn($.fn, "find");
    });
    // TODO: needs to be fixed
    xit("should dispatch the event", function() {
      $("#ans-field1").click();
      expect(EkstepRendererAPI.dispatchEvent).toHaveBeenCalled();
    });

    it("should generateHTML for English Keyboard", function() {
      var expectedQData = qsFTBTemplate.generateHTML(engQuesData);
      expect(expectedQData).toEqual(expectedEngQuesData);
    });

    it("should generateHTML for Device Keyboard", function() {
      var expectedQData = qsFTBTemplate.generateHTML(deviceQuesData);
      expect(expectedQData).toEqual(expectedDeviceQuesData);
    });

    it("should call callbackFromKeyboard and remove alignment", function() {
      qsFTBTemplate.callbackFromKeyboard("B");
      expect($(QS_FTBTemplate.constant.qsFtbContainer).removeClass).toHaveBeenCalledWith("align-question"); // eslint-disable-line no-undef
    });

    it("should call logTelemetryInteract on interact", function() {
      var event = {
        "target": {
          "id": "ans-field1"
        }
      }
      qsFTBTemplate.logTelemetryInteract(event);
      expect(QSTelemetryLogger.logEvent).toHaveBeenCalled(); // eslint-disable-line no-undef
    });

    it("should call logTelemetryInteract on interact", function() {
      var event = {
        "target": {
          "id": "ans-field1"
        }
      }
      qsFTBTemplate.logTelemetryInteract(event);
      expect(QSTelemetryLogger.logEvent).toHaveBeenCalled(); // eslint-disable-line no-undef
    });
    // TODO: needs to be fixed
    xit("should call logTelemetryInteract on interact", function() {
      var currentquesObj = { // eslint-disable-line no-unused-vars
        "questionData": {
          "question": {
            "text": "<p>English a  <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"> c  <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"></p>\n",
            "image": "",
            "audio": "",
            "keyboardConfig": {
              "keyboardType": "English",
              "customKeys": []
            }
          },
          "answer": [
            "b",
            "d"
          ],
          "parsedQuestion": {
            "text": "<p>English a <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\"> c <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\"></p>\n",
            "image": "",
            "audio": ""
          }
        },
        "questionConfig": {
          "metadata": {
            "category": "FTB",
            "title": "English a ____ c ____\n",
            "language": [
              "English"
            ],
            "qlevel": "EASY",
            "gradeLevel": [
              "Kindergarten"
            ],
            "concepts": [{
              "identifier": "do_112300246933831680110",
              "name": "abcd"
            }],
            "description": "English a ____ c ____",
            "max_score": 1
          },
          "max_time": 0,
          "max_score": 1,
          "partial_scoring": true,
          "layout": "Horizontal",
          "isShuffleOption": false
        },
        "qState": {
          "val": [
            "b",
            "d"
          ]
        }
      }; // eslint-disable-line no-unused-vars
      qsFTBTemplate.setStateInput();
      expect($(QS_FTBTemplate.constant.qsFtbQuestion).find).toHaveBeenCalled(); // eslint-disable-line no-undef
    });
  });
});