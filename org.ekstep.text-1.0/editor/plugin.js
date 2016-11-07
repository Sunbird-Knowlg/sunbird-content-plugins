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
    updateColor: function(color) {
        this.editorObj.fill = color;
        this.attributes.color = data;
    },
    toggleBold: function() {
        this.editorObj.setFontWeight(this.editorObj.getFontWeight() !== 'bold' ? 'bold' : 'normal');
        EkstepEditorAPI.updateContextMenu({ id: 'fontweight', selected: (this.editorObj.getFontWeight() === 'bold'), data: {} });
    },
    toggleItalic: function() {
        this.editorObj.setFontStyle(this.editorObj.getFontStyle() !== 'italic' ? 'italic' : 'normal');
        EkstepEditorAPI.updateContextMenu({ id: 'fontstyle', selected: (this.editorObj.getFontStyle() === 'italic'), data: {} });
    },
    updateStyle: function(style) {
        this.editorObj.setFontFamily(style);
        this.attributes.font = style;
    },
    updateSize: function(size) {
        this.editorObj.setFontSize(size);
        this.attributes.fontsize = size;
    },
    dblClickHandler: function() {
        textEditor.showEditor(EkstepEditorAPI.getEditorObject().id);
    },
    stageUnselect: function(data) {
        textEditor.hide();
    },
    updateAttributes: function() {
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
    },
    updateContextMenu: function (data, event) {
        EkstepEditorAPI.updateContextMenus([
            { id: 'colorpicker', state: 'HIDE', data: { color: EkstepEditorAPI.getEditorObject().getFill() } },
            { id: 'fontweight', state: 'HIDE', selected: (EkstepEditorAPI.getEditorObject().getFontWeight() === 'bold'), data: {} },
            { id: 'fontstyle', state: 'HIDE', selected: (EkstepEditorAPI.getEditorObject().getFontStyle() === 'italic'), data: {} },
            { id: 'fontfamily', state: 'HIDE', selected: true, data: { fontfamily: EkstepEditorAPI.getEditorObject().getFontFamily() } },
            { id: 'fontsize', state: 'HIDE', selected: true, data: { fontsize: EkstepEditorAPI.getEditorObject().getFontSize() } },
        ]);
    }
});
