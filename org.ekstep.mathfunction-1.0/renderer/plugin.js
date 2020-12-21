// Renderer plugin can't be tested as of now
// Please move the logic to other classes and test them independently
// Let the plugin class delegate functionality to these classes
Plugin.mathfunction = {};

/* istanbul ignore next */
Plugin.mathfunction.RendererPlugin = Plugin.extend({
    _type: 'org.ekstep.mathfunction',
    _isContainer: false,
    _render: true,
    initPlugin: function() {

    }
});
