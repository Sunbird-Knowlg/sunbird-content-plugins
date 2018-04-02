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
                    "org.ekstep.questionset": {
                        "x": 9,
                        "y": 6,
                        "w": 80,
                        "h": 85
                    },
                    "x": 0,
                    "y": 0,
                    "w": 100,
                    "h": 100
                }],
                "manifest": {
                    "media": []
                },
                "plugin-manifest": {}
            }
        };
        qAndMediaObj = this.getQuestionList(questionSet['org.ekstep.question']);
        qAndMediaObj['org.ekstep.question'].forEach(function(questionArray) {
            if (_.has(questionArray.data, "__cdata"))
                var qdata = JSON.parse(questionArray.data.__cdata);
            if (_.has(qdata, "mediamanifest")) {
                var questionMediaArr = qdata.mediamanifest.media;
                if (_.isArray(questionMediaArr)) {
                    questionMediaArr.forEach(function(mediaItem) {
                        story.theme['manifest'].media.push(mediaItem);
                    })
                }
            }
        });
        story.theme.stage[0]['org.ekstep.questionset']['org.ekstep.question'] = qAndMediaObj["org.ekstep.question"];
        questionMedia = _.uniqBy(qAndMediaObj.media);
        pluginIds = _.uniqBy(qAndMediaObj.pluginIds);
        pluginsUsed = {};
        _.forEach(pluginIds, function(plugin) {
            pluginsUsed[plugin] = plugin;
        });
        pluginsUsed["org.ekstep.questionset"] = "org.ekstep.questionset"; //Adding Question set plugin into plugin-manifest

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