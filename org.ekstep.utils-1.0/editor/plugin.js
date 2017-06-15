/**
 * 
 * plugin to add utilities to other plugins
 * @class Utils
 * @extends org.ekstep.contenteditor.basePlugin
 *
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 * @listens copy:copyItem
 * @listens copy:copyItem
 * @listens reorder:sendtofront
 * @listens reorder:sendtoback
 * @listens delete:invoke
 * @listens object:selected
 * @listens object:unselected
 * 
 */
org.ekstep.contenteditor.basePlugin.extend({
    type: "utils",
    picker: undefined,
    /**
     *   @member clipboard {Object}  
     *   @memberof Utils
     *   
     */
    clipboard: undefined,
    initialize: function() {
        var instance = this;

        ecEditor.addEventListener("reorder:sendtofront", this.sendToFront, this);
        ecEditor.addEventListener("reorder:sendtoback", this.sendToBack, this);
        ecEditor.addEventListener('copy:copyItem', this.copyItem, this);
        ecEditor.addEventListener('paste:pasteItem', this.pasteItem, this);
        ecEditor.addEventListener("delete:invoke", this.deleteObject, this);
        ecEditor.addEventListener("object:selected", this.objectSelected, this);
        ecEditor.addEventListener("object:unselected", this.objectUnSelected, this);

        ecEditor.registerKeyboardCommand('mod+c', function() {
            instance.copyItem();
        });
        ecEditor.registerKeyboardCommand('mod+v', function() {
            instance.pasteItem();
        });
        ecEditor.registerKeyboardCommand(['del', 'backspace'], function() {
            console.log("Delete or backspace key pressed");
            instance.deleteObject();
        });

        // Changes
        ecEditor.registerKeyboardCommand('ctrl+m', function(event) {
            event.preventDefault();
            ecEditor.dispatchEvent('stage:create', {position:"afterCurrent"});
        });

        ecEditor.registerKeyboardCommand('mod+d', function(event) {
            event.preventDefault();
            ecEditor.dispatchEvent('stage:duplicate', {stageId: org.ekstep.contenteditor.api.getCurrentStage().id});
        });

        // ecEditor.registerKeyboardCommand('mod+x', function(event) {
        //     event.preventDefault();
        //     instance.copyItem();
        //     instance.deleteObject();
        // });

        ecEditor.registerKeyboardCommand('mod+a', function(event) {
            event.preventDefault();
            var canvas = org.ekstep.contenteditor.api.getCanvas();
            var elements = canvas.getObjects().map(function(elem) {
                return elem.set('active', true);
            });
            var group = new fabric.Group(elements, {
                originX: 'center', 
                originY: 'center'
            });
            canvas._activeObject = null;
            canvas.setActiveGroup(group.setCoords()).renderAll();
        });

        ecEditor.registerKeyboardCommand('mod+s', function(event) {
            event.preventDefault();
            ecEditor.dispatchEvent('org.ekstep.ceheader:save');
        });

        ecEditor.registerKeyboardCommand('ctrl+/', function(event) {
            event.preventDefault();
            // console.log("ctrl & / pressed")
            // instance.addStage();
        });
        // Get all stages api is commented
        ecEditor.registerKeyboardCommand('home', function(event) {
            event.preventDefault();
            ecEditor.dispatchEvent('stage:select', {prevStageId:org.ekstep.contenteditor.api.getCurrentStage().id,stageId:org.ekstep.contenteditor.api.getAllStages()[0].id});
        });

        ecEditor.registerKeyboardCommand('end', function(event) {
            event.preventDefault();
            ecEditor.dispatchEvent('stage:select', {prevStageId:org.ekstep.contenteditor.api.getCurrentStage().id,stageId:org.ekstep.contenteditor.stageManager.stages[org.ekstep.contenteditor.stageManager.stages.length-1].id});
        });

        ecEditor.registerKeyboardCommand('mod+b', function(event) {
            event.preventDefault();
            var elem = org.ekstep.contenteditor.api.getCurrentObject();
            if (elem) {
                elem.onConfigChange('fontweight', 'bold');
            }
        });

        ecEditor.registerKeyboardCommand('mod+i', function(event) {
            event.preventDefault();
            var elem = org.ekstep.contenteditor.api.getCurrentObject();
            if (elem) {
                elem.onConfigChange('fontstyle', 'italic');
            }
        });

        // '>' key is a shift component which is not supported on mousetrap.
        // To use that we have to use '.' key
        ecEditor.registerKeyboardCommand('mod+shift+.', function(event) {
            event.preventDefault();
            var elem = org.ekstep.contenteditor.api.getCurrentObject();
            if (elem) {
                var fontSize = elem.getConfig().fontsize;
                elem.onConfigChange('fontsize', fontSize+1);
            }
        });

        ecEditor.registerKeyboardCommand('mod+shift+,', function(event) {
            event.preventDefault();
            var elem = org.ekstep.contenteditor.api.getCurrentObject();
            if (elem) {
                var fontSize = elem.getConfig().fontsize;
                elem.onConfigChange('fontsize', fontSize-1);
            }
        });

        ecEditor.registerKeyboardCommand('mod+shift+l', function(event) {
            event.preventDefault();
            var elem = org.ekstep.contenteditor.api.getCurrentObject();
            if (elem) {
                elem.onConfigChange('align', 'left');
            }
        });

        ecEditor.registerKeyboardCommand('mod+shift+r', function(event) {
            event.preventDefault();
            var elem = org.ekstep.contenteditor.api.getCurrentObject();
            if (elem) {
                elem.onConfigChange('align', 'right');
            }
        });

        // Conflicting with view ecml shortcut
        // ecEditor.registerKeyboardCommand('mod+shift+e', function(event) {
        //     event.preventDefault();
        //     var elem = org.ekstep.contenteditor.api.getCurrentObject();
        //     if (elem) {
        //         elem.onConfigChange('align', 'center');
        //     }
        // });

        ecEditor.registerKeyboardCommand('mod+down', function(event) {
            event.preventDefault();
            ecEditor.dispatchEvent('reorder:sendtoback');
        });

        ecEditor.registerKeyboardCommand('mod+up', function(event) {
            event.preventDefault();
            ecEditor.dispatchEvent('reorder:sendtofront');
        });

    },

    /**
     *
     *   send the object to one step front in the canvas
     *   fires the object:modified event to update stage and renders
     *   @memberof Utils
     */
    sendToFront: function(event, data) {
        ecEditor.getCanvas().bringForward(ecEditor.getEditorObject());        
        ecEditor.render();        
        ecEditor.dispatchEvent('object:modified', {id: ecEditor.getEditorObject().id});
    },
    /**
     *
     *   send the object to one step back in the canvas
     *   fires the object:modified event to update stage and renders
     *   @memberof Utils
     */
    sendToBack: function(event, data) {
        ecEditor.getCanvas().sendBackwards(ecEditor.getEditorObject());        
        ecEditor.render();
        ecEditor.dispatchEvent('object:modified', {id: ecEditor.getEditorObject().id});
    },
    /**
     *
     *   get current active plugin instance from stage to copy
     *   update context menu to show paste icon
     *   @memberof Utils
     */
    copyItem: function() {
        this.clipboard = ecEditor.getCurrentObject() ? ecEditor.getCurrentObject() : ecEditor.getCurrentGroup();
        if(this.clipboard) {
            ecEditor.updateContextMenu({ id: 'paste', state: 'SHOW', data: {} });
        }
    },
    /**
     *
     *   get copied plugin instance from clipboard and instantiate.
     *   update context menu to hide paste icon
     *   @memberof Utils
     */
    pasteItem: function() {
        if(this.clipboard) {
            if (_.isArray(this.clipboard)) {
                ecEditor.getCanvas().discardActiveGroup();
                this.clipboard.forEach(function(instance){
                    ecEditor.cloneInstance(instance);
                });
            }
            else ecEditor.cloneInstance(this.clipboard);
            this.clipboard = undefined;
            ecEditor.updateContextMenu({ id: 'paste', state: 'HIDE', data: {} });
        }
    },
    /**
     *
     *   deletes the object or group from the canvas 
     *   invokes remove method
     *   @memberof Utils
     */
    deleteObject: function(event, data) {
        var activeGroup = ecEditor.getEditorGroup(), activeObject = ecEditor.getEditorObject(), id, instance = this;

        if (activeObject) {
            instance.remove(activeObject);
        } else if (activeGroup) {
            ecEditor.getCanvas().discardActiveGroup();
            activeGroup.getObjects().forEach(function(object) {
                instance.remove(object);
            });
        }
    },
    /**
     *
     *   it is invoked on object delete
     *   @memberof Utils
     */
    remove: function(object) {
        ecEditor.dispatchEvent('delete:invoked', { 'editorObj': ecEditor.getPluginInstance(object.id).attributes });
        ecEditor.getCanvas().remove(object);
        ecEditor.dispatchEvent('stage:modified', { id: object.id });
    },
    /**
     *
     *   on selection of the object it is invoked and updates the context menu
     *   @memberof Utils
     */
    objectSelected: function(event, data) {
        ecEditor.updateContextMenus([{ id: 'reorder', state: 'SHOW', data: {}}, 
                                            { id: 'copy', state: 'SHOW', data: {} },
                                            { id: 'delete', state: 'SHOW', data: {} }]);
    },
    /**
     *
     *   on Unselection of the object it is invoked and updates the context menu
     *   @memberof Utils
     */
    objectUnSelected: function(event, data) {
        ecEditor.updateContextMenus([{ id: 'reorder', state: 'HIDE', data: {}},
                                            { id: 'copy', state: 'HIDE', data: {} },
                                            { id: 'delete', state: 'HIDE', data: {} }]);
    }
});
//# sourceURL=utilsplugin.js