// Core
import gulp from 'gulp';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import sourceMaps from 'gulp-sourcemaps';
// HTML
import fileInclude from 'gulp-file-include';
// Css
import cssNano from 'cssnano';
import postCss from 'gulp-postcss';
import patritialImport from 'postcss-partial-import';
import cssNext from 'postcss-cssnext';
import extend from 'postcss-extend';
import nested from 'postcss-nested';
// Img
import imgMin from 'gulp-imagemin';

// Path
const buildPath = './build';
const buildPathWatch = `${buildPath}/**/*.*`;

const path = {
  build: buildPath,
  watch: buildPathWatch,
  html: {
    core: './src/html/_index.html',
    src: './src/html/**/*.html',
    dest: buildPath,
  },
  css: {
    core: './src/style/index.pcss',
    src: './src/style/**/*.{pcss, css}',
    dest: buildPath,
  },
  img: {
    src: './src/img/**/*.{png,jpeg,jpg}',
    dest: `${buildPath}/img`,
  },
};

// PostCss plugins
const postCssPlugins = [
  patritialImport,
  cssNext({
    browsers: [
      'last 3 version',
      '> 1%',
      'IE 10',
    ],
  }),
  nested,
  extend,
  cssNano({ preset: 'default' }),
];

// HTML tasks
function htmlInclude(done) {
  gulp.src([path.html.core])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file',
    }))
    .pipe(rename({
      basename: 'index',
    }))
    .pipe(gulp.dest(path.build));
  done();
}

// Style tasks
function makeStyle(done) {
  gulp.src(path.css.core)
    .pipe(sourceMaps.init())
    .pipe(postCss(postCssPlugins))
    .pipe(sourceMaps.write('.'))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(path.build));
  done();
}

// Image tasks
function imageMin(done) {
  gulp.src(path.img.src)
    .pipe(imgMin())
    .pipe(gulp.dest(path.img.dest));
  done();
}

// Core tasks
function watch(done) {
  gulp.watch(path.html.src, htmlInclude);
  gulp.watch(path.css.src, makeStyle);
  done();
}

function serve(done) {
  browserSync.init({
    server: path.build,
  });
  browserSync.watch(path.watch, browserSync.reload);
  done();
}

// Tasks
export { imageMin as imagemin };

const def = gulp.parallel(watch, serve);

export default def;
