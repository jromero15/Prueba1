'use strict';

var args = require('yargs').argv,
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = require('path'),
    runSequence = require('run-sequence'),
    gulpsync = $.sync(gulp),
    PluginError = $.util.PluginError,
    del = require('del'),
    connect = require('gulp-connect'),
    gutil = require('gulp-util'),
    sequence = require('run-sequence'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    prettify = require('gulp-prettify'),
    less = require('gulp-less'),
    notify = require('gulp-notify'),
    minify = require('gulp-minify-css'),
    server_port = 9876,
    // a delay before triggering browser reload to ensure everything is compiled
    livereloadDelay = 2000;

//--------------------------------------------------------------------------------
// variables
//--------------------------------------------------------------------------------
// config
var config = require('./config.json');

// vendor
var vendor = {
    base: {
        source: require('./vendor.json'),
        jsmin: 'vendor.js',
        thirdmin: 'thirdparty.js',
        cssmin: 'vendor.css'
    }
};

var pkg = require('./package.json');

var banner = '/*!\n' +
    ' * ' + pkg.name + ' (' + pkg.homepage + ')\n' +
    ' * Version ' + pkg.version + '\n' +
    ' * Copyright ' + new Date().getFullYear() + ' ' + pkg.author.name + '\n' +
    ' * Licensed under the ' + pkg.license + '\n' +
    ' */\n';

function pumped(achievement) {
    var exclamations = [
        'Sweet',
        'Awesome',
        'Epic',
        'Wow',
        'Yippee ki-yay',
        'Yay',
        'YEAH!',
        'Exitos',
        'Booyah'
    ];

    var randomIndex = Math.floor(Math.random() * exclamations.length);

    return [exclamations[randomIndex], '! ', achievement].join('');
};

var paths = {
    index: [
        config.source.html.index + '/index.html',
    ],
    views: [
        config.source.html.partials + '/*.html',
        config.source.html.views + '/**/*.html',
        config.source.shared.html + '/*.html'
    ],
    images: [
        config.source.images + '/**/*.*'
    ],
    scripts: [
        config.source.js.main + '/main.js',

        config.source.js.modules + '/**/*.module.js',
        config.source.js.modules + '/**/*.js',

        config.source.shared.js + '/**/*.js'
    ],
    libs: [
        config.source.libs.index + '/*.js'
    ],
    lazylibs: [
        config.source.lazylibs.index + '/**/*.js'
    ],
    mapstyles: [
        config.source.mapstyles.index + '/**/*.js'
    ],
    styles: {
        css: config.source.styles.css + '/**/*.css',
        fonts: config.source.styles.fonts + '/**/*.*',
        less: config.source.styles.less + '/**/*.less',
        sass: config.source.styles.sass + '/**/*.sass',
        vendor: config.source.styles.vendor + '/**/*.css',
    }
}

var isProduction = false;

// styles sourcemaps
var useSourceMaps = false;

gutil.log(gutil.colors.green('Starting to Gulp! Please wait...'));

//-------------------------------------------------------------
// PROD TASK
//-------------------------------------------------------------
gulp.task('prod', function() {
    gutil.log(gutil.colors.blue('Starting build, in production mode...'));
    isProduction = true;
});

//-------------------------------------------------------------
// WATCH TASK
//-------------------------------------------------------------
gulp.task('watch', function() {
    //log('Starting watch and LiveReload..');
    gutil.log(gutil.colors.green('Starting watch and LiveReload...'));

    $.livereload.listen();
    //watch and build index
    gulp.watch(paths.index, ['html:index']);
    //watch and build views
    gulp.watch(paths.views, ['html:views']);
    //watch and build scripts
    gulp.watch(paths.scripts, ['scripts:apps']);
    gulp.watch(paths.scripts, ['scripts:homelibs']);
    gulp.watch(paths.scripts, ['scripts:libs']);
    //watch and build libs scripts
    gulp.watch(paths.libs, ['scripts:libs']);
    //watch and build styles
    gulp.watch(paths.styles.css, ['styles:app']);
    gulp.watch(paths.styles.fonts, ['fonts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.styles.vendor, ['vendor:styles']);

    // list of source file to watch for live reload
    var watchSource = [].concat(
        paths.index,
        paths.views,
        paths.scripts,
        paths.libs,
        paths.styles.css,
        paths.styles.fonts
    );

    gulp
        .watch(watchSource)
        .on('change', function(event) {
            setTimeout(function() {
                gutil.log(gutil.colors.blue('on change livereload ' + event.path));
                $.livereload.changed(event.path);
            }, livereloadDelay);
        });
});

//-------------------------------------------------------------
// HTML TASK
//-------------------------------------------------------------
gulp.task('html:index', function(done) {
    return gulp.src(paths.index)
        .pipe(plumber())
        .pipe(prettify(config.prettify))
        .pipe(plumber())
        .pipe($.if(isProduction, $.htmlmin({
            collapseWhitespace: true
        })))
        .pipe(plumber())
        .pipe(gulp.dest(config.destination.index))
        .pipe($.if(isProduction, notify({
            message: pumped('HTML Generated & Minified!'),
            onLast: true
        })));
});

gulp.task('html:views', function(done) {
    return gulp.src(paths.views)
        .pipe(plumber())
        .pipe(prettify(config.prettify))
        .pipe(plumber())
        .pipe($.if(isProduction, $.htmlmin({
            collapseWhitespace: true
        })))
        .pipe(plumber())
        .pipe(gulp.dest(config.destination.views))
        .pipe($.if(isProduction, notify({
            message: pumped('HTML Views Generated & Minified!'),
            onLast: true
        })));
});

gulp.task('html:clean', function(done) {
    del(config.destination.index + '/index.html', {
            force: true
        })
        .then(function() {
            done();
        });
});

gulp.task('dist-html', function(done) {
    sequence('html:clean', 'html:index', 'html:views', function() {
        done();
    });
});

//-------------------------------------------------------------
// VENDOR TASK
//-------------------------------------------------------------
gulp.task('vendor:libs', function() {
    gutil.log(gutil.colors.green('Copying base vendor libs...'));
    return gulp.src(vendor.base.source.libs)
        .pipe(plumber())
        .pipe($.expectFile(vendor.base.source.libs))
        .pipe(plumber())
        .pipe($.concat(vendor.base.jsmin))
        .pipe(plumber())
        .pipe($.header(banner))
        .pipe(plumber())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(config.destination.js))
        .pipe(notify({
            message: pumped('Vendor libs Generated & Minified!'),
            onLast: true
        }));
});

gulp.task('vendor:thirdparty', function() {
    gutil.log(gutil.colors.green('Copying base vendor libs...'));
    return gulp.src(vendor.base.source.thirdparty)
        .pipe(plumber())
        .pipe($.expectFile(vendor.base.source.thirdparty))
        .pipe(plumber())
        .pipe($.concat(vendor.base.thirdmin))
        .pipe(plumber())
        .pipe($.header(banner))
        .pipe(plumber())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(config.destination.js))
        .pipe(notify({
            message: pumped('Vendor thirdparty libs Generated & Minified!'),
            onLast: true
        }));
});

gulp.task('vendor:styles', function() {
    gutil.log(gutil.colors.green('Copying base vendor assets...'));
    return gulp.src(paths.styles.vendor)
        .pipe(plumber())
        .pipe($.expectFile(paths.styles.vendor))
        .pipe(plumber())
        .pipe($.concat(vendor.base.cssmin))
        .pipe(plumber())
        .pipe($.header(banner))
        .pipe(plumber())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(config.destination.css))
        .pipe(notify({
            message: pumped('Vendor styles Generated & Minified!'),
            onLast: true
        }));
});

