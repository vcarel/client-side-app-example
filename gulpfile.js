var gulp = require('gulp');

var pkg = require('./package.json');
var dirs = {
    compile: 'build/compile/',
    minify: 'build/minify/',
    resource: 'resource_' + pkg.version + '/',
    dist: 'dist/'
};


gulp.task('default', function (done) {
    var chalk = require('chalk');
    console.log('');
    console.log(chalk.bold('Available tasks'));
    console.log(chalk.cyan('      build') + ' Build and minify the application.');
    console.log(chalk.cyan('      clean') + ' Clean the build directory.');
    console.log(chalk.cyan.bold('    default') + ' Display this help.');
    console.log(chalk.cyan('       dist') + ' Create a distributable .tar.gz file.');
    console.log(chalk.cyan('      watch') + ' Build continuously whenever a file changes.');
    console.log('');
    done();
});

gulp.task('watch', ['build'], function (done) {
    gulp.watch('src/js/*', ['js']);
    gulp.watch('src/styl/*', ['css']);
    gulp.watch('src/main.mustache', ['html']);
    gulp.watch('src/img/*', ['img']);

    var chalk = require('chalk');
    console.log(chalk.yellow('Now watching source files...'));
    done();
});

gulp.task('build', ['js', 'css', 'html', 'img'], function (done) {
    var chalk = require('chalk');
    console.log(chalk.green('Successfully built application.') + ' The following files are available:');
    console.log(chalk.cyan('    build/compile/main.html') + ' unminified version for debugging purpose');
    console.log(chalk.cyan('     build/minify/main.html') + ' distributable version, minified');
    done();
});

gulp.task('clean', function () {
    var clean = require('gulp-clean');
    return gulp.src([dirs.compile, dirs.minify], {read: false})
        .pipe(clean());
});

gulp.task('clean-img', function () {
    var clean = require('gulp-clean');
    return gulp.src([dirs.compile + dirs.resource + 'img', dirs.minify + dirs.resource + 'img'], {read: false})
        .pipe(clean());
});

gulp.task('jshint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src(['gulpfile.js', 'src/js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('js', ['jshint'], function () {
    var uglify = require('gulp-uglify');
    var webmake = require('gulp-webmake');
    return gulp.src('src/js/main.js')
        .pipe(webmake())
        .pipe(gulp.dest(dirs.compile + dirs.resource))
        .pipe(uglify())
        .pipe(gulp.dest(dirs.minify + dirs.resource));
});

gulp.task('css', function () {
    var minifyCSS = require('gulp-minify-css');
    var nib = require('nib');
    var stylus = require('gulp-stylus');
    return gulp.src('src/styl/main.styl')
        .pipe(stylus({
            use: nib()
        }))
        .pipe(gulp.dest(dirs.compile + dirs.resource))
        .pipe(minifyCSS())
        .pipe(gulp.dest(dirs.minify + dirs.resource));
});

gulp.task('html', function () {
    var extReplace = require('gulp-ext-replace');
    var minifyHTML = require('gulp-minify-html');
    var mustache = require('gulp-mustache');
    return gulp.src('src/main.mustache')
        .pipe(mustache({
            css_dir: dirs.resource,
            img_dir: dirs.resource + 'img',
            js_dir: dirs.resource
        }))
        .pipe(extReplace('.html'))
        .pipe(gulp.dest(dirs.compile))
        .pipe(minifyHTML({
            empty: true,
            cdata: true,
            conditionals: true,
            spare: true
        }))
        .pipe(gulp.dest(dirs.minify));
});

gulp.task('img', ['clean-img'], function () {
    return gulp.src('src/img/**')
        .pipe(gulp.dest(dirs.compile + dirs.resource + 'img'))
        .pipe(gulp.dest(dirs.minify + dirs.resource + 'img'));
});

gulp.task('dist', ['build'], function () {
    var gzip = require('gulp-gzip');
    var print = require('gulp-print');
    var tar = require('gulp-tar');
    return gulp.src(dirs.minify + '**')
        .pipe(tar(pkg.name + '_' + pkg.version + '.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('dist'))
        .pipe(print());
});

