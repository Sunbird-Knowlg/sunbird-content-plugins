var gulp = require('gulp');
var eslint = require('gulp-eslint');
var eslintIfFixed = require('gulp-eslint-if-fixed');
var karma = require('karma');
var bower = require('gulp-bower');
var jsdoc = require('gulp-jsdoc3');
var jsonlint = require("gulp-jsonlint");
var zip = require('gulp-zip');
var fs = require('fs');
var clean = require('gulp-clean');
var git = require('git-rev')

var manifest = JSON.parse(fs.readFileSync('manifest.json'));


gulp.task('clean', function() {
    return gulp.src(['dist', 'coverage', 'doc'], { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('dist', ['clean'], function(cb) {
    git.short(function(gitShortCommitId) {
        gulp.src(['editor/**', 'renderer/**', 'assets/**', 'manifest.json'], { base: '.' })
            .pipe(zip(manifest.id + '-' + manifest.ver + '-' + gitShortCommitId + '.zip'))
            .pipe(gulp.dest('dist'))
            .on('en', cb);
    });
});

gulp.task('bower', function() {
    return bower();
});

gulp.task('jslint', function() {
    var fix = (process.argv.slice(2).indexOf('--fix') >= 0);
    return gulp
        .src(['**/*.js', '!node_modules/**', '!bower_components/**', '!coverage/**', '!docs/**'])
        .pipe(eslint({
            fix: fix,
        }))
        .pipe(eslint.formatEach('stylish', process.stderr))
        .pipe(eslint.failAfterError())
        .pipe(eslintIfFixed('.'));
});

gulp.task('jsonlint', function() {
    return gulp.src(['**/*.json', '!node_modules/**', '!bower_components/**', '!coverage/**', '!docs/**'])
        .pipe(jsonlint())
        .pipe(jsonlint.reporter());
});

gulp.task('test', ['clean', 'bower'], function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function(exitCode) {
        done();
        process.exit(exitCode);
    }).start();
});

gulp.task('test:watch', ['clean','bower'], function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, done).start();
});

gulp.task('doc', ['clean'], function(cb) {
    gulp.src(['README.md', './**/*.js', '!node_modules/**', '!bower_components/**', '!coverage/**', '!docs/**', '!test/**', '!testSupport/**'], { read: false })
        .pipe(jsdoc(cb));
});

gulp.task('lint', ['jslint', 'jsonlint'], function() {});

gulp.task('default', ['lint', 'test', 'dist'], function() {});
