/**
 * Question Unit Base Plugin that declares the interfaces that Question Unit Plugins must define.
 * @class org.ekstep.contenteditor.questionUnitPlugin
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Jagadish Pujari <jagadish.pujari@tarento.com>
 */
org.ekstep.contenteditor.questionUnitPlugin = org.ekstep.contenteditor.basePlugin.extend({
  type: "org.ekstep.contenteditor.questionUnitPlugin",
  _data: {},
  /**
   * Initialize the plugin
   * Load CKEditor, call beforeInit and beforeInit
   */
  initialize: function () {
    this.beforeInit();
    
    this.afterInit();
    //Questions and options font size change 
    ecEditor.addEventListener(this.manifest.id + ":changeFontSize", this.questionUnitFontChange, this);
  },
  /**
   * Actions to be performed before the question form is rendered.
   * This method may be overridden if HTML actions needs to be binded
   */
  beforeInit: function() {

  },
  /**
   * Actions to be performed after the question form is rendered.
   * This method may be overridden if HTML actions needs to be binded
   */
  afterInit: function() {

  },
  /**
   * Set the question data
   * While editing existing question
   * @param {object} data - question data
   */
  renderForm: function(data) {
    this._data = data;
    var instance = this;
    ecEditor.addEventListener("org.ekstep.questionunit:ready",function(){
      ecEditor.dispatchEvent(instance.manifest.id + ":editquestion",data); 
    });
  },
  /**
   * Set the question to _data.
   * Dispatch event to particular question unit plugin(MCQ/FTB/MTF)
   * @param {function} callback - question plugin validation
   */
  validateForm: function(callback) {
    var instance = this;
    ecEditor.dispatchEvent(this.manifest.id + ":validateform", function(isValid, data) {
      instance._data = data;
      if(_.isFunction(callback)) {
        callback(isValid,data);
      }
    });
  },
  questionUnitFontChange: function(event,callback){
    var instance = this;
    var questionBody = event.target;
    questionBody.data.data.question.text = instance.changeFontSize(questionBody.data.data.question);
    questionBody.data = instance.questionFontSizeChange(questionBody.data);
    callback(questionBody);
    
  },
  questionFontSizeChange: function(item){
    var instance = this;
    var questionItem = item;
    var questionOptionsData = item;

    switch (item.plugin.id) {
      case 'org.ekstep.questionunit.mcq':
      case 'org.ekstep.questionunit.sequence':
            questionOptionsData.data.options = instance.optionsTextFontChange(questionOptionsData.data.options,item.config.metadata.category);
            item = questionOptionsData;
            break;
      case 'org.ekstep.questionunit.mtf':
            questionOptionsData.data.option.optionsLHS = instance.optionsTextFontChange(questionOptionsData.data.option.optionsLHS,item.config.metadata.category);
            questionOptionsData.data.option.optionsRHS = instance.optionsTextFontChange(questionOptionsData.data.option.optionsRHS,item.config.metadata.category);
            item = questionOptionsData;
            break;
      default: break;

    }
    return questionItem;
  },
  optionsTextFontChange: function(options,type){
    var instance = this;
    var optionsData = options;

    if(type == 'mcq' || type == 'MCQ'){
      _.each(options,function(option,key){
        optionsData[key].text = instance.changeFontSize(option);
      });
    }else if(type == 'mtf'){
      _.each(options,function(option,key){
        optionsData[key].text = '<p style="font-size:1.28em">' + optionsData[key].text + '</p>';
      });
    }
    return optionsData;
  },
  changeFontSize: function(data){
      var index = data.text.indexOf("<p><span");
      
      if(index == 0){
          var element = $($.parseHTML(data.text));
          var size = $(element)[0].children[0].style.fontSize;
          if(parseFloat(size) < 1.285){
            $(element)[0].children[0].style.fontSize = '1.285em';
            data.text = $(element).prop('outerHTML');
          }
          return data.text;
      }else{
        return data.text.replace(/<p>/g, "<p style='font-size:1.285em;'>");
      }
  }
});
//# sourceURL=questionUnitPlugin.js