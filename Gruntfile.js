'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {
                    'build/xmpp-uri.bundle.js': ['<%= pkg.main %>']
                },
                options: {
                    bundleOptions: {
                        standalone: 'parseXMPPURI'
                    }
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! xmpp-uri <%= grunt.template.today("yyyy-mm-dd") %>*/'
            },
            dist: {
                files: {
                    'build/xmpp-uri.bundle.min.js': ['build/xmpp-uri.bundle.js']
                }
            }
        },
        jshint: {
            files: [
                'Gruntfile.js',
                'index.js',
                'test/**.js'
            ],
            options: grunt.file.readJSON('.jshintrc')
        },
        tape: {
            options: {
                pretty: true
            },
            files: ['test/**.js']
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-tape');
    grunt.loadNpmTasks('grunt-nsp-package');

    grunt.registerTask('default', ['jshint', 'browserify', 'uglify', 'tape', 'validate-package']);
};
