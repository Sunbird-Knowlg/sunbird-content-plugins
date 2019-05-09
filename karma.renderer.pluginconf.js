// Karma configuration
// Generated on Thu May 03 2018 12:26:55 GMT+0530 (India Standard Time)

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'jasmine-jquery',
            'jasmine',
            'jasmine-matchers'
        ],


        // list of files / patterns to load in the browser
        files: [
            'test/jquery-2.1.4.min.js',
            'test/canvas.test.js',
            'test/fabric.min.js',
            'test/super.js',
            'https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js',
            'test/createjs.min.js',
            'test/cordovaaudioplugin-0.6.1.min.js',
            'test/creatine-1.0.0.min.js',
            // 'https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js',
            // 'https://s3.ap-south-1.amazonaws.com/ekstep-public-prod/v3/preview/coreplugins/org.ekstep.ecmlrenderer-1.0/renderer/libs/createjs.min.js',
            // 'https://s3.ap-south-1.amazonaws.com/ekstep-public-prod/v3/preview/coreplugins/org.ekstep.ecmlrenderer-1.0/renderer/libs/cordovaaudioplugin-0.6.1.min.js',
            // 'https://s3.ap-south-1.amazonaws.com/ekstep-public-prod/v3/preview/coreplugins/org.ekstep.ecmlrenderer-1.0/renderer/libs/creatine-1.0.0.min.js',
            // 'https://s3.ap-south-1.amazonaws.com/ekstep-public-prod/v3/preview/scripts/renderer.external.min.js',
            // 'https://s3.ap-south-1.amazonaws.com/ekstep-public-prod/v3/preview/scripts/renderer.telemetry.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js',
            'test/script.min.player.js',
            // 'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/preview/script.min.1.9.686.js',
            // 'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/preview/**',
            'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular-mocks.js',
            'coreplugins/**/renderer/*.js',
            { pattern: 'assets/user_list/user_list.json', watched: true, served: true, included: false },
            { pattern: 'assets/sounds/goodjob.mp3', watched: true, served: true, included: false },
            { pattern: 'assets/sounds/letstryagain.mp3', watched: true, served: true, included: false },
            // { pattern: 'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/preview/assets/user_list/user_list.json', watched: true, served: true, included: false },
            // { pattern: 'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/preview/assets/sounds/goodjob.mp3', watched: true, served: true, included: false },
            // { pattern: 'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/preview/assets/sounds/letstryagain.mp3', watched: true, served: true, included: false },
            { pattern: 'test/testContent/widgets/content-plugins/**/manifest.json', watched: true, served: true, included: false },
            { pattern: 'test/testContent/assets/assets/public/content/*.jpeg', watched: true, served: true, included: false },
            { pattern: 'test/testContent/assets/assets/public/content/*.png', watched: true, served: true, included: false },
            { pattern: 'test/testContent/index.html', watched: true, served: true, included: false },
            // { pattern: 'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/preview/coreplugins/**/manifest.json', watched: true, served: true, included: false },
            { pattern: 'test/coreplugins/**/manifest.json', watched: true, served: true, included: false },
            { pattern: 'test/testContent/index.json', watched: true, served: true, included: false },
            { pattern: '**/*.js', watched: true, served: true, included: false },
            { pattern: '**/*.json', watched: true, served: true, included: false },
            // 'https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/preview/coreplugins/org.ekstep.ecmlrenderer-1.0/renderer/libs/renderer.min.js',
            'test/renderer.min.js', 
            'test/renderer.js',
            "*/renderer/*.js",
            "*/renderer/util/*.js",
            "*/renderer/utils/*.js",         
            "*/test/mocks/renderer/*.js",
            { pattern: '**/manifest.json', watched: false, served: true, included: false },
            '**/test/renderer/*.spec.js'
            // 'org.ekstep.questionunit.ftb-1.0/test/renderer/plugin.spec.js'
        ],

        exclude: [
            'coverage/**',
            'hooks/**',
            '**/editor/**'
        ],

        client: {
            captureConsole: false
        },

        plugins: [
            'karma-jasmine',
            'karma-jasmine-matchers',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-mocha-reporter',
            "karma-jasmine-jquery",
            "karma-junit-reporter",
            "karma-ng-html2js-preprocessor",
            "karma-verbose-reporter"
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/!(test)/renderer/*.js': ['coverage']
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'verbose', 'progress', 'coverage'],
     
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

		// customLaunchers: {
		// 	ChromeDebugging: {
		// 	  base: 'Chrome',
		// 	  flags: [ '--remote-debugging-port=9333' ]
		// 	}
		//   },
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            "ChromeHeadless"
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        coverageReporter: {
            reporters: [
                { type: 'html', dir: 'coverage/' },
                { type: 'text-summary' },
                { type: 'cobertura' }
            ]
        },
    })
}
