/**
 *
 * Plugin to create summary of the question set and add it to stage.
 * @class summary
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Jagadish P <jagadish.pujari@tarento.com>
 */

// Register namespace
org.ekstep.summary = {};
org.ekstep.summary.EditorPlugin = org.ekstep.contenteditor.basePlugin.extend({
  type: "org.ekstep.summary",
  /**
   * Register events.
   * @memberof summary
   */
  initialize: function () {
    var instance = this;
    ecEditor.addEventListener(instance.manifest.id + ":addSummary", instance.addSummary, instance);
  },
  newInstance: function () {
    var instance = this;
    var _parent = this.parent;
    this.parent = undefined;
    /*istanbul ignore else*/
    if (!this.attributes.x) {
      this.attributes.x = 50;
      this.attributes.y = 30;
      this.attributes.w = 78;
      this.attributes.h = 94;
      this.percentToPixel(this.attributes);
    }
    var props = this.convertToFabric(this.attributes);
    delete props.widqdatath;
    delete props.height;
 
    // Add stage object
    var stageImage = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, 'assets/summary-icon.jpg');
    instance.addMedia({
      id: "summaryImage",
      src: stageImage,
      assetId: "summaryImage",
      type: "image",
      preload: true
    });

    fabric.Image.fromURL(stageImage, function (img) {
      // var count = instance.config.total_items + '/' + instance.data.length;
      // var quizDetails = instance.getPropsForEditor(instance.config.title, count, instance.config.max_score);
      instance.editorObj = new fabric.Group([img]);
      instance.editorObj = img;
      instance.parent = _parent;
      instance.editorObj.scaleToWidth(props.w);
      instance.postInit();
    }, props);
  },
  addSummary: function(){
    ecEditor.dispatchEvent(this.manifest.id + ':create');
  }
});
//# sourceURL=summaryEditorPlugin.js
