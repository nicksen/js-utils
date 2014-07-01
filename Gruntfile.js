module.exports = function (grunt) {
    grunt.config.init({
        paths: {
            app: "./src",
            dist: ".",
            file: "utils",
            js_files: "**/*.js"
        },

        clean: {
            dist: [ "<%= paths.app %>/<%= paths.file %>*.js" ]
        },

        jshint: {
            options: {
                jshintrc: true,
                reporter: require("jshint-stylish")
            },
            files: [ "<%= paths.app %>/<%= paths.js_files %>" ]
        },

        browserify: {
            options: {
                bundleOptions: {
                    debug: true,
                    standalone: "utils"
                }
            },
            compile: {
                src: "<%= paths.app %>/index.js",
                dest: "<%= paths.dist %>/<%= paths.file %>.js"
            }
        },

        uglify: {
            options: {
                mangle: true,
                compress: true,
                report: "gzip",
                sourceMap: false,
                preserveComments: false,
            },
            dist: {
                files: {
                    "<%= paths.dist %>/<%= paths.file %>.min.js": "<%= paths.dist %>/<%= paths.file %>.js"
                }
            }
        },

        watch: {
            js: {
                files: [ "<%= paths.app %>/<%= paths.js_files %>" ],
                tasks: [ "jshint", "browserify" ]
            }
        }
    });

    grunt.registerTask("default", [ "clean", "jshint", "browserify", "watch" ]);
    grunt.registerTask("dist", [ "clean", "jshint", "browserify", "uglify" ]);

    require("load-grunt-tasks")(grunt);
};
