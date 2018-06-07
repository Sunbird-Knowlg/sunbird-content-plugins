describe("EditorPlugin", function() {
  var plugin, popupService;

  beforeEach(module('org.ekstep.question'));

  beforeEach(function() {
    plugin = new org.ekstep.question.EditorPlugin({}, {}, {});
    spyOn(plugin, "loadHtml");

    popupService = jasmine.createSpyObj("popupService", ["loadNgModules", "open"]);
    spyOn(ecEditor, "getService").and.callFake(function(serviceName) {
      if (serviceName === ServiceConstants.POPUP_SERVICE) {
        return popupService;
      }
    });
  });

  describe("newInstance", function() {
    it("should ?", function() {
      plugin.initialize();
      expect(plugin instanceof Class).toBeTruthy();
    });
    // it("should ?", function() {
    //   var event = { "target": undefined, "type": "org.ekstep.question:showpopup" };
    //   var data = { "template": "NA", "itemType": "UNIT", "code": "NA", "subject": "domain", "qlevel": "EASY", "channel": "in.ekstep", "language": ["English"], "type": "mcq", "title": "choose the color of the sky\n", "body": "{\"data\":{\"plugin\":{\"id\":\"org.ekstep.questionunit.mcq\",\"version\":\"1.0\",\"templateId\":\"horizontalMCQ\"},\"data\":{\"question\":{\"text\":\"<p>choose the color of the sky</p>\\n\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\"},\"options\":[{\"text\":\"blue\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\",\"isCorrect\":true\"},{\"text\":\"red\",\"image\":\"\",\"audio\":\"\",\"hint\":\"\",\"isCorrect\":false\"}],\"questionCount\":1,\"media\":[]},\"config\":{\"metadata\":{\"category\":\"MCQ\",\"title\":\"choose the color of the sky\\n\",\"language\":[\"English\"],\"qlevel\":\"EASY\",\"gradeLevel\":[\"Grade 1\"],\"concepts\":[{\"identifier\":\"LO4\",\"name\":\"Understanding of Grammar/Syntax\"}],\"max_score\":1},\"max_time\":0,\"max_score\":1,\"partial_scoring\":true,\"layout\":\"Horizontal\",\"isShuffleOption\":false,\"questionCount\":1},\"media\":[]}}", "createdOn": "2018-05-03T10:47:50.316+0000", "isShuffleOption": false, "appId": "ekstep_portal", "options": [{ "answer": true, "value": { "type": "text", "asset": "1", "resvalue": 0, "resindex": 0 } }], "lastUpdatedOn": "2018-05-03T10:47:50.316+0000", "identifier": "do_112495621900836864142", "question": "<p>choose the color of the sky</p>\n", "consumerId": "f6878ac4-e9c9-4bc4-80be-298c5a73b447", "version": 2, "versionKey": "1525344470316", "framework": "NCF", "createdBy": "390", "max_score": 1, "name": "choose the color of the sky\n", "template_id": "NA", "category": "MCQ", "status": "Live" };
    //   plugin.loadHtml(event, data);
    //   expect(plugin.loadHtml).toHaveBeenCalled();
    // });
  });

});