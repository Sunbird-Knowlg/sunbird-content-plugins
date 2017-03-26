var testContext = {
	uid: 'unittest',
	sid: 'testsession',
	contentId: 'do_1234'
}

var testConfig = {
	dispatcher: 'console',
	pluginRepo: 'http://localhost:9876/base',
	corePluginsPackaged: false,
	plugins: {
		'org.ekstep.stage': '1.0',
		'org.ekstep.config': '1.0'
	}
}

var $scope = {
	$safeApply: function() {},
	$watch: function() {}
}

var $document = {
	on: function() {}
}

ContentTestFramework = {
	init: function(cb, plugins) {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		console.log('####### Initializing Content Editor Framework #######');
		if(plugins) testConfig.plugins = plugins;
		EkstepEditor.init(testContext, testConfig, $scope, $document, function() {
			console.log('####### Content Editor Framework Initialized #######');
			cb();
		});
	}
}
