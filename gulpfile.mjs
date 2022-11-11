import gulp from "gulp";
import { htmlValidator } from "gulp-w3c-html-validator";
import htmlmin from "gulp-htmlmin";
import fileinclude from "gulp-file-include";
import imagemin from "gulp-imagemin";

import dartSass from "sass";
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import autoprefixer from "gulp-autoprefixer";
import { deleteSync } from "del";
import minify from "gulp-minify";
import { create as browsersync } from "browser-sync";
const browserSync = browsersync();

const sass = gulpSass(dartSass);

gulp.task("watchFiles", function () {
  gulp.watch("./src/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("./src/**/*.html", gulp.series("html"));
  gulp.watch("./src/img/**/*", gulp.series("img"));
  gulp.watch("./src/js/**/*.js", gulp.series("scripts"));
});

gulp.task("browsersync", function () {
  browserSync.init({
    server: { baseDir: `dist/` },
    notify: false,
    online: true,
  });
});

gulp.task("validate", function () {
  return gulp
    .src(["src/**/*.html", "!src/sections/**/*.html"])
    .pipe(htmlValidator.analyzer())
    .pipe(htmlValidator.reporter());
});

gulp.task("html", function () {
  return gulp
    .src(["src/**/*.html", "!src/sections/**/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist"))
    .pipe(browserSync.stream());
});

gulp.task("img", function () {
  return gulp.src("src/img/**/*").pipe(imagemin()).pipe(gulp.dest("./dist/img")).pipe(browserSync.stream());
});

gulp.task("styles", function () {
  return gulp
    .src(["./src/sass/**/*.scss", "!src/sass/components/*"])
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ["last 2 versions"], grid: true }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

gulp.task("scripts", function () {
  return gulp
    .src("src/js/**/*.js")
    .pipe(
      minify({
        ext: {
          min: ".min.js",
        },
      })
    )
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

gulp.task("fonts", function () {
  return gulp.src(`src/fonts/**/*.{ttf,woff,woff2,eot,svg}`).pipe(gulp.dest(`dist/fonts`));
});

gulp.task("clean", function (done) {
  deleteSync("./dist/**/*", { force: true });
  done();
});

gulp.task("build", gulp.series("clean", "validate", "html", "img", "styles", "scripts", "fonts"));
gulp.task("start", gulp.parallel("build", "browsersync", "watchFiles"));
