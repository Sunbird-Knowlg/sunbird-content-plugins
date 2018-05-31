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
            'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/collection-editor/scripts/external.min.js',
            'test/bootstrap-collection-editor-html.js',
            'test/bootstrap-collection-editor.js',
            { pattern: '**/*.md', watched: true, served: true, included: false },
            { pattern: '**/*.css', watched: true, served: true, included: false },
            { pattern: '**/*.html', watched: true, served: true, included: false },
            { pattern: '**/*.json', watched: true, served: true, included: false },
            { pattern: '**/*.js', watched: true, served: true, included: false },
            { pattern: '**/*.png', watched: true, served: true, included: false },
            // '**/test/editor/*.spec.js'            
            'org.ekstep.sunbirdmetadata-1.1/test/editor/plugin.fun.spec.js'
        ],
        exclude: [
            'node_modules/**',
            'coverage/**',
            'hooks/**'
        ],
        plugins: [
            'karma-jasmine',
            'karma-jasmine-matchers',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-mocha-reporter'
        ],
        // list of files to exclude
        exclude: ['coverage/**', '**/renderer/**'],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            //'**/editor/!(*.spec).js': ['coverage']
            'org.ekstep.sunbirdmetadata-1.1/editor/plugin.js': ['coverage']
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],
        // reporter options 
        mochaReporter: {
            colors: {
                success: 'green',
                info: 'bgYellow',
                warning: 'cyan',
                error: 'bgRed'
            },
            symbols: {
                success: '✔',
                info: '#',
                warning: '!',
                error: 'x'
            }
        },
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
        client: {
            captureConsole: true
        },
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        //  browserNoActivityTimeout: 60000,
        coverageReporter: {
            reporters: [
                { type: 'html', dir: 'coverage/' },
                { type: 'text-summary' },
                { type: 'cobertura' }
            ],
        }
    });
}