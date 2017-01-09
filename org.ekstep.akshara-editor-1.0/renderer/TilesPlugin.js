Plugin.extend({
    _type: 'tiles',
    _isContainer: false,
    _render: false,
    _fillColor: "#e67e22",
    value: undefined,
    _isCloned: false,
    _data: undefined,
    initPlugin: function(data) {
        var model = data.config.__cdata;
        var value=undefined;
        this.value = undefined;
        // this._data = this._stage.getModelValue(model);
        console.log("inside tiles,",data);
        this._data = this._stage._stageController._data;
        this._data.words = this._parent._controller.getModelValue("words");
        this._data.aksharas = this._parent._controller.getModelValue("aksharas");
        this._data.x= data.x;
        this._data.y= data.y;
        var isAksharas= false;
        if (this._parent._controller && model) {
            var levelIndex= this._parent._levelIndex; //get level index to render memorygame as per level
            var isArrayChange;
            var currentLevel;
            var previousLevel;
            if(levelIndex){
                currentLevel= this._data.gameLevels[levelIndex].level.toLowerCase();
                previousLevel= this._data.gameLevels[levelIndex-1].level.toLowerCase();
                if((currentLevel == "level4" && (previousLevel == "level1" || previousLevel == "level2" || previousLevel == "level3" )) || (previousLevel == "level4" && (currentLevel == "level1" || currentLevel == "level2" || currentLevel == "level3")) ){
                    isArrayChange= true;
                }else{
                    isArrayChange= false;
                }
            }
            if(!this._parent._controller.selectedWords || isArrayChange){ //check if text are selected for tiles
                var r= this._parent._data.rows;
                var c= this._parent._data.cols;
                var wordCount;
                var halfTileCount= (r*c)/2;
                
                if(this._data.gameLevels[levelIndex].level.toLowerCase() == "level4"){//check if text should be selected from aksharas array or word arrays
                    isAksharas= true; 
                    this._parent._controller.isAksharas= true;
                }else{
                    isAksharas= false;
                    this._parent._controller.isAksharas= false;
                }
                
                if(isAksharas){ 
                    wordCount= this._data.aksharas.length;
                }else{
                    wordCount= this._data.words.length;
                }

                //check if required text should be subarray of aksharas array/word arrays, or use full akashara/word array
                if(wordCount> halfTileCount){
                    if(isAksharas){
                        this.value= _.sample(this._data.aksharas,halfTileCount);
                    }else{
                       this.value= _.sample(this._data.words,halfTileCount);
                    }

                }else{
                    if(isAksharas){
                        this.value= this._data.aksharas;
                    }else{
                        this.value= this._data.words;

                    }
                }
                this._parent._controller.selectedWords= this.value;
                
            }else{
                this.value= this._parent._controller.selectedWords;
            }
            
             
            
        }


        if(this.value && this._parent._data.pluginType.toLowerCase() == 'memorygame' ){
            //Generating duplicate tiles based on the levels and their tiles configurations
            value=[];
            var instance= this;
            var tile1= this._data.gameLevels[levelIndex].tiles.one;
            var tile2= this._data.gameLevels[levelIndex].tiles.two ;  
            var firstArray=  cloneTile(this.value,tile1,true);
            var secondArray= cloneTile(this.value,tile2,false);
            firstArray= _.shuffle(firstArray);
            secondArray= _.shuffle(secondArray);
            value= firstArray;

            _.each(secondArray,function(obj){
                value.push(obj);
            });
        
            function cloneTile(arr,tiles,akshara){
                var newarr=[];    
                _.each(arr,function(obj){
                    var newobj={};
                    var isText=false;
                    var isImage=false;
                    var isAudio= false;
                    
                    for(t in tiles){
                        var key= tiles[t];
                        if(key == "text"){
                             isText= true;
                        }else if(key == "image"){
                             isImage= true;

                        }else if(key == "audio"){
                             isAudio= true;

                        }
                    }
                    if(isAksharas){
                        if(isText){
                           newobj.text= obj.text;  
                       }else if(isAudio){
                           newobj.audioAsset= obj.audioAsset; 
                       }
                    }else{
                        if(isText && isImage && isAudio){
                            newobj.text= obj.text; 
                            newobj.imageAsset= obj.imageAsset; 
                            newobj.audioAsset= obj.audioAsset;
                        }else if(isImage && isAudio){
                            newobj.imageAsset= obj.imageAsset; 
                            newobj.audioAsset= obj.audioAsset;

                        }else if(isText && isAudio){
                            newobj.text= obj.text; 
                            //newobj.audioAsset= obj.audioAsset;
                            if (akshara) {
                                newobj.alphabet= obj.alphabet;
                                newobj.alphaSound= obj.alphaSound;    
                            } else {
                                newobj.audioAsset= obj.audioAsset;
                            }
                        }else if(isText && isImage){
                            newobj.text= obj.text; 
                            newobj.imageAsset= obj.imageAsset;
                        }else if(isText){
                            newobj.text= obj.text;
                        }else if(isImage){
                            newobj.imageAsset= obj.imageAsset; 
                        }
                    }
                    
                    newobj.id= obj.id;
                    newarr.push(newobj);
                });
                return newarr;                
            }
            //if top row fix (fixRows) is true then mix the clonned tiles with the original tiles
            if(!this._data.fixRows){
                value= _.shuffle(value);
            }
            this._parent._controller.setModelValue("data",value);       
        }
        

        /* changes for memorygame */
        if (value && _.isArray(value) && value.length > 0) {
            if ((_.isFinite(data.cols) && _.isFinite(data.rows))) {
                this.renderTableLayout(value);
            }
        }
    },
    renderTableLayout: function(value) {
        //Creating Grid and invoking each tile
        console.log("inside renderTableLayout,",this);
        var cols = undefined;
        var rows = undefined;
        var count = value.length;
        var parentData = this._parent._data;
        var ctrlOptions = this._parent._controller._model.data;
        if(parentData.cols) {
            cols = Math.min(count, parentData.cols);
        }
        if(parentData.rows) {
            rows = Math.min(count, parentData.rows);
        }
        var r= count/cols;
        var rowDiff= 0;
        if(r>rows){
            rowDiff= r-rows;
        }else if(rows> r){
            rowDiff= rows-r;
        }
        if(rows*cols >= count && rowDiff<2){
            var instance = this;
            var padX = parentData.padX || 0;
            var padY = parentData.padY || 0;
            var index = 0;
            var containerObj={};
            containerObj.w= 100;
            containerObj.h= 100;
            var gridCells= this.getGrid(cols,rows,containerObj)
            for(var i=0; i< gridCells.length; i++){
                var data = gridCells[i];
                data.padX = padX;
                data.padY = padY;
                data.snapX = instance._data.snapX;
                data.snapY = instance._data.snapY;

                data.stroke = instance._data.stroke;
                data['stroke-width'] = instance._data['stroke-width'];
                data.events = instance._data.events;
                data.event = instance._data.event;

                if(this._parent.frontFaceColor)
                data.fillColor= this._parent.frontFaceColor;
                
                if (this._parent._highlight) {
                    data.highlight = this._parent._highlight;
                }
                data.option = ctrlOptions[index];
                var innerECML = this.getInnerECML();
                if (!_.isEmpty(innerECML)) {
                    Object.assign(data, innerECML);
                }
                index = index + 1;

                PluginManager.invoke('tile', data, instance._parent, instance._stage, instance._theme);
            }

        }else{
            console.log("Rows and Colums are incorrect");
        }
    },
    getGrid: function(cols,rows,containersize){
        /* 
        cols-> no of columns
        rows- > no of rows
        containersize- > its an object which has 2 properties width as w and height as h (value for these parameter is number without any unit like px or %)
        */
        if(cols && rows && containersize){
            var x= 0;
            var y= 0;
            var marginX = 2;
            var marginY = 2;
            var padX = 0;
            var padY = 0;
            var cw = (containersize.w - ((cols-1) * marginX))/cols;
            var ch = (containersize.h - ((rows-1) * marginY))/rows;
            var index = 0;
            var gridObjects= [];
            for (var r=0; r<rows; r++) {
                for (var c=0; c<cols; c++) {
                    var data = {};
                    data.x = x + (c * (cw + marginX));
                    data.y = y + (r * (ch + marginY));
                    data.w = cw;
                    data.h = ch;
                    gridObjects.push(data);
                }

            }
            return gridObjects;
        }else{
            return "rows or cloumns or container size is missing";
        }

    }
});

