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
        console.info(this, "this");
        if (!this.attributes.w) {
            this.attributes.w = this.attributes.h = 70;
        }
        this.percentToPixel(this.attributes);
        var props = this.convertToFabric(this.attributes),questionnaire = this.data.questionnaire,count = questionnaire.total_items;
        var templateIds = this.getTemplateIds(questionnaire.items);
        this.addMediatoManifest(this.getQuestionmedia(questionnaire.items));
        var templateArray = [],templates = [],resCount = 0,tempaltesLength = templateIds.length,instance = this;
        if (_.isUndefined(this.data.template)) {
            for (var index = 0; index < tempaltesLength; index++) {
                if (!_.isUndefined(templateIds[index])) {
                    EkstepEditor.assessmentService.getTemplate(templateIds[index], function(err, res) {
                        if (res) {
                            // TODO : need to refactor of this API Call it  should not be a count .
                            // map for the TemplateArray
                            // handling of the try and catch block
                            resCount = resCount + 1;
                            templateArray.push(instance.xml2json(res));
                            if (resCount == tempaltesLength) {
                                templateArray.forEach(function(element, index) {
                                    if (!_.isNull(element)) {
                                        templates.push(element.template);
                                        if (!_.isUndefined(element.manifest)) {
                                            instance.addMediatoManifest(element.manifest.media);
                                        }
                                    }
                                });
                                instance.data.template = templates;
                            }
                        } else {
                            console.error("Template Response is faild:", err);
                        }
                    });
                }
            }
        }
    this.editorObj = this.showProperties(props, questionnaire.title, count, questionnaire.max_score);
    },
    getTemplateIds: function(items) {
        var templateIds = [],question = [];
        for (var key in items) {
            question = items[key];
        }
        var questionLenght = question.length;
        for (var i = 0; i < questionLenght; i++) {
            templateIds.push(question[i].template_id);
        }
        return _.uniq(templateIds);
    },
    getQuestionmedia: function(items) {
        var media = [],question = [];
        for (var key in items) {
            question = items[key];
        }
        var questionLenght = question.length;
        for (var i = 0; i < questionLenght; i++) {
           return question[i].media;
        }
    },
    renderQuiz: function(event, assessmentData) {
        var instance = this,question = [];
        _.each(assessmentData.items, function(item) {
            if (!_.isUndefined(item.question)) {
                item.question = instance.parseObject(item.question);
            }
            question.push(item.question);
        });
        instance.setQuizdata(question, assessmentData.config);
    },
    setQuizdata: function(question, attributes) {
        var instance = this, questionSets = {}, configItem ={},controller = {},templates=[],templateObj={},_assessmentData={};
        questionSets[question[0].identifier] = question;
        configItem["items"] = questionSets;
        configItem["item_sets"] = [{"count": attributes.total_items,"id": question[0].identifier}];
        controller["questionnaire"] = Object.assign(configItem, attributes);
        var configData = {__cdata : JSON.stringify({"type": "items","var": "item"})};
        var dataObj = {__cdata : JSON.stringify(controller)};
        instance.setConfig({"type": "items","var": "item"});
        instance.setData(controller);
        _assessmentData["data"] = dataObj;
        _assessmentData["config"] = configData;
        EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', _assessmentData);
    },
    parseObject: function(item) {
        $.each(item, function(key, value) {
            if (key === 'options' || key === "lhs_options" || key === 'rhs_options' || key === 'model' || key === 'answer' || key === 'media') {
                item[key] = !_.isObject(item[key]) ? JSON.parse(item[key]) : item[key];
            }
        });
        return item;
    },
    addMediatoManifest: function(media) {
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
    xml2json: function(res) {
        var data, x2js = new X2JS({
            attributePrefix: 'none'
        });
        if (!_.isNull(res)) {
            data = x2js.xml_str2json(res.data.result.content.body);
            return data.theme;
        }
    },
    showProperties: function(props, qTittle, qCount, maxscore) {
        // Display the all properties on the editor
        props.fill = "#EDC06D";
        var rect = new fabric.Rect(props);
        qTittle = new fabric.Text(qTittle, {fontSize: 30, fill:'black',textAlign:'center',textDecoration:'underline', top: 80, left: 150} );
        qCount = new fabric.Text("QUESTIONS : " + qCount, {fontSize: 20,fill:'black',top: 120,left: 150});
        maxscore = new fabric.Text("TOTAL MARKS : "+maxscore, {fontSize: 20, fill:'black', top: 150,left: 150,});
        fabricGroup = new fabric.Group([rect, qTittle, qCount, maxscore], {left: 110, top: 50});
        return fabricGroup;
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
            var set = {items: items, config: config};
            EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':renderQuiz', set);
        };
        EkstepEditorAPI.dispatchEvent("org.ekstep.assessmentbrowser:show", callback);
    }
});
//# sourceURL=quizPlugin.js