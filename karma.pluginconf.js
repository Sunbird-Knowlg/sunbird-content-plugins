// Karma configuration
// Generated on Wed Oct 26 2016 15:56:48 GMT+0530 (IST)

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'node_modules/angular/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-editor/scripts/external.min.js',
            //'test/external.min.js',
            'test/bootstrap-html.js',
            'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-editor/scripts/script.min.js',
            //'test/script.min.js',
            'test/bootstrap-editor.js',
            //'**/editor/**/*.js',
            // 'plugins/org.ekstep.test-1.0/editor/*.js', // if you want to test your editor plugin only
            // 'plugins/org.ekstep.test-1.0/test/*.js',  // include test directory for your specific plugin
            // fixtures - include as required, below patterns cover the core plugins
            { pattern: '**/*.md', watched: true, served: true, included: false },
            { pattern: '**/*.css', watched: true, served: true, included: false },
            { pattern: '**/*.html', watched: true, served: true, included: false },
            { pattern: '**/*.json', watched: true, served: true, included: false },
            { pattern: '**/*.js', watched: true, served: true, included: false },
            '**/test/editor/*.js'
        ],


        // list of files to exclude
        exclude: ['coverage/**', '**/renderer/**'],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/editor/!(*.spec).js': ['coverage']
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            "PhantomJS"
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        coverageReporter: {
            reporters: [
                { type: 'html', dir: 'coverage/' },
                { type: 'text-summary' },
                { type: 'cobertura' }
            ],
        }
    })
}
