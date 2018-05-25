describe('QS_FTBTemplate', function() {
  var expectedQuesData
  qsFTBTemplate = QS_FTBTemplate;
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
    expectedQuesData = {
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
    //spyOn("qsFTBTemplate", invokeKeyboard).and.callThrough();

  });

  describe('invokeKeyboard function', function() {
    var keyboardEvent, trim;
    beforeEach(function() {
      keyboardEvent = {
        "target": '<input type="text" class="ans-field highlightInput" value="b" id="ans-field1" readonly="" style="cursor: pointer;" onclick="QS_FTBTemplate.logTelemetryInteract(event);">'
      };
      spyOn(qsFTBTemplate, "invokeKeyboard").and.callThrough();
      spyOn(EkstepRendererAPI, "dispatchEvent").and.callThrough();
      spyOn(qsFTBTemplate, "generateHTML").and.callThrough();
    });
    it("should dispatch the event", function() {
      qsFTBTemplate.invokeKeyboard(keyboardEvent);
      expect(EkstepRendererAPI.dispatchEvent).toHaveBeenCalled();
    });
    it("should generateHTML", function() {
      var expectedQData = qsFTBTemplate.generateHTML(qsFTBTemplate.questionObj);
      expect(expectedQData).toEqual(expectedQuesData);
    });

    it("should generateHTML", function() {
      var quesData = {
      "question": {
        "text": "<p>English a  <input type=\"text\" class=\"ans-field\" id=\"ans-field1\" readonly style=\"cursor: pointer;\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"> c  <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" onclick=\"QS_FTBTemplate.logTelemetryInteract(event);\"></p>\n",
        "image": "",
        "audio": "",
        "keyboardConfig": {
          "keyboardType": "Device"
        }
      },
      "answer": [
        "b",
        "d"
      ],
      "parsedQuestion": {
        "text": "<p>English a <input type=\"text\" class=\"ans-field\" id=\"ans-field1\"> c <input type=\"text\" class=\"ans-field\" id=\"ans-field2\" readonly style=\"cursor: pointer;\"></p>\n",
        "image": "",
        "audio": ""
      }
    };
      var expectedQData = qsFTBTemplate.generateHTML(qsFTBTemplate.questionObj);
      expect(expectedQData).toEqual(expectedQuesData);
    });
  });
});