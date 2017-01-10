Plugin.extend({
    _type: 'cmtf',
    _isContainer: true,
    _render: true,
    _lhs_options: [],
    _rhs_options: [],
    _force: false,
    _controller: undefined,
    initPlugin: function(data) {

        this._lhs_options = [];
        this._rhs_options = [];
        this._force  = false;

        var model = data.model;
        if (model) {
            var controller = this._stage.getController(model);
            if (controller) {
                this._controller = controller;
                this._force = data.force;
                if ((typeof this._force) == 'undefined' || this._force == null) {
                    this._force = false;
                }
                this._data.x = this._parent._data.x;
                this._data.y = this._parent._data.y;
                this._data.w = this._parent._data.w;
                this._data.h = this._parent._data.h;
                this._self = new createjs.Container();
                var dims = this.relativeDims();
                this._self.x = dims.x;
                this._self.y = dims.y;
                this.invokeChildren(data, this, this._stage, this._theme);
            }
        }
        this.addSubmitEvent();
    },
    getLhsOption: function(index) {
        var option;
        this._lhs_options.forEach(function(opt) {
            if (opt._index == index) {
                option = opt;
            }
        });
        return option;
    },
    // Deprecated - Use setAnswerMapping instead
    setAnswer: function(rhsOption, lhsIndex) {
        this._controller.setModelValue(rhsOption._model, lhsIndex, 'selected');
    },
    setAnswerMapping: function(rhsOption, lhsOption) {
        if (!_.isUndefined(lhsOption)) {
            rhsOption._value.mapped = lhsOption._value.resvalue;
            this._controller.setModelValue(rhsOption._model, lhsOption._index, 'selected');
        }
        else {
            delete rhsOption._value.mapped;
            this._controller.setModelValue(rhsOption._model, undefined, 'selected');
        }
    },
    removeAnswer: function(rhsOption, lhsIndex) {
        this._controller.setModelValue(rhsOption._model, lhsIndex, '');
    },
    addSubmitEvent: function(){
        var ins = this;
        function addEvent(){
            PluginManager.getPluginObject("submit_enabled")._self.on("click",function(){
                var result= ins.getCMTFEvaluator().evaluate(ins._controller._model);
        
                if(result.pass){
                }
                ins.showFeedback();
                //console.log("Inside Submit",ins);
            });
        }
        setTimeout(addEvent,1000)
    },
    showFeedback: function(){
        var ins= this;
        var overLayObj= PluginManager.getPluginObject("overlayPopup");
        var popupObj= PluginManager.getPluginObject("gdjobimg");
        audiManager.getAudiManager().play({asset: "goodjob_sound", stageId: this._stage._id});
        overLayObj._self.visible= true;
        popupObj._self.visible= true;
        ins._stage._self.setChildIndex( overLayObj._self, ins._stage._self.numChildren-2);
        ins._stage._self.setChildIndex( popupObj._self, ins._stage._self.numChildren-1);
        Renderer.update= true;  
    } ,
    getCMTFEvaluator: function(){
        var evalObj= {
            evaluate: function(item) {
                var result = {};
                var pass = true;
                var score = 0;
                var res = [];

                if (item) {
                    // var index = [];
                    // _.each(item.lhs_options, function(opt){
                    //  index.push(opt.index);
                    // });
                    var options = item.rhs_options;
                    // console.log("options", options);
                    if (_.isArray(options)) {
                        _.each(options ,function(opt) {

                            // Generate telemetry if there was a response to this option (rhs -> lhs)
                            if (typeof opt.selected != 'undefined') {
                                var obj = {};
                                obj[opt.value.resvalue] = opt.value.mapped;
                                res.push(obj);
                            }

                            // Answer is specified and correctly matched
                            if (typeof opt.answer != 'undefined') {
                                if (opt.answer == opt.selected) {
                                    score += (_.isNumber(opt.score)) ? opt.score: 1;
                                }
                            } else {
                                // Answer is not specified, but still matched (distractor)
                                if(typeof opt.selected != 'undefined') {
                                    pass = false;
                                }
                            }
                        });
                    }

                    if(pass){
                        var ansMatched = _.isEqual(_.pluck(options, "selected"), _.pluck(options, "answer"));
                        pass = ansMatched;
                    }

                    if (!pass) {
                        result.feedback = item.feedback;
                        if (!item.partial_scoring) {
                            score = 0;
                        }
                    }
                }

                result.pass = pass;
                result.score = score;
                result.res = res;

                return result;
            },

            reset: function(item) {
                if (item) {
                    var options = item.rhs_options;
                    if (_.isArray(options)) {
                        options.forEach(function(opt) {
                            opt.selected = undefined;
                            delete opt.value.mapped;
                        });
                    }
                }
            }
        }
        return evalObj;
    }
});


