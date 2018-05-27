var IteratorPlugin = Plugin.extend({
  _type: 'org.ekstep.iterator',
  _isContainer: false,
  _render: true,
  _itemIndex: -1,
  initialize: function() {
    var instance = this;
  },
  registerNavigation: function(PluginInstance) {
    EkstepRendererAPI.dispatchEvent('renderer:navigation:register', PluginInstance);
  },
  deregisterNavigation: function(PluginInstance) {
    EkstepRendererAPI.dispatchEvent('renderer:navigation:deregister', PluginInstance);
  },
  handleNext: function() {

  },
  handlePrevious: function() {

  }
  /*,
    hasPrevious: function (navType) {
      // navType: String --> "prev" or "next"
      // Denotes the navigation event that it is triggered for
    }*/
});