gulp.task('dist-vendor', function(done) {
    sequence('vendor:libs', 'vendor:thirdparty', 'vendor:styles', function() {
        done();
    });
});

//-------------------------------------------------------------
// STYLES TASK
//-------------------------------------------------------------
gulp.task('styles:app', function(done) {
    return gulp.src(paths.styles.css)
        .pipe(plumber())
        .pipe(plumber())
        .pipe($.if(isProduction, minify(config.minify)))
        .pipe(plumber())
        .pipe($.concat(config.source.styles.name))
        .pipe(plumber())
        .pipe($.header(banner))
        .pipe(plumber())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(config.destination.css))
        .pipe(notify({
            message: pumped('CSS Generated & Minified!'),
            onLast: true
        }));
});

gulp.task('styles:clean', function(done) {
    del(config.destination.css, {
            force: true
        })
        .then(function() {
            done();
        });
});

gulp.task('dist-styles', function(done) {
    sequence('styles:clean', 'styles:app', function() {
        done();
    });
});

//-------------------------------------------------------------
// SCRIPTS TASK
//-------------------------------------------------------------
gulp.task('scripts:apps', function(done) {
    gutil.log(gutil.colors.green('Generating scripts...'));
    var jsFilter = $.filter('**/*.js', {
        restore: true
    });

    return gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe($.jsvalidate())
        .pipe(plumber())
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe(plumber())
        .pipe($.concat(config.source.js.name))
        .pipe(plumber())
        .pipe($.ngAnnotate())
        .pipe(plumber())
        .pipe($.if(isProduction, $.uglify({
            preserveComments: 'some'
        })))
        .pipe(plumber())
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe($.if(isProduction, $.header(banner)))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(config.destination.js))
        .pipe(notify({
            message: pumped('JS Generated & Minified!'),
            onLast: true
        }));
});

