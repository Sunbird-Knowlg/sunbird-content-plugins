org.ekstep.contenteditor.basePlugin.extend({

    type: "org.ekstep.questionset.preview",

    initialize: function() {
        var instance = this;
    },
    newInstance: function() {
        var instance = this;
    },
    getQuestionPreviwContent: function(questionSet) {
        var qAndMediaObj, questionMedia, pluginIds, pluginsUsed, pluginMedia;
        var story = {
            "theme": {
                "startStage": "splash",
                "id": "theme",
                "ver": 0.3,
                "stage": [{
                    "id": "splash",
                    "org.ekstep.questionset": {}
                }],
                "manifest": {
                    "media": []
                },
                "plugin-manifest": {}
            }
        };
        qAndMediaObj = this.getQuestionList(questionSet['org.ekstep.question']);
        story.theme.stage[0]['org.ekstep.questionset']['org.ekstep.question'] = qAndMediaObj["org.ekstep.question"];
        questionMedia = _.uniqBy(qAndMediaObj.media);
        pluginIds = _.uniqBy(qAndMediaObj.pluginIds);
        pluginsUsed = {};
        _.forEach(pluginIds, function(plugin) {
            pluginsUsed[plugin] = plugin;
        });
        pluginsUsed["org.ekstep.questionset"] = "org.ekstep.questionset";   //Adding Question set plugin into plugin-manifest

        ManifestGenerator.generate(pluginsUsed);
        pluginMedia = _.uniqBy(ManifestGenerator.getMediaManifest());
        if (questionMedia.length > 0) {
            story.theme.manifest.media.push(questionMedia);
        }
        if (pluginMedia.length > 0) {
            story.theme.manifest.media.push(pluginMedia);
        }

        story.theme['plugin-manifest'].plugin = ManifestGenerator.getPluginManifest();
        return story;
    },
    getQuestionList: function(data) {
        var object = {
            "org.ekstep.question": [],
            "media": [],
            "pluginIds": []
        };

        data.forEach(function(question) {
            var obj;
            obj = {
                "id": question.id,
                "pluginId": question.pluginId,
                "pluginVer": question.pluginVer,
                "templateId": question.templateId,
                "data": question.data,
                "config": question.config
            }
            object.pluginIds.push(question.pluginId);
            if (question.media) {
                object.media.push(question.media);
            }
            object["org.ekstep.question"].push(obj);
        });
        return object;
    }
});
//# sourceURL=questionsetpreview.js