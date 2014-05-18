var gulp = require('gulp');

var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var bases = {
    src: 'src/',
    examples: 'examples/'
};

var paths = {
    compiled: [
        bases.src + 'jquery.openCarousel.js',
        bases.src + 'jquery.openCarousel.min.js',
        bases.examples + 'addRemove/scripts/jquery.openCarousel.js',
        bases.examples + 'cycle/scripts/jquery.openCarousel.js',
        bases.examples + 'fullwidth/scripts/jquery.openCarousel.js',
        bases.examples + 'responsive/scripts/jquery.openCarousel.js',
        bases.examples + 'main/scripts/jquery.openCarousel.js',
        bases.examples + 'vertical/scripts/jquery.openCarousel.js'
    ]
};

// Delete all generated js files
gulp.task('clean', function() {
    return gulp.src(paths.compiled)
        .pipe(clean());
});

// Compile coffeescript in the src directory
gulp.task('coffee', ['clean'], function() {
    return gulp.src(bases.src + 'jquery.openCarousel.coffee')
        .pipe(coffee())
        .pipe(gulp.dest(bases.src));
});

// Create a minified version of the main script
gulp.task('uglify', ['clean', 'coffee'], function() {
    return gulp.src(bases.src + 'jquery.openCarousel.js')
        .pipe(uglify())
        .pipe(concat('jquery.openCarousel.min.js'))
        .pipe(gulp.dest(bases.src));
});

// Copy compiled javascript and css to example directories
gulp.task('copy', ['clean', 'coffee', 'uglify'], function() {
    gulp.src('src/jquery.openCarousel.css')
        .pipe(gulp.dest(bases.examples + 'addRemove/styles/'))
        .pipe(gulp.dest(bases.examples + 'cycle/styles/'))
        .pipe(gulp.dest(bases.examples + 'fullwidth/styles/'))
        .pipe(gulp.dest(bases.examples + 'responsive/styles/'))
        .pipe(gulp.dest(bases.examples + 'main/styles/'))
        .pipe(gulp.dest(bases.examples + 'vertical/styles/'));

    return gulp.src('src/jquery.openCarousel.js')
        .pipe(gulp.dest(bases.examples + 'addRemove/scripts/'))
        .pipe(gulp.dest(bases.examples + 'cycle/scripts/'))
        .pipe(gulp.dest(bases.examples + 'fullwidth/scripts/'))
        .pipe(gulp.dest(bases.examples + 'responsive/scripts/'))
        .pipe(gulp.dest(bases.examples + 'main/scripts/'))
        .pipe(gulp.dest(bases.examples + 'vertical/scripts/'));
});

// Run the tests
gulp.task('test', ['clean', 'coffee', 'uglify', 'copy'], function() {
    return gulp.src('test/test.js')
        .pipe(mocha({reporter: 'nyan'}));
});

// Watch for in development
gulp.task('watch', function() {
    gulp.watch(bases.src + 'jquery.openCarousel.coffee', ['coffee', 'copy']);
});

gulp.task('default', ['clean', 'coffee', 'uglify', 'copy', 'test']);

