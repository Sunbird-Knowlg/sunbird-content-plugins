describe("EditorPlugin", function() {

  var plugin, stage, fabricGroup, v1QuesECML, questionSetECML;

  beforeEach(function() {
    plugin = new org.ekstep.questionset.EditorPlugin({}, {}, {});
    stage = ecEditor.instantiatePlugin('org.ekstep.stage');
    fabricGroup = new fabric.Group();
    plugin.data = [{ "template": [{ "text": { "event": { "action": [{ "asset_model": "item.question_audio", "sound": true, "type": "command", "command": "stop" }, { "asset_model": "item.question_audio", "type": "command", "command": "play" }], "type": "click" }, "color": "#4c4c4c", "w": 100, "h": 15, "x": 0, "fontsize": "3vw", "y": 10, "lineHeight": 1.4, "model": "item.question", "valign": "top", "align": "center" }, "shape": { "event": { "action": [{ "asset_model": "item.question_audio", "sound": true, "type": "command", "command": "stop" }, { "asset_model": "item.question_audio", "type": "command", "command": "play" }], "type": "click" }, "hitArea": true, "w": 100, "h": 24, "x": 0, "y": 10, "type": "rect" }, "g": [{ "placeholder": [{ "model-count": "item.optionCount1", "w": 30, "h": 100, "x": 0, "y": 0, "valign": "middle", "align": "center", "type": "gridLayout", "model-asset": "item.question_image" }, { "model-count": "item.optionCount2", "w": 30, "h": 100, "x": 40, "y": 0, "valign": "middle", "align": "center", "type": "gridLayout", "model-asset": "item.question_image" }], "text": [{ "color": "#4c4c4c", "w": 5, "h": 0, "x": 32, "fontsize": "3vw", "y": 55, "model": "item.operator1", "valign": "middle", "align": "center" }, { "color": "#4c4c4c", "w": 5, "h": 0, "x": 72, "fontsize": "3vw", "y": 55, "model": "item.operator2", "valign": "middle", "align": "center" }, { "z-index": 30, "color": "#4c4c4c", "w": 20, "h": 40, "x": 80, "fontsize": "3vw", "y": 38, "model": "item.ans1", "valign": "middle", "id": "newText1", "align": "center" }], "g": { "shape": { "w": 100, "h": 100, "x": 0, "y": 0, "stroke-width": 3, "fill": "#FFFFA5", "type": "roundrect", "stroke": "#719ECE" }, "z-index": 20, "w": 20, "h": 40, "x": 80, "y": 34, "id": "textshape1" }, "w": 100, "h": 32, "x": 0, "y": 33 }, { "nkeyboard": { "keys": "item.keys", "w": 100, "h": 25, "limit": 7, "x": 0, "y": 82, "id": "bKeyboard", "type": "custom", "target": "newText1" }, "w": 100, "h": 100, "x": 0, "y": 0 }], "id": "Operations_with_images" }], "itemType": "UNIT", "code": "org.ekstep.assessmentitem.literacy_5abb516b8f224", "subject": "domain", "qlevel": "EASY", "channel": "in.ekstep", "description": "", "language": ["English"], "media": [{ "id": "do_11246090113921843213", "type": "image", "src": "https://dev.ekstep.in/assets/public/content/do_11246090113921843213/artifact/ae36d87ad0aa9438984018205a9c0fa0_1521106096238.jpeg", "asset_id": "do_11246090113921843213" }], "type": "ftb", "title": "v1 - operations with images", "createdOn": "2018-03-28T08:25:15.611+0000", "gradeLevel": ["Kindergarten"], "appId": "ekstep_portal", "question_image": "do_11246090113921843213", "lastUpdatedOn": "2018-03-28T08:25:15.611+0000", "used_for": "worksheet", "model": { "optionCount1": "4", "optionCount2": "3", "operator1": "-", "operator2": "=", "keys": "0,1,2,3,4,5,6,7,8,9,+,-,×,÷,=,<,>,/,." }, "lastUpdatedBy": "597", "identifier": "do_112470071423893504143", "question": "v1 - operations with images", "consumerId": "f6878ac4-e9c9-4bc4-80be-298c5a73b447", "version": 1, "versionKey": "1522225515611", "answer": { "ans1": { "value": "1", "score": 1 } }, "concepts": [{ "identifier": "LO4", "name": "Understanding of Grammar/Syntax", "objectType": "Concept", "relation": "associatedTo", "description": null, "index": null, "status": null, "depth": null, "mimeType": null, "visibility": null, "compatibilityLevel": null }], "createdBy": "597", "max_score": 1, "domain": ["literacy"], "name": "v1 - operations with images", "template_id": "do_112470023566245888128", "category": "MCQ", "status": "Live", "isSelected": true, "mediamanifest": { "media": [{ "id": "do_11246090113921843213", "type": "image", "src": "https://dev.ekstep.in/assets/public/content/do_11246090113921843213/artifact/ae36d87ad0aa9438984018205a9c0fa0_1521106096238.jpeg", "asset_id": "do_11246090113921843213" }, { "src": "https://dev.ekstep.in/assets/public/content/do_112470023566245888128/assets/1522219674003/customnumkeyboard.js", "id": "nkeyboard", "type": "plugin", "plugin": "org.ekstep.questionset", "ver": "1.0" }, { "src": "https://dev.ekstep.in/assets/public/content/do_112470023566245888128/assets/1522219674010/numerickeyboard.css", "id": "keyboard_css", "type": "css", "plugin": "org.ekstep.questionset", "ver": "1.0" }] } },
      { "template": "NA", "itemType": "UNIT", "code": "NA", "subject": "domain", "qlevel": "EASY", "channel": "in.ekstep", "description": "test", "language": ["English"], "type": "mcq", "title": "test image and audio for the image", "body": "{\"data\":{\"plugin\":{\"id\":\"org.ekstep.questionunit.mcq\",\"version\":\"1.0\",\"templateId\":\"horizontalMCQ\"},\"data\":{\"question\":{\"text\":\"test image and audio for the image\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\"},\"options\":[{\"text\":\"test1\",\"image\":\"\",\"audio\":\"/assets/public/content/145503359952511.mp3\",\"hint\":\"\",\"isCorrect\":true,\"$$hashKey\":\"object:3278\"},{\"text\":\"test2\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\",\"isCorrect\":false,\"$$hashKey\":\"object:3279\"}],\"media\":[{\"id\":566752436,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":576331075,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":94711675,\"src\":\"/assets/public/content/145503359952511.mp3\",\"assetId\":\"11_sound\",\"type\":\"audio\",\"preload\":false}]},\"config\":{\"metadata\":{\"category\":\"MCQ\",\"title\":\"test image and audio for the image\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"Kindergarten\"],\"concepts\":[\"BIO3\"],\"description\":\"test\",\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":false,\"layout\":\"Horizontal\",\"isShuffleOption\":false},\"media\":[{\"id\":566752436,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":576331075,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":94711675,\"src\":\"/assets/public/content/145503359952511.mp3\",\"assetId\":\"11_sound\",\"type\":\"audio\",\"preload\":false}]}}", "createdOn": "2018-03-23T10:15:24.824+0000", "gradeLevel": ["Grade 1"], "appId": "ekstep_portal", "options": [{ "answer": true, "value": { "type": "text", "asset": "1", "resvalue": 0, "resindex": 0 } }], "lastUpdatedOn": "2018-03-23T10:15:24.824+0000", "identifier": "do_112466586622558208121", "question": "test image and audio for the image", "consumerId": "f6878ac4-e9c9-4bc4-80be-298c5a73b447", "version": 2, "versionKey": "1521800124824", "createdBy": "580", "max_score": 1, "name": "test image and audio for the image", "template_id": "NA", "category": "MCQ", "status": "Live", "$$hashKey": "object:2719", "isSelected": true }
    ];
    plugin.config = { "title": "qs", "max_score": 2, "allow_skip": true, "sho…options": false, "total_items": 2, "btn_edit": "Edit" };
    v1QuesECML = [{ "x": 9, "y": 6, "w": 80, "h": 85, "rotate": 0, "z-index": 0, "id": "1087e68d-c61e-4deb-a2e3-298524929181", "org.ekstep.question": [{ "id": "5b1400c8-d8c1-41c2-9044-b6e75e1e3444", "type": "mcq", "pluginId": "org.ekstep.questionunit.mcq", "pluginVer": "1.0", "templateId": "horizontalMCQ", "data": { "__cdata": "{\"question\":{\"text\":\"test image and audio for the image\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\"},\"options\":[{\"text\":\"test1\",\"image\":\"\",\"audio\":\"/assets/public/content/145503359952511.mp3\",\"hint\":\"\",\"isCorrect\":true,\"$$hashKey\":\"object:3278\"},{\"text\":\"test2\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\",\"isCorrect\":false,\"$$hashKey\":\"object:3279\"}],\"media\":[{\"id\":566752436,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":576331075,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":94711675,\"src\":\"/assets/public/content/145503359952511.mp3\",\"assetId\":\"11_sound\",\"type\":\"audio\",\"preload\":false}]}" }, "config": { "__cdata": "{\"metadata\":{\"category\":\"MCQ\",\"title\":\"test image and audio for the image\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"Kindergarten\"],\"concepts\":[\"BIO3\"],\"description\":\"test\",\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":false,\"layout\":\"Horizontal\",\"isShuffleOption\":false}" }, "w": 80, "h": 85, "x": 9, "y": 6 }], "data": { "__cdata": "[{\"template\":\"NA\",\"itemType\":\"UNIT\",\"code\":\"NA\",\"subject\":\"domain\",\"qlevel\":\"EASY\",\"channel\":\"in.ekstep\",\"description\":\"test\",\"language\":[\"English\"],\"type\":\"mcq\",\"title\":\"test image and audio for the image\",\"body\":\"{\\\"data\\\":{\\\"plugin\\\":{\\\"id\\\":\\\"org.ekstep.questionunit.mcq\\\",\\\"version\\\":\\\"1.0\\\",\\\"templateId\\\":\\\"horizontalMCQ\\\"},\\\"data\\\":{\\\"question\\\":{\\\"text\\\":\\\"test image and audio for the image\\\",\\\"image\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"audio\\\":\\\"\\\",\\\"hint\\\":\\\"\\\"},\\\"options\\\":[{\\\"text\\\":\\\"test1\\\",\\\"image\\\":\\\"\\\",\\\"audio\\\":\\\"/assets/public/content/145503359952511.mp3\\\",\\\"hint\\\":\\\"\\\",\\\"isCorrect\\\":true,\\\"$$hashKey\\\":\\\"object:3278\\\"},{\\\"text\\\":\\\"test2\\\",\\\"image\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"audio\\\":\\\"\\\",\\\"hint\\\":\\\"\\\",\\\"isCorrect\\\":false,\\\"$$hashKey\\\":\\\"object:3279\\\"}],\\\"media\\\":[{\\\"id\\\":566752436,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":576331075,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":94711675,\\\"src\\\":\\\"/assets/public/content/145503359952511.mp3\\\",\\\"assetId\\\":\\\"11_sound\\\",\\\"type\\\":\\\"audio\\\",\\\"preload\\\":false}]},\\\"config\\\":{\\\"metadata\\\":{\\\"category\\\":\\\"MCQ\\\",\\\"title\\\":\\\"test image and audio for the image\\\",\\\"language\\\":[\\\"English\\\"],\\\"qlevel\\\":\\\"EASY\\\",\\\"gradeLevel\\\":[\\\"Kindergarten\\\"],\\\"concepts\\\":[\\\"BIO3\\\"],\\\"description\\\":\\\"test\\\",\\\"max_score\\\":1},\\\"max_time\\\":0,\\\"max_score\\\":1,\\\"partial_scoring\\\":false,\\\"layout\\\":\\\"Horizontal\\\",\\\"isShuffleOption\\\":false},\\\"media\\\":[{\\\"id\\\":566752436,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":576331075,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":94711675,\\\"src\\\":\\\"/assets/public/content/145503359952511.mp3\\\",\\\"assetId\\\":\\\"11_sound\\\",\\\"type\\\":\\\"audio\\\",\\\"preload\\\":false}]}}\",\"createdOn\":\"2018-03-23T10:15:24.824+0000\",\"gradeLevel\":[\"Grade 1\"],\"appId\":\"ekstep_portal\",\"options\":[{\"answer\":true,\"value\":{\"type\":\"text\",\"asset\":\"1\",\"resvalue\":0,\"resindex\":0}}],\"lastUpdatedOn\":\"2018-03-23T10:15:24.824+0000\",\"identifier\":\"do_112466586622558208121\",\"question\":\"test image and audio for the image\",\"consumerId\":\"f6878ac4-e9c9-4bc4-80be-298c5a73b447\",\"version\":2,\"versionKey\":\"1521800124824\",\"createdBy\":\"580\",\"max_score\":1,\"name\":\"test image and audio for the image\",\"template_id\":\"NA\",\"category\":\"MCQ\",\"status\":\"Live\",\"$$hashKey\":\"object:2719\",\"isSelected\":true}]" }, "config": { "__cdata": "{\"title\":\"qs\",\"max_score\":1,\"allow_skip\":true,\"show_feedback\":true,\"shuffle_questions\":false,\"shuffle_options\":false,\"total_items\":1,\"btn_edit\":\"Edit\"}" } }];
    questionSetECML = [];

    plugin._super = jasmine.createSpy('_super').and.callFake(function() {
      return {};
    });

    spyOn(ecEditor, "loadAndInitPlugin").and.callFake(function() {
      return undefined;
    });
    spyOn(fabric, "Group").and.callFake(function() {
      return fabricGroup;
    });
    spyOn(plugin, 'postInit');
    spyOn(plugin, 'getPropsForEditor');
    spyOn(plugin, 'addMedia');
    // spyOn(plugin, '_super').and.callFake(function() {
    //   return {};
    // });
    spyOn(plugin, 'createEcmlStructureV1');
    spyOn(plugin, 'toECML');

  });

  describe("initialize", function() {

    it("should load and initialize dependancy plugins", function() {
      plugin.initialize();

      expect(ecEditor.loadAndInitPlugin).toHaveBeenCalled();
    });

  });

  describe("new instance", function() {

    it('should call add media', function() {
      plugin.newInstance();

      expect(plugin.addMedia).toHaveBeenCalled();
    });

    // it('should call add media', function() {
    //   plugin.newInstance();

    //   expect(plugin.addMedia.calls.count()).toBe(8);
    // });

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

  describe("to ECML", function() {

    // it('should call createEcmlStructureV1', function() {
    //   var ecml = plugin.toECML();

    //   // expect(plugin.createEcmlStructureV1).toHaveBeenCalled();
    //   expect(plugin._super).toHaveBeenCalled();
    // });

    // it('should set attributes as specified', function() { 
    //   plugin.toECML();
    //   expect(questionSetECML).toEqual(v1QuesECML);
    // });

    // it('should set attributes as specified', function() {
    //   plugin.toECML();
    //   expect(ecEditor.instantiatePlugin).toHaveBeenCalled();
    // });
  });

  describe("createEcmlStructureV1", function() {
    it('should call createEcmlStructureV1', function() {
      var question = {},
      controller = {};
      question = {"template":[{"text":{"event":{"action":[{"asset_model":"item.question_audio","sound":true,"type":"command","command":"stop"},{"asset_model":"item.question_audio","type":"command","command":"play"}],"type":"click"},"color":"#4c4c4c","w":100,"h":15,"x":0,"fontsize":"3vw","y":10,"lineHeight":1.4,"model":"item.question","valign":"top","align":"center"},"shape":{"event":{"action":[{"asset_model":"item.question_audio","sound":true,"type":"command","command":"stop"},{"asset_model":"item.question_audio","type":"command","command":"play"}],"type":"click"},"hitArea":true,"w":100,"h":24,"x":0,"y":10,"type":"rect"},"g":[{"placeholder":[{"model-count":"item.optionCount1","w":30,"h":100,"x":0,"y":0,"valign":"middle","align":"center","type":"gridLayout","model-asset":"item.question_image"},{"model-count":"item.optionCount2","w":30,"h":100,"x":40,"y":0,"valign":"middle","align":"center","type":"gridLayout","model-asset":"item.question_image"}],"text":[{"color":"#4c4c4c","w":5,"h":0,"x":32,"fontsize":"3vw","y":55,"model":"item.operator1","valign":"middle","align":"center"},{"color":"#4c4c4c","w":5,"h":0,"x":72,"fontsize":"3vw","y":55,"model":"item.operator2","valign":"middle","align":"center"},{"z-index":30,"color":"#4c4c4c","w":20,"h":40,"x":80,"fontsize":"3vw","y":38,"model":"item.ans1","valign":"middle","id":"newText1","align":"center"}],"g":{"shape":{"w":100,"h":100,"x":0,"y":0,"stroke-width":3,"fill":"#FFFFA5","type":"roundrect","stroke":"#719ECE"},"z-index":20,"w":20,"h":40,"x":80,"y":34,"id":"textshape1"},"w":100,"h":32,"x":0,"y":33},{"nkeyboard":{"keys":"item.keys","w":100,"h":25,"limit":7,"x":0,"y":82,"id":"bKeyboard","type":"custom","target":"newText1"},"w":100,"h":100,"x":0,"y":0}],"id":"Operations_with_images"}],"itemType":"UNIT","code":"org.ekstep.assessmentitem.literacy_5abb516b8f224","subject":"domain","qlevel":"EASY","channel":"in.ekstep","description":"","language":["English"],"media":[{"id":"do_11246090113921843213","type":"image","src":"https://dev.ekstep.in/assets/public/content/do_11246090113921843213/artifact/ae36d87ad0aa9438984018205a9c0fa0_1521106096238.jpeg","asset_id":"do_11246090113921843213"}],"type":"ftb","title":"v1 - operations with images","createdOn":"2018-03-28T08:25:15.611+0000","gradeLevel":["Kindergarten"],"appId":"ekstep_portal","question_image":"do_11246090113921843213","lastUpdatedOn":"2018-03-28T08:25:15.611+0000","used_for":"worksheet","model":{"optionCount1":"4","optionCount2":"3","operator1":"-","operator2":"=","keys":"0,1,2,3,4,5,6,7,8,9,+,-,×,÷,=,<,>,/,."},"lastUpdatedBy":"597","identifier":"do_112470071423893504143","question":"v1 - operations with images","consumerId":"f6878ac4-e9c9-4bc4-80be-298c5a73b447","version":1,"versionKey":"1522225515611","answer":{"ans1":{"value":"1","score":1}},"concepts":[{"identifier":"LO4","name":"Understanding of Grammar/Syntax","objectType":"Concept","relation":"associatedTo","description":null,"index":null,"status":null,"depth":null,"mimeType":null,"visibility":null,"compatibilityLevel":null}],"createdBy":"597","max_score":1,"domain":["literacy"],"name":"v1 - operations with images","template_id":"do_112470023566245888128","category":"MCQ","status":"Live","isSelected":true,"$$hashKey":"object:1190","mediamanifest":{"media":[{"id":"do_11246090113921843213","type":"image","src":"https://dev.ekstep.in/assets/public/content/do_11246090113921843213/artifact/ae36d87ad0aa9438984018205a9c0fa0_1521106096238.jpeg","asset_id":"do_11246090113921843213"},{"src":"https://dev.ekstep.in/assets/public/content/do_112470023566245888128/assets/1522219674003/customnumkeyboard.js","id":"nkeyboard","type":"plugin","plugin":"org.ekstep.questionset","ver":"1.0"},{"src":"https://dev.ekstep.in/assets/public/content/do_112470023566245888128/assets/1522219674010/numerickeyboard.css","id":"keyboard_css","type":"css","plugin":"org.ekstep.questionset","ver":"1.0"}]}};
      //controller = plugin.createEcmlStructureV1(question);
      expect(controller).not.toBe(undefined);
    });

    // it('should call createEcmlStructureV1', function() {
    //   var controller = plugin.createEcmlStructureV1(plugin.data[0]);
    //   expect(controller).not.toBe(undefined);
    // });
  });
});