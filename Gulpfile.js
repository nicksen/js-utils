var gulp = require("gulp"),
    gutil = require("gulp-util"),
    rimraf = require("gulp-rimraf"),
    jshint = require("gulp-jshint"),
    browserify = require("browserify"),
    watchify = require("watchify"),
    prettyHrtime = require("pretty-hrtime"),
    notify = require("gulp-notify"),
    source = require('vinyl-source-stream'),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename")
    karma = require("gulp-karma");

var bundleLogger = {
    start: function () {
        startTime = process.hrtime();
        gutil.log("Running", gutil.colors.cyan("'browserify'") + "...");
    },
    end: function () {
        var taskTime = process.hrtime(startTime),
            prettyTime = prettyHrtime(taskTime);
        gutil.log("Finished", gutil.colors.cyan("'browserify'"), "in", gutil.colors.magenta(prettyTime));
    }
};

var handleErrors = function () {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title: "Compile error",
        message: "<%= error.message %>"
    }).apply(this, args);

    this.emit("end");
};

gulp.task("clean", function () {
    return gulp.src("./utils.{js,min.js}")
        .pipe(rimraf());
});

gulp.task("lint", function() {
    return gulp.src("./src/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("test", [ "build" ], function() {
    return gulp.src([ "utils.js", "test/**/*Spec.js" ])
        .pipe(karma({
            configFile: "karma.conf.js",
            action: global.isWatching ? "watch" : "run"
        }))
        .on("error", function(err) {
            if (!global.isWatching) {
                throw err;
            }
        });
});

gulp.task("build", [ "clean", "lint" ], function () {

    var bundleMethod = global.isWatching ? watchify : browserify,
        bundler = bundleMethod({
            entries: [ "./src/index.js" ]
        });

    var bundle = function () {
        bundleLogger.start();

        return bundler
            .bundle({
                debug: true,
                standalone: "utils"
            })
            .on("error", handleErrors)
            .pipe(source("utils.js"))
            .pipe(gulp.dest("./"))
            .on("end", bundleLogger.end);
    };

    if (global.isWatching) {
        bundler.on("update", bundle);
    }

    return bundle();
});

gulp.task("compress", [ "build" ], function () {
    return gulp.src("./utils.js")
        .pipe(uglify())
        .pipe(rename("utils.min.js"))
        .pipe(gulp.dest("./"));
});

gulp.task("watch", function () {
    global.isWatching = true;
    gulp.watch("./src/**/*.js", [ "test" ]);
});

gulp.task("default", [ "watch", "test" ]);

gulp.task("dist", [ "test", "compress" ]);
