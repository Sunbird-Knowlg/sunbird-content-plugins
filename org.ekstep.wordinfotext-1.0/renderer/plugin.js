Plugin.extend({
    _type: 'wordduniyatext',
    _isContainer: true,
    _render: true,
    _plginConfig: {},
    _plginData: {},
    _plginAttributes: {},
    initPlugin: function(data) {
        var instance = this;
        this._plginConfig = JSON.parse(data.config.__cdata);
        this._plginData = JSON.parse(data.data.__cdata);
        console.log('_plginData ', this._plginData)

        var wordsArr = data.words.split(',');//_.split(data.words, ',');
        var text = data.__text;
        var exp = data.w * (1920 / 100);
        var width = 720 * data.w / 100;
        var fontsize = parseInt(Math.round(data.fontsize * (width / exp)).toString());
        data.__text  = _.map(text.split(' '), function(word) {
            var index = _.indexOf(wordsArr, word)
            if (index != -1) {
                return "<a style='font-weight:bold; cursor:pointer; font-size:"+(parseInt(fontsize)+2)+"px; color:"+instance._plginConfig.wordfontcolor+"; background:"+instance._plginConfig.wordhighlightcolor+"; border-bottom: 1px solid "+instance._plginConfig.wordunderlinecolor+";' data-event='" + word + "_click'>" + word + "</a>";
            } else {
                return word;
            }
        }).join(' ');

        this._input = undefined;
        var dims = this.relativeDims();
        var div = document.getElementById(data.id);
        if (div) {
            jQuery("#" + data.id).remove();
        }
        div = document.createElement('div');
        if (data.style)
            div.setAttribute("style", data.style);
        div.id = data.id;
        div.style.fontSize = fontsize+ 'px';
        div.style.width = (dims.w + (wordsArr.length * 2)) + 'px';
        div.style.height = dims.h + 'px';
        div.style.position = 'absolute';
        div.style.fontFamily = data.font;
        div.style.fontWeight = this._plginConfig.fontweight ? "bold" : "normal";
        div.style.fontStyle = this._plginConfig.fontstyle ?  "italic" : "normal";
        div.style.color = data.color;

        var parentDiv = document.getElementById(Renderer.divIds.gameArea);
        parentDiv.insertBefore(div, parentDiv.childNodes[0]);

        jQuery("#" + data.id).append(data.__text);
        this._div = div;
        //this._self = new createjs.Container();
        this._self = new createjs.DOMElement(div);
        this._self.x = dims.x;
        this._self.y = dims.y;
        this.invokeController();
        this.invokeTemplate();
        //Invoke the embed plugin to start rendering the templates
        this.invokeEmbed(data);
        this.registerEvents(data.id);
        Renderer.update = true;
    },
    invokeController: function() {
        var controllerData = {};
        controllerData.__cdata = this._plginData.controller;
        controllerData.type = "data";
        controllerData.name = "dictionary";
        controllerData.id = "dictionary";
        this._theme.addController(controllerData);
    },
    invokeTemplate: function() {
        this._theme._templateMap[this._plginData.template.id] = this._plginData.template;
    },
    invokeEmbed: function(data){
        console.log('sadasd');
        var instance = this;
        var wordsArr = data.words.split(',');
        _.forEach(wordsArr, function(value, key) {
            var embedData = {};
            embedData["id"] = value+'_info';
            embedData["stroke"] = "white";
            embedData["template-name"] = instance._plginData.template.id;
            embedData["var-word"] = "dictionary."+value;
            embedData["z-index"] = 1000;
            embedData["visible"] = false;
            embedData["fill"] = 'grey';
            embedData["w"] = 10;
            embedData["h"] = 10;
            embedData["x"] = 10;
            embedData["y"] = 10;
            embedData["hitArea"] = true;
            PluginManager.invoke('shape', embedData, instance._stage, instance._stage, instance._theme);
        });
    },
    registerEvents: function(id) {
        var instance = this;
        jQuery('#'+id).children().each(function () {
            var data = jQuery(this).data();
            if (data && data.event) {
                jQuery(this).click(function(event) {
                    event.preventDefault();
                    instance._triggerEvent(data.event);
                    console.info("Triggered event ",data.event);
                });
            }
        });
    },
    _triggerEvent: function(event) {
        var plugin = PluginManager.getPluginObject(Renderer.theme._currentStage);
        event = new createjs.Event(event);
        if(plugin)
            plugin.dispatchEvent(event);
    }
});
//# sourceURL=wordactivityrenderer.js