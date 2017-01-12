/**
 * 
 * plugin to add assessments to stage
 * @class assessment
 * @extends EkstepEditor.basePlugin
 * @author Manju dr <manjunathd@ilimi.in>
 * @fires org.ekstep.assessmentbrowser:show
 * @fires org.ekstep.quiz:add 
 * @listens org.ekstep.image:assessment:showPopup
 */
EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof assessment
     */
    type: "org.ekstep.quiz",
    /**
     *  
     * Registers events.
     * @memberof assessment
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":showPopup", this.openAssessmentBrowser, this);
        EkstepEditorAPI.addEventListener(this.manifest.id + ":renderQuiz", this.renderQuiz, this);
    },
    newInstance: function() {
        var instance = this;
        // Removes unwanted config properties(visible,stroke etc.) for the quiz plugin
        delete instance.configManifest;
        instance.attributes.w = instance.attributes.h = 80;
        instance.attributes.x = 9;
        instance.attributes.y = 7;
        instance.percentToPixel(instance.attributes);
        var questionnaire = instance.data.questionnaire;
        var templateIds = instance.getItems(questionnaire.items, "templateId");
        instance.getItems(questionnaire.items, "media").forEach(function(element, index) {
            instance.addMediatoManifest(element);
        });
        var templateArray = [],
            templatesLength = templateIds.length;
        if (EkstepEditorAPI._.isUndefined(instance.data.template) || instance.data.template.length == 0) {
            for (var index in templateIds) {
                // get Template based on ID and push all templates response to arrray.
                EkstepEditor.assessmentService.getTemplate(templateIds[index], function(err, res) {
                    try {
                        if (res.status == 200) {
                            templateArray.push(instance.convert(res));
                        } else {
                            throw Error(err);
                        }
                    } catch (err) {
                        instance.showpopupMessage();
                        console.warn("Invalid Template",err);
                    }
                    instance.data.template = instance.getTemplateData(templateArray);
                });
            }
        }
        var _parent = this.parent;
        this.parent = undefined;
        var quizImage = EkstepEditor.config.absURL + "/content-plugins/org.ekstep.quiz-1.0/editor/assets/QuizImage.png";
        fabric.Image.fromURL(quizImage, function(img) {
            var count = questionnaire.total_items + '/' + instance.getItems(questionnaire.items);
            var quizDetails = instance.getPropsForEditor(questionnaire.title, count, questionnaire.max_score);
            instance.editorObj = new fabric.Group([img, quizDetails]);
            instance.parent = _parent;
            instance.postInit();
        }, instance.convertToFabric(instance.attributes));
    },
    getItems: function(items, type) {
        // it returns the Unique templateId || media of the questions || length of the question
        var question = [],
            media = [];
        for (var key in items) {
            question = items[key];
        }
        if (type === "templateId") {
            return _.uniq(_.filter(_.map(question, "template_id"), Boolean));
        } else if (type === 'media') {
            for (var i = 0; i < question.length; i++) {
                media.push(question[i].media);
            }
            return media;
        } else {
            return question.length;
        }
    },
    getTemplateData: function(templateArray) {
        // Iterate through the TemplateArray and return the templates
        var instance = this,
            templates = [];
        templateArray.forEach(function(element, index) {
            if (!_.isNull(element)) {
                _.isArray(element.template) ? $.merge(templates, element.template) : templates.push(element.template);
                if (!_.isUndefined(element.manifest)) {
                    instance.addMediatoManifest(element.manifest.media);
                }
            }
        });
        return templates.filter(Boolean);
    },
    renderQuiz: function(event, assessmentData) {
        // assessmentData is the object of config and items
        var instance = this,
            question = [];
        _.each(assessmentData.items, function(item) {
            if (!_.isUndefined(item.question)) {
                item.question = instance.parseItem(item.question);
            }
            question.push(item.question);
        });
        instance.setQuizdata(question, assessmentData.config);
    },
    showpopupMessage: function() {
        EkstepEditorAPI.getService('popup').open({
            showClose: false,
            template: EkstepEditor.config.absURL + "/content-plugins/org.ekstep.quiz-1.0/editor/warning.html"
        });
    },
    setQuizdata: function(question, config) {
        // This function will do construction of the questionary Object
        // config is the configrations of the controller(shuffle,totl_items,title etc.,)
        var instance = this,
            questionSets = {},
            _assessmentData = {},
            controller = { "questionnaire": {} };
        questionSets[question[0].identifier] = question;
        controller.questionnaire["items"] = questionSets;
        controller.questionnaire["item_sets"] = [{ "count": config.total_items, "id": question[0].identifier }]
        controller["questionnaire"] = Object.assign(controller.questionnaire, config);
        instance.setConfig({ "type": "items", "var": "item" });
        instance.setData(controller);
        _assessmentData["data"] = { __cdata: JSON.stringify(controller) };
        _assessmentData["config"] = { __cdata: JSON.stringify({ "type": "items", "var": "item" }) };
        EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', _assessmentData);
    },
    parseItem: function(item) {
        // this function is restricted to parse the few keys
        $.each(item, function(key, value) {
            if (key === 'options' || key === "lhs_options" || key === 'rhs_options' || key === 'model' || key === 'answer' || key === 'media') {
                item[key] = !_.isObject(item[key]) ? JSON.parse(item[key]) : item[key];
            }
        });
        return item;
    },
    addMediatoManifest: function(media) {
        /*it will add the all media to the manifest*/
        var instance = this;
        if (!_.isUndefined(media)) {
            if (_.isArray(media)) {
                media.forEach(function(ele, index) {
                    if (!_.isNull(media[index].id)) {
                        instance.addMedia(media[index]);
                    }
                });
            } else {
                instance.addMedia(media);
            }
        }
    },
    convert: function(res) {
        // It will verfies response is XML or JSON format and then returns the valid theme data
        var data, x2js = new X2JS({
            attributePrefix: 'none'
        });
        if (!_.isNull(res)) {
            // if res is json
            if (res.data.result.content.body.lastIndexOf('{', 0) === 0) {
                data = JSON.parse(res.data.result.content.body);
                return data.theme;
            } else {
                data = x2js.xml_str2json(res.data.result.content.body);
                return data.theme;
            }
        }

    },
    getPropsForEditor: function(qTittle, qCount, maxscore) {
        /* Display the all properties(title,count and maxscore) on the editor*/
        var instance = this;
        qTittle = new fabric.Text(qTittle.toUpperCase(), { fontSize: 15, fill: 'black', textAlign: 'center', top: 32, left: 105 });
        qCount = new fabric.Text(qCount + "  Questions,", { fontSize: 12, fill: 'black', top: 49, left: 105 });
        maxscore = new fabric.Text(maxscore + " Marks", { fontSize: 12, fill: 'black', top: 49, left: 190, });
        fabricGroup = new fabric.Group([qTittle, qCount, maxscore]);
        return fabricGroup;
    },
    onConfigChange: function(key, value) {
        /* TODO : value is updating to data object this will be removed later once quiz canvas renderer is got update
         presentely the quiz canvas rendere all config data is adding to data object so.*/

        if (!_.isUndefined(value)) {
            var ItemLenght = this.getItems(this.data.questionnaire.items);
            switch (key) {
                case 'title':
                    this.config.title = value;
                    this.data.questionnaire.title = value;
                    this.editorObj._objects[1]._objects[0].text = value.toUpperCase();
                    break;
                case 'total_items':
                    this.config.total_items = value;
                    this.data.questionnaire.total_items = value;
                    this.editorObj._objects[1]._objects[1].text = value + "/" + ItemLenght + "Questions,";
                    break;
                case 'max_score':
                    this.config.max_score = value;
                    this.data.questionnaire.max_score = value;
                    this.editorObj._objects[1]._objects[2].text = value + "Marks";
                    break;
                case 'shuffle':
                    this.config.shuffle = value;
                    this.data.questionnaire.shuffle = value;
                    break;
                case 'showImmediateFeedback':
                    this.config.showImmediateFeedback = value;
                    this.data.questionnaire.showImmediateFeedback = value;
                    break;
            }
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', {
            target: EkstepEditorAPI.getEditorObject()
        });
    },
    getConfig: function() {
        var config = this._super();
        config.shuffle = this.data.questionnaire.shuffle;
        config.total_items = this.data.questionnaire.total_items;
        config.showImmediateFeedback = this.data.questionnaire.showImmediateFeedback;
        config.max_score = this.data.questionnaire.max_score;
        config.title = this.data.questionnaire.title;
        return config;
    },
    /**    
     *      
     * open assessment browser to get assessment data. 
     * @memberof assessment
     * 
     */
    openAssessmentBrowser: function(event, callback) {
        var instance = this;
        var callback = function(items, config) {
            var assessmentData = { items: items, config: config };
            EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':renderQuiz', assessmentData);
        };
        EkstepEditorAPI.dispatchEvent("org.ekstep.assessmentbrowser:show", callback);
    }
});
//# sourceURL=quizPlugin.js
