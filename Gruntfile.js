module.exports = function (grunt) {
    grunt.initConfig({
        //pkg: grunt.file.readJSON("package.json"),
        less: {
            development: {
                options: {},
                files: {
                    "app/styles/style.css": "app/styles/style.less"
                }
            }
        },
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: "app/assets",
                        src: ["**/*"],
                        dest: "dist/"
                    }]
            },
            templates: {
                files: [
                    {
                        expand: true,
                        cwd: "app/templates",
                        src: ["**/*"],
                        dest: "dist/templates"
                    }]
            },
            templatesTest: {
                files: [
                    {
                        expand: true,
                        cwd: "app/templates",
                        src: ["**/*"],
                        dest: "test/templates"
                    }]
            }
        },
        concat: {
            js: {
                src: [
                    "app/module.js",
                    "app/filters/*.js",
                    "app/components/*.js",
                    "node_modules/moment/moment.js"
                    //"app/templates/*.js"
                ],
                dest: "dist/thing-it-device-ui.js"
            },
            css: {
                src: [
                    "app/styles/style.css",
                    "app/assets/icons.css"
                ],
                dest: "dist/thing-it-device-ui.css"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.registerTask('default', ['less', "copy"/*, 'browserify',*/, 'concat'/*, "uglify"*/]);
};