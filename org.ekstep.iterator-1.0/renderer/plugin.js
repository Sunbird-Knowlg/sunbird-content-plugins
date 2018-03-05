/**
 * Plugin to event handler
 * @extends base Plugin
 * @author Jagadish P <jagadish.pujari@tarento.com>
 */

 /* istanbul ignore next */
 IteratorPlugin = Plugin.extend({
  _type: 'org.ekstep.iterator',
  _isContainer: false,
  _render: true,
  initialize: function() {
  	var instance = this;
  },
  registerNavigation: function(PluginInstance){
  	EkstepRendererAPI.dispatchEvent('renderer:navigation:register',PluginInstance);
  },
  deregisterNavigation: function(PluginInstance){
  	EkstepRendererAPI.dispatchEvent('renderer:navigation:deregister',PluginInstance);
  },
  handleNext:function(){

  },
  handlePrevious:function(){
  	
  }
});
//#sourceURL=iterator.js
