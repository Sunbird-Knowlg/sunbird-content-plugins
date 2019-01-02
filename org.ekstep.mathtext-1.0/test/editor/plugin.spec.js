describe("EditorPlugin", function() {
  var plugin;

  beforeEach(function() {
    plugin = new org.ekstep.mathtext.EditorPlugin({}, {}, {});
    spyOn(plugin, "loadHtml");
    var elem = '<div ><canvas id="canvas" ></canvas></div>';
    var elem1 = '<div ><span id="latex"></span></div>';

    popupService = jasmine.createSpyObj("popupService", ["loadNgModules", "open"]);
    spyOn(ecEditor, "getService").and.callFake(function(serviceName) {
      if (serviceName === ServiceConstants.POPUP_SERVICE) {
        return popupService;
      }
    });

    plugin.editorObj = {};
    var fabUtil = fabric.util;

    spyOn(fabUtil,"removeListener");

    spyOn(ecEditor, "addEventListener");
    spyOn(ecEditor, "dispatchEvent");
    spyOn(katex, "render");
    spyOn(plugin, "latexToEquation").and.callThrough();
    spyOn(plugin,"addDivElement").and.callThrough();

  });

  describe("initialize", function() {
    it("should initialize plugin", function() {
      plugin.initialize();
      expect(plugin instanceof Class).toBeTruthy();
    });
    it("should call addEventListener", function() {
      plugin.initialize();
      expect(ecEditor.addEventListener).toHaveBeenCalled();
    })
  });
   describe("newInstance", function() {
    it("should initialize plugin", function() {
      plugin.newInstance();
      expect(plugin.addDivElement).toHaveBeenCalled();
    });
  });
  describe("latexToEquation", function() {
    it("should call katext render function", function() {
      plugin.latexToEquation('libFormula1', 'text');
      expect(katex.render).toHaveBeenCalled();
    });
  });
  describe("addDivElement", function() {
    it("should call latexToEquation", function() {
      plugin.addDivElement({}, plugin);
      expect(plugin.latexToEquation).toHaveBeenCalled();
    });
  });
   describe("deselected", function() {
    it("should call latexToEquation", function() {
      plugin.deselected(plugin, {}, {});
      expect(fabUtil.removeListener).toHaveBeenCalled();
    });
  });

});