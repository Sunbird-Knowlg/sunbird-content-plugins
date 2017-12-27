/**
 * @class  org.ekstep.question.
 *@author Jagadish P <jagadish.pujari@tarento.com>
 */
org.ekstep.question.EditorPlugin = org.ekstep.contenteditor.basePlugin.extend({

    /**
     * @memberOf org.ekstep.plugins.EditorPlugin#
     */
    currentInstance: undefined,
    initialize: function() {  
        var instance = this;
        ecEditor.addEventListener("org.ekstep.question:showpopup", this.loadHtml, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/question.html');
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/question.js');
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
        
    },
    /**
     *  Process the create question plugin template and display everything as individual elements on the stage.
     *  @memberof org.ekstep.question.EditorPlugin#
     */
    newInstance: function() {
        delete this.configManifest;
        var instance = this;
        var _parent = this.parent;
        this.parent = undefined;
        currentInstance = this;
        /*istanbul ignore else*/
        if (!this.attributes.x) {
            this.attributes.x = 10;
            this.attributes.y = 10;
            this.attributes.w = 60;
            this.attributes.h = 60;
            this.percentToPixel(this.attributes);
        }
 
        var props = this.convertToFabric(this.attributes);
        delete props.width;
        delete props.height;
        var imageURL = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, 'assets/question.png');
        fabric.Image.fromURL(imageURL, function(img) {
            instance.editorObj = img;
            instance.parent = _parent;
            instance.editorObj.scaleToWidth(props.w);
            instance.postInit();
        }, props);
        currentInstance = this;
    },

    /**
     *  Open window to add question and options
     *  @memberof org.ekstep.question.EditorPlugin#
     */
    loadHtml: function() {
        var currentInstance = this;
        ecEditor.getService(ServiceConstants.POPUP_SERVICE).open({
            template: 'QuestionFormTemplate1',
            controller: 'QuestionFormController1',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    return currentInstance;
                }
            },
            width: 900,
            showClose: false,
        }, function() {
             if (!ecEditor._.isUndefined(currentInstance.editorObj)) {
                 //currentInstance.editorObj.remove();
                 ecEditor.render();
             }
         });
    },
    /**
      * This method overridden from org.ekstep.contenteditor.basePlugin and here we double click event is added
      */
     selected: function(instance) {
         currentInstance = ecEditor.getCurrentObject();
         fabric.util.addListener(fabric.document, 'dblclick', this.dblClickHandler);
     },
     /**
      * This method overridden from org.ekstep.contenteditor.basePlugin and here we double click event is removed
      */
     deselected: function(instance, options, event) {
         fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
     },
     /**
      * This method is called when the object:unselected event is fired
      * It will remove the double click event for the canvas
      */
     objectUnselected: function(event, data) {
         fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
     },
     /**
      * This method is callback for double click event which will call the textEditor to show the ediotor to add or modify text.
      */
     dblClickHandler: function(event) {
         var leftSt = ecEditor.jQuery("#canvas").offset().left + ecEditor.getCurrentObject().editorObj.left;
         var leftEnd = leftSt + ecEditor.getCurrentObject().editorObj.width;
         var topSt = ecEditor.jQuery("#canvas").offset().top + ecEditor.getCurrentObject().editorObj.top;
         var topEnd = topSt + ecEditor.getCurrentObject().editorObj.height;
         if (event.clientX > leftSt && event.clientX < leftEnd && event.clientY > topSt && event.clientY < topEnd) {
             currentInstance.loadHtml();
         }
     },

    getConfig: function() {
        var config = this._super();
        return config;
    }
});
//# sourceURL=questionEditorPlugin.js
 