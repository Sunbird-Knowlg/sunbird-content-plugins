describe("EditorPlugin", function() {

  var plugin, fabricGroup, v1Data, v2Data, v2Data1;

  beforeEach(function() {
    plugin = new org.ekstep.questionset.EditorPlugin({}, {}, {});
    fabricGroup = new fabric.Group();
    v2Data = [{ "template": "NA", "itemType": "UNIT", "code": "NA", "subject": "domain", "qlevel": "EASY", "channel": "in.ekstep", "description": "test", "language": ["English"], "type": "mcq", "title": "test image and audio for the image", "body": "{\"data\":{\"plugin\":{\"id\":\"org.ekstep.questionunit.mcq\",\"version\":\"1.0\",\"templateId\":\"horizontalMCQ\"},\"data\":{\"question\":{\"text\":\"test image and audio for the image\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\"},\"options\":[{\"text\":\"test1\",\"image\":\"\",\"audio\":\"/assets/public/content/145503359952511.mp3\",\"hint\":\"\",\"isCorrect\":true,\"$$hashKey\":\"object:3278\"},{\"text\":\"test2\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\",\"isCorrect\":false,\"$$hashKey\":\"object:3279\"}],\"media\":[{\"id\":566752436,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":576331075,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":94711675,\"src\":\"/assets/public/content/145503359952511.mp3\",\"assetId\":\"11_sound\",\"type\":\"audio\",\"preload\":false}]},\"config\":{\"metadata\":{\"category\":\"MCQ\",\"title\":\"test image and audio for the image\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"Kindergarten\"],\"concepts\":[\"BIO3\"],\"description\":\"test\",\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":false,\"layout\":\"Horizontal\",\"isShuffleOption\":false},\"media\":[{\"id\":566752436,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":576331075,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":94711675,\"src\":\"/assets/public/content/145503359952511.mp3\",\"assetId\":\"11_sound\",\"type\":\"audio\",\"preload\":false}]}}", "createdOn": "2018-03-23T10:15:24.824+0000", "gradeLevel": ["Grade 1"], "appId": "ekstep_portal", "options": [{ "answer": true, "value": { "type": "text", "asset": "1", "resvalue": 0, "resindex": 0 } }], "lastUpdatedOn": "2018-03-23T10:15:24.824+0000", "identifier": "do_112466586622558208121", "question": "test image and audio for the image", "consumerId": "f6878ac4-e9c9-4bc4-80be-298c5a73b447", "version": 2, "versionKey": "1521800124824", "createdBy": "580", "max_score": 1, "name": "test image and audio for the image", "template_id": "NA", "category": "MCQ", "status": "Live", "$$hashKey": "object:2719", "isSelected": true }];
    v2Data1 = [{ "body": "{\"data\":{\"plugin\":{\"id\":\"org.ekstep.questionunit.mcq\",\"version\":\"1.0\",\"templateId\":\"horizontalMCQ\"},\"data\":{\"question\":{\"text\":\"test image and audio for the image\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\"},\"options\":[{\"text\":\"test1\",\"image\":\"\",\"audio\":\"/assets/public/content/145503359952511.mp3\",\"hint\":\"\",\"isCorrect\":true,\"},{\"text\":\"test2\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\",\"isCorrect\":false,\"}]},\"config\":{\"metadata\":{\"category\":\"MCQ\",\"title\":\"test image and audio for the image\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"Kindergarten\"],\"concepts\":[\"BIO3\"],\"description\":\"test\",\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":false,\"layout\":\"Horizontal\",\"isShuffleOption\":false},\"}}", "createdOn": "2018-03-23T10:15:24.824+0000", "gradeLevel": ["Grade 1"], "appId": "ekstep_portal", "options": [{ "answer": true, "value": { "type": "text", "asset": "1", "resvalue": 0, "resindex": 0 } }], "identifier": "do_112466586622558208121", "question": "test", "consumerId": "f6878ac4-e9c9-4bc4-80be-298c5a73b447", "version": 2, "versionKey": "1521800124824", "createdBy": "580", "max_score": 1, "name": "test image and audio for the image", "template_id": "NA", "category": "MCQ", "isSelected": true }];
    v1Data = [{ "template": [{ "text": { "event": { "action": [{ "asset_model": "item.question_audio", "sound": true, "type": "command", "command": "stop" }, { "asset_model": "item.question_audio", "type": "command", "command": "play" }], "type": "click" }, "color": "#4c4c4c", "w": 100, "h": 15, "x": 0, "fontsize": "3vw", "y": 10, "lineHeight": 1.4, "model": "item.question", "valign": "top", "align": "center" }, "shape": { "event": { "action": [{ "asset_model": "item.question_audio", "sound": true, "type": "command", "command": "stop" }, { "asset_model": "item.question_audio", "type": "command", "command": "play" }], "type": "click" }, "hitArea": true, "w": 100, "h": 24, "x": 0, "y": 10, "type": "rect" }, "g": [{ "placeholder": [{ "model-count": "item.optionCount1", "w": 30, "h": 100, "x": 0, "y": 0, "valign": "middle", "align": "center", "type": "gridLayout", "model-asset": "item.question_image" }, { "model-count": "item.optionCount2", "w": 30, "h": 100, "x": 40, "y": 0, "valign": "middle", "align": "center", "type": "gridLayout", "model-asset": "item.question_image" }], "text": [{ "color": "#4c4c4c", "w": 5, "h": 0, "x": 32, "fontsize": "3vw", "y": 55, "model": "item.operator1", "valign": "middle", "align": "center" }, { "color": "#4c4c4c", "w": 5, "h": 0, "x": 72, "fontsize": "3vw", "y": 55, "model": "item.operator2", "valign": "middle", "align": "center" }, { "z-index": 30, "color": "#4c4c4c", "w": 20, "h": 40, "x": 80, "fontsize": "3vw", "y": 38, "model": "item.ans1", "valign": "middle", "id": "newText1", "align": "center" }], "g": { "shape": { "w": 100, "h": 100, "x": 0, "y": 0, "stroke-width": 3, "fill": "#FFFFA5", "type": "roundrect", "stroke": "#719ECE" }, "z-index": 20, "w": 20, "h": 40, "x": 80, "y": 34, "id": "textshape1" }, "w": 100, "h": 32, "x": 0, "y": 33 }, { "nkeyboard": { "keys": "item.keys", "w": 100, "h": 25, "limit": 7, "x": 0, "y": 82, "id": "bKeyboard", "type": "custom", "target": "newText1" }, "w": 100, "h": 100, "x": 0, "y": 0 }], "id": "Operations_with_images" }], "itemType": "UNIT", "code": "org.ekstep.assessmentitem.literacy_5abb516b8f224", "subject": "domain", "qlevel": "EASY", "channel": "in.ekstep", "description": "", "language": ["English"], "media": [{ "id": "do_11246090113921843213", "type": "image", "src": "https://dev.ekstep.in/assets/public/content/do_11246090113921843213/artifact/ae36d87ad0aa9438984018205a9c0fa0_1521106096238.jpeg", "asset_id": "do_11246090113921843213" }], "type": "ftb", "title": "v1 - operations with images", "createdOn": "2018-03-28T08:25:15.611+0000", "gradeLevel": ["Kindergarten"], "appId": "ekstep_portal", "question_image": "do_11246090113921843213", "lastUpdatedOn": "2018-03-28T08:25:15.611+0000", "used_for": "worksheet", "model": { "optionCount1": "4", "optionCount2": "3", "operator1": "-", "operator2": "=", "keys": "0,1,2,3,4,5,6,7,8,9,+,-,×,÷,=,<,>,/,." }, "lastUpdatedBy": "597", "identifier": "do_112470071423893504143", "question": "v1 - operations with images", "consumerId": "f6878ac4-e9c9-4bc4-80be-298c5a73b447", "version": 1, "versionKey": "1522225515611", "answer": { "ans1": { "value": "1", "score": 1 } }, "concepts": [{ "identifier": "LO4", "name": "Understanding of Grammar/Syntax", "objectType": "Concept", "relation": "associatedTo", "description": null, "index": null, "status": null, "depth": null, "mimeType": null, "visibility": null, "compatibilityLevel": null }], "createdBy": "597", "max_score": 1, "domain": ["literacy"], "name": "v1 - operations with images", "template_id": "do_112470023566245888128", "category": "MCQ", "status": "Live", "isSelected": true, "mediamanifest": { "media": [{ "id": "do_11246090113921843213", "type": "image", "src": "https://dev.ekstep.in/assets/public/content/do_11246090113921843213/artifact/ae36d87ad0aa9438984018205a9c0fa0_1521106096238.jpeg", "asset_id": "do_11246090113921843213" }, { "src": "https://dev.ekstep.in/assets/public/content/do_112470023566245888128/assets/1522219674003/customnumkeyboard.js", "id": "nkeyboard", "type": "plugin", "plugin": "org.ekstep.questionset", "ver": "1.0" }, { "src": "https://dev.ekstep.in/assets/public/content/do_112470023566245888128/assets/1522219674010/numerickeyboard.css", "id": "keyboard_css", "type": "css", "plugin": "org.ekstep.questionset", "ver": "1.0" }] } }];
    plugin.config = { "title": "qs", "max_score": 2, "allow_skip": true, "show_feedback": true, "shuffle_questions": false, "shuffle_options": false, "total_items": 2, "btn_edit": "Edit" };
    plugin._super = jasmine.createSpy('_super').and.callFake(function() {
      return {};
    });
    plugin.manifest.id = "org.ekstep.questionset";
    spyOn(ecEditor, "loadAndInitPlugin").and.callFake(function() {
      return undefined;
    });
    spyOn(fabric, "Group").and.callFake(function() {
      return fabricGroup;
    });
    spyOn(plugin, 'postInit');
    spyOn(plugin, 'getPropsForEditor').and.callThrough();
    spyOn(plugin, 'addMedia');
    spyOn(plugin, 'createEcmlStructureV1').and.callThrough();
    spyOn(plugin, 'toECML').and.callThrough();
    spyOn(plugin, 'addQS').and.callThrough();
    spyOn(plugin, 'openQuestionBank').and.callThrough();
    spyOn(ecEditor, "dispatchEvent").and.callThrough();
    spyOn(ecEditor, "getCurrentObject").and.callFake(function() {
      return {
        data: v2Data1,
        config: plugin.config
      };
    });
    spyOn(plugin, "onConfigChange").and.callThrough();
    spyOn(ecEditor, 'render');
  });

  describe("initialize", function() {

    it("should load and initialize dependancy plugins", function() {
      plugin.initialize();

      expect(ecEditor.loadAndInitPlugin).toHaveBeenCalled();
    });

  });

  describe("new instance for v1 question", function() {
    beforeEach(function() {
      plugin.data = v1Data;
    });

    it('should call add media', function() {
      plugin.newInstance();

      expect(plugin.addMedia).toHaveBeenCalled();
    });

    it('should call add media', function() {
      plugin.newInstance();

      expect(plugin.addMedia.calls.count()).toBe(5);
    });

    it('should call getPropsForEditor', function() {
      plugin.newInstance();

      expect(plugin.getPropsForEditor).toHaveBeenCalled();
    });

    it('should add an image representing question set as editorObj', function() {
      plugin.newInstance();

      expect(plugin.editorObj).toEqual(fabricGroup);
    });

    it('should set attributes as specified', function() {
      plugin.newInstance();

      expect(plugin.attributes).toEqual(jasmine.any(Object));
    });

  });
  describe("new instance for v2 question", function() {
    beforeEach(function() {
      plugin.data = v2Data;
    });

    it('should call add media', function() {
      plugin.newInstance();

      expect(plugin.addMedia.calls.count()).toBe(1);
    });
  });

  describe("getPropsForEditor function", function() {

    it('should create fabric group', function() {
      var fabGroup = {};
      fabGroup = plugin.getPropsForEditor(plugin.config.title, plugin.config.total_items, plugin.config.max_score);
      expect(fabGroup).toEqual(fabricGroup);
    });
  });

  describe("to ECML", function() {

    it('should call createEcmlStructureV1', function() {
      var allQuestions = v1Data.concat(v2Data);
      plugin.data = allQuestions;
      plugin.toECML();

      expect(plugin.createEcmlStructureV1).toHaveBeenCalled();
    });

    it('should not call createEcmlStructureV1 if it is v2 question', function() {
      plugin.data = v2Data;
      plugin.toECML();
      expect(plugin.createEcmlStructureV1).not.toHaveBeenCalled();
    });

    it('should return ecml of question set', function() {
      plugin.data = v1Data;
      var v1ecml = plugin.toECML();
      var expectedEcml = { "x": 9, "y": 6, "w": 80, "h": 85, "rotate": 0, "z-index": 0, "id": "a46c31a7-9abc-4852-980e-0ea6003642de", "data": { "__cdata": "[{\"template\":[{\"text\":{\"event\":{\"action\":[{\"asset_model\":\"item.question_audio\",\"sound\":true,\"type\":\"command\",\"command\":\"stop\"},{\"asset_model\":\"item.question_audio\",\"type\":\"command\",\"command\":\"play\"}],\"type\":\"click\"},\"color\":\"#4c4c4c\",\"w\":100,\"h\":15,\"x\":0,\"fontsize\":\"3vw\",\"y\":10,\"lineHeight\":1.4,\"model\":\"item.question\",\"valign\":\"top\",\"align\":\"center\"},\"shape\":{\"event\":{\"action\":[{\"asset_model\":\"item.question_audio\",\"sound\":true,\"type\":\"command\",\"command\":\"stop\"},{\"asset_model\":\"item.question_audio\",\"type\":\"command\",\"command\":\"play\"}],\"type\":\"click\"},\"hitArea\":true,\"w\":100,\"h\":24,\"x\":0,\"y\":10,\"type\":\"rect\"},\"g\":[{\"placeholder\":[{\"model-count\":\"item.optionCount1\",\"w\":30,\"h\":100,\"x\":0,\"y\":0,\"valign\":\"middle\",\"align\":\"center\",\"type\":\"gridLayout\",\"model-asset\":\"item.question_image\"},{\"model-count\":\"item.optionCount2\",\"w\":30,\"h\":100,\"x\":40,\"y\":0,\"valign\":\"middle\",\"align\":\"center\",\"type\":\"gridLayout\",\"model-asset\":\"item.question_image\"}],\"text\":[{\"color\":\"#4c4c4c\",\"w\":5,\"h\":0,\"x\":32,\"fontsize\":\"3vw\",\"y\":55,\"model\":\"item.operator1\",\"valign\":\"middle\",\"align\":\"center\"},{\"color\":\"#4c4c4c\",\"w\":5,\"h\":0,\"x\":72,\"fontsize\":\"3vw\",\"y\":55,\"model\":\"item.operator2\",\"valign\":\"middle\",\"align\":\"center\"},{\"z-index\":30,\"color\":\"#4c4c4c\",\"w\":20,\"h\":40,\"x\":80,\"fontsize\":\"3vw\",\"y\":38,\"model\":\"item.ans1\",\"valign\":\"middle\",\"id\":\"newText1\",\"align\":\"center\"}],\"g\":{\"shape\":{\"w\":100,\"h\":100,\"x\":0,\"y\":0,\"stroke-width\":3,\"fill\":\"#FFFFA5\",\"type\":\"roundrect\",\"stroke\":\"#719ECE\"},\"z-index\":20,\"w\":20,\"h\":40,\"x\":80,\"y\":34,\"id\":\"textshape1\"},\"w\":100,\"h\":32,\"x\":0,\"y\":33},{\"nkeyboard\":{\"keys\":\"item.keys\",\"w\":100,\"h\":25,\"limit\":7,\"x\":0,\"y\":82,\"id\":\"bKeyboard\",\"type\":\"custom\",\"target\":\"newText1\"},\"w\":100,\"h\":100,\"x\":0,\"y\":0}],\"id\":\"Operations_with_images\"}],\"itemType\":\"UNIT\",\"code\":\"org.ekstep.assessmentitem.literacy_5abb516b8f224\",\"subject\":\"domain\",\"qlevel\":\"EASY\",\"channel\":\"in.ekstep\",\"description\":\"\",\"language\":[\"English\"],\"media\":[{\"id\":\"do_11246090113921843213\",\"type\":\"image\",\"src\":\"https://dev.ekstep.in/assets/public/content/do_11246090113921843213/artifact/ae36d87ad0aa9438984018205a9c0fa0_1521106096238.jpeg\",\"asset_id\":\"do_11246090113921843213\"}],\"type\":\"ftb\",\"title\":\"v1 - operations with images\",\"createdOn\":\"2018-03-28T08:25:15.611+0000\",\"gradeLevel\":[\"Kindergarten\"],\"appId\":\"ekstep_portal\",\"question_image\":\"do_11246090113921843213\",\"lastUpdatedOn\":\"2018-03-28T08:25:15.611+0000\",\"used_for\":\"worksheet\",\"model\":{\"optionCount1\":\"4\",\"optionCount2\":\"3\",\"operator1\":\"-\",\"operator2\":\"=\",\"keys\":\"0,1,2,3,4,5,6,7,8,9,+,-,×,÷,=,<,>,/,.\"},\"lastUpdatedBy\":\"597\",\"identifier\":\"do_112470071423893504143\",\"question\":\"v1 - operations with images\",\"consumerId\":\"f6878ac4-e9c9-4bc4-80be-298c5a73b447\",\"version\":1,\"versionKey\":\"1522225515611\",\"answer\":{\"ans1\":{\"value\":\"1\",\"score\":1}},\"concepts\":[{\"identifier\":\"LO4\",\"name\":\"Understanding of Grammar/Syntax\",\"objectType\":\"Concept\",\"relation\":\"associatedTo\",\"description\":null,\"index\":null,\"status\":null,\"depth\":null,\"mimeType\":null,\"visibility\":null,\"compatibilityLevel\":null}],\"createdBy\":\"597\",\"max_score\":1,\"domain\":[\"literacy\"],\"name\":\"v1 - operations with images\",\"template_id\":\"do_112470023566245888128\",\"category\":\"MCQ\",\"status\":\"Live\",\"isSelected\":true,\"$$hashKey\":\"object:694\",\"mediamanifest\":{\"media\":[{\"id\":\"do_11246090113921843213\",\"type\":\"image\",\"src\":\"https://dev.ekstep.in/assets/public/content/do_11246090113921843213/artifact/ae36d87ad0aa9438984018205a9c0fa0_1521106096238.jpeg\",\"asset_id\":\"do_11246090113921843213\"},{\"src\":\"https://dev.ekstep.in/assets/public/content/do_112470023566245888128/assets/1522219674003/customnumkeyboard.js\",\"id\":\"nkeyboard\",\"type\":\"plugin\",\"plugin\":\"org.ekstep.questionset\",\"ver\":\"1.0\"},{\"src\":\"https://dev.ekstep.in/assets/public/content/do_112470023566245888128/assets/1522219674010/numerickeyboard.css\",\"id\":\"keyboard_css\",\"type\":\"css\",\"plugin\":\"org.ekstep.questionset\",\"ver\":\"1.0\"}]}}]" }, "config": { "__cdata": "{\"title\":\"qs\",\"max_score\":1,\"allow_skip\":true,\"show_feedback\":true,\"shuffle_questions\":false,\"shuffle_options\":false,\"total_items\":1,\"btn_edit\":\"Edit\"}" }, "org.ekstep.question": [{ "id": "771329d0-21d4-4834-96ac-de16576241e6", "type": "ftb", "pluginId": "org.ekstep.questionset.quiz", "pluginVer": "1.0", "templateId": "horizontalMCQ", "data": { "__cdata": "{\"questionnaire\":{\"items\":{\"do_112470071423893504143\":[{\"itemType\":\"UNIT\",\"code\":\"org.ekstep.assessmentitem.literacy_5abb516b8f224\",\"subject\":\"domain\",\"qlevel\":\"EASY\",\"channel\":\"in.ekstep\",\"description\":\"\",\"language\":[\"English\"],\"media\":[{\"id\":\"do_11246090113921843213\",\"type\":\"image\",\"src\":\"https://dev.ekstep.in/assets/public/content/do_11246090113921843213/artifact/ae36d87ad0aa9438984018205a9c0fa0_1521106096238.jpeg\",\"asset_id\":\"do_11246090113921843213\"}],\"type\":\"ftb\",\"title\":\"v1 - operations with images\",\"createdOn\":\"2018-03-28T08:25:15.611+0000\",\"gradeLevel\":[\"Kindergarten\"],\"appId\":\"ekstep_portal\",\"question_image\":\"do_11246090113921843213\",\"lastUpdatedOn\":\"2018-03-28T08:25:15.611+0000\",\"used_for\":\"worksheet\",\"model\":{\"optionCount1\":\"4\",\"optionCount2\":\"3\",\"operator1\":\"-\",\"operator2\":\"=\",\"keys\":\"0,1,2,3,4,5,6,7,8,9,+,-,×,÷,=,<,>,/,.\"},\"lastUpdatedBy\":\"597\",\"identifier\":\"do_112470071423893504143\",\"question\":\"v1 - operations with images\",\"consumerId\":\"f6878ac4-e9c9-4bc4-80be-298c5a73b447\",\"version\":1,\"versionKey\":\"1522225515611\",\"answer\":{\"ans1\":{\"value\":\"1\",\"score\":1}},\"concepts\":[{\"identifier\":\"LO4\",\"name\":\"Understanding of Grammar/Syntax\",\"objectType\":\"Concept\",\"relation\":\"associatedTo\",\"description\":null,\"index\":null,\"status\":null,\"depth\":null,\"mimeType\":null,\"visibility\":null,\"compatibilityLevel\":null}],\"createdBy\":\"597\",\"max_score\":1,\"domain\":[\"literacy\"],\"name\":\"v1 - operations with images\",\"template_id\":\"do_112470023566245888128\",\"category\":\"MCQ\",\"status\":\"Live\",\"isSelected\":true,\"$$hashKey\":\"object:694\",\"template\":\"Operations_with_images\"}]},\"item_sets\":[{\"count\":1,\"id\":\"do_112470071423893504143\"}],\"title\":\"qs\",\"max_score\":1,\"allow_skip\":true,\"show_feedback\":true,\"shuffle_questions\":false,\"shuffle_options\":false,\"total_items\":1,\"btn_edit\":\"Edit\"},\"template\":[{\"text\":{\"event\":{\"action\":[{\"asset_model\":\"item.question_audio\",\"sound\":true,\"type\":\"command\",\"command\":\"stop\"},{\"asset_model\":\"item.question_audio\",\"type\":\"command\",\"command\":\"play\"}],\"type\":\"click\"},\"color\":\"#4c4c4c\",\"w\":100,\"h\":15,\"x\":0,\"fontsize\":\"3vw\",\"y\":10,\"lineHeight\":1.4,\"model\":\"item.question\",\"valign\":\"top\",\"align\":\"center\"},\"shape\":{\"event\":{\"action\":[{\"asset_model\":\"item.question_audio\",\"sound\":true,\"type\":\"command\",\"command\":\"stop\"},{\"asset_model\":\"item.question_audio\",\"type\":\"command\",\"command\":\"play\"}],\"type\":\"click\"},\"hitArea\":true,\"w\":100,\"h\":24,\"x\":0,\"y\":10,\"type\":\"rect\"},\"g\":[{\"placeholder\":[{\"model-count\":\"item.optionCount1\",\"w\":30,\"h\":100,\"x\":0,\"y\":0,\"valign\":\"middle\",\"align\":\"center\",\"type\":\"gridLayout\",\"model-asset\":\"item.question_image\"},{\"model-count\":\"item.optionCount2\",\"w\":30,\"h\":100,\"x\":40,\"y\":0,\"valign\":\"middle\",\"align\":\"center\",\"type\":\"gridLayout\",\"model-asset\":\"item.question_image\"}],\"text\":[{\"color\":\"#4c4c4c\",\"w\":5,\"h\":0,\"x\":32,\"fontsize\":\"3vw\",\"y\":55,\"model\":\"item.operator1\",\"valign\":\"middle\",\"align\":\"center\"},{\"color\":\"#4c4c4c\",\"w\":5,\"h\":0,\"x\":72,\"fontsize\":\"3vw\",\"y\":55,\"model\":\"item.operator2\",\"valign\":\"middle\",\"align\":\"center\"},{\"z-index\":30,\"color\":\"#4c4c4c\",\"w\":20,\"h\":40,\"x\":80,\"fontsize\":\"3vw\",\"y\":38,\"model\":\"item.ans1\",\"valign\":\"middle\",\"id\":\"newText1\",\"align\":\"center\"}],\"g\":{\"shape\":{\"w\":100,\"h\":100,\"x\":0,\"y\":0,\"stroke-width\":3,\"fill\":\"#FFFFA5\",\"type\":\"roundrect\",\"stroke\":\"#719ECE\"},\"z-index\":20,\"w\":20,\"h\":40,\"x\":80,\"y\":34,\"id\":\"textshape1\"},\"w\":100,\"h\":32,\"x\":0,\"y\":33},{\"nkeyboard\":{\"keys\":\"item.keys\",\"w\":100,\"h\":25,\"limit\":7,\"x\":0,\"y\":82,\"id\":\"bKeyboard\",\"type\":\"custom\",\"target\":\"newText1\"},\"w\":100,\"h\":100,\"x\":0,\"y\":0}],\"id\":\"Operations_with_images\"}]}" }, "config": { "__cdata": "{\"type\":\"items\",\"var\":\"item\"}" }, "w": 80, "h": 85, "x": 9, "y": 6 }] };
      expect(v1ecml[org.ekstep.question]).toEqual(expectedEcml[org.ekstep.question]);
    });
    it('should return ecml of question set', function() {
      plugin.data = v2Data;
      var v2ecml = plugin.toECML();
      var expectedEcml = { "x": 9, "y": 6, "w": 80, "h": 85, "rotate": 0, "z-index": 0, "id": "1a5d8740-ea06-4975-828e-5ad9703be942", "data": { "__cdata": "[{\"template\":\"NA\",\"itemType\":\"UNIT\",\"code\":\"NA\",\"subject\":\"domain\",\"qlevel\":\"EASY\",\"channel\":\"in.ekstep\",\"description\":\"test\",\"language\":[\"English\"],\"type\":\"mcq\",\"title\":\"test image and audio for the image\",\"body\":\"{\\\"data\\\":{\\\"plugin\\\":{\\\"id\\\":\\\"org.ekstep.questionunit.mcq\\\",\\\"version\\\":\\\"1.0\\\",\\\"templateId\\\":\\\"horizontalMCQ\\\"},\\\"data\\\":{\\\"question\\\":{\\\"text\\\":\\\"test image and audio for the image\\\",\\\"image\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"audio\\\":\\\"\\\",\\\"hint\\\":\\\"\\\"},\\\"options\\\":[{\\\"text\\\":\\\"test1\\\",\\\"image\\\":\\\"\\\",\\\"audio\\\":\\\"/assets/public/content/145503359952511.mp3\\\",\\\"hint\\\":\\\"\\\",\\\"isCorrect\\\":true,\\\"$$hashKey\\\":\\\"object:3278\\\"},{\\\"text\\\":\\\"test2\\\",\\\"image\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"audio\\\":\\\"\\\",\\\"hint\\\":\\\"\\\",\\\"isCorrect\\\":false,\\\"$$hashKey\\\":\\\"object:3279\\\"}],\\\"media\\\":[{\\\"id\\\":566752436,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":576331075,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":94711675,\\\"src\\\":\\\"/assets/public/content/145503359952511.mp3\\\",\\\"assetId\\\":\\\"11_sound\\\",\\\"type\\\":\\\"audio\\\",\\\"preload\\\":false}]},\\\"config\\\":{\\\"metadata\\\":{\\\"category\\\":\\\"MCQ\\\",\\\"title\\\":\\\"test image and audio for the image\\\",\\\"language\\\":[\\\"English\\\"],\\\"qlevel\\\":\\\"EASY\\\",\\\"gradeLevel\\\":[\\\"Kindergarten\\\"],\\\"concepts\\\":[\\\"BIO3\\\"],\\\"description\\\":\\\"test\\\",\\\"max_score\\\":1},\\\"max_time\\\":0,\\\"max_score\\\":1,\\\"partial_scoring\\\":false,\\\"layout\\\":\\\"Horizontal\\\",\\\"isShuffleOption\\\":false},\\\"media\\\":[{\\\"id\\\":566752436,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":576331075,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":94711675,\\\"src\\\":\\\"/assets/public/content/145503359952511.mp3\\\",\\\"assetId\\\":\\\"11_sound\\\",\\\"type\\\":\\\"audio\\\",\\\"preload\\\":false}]}}\",\"createdOn\":\"2018-03-23T10:15:24.824+0000\",\"gradeLevel\":[\"Grade 1\"],\"appId\":\"ekstep_portal\",\"options\":[{\"answer\":true,\"value\":{\"type\":\"text\",\"asset\":\"1\",\"resvalue\":0,\"resindex\":0}}],\"lastUpdatedOn\":\"2018-03-23T10:15:24.824+0000\",\"identifier\":\"do_112466586622558208121\",\"question\":\"test image and audio for the image\",\"consumerId\":\"f6878ac4-e9c9-4bc4-80be-298c5a73b447\",\"version\":2,\"versionKey\":\"1521800124824\",\"createdBy\":\"580\",\"max_score\":1,\"name\":\"test image and audio for the image\",\"template_id\":\"NA\",\"category\":\"MCQ\",\"status\":\"Live\",\"isSelected\":true,\"$$hashKey\":\"object:1652\"}]" }, "config": { "__cdata": "{\"title\":\"qs\",\"max_score\":1,\"allow_skip\":true,\"show_feedback\":true,\"shuffle_questions\":false,\"shuffle_options\":false,\"total_items\":1,\"btn_edit\":\"Edit\"}" }, "org.ekstep.question": [{ "id": "d5298a2e-56e8-48d7-88b9-48ce7b8a7122", "type": "mcq", "pluginId": "org.ekstep.questionunit.mcq", "pluginVer": "1.0", "templateId": "horizontalMCQ", "data": { "__cdata": "{\"question\":{\"text\":\"test image and audio for the image\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\"},\"options\":[{\"text\":\"test1\",\"image\":\"\",\"audio\":\"/assets/public/content/145503359952511.mp3\",\"hint\":\"\",\"isCorrect\":true,\"$$hashKey\":\"object:3278\"},{\"text\":\"test2\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\",\"isCorrect\":false,\"$$hashKey\":\"object:3279\"}],\"media\":[{\"id\":566752436,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":576331075,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":94711675,\"src\":\"/assets/public/content/145503359952511.mp3\",\"assetId\":\"11_sound\",\"type\":\"audio\",\"preload\":false}]}" }, "config": { "__cdata": "{\"metadata\":{\"category\":\"MCQ\",\"title\":\"test image and audio for the image\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"Kindergarten\"],\"concepts\":[\"BIO3\"],\"description\":\"test\",\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":false,\"layout\":\"Horizontal\",\"isShuffleOption\":false}" }, "w": 80, "h": 85, "x": 9, "y": 6 }] };
      expect(v2ecml[org.ekstep.question]).toEqual(expectedEcml[org.ekstep.question]);
    });
    it('should call add media 3 times for v2Data', function() {
      plugin.data = v2Data;
      plugin.toECML();

      expect(plugin.addMedia.calls.count()).toBe(3);
    });
  });

  describe("createEcmlStructureV1", function() {

    beforeEach(function() {
      plugin.data = v1Data;
    });

    it('should call createEcmlStructureV1', function() {
      var controller = {};
      controller = plugin.createEcmlStructureV1(plugin.data[0]);
      expect(controller).toContain("questionnaire");
      expect(controller).toContain("template");
    });

  });

  describe('get config', function() {

    it('should return config object', function() {
      var result = plugin.getConfig();
      var actualProps = Object.keys(result);
      var expectedProps = ["title", "max_score", "allow_skip", "show_feedback", "shuffle_questions", "shuffle_options", "total_items", "btn_edit"];
      expect(actualProps).toEqual(expectedProps);
    });

  });

  describe('openQuestionBank function', function() {
    var event, callback, data;

    it('should open question bank popup when creating question set', function() {
      event = { "target": undefined, "type": "org.ekstep.questionset:showPopup" };
      callback = undefined;
      data = undefined;
      plugin.openQuestionBank(event, callback);
      expect(ecEditor.dispatchEvent).toHaveBeenCalledWith('org.ekstep.questionbank:showpopup', { callback: callback, data: data });
    });

    it('should open question bank popup when editing question set', function() {
      event = { "target": undefined, "type": "org.ekstep.questionset:showPopup" };
      callback = { "type": "questionset", "callback": function() {} };
      data = { data: v2Data1, config: plugin.config };
      plugin.openQuestionBank(event, callback);
      expect(ecEditor.dispatchEvent).toHaveBeenCalledWith('org.ekstep.questionbank:showpopup', { callback: callback.callback, data: data });
    });

  });

  describe('add question set to the stage', function() {
    var dataObj, event, qdata;

    it('should call addQS with dataObj', function() {
      event = { target: undefined, type: "org.ekstep.questionset:addQS" };
      dataObj = { callback: undefined, data: { "data": v2Data1, "config": plugin.config } };
      plugin.addQS(event, dataObj);
      expect(plugin.addQS).toHaveBeenCalledWith(event, dataObj);
      qdata = { "data": v2Data1, "config": { __cdata: JSON.stringify(plugin.config) } };
      expect(ecEditor.dispatchEvent).toHaveBeenCalledWith(plugin.manifest.id + ':create', qdata);
    });
  });

  describe('on config change in sidebar', function() {
    beforeEach(function() {
      plugin.data = v2Data1;
      plugin.editorObj = { "_objects": [{ "type": "image", "originX": "left", "originY": "top", "left": -392.5, "top": -256.5, "width": 785, "height": 513, "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 0, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-over", "transformMatrix": null, "skewX": 0, "skewY": 0, "src": "http://localhost:3000/plugins/org.ekstep.questionset-1.0/editor/assets/quizimage.png", "filters": [], "resizeFilters": [] }, { "type": "group", "originX": "left", "originY": "top", "left": -359.5, "top": -235.65, "width": 125.66, "height": 31.56, "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 0, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-over", "transformMatrix": null, "skewX": 0, "skewY": 0, "_objects": [{ "type": "text", "originX": "left", "originY": "top", "left": -62.83, "top": -15.78, "width": 10.83, "height": 16.95, "fill": "black", "stroke": null, "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-over", "transformMatrix": null, "skewX": 0, "skewY": 0 }, { "type": "text", "originX": "left", "originY": "top", "left": -62.83, "top": 1.22, "width": 72.33, "height": 13.56, "fill": "black", "stroke": null, "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-over", "transformMatrix": null, "skewX": 0, "skewY": 0 }, { "type": "text", "originX": "left", "originY": "top", "left": 22.17, "top": 1.22, "width": 39.66, "height": 13.56, "fill": "black", "stroke": null, "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeLineJoin": "miter", "strokeMiterLimit": 10, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "clipTo": null, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-over", "transformMatrix": null, "skewX": 0, "skewY": 0 }] }] };
    });

    it('should set question title to question set', function() {
      plugin.editorObj._objects[1]._objects[0].setText = jasmine.createSpy('setText');
      plugin.onConfigChange("title", "question set");
      expect(plugin.config.title).toEqual("question set");
    });
    it('should set total_items to 2', function() {
      plugin.editorObj._objects[1]._objects[1].setText = jasmine.createSpy('setText');
      plugin.onConfigChange("total_items", 2);
      expect(plugin.config.total_items).toEqual(2);
    });
    it('should  set max_score to 2', function() {
      plugin.editorObj._objects[1]._objects[2].setText = jasmine.createSpy('setText');
      plugin.onConfigChange("max_score", 2);
      expect(plugin.config.max_score).toEqual(2);
    });
    it('should call render', function() {
      plugin.onConfigChange("shuffle_questions", false);
      expect(ecEditor.render).toHaveBeenCalled();
    });
    it('should set shuffle_questions to be false', function() {
      plugin.onConfigChange("shuffle_questions", false);
      expect(plugin.config.shuffle_questions).toBeFalsy();
    });
    it('should set show_feedback to be false', function() {
      plugin.onConfigChange("show_feedback", false);
      expect(plugin.config.show_feedback).toBeFalsy();
    });
    it('should set optionShuffle to be false', function() {
      plugin.onConfigChange("optionShuffle", true);
      expect(plugin.config.optionShuffle).toBeTruthy();
    });
    it('should set shuffle_questions to be false', function() {
      plugin.onConfigChange("btn_edit", "Edit");
      expect(ecEditor.dispatchEvent).toHaveBeenCalledWith('delete:invoke');
    });
  });

});