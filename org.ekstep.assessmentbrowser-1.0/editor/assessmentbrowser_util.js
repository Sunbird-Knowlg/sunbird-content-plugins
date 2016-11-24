var assessmentBrowserUtil = (function() {
    function mergeMediaToPreloadStage(mediaToBeMerged, preloadStage) {
        mediaToBeMerged = window.EkstepAuthoringTool.createArray(mediaToBeMerged);
        var assetJson = {};
        var assetArray = [];
        _.forEach(mediaToBeMerged, function(media) {
            switch (media.type) {
                case "image":
                    assetArray = preloadStage.image;
                    break;
                case "sound":
                case "audio":
                    assetArray = preloadStage.audio;
                    break;
                case "voice":
                    assetArray = preloadStage.voice;
                    break;
            }
            if (media.id && _.findIndex(assetArray, function(m) {
                    return m.asset === media.id
                }) < 0) {
                assetJson = { "asset": media.id };
                assetArray.push(assetJson);
            }
        });
    }

    function getItemPreviewContent(templateJson, itemJson) {
        try {
            if (!templateJson) {
                throw "Template cannot be empty";
            }
            var itemAbsentError = "Both input item Json and template's sample item Json are empty";
            var mergeInputItem = true; //to decide whether to pick the input itemJson or merge the templateJson.controller

            if (!itemJson) {
                if (templateJson.theme.controller) {
                    if (!templateJson.theme.controller.__cdata) {
                        throw itemAbsentError;
                    } else {
                        mergeInputItem = false;
                    }
                } else {
                    throw itemAbsentError;
                }
            } else if (!itemJson.template) {
                throw "Item does not contain template";
            }

            var story = { "theme": { "manifest": { "media": [] }, "template": [], "controller": [{ "name": "sampleAssessment", "type": "items", "id": "sampleAssessment", "__cdata": {} }], "startStage": "sampleAssessmentStage", "id": "theme", "ver": 0.3, "stage": [{ "id": "baseStage1", "preload": true, "image": [], "audio": [], "voice": [] }, { "id": "sampleAssessmentStage", "x": 0, "y": 0, "w": 100, "h": 100, "g": [{ "embed": { "template": "item", "var-item": "item" }, "x": 10, "y": 0, "w": 80, "h": 90 }], "iterate": "sampleAssessment", "var": "item" }] } };
            story = templateMerge(story, templateJson.theme.template)

            if (mergeInputItem) {
                var __cdata = { "total_items": 1, "SET_TYPE": "MATERIALISED_SET", "SET_OBJECT_TYPE_KEY": "AssessmentItem", "item_sets": [{ "id": "sampleItemSet", "count": 1 }], "items": { "sampleItemSet": [] }, "identifier": "sampleItemSet" };
                __cdata.items.sampleItemSet.push(itemJson);
                if (itemJson.media) {
                    story = mediaMerge(story, itemJson.media);
                    mergeMediaToPreloadStage(itemJson.media, story.theme.stage[0]);
                }
            } else {
                var __cdata = (JSON.parse(templateJson.theme.controller.__cdata));
            }
            story.theme.controller[0].__cdata = __cdata;
            if (_.has(templateJson, 'theme.manifest') && templateJson.theme.manifest.media) {
                mergeMediaToPreloadStage(templateJson.theme.manifest.media, story.theme.stage[0]);
                story = mediaMerge(story, templateJson.theme.manifest.media);
            }

            return story;
        } catch (err) {
            return { "error": err };
        };
    }

    function mediaMerge(story, media) {
        media = window.EkstepAuthoringTool.createArray(media);
        var idIndex, srcIndex;
        var that = this;
        _.forEach(media, function(m) {
            if (m.id && m.src) {
                m = applyReverseProxyUrl(m, EkstepEditor.config.baseURL + '/assets/public/');
                srcIndex = _.findIndex(story.theme.manifest.media, function(sm) {
                    return sm.src === m.src;
                });
                idIndex = _.findIndex(story.theme.manifest.media, function(sm) {
                    return sm.id === m.id;
                });
                if (idIndex === -1) story.theme.manifest.media.push(m);
                if (idIndex !== -1 && srcIndex === -1) {
                    var newMedia = { "id": m.id, "src": m.src, "type": m.type };
                    if (m.assetId) newMedia.assetId = m.assetId;
                    story.theme.manifest.media[idIndex] = newMedia;
                }
            }
        });
        return story;
    }

    function templateMerge(story, template) {
        var templates = window.EkstepAuthoringTool.createArray(template);

        _.forEach(templates, function(t) {
            if (t && _.findIndex(story.theme.template, function(st) {
                    return st.id == t.id
                }) < 0) {
                story.theme.template.push(t);
            }
        });
        return story;
    }

    function applyReverseProxyUrl(media, reverseProxyUrl) {
        var op = /https?:\/\/ekstep-public.s3-ap-southeast-1.amazonaws.com\//g.exec(media.src);
        if (op) {
            media.src = media.src.replace(op[0], reverseProxyUrl);
        }
        return media;
    }
    return {
        getItemPreviewContent: getItemPreviewContent
    }
})();
