const child_process = require("child_process");

const { parallel, series, watch, src, dest } = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify"); // заменить на += -es
const cleancss = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");

const SASS_FILES = ["sass/**/*.sass", "sass/**/*.scss", "scss/**/*.scss", "scss/**/*.sass"];
const SASS_MAIN = "scss/style.scss";
const JS_FILES = "js/**/*.js";
const CSS_FILES = "css/**/*.css";
const SERVER_WATCH = ["bundle.min.css", "bundle.min.js", "index.html"];

function runServer() {
    let cmd = `live-server "${__dirname}" --watch="${SERVER_WATCH.join(",")}"`;
    child_process.exec(cmd);
}

function compileSass() {
    return src(SASS_MAIN)
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("css"));
}

function bundleCss() {
    return src(CSS_FILES)
        .pipe(concat("bundle.min.css"))
        .pipe(autoprefixer())
        .pipe(cleancss())
        .pipe(dest("./"));
}

function bundleStylesLive() {
    watch( SASS_FILES, series(compileSass, bundleCss) );
}

function bundleJs() {
    return src(JS_FILES)
        .pipe(concat("bundle.min.js"))
        .pipe(uglify())
        .pipe(dest("./"));
}

function bundleJsLive() {
    watch( JS_FILES, bundleJs );
}

function watchSass() {
    watch( SASS_FILES, series(compileSass, bundleCss) );
    runServer();
}

function watchJs() {
    watch( JS_FILES, bundleJs );
    runServer();
}

function watchAll() {
    watch( SASS_FILES, series(compileSass, bundleCss) );
    watch( JS_FILES, bundleJs );
    runServer();
}


exports.compilesass = compileSass;
exports.bundlecss = bundleCss;
exports.bundlejs = bundleJs;
exports.bundlestyles = series( compileSass, bundleCss );;
exports.bundleall = parallel( series(compileSass, bundleCss), bundleJs );
exports.watchsass = watchSass;
exports.watchjs = watchJs;
exports.watchall = watchAll;