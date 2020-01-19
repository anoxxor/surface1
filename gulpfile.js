const child_process = require("child_process");

const { parallel, series, watch, src, dest } = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleancss = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");

const sassFiles = ["sass/**/*.sass", "sass/**/*.scss", "scss/**/*.scss", "scss/**/*.sass"];
const sassMain = "scss/style.scss";
const jsFiles = "js/**/*.js";
const cssFiles = "css/**/*.css";
const reloadTriggers = ["bundle.min.css", "bundle.min.js", "index.html"];

function compileSass() {
    return src(sassMain)
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("css"));
}

function bundleCss() {
    return src(cssFiles)
        .pipe(concat("bundle.min.css"))
        .pipe(autoprefixer())
        .pipe(cleancss())
        .pipe(dest("./"));
}

function bundleJs() {
    return src(jsFiles)
        .pipe(concat("bundle.min.js"))
        .pipe(uglify())
        .pipe(dest("./"));
}

exports.sassCompileLive = function() {
    watch(sassFiles, compileSass);
}

exports.jsBundle = bundleJs;

exports.cssBundle = bundleCss;

exports.sassCompileBundle = series( compileSass, bundleCss );;

exports.bundle = parallel( series(compileSass, bundleCss), bundleJs );

exports.bundleLive = function() {
    watch( sassFiles, series(compileSass, bundleCss) );
    watch( jsFiles, bundleJs );

    let cmd = `live-server "${__dirname}" --watch="${reloadTriggers.join(",")}"`;
    child_process.exec(cmd);
}