var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	clean = require('gulp-clean'),
	imagemin = require('gulp-imagemin'),
	runSequence = require('gulp-run-sequence'),
	rigger = require('gulp-rigger'),
	sass = require('gulp-sass');

var path = {
	src : {
		sass: 'src/sass/**/*.scss',
		maps: 'src/maps/',
		img: 'src/images/*',
		html: 'src/html/**/*.html'
	},
	dest: {
		dest: 'dest',
		css: 'dest/css/',
		maps: 'maps/',
		img: 'dest/images/',
		html: '.'
	}
}

gulp.task('clean', function () {
  return gulp.src(path.dest.dest, {read: false})
    .pipe(clean());
});

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(plumber())
        .pipe(gulp.dest(path.dest.html));  
});

gulp.task('sass', function () {
  return gulp.src(path.src.sass)
  	.pipe(sourcemaps.init())
  	.pipe(plumber())
  	.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write(path.dest.maps))
    .pipe(gulp.dest(path.dest.css));
});

gulp.task('images', function() {
  return gulp.src(path.src.img)
    // Pass in options to the task
    .pipe(imagemin({
    	optimizationLevel: 10,
    	progressive: true
    }))
    .pipe(gulp.dest(path.dest.img));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch(path.src.html, ['html']);
  	gulp.watch(path.src.sass, ['sass']);
 	gulp.watch(path.src.img, ['images']);
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', function() {
  runSequence('clean', ['sass', 'images', 'html', 'watch']);
});
