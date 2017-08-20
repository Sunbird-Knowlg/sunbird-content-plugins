org.ekstep.contenteditor.basePlugin.extend({
    type: "org.ekstep.richtext",
    initialize: function() {
        var instance = this;
        ecEditor.addEventListener("org.ekstep.richtext:showpopup", this.loadHtml, this);
        ecEditor.addEventListener('stage:select', this.removeHtmlElements, this);
        ecEditor.addEventListener('stage:create', this.removeHtmlElements, this);
        ecEditor.addEventListener(instance.manifest.id + ":adddiv", this.addDivElement, this);
        var canvas = org.ekstep.contenteditor.api.getCanvas();
        canvas.on('object:scaling', this.resizeObject, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/richtexteditor.html");
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/richtexteditorapp.js");
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
        var divWrapper = document.createElement('div');
        divWrapper.setAttribute("id", 'richtext-wrapper');
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
        div.style.fontSize = '18px';
        div.style.fontFamily = 'NotoSans';
        div.style.width = "auto";
        div.style.height = "auto";
        div.style.pointerEvents = "none";
        ecEditor.jQuery(".canvas-container #richtext-wrapper").append(div);
        ecEditor.jQuery(".canvas-container #richtext-wrapper div#" + instance.data.id).html(instance.data.config.text);
        ecEditor.jQuery("#" + instance.data.id).offset({'top':instance.data.editorObj.top + canvasCord.top, 'left':Number(parseInt(ecEditor.jQuery(".canvas-container").css('margin-left'))) + (instance.data.editorObj.left + canvasCord.left)});
        ecEditor.jQuery("#" + instance.data.id).width(ecEditor.jQuery("#" + instance.data.id).width() + 5);
        // ecEditor.jQuery("div#"+this.id).draggable({
        //     containment: "canvas"
        // });
        instance.data.editorObj.width = $('#' + instance.data.id).width();
        instance.data.editorObj.height = $('#' + instance.data.id).height();
    },
    dblClickHandler: function(event) {
        if (ecEditor.getCurrentObject() && ecEditor.getCurrentObject().manifest.id === "org.ekstep.richtext") {
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
        var richtextDiv = org.ekstep.contenteditor.api.jQuery('#richtext-wrapper');
        richtextDiv.empty();
    },
    getConfig: function() {
        var config = this._super();
        config.color = ecEditor.jQuery('#' + this.id).css("color");
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
});
//# sourceURL=richtextplugin.js
