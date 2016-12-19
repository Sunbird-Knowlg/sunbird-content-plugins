EkstepEditor.basePlugin.extend({
    type: "grid",
    initialize: function() {
        var instance = this;
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":wordbrowser:open", this.openWordBrowser, this);
        EkstepEditorAPI.addEventListener(instance.manifest.id + ":aksharabrowser:open", this.openAksharaBrowser, this);
    },
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        var rows = props.rows;
        var columns = props.columns;
        var padding = 5;
        var gridWidth = (500 - (padding * (columns - 1))) / columns;
        var gridHeight = (300 - (padding * (rows - 1))) / rows;
        var rects = [];
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {
                var left = x * (gridWidth + padding) + 110;
                var top = y * (gridHeight + padding) + 52.5;
                var rect = new fabric.Rect({
                    id: UUID(),
                    left: left,
                    top: top,
                    fill: props.fill,
                    width: gridWidth,
                    height: gridHeight
                });
                rects.push(rect);
            }
        }

        this.editorObj = new fabric.Group(rects);
    },
     /**    
    *      
    * open word browser to get word data. 
    * @memberof akshara
    * 
    */
    openWordBrowser: function() {
        var instance = this;
        EkstepEditorAPI.dispatchEvent('org.ekstep.wordbrowser:show', {
            type: 'image',
            search_filter: {},
            callback : function(data) { this.onConfigChange('word', data) }
        });
    },

      /**    
    *      
    * open akshara browser to get akshara data. 
    * @memberof akshara
    * 
    */
    openAksharaBrowser: function() {
        var instance = this;
        EkstepEditorAPI.dispatchEvent('org.ekstep.aksharabrowser:show', {
            type: 'image',
            search_filter: {},
            callback : function(data) { this.onConfigChange('akshara', data) }
        });
    },
    onConfigChange: function(key, value) {
        var instance = this;
        switch (key) {
            case 'color':
                this.editorObj.setFill(value);
                this.attributes.fill = value;
                EkstepEditorAPI._.forEach(this.editorObj._objects, function(obj) {
                    obj.setFill(value)
                })
                break;
            case 'rows':
                this.attributes.rows = value;
                break;
            case 'columns':
                this.attributes.columns = value;
                break;
        }
        if(key === 'rows' || key === 'columns') {
            EkstepEditorAPI._.forEachRight(this.editorObj._objects, function(obj, index) {
                instance.editorObj.remove(obj)    
            })
            var padding = 5;
            var gridWidth = (500 - (padding * (instance.attributes.columns - 1))) / instance.attributes.columns;
            var gridHeight = (300 - (padding * (instance.attributes.rows - 1))) / instance.attributes.rows;
            var rects = [];
            for (var y = 0; y < instance.attributes.rows; y++) {
                for (var x = 0; x < instance.attributes.columns; x++) {
                    rects.push(new fabric.Rect({
                        left: x * (gridWidth + padding) + 110,
                        top: y * (gridHeight + padding) + 52.5,
                        fill: instance.attributes.fill,
                        width: gridWidth,
                        height: gridHeight
                    }));
                }
            }
            this.editorObj.initialize(rects);
        }
        EkstepEditorAPI.render();
    },
    getConfig: function() {
        var config = { color: this.attributes.fill };
        config.rows = this.attributes.rows;
        config.columns = this.attributes.columns;
        return config;
    }
});
//# sourceURL=aksharaplugin.js
