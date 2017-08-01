org.ekstep.contenteditor.basePlugin.extend({
    type: "org.ekstep.richtext",
    initialize: function() {
        var instance = this;
        ecEditor.addEventListener("org.ekstep.richtext:showpopup", this.loadHtml, this);
        ecEditor.addEventListener('stage:select', this.removeHtmlElements, this);
        ecEditor.addEventListener(instance.manifest.id + ":adddiv", this.addDivElement, this);
        var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/richtexteditor.html");
        var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "editor/richtexteditorapp.js");
        ecEditor.getService('popup').loadNgModules(templatePath, controllerPath);
    },
    newInstance: function() {
        var instance = this;
        var props = this.convertToFabric(this.attributes);
        if (ecEditor._.isUndefined(this.config.text))
            this.config.text = ecEditor._.isUndefined(this.attributes.__text) ? "" : this.attributes.__text;
        delete props.__text;
        delete this.attributes.__text;

        this.editorObj = new fabric.Rect(props);
        if (this.editorObj) this.editorObj.setFill(props.fill);
        ecEditor.dispatchEvent(instance.manifest.id + ":adddiv", { data: instance });
    },
    moving: function(instance) {
        // ecEditor.jQuery("#" + this.editorObj.id).css("top", this.editorObj.top + 10);
        // ecEditor.jQuery("#" + this.editorObj.id).css("left", this.editorObj.left + 10);
        var canvasCord = ecEditor.jQuery('#canvas').offset();
        ecEditor.jQuery("#" + this.editorObj.id).offset({'top':this.editorObj.top + 10 + canvasCord.top, 'left':this.editorObj.left + 10 + canvasCord.left});
        ecEditor.jQuery("#" + this.editorObj.id).css("width", this.attributes.w);
        ecEditor.jQuery("#" + this.editorObj.id).css("height", this.attributes.h);
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
        var numOnly = /\d+/;
        var divWrapper = document.createElement('div');
        divWrapper.setAttribute("id", 'richtext-wrapper');
        ecEditor.jQuery(".canvas-container").append(divWrapper);
        var div = document.createElement('div');
        div.setAttribute("id", instance.data.id);
        div.style.position = 'absolute';
        div.style.fontSize = '18px';
        div.style.fontFamily = 'NotoSans';
        // div.style.top = (instance.data.editorObj.top + 10) + "px";
        // div.style.left = Number(ecEditor.jQuery(".canvas-container").css('margin-left').match(numOnly)[0]) + (instance.data.editorObj.left + 10) + "px";
        div.style.width = (instance.data.editorObj.width) + "px";
        div.style.height = (instance.data.editorObj.height) + "px";
        div.style.pointerEvents = "none";
        ecEditor.jQuery(".canvas-container #richtext-wrapper").append(div);
        ecEditor.jQuery(".canvas-container #richtext-wrapper div#" + instance.data.id).html(instance.data.config.text);
        ecEditor.jQuery("#" + instance.data.id).offset({'top':instance.data.editorObj.top + canvasCord.top + 10, 'left':Number(ecEditor.jQuery(".canvas-container").css('margin-left').match(numOnly)[0]) + (instance.data.editorObj.left + canvasCord.left) + 10});
        // ecEditor.jQuery("div#"+this.id).draggable({
        //     containment: "canvas"
        // });
    },
    dblClickHandler: function(event) {
        if (ecEditor.getCurrentObject().manifest.id === "org.ekstep.richtext") {
            ecEditor.dispatchEvent("org.ekstep.richtext:showpopup");
        }
    },
    loadHtml: function(event, data) {
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
            width: 500,
            showClose: false,
            className: 'ngdialog-theme-plain'
        });
    },
    render: function(canvas) {
        canvas.add(this.editorObj);
        ecEditor.dispatchEvent(this.manifest.id + ":adddiv", { data: this });
    },
    removeHtmlElements: function() {
        var richtextDiv = org.ekstep.contenteditor.api.jQuery('#richtext-wrapper');
        var childElements = richtextDiv.children();
        richtextDiv.empty();
    },
});
//# sourceURL=richtextplugin.js
