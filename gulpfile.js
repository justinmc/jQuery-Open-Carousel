gulp = require('gulp');

clean = require('gulp-clean');
coffee = require('gulp-coffee');

var bases = {
    src: 'src/',
    examples: 'examples/'
};

var paths = {
    compiled: [
        bases.src + 'jquery.openCarousel.js',
        bases.examples + 'addRemove/scripts/jquery.openCarousel.js',
        bases.examples + 'cycle/scripts/jquery.openCarousel.js',
        bases.examples + 'fullscreen/scripts/jquery.openCarousel.js',
        bases.examples + 'main/scripts/jquery.openCarousel.js',
        bases.examples + 'vertical/scripts/jquery.openCarousel.js'
    ]
};

// Delete all generated js files
gulp.task('clean', function() {
    gulp.src(paths.compiled)
        .pipe(clean());
});

// Compile coffeescript in the src directory
gulp.task('coffee', function() {
    gulp.src('src/jquery.openCarousel.coffee')
        .pipe(coffee())
        .pipe(gulp.dest(bases.src));
});

// Copy compiled javascript to example directories
gulp.task('copy', function() {
    gulp.src('src/jquery.openCarousel.js')
        .pipe(gulp.dest(bases.examples + 'addRemove/scripts/'))
        .pipe(gulp.dest(bases.examples + 'cycle/scripts/'))
        .pipe(gulp.dest(bases.examples + 'fullscreen/scripts/'))
        .pipe(gulp.dest(bases.examples + 'main/scripts/'))
        .pipe(gulp.dest(bases.examples + 'vertical/scripts/'));
});

gulp.task('default', ['clean', 'coffee', 'copy']);

