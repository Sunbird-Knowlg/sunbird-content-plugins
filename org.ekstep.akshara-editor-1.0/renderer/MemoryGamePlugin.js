Plugin.extend({
    _type: 'memorygame',
    _isContainer: true,
    _render: true,
    _options: [],
    _controller: undefined,
    _shadow: '#0470D8',
    _blur: 30,
    _offsetX: 0,
    _offsetY: 0,
    _highlight: '#E89241',
    _memory_values: [],
    _memory_tiles: [],
    _tiles_flipped: 0,
    _levelIndex: 0,
    _maxLevelIndex:0,
    _isLocked: false,
    _repeatIndex:0,
    _maxRepeatIndex:0,
    _roundIndex:0,
    _textPlugin: undefined,
    _contPattern: undefined,
    initPlugin: function(data) {
        // var a={
        //     type: "command",
        //     command: "set",
        //     param: "overlayNext",
        //     scope: "content"
        // }
        // a["param-value"]= "off";
        // audiManager.getCmdManager().handle(a);
        // console.log("memory game", this.stage);
        // PluginManager.getPluginObject(data.id)._self.visible= false;
    
        this._options = [];
        this._shadow = '#0470D8';
        this._blur = 30;
        this._offsetX = 0;
        this._offsetY = 0;
        this._memory_values =[];
        this._memory_tiles =[];
        var model = data.config.__cdata;
        if (model) {
            var tempData = {};
            tempData.w = 100;
            tempData.h = 100;
            tempData.x = 0;
            tempData.y = 0;
            tempData.type= "data";
            tempData.name= "aksharagame";
            tempData.data= "gameData";
            this.initController(data);
            this.addTemplates();
            this.addGameElements(data);
            // this.invokeTemplate(data,tempData);
            var controller = this._stage._stageController;
            // var controller = this._stage.getController(model);;
            
            if (controller) {
                this._contPattern= "data."+ data.id;
                this._controller = controller;
                this.resetLevelIndex();
                this.resetRepeatIndex();
                if(!this._controller.oldAksharas){
                    this._controller.oldAksharas= this._controller._data.aksharas;
                    
                }
                this.resetRoundIndex();
                if(!this._controller.isResetAkshara){
                    this.resetAksharas(model);
                }

                if(!this._controller.selectedWords){
                   this.resetWords(model); 
                }
                var newIns= this;
                function updateView(){
                    if(!newIns._controller.isMTF){
                            newIns.updateGameStatus();
                            PluginManager.getPluginObject("game_status")._self.visible= true;
                            // PluginManager.getPluginObject("game_group")._self.visible= true;
                            newIns._self.visible= true;
                            PluginManager.getPluginObject("assess_group")._self.visible= false;
                            PluginManager.getPluginObject("submit_btn_group")._self.visible= false;

                        
                    }else{
                        PluginManager.getPluginObject("game_status")._self.visible= false;
                        // PluginManager.getPluginObject("game_group")._self.visible= false;
                            newIns._self.visible= false;
                        if(!newIns._controller.quesIndex || newIns._controller.quesIndex == 1){
                            PluginManager.getPluginObject("assess_group")._self.visible= true;
                        }else if(newIns._controller.quesIndex == 2){
                            PluginManager.getPluginObject("assess_group_one")._self.visible= true;
                            newIns._controller.quesIndex= undefined;
                        }
                        PluginManager.getPluginObject("submit_btn_group")._self.visible= true;
                        
                    
                    }
                }
                setTimeout(updateView,100);
                this._data.x = data.x;
                this._data.y = data.y;
                this._data.w = data.w;
                this._data.h = data.h;
                var dims = this.relativeDims();
                this._self = new createjs.Container();
                this._self.x = dims.x;
                this._self.y = dims.y;

                if (controller._data.backFaceColor) {
                    this._highlight = controller._data.backFaceColor;
                }
                if(controller._data.frontFaceColor) {
                    this._fillColor = controller._data.frontFaceColor;
                }
                if(controller._data.textColor) {
                    this._textColor = controller._data.textColor;
                }
                if(controller.getModelValue("cols")) {
                    data.cols = controller.getModelValue("cols");
                }
                if(controller.getModelValue("rows")) {
                    data.rows = controller.getModelValue("rows");
                }
               PluginManager.invoke('tiles', data, this, this._stage, this._theme);
                this.createPopup();

            }
        }
    },
    resetLevelIndex: function(){
        // Setting game level index and max game level Index
        this._maxLevelIndex= this._controller._data.gameLevels.length-1;
        if(!this._controller.levelIndex){
            this._controller.levelIndex= this._levelIndex;
        }else if(this._controller.levelIndex > this._maxLevelIndex){
            this._levelIndex= this._maxLevelIndex;
        }else{
            this._levelIndex= this._controller.levelIndex;
        }
    },
    resetRepeatIndex: function(){
        // Setting game repeat index and max game repeat Index
        this._maxRepeatIndex= this._controller._data.repetition-1;
        if(!this._controller.repeatIndex){
            this._controller.repeatIndex= this._repeatIndex;
        }else if(this._controller.repeatIndex > this._maxRepeatIndex){
            this._repeatIndex= this._maxRepeatIndex;
        }else{
            this._repeatIndex= this._controller.repeatIndex;
        }

    },
    resetRoundIndex: function(){
        // Setting game round index and max game round Index
        var l= this._controller.oldAksharas.length;
        var maxRoundIndex;
        if(l<=5){
            maxRoundIndex= 0;
        }else if(l>5){
            var rem5= l%5;
            var rem4= l%4;
            var rem3= l%3;
            if(rem5 == 0){
                maxRoundIndex= l/5-1;
            }else if((rem4 == 0 && rem3 == 0) || rem4 == 0){
                maxRoundIndex= l/4-1;
            }else if(rem3 == 0){
                maxRoundIndex= l/3-1;
            }else if(rem5 > 2){
                maxRoundIndex= Math.floor(l/5);
            }else if(rem4 > 2){
                maxRoundIndex= Math.floor(l/4);
            }else {
                maxRoundIndex= Math.floor(l/3)-1;
            }

           
        }
        this._maxRoundIndex= maxRoundIndex;
        if(!this._controller.roundIndex){
            this._controller.roundIndex= this._roundIndex;
        }else if(this._controller.roundIndex > this._maxRoundIndex){
            this._roundIndex= this._maxRoundIndex;
        }else{
            this._roundIndex= this._controller.roundIndex;
        }

    },
    resetWords: function(mod){
        // Preparing the words array to be used in the tiles
        if(!this._controller.oldWords){
            this._controller.oldWords= this._controller._data.words;
        }
        var index= this._repeatIndex;
        var aks= this._controller._data.aksharas;
        var originalWords= this._controller.oldWords;
        var w=[];
        var maxRepeatIndex= this._maxRepeatIndex;
        _.each(aks,function(obj){
            var owordcopy= originalWords[obj.text];
            var newObj;
            if(owordcopy.two.length){
                if(index < ((maxRepeatIndex+1)/2) ){
                    newObj= owordcopy.one[index];
                    
                }else{
                    newObj= owordcopy.two[index];
                    // w.push(owordcopy.two[index]);
                }
            }else{
                newObj= owordcopy.one[index];
                // w.push(owordcopy.one[index]);
            }
            newObj.alphabet= obj.text;
            newObj.alphaSound= obj.audioAsset;
            w.push(newObj);
        });
        this._controller.setModelValue("words",w); 

    },
    resetAksharas: function(mod){
        // Preparing the aksharas array to be used in the tiles for each individual round
        var a=[];
        var originalAksharas= this._controller.oldAksharas;
        var startIndex= this._roundIndex;
        var length= originalAksharas.length;
        if(length<=5){
            a= originalAksharas;
            this._controller.setModelValue("cols",length);
        }else if(length>5){
            var rem5= length%5;
            var rem4= length%4;
            var rem3= length%3;
            if(rem5 == 0){
                this._controller.setModelValue("cols",5);
                a= originalAksharas.slice(startIndex*5, (startIndex*5)+5);
            } else if((rem4 == 0 && rem3 == 0) || rem4 == 0){
                this._controller.setModelValue("cols",4);
                a= originalAksharas.slice(startIndex*4, (startIndex*4)+4);
            } else if(rem3 == 0){
                this._controller.setModelValue("cols",3);
                a= originalAksharas.slice(startIndex*3, (startIndex*3)+3);
            }else if(rem5 > 2){
                var newcol=5;
                if(startIndex ==  this._maxRoundIndex){
                    newcol= rem5;  
                }
                this._controller.setModelValue("cols",newcol);
                a= originalAksharas.slice(startIndex*5, (startIndex*5)+newcol);
            }
            else if(rem4 > 2){
                var newcol=4;
                if(startIndex ==  this._maxRoundIndex){
                    newcol= rem4;  
                }
                this._controller.setModelValue("cols",newcol);
                a= originalAksharas.slice(startIndex*4, (startIndex*4)+newcol);
            }
            else {
                var newcol=3;
                if(startIndex ==  this._maxRoundIndex){
                    newcol= 3+rem3;  
                }
                this._controller.setModelValue("cols",newcol);
                a= originalAksharas.slice(startIndex*3, (startIndex*3)+newcol);
            }
        }
        this._controller.setModelValue("rows",2);  
        this._controller.setModelValue("aksharas",a); 
        this._controller.isResetAkshara= true;
    },
    flipTile: function(instance) {
        //function to be called on click of each tile
        if(this._isLocked)
            return;
        var defaultColor= this._fillColor;
        var obj= instance._value;
        var isImage= instance._self.children[2];
        var isText= instance._self.children[1];
        var lastIndex= instance._self.children.length-1;
        if(lastIndex === 1){
            isText =false;
        }else if(lastIndex === 2){
            isImage=false;
        }
        
        if(((instance._self.children.length>1 && !instance._self.children[1].visible) || (instance._self.children.length ==1 && instance._self.children[0].graphics._fill.style == defaultColor)) && !obj.selected){
            if(instance._value.audioAsset && instance._value.alphaSound){
                audiManager.getAudiManager().stopAll();
                audiManager.getAudiManager().play({asset: instance._value.alphaSound, stageId: this._stage._id, delay: 1500});
                audiManager.getAudiManager().play({asset: instance._value.audioAsset, stageId: this._stage._id});
            }else if(instance._value.audioAsset){
                audiManager.getAudiManager().stopAll();
                audiManager.getAudiManager().play({asset: instance._value.audioAsset, stageId: this._stage._id});
            }else if(instance._value.alphaSound){
                audiManager.getAudiManager().stopAll();
                audiManager.getAudiManager().play({asset: instance._value.alphaSound, stageId: this._stage._id});
            }
            
            var tileshape= instance._self.children[0];
            var tile_w= tileshape.width;
            var tile_h= tileshape.height;
            createjs.Tween.get(tileshape,{loop:false}).to({regX:tileshape.x+tile_w,scaleX:-1},500);
            if (isImage)
            createjs.Tween.get(instance._self.children[2],{loop:false}).wait(200).to({visible:true},250);
            if(isText)   
            createjs.Tween.get(instance._self.children[1],{loop:false}).wait(200).to({visible:true},250); 
            instance._self.children[0].graphics._fill.style= this._highlight; 
            createjs.Tween.get(instance._self.children[lastIndex],{loop:false}).to({visible:false},500); 
            //instance._self.children[lastIndex].visible= false;
            createjs.Ticker.addEventListener("tick",tickHandler);
          
            if(this._memory_values.length === 0 && !obj.selected){
                obj.selected= true;
                this._memory_values.push(obj);
                this._memory_tiles.push(instance);
            }else if(this._memory_values.length === 1){
                if(!obj.selected){
                    obj.selected= true;
                    this._memory_values.push(obj); 
                    this._memory_tiles.push(instance);
                }
                this._isLocked= false;
                if(this._memory_values.length > 1){
                    this._isLocked= true;
                    if(this._memory_values[0].id === this._memory_values[1].id){
                        //If block will execute when both tiles matches which are clicked consecutively
                        this._memory_values[0].selected= true;
                        this._memory_values[1].selected= true;
                        this._tiles_flipped += 2;
                        this._memory_values= [];
                        this._memory_tiles =[];
                        
                        if(this._tiles_flipped === this._options.length){
                            //If block will execute when last tile matches with its duplicate one in the screen
                            var ins= this;
                            var overLayObj= PluginManager.getPluginObject("overlayPopup");
                            var popupObj= PluginManager.getPluginObject("gdjobimg");
                            setTimeout(showPopup,1000);
                            function showPopup(){
                                overLayObj._self.visible= true;
                                popupObj._self.visible= true;
                                ins._stage._self.setChildIndex( overLayObj._self, ins._stage._self.numChildren-2);
                                ins._stage._self.setChildIndex( popupObj._self, ins._stage._self.numChildren-1);
                                audiManager.getAudiManager().play({asset: "goodjob_sound", stageId: ins._stage._id});
                            }

                                 
                            
                        }
                        this._isLocked= false;
                    }
                    else{
                        //This block of code executes when both tiles which are clicked consecutively do not matches
                        var ins= this;
                        var instance1= this._memory_tiles[0];
                        var instance2= this._memory_tiles[1];
                        var isFlipped= false;
                        //  var newInstance= this;
                        var isImage1 = instance1._self.children[2];
                        var isImage2 = instance2._self.children[2];
                        var isText1 = instance1._self.children[1];
                        var isText2 = instance2._self.children[1];
                        var lastIndex1= instance1._self.children.length-1;
                        var lastIndex2= instance2._self.children.length-1;
                        if(lastIndex1 === 1){
                            isText1 =false;
                        }else if(lastIndex1 === 2){
                            isImage1=false;
                        }
                        if(lastIndex2 === 1){
                            isText2 =false;
                        }else if(lastIndex2 === 2){
                            isImage2=false;
                        }
                        function flip2Back(){
                            var tileshape1= instance1._self.children[0];
                            var tileshape2= instance2._self.children[0];
                            createjs.Tween.get(tileshape1,{loop:false}).wait(400).to({regX:0,scaleX:1},500); 
                            createjs.Tween.get(tileshape2,{loop:false}).wait(400).to({regX:0,scaleX:1},500); 
                            if (isImage1)
                            createjs.Tween.get(instance1._self.children[2],{loop:false}).to({visible:false},250); 
                            if(isText1)
                            createjs.Tween.get(instance1._self.children[1],{loop:false}).to({visible:false},250); 
                            if (isImage2)
                            createjs.Tween.get(instance2._self.children[2],{loop:false}).to({visible:false},250); 
                            if(isText2)
                            createjs.Tween.get(instance2._self.children[1],{loop:false}).to({visible:false},250); 
                            createjs.Tween.get(instance1._self.children[lastIndex1],{loop:false}).to({visible:true},550);
                            createjs.Tween.get(instance2._self.children[lastIndex2],{loop:false}).to({visible:true},550);
                            createjs.Ticker.addEventListener("tick",tickHandler);
                            instance1._self.children[0].graphics._fill.style= defaultColor;   
                            instance2._self.children[0].graphics._fill.style= defaultColor;  
                            ins._isLocked= false;                      
                            Renderer.update= true;

                        }
                        setTimeout(flip2Back,1300)
                        this._memory_values[0].selected= false;
                        this._memory_values[1].selected= false;
                        this._memory_values= [];
                        this._memory_tiles= [];
                    }
                }

            }
        }

        function tickHandler(e){
            Renderer.update = true;
        }       
    },
    resetMTF: function(){
        
        if(!this._controller.quesIndex){
            this._controller.quesIndex= 1;
        }else if(this._controller.quesIndex == 1){
            this._controller.quesIndex = 2;
        }
        var cInstance= audiManager.getContManager().getControllerInstance(this._contPattern);
        var akshras= this._controller.getModelValue("aksharas");
        var words= this._controller.getModelValue("words");
        var it1;
        if(this._controller.quesIndex == 1){
            it1= this.getEachItem(1,akshras);
        }else if(this._controller.quesIndex == 2){
            it1= this.getEachItem(2,words);
        }
        cInstance._model.identifier= it1.identifier;;
        cInstance._model.qid = it1.qid;
        cInstance._model.qlevel = it1.qlevel;
        cInstance._model.title = it1.title;
        cInstance._model.question = it1.question;
        cInstance._model.max_score = it1.max_score;
        cInstance._model.partial_scoring = it1.partial_scoring;
        cInstance._model.lhs_options = it1.lhs_options;
        cInstance._model.rhs_options = it1.rhs_options;
        
        
    },
    getEachItem: function(quesIndex,akshras){
        // Preparing each item obj (MTF Question)
        
        var newObj= {};
        newObj.identifier= "aksharaTeaching.round"+this._roundIndex+ ".mtf."+quesIndex;
        newObj.qid= "aksharaTeaching.round"+this._roundIndex+ ".mtf."+quesIndex;
        newObj.qlevel= "EASY";
        if(quesIndex === 1 ){
            newObj.template= "mtf_assessment_one";
            newObj.template_id= "mtf_assessment_one";
        }else{
            newObj.template= "mtf_assessment_two";
            newObj.template_id= "mtf_assessment_two";
        }
        newObj.title= "Match the following.";
        newObj.question= "Match the following.";
        newObj.max_score= 1;
        newObj.partial_scoring= false;
        newObj.lhs_options= [];
        newObj.rhs_options= [];
        _.each(akshras,function(obj,i){
            var v= {};
            v.type="mixed";
            v.audio=obj.audioAsset;
            if(obj.alphabet)
            v.text= obj.alphabet
            else
            v.text= obj.text;
            if(obj.imageAsset)
            v.image=obj.imageAsset;
            else
            v.image="";
            var b={};
                b.index= i;
                b.value= v;
            var a={};
                a.value= v;
                a.answer= i;
            newObj.lhs_options.push(b);
            newObj.rhs_options.push(a);
        });
        newObj.rhs_options= _.shuffle(newObj.rhs_options);
        return newObj;
    },

    createPopup: function(){
        var overLay= {};
        overLay.id= "overlayPopup"
        overLay.x= "0";
        overLay.y= "0";
        overLay.h= "100";
        overLay.w= "100";
        overLay.type="rect";
        overLay.hitArea="true";
        overLay.fill= "#000";
        overLay.visible= false;
        overLay.opacity= 0.5;

        var popup= {};
        popup.id= "gdjobimg"
        popup.x= "15";
        popup.y= "15";
        popup.h= "70";
        popup.hitArea="true";
        popup.visible= false;
        popup.asset = "goodjob_image";
        popup.valign= "middle";
        popup.align = 'center';

        PluginManager.invoke('shape', overLay, this._stage, this._stage, this._theme);
        PluginManager.invoke("image", popup, this._stage, this._stage, this._theme);
        this.addPopupEvent();
    },
    addPopupEvent: function(){
        var overLayObj= PluginManager.getPluginObject("overlayPopup");
        var popupObj= PluginManager.getPluginObject("gdjobimg");
        var ins= this;
        popupObj._self.on('click', function(event) {
            console.log("After popup click");
            console.log("Round Index :" +ins._roundIndex);
            console.log("Level Index :" +ins._levelIndex);
            console.log("Repeat Index :" +ins._repeatIndex);
            console.log("controller Round Index :" +ins._controller.roundIndex);
            console.log("controler Level Index :" +ins._controller.levelIndex);
            console.log("controller Repeat Index :" +ins._controller.repeatIndex);
            //This block of code executes when you click on the success image
            if(ins._controller.repeatIndex < ins._maxRepeatIndex){
                var isResetRepeat= false;
                if(ins._controller.isMTF){
                    isResetRepeat= true;
                }
                ins._controller.isMTF= false;
                if(ins._controller.roundIndex <= ins._maxRoundIndex){
                    if(ins._controller.isAksharas){
                        changeLevel();
                    }else{
                        ins._controller.repeatIndex= ins._controller.repeatIndex+1;
                        ins._controller.selectedWords= undefined;
                        if(isResetRepeat){
                            ins._controller.repeatIndex= 0;
                        }
                        hidePopup();
                        console.log("reload stage 1");
                        reloadStage(); 
                    }
                }else{
                    switchStage();
                }
                
            }else{
                changeLevel();
            }

            function changeLevel(){
                ins._controller.repeatIndex= 0;
                ins._repeatIndex= 0;
                ins._controller.selectedWords= undefined;
                ins._controller.levelIndex= ins._controller.levelIndex+1;
                if(ins._controller.levelIndex <= ins._maxLevelIndex){
                    if(ins._controller.roundIndex <= ins._maxRoundIndex){
                        if(ins._controller.isMTF){
                            ins._controller.levelIndex= 0;
                        }
                        ins._controller.isMTF= false;
                        hidePopup();
                        console.log("reload stage 2");
                        reloadStage(); 
                        
                    }else{
                        switchStage();
                    }
                }else{
                    if(ins._controller.roundIndex < ins._maxRoundIndex){
                        hidePopup();
                        ins.resetMTF();
                        ins._controller.isMTF= true;
                        if(ins._controller.quesIndex == 2){
                            ins._controller.isResetAkshara= false;
                            ins._controller.roundIndex= ins._controller.roundIndex+1;
                            ins._controller.levelIndex=0;
                            ins._levelIndex= 0;

                        }
                        else{
                            ins._controller.repeatIndex= ins._maxRepeatIndex;
                        }
                        console.log("reload stage 3");
                        reloadStage(); 
             
                    }else{
                       
                        hidePopup();
                        if(ins._controller.roundIndex == ins._maxRoundIndex){
                          
                            // ins._controller.roundIndex= ins._controller.roundIndex+1;
                            // ins._controller.isMTF= false;
                            ins.resetMTF();
                            ins._controller.isMTF= true;
                            if(ins._controller.quesIndex == 2){
                                
                                ins._controller.levelIndex=0;
                                ins._levelIndex= 0;
                                ins._controller.roundIndex= ins._controller.roundIndex+1;
                            
                            }
                            else{
                                ins._controller.repeatIndex= ins._maxRepeatIndex;
                            }
                            console.log("reload stage 4");
                            reloadStage();
                        }else{
                           
                            switchStage();
                        }
                        // else if(ins._controller.roundIndex-1 == ins._maxRoundIndex){
                        //     ins._controller.roundIndex= ins._controller.roundIndex+1;
                        //     ins.resetMTF();
                        //     ins._controller.isMTF= true;
                        //     reloadStage();
                        // }

                    }
                }
            }
            function hidePopup(){
                overLayObj._self.visible= false;
                popupObj._self.visible= false;

            } 

            function reloadStage(){
                console.log("Before stage reload");
                console.log("Round Index :" +ins._roundIndex);
                console.log("Level Index :" +ins._levelIndex);
                console.log("Repeat Index :" +ins._repeatIndex);
                console.log("controller Round Index :" +ins._controller.roundIndex);
                console.log("controler Level Index :" +ins._controller.levelIndex);
                console.log("controller Repeat Index :" +ins._controller.repeatIndex);
                
    
                var a={};
                    a.type= "command";
                    a.command= "reload";
                    a.asset= "theme";
                    a.value= "homeScreen";
                    ins._stage.reload(a);
            }  
            function switchStage(){
                OverlayManager.skipAndNavigateNext();
            }       

        });
    },
    updateGameStatus: function(){
        console.log("-------------------------------"+ this._roundIndex + "  "+ "---" +this._levelIndex + "  ----" + this._repeatIndex);
        console.log("-------------------------------"+ this._controller.roundIndex + "  "+ "---" +this._controller.levelIndex + "  ----" + this._controller.repeatIndex);
        PluginManager.getPluginObject("game_level")._self.text= this._levelIndex +1;
        PluginManager.getPluginObject("game_round")._self.text= this._roundIndex +1;
        PluginManager.getPluginObject("game_repeat")._self.text= this._repeatIndex +1;
        Renderer.update= true;
    },
    invokeEmbed: function(data,tempData) {
        var embedData = {};
        embedData.w = tempData.w;
        embedData.h = tempData.h;
        embedData.x = tempData.x;
        embedData.y = tempData.y;
        if(tempData.type === "data"){
            embedData["template-name"] = tempData.name;
            embedData["var-data"] = tempData.data; 
        }else{
            embedData.template = "item";
            embedData["var-item"] = "item";
        }
        PluginManager.invoke('embed', embedData, this._stage, this._stage, this._theme);
    },
    initController: function(data,contData) {
        console.log("before controllerId:", data);
        var controllerName = "data";
        var controllerId = data.id;
        var stageController = this._theme._controllerMap[controllerId];
        console.log("controllerId" +  controllerId);
        // Check if the controller is already initialized, if yes, skip the init
        var initialized = (stageController != undefined);
        if (!initialized) {
            var controllerData = {};
            controllerData.__cdata = data.config.__cdata;
            controllerData.type = "data";
            controllerData.name = controllerId;
            controllerData.id = controllerId;

            this._theme.addController(controllerData);
            stageController = this._theme._controllerMap[controllerId];
            console.log("Controller initialized:", stageController);
        }

        if (stageController) {
            this._stage._stageControllerName = controllerName;
            this._stage._stageController = stageController;
            this._stage._stageController.next();
        }
    },
    addGameElements: function(data){
        var gameStatus={
        "x": 10,
        "y": 0,
        "w": 90,
        "h": 12,
        "id": "game_status",
        "text": [
          {
            "x": 0,
            "y": 0,
            "w": 10,
            "h": 100,
            "font": "Verdana",
            "fontsize": 50,
            "align": "center",
            "color": "#4c4c4c",
            "valign": "middle",
            "__text": "Round: "
          },
          {
            "x": 8,
            "y": 0,
            "w": 5,
            "h": 100,
            "font": "Verdana",
            "fontsize": 50,
            "align": "center",
            "color": "#4c4c4c",
            "weight": "bold",
            "valign": "middle",
            "id": "game_round"
          },
          {
            "x": 20,
            "y": 0,
            "w": 10,
            "h": 100,
            "font": "Verdana",
            "fontsize": 50,
            "align": "center",
            "color": "#4c4c4c",
            "valign": "middle",
            "__text": "Level: "
          },
          {
            "x": 28,
            "y": 0,
            "w": 5,
            "h": 100,
            "font": "Verdana",
            "fontsize": 50,
            "align": "center",
            "color": "#4c4c4c",
            "weight": "bold",
            "valign": "middle",
            "id": "game_level"
          },
          {
            "x": 40,
            "y": 0,
            "w": 10,
            "h": 100,
            "font": "Verdana",
            "fontsize": 50,
            "align": "center",
            "color": "#4c4c4c",
            "valign": "middle",
            "__text": "Repetition: "
          },
          {
            "x": 51,
            "y": 0,
            "w": 5,
            "h": 100,
            "font": "Verdana",
            "fontsize": 50,
            "align": "center",
            "color": "#4c4c4c",
            "weight": "bold",
            "valign": "middle",
            "id": "game_repeat"
          }
        ]
      }
    var assessGroup= {
            "id": "assess_group",
            "x": 12,
            "y": 5,
            "w": 76,
            "h": 95,
            "visible": false,
            "embed": {}
        }
        assessGroup.embed["template-name"]= "mtf_assessment_one";
        assessGroup.embed["var-data"]= data.id;
    var assessGroupOne= {
            "id": "assess_group_one",
            "x": 12,
            "y": 5,
            "w": 76,
            "h": 95,
            "visible": false,
            "embed": {}
        }
        assessGroupOne.embed["template-name"]= "mtf_assessment_two";
        assessGroupOne.embed["var-data"]= data.id;
    var submitBtnGrp= {
            "id": "submit_btn_group",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 100,
            "visible": false,
            "image": [
              {
                "id": "submit_disabled",
                "asset": "submit_disabled_image",
                "x": 90,
                "y": 80,
                "w": 10
              },
              {
                "id": "submit_enabled",
                "asset": "submit_image",
                "x": 90,
                "y": 80,
                "w": 10,
                "visible": false
              }
            ]
        }
        PluginManager.invoke('g', gameStatus, this._stage, this._stage, this._theme);
        PluginManager.invoke('g', assessGroup, this._stage, this._stage, this._theme);
        PluginManager.invoke('g', assessGroupOne, this._stage, this._stage, this._theme);
        PluginManager.invoke('g', submitBtnGrp, this._stage, this._stage, this._theme);
    },
    addTemplates: function(){
        var temp=[{
            "id": "mtf_assessment_one",
            "text": {
              "x": 0,
              "y": 0,
              "w": 100,
              "h": 10,
              "font": "Verdana",
              "fontsize": 50,
              "align": "center",
              "color": "#4c4c4c",
              "model": "data.question",
              "weight": "bold",
              "valign": "middle"
            },
            "cmtf": {
              "model": "data",
              "force": "false",
              "coptions": [
                {
                  "layout": "table",
                  "x": 0,
                  "y": 15,
                  "w": 30,
                  "h": 80,
                  "cols": 1,
                  "marginX": 0,
                  "marginY": 2,
                  "options": "lhs_options",
                  "snapX": 90,
                  "snapY": 0,
                  "image": {
                    "asset": "icon_sound_image",
                    "x": 0,
                    "y": 0,
                    "w": 100
                  },
                  "shape": {
                    "x": 90,
                    "y": 0,
                    "w": 100,
                    "h": 100,
                    "fill": "#ddd",
                    "opacity": "0.5",
                    "type": "rect"
                  },
                  "event": {
                    "type": "click",
                    "action": {
                      "type": "command",
                      "command": "play",
                      "asset_model": "option.value.audio"
                    }
                  }
                },
                {
                  "layout": "table",
                  "x": 60,
                  "y": 15,
                  "w": 30,
                  "h": 80,
                  "cols": 1,
                  "marginX": 0,
                  "marginY": 2,
                  "options": "rhs_options",
                  "shape": {
                    "x": 0,
                    "y": 0,
                    "w": 100,
                    "h": 100,
                    "fill": "#ccc",
                    "opacity": "0.5",
                    "type": "rect"
                  },
                  "text": {
                    "x": 0,
                    "y": 0,
                    "w": 100,
                    "h": 100,
                    "font": "Verdana",
                    "fontsize": 200,
                    "align": "center",
                    "color": "#000",
                    "model": "option.value.text",
                    "weight": "bold",
                    "valign": "middle"
                  }
                }
              ]
            }
          }, {
            "id": "mtf_assessment_two",
            "text": {
              "x": 0,
              "y": 0,
              "w": 100,
              "h": 10,
              "font": "Verdana",
              "fontsize": 50,
              "align": "center",
              "color": "#4c4c4c",
              "model": "data.question",
              "weight": "bold",
              "valign": "middle"
            },
            "cmtf": {
              "model": "data",
              "force": "false",
              "coptions": [
                {
                  "layout": "table",
                  "x": 0,
                  "y": 15,
                  "w": 30,
                  "h": 80,
                  "cols": 1,
                  "marginX": 0,
                  "marginY": 2,
                  "options": "lhs_options",
                  "snapX": 75,
                  "snapY": 0,
                  "image": {
                    "model": "option.value.image",
                    "x": 0,
                    "y": 0,
                    "w": 100
                  },
                  "shape": {
                    "x": 75,
                    "y": 0,
                    "w": 100,
                    "h": 100,
                    "fill": "#ddd",
                    "opacity": "0.5",
                    "type": "rect"
                  }
                },
                {
                  "layout": "table",
                  "x": 60,
                  "y": 15,
                  "w": 30,
                  "h": 80,
                  "cols": 1,
                  "marginX": 0,
                  "marginY": 2,
                  "options": "rhs_options",
                  "shape": {
                    "x": 0,
                    "y": 0,
                    "w": 100,
                    "h": 100,
                    "fill": "#ccc",
                    "opacity": "0.5",
                    "type": "rect"
                  },
                  "text": {
                    "x": 0,
                    "y": 0,
                    "w": 100,
                    "h": 100,
                    "font": "Verdana",
                    "fontsize": "200",
                    "align": "center",
                    "color": "#000",
                    "model": "option.value.text",
                    "weight": "bold",
                    "valign": "middle"
                  }
                }
              ]
            }
          }
        ];
        var instance = this;
        var templateType = "data";
        var templateId = this._stage.getTemplate(templateType);
        var template = this._theme._templateMap[templateId];
        if (template === undefined) {
          temp.forEach(function (t) {
            if (t.id) {
              // push i.template into the collection arrey of the templates.
              instance._theme._templateMap[t.id] = t;
            }
          });
        }

    }
});