gulp.task('scripts:homelibs', function(done) {
    gutil.log(gutil.colors.green('Generating libs scripts...'));
    var jsFilter = $.filter('*.js', {
        restore: true
    });

    return gulp.src(paths.libs)
        .pipe(plumber())
        .pipe($.jsvalidate())
        .pipe(plumber())
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe(plumber())
        .pipe($.ngAnnotate())
        .pipe(plumber())
        .pipe($.if(isProduction, $.uglify({
            preserveComments: 'some'
        })))
        .pipe(plumber())
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(plumber())
        .pipe($.if(isProduction, $.header(banner)))
        .pipe(plumber())
        .pipe(gulp.dest(config.destination.libs))
        .pipe(notify({
            message: pumped('JS Generated & Minified!'),
            onLast: true
        }));
});

gulp.task('vendor:lazylibs', function() {
    gutil.log(gutil.colors.green('Copying base vendor lazylibs...'));
    return gulp.src(vendor.base.source.lazylibs)
        .pipe(plumber())
        .pipe($.expectFile(vendor.base.source.lazylibs))
        .pipe(plumber())
        .pipe($.ngAnnotate())
        .pipe(plumber())
        .pipe(gulp.dest(config.destination.libs))
        .pipe(notify({
            message: pumped('Vendor lazylibs Generated & Minified!'),
            onLast: true
        }));
});

gulp.task('scripts:mapstyles', function(done) {
    gutil.log(gutil.colors.green('Copying map styles...'));
    var jsFilter = $.filter('**/*.js', {
        restore: true
    });

	return gulp.src(paths.mapstyles)
        .pipe(plumber())
        .pipe($.jsvalidate())
        .pipe(plumber())
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe(plumber())
        .pipe($.ngAnnotate())
        .pipe(plumber())
        .pipe($.if(isProduction, $.uglify({
            preserveComments: 'some'
        })))
        .pipe(plumber())
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(plumber())
        .pipe(gulp.dest(config.destination.libs))
        .pipe(notify({
            message: pumped('map styles Generated!'),
            onLast: true
        }));
});

