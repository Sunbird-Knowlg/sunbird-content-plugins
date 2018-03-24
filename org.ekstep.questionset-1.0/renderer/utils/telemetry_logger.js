var QSTelemetryLogger = {
	EVENT_TYPES: {
		TOUCH: 'TOUCH',
		RESPONSE: 'RESPONSE',
		ASSESS: 'ASSESS',
		ASSESSEND: 'ASSESSEND'
	},
	_plugin: {},
	_question: {},
	_assessStart: {},
	_qData: {},
	_qConfig: {},
	setQuestion: function (ques, index) {
		//Set by Question-set while rendering a new question
		this._plugin =  EkstepRendererAPI.getPluginObjs(ques.pluginId);
		this._question = ques;
		this._question.index = index;

		var qData = this._question.data.__cdata || this._question.data;
    this._qData = JSON.parse(qData);
		 
		var qConfig = this._question.config.__cdata || this._question.config;
    this._qConfig = JSON.parse(qConfig);
	},
	logInteract: function (data) {
		TelemetryService.interact(data.type, data.id, this.EVENT_TYPES.TOUCH, {stageId: Renderer.theme._currentStage});
	},
	logResponse: function (data) {
		var edata = {
      "target": {
        "id": this._plugin._manifest.id ? this._plugin._manifest.id : "",
        "ver": this._plugin._manifest.ver ? this._plugin._manifest.ver : "1.0",
        "type": this._plugin._manifest.type ? this._plugin._manifest.type : "plugin"
      },
      "type": data.type,
      "res": data.values
    }
    TelemetryService.itemResponse(edata);
	},
	logAssess: function () {
		this._assessStart = TelemetryService.assess(this._question.id, this._qConfig.metadata.language[0], this._qConfig.metadata.qlevel, {maxscore: this._qConfig.metadata.max_score}).start();
	},
	logAssessEnd: function (result) {  
    var data = {
      pass: result.eval,
      score: parseFloat((result.score).toFixed(2)),
      res: result.values,
      qindex: this._question.index,
      qtitle: this._qConfig.metadata.title,
      qdesc: this._qConfig.metadata.description ? this._qConfig.metadata.description : '',
      mc: [],
      mmc: []
    }
		TelemetryService.assessEnd(this._assessStart, data);
	},
	logEvent: function (type, data) {
		switch (type.toUpperCase()) {
			case this.EVENT_TYPES.TOUCH: 	
				this.logInteract(data);
				break;
			case this.EVENT_TYPES.ASSESS: 	
				this.logAssess();
				break;
			case this.EVENT_TYPES.RESPONSE: 	
				this.logResponse(data);
				break;
			case this.EVENT_TYPES.ASSESSEND: 	
				this.logAssessEnd(data);
				break;
			case 'DEFAULT': 	
				return true;
		}
	}
}
//# sourceURL=telemetryLogger.js