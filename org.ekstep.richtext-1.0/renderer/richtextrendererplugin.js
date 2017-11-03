Plugin.extend({
    _type: 'org.ekstep.richtext',
    _isContainer: true,
    _render: true,
    _plginConfig: {},
    _plginData: {},
    _plginAttributes: {},
    initPlugin: function(data) {
        var instance = this;
        this._plginConfig = JSON.parse(data.config.__cdata);
        if(!_.isUndefined(data.data))
            this._plginData = JSON.parse(data.data.__cdata);
        
        var pid = data._id || data.id;
        if(data.id) {
            data._id = pid;    
            delete data.id;
        }
        this.id = _.uniqueId('org.ekstep.richtext');
        var parentDims = EkstepRendererAPI.getCanvas();
        var additionalWidth = 5 * 100 / parentDims.width;
        var additionalHeight = 5 * 100 / parentDims.height;
        data.w = data.w + additionalWidth;
        data.h = data.h + additionalHeight;
        this._data = data;
        var data = _.clone(this._data);
        data.id = pid;
        data.__text = _.isUndefined(this._plginConfig.text) ? data.__text : this._plginConfig.text;
        switch (data.textType) {
            case 'readalong':
                data.lineHeight = 1.3;
                data.fontsize = data.fontSize;
                data.timings = this._plginConfig.timings;
                data.audio = this._plginConfig.audio;
                data.highlight = this._plginConfig.highlight;
                data.classList = "richText";
                var event = { 'type':'click', 'action' : {'type':'command', 'command' : 'togglePlay' , 'asset': data.id}};
                if(_.isUndefined(data.event)){
                    data.event = event;
                }else{
                  if(_.isArray(data.event)) data.event.push(event)
                  else data.event = [event];                  
                }
                PluginManager.invoke('htext', data, instance._parent, instance._stage, instance._theme);
                break;
            case 'wordinfo':
                console.log("wordInfo")
                break;
            default:
                var dims = this.relativeDims();
                var div = document.getElementById(data.id);
                if (div) {
                    jQuery("#" + data.id).remove();
                }
                div = document.createElement('div');
                if (data.style)
                    div.setAttribute("style", data.style);
                div.id = data.id;
                div.classList.add('richText');
                div.style.width = dims.w + 'px';
                div.style.height = dims.h + 'px';
                div.style.position = 'absolute';
                var fontSize = this.updateFontSize(parseFloat(data.fontSize));
                div.style.fontSize = fontSize + 'px';
                // div.style.fontFamily = data.font;
                // div.style.fontWeight = this._plginConfig.fontweight ? "bold" : "normal";
                // div.style.fontStyle = this._plginConfig.fontstyle ?  "italic" : "normal";
                div.style.color = data.color;
                div.style.textAlign = data.align;

                var parentDiv = document.getElementById(Renderer.divIds.gameArea);
                parentDiv.insertBefore(div, parentDiv.childNodes[0]);

                jQuery("#" + data.id).html(data.__text);
                this._div = div;
                this._self = new createjs.DOMElement(div);
                this._self.x = dims.x;
                this._self.y = dims.y;
                break;
        }
    },
    updateFontSize: function(initFontSize) {
        // Convert fontSize to pixel based on device dimensions
        var exp = parseFloat(PluginManager.defaultResWidth * this.relativeDims().w / 100);
        var cw = this._parent.dimensions().w;
        var width = parseFloat(cw * this.relativeDims().w / 100);
        var scale = parseFloat(width / exp);
        fontsize = parseFloat(initFontSize * scale);
        return fontsize;
    }
});
//# sourceURL=newtextrenderer.js