CKEDITOR.plugins.add('readalong', {
	init: function(editor) {
		this.type = "org.ekstep.richtext";
		if (!org.ekstep.contenteditor.api.hasEventListener(this.type + ":readalong:show")) {
			org.ekstep.contenteditor.api.addEventListener(this.type + ":readalong:show", openReadAlongDialog, this);
		}
		var instance = this;
		editor.addCommand('readalong', {
            exec: function(editor) {
                org.ekstep.contenteditor.api.dispatchEvent(instance.type + ":readalong:show");
            }
        });
        if (editor.ui.addButton) {
			editor.ui.addButton('readalong', {
	    		label: 'Add ReadAlong',
	    		command: 'readalong',
	    		toolbar: 'align,40',
	    		icon: this.path + 'icons/icon.png'
			});
		}
		function openReadAlongDialog(e) {
			var instance = this;
			var text = CKEDITOR.instances.editor1.getData();
			if (text) {
				var textObj = _.cloneDeep(ecEditor.getCurrentObject());
				if (!textObj || textObj.manifest.id != this.type) {
					textObj = {'config': {}, 'attributes': {}};
				}
	        	textObj.config.text = CKEDITOR.instances.editor1.document.getBody().getText();
		        ecEditor.dispatchEvent('org.ekstep.readalongbrowser:showpopup', {
		            textObj: textObj,
		            callback: convertTexttoReadalong
		        });
		    } else {
		    	console.warn("Please add text first");
		    }
		}

		function convertTexttoReadalong(data) {
	        var object = {'config' : {}, 'attributes': {}};
	        object.config.audio = data.audio;
	        object.config.timings = data.timings;
	        object.config.highlight = data.highlight;
	        object.config.audioObj = data.audioObj;
	        object.config.autoplay = data.autoplay;
	        object.attributes.autoplay = data.autoplay;
	        object.attributes.textType = 'readalong';
	        //textObj.manifest.editor.playable = true;
	        textEditor.hide();
	        var audioObj = data.audioObj;
	        if (!ecEditor._.isUndefined(audioObj))
	            audioObj.src = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(audioObj.src);
	        this.addMedia(audioObj);
	        // ecEditor.dispatchEvent('org.ekstep.richtext:addReadAlong', object);
	        instance.data = object;
	        ecEditor.dispatchEvent("config:show");
	        ecEditor.render();
		}
	}
});

//# sourceURL=readalong.js