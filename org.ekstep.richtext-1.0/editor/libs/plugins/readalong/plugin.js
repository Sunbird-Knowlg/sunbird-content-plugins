CKEDITOR.plugins.add('readalong', {
	init: function(editor) {
		this.type = "org.ekstep.richtext";
		if (!org.ekstep.contenteditor.api.hasEventListener(this.type + ":readalong:show")) {
			org.ekstep.contenteditor.api.addEventListener(this.type + ":readalong:show", openReadAlongDialog, this);
		}
		
		if (!org.ekstep.contenteditor.api.hasEventListener(this.type + ":delete:enhancement")) {
			org.ekstep.contenteditor.api.addEventListener(this.type + ":delete:enhancement", deleteEnhancement, this);
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
					textObj = {'config': {}, 'attributes': {}, 'addMedia': {}};
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
			var object1 = {'config' : {}, 'attributes': {}, 'addMedia': function(){	}};
			var object = ecEditor.getCurrentObject() || object1;
			TextWYSIWYG.resetProperties(object);
			object.config.text = data.text;
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
	        object.addMedia(audioObj);
	        ecEditor.dispatchEvent('org.ekstep.richtext:addReadAlong', object);
	        //instance.data = object;
	        ecEditor.dispatchEvent("config:show");
	        ecEditor.render();
		}

		function deleteEnhancement() {
			ecEditor.getService('popup').open({
				template: 'deleteConfirmationDialog',
				controller: ['$scope', function($scope) {
					$scope.warningMessage = ecEditor.getCurrentObject().attributes.textType == 'readalong' ? 'Read-Along' : 'Word Info Popup';
					$scope.delete = function() {
						$scope.closeThisDialog();
						var textObj = ecEditor.getCurrentObject();
						if (textObj.attributes.textType == 'readalong') {
							delete textObj.config.audio;
							delete textObj.config.timings;
							delete textObj.config.highlight;
							delete textObj.config.audioObj;
							delete textObj.config.autoplay;
							delete textObj.attributes.autoplay;
						} else {
							delete textObj.data;
							delete textObj.config.words;
							delete textObj.config.wordfontcolor;
							delete textObj.config.wordhighlightcolor;
							delete textObj.config.wordunderlinecolor;
						}
						textObj.attributes.textType = "text";
						ecEditor.dispatchEvent("config:show");
						ecEditor.render();
					}
				}],
				width: 520,
				showClose: false
			});
		}
	}
});

//# sourceURL=readalong.js