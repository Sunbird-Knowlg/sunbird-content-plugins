Plugin.extend({
    _type: 'com.example.composite-text-image-shape',
    _render: false,
    _isContainer: true,
    initPlugin: function(data) { 
        
        var id = data.id;
        delete data.id;
        var pluginData = JSON.parse(data.data.__cdata);
        var config = JSON.parse(data.config.__cdata);
        console.log(data);
        var invShape = {type: 'rect', x: data.x, y: data.y, w: data.w, h: data.h, 'z-index': data['z-index'], id: id, fill: 'rgba(255,255,255,0)', stroke: 'rgb(7,7,7)', 'stroke-width': 1};
        var text = pluginData.text;
        var shape = pluginData.shape;
        var image = pluginData.image;
        text['z-index'] = data['z-index'];
        shape['z-index'] = data['z-index'];
        shape.fill = config.shape.color;
        shape.type = 'rect';
        image['z-index'] = data['z-index'];
        text.fontsize = config.text.fontSize;
        text.font = config.text.fontFamily;

        var children = {
            shape: [invShape, shape],
            text: text,
            image: image
        }
        console.log('children', children);
        this.invokeChildren(children, this._stage, this._stage, this._theme);
    }
});