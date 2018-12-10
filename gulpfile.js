const babel = require("gulp-babel");
const gulp = require("gulp");
const concat = require("gulp-concat");
let cleanCSS = require("gulp-clean-css");
const watch = require("gulp-watch");

const browserSync = require("browser-sync").create();

// "./node_modules/moment/min/moment.min.js",


gulp.task("bower_components.min.js", () => {
  return gulp.src([
      "./node_modules/htmlelement-extension/distrib/htmlelement.min.js",
      "./node_modules/promise-polyfill/dist/polyfill.min.js",
      "./node_modules/chart.js/dist/Chart.js"
    ])
    .pipe(concat("app/bower_components.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: false
    }))
    .pipe(gulp.dest("./distrib"));
});

gulp.task("html", () => {
  return gulp.src(["src/index.html"])
    .pipe(gulp.dest("./distrib"));
});

gulp.task("npm-analytics.min.js", () => {
  return gulp.src([
      "src/**.js"
    ])
    .pipe(concat("app/npm-analytics.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: false
    }))
    //.pipe(uglify())
    //.on('error', function(err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    // .pipe(umd())
    .pipe(gulp.dest("./distrib"))
});


gulp.task("watch:npm-analytics.min.js", function() {
  watch("./src/**.js", gulp.series("npm-analytics.min.js"));
});

gulp.task("watch:html", function() {
  watch("./src/**.html", gulp.series("html"));
});

gulp.task("npm-analytics.min.css", () => {
  return gulp.src([
      "./src/*.css"
    ])
    .pipe(concat("app/npm-analytics.min.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./distrib"));
});

gulp.task("watch:html", function() {
  watch("./src/**.html", gulp.series("html"));
});

gulp.task("watch:npm-analytics.min.css", function() {
  watch("./src/**.css", gulp.series("npm-analytics.min.css"));
});

gulp.task("serve", function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task("default", gulp.series("npm-analytics.min.js"));


gulp.task("all", gulp.series("default", "bower_components.min.js", "html", "npm-analytics.min.css"));

gulp.task("watch", gulp.parallel("watch:npm-analytics.min.js", "watch:html", "watch:npm-analytics.min.css"));