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
    var keyboardEvent;
    beforeEach(function() {
      keyboardEvent = {
        "target": '<input type="text" class="ans-field highlightInput" value="b" id="ans-field1" readonly="" style="cursor: pointer;" onclick="QS_FTBTemplate.logTelemetryInteract(event);">'
      };
      spyOn(qsFTBTemplate, "invokeKeyboard").and.callThrough();
      spyOn(EkstepRendererAPI, "dispatchEvent").and.callThrough();
      spyOn(qsFTBTemplate, "generateHTML").and.callThrough();
      spyOn(qsFTBTemplate, "callbackFromKeyboard").and.callThrough();
      spyOn($.fn, "removeClass");
      spyOn(window, "addEventListener");
    });

    it("should dispatch the event", function() {
      qsFTBTemplate.invokeKeyboard(keyboardEvent);
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
      expect($(QS_FTBTemplate.constant.qsFtbContainer).removeClass).toHaveBeenCalledWith("align-question");
    });
  });
});