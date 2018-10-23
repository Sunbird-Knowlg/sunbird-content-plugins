CKEDITOR.plugins.add('wordinfo', {
    init: function(editor) {
        this.type = "org.ekstep.richtext";
        if (!org.ekstep.contenteditor.api.hasEventListener(this.type + ":wordinfo:show")) {
            org.ekstep.contenteditor.api.addEventListener(this.type + ":wordinfo:show", openWordInfoDialog, this);
        }
        var instance = this;
        editor.addCommand('wordinfo', {
            exec: function(editor) {
                org.ekstep.contenteditor.api.dispatchEvent(instance.type + ":wordinfo:show");
            }
        });
        if (editor.ui.addButton) {
            editor.ui.addButton('wordinfo', {
                label: 'Add Wordinfo',
                command: 'wordinfo',
                toolbar: 'align,40',
                icon: this.path + 'icons/wordinfo.png'
            });
        }
        function openWordInfoDialog(e) {
            //delete CKEDITOR.instances['editor1'];
            // CKEDITOR.instances['editor1'].setData(instance)
            // var manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.richtext");
            // CKEDITOR.replace( 'editor1', {
            //     customConfig: ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/libs/config.js"),
            //     skin: 'moono-lisa,'+CKEDITOR.basePath + "skins/moono-lisa/",
            //     contentsCss: ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/libs/contents.css"),
            // });
            // var textObj = ecEditor.getCurrentObject();
            // if(e.currentScope.ngDialogData && e.currentScope.ngDialogData.textSelected && textObj) {
            //     ctrl.selectedText = true;
            //     CKEDITOR.instances.editor1.setData(textObj.config.text);
            // }
            
            var instance = this;
            var text = CKEDITOR.instances.editor1.getData();
            if (text) {
                var textObj = ecEditor.getCurrentObject();
                if (!textObj || textObj.manifest.id != this.type) {
                    textObj = textObj;
                }
                textObj.config.text = CKEDITOR.instances.editor1.document.getBody().getText();
                ecEditor.dispatchEvent('org.ekstep.wordinfobrowser:showpopup', {
                    textObj: textObj,
                    callback: convertTexttoWordInfo
                });
            } else {
                console.warn("Please add text first");
            }
        }

        function convertTexttoWordInfo(data, templateData) {
            // var textObj =  {'config' : {}, 'attributes': {}};
            // textObj.config.text = data.text;
            // textObj.config.words = data.words;
            // textObj.config.wordfontcolor = data.wordfontcolor;
            // textObj.config.wordhighlightcolor = data.wordhighlightcolor;
            // textObj.config.wordunderlinecolor = data.wordunderlinecolor;
            // textObj.attributes.textType = 'wordinfo';
            // instance.data = textObj;
            // ecEditor.dispatchEvent("config:show");
            // ecEditor.render();

            var textObj = ecEditor.getCurrentObject();
            var instance = ecEditor.getPluginInstance(textObj.id);
            TextWYSIWYG.resetProperties(textObj); // This will reset all WYSIWYG properties of text instance for WordInfo.
            textObj.data = templateData;
            textObj.config.text = textObj.editorObj.text = data.text;
            textObj.config.words = data.words;
            textObj.config.wordfontcolor = data.wordfontcolor;
            textObj.config.wordhighlightcolor = data.wordhighlightcolor;
            textObj.config.wordunderlinecolor = data.wordunderlinecolor;
            textObj.attributes.textType = 'wordinfo';
            textObj.addMedia({
                "id": "org.ekstep.text.popuptint",
                "src": ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/popuptint.png"),
                "type": "image",
                "assetId": "org.ekstep.text.popuptint"
            });
            ecEditor.dispatchEvent('org.ekstep.text:addWordInfo', textObj);
            //instance.addWordinfoconfigManifest(textObj);
            ecEditor.dispatchEvent("config:show");
            ecEditor.render();
        }
    }
});

//# sourceURL=wordinfo.js