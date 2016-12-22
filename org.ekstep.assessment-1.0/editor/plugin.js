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
        var instance = this,attr = instance.attributes, ques = [],sets = {},ctrl = {};
        if (isNaN(attr.x)) {
            attr.x = attr.y = 5;
            attr.w = attr.h = 90;
        }
        for (var i = 0; i < attr.length - 1; i++) {
            attr[i].question.options = JSON.parse(attr[i].question.options)
            ques.push(attr[i].question);
            instance.addMediatoManifest(attr[i].question.media);
        }
        instance.percentToPixel(attr);
        var props = instance.convertToFabric(attr);
        instance.editorObj = new fabric.Rect(props);

        // TODO : Refactring of the objects
        sets[attr[0].question.identifier] = ques;
        ctrl["items"] = sets;
        ctrl["item_sets"] = [{
            "count": attr[attr.length - 1].total_items,
            "id": attr[0].question.identifier
        }]
        instance.setData(Object.assign(ctrl, attr[attr.length - 1]));

        // TODO :setconfig should not be hard-coded
        instance.setConfig({
            "type": "items",
            "var": "item"
        });
        delete instance.attributes;

    },
    // get media asset and add those asset to the manifest
    addMediatoManifest: function(arryAttr) {
        var asset, instance = this;
        if (!_.isUndefined(arryAttr)) {
            asset = JSON.parse(arryAttr);
            if (asset.length > 0) {
                asset.forEach(function(ele, index) {
                    if (!_.isNull(asset[index].id)) {
                        instance.addMedia(asset[index]);
                    }
                });
            }
        }
    },
    /**    
    *      
    * open assessment browser to get assessment data. 
    * @memberof assessment
    * 
    */
    openAssessmentBrowser: function(event, callback) {
        var instance = this,data = [];
        var callback = function(items, config) {
            data.push(items);
            data[0].push(config);
            EkstepEditorAPI.dispatchEvent(instance.manifest.id + ':create', data);
        };
        EkstepEditorAPI.dispatchEvent("org.ekstep.assessmentbrowser:show", callback);
    }
});
//# sourceURL=assessmentplugin.js