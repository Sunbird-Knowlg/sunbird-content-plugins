org.ekstep.contenteditor.basePlugin.extend({
  /**
     * This expains the type of the plugin
     * @member {String} type
     * @memberof RichText
     */
    type: "org.ekstep.richtext",
    /**
     * Magic Number is used to calculate the from and to ECML conversion
     * It is the target value which is used for refrence in calculating text size in percentage
     * @member {Number} magicNumber
     * @memberof RichText
     */
    magicNumber: 1920,
    /**
     * Editor Width is used to calculate the from and to ECML conversion
     * @member {Number} editorWidth
     * @memberof RichText
     */
    editorWidth: 720,
    /**
     * Richtextid is used to append richtext wrapper inside html
     * @member {Sttring} richTextId
     * @memberof RichText
     */
    richTextId: 'richtext-wrapper',
    /**
     * The events are registred which are used which are used to add or remove fabric events and other custom events
     * @memberof RichText
     */
    initialize: function() {
        var instance = this;
        CKEDITOR.basePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/libs/");
        ecEditor.addEventListener(this.type + ":showpopup", this.loadHtml, this);
        ecEditor.addEventListener('stage:unselect', this.removeHtmlElements, this);
        ecEditor.addEventListener('stage:create', this.removeHtmlElements, this);
        ecEditor.addEventListener(instance.manifest.id + ":adddiv", this.addDivElement, this);
        var canvas = org.ekstep.contenteditor.api.getCanvas();
        canvas.on('object:scaling', this.resizeObject, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/richtexteditor.html");
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/richtexteditorapp.js");
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
        var divWrapper = document.createElement('div');
        divWrapper.setAttribute("id", this.richTextId);
        ecEditor.jQuery(".canvas-container").append(divWrapper);
    },
    newInstance: function() {
        var instance = this;
        this.configManifest = _.remove(this.configManifest, function(property) {
           return property.propertyName != "stroke";
        });                
        var props = this.convertToFabric(this.attributes);
        if (ecEditor._.isUndefined(this.config.text))
               this.config.text = ecEditor._.isUndefined(this.attributes.__text) ? "" : this.attributes.__text;
        delete props.__text;
        this.editorObj = new fabric.Rect(props);
        this.editorObj.visible = true;
        if (this.editorObj) this.editorObj.setFill(props.fill);
        ecEditor.dispatchEvent(instance.manifest.id + ":adddiv", { data: instance });
    },
    resizeObject: function(e) {
        if (ecEditor.getCurrentObject() && ecEditor.getCurrentObject().manifest.id == 'org.ekstep.richtext') {
               var canvasCord = ecEditor.jQuery('#canvas').offset();
               ecEditor.jQuery("#" + e.target.id).offset({
                     'top':e.target.top + canvasCord.top, 
                     'left':e.target.left + canvasCord.left
               });
               ecEditor.jQuery("#" + e.target.id).width(e.target.getWidth());
               ecEditor.jQuery("#" + e.target.id).height(e.target.getHeight());
        }
    },
    moving: function(instance) {
        var canvasCord = ecEditor.jQuery('#canvas').offset();
        ecEditor.jQuery("#" + this.editorObj.id).offset({
               'top':this.editorObj.top + canvasCord.top, 
               'left':this.editorObj.left + canvasCord.left
        });
    },
    selected: function(instance) {
        fabric.util.addListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    deselected: function(instance, options, event) {
        fabric.util.removeListener(fabric.document, 'dblclick', this.dblClickHandler);
    },
    removed: function(instance, options, event) {
        ecEditor.jQuery("div#" + instance.id).remove();
    },
    addDivElement: function(event, instance) {
        var canvasCord = ecEditor.jQuery('#canvas').offset();
        var div = document.createElement('div');
        div.setAttribute("id", instance.data.id);
        div.style.position = 'absolute';
        div.style.fontSize = '14px';
        div.style.fontFamily = 'NotoSans';
        div.style.width = instance.data.editorObj.width ? instance.data.editorObj.width + 1 + 'px' : "auto";
        div.style.height = instance.data.editorObj.height ? instance.data.editorObj.height + 1 + 'px' : "auto";
        div.style.pointerEvents = "none";
        ecEditor.jQuery(".canvas-container #" + this.richTextId).append(div);
        ecEditor.jQuery(".canvas-container #" + this.richTextId + " div#" + instance.data.id).html(instance.data.config.text);
        ecEditor.jQuery("#" + instance.data.id).offset({'top':instance.data.editorObj.top + canvasCord.top, 'left':Number(parseInt(ecEditor.jQuery(".canvas-container").css('margin-left'))) + (instance.data.editorObj.left + canvasCord.left)});
        var elemWidth = ecEditor.jQuery('#' + instance.data.id).width();
        var elemHeight = ecEditor.jQuery('#' + instance.data.id).height();
        ecEditor.jQuery("#" + instance.data.id).width(elemWidth);
        ecEditor.jQuery("#" + instance.data.id).height(elemHeight);
        instance.data.editorObj.width = elemWidth;
        instance.data.editorObj.height = elemHeight;
    },
    dblClickHandler: function(event) {
        // Checking if tagret element is canvas and richtext is selected then only open richtext popup
        if (event.target.tagName.toLowerCase() == 'canvas' && ecEditor.getCurrentObject() && ecEditor.getCurrentObject().manifest.id === 'org.ekstep.richtext') {
               ecEditor.dispatchEvent("org.ekstep.richtext:showpopup", {textSelected: true});
        }
    },
    loadHtml: function(event, eventData) {
      if (document.getElementsByClassName('richtextEditor_1').length > 0) {return}; // Dont open popup if already opened
      this.textSelected  = eventData ?  eventData.textSelected : false;
        currentInstance = this;
        ecEditor.getService('popup').open({
               template: 'richtexteditor',
               controller: 'richtexteditorcontroller',
               controllerAs: '$ctrl',
               resolve: {
                      'instance': function() {
                           return currentInstance;
                      }
               },
               data: {'textSelected':this.textSelected},
               width: 500,
               showClose: false,
               className: 'ngdialog-theme-plain richtextEditor_1'
        });
    },
    render: function(canvas) {
        canvas.add(this.editorObj);
        ecEditor.dispatchEvent(this.manifest.id + ":adddiv", { data: this });
    },
    removeHtmlElements: function() {
        var richtextDiv = org.ekstep.contenteditor.api.jQuery('#' + this.richTextId);
        richtextDiv.empty();
    },
     getAttributes: function() {
        var attributes = this._super();
        attributes.fontSize = this.updateFontSize(ecEditor.jQuery('#' + this.richTextId).css("font-size"), false);
        return attributes;
    },
    getConfig: function() {
        var config = this._super();
        // config.color = ecEditor.jQuery('#' + this.id).css("color");
        config.fontfamily = ecEditor.jQuery('#' + this.id).css("font-family");
        config.fontsize = ecEditor.jQuery('#' + this.id).css("font-size");
        config = _.omit(config, ["stroke", "strokeWidth"]);
        return config;
    },
    toECML: function() {        
        return _.omit(this._super(), ["__text"]);
    },
    onConfigChange: function(key, value) {
      var htmlContent = "";
        switch (key) {
            case "fontweight":
                  _.each(ecEditor.jQuery('#' + this.id).children(), function(child) {
                        child.innerHTML = "<strong>" + child.innerHTML + "</strong>";
                        htmlContent = htmlContent + child.outerHTML;
                  })
                  this.config.text = htmlContent;
                break;
            case "fontstyle":
                _.each(ecEditor.jQuery('#' + this.id).children(), function(child) {
                      child.innerHTML = "<em>" + child.innerHTML + "</em>";
                      htmlContent = htmlContent + child.outerHTML;
                  })
                  this.config.text = htmlContent;
                break;
            case "fontsize":
                // _.each(ecEditor.jQuery('#' + this.id).children(), function(child) {
                    // child.children.style.fontSize = child.children.style.fontSize + value;
                  // })
                break;
            case "align":
                _.each(ecEditor.jQuery('#' + this.id).children(), function(child) {
                    child.style.textAlign = value
                    htmlContent = htmlContent + child.outerHTML
                })
                this.config.text = htmlContent;
                break;
        }
        ecEditor.render();
        ecEditor.dispatchEvent('object:modified', { target: ecEditor.getEditorObject() });
    },
    /**
     * This method is used to convert font size when we are doing from or to conversion
     * @memberof RichText
     * @param {Number} initFontSize  This is font size need to be converted
     * @param {Boolean} The flag  It provides the flag on conversion to ecml or from ecml with values false, true
     * @return {Number} fontsize The fontsize is converted font size
     */
    updateFontSize: function(initFontSize, flag) {
      var fontsize,  exp, width = undefined;
        if (flag) { // from ECML conversion
            exp = this.attributes.w * (this.magicNumber / 100);
            width = this.editorWidth * this.attributes.w / 100;
            fontsize = parseInt(Math.round(initFontSize * (width / exp)).toString());
        } else { // to ECML conversion
          exp = (this.editorObj.width / this.magicNumber) * 100;
          width = (this.editorObj.width / this.editorWidth) * 100;
          fontsize = parseFloat((parseInt(initFontSize) * (width / exp)).toFixed(2));
        }
        return fontsize;
    }
});
//# sourceURL=richtextplugin.js
