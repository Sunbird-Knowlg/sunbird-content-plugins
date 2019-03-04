describe("EditorPlugin", function() {
  var plugin, popupService,dataObj,event, searchService, qsManifest;

  beforeEach(module('org.ekstep.questionbank'));

  beforeEach(function() {
    plugin = new org.ekstep.questionbank.EditorPlugin({}, {}, {});
    spyOn(plugin, "initialize").and.callThrough();
    spyOn(plugin, "loadHtml").and.callThrough();
    spyOn(plugin, "loadQSPlugins").and.callThrough();
    dataObj = {callback:undefined,data:undefined};
    event = {target:undefined,type:"org.ekstep.questionbank:showpopup"};
    popupService = jasmine.createSpyObj("popupService", ["loadNgModules", "open"]);
    searchService = jasmine.createSpyObj("search", ["search"]);

    qsManifest = {
      "id": "org.ekstep.questionset",
      "ver": "1.0",
      "author": "Manoj Chandrashekar",
      "title": "Question Set Plugin",
      "description": "Plugin to add question set to content",
      "publishedDate": "",
      "editor": {
        "main": "editor/plugin.js",
        "dependencies": [
          {
            "type": "plugin",
            "plugin": "org.ekstep.question",
            "ver": "1.0"
          },
          {
            "type": "plugin",
            "plugin": "org.ekstep.questionbank",
            "ver": "1.0"
          },
          {
            "type": "plugin",
            "plugin": "org.ekstep.questionset.quiz",
            "ver": "1.0"
          },
          {
            "type": "plugin",
            "plugin": "org.ekstep.questionset.preview",
            "ver": "1.0"
          }
        ],
        "menu": [
          {
            "id": "question-set",
            "category": "main",
            "type": "icon",
            "toolTip": "Add Question Set",
            "title": "Question Set",
            "iconClass": "icon-questions icon",
            "onclick": {
              "id": "org.ekstep.questionset:showPopup"
            }
          }
        ],
        "configManifest": [
          {
            "PropertyName": "btn_edit",
            "title": "Edit question set",
            "description": "Choose a question from the question bank",
            "dataType": "button",
            "valueType": "text",
            "required": true,
            "onclick": {
              "id": "org.ekstep.questionset:showPopup",
              "type": "questionset"
            }
          },
          {
            "propertyName": "title",
            "title": "Question Set Title",
            "description": "Question Set Title",
            "dataType": "input",
            "valueType": "text",
            "required": true
          },
          {
            "propertyName": "shuffle_questions",
            "title": "Shuffle Questions",
            "description": "Shuffle the Questions",
            "dataType": "boolean",
            "required": true
          },
          {
            "propertyName": "show_feedback",
            "title": "Show Immediate Feedback",
            "description": "Show the feedback popup",
            "dataType": "boolean",
            "required": true
          },
          {
            "propertyName": "total_items",
            "title": "Display",
            "description": "Total questions to display",
            "dataType": "input",
            "valueType": "number",
            "required": true,
            "minimumValue": "0"
          },
          {
            "propertyName": "max_score",
            "title": "Total Marks",
            "description": "Maximum score",
            "dataType": "input",
            "valueType": "number",
            "required": true,
            "minimumValue": "1",
            "maximumValue": "99"
          }
        ]
      },
      "renderer": {
        "main": "renderer/plugin.js",
        "dependencies": [
          {
            "type": "js",
            "src": "renderer/utils/telemetry_logger.js"
          },
          {
            "type": "js",
            "src": "renderer/utils/html_audio_plugin.js"
          },
          {
            "type": "js",
            "src": "renderer/utils/qs_feedback_popup.js"
          }
        ]
      },
      "dependencies": [
        {
          "plugin": "org.ekstep.questionset.quiz",
          "ver": "1.0",
          "type": "plugin",
          "scope": "renderer"
        },
        {
          "type": "plugin",
          "plugin": "org.ekstep.iterator",
          "ver": "1.0",
          "scope": "renderer"
        }
      ]
    };
    spyOn(org.ekstep.pluginframework.pluginManager,"getPluginManifest").and.callFake(function(){
      return qsManifest;
    });

    spyOn(ecEditor, "getService").and.callFake(function(serviceName) {
      if (serviceName === ServiceConstants.POPUP_SERVICE) {
        return popupService;
      }
      else if (serviceName === 'search') {
        return searchService;
      }
    });
  });
  describe("initialize", function() {
    it("should initialize dependancy plugins", function() {
      plugin.initialize();
      expect(ecEditor.getService).toHaveBeenCalled();
    });
  });

  describe("load HTML", function() {
    it("should call load html", function() {
      plugin.loadHtml(event,dataObj);
    });
  });
  describe("load All QS plugins", function() {
    it("should call load plugins", function() {
      var qsManifest = {"ver":1};
      expect(plugin.loadQSPlugins).toHaveBeenCalled();
    });
  });

  describe("load loadQSPlugins", function() {
    it("should call load html", function() {
      plugin.loadHtml(event,dataObj);
    });
  });

});