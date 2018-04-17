describe("EditorPlugin", function () {
  describe("newInstance", function () {
    var plugin;

    beforeEach(function () {
      plugin = new org.ekstep.questionset.EditorPlugin({}, {}, {});
      spyOn(ecEditor, "loadAndInitPlugin").and.callFake(function() {
        return undefined;
      });
    });

    it("should ?", function () {
      plugin.initialize();

      expect(ecEditor.loadAndInitPlugin).toHaveBeenCalled();
    });
  });
});
