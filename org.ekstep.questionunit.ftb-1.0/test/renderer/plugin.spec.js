describe('RendererPlugin', function() {
  // Renderer plugin can't be tested as of now
  // Please move the logic to other classes and test them independently
  // Let the plugin class delegate functionality to these classes
  var plugin, qsFTBTemplate;

  beforeEach(function() {
    plugin = new org.ekstep.questionunitFTB.RendererPlugin({}, {}, {});
    qsFTBTemplate = QS_FTBTemplate; // eslint-disable-line no-undef
    spyOn(plugin, "initTemplate").and.callThrough();
    spyOn(plugin, "preQuestionShow").and.callThrough();
    spyOn(plugin, "postQuestionShow").and.callThrough();
    spyOn(plugin, "evaluateQuestion").and.callThrough();
    spyOn(qsFTBTemplate, "setStateInput").and.callThrough();
    spyOn(EkstepRendererAPI, "dispatchEvent").and.callThrough();
    spyOn(QS_FTBTemplate, "generateHTML").and.callThrough(); // eslint-disable-line no-undef
  });
  describe('initTemplate', function() {
    var questionsetEvent;
    beforeEach(function() {
      questionsetEvent = {
        "target": {
          "_currentQuestion": {
            "id": "4963582c-0a01-48a6-8a14-c97a3ad10094",
            "type": "ftb",
            "pluginId": "org.ekstep.questionunit.ftb",
            "pluginVer": "1.0",
            "templateId": "ftbtemplate",
            "data": {
              "__cdata": "{\"question\":{\"text\":\"<p>English a [[b]] c [[d]]</p>\\n\",\"image\":\"\",\"audio\":\"\",\"keyboardConfig\":{\"keyboardType\":\"English\",\"customKeys\":[]}},\"answer\":[\"b\",\"d\"],\"parsedQuestion\":{\"text\":\"<p>English a <input type=\\\"text\\\" class=\\\"ans-field\\\" id=\\\"ans-field1\\\" readonly style=\\\"cursor: pointer;\\\"> c <input type=\\\"text\\\" class=\\\"ans-field\\\" id=\\\"ans-field2\\\" readonly style=\\\"cursor: pointer;\\\"></p>\\n\",\"image\":\"\",\"audio\":\"\"}}"
            },
            "config": {
              "__cdata": "{\"metadata\":{\"category\":\"FTB\",\"title\":\"English a ____ c ____\\n\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"Kindergarten\"],\"concepts\":[{\"identifier\":\"do_112300246933831680110\",\"name\":\"abcd\"}],\"description\":\"English a ____ c ____\",\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":true,\"layout\":\"Horizontal\",\"isShuffleOption\":false}"
            },
            "w": 80,
            "h": 85,
            "x": 9,
            "y": 6,
            "index": -1,
            "rendered": true
          },
          "_currentQuestionState": undefined
        },
        "type": "org.ekstep.questionunit.ftb:show"
      }
    })
    it('should ?', function() {
      plugin.initTemplate();
      expect(plugin._template).not.toBe(undefined);
    });
    it('should set questionData', function() {

      var questionObj = plugin.preQuestionShow(questionsetEvent); // eslint-disable-line no-unused-vars
      expect(questionObj).not.toBeNull();
    });
    it('should call generateHTML', function() {

      var questionObj = plugin.preQuestionShow(questionsetEvent); // eslint-disable-line no-unused-vars
      expect(QS_FTBTemplate.generateHTML).toHaveBeenCalled(); // eslint-disable-line no-undef
    });
  });

  describe('PostQuestion function', function() {
    it('should set state when navigating to previous Question', function() {
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
      }; // eslint-disable-line no-unused-vars
      plugin.postQuestionShow(currentquesObj); // eslint-disable-line no-unused-vars
      expect(qsFTBTemplate.setStateInput).toHaveBeenCalled();
    });

    it('should not set state when navigating to next Question', function() {
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
        }
      };
      plugin.postQuestionShow(currentquesObj);
      expect(qsFTBTemplate.setStateInput).not.toHaveBeenCalled();
    });
  });

  describe('PostHideQuestion function', function() {
    it('should dispatch hide event', function() {
      plugin.postHideQuestion();
      expect(EkstepRendererAPI.dispatchEvent).toHaveBeenCalled();
    });
  });
  describe('evaluateQuestion function', function() {
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
      }; // eslint-disable-line no-unused-vars
      var questionset = document.createElement('div');
      questionset.setAttribute("id", "questionset");
      $(document.body).append(questionset);
      var template = _.template(QS_FTBTemplate.htmlLayout); // eslint-disable-line no-undef
      var questionData = qsFTBTemplate.generateHTML(currentquesObj.questionData);
      $("#questionset").html(template({ questionObj: questionData }));
      $("#ans-field1").val("b");
      $("#ans-field2").val("d");
    })

    it('should dispatch evaluate event', function() {
      var resultState = {
        "val": [
        "b",
        "d"
        ]
      };
      var evaluateEvent = {
        "type": "org.ekstep.questionunit.ftb:evaluate",
        "target": function() {
          return {};
        }
      };
      ftbQuestionConfig = { // eslint-disable-line no-undef
        "max_score": 1
      };
      ftbQuestionData = { // eslint-disable-line no-undef
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
        ]
      };
      plugin.evaluateQuestion(evaluateEvent);
      expect(EkstepRendererAPI.dispatchEvent).toHaveBeenCalledWith('org.ekstep.questionset:saveQuestionState', resultState);
    });
  });
});