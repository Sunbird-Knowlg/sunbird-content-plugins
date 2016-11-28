/**
 * The purpose of {@link ColorPicker} is used to add color to other plugin objects
 *
 * @class ColorPicker
 * @extends EkstepEditor.basePlugin
 *
 * @author Harishkumar Gangula <harishg@ilimi.in>
 */
EkstepEditor.basePlugin.extend({
    /**
     * This expains the type of the plugin 
     * @member {String} type
     * @memberof ColorPicker
     */
    type: "colorpicker",
    /**
     * This contains the life cycle  methods of colorpicker
     * @member {undefined|Object} picker
     * @memberof ColorPicker
     */
    picker: undefined,
    /**
     * The events are registred which are used to show, update and initialize the colorpicker
     * @memberof ColorPicker
     */
    initialize: function() {
        EkstepEditorAPI.addEventListener("colorpicker:show", this.showColorPicker, this);
        EkstepEditorAPI.addEventListener("colorpicker:state", this.invoke, this);
        EkstepEditorAPI.addEventListener("colorpicker:update", this.updateColor, this);
    },
    /**
     * The method is used to show the color palette
     * @memberof ColorPicker
     */
    showColorPicker: function() {
        this.picker.show();
    },
    /**
     * The method is used to initiate the colorpicker
     * it has the callback method which will be called on change of the color
     * @param  {Object} event
     * @param  {Object} data
     * @memberof ColorPicker 
     */
    invoke: function(event, data) {
        if (EkstepEditor.jQuery("#" + data.id).attr("colorpicker") != "added") {
            this.picker = new jscolor(document.getElementById(data.id), {
                valueElement: null,
                onFineChange: function() {
                    data.callback("color", this.toHEXString())
                }
            });
            EkstepEditor.jQuery("#" + data.id).attr("colorpicker", "added");
        }
        if (data && data.color) {
            this.picker.fromString(data.color);
        } else {
            this.picker.fromString("#000000"); // default color will be black
        }
    }
});
//# sourceURL=colorpickerplugin.js