gulp.task('scripts:lazylibs', ['vendor:lazylibs'], function(done) {
    gutil.log(gutil.colors.green('Copying lazy libs scripts...'));
    var jsFilter = $.filter('**/*.js', {
        restore: true
    });

	return gulp.src(paths.lazylibs)
        .pipe(plumber())
        .pipe($.jsvalidate())
        .pipe(plumber())
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe(plumber())
        .pipe($.ngAnnotate())
        .pipe(plumber())
        .pipe($.if(isProduction, $.uglify({
            preserveComments: 'some'
        })))
        .pipe(plumber())
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(plumber())
        .pipe(gulp.dest(config.destination.libs))
        .pipe(notify({
            message: pumped('JS lazy libs Generated!'),
            onLast: true
        }));
});

gulp.task('scripts:libs', function(done) {
    sequence('scripts:homelibs', 'scripts:lazylibs', 'scripts:mapstyles', function() {
        done();
    });
});

gulp.task('scripts:clean', function(done) {
    del(config.destination.js, {
            force: true
        })
        .then(function() {
            done();
        });
});

gulp.task('dist-js', function(done) {
    sequence('scripts:clean', 'scripts:apps', 'scripts:homelibs', 'scripts:lazylibs', 'scripts:libs', function() {
        done();
    });
});

//-------------------------------------------------------------
// FONTS TASK
//-------------------------------------------------------------
gulp.task('fonts', function() {
    gutil.log(gutil.colors.blue('Copying fonts...'));
    return gulp.src(paths.styles.fonts)
        .pipe($.expectFile(paths.styles.fonts))
        .pipe(gulp.dest(config.destination.fonts));
});

//-------------------------------------------------------------
// IMAGES TASK
//-------------------------------------------------------------
gulp.task('images', function() {
    gutil.log(gutil.colors.blue('Copying images...'));
    return gulp.src(paths.images)
        .pipe($.expectFile(paths.images))
        .pipe(gulp.dest(config.destination.images));
});

//-------------------------------------------------------------
// GAE-DEPLOY TASK
//-------------------------------------------------------------
gulp.task('deploy', ['update-yaml', 'update-phpini', 'gae-deploy']);

// copy app.yaml from root folder into the dist folder
gulp.task('update-yaml', function() {
    gutil.log(gutil.colors.blue('Updating yaml configuration...'));
    return gulp.src('app.yaml')
        .pipe(plumber())
        .pipe($.expectFile('app.yaml'))
        .pipe(plumber())
        .pipe(gulp.dest(config.destination.index));
});

// copy php.ini from root folder into the dist folder
gulp.task('update-phpini', function() {
    gutil.log(gutil.colors.blue('Updating php ini configuration...'));
    return gulp.src('php.ini')
        .pipe(plumber())
        .pipe($.expectFile('php.ini'))
        .pipe(plumber())
        .pipe(gulp.dest(config.destination.index));
});

//deploy on GAE using dist/app.yaml
gulp.task('gae-deploy', ['update-yaml'], function() {
    gutil.log(gutil.colors.blue('Deploying on GAE server......'));
    return gulp.src(config.destination.gae)
        .pipe(plumber())
        .pipe($.expectFile(config.destination.gae))
        .pipe(plumber())
        //alternative using version
        //.pipe(gae('appcfg.py', ['update'], {version: 'beta'}));
        .pipe($.gae('appcfg.py', ['update']));
});

//-------------------------------------------------------------
// MAIN TASK
//-------------------------------------------------------------
gulp.task('dist-clean', function(done) {
    del(config.destination.index, {
            force: true
        })
        .then(function() {
            done();
        });
});

gulp.task('default', function() {
    gutil.log(gutil.colors.blue('================================'));
    gutil.log(gutil.colors.blue('Welcome, use build task instead!'));
    gutil.log(gutil.colors.blue('================================'));
});

gulp.task('build', function(done) {
    sequence('dist-clean', 'dist-html', 'dist-js', 'dist-styles', 'dist-vendor', 'fonts', 'images', function() {
        done();
    });
});

//-------------------------------------------------------------
// WEBSERVER TASK
//-------------------------------------------------------------
gulp.task('webserver', ['watch'], function() {
    connect.server({
        livereload: true,
        root: ['dist/'],
        port: server_port
    });
});
