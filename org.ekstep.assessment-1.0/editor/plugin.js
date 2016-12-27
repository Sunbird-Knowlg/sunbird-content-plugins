/**
 * 
 * plugin to add assessments to stage
 * @class assessment
 * @extends EkstepEditor.basePlugin
 * @author Kartheek Palla <kartheekp@ilimi.in>
 * @fires org.ekstep.assessmentbrowser:show
 * @fires org.ekstep.assessment:add 
 * @listens org.ekstep.image:assessment:showPopup
 */
EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof assessment
     */
    type: "quiz",
    /**
    *  
    * Registers events.
    * @memberof assessment
    */
    initialize: function() {
        EkstepEditorAPI.addEventListener(this.manifest.id + ":showPopup", this.openAssessmentBrowser, this);
    },
    
    // Add assesment to the stage
    newInstance: function() {
        var instance = this,attr = instance.attributes, ques = [],sets = {},ctrl = {},template ={};
        if (isNaN(attr.w)) {
            attr.w = attr.h = 70;
        }
        for (var i = 0; i < attr.length - 1; i++) {
            attr[i] = instance.cleanObject(attr[i]);
            ques.push(attr[i].question);
            instance.addMediatoManifest(attr[i].question.media);
            // TODO : Refactor of getting template code
            if (!_.isUndefined(attr[i].question.template_id)) {
                EkstepEditor.assessmentService.getTemplate(attr[i].question.template_id, function(err, res) {                    
                    template = instance.xmltojsonTempl(res);
                    console.info("Template Data:", template);
                    instance.addMediatoManifest(template.manifest.media);
                });
            }
        }
        instance.percentToPixel(attr);
        var props = instance.convertToFabric(attr),
        itemArray = attr.length -1, 
        count = attr[itemArray].total_items +"/" + itemArray,
        max_score = attr[itemArray].max_score,
        title = attr[itemArray].title;
        instance.editorObj = instance.showProperties(props,title, count, max_score);
        sets[attr[0].question.identifier] = ques;
        ctrl["items"] = sets;
        ctrl["item_sets"] = [{"count": attr[itemArray].total_items,"id": attr[0].question.identifier}];
        instance.setData(Object.assign(ctrl, attr[itemArray]));
        // TODO :setconfig should not be hard-coded
        instance.setConfig({"type": "items","var": "item"});
        delete instance.attributes;

    },
     // parsing of the items
    cleanObject: function(item) {
        if (!_.isUndefined(item.question.options)) {
            item.question.options = !_.isObject(item.question.options) ? JSON.parse(item.question.options) : item.question.options;
            return item;
        } else if (!_.isUndefined(item.question.lhs_options) && !_.isUndefined(item.question.rhs_options)) {
            item.question.lhs_options = !_.isObject(item.question.lhs_options) ? JSON.parse(item.question.lhs_options) : item.question.lhs_options;
            item.question.rhs_options = !_.isObject(item.question.rhs_options) ? JSON.parse(item.question.rhs_options) : item.question.rhs_options;
            return item;
        } else if (!_.isUndefined(item.question.model) && !_.isUndefined(item.question.answer)) {
            item.question.model = !_.isObject(item.question.model) ? JSON.parse(item.question.model) : item.question.model;
            item.question.answer = !_.isObject(item.question.answer) ? JSON.parse(item.question.answer) : item.question.answer;
            return item;
        } else {
            console.warn("Selected item is not valid",item);
            return item;
        }

    },
    // get media asset and add those asset to the manifest
    addMediatoManifest: function(arryAttr) {
        var asset, instance = this;
        if (!_.isUndefined(arryAttr)) {
           asset = !_.isObject(arryAttr) ? JSON.parse(arryAttr) : arryAttr;
            if (asset.length > 0) {
                asset.forEach(function(ele, index) {
                    if (!_.isNull(asset[index].id)) {
                        instance.addMedia(asset[index]);
                    }
                });
            }
        }
    },
    xmltojsonTempl : function(res){
         var data, x2js = new X2JS({attributePrefix: 'none'});
          if (!_.isNull(res)) {
                    data = x2js.xml_str2json(res.data.result.content.body);
                    return data.theme;
                }

    },
    /*Display of Maxscore and question count on the editor page */

    showProperties: function(props, title, count, max_score) {
        props.fill = "#EDC06D";
        var rect = new fabric.Rect(props),
        qTittle = new fabric.Text(title, {fontSize: 30, fill:'black',textAlign:'center',textDecoration:'underline', top: 80, left: 150} ),
        qCount = new fabric.Text("QUESTIONS : " + count, {fontSize: 20,fill:'black',top: 120,left: 150}),
        max_score = new fabric.Text("TOTAL MARKS : "+max_score, {fontSize: 20, fill:'black', top: 150,left: 150,}),
        fabricGroup = new fabric.Group([rect, qTittle, qCount, max_score], {left: 110, top: 50});
        return fabricGroup;
    },
    /**    
    *      
    * open assessment browser to get assessment data. 
    * @memberof assessment
    * 
    */
    openAssessmentBrowser: function(event, callback) {
        var instance = this,set = [];
        var callback = function(items, config) {
            items.push(config);
            set.push(items);
            EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', set);
        };
        EkstepEditorAPI.dispatchEvent("org.ekstep.assessmentbrowser:show", callback);
    }
});
//# sourceURL=assessmentplugin.js