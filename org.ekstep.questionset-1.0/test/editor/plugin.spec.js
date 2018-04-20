describe("EditorPlugin", function() {

  var plugin, stage, fabricGroup, v1QuesECML,questionSetECML;

  beforeEach(function() {
    plugin = new org.ekstep.questionset.EditorPlugin({}, {}, {});
    stage = ecEditor.instantiatePlugin('org.ekstep.stage');
    fabricGroup = new fabric.Group();
    plugin.data = [{ "template": "NA", "itemType": "UNIT", "code": "NA", "subject": "domain", "qlevel": "EASY", "channel": "in.ekstep", "description": "test", "language": ["English"], "type": "mcq", "title": "test image and audio for the image", "body": "{\"data\":{\"plugin\":{\"id\":\"org.ekstep.questionunit.mcq\",\"version\":\"1.0\",\"templateId\":\"horizontalMCQ\"},\"data\":{\"question\":{\"text\":\"test image and audio for the image\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\"},\"options\":[{\"text\":\"test1\",\"image\":\"\",\"audio\":\"/assets/public/content/145503359952511.mp3\",\"hint\":\"\",\"isCorrect\":true,\"$$hashKey\":\"object:3278\"},{\"text\":\"test2\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\",\"isCorrect\":false,\"$$hashKey\":\"object:3279\"}],\"media\":[{\"id\":566752436,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":576331075,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":94711675,\"src\":\"/assets/public/content/145503359952511.mp3\",\"assetId\":\"11_sound\",\"type\":\"audio\",\"preload\":false}]},\"config\":{\"metadata\":{\"category\":\"MCQ\",\"title\":\"test image and audio for the image\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"Kindergarten\"],\"concepts\":[\"BIO3\"],\"description\":\"test\",\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":false,\"layout\":\"Horizontal\",\"isShuffleOption\":false},\"media\":[{\"id\":566752436,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":576331075,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":94711675,\"src\":\"/assets/public/content/145503359952511.mp3\",\"assetId\":\"11_sound\",\"type\":\"audio\",\"preload\":false}]}}", "createdOn": "2018-03-23T10:15:24.824+0000", "gradeLevel": ["Grade 1"], "appId": "ekstep_portal", "options": [{ "answer": true, "value": { "type": "text", "asset": "1", "resvalue": 0, "resindex": 0 } }], "lastUpdatedOn": "2018-03-23T10:15:24.824+0000", "identifier": "do_112466586622558208121", "question": "test image and audio for the image", "consumerId": "f6878ac4-e9c9-4bc4-80be-298c5a73b447", "version": 2, "versionKey": "1521800124824", "createdBy": "580", "max_score": 1, "name": "test image and audio for the image", "template_id": "NA", "category": "MCQ", "status": "Live", "$$hashKey": "object:2719", "isSelected": true }];
    plugin.config = { "title": "qs", "max_score": 2, "allow_skip": true, "sho…options": false, "total_items": 2, "btn_edit": "Edit" };
    v1QuesECML = [{"x":9,"y":6,"w":80,"h":85,"rotate":0,"z-index":0,"id":"1087e68d-c61e-4deb-a2e3-298524929181","org.ekstep.question":[{"id":"5b1400c8-d8c1-41c2-9044-b6e75e1e3444","type":"mcq","pluginId":"org.ekstep.questionunit.mcq","pluginVer":"1.0","templateId":"horizontalMCQ","data":{"__cdata":"{\"question\":{\"text\":\"test image and audio for the image\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\"},\"options\":[{\"text\":\"test1\",\"image\":\"\",\"audio\":\"/assets/public/content/145503359952511.mp3\",\"hint\":\"\",\"isCorrect\":true,\"$$hashKey\":\"object:3278\"},{\"text\":\"test2\",\"image\":\"/assets/public/content/2_1466487176189.jpg\",\"audio\":\"\",\"hint\":\"\",\"isCorrect\":false,\"$$hashKey\":\"object:3279\"}],\"media\":[{\"id\":566752436,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":576331075,\"src\":\"/assets/public/content/2_1466487176189.jpg\",\"assetId\":\"do_20072814\",\"type\":\"image\",\"preload\":false},{\"id\":94711675,\"src\":\"/assets/public/content/145503359952511.mp3\",\"assetId\":\"11_sound\",\"type\":\"audio\",\"preload\":false}]}"},"config":{"__cdata":"{\"metadata\":{\"category\":\"MCQ\",\"title\":\"test image and audio for the image\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"Kindergarten\"],\"concepts\":[\"BIO3\"],\"description\":\"test\",\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":false,\"layout\":\"Horizontal\",\"isShuffleOption\":false}"},"w":80,"h":85,"x":9,"y":6}],"data":{"__cdata":"[{\"template\":\"NA\",\"itemType\":\"UNIT\",\"code\":\"NA\",\"subject\":\"domain\",\"qlevel\":\"EASY\",\"channel\":\"in.ekstep\",\"description\":\"test\",\"language\":[\"English\"],\"type\":\"mcq\",\"title\":\"test image and audio for the image\",\"body\":\"{\\\"data\\\":{\\\"plugin\\\":{\\\"id\\\":\\\"org.ekstep.questionunit.mcq\\\",\\\"version\\\":\\\"1.0\\\",\\\"templateId\\\":\\\"horizontalMCQ\\\"},\\\"data\\\":{\\\"question\\\":{\\\"text\\\":\\\"test image and audio for the image\\\",\\\"image\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"audio\\\":\\\"\\\",\\\"hint\\\":\\\"\\\"},\\\"options\\\":[{\\\"text\\\":\\\"test1\\\",\\\"image\\\":\\\"\\\",\\\"audio\\\":\\\"/assets/public/content/145503359952511.mp3\\\",\\\"hint\\\":\\\"\\\",\\\"isCorrect\\\":true,\\\"$$hashKey\\\":\\\"object:3278\\\"},{\\\"text\\\":\\\"test2\\\",\\\"image\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"audio\\\":\\\"\\\",\\\"hint\\\":\\\"\\\",\\\"isCorrect\\\":false,\\\"$$hashKey\\\":\\\"object:3279\\\"}],\\\"media\\\":[{\\\"id\\\":566752436,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":576331075,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":94711675,\\\"src\\\":\\\"/assets/public/content/145503359952511.mp3\\\",\\\"assetId\\\":\\\"11_sound\\\",\\\"type\\\":\\\"audio\\\",\\\"preload\\\":false}]},\\\"config\\\":{\\\"metadata\\\":{\\\"category\\\":\\\"MCQ\\\",\\\"title\\\":\\\"test image and audio for the image\\\",\\\"language\\\":[\\\"English\\\"],\\\"qlevel\\\":\\\"EASY\\\",\\\"gradeLevel\\\":[\\\"Kindergarten\\\"],\\\"concepts\\\":[\\\"BIO3\\\"],\\\"description\\\":\\\"test\\\",\\\"max_score\\\":1},\\\"max_time\\\":0,\\\"max_score\\\":1,\\\"partial_scoring\\\":false,\\\"layout\\\":\\\"Horizontal\\\",\\\"isShuffleOption\\\":false},\\\"media\\\":[{\\\"id\\\":566752436,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":576331075,\\\"src\\\":\\\"/assets/public/content/2_1466487176189.jpg\\\",\\\"assetId\\\":\\\"do_20072814\\\",\\\"type\\\":\\\"image\\\",\\\"preload\\\":false},{\\\"id\\\":94711675,\\\"src\\\":\\\"/assets/public/content/145503359952511.mp3\\\",\\\"assetId\\\":\\\"11_sound\\\",\\\"type\\\":\\\"audio\\\",\\\"preload\\\":false}]}}\",\"createdOn\":\"2018-03-23T10:15:24.824+0000\",\"gradeLevel\":[\"Grade 1\"],\"appId\":\"ekstep_portal\",\"options\":[{\"answer\":true,\"value\":{\"type\":\"text\",\"asset\":\"1\",\"resvalue\":0,\"resindex\":0}}],\"lastUpdatedOn\":\"2018-03-23T10:15:24.824+0000\",\"identifier\":\"do_112466586622558208121\",\"question\":\"test image and audio for the image\",\"consumerId\":\"f6878ac4-e9c9-4bc4-80be-298c5a73b447\",\"version\":2,\"versionKey\":\"1521800124824\",\"createdBy\":\"580\",\"max_score\":1,\"name\":\"test image and audio for the image\",\"template_id\":\"NA\",\"category\":\"MCQ\",\"status\":\"Live\",\"$$hashKey\":\"object:2719\",\"isSelected\":true}]"},"config":{"__cdata":"{\"title\":\"qs\",\"max_score\":1,\"allow_skip\":true,\"show_feedback\":true,\"shuffle_questions\":false,\"shuffle_options\":false,\"total_items\":1,\"btn_edit\":\"Edit\"}"}}];
    questionSetECML = [];
    spyOn(ecEditor, "loadAndInitPlugin").and.callFake(function() {
      return undefined;
    });
    spyOn(fabric, "Group").and.callFake(function() {
      return fabricGroup;
    });
    spyOn(plugin, 'postInit');
    spyOn(plugin, 'getPropsForEditor');
    spyOn(plugin, 'addMedia');
    spyOn(ecEditor, "instantiatePlugin");
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
    
    it('should set attributes as specified', function() { 
      plugin.toECML();
      expect(questionSetECML).toEqual(v1QuesECML);
    });

    // it('should set attributes as specified', function() {
    //   plugin.toECML();
    //   expect(ecEditor.instantiatePlugin).toHaveBeenCalled();
    // });
  });
});