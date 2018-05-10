/**
 * Plugin to event handler
 * @extends base Plugin
 * @author Jagadish P <jagadish.pujari@tarento.com>
 */

/* istanbul ignore next */
Plugin.extend({
  _type: 'org.ekstep.keyboard',
  _render: true,
  initialize: function() {
    this._templatePath = org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/templates/keyboard.html");
    this.controllerPath = org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/controller/keyboard_ctrl.js");
    org.ekstep.service.controller.loadNgModules(this._templatePath, this.controllerPath);
  }
});
//#sourceURL=keyboardPlugin.js
