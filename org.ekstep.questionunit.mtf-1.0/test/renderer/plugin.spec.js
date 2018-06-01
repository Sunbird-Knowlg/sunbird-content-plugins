describe('MTFRendererPlugin', function() {
  var mtfInstance;
  beforeAll(function(done) {
    var elem = '<div id="preview-mtf-template"></div>';
    var body = document.getElementsByTagName("body")[0];
    var div = document.createElement('div');
    div.innerHTML = elem;
    body.appendChild(div.children[0]);
    questionsetEvent = {
      "target": {
        "_currentQuestion": {
          "id": "1bc4db01-4e8b-4249-8cc9-8c40bac01a5a",
          "type": "mtf",
          "pluginId": "org.ekstep.questionunit.mtf",
          "pluginVer": "1.0",
          "templateId": "horizontalMTF",
          "data": {
            "__cdata": "{\"question\":{\"text\":\"<p>Testing MTF 2</p>\\n\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\"},\"option\":{\"optionsLHS\":[{\"text\":\"X\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\",\"index\":1,\"$$hashKey\":\"object:2209\"},{\"text\":\"Y\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\",\"index\":2,\"$$hashKey\":\"object:2210\"},{\"text\":\"Z\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\",\"index\":3,\"$$hashKey\":\"object:2211\"}],\"optionsRHS\":[{\"text\":\"x\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\",\"mapIndex\":1},{\"text\":\"y\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\",\"mapIndex\":2},{\"text\":\"z\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\",\"mapIndex\":3}],\"questionCount\":0},\"media\":[],\"questionCount\":1}"
          },
          "config": {
            "__cdata": "{\"metadata\":{\"category\":\"MTF\",\"title\":\"Testing MTF 2\\n\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"KG\"],\"concepts\":[{\"identifier\":\"SC7\",\"name\":\"Earth\"}],\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":true,\"layout\":\"Horizontal\",\"isShuffleOption\":false,\"questionCount\":1}"
          },
          "w": 80,
          "h": 85,
          "x": 9,
          "y": 6,
          "index": -1,
          "rendered": true
        },
        "_currentQuestionState": {
          "val": {
            "lhs": [{
              "mapIndex": "2",
              "selText": "y"
            },
            {
              "mapIndex": "3",
              "selText": "z"
            },
            {
              "mapIndex": "1",
              "selText": "x"
            }
            ],
            "rhs": [{
              "text": "y",
              "image": "",
              "audio": "",
              "hint": "",
              "mapIndex": 2
            },
            {
              "text": "z",
              "image": "",
              "audio": "",
              "hint": "",
              "mapIndex": 3
            },
            {
              "text": "x",
              "image": "",
              "audio": "",
              "hint": "",
              "mapIndex": 1
            }
            ]
          }
        }
      },
      "type": "org.ekstep.questionunit.mcq:show"
    };
    currentquesObj = {
      "questionData": {
        "question": {
          "text": "<p>Testing MTF 2</p>\n",
          "image": "",
          "audio": "",
          "hint": ""
        },
        "option": {
          "optionsLHS": [{
            "text": "X",
            "image": "",
            "audio": "",
            "hint": "",
            "index": 1,
            "$$hashKey": "object:2209"
          },
          {
            "text": "Y",
            "image": "",
            "audio": "",
            "hint": "",
            "index": 2,
            "$$hashKey": "object:2210"
          },
          {
            "text": "Z",
            "image": "",
            "audio": "",
            "hint": "",
            "index": 3,
            "$$hashKey": "object:2211"
          }
          ],
          "optionsRHS": [{
            "text": "x",
            "image": "",
            "audio": "",
            "hint": "",
            "mapIndex": 1
          },
          {
            "text": "y",
            "image": "",
            "audio": "",
            "hint": "",
            "mapIndex": 2
          },
          {
            "text": "z",
            "image": "",
            "audio": "",
            "hint": "",
            "mapIndex": 3
          }
          ],
          "questionCount": 0
        },
        "media": [],
        "questionCount": 1
      },
      "questionConfig": {
        "metadata": {
          "category": "MCQ",
          "title": "v2 media",
          "language": [
          "English"
          ],
          "qlevel": "EASY",
          "gradeLevel": [
          "Grade 1"
          ],
          "concepts": [
          "LO4"
          ],
          "description": "v2 media",
          "max_score": 1
        }
      },
      "qState": {
        "val": 0
      }
    };
    plugin = new org.ekstep.questionunitmtf.RendererPlugin({}, {}, {});
    mtfInstance = plugin;
    mtfInstance.questionData = {};
    mtfInstance.questionData.questionConfig = currentquesObj.questionConfig;
    spyOn(plugin, "initTemplate").and.callThrough();
    qconfig = JSON.parse(questionsetEvent.target._currentQuestion.config.__cdata);
    spyOn(plugin, "preQuestionShow").and.callThrough();
    spyOn(plugin, "postQuestionShow").and.callThrough();
    spyOn(plugin, "logTelemetryItemResponse").and.callThrough();
    spyOn(window, "dragula").and.callThrough();
    spyOn(plugin, "dragulaIsContainer").and.callThrough();
    done();
  });
  describe('initTemplate', function() {
    it('should plugin will initialize', function() {
      expect(org.ekstep.pluginframework.pluginManager.plugins['mtf']).not.toBe(undefined);
      plugin.initTemplate();
      expect(plugin._template).not.toBe(undefined);
    });
    it('should call the template', function() {
      expect(plugin._template).not.toBe(undefined);
    });
  });
  describe('preQuestionShow', function() {
    it("should call preQuestionShow function", function() {
      var questionObj = plugin.preQuestionShow(questionsetEvent);
      expect(questionObj).not.toBeUndefined();
    });
    it("check question state", function() {
      var questionObj = plugin.preQuestionShow(questionsetEvent);
      var qState = questionObj._currentQuestionState;
      expect(qState).toBe(undefined);
    });
    it("Set options width dynamically", function() {
      var questionObj = plugin.preQuestionShow(questionsetEvent);
      expect(questionObj.questionData.option.optionsLHS.length).toEqual(3);
    });
  });
  describe('postQuestionShow', function() {
    it("should call postquestion function", function() {
        var questionObj = plugin.postQuestionShow(currentquesObj);
        expect(questionObj).toBeUndefined();
    });
    it("should call dragula drag and drop function", function() {

    });
  });
  describe('evaluateQuestion', function() {
    it('should dispatch evaluate event', function() {
      var evaluateEvent = {
        "type": "org.ekstep.questionunit.mtf:evaluate",
        "target": function() {
            return {};
        }
      };
      plugin.evaluateQuestion(evaluateEvent);
    });
  });
  describe('logTelemetryItemResponse', function() {
    it('should call logTelemetryItemResponse', function() {
      var responseData = [{
        "lhs": "A",
        "rhs": "b"
      }];  
      plugin.logTelemetryItemResponse(responseData);
    });
  });
});