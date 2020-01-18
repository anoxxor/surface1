let { series, watch, src, dest } = require("gulp");
let sass = require("gulp-sass");
let concat = require("gulp-concat");
let uglify = require("gulp-uglify");
let cleancss = require("gulp-clean-css");
let autoprefixer = require("gulp-autoprefixer");
sass.compiler = require("node-sass");

let sassFiles = ["sass/**/*.sass", "sass/**/*.scss", "scss/**/*.scss", "scss/**/*.sass"];
let sassBundle = "scss/style.scss";

function compileSass() {
    return src(sassBundle)
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("css"));
}

function bundleCss() {
    return src("css/**/*.css")
        .pipe(concat("bundle.min.css"))
        .pipe(autoprefixer())
        .pipe(cleancss())
        .pipe(dest("./"));
}

exports.sass = function() {
    watch(sassFiles, compileSass);
}

exports.jsbundle = function() {
    return src("js/**/*.js")
        .pipe(concat("bundle.min.js"))
        .pipe(uglify())
        .pipe(dest("./"));
}

exports.cssbundle = bundleCss;

exports.sassbundle = series(compileSass, bundleCss);