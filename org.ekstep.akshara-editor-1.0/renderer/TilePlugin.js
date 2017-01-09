Plugin.extend({
    _type: 'tile',
    _isContainer: false,
    _render: false,
    _index: -1,
    _model: undefined,
    _value: undefined,
    _answer: undefined,
    _multiple: false,
    _mapedTo: undefined,
    _uniqueId: undefined,
    _isText: false,
    _isImage: false,
    _isAudio: false,
    initPlugin: function(data) {
        this._model = undefined;
        this._value = undefined;
        this._answer = undefined;
        this._index = -1;
        this._uniqueId = _.uniqueId('opt_');
        var model = data.option;
        var value = undefined;
        if (model) {
            value= model;
        }
        if (value) {  
            this._self = new createjs.Container();
            var dims = this.relativeDims();
            this._self.x = dims.x;
            this._self.y = dims.y;
            this._self.origX = dims.x;
            this._self.origY = dims.y;
            this._self.width = dims.w;
            this._self.height = dims.h;
            var hit = new createjs.Shape();
            hit.graphics.beginFill("#000").r(0, 0, dims.w, dims.h);
            this._self.hitArea = hit;
            this._value = value;
            this._value.selected = false;

            /* changes for memorygame */
            var innerECML = this.getInnerECML();
           
            if(value.text){
                this._isText= true;
            }
            if(value.imageAsset || value.imageAsset == ""){
                this._isImage= true;
            }
            if(value.audioAsset || value.audioAsset == ""){
                this._isAudio= true;

            }
            if (!_.isEmpty(innerECML) && innerECML.option) {
                this.renderTile(value);       
            } 

            /* changes for memorygame */
            if(this._parent._type.toLowerCase() == 'memorygame'){
                this.renderMEMORYGAMEOption();
            }
            /* changes for memorygame */
            this._render = true;
        }
    },

    renderTile: function(value){
        this.renderShape(value);
        if(this._isText && this._isImage){
            this.renderText(value);
            this.renderImage(value);
        }else if(this._isText){
            var val= value;
            
            if(value.alphabet || value.alphSound || value.alphSound == ""){
                this.renderText(value,true);
                val.imageAsset= "";
                this.renderText(val);
            }else{
                this.renderText(value);
            }
                
            
        }else if(this._isImage){
            this.renderImage(value);
        }else if(!this._isImage && !this._isText && this._isAudio){
            if(value.audioAsset == "")
            value.imageAsset = "icon_no_sound_image";
            else
            value.imageAsset = "icon_sound_image";
            this.renderImage(value);
        }
        this.addTileIcon();
            
    },

    /* changes for memorygame */
    renderMEMORYGAMEOption: function() {
        var controller = this._parent._controller;
        var itemId = controller.getModelValue("identifier");
        this._parent._options.push(this);
        this._self.cursor = 'pointer';
        var instance = this;
        this._self.on('click', function(event) { 
            instance._parent.flipTile(instance);
            console.log("clicked tile :", instance);
            var data = {
                type: event.type,
                x: event.stageX,
                y: event.stageY,
                optionTag: "MemoryGameAkshara"

            }
            if(instance._value.text)
            data.text= instance._value.text;
            else if (instance._value.imageAsset)
            data.imageId= instance._value.imageAsset;
            else if (instance._value.audioAsset)
            data.audioId= instance._value.audioAsset;
            data.tile_id= instance._value.id,
            audiManager.getEvenManager().processAppTelemetry({}, 'CHOOSE', instance, data);
        });

    },
    /* changes for memorygame */
    renderShape: function(data){
        var frontFaceColor = this._parent._fillColor || '#e67e22';
        var Data = {
            id: _.unique("tile"),
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            type: 'roundrect',
            fill: frontFaceColor,
            opacity: (this._data.opacity || 1),
            stroke: "#D14233"
        };
        PluginManager.invoke('shape', Data, this, this._stage, this._theme);
        this.animateShape(Data.id);
        // this._data.asset = data.asset;
    },

    renderImage: function(value) {
        var data = {};
        if(value.imageAsset)
        data.asset = value.imageAsset;
        else
        data.asset= "placehold_image";
        var padx = 0;
        var pady = 5;
        var textheight= 0;
        if(value.text){
            textheight= 40;
        }else{
            data.valign= "middle";
        }
        data.x = padx;
        data.y = pady;
        var align = (this._data.align ? this._data.align.toLowerCase() : 'center');
        data.h = 100 - (2 * pady) - textheight;
        data.visible= false;
        data.align= align;
        if (value.count) {
            data.count = value.count;
            data.type = "gridLayout";
            PluginManager.invoke('placeholder', data, this._self, this._stage, this._theme);
        } else {
            PluginManager.invoke('image', data, this, this._stage, this._theme);
        }
    },
    renderText: function(data,isAlpha) {
        var d={};
        d.$t = data.text;
        //data.$t = data.text;
        var padx = 0;
        var pady = 0;
        var imagehight= 0;
        var fontsize= 600;
        if (data.text && data.text.length == 1) {
            fontsize= 1200;
        }
        if(data.imageAsset || data.imageAsset === ""){
            imagehight= 65;
            fontsize= 600;
        }   
        d.x = padx;
        d.y = pady+imagehight;
        d.w = 100 - (2 * padx);
        d.h = 100 - (2 * pady)- imagehight;
        d.fontsize = (data.fontsize) ? data.fontsize: fontsize;
        var align = (this._data.align ? this._data.align.toLowerCase() : 'center');
        var valign = (this._data.valign ? this._data.valign.toLowerCase() : 'middle');
        var color = this._parent._textColor || '#ff0000';
        d.align = align;
        d.valign = valign;
        d.visible= false;
        d.color = color;
        if(isAlpha){
            d.$t = data.alphabet;
            d.fontsize= 1100;
        }
        PluginManager.invoke('text', d, this, this._stage, this._theme);
    },
    addTileIcon: function(){
        var data= {};
        data.id= _.unique("icon");
        data.$t = "?";
        var padx = 0;
        var pady = 0;
        var fontsize= 800;
        data.x = padx;
        data.y = pady;
        data.w = 100 - (2 * padx);
        data.h = 100 - (2 * pady);
        data.fontsize = fontsize;
        var align = "center";
        var valign = 'middle';
        var color = '#ffffff';
        data.align = align;
        data.valign = valign;
        data.visible= true;
        data.color = color;
        data.weight= "bold";
        PluginManager.invoke('text', data, this, this._stage, this._theme);
        this.animateShape(data.id);
    },
    animateShape: function(objId){
        var sp= PluginManager.getPluginObject(objId);
        var arr= [1,2,3,4];
        var d= _.sample(arr);
        var val= 30;
        switch(d) {
            case 1:
                createjs.Tween.get(sp._self,{loop:false}).to({y:sp._self.y-val},100).to({y:sp._self.y-val+20},200).to({y:sp._self.y-val+10},300).to({y:sp._self.y-val+30},400);
                break;
            case 2:
                createjs.Tween.get(sp._self,{loop:false}).wait(100).to({y:sp._self.y-val},100).to({y:sp._self.y-val+20},200).to({y:sp._self.y-val+10},300).to({y:sp._self.y-val+30},400); 
                break;
            case 3:
                createjs.Tween.get(sp._self,{loop:false}).wait(200).to({y:sp._self.y-val},100).to({y:sp._self.y-val+20},200).to({y:sp._self.y-val+10},300).to({y:sp._self.y-val+30},400); 
                break;
            case 4:
                createjs.Tween.get(sp._self,{loop:false}).wait(300).to({y:sp._self.y-val},100).to({y:sp._self.y-val+20},200).to({y:sp._self.y-val+10},300).to({y:sp._self.y-val+30},400); 
                break;
        }
        createjs.Ticker.addEventListener("tick",tickHandler);
        function tickHandler(e){
            Renderer.update = true;
        }   
    },
    renderInnerECML: function(index) {
        var innerECML = this.getInnerECML();
        if (!_.isEmpty(innerECML)) {
            var data = {};
            var padx = this._data.padX || 0;
            var pady = this._data.padY || 0;
            data.id = "tile_"+index;
            data.x = padx;
            data.y = pady;
            data.w = 100 - (2 * padx);
            data.h = 100 - (2 * pady);
            Object.assign(data, innerECML);
            PluginManager.invoke('g', data, this, this._stage, this._theme);
        }
    }
    
});

