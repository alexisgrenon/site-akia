var gulp = require('gulp');
var imagemin = require("gulp-imagemin");
var imageresize = require('gulp-image-resize');
var exec = require('child_process').exec;
var newer = require('gulp-newer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

// image resizing variables
var imagexl = 2620;
var imagefull = 1920;
var imagehalf = 1024;
var imagequart = 600;
var imagethumb = 80;
var imageload = 20;
var jsFiles = [
  'themes/akia/assets/js/vendor/jquery.2.2.3.min.js',
  'themes/akia/assets/js/vendor/bootstrap-select/dist/js/bootstrap-select.js',
  'themes/akia/assets/js/vendor/bootstrap/bootstrap.min.js',
  'themes/akia/assets/js/vendor/masonry.pkgd.js',
  'themes/akia/assets/js/vendor/Camera-master/scripts/jquery.mobile.customized.min.js',
  'themes/akia/assets/js/vendor/Camera-master/scripts/jquery.easing.1.3.js', 
  'themes/akia/assets/js/vendor/Camera-master/scripts/camera.min.js',
  'themes/akia/assets/js/vendor/bootstrap-mega-menu/js/menu.js',
  'themes/akia/assets/js/vendor/WOW-master/dist/wow.min.js',
  'themes/akia/assets/js/vendor/owl-carousel/owl.carousel.min.js',
  'themes/akia/assets/js/vendor/jquery.appear.js',
  'themes/akia/assets/js/vendor/jquery.countTo.js',
  'themes/akia/assets/js/vendor/fancybox/dist/jquery.fancybox.min.js',
  'themes/akia/assets/js/vendor/jquery.ripples-master/dist/jquery.ripples-min.js',
  'themes/akia/assets/js/vendor/jquery.mixitup.min.js',
  'themes/akia/assets/js/vendor/fancybox/dist/jquery.fancybox.min.js',
  'themes/akia/assets/js/theme/theme.js',
  // 'themes/akia/assets/js/vendor/instafeed.min.js',
  // 'themes/akia/assets/js/vendor/lazyload.js',
  // 'themes/akia/assets/js/vendor/jquery.sticky-sidebar.js',
  'themes/akia/assets/js/main.js'
];
var contactJsFiles = [
  'themes/akia/assets/js/vendor/jquery.2.2.3.min.js',
  'themes/akia/assets/js/vendor/bootstrap-select/dist/js/bootstrap-select.js',
  'themes/akia/assets/js/vendor/bootstrap/bootstrap.min.js',
  'themes/akia/assets/js/vendor/Camera-master/scripts/jquery.mobile.customized.min.js',
  'themes/akia/assets/js/vendor/Camera-master/scripts/jquery.easing.1.3.js', 
  'themes/akia/assets/js/vendor/Camera-master/scripts/camera.min.js',
  'themes/akia/assets/js/vendor/bootstrap-mega-menu/js/menu.js',
  'themes/akia/assets/js/vendor/WOW-master/dist/wow.min.js',
  'themes/akia/assets/js/vendor/owl-carousel/owl.carousel.min.js',
  'themes/akia/assets/js/vendor/jquery.appear.js',
  'themes/akia/assets/js/vendor/jquery.countTo.js',
  'themes/akia/assets/js/vendor/fancybox/dist/jquery.fancybox.min.js',
  'themes/akia/assets/js/vendor/jquery.ripples-master/dist/jquery.ripples-min.js',
  'themes/akia/assets/js/vendor/contact-form/validate.js',
  'themes/akia/assets/js/vendor/contact-form/jquery.form.js',
  'themes/akia/assets/js/vendor/gmaps.min.js',
  'themes/akia/assets/js/theme/theme.js',
  'themes/akia/assets/js/theme/map-script.js',
  // 'themes/akia/assets/js/vendor/instafeed.min.js',
  // 'themes/akia/assets/js/vendor/lazyload.js',
  // 'themes/akia/assets/js/vendor/jquery.sticky-sidebar.js',
  'themes/akia/assets/js/main.js'
];
var jsDest = 'themes/akia/static/js';
 
// resize and optimize images
function imageResize() {
  return gulp.src("themes/akia/source-images/*.{jpg,png,jpeg,JPG,gif}")
  .pipe(newer("themes/akia/static/img"))
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({optimizationLevel: 5})
  ]))
  .pipe(imageresize({ width: imagexl}))
  .pipe(gulp.dest("themes/akia/static/xl/img"))
  .pipe(imageresize({ width: imagefull }))
  .pipe(gulp.dest("themes/akia/static/img"))
  .pipe(imageresize({ width: imagehalf }))
  .pipe(gulp.dest("themes/akia/static/half/img"))
  .pipe(imageresize({ width: imagequart }))
  .pipe(gulp.dest("themes/akia/static/quart/img"))
  .pipe(imageresize({ width: imagethumb }))
  .pipe(gulp.dest("themes/akia/static/thumb/img"))
  .pipe(imageresize({ width: imageload }))
  .pipe(gulp.dest("themes/akia/static/load/img"));
};

// hugo production call
function hugo(cb) {
  exec('hugo --cleanDestinationDir', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
};

function sassTask() {
  return gulp.src('themes/akia/assets/scss/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(rename('main.min.css'))
  .pipe(sourcemaps.write('themes/akia/static/css'))
  .pipe(gulp.dest('themes/akia/static/css'));
};

function scriptsNormal() {
  return gulp.src(jsFiles)
  // .pipe(sourcemaps.init())
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  // .pipe(sourcemaps.write(jsDest))
  .pipe(gulp.dest(jsDest));
};

function scriptsContact() {
  return gulp.src(contactJsFiles)
  // .pipe(sourcemaps.init())
  .pipe(concat('main-contact.min.js'))
  .pipe(uglify())
  // .pipe(sourcemaps.write(jsDest))
  .pipe(gulp.dest(jsDest));
}

var scripts = gulp.parallel(scriptsNormal, scriptsContact);

// watching
function watch() {
  // browserSync.init({
  //     proxy: "http://localhost:1313/"
  // });

  gulp.watch('themes/akia/source-images/*.{jpg,png,jpeg,gif,JPG}', imageResize );
  gulp.watch('themes/akia/assets/scss/**/*.scss', sassTask);
  gulp.watch('themes/akia/assets/js/**/*.js', scripts);
};
exports.watch = watch;

// watching images and resizing
exports.dev = gulp.series(imageResize, watch);

// optimizing images and calling hugo for production
exports.prod = gulp.series(imageResize, hugo);