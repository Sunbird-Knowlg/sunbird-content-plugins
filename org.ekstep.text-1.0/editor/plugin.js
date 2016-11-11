EkstepEditor.basePlugin.extend({
    type: "text",
    initialize: function() {
        EkstepEditorAPI.addEventListener("text:showTextBox", this.showTextBox, this);
        EkstepEditorAPI.addEventListener("object:unselected", this.objectUnselected, this);
        EkstepEditorAPI.addEventListener("stage:unselect", this.stageUnselect, this);
    },
    newInstance: function(data) {
        if (data && data.props) {
            this.editorObj = new fabric.ITextbox(data.props.text, data.props);
        }
        this.data = undefined;
    },
    showTextBox: function(event, data) {
        this.create({ type: 'text', props: data });
        textEditor.showEditor(EkstepEditorAPI.getEditorObject().id);
    },
    selected: function(instance) {
        fabric.util.addListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    deselected: function(instance, options, event) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    objectUnselected: function(event, data) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    dblClickHandler: function() {
        textEditor.showEditor(EkstepEditorAPI.getEditorObject().id);
    },
    stageUnselect: function(data) {
        textEditor.hide();
    },
    getAttributes: function() {
        var instance = this;
        var dataList = {
            "__text": "text",
            "opacity": "opacity",
            "scaleX": "scaleX",
            "scaleY": "scaleY",
            "align": "textAlign",
            "valign": "vAlign"
        };
        if (this) {
            _.forEach(dataList, function(val, key) {
                instance.attributes[key] = instance.editorObj.get(val);
            })
            var fontWeight = _.isUndefined(this.editorObj.get("fontWeight")) ? "" : this.editorObj.get("fontWeight");
            var fontStyle = _.isUndefined(this.editorObj.get("fontStyle")) ? "" : this.editorObj.get("fontStyle");
            this.attributes.weight = (fontWeight + ' ' + fontStyle).trim();
            this.attributes.type = "text";
        }
        return this.attributes;
    },
    resetConfig: function(data) {
        var instance = this;
        this.config = this.config || {};
        _.forEach(data, function(val) {
            switch (val) {
                case "fontweight":
                    instance.config.fontweight = (instance.editorObj.getFontWeight() === "bold");
                    instance.editorObj.setFontWeight(instance.config.fontweight ? 'normal' : 'bold');
                    break;
                case "fontstyle":
                    instance.config.fontstyle = (instance.editorObj.getFontStyle() === "italic");
                    instance.editorObj.setFontStyle(instance.config.fontstyle ? 'normal' : 'italic');
                    break;
                case "fontfamily":
                    instance.config.fontfamily = EkstepEditor.jQuery("#fontfamily").val().split(":")[1];
                    instance.editorObj.setFontFamily(instance.config.fontfamily);
                    break;
                case "fontsize":
                    instance.config.fontsize = EkstepEditor.jQuery("#fontsize").val().split(":")[1];
                    instance.editorObj.setFontSize(instance.config.fontsize);
                    break;
                default:

                    break;
            }
        });
        EkstepEditor.jQuery("#fontweight").toggleClass("btn-primary", (this.editorObj.getFontWeight() === "bold"));
        EkstepEditor.jQuery("#fontstyle").toggleClass("btn-primary", (this.editorObj.getFontStyle() === "italic"));
        EkstepEditor.jQuery("#fontfamily").val("string:" + this.editorObj.getFontFamily());
        EkstepEditor.jQuery("#fontsize").val("number:" + this.editorObj.getFontSize());
        EkstepEditorAPI.dispatchEvent("colorpicker:state", { id: "colorpicker" });
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    }
});
