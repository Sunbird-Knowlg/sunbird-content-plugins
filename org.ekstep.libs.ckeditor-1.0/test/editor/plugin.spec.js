

describe("CKEditorPlugin", function () {
  var plugin;
  beforeAll(function (done) {
    ContentEditorTestFramework.init(function () {

      ecEditor.instantiatePlugin("org.ekstep.stage");
      ecEditor.instantiatePlugin("org.ekstep.config");
      plugin = ecEditor.instantiatePlugin('org.ekstep.libs.ckeditor');
      done();
    });
  })
 
  describe("initialize", function () {
    it("should create ck-editor instance and checks urdu support implementation", function (done) {
      plugin.initialize();

      var divElem = document.createElement('div');
      var elementID = 'ckeditorElement';
      divElem.setAttribute('id', elementID)
      document.body.append(divElem);

      ckEditorInstance = CKEDITOR.replace(elementID, {
        customConfig: ecEditor.resolvePluginResource('org.ekstep.questionunit', '1.0', "editor/ckeditor-config.js"),
        skin: 'moono-lisa,' + CKEDITOR.basePath + "skins/moono-lisa/",
        contentsCss: CKEDITOR.basePath + "contents.css"
      });

      ckEditorInstance.on("instanceReady", function(event){
        var inputText, inputTextAsElement;
        expect(true).toBeTrue();
        expect(event.editor.plugins.urdu).toBeObject();
        event.editor.setData('<p>رنرونورن </p>')  ;
        event.editor.commands.urduSupport.exec();
        inputText = event.editor.getData();
        inputTextAsElement = new DOMParser().parseFromString(inputText, 'text/html').body.firstElementChild;
        expect(inputTextAsElement.getAttribute('class')).toBe('urdu-text');
        expect(inputTextAsElement.getAttribute('dir')).toBe('rtl');
        done();
      });
    });
  });

});

//# sourceURL=urdu-ckeditor-plugin-spec.js