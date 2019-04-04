/**
 * Plugin to event handler
 * @extends base Plugin
 * @author Jagadish P <jagadish.pujari@tarento.com>
 */

/* istanbul ignore next */
org.ekstep.contentrenderer.keyboardRenderer = Plugin.extend({
  _type: 'org.ekstep.keyboardPlugin',
  _render: true,
  initialize: function() {
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:invoke", this.showKeyboard);
    EkstepRendererAPI.addEventListener("org.ekstep.keyboard:hide", this.hideKeyboard);
    Keyboard.initTemplate(this);
  },
  showKeyboard: function(event, callback) {
    var customButtons = '';
    if (_.isFunction(callback)) {
      Keyboard.keyboardCallback = callback; // eslint-disable-line no-undef
    }
    var keyboardConfig = event.target;
    Keyboard.keyboardShow(keyboardConfig); // eslint-disable-line no-undef
    if (_.isUndefined(keyboardConfig) || keyboardConfig.type == 'Device') {
      $(Keyboard.constant.keyboardElement).hide(); // eslint-disable-line no-undef
    } else {
      if (keyboardConfig.type == "English") {
        customButtons = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        Keyboard.createKeyboard(customButtons); // eslint-disable-line no-undef
      } else if (keyboardConfig.type == 'Custom') {
        customButtons = keyboardConfig.keys.toString();
        Keyboard.createKeyboard(customButtons); // eslint-disable-line no-undef
      }
      var template = _.template(Keyboard.htmlLayout); // eslint-disable-line no-undef
      if ($(Keyboard.constant.keyboardElement).length <= 0) { // eslint-disable-line no-undef
        $("#gameArea").append(template({ inputValue: Keyboard.targetInput.value.trim() })); // eslint-disable-line no-undef
      }
      $("#firstRowAlpha").ready(function() {
        var childs = $("#firstRow").children();
        var position = $(childs[childs.length-1]).position();
        var parentHeight = $("#firstRow").height();
        if(position.top > parentHeight)
          EkstepRendererAPI.dispatchEvent("renderer:toast:show",undefined,{type:"info",message:"Please reduce number of keys and check preview again."});
      });
    }
  },
  hideKeyboard: function() {
    $(Keyboard.constant.keyboardElement).remove(); // eslint-disable-line no-undef
  },
  /**
   * provide media url to audio & image
   * @memberof org.ekstep.keyboard
   * @returns {String} url.
   * @param {String} icon.
   */
  getDefaultAsset: function (icon) {
    //In browser and device base path is different so we have to check
    if (isbrowserpreview) {// eslint-disable-line no-undef
      return this.getAssetUrl(org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/assets/" + icon));
    }
    else {
      //static url
      return this.getAssetUrl("/content-plugins/" + this._manifest.id + "-" + this._manifest.ver + "/renderer/assets/" + icon);
    }
  },
  /**
  * provide media url to asset
  * @memberof org.ekstep.keyboard
  * @param {String} url.
  * @returns {String} url.
  */
  getAssetUrl: function (url) {
    if (isbrowserpreview) {// eslint-disable-line no-undef
      return url;
    }
    else {
      return 'file:///' + EkstepRendererAPI.getBaseURL() + url;
    }
  }
});

//# sourceURL=keyboardPlugin.js