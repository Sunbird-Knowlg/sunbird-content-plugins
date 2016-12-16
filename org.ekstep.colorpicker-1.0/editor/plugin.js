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
     * @member {undefined|Array} picker
     * @memberof ColorPicker
     */
    picker: [],
    
    initialize: function() {
        EkstepEditorAPI.addEventListener("colorpicker:state", this.invoke, this);
        EkstepEditorAPI.addEventListener("colorpicker:update", this.updateColor, this);
    },
    /**
     * The method is used to initiate the colorpicker
     * it has the callback method which will be called on change of the color
     * @param  {Object} event
     * @param  {Object} data
     * @memberof ColorPicker 
     */
    invoke: function(event, data) {
        var instance = this;
        if (EkstepEditor.jQuery("#" + data.id).attr("colorpicker") != "added") {
           this.picker[data.id] = new jscolor(document.getElementById(data.id), {
                valueElement: null,
                onFineChange: function() {
                    data.callback(data.id, this.toHEXString())
                }
            });

            EkstepEditor.jQuery("#" + data.id).attr("colorpicker", "added");
        }
        if (data && data.color) {
            this.picker[data.id].fromString(data.color);
        } else {
            this.picker[data.id].fromString("#000000"); // default color will be black
        }
    }
});
//# sourceURL=colorpickerplugin.js
