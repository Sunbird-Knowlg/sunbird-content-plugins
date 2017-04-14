module.exports = function(config) {
    var isDebugMode = process.argv.slice(2).indexOf('--debug') >= 0;
    var conditionalCoveragePreprocessors = isDebugMode ? [] : ["coverage"];
    var conditionalReporters = isDebugMode ? ["progress"] : ["progress", "coverage"];

    config.set({
        basePath: "",
        frameworks: ["jasmine-ajax", "jasmine"],
        files: [
            "bower_components/content-editor-dependency/index.js",
            "bower_components/angular-mocks/angular-mocks.js",
            "testSupport/contentEditorDomSimulation.js",
            "bower_components/content-editor/index.js",
            "node_modules/at/app/libs/plugin-lib.js",
            "editor/init.js",
            "editor/**/*.js",
            "renderer/**/*.js",
            "test/**/*.js"
        ],
        exclude: [],
        preprocessors: {
            "editor/**/*.js": conditionalCoveragePreprocessors,
            "renderer/**/*.js": conditionalCoveragePreprocessors
        },
        reporters: conditionalReporters,
        coverageReporter: {
            check: {
                global: {
                    statements: 80,
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    excludes: []
                },
                each: {
                    statements: 80,
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    excludes: [],
                    overrides: {}
                }
            },
            reporters: [
                { type: 'html', dir: 'coverage/' },
                { type: 'text-summary' },
                { type: 'cobertura', dir: 'coverage/'}
            ]
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: false,
        browsers: ["PhantomJS"]
    })
}
