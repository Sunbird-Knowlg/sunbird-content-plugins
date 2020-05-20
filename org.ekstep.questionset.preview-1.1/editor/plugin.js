/**
 *
 * Plugin to create question set Quiz and add it to stage.
 * @class questionset
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Jagadish Pujari <jagadish.pujari@tarento.com>
 */
org.ekstep.questionsetPreview = {};
org.ekstep.questionsetPreview.EditorPlugin = org.ekstep.contenteditor.basePlugin.extend({
  type: "org.ekstep.questionset.preview",
  initialize: function () {},
  newInstance: function () {},
  getQuestionPreviwContent: function (questionSet) {
    var qAndMediaObj, questionMedia, pluginIds, pluginsUsed, pluginMedia;
    var katexTemplate =  {"manifest":{"media":[{"id":"org.ekstep.mathfunction.renderer.katex_min_js","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/katex.min.js","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_min_css","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/katex.min.css","type":"css"},{"id":"org.ekstep.mathfunction.renderer.katex_main_bold","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_main-bold.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_main_bolditalic","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_main-bolditalic.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_main_italic","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_main-italic.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_main_regular","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_main-regular.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_math_bolditalic","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_math-bolditalic.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_math_italic","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_math-italic.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_math_regular","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_math-regular.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_size1_regular","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_size1-regular.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_size2_regular","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_size2-regular.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_size3_regular","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_size3-regular.ttf","type":"js"},{"id":"org.ekstep.mathfunction.renderer.katex_size4_regular","plugin":"org.ekstep.mathfunction","src":"/content-plugins/org.ekstep.mathfunction-1.0/renderer/libs/katex/fonts/katex_size4-regular.ttf","type":"js"}]},"pluginManifest":{"depends":"","id":"org.ekstep.mathfunction","type":"plugin","ver":"1.0"}};
    var story = {"theme":{"id":"theme","manifest":{"media":[]},"plugin-manifest":{},"stage":[{"h":100,"id":"splash","org.ekstep.questionset":{"h":85,"w":80,"x":9,"y":6},"w":100,"x":0,"y":0}],"startStage":"splash","ver":0.3}};
    qAndMediaObj = this.getQuestionList(questionSet['org.ekstep.question']);
    pluginsUsed = {};
    // check if selected questions are using Math formula
    var qsData = JSON.stringify(qAndMediaObj['org.ekstep.question']);
    /* istanbul ignore else */
    if(!((_.isEmpty(qsData.match(/data-math/g))) && (_.isEmpty(qsData.match(/math-text/g))))) {
      pluginsUsed["org.ekstep.mathfunction"] = "org.ekstep.mathfunction"; //Adding Question set plugin into plugin-manifest
      story.theme.manifest.media = katexTemplate.manifest.media;
    }
    _.each(qAndMediaObj['org.ekstep.question'], function (questionArray, v) {
      if (_.has(questionArray.data, "__cdata"))
        var qdata = JSON.parse(questionArray.data.__cdata);
      if (_.has(qdata, "mediamanifest")) {
        var questionMediaArr = qdata.mediamanifest.media;
        if (_.isArray(questionMediaArr)) {
          _.each(questionMediaArr, function (mediaItem, v) {
            story.theme['manifest'].media.push(mediaItem);
          })
        }
      }
    });
    story.theme.stage[0]['org.ekstep.questionset']['isQuestionPreview'] = true;
    story.theme.stage[0]['org.ekstep.questionset']['org.ekstep.question'] = qAndMediaObj["org.ekstep.question"];
    questionMedia = _.uniqBy(qAndMediaObj.media);
    pluginIds = _.uniqBy(qAndMediaObj.pluginIds);
    _.forEach(pluginIds, function (plugin) {
      pluginsUsed[plugin] = plugin;
    });
    pluginsUsed["org.ekstep.questionset"] = "org.ekstep.questionset"; //Adding Question set plugin into plugin-manifest
    ManifestGenerator.generate(pluginsUsed); // eslint-disable-line no-undef
    pluginMedia = _.uniqBy(ManifestGenerator.getMediaManifest()); // eslint-disable-line no-undef
    if (questionMedia.length > 0) {
      story.theme.manifest.media.concat(questionMedia);
    }
    if (pluginMedia.length > 0) {
      story.theme.manifest.media.concat(pluginMedia);
    }
    story.theme['plugin-manifest'].plugin = ManifestGenerator.getPluginManifest(); // eslint-disable-line no-undef
    return story;
  },
  getQuestionList: function (data) {
    var object = {
      "org.ekstep.question": [],
      "media": [],
      "pluginIds": []
    };
    data.forEach(function (question) {
      var obj;
      obj = {
        "id": question.id,
        "pluginId": question.pluginId,
        "pluginVer": question.pluginVer,
        "templateId": question.templateId,
        "data": question.data,
        "config": question.config,
        "w": "80",
        "x": "9",
        "h": "85",
        "y": "6"
      }
      object.pluginIds.push(question.pluginId);
      if (question.media) {
        object.media.push(question.media);
      }
      object["org.ekstep.question"].push(obj);
    });
    object.pluginIds.push('org.ekstep.navigation');
    return object;
  }
});
//# sourceURL=questionsetpreview.js