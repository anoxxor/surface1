let { watch, src, dest } = require("gulp");
let sass = require("gulp-sass");
let concat = require("gulp-concat");
let uglify = require("gulp-uglify");
let cleancss = require("gulp-clean-css");
let autoprefixer = require("gulp-autoprefixer");
sass.compiler = require("node-sass");

let sassFiles = ["sass/**/*.sass", "sass/**/*.scss", "scss/**/*.scss", "scss/**/*.sass"]
let sassBundle = "scss/style.scss"

exports.sass = function() {
    watch(sassFiles, function() {
        return src(sassBundle)
            .pipe(sass().on("error", sass.logError))
            .pipe(dest("css"));
    })
}

exports.jsbundle = function() {
    return src("js/**/*.js")
        .pipe(concat("bundle.min.js"))
        .pipe(uglify())
        .pipe(dest("js/"));
}

exports.cssbundle = function() {
    return src("css/**/*.css")
        .pipe(concat("bundle.min.css"))
        .pipe(cleancss())
        .pipe(autoprefixer())
        .pipe(dest("css/"));
}
