module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json');
    var dirs = {
        compile: 'build/compile',
        minify: 'build/minify',
        ressource: 'ressource_' + pkg.version,
        dist: 'dist'
    };

    grunt.initConfig({
        dirs: dirs,
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/js/.jshintrc'
                },
                src: 'src/js/**/*.js'
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: 'test/**/*.js'
            }
        },
        clean: {
            compile: dirs.compile,
            minify: dirs.minify
        },
        watch: {
            options: {
                interrupt: true,
                atBegin: true
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            js_src: {
                files: 'src/js/**',
                tasks: ['jshint:src', 'webmake', 'uglify', 'mochaTest']
            },
            js_test: {
                files: 'test/**',
                tasks: ['jshint:test', 'mochaTest']
            },
            stylus: {
                files: 'src/styl/**',
                tasks: ['stylus', 'cssmin']
            },
            mustache_render: {
                files: 'src/*.mustache',
                tasks: ['mustache_render', 'htmlmin']
            },
            copy: {
                files: 'src/img/**',
                tasks: ['copy']
            }
        },
        webmake: {
            compile: {
                files: {
                    '<%= dirs.compile %>/<%= dirs.ressource %>/main.js': 'src/js/main.js'
                }
            }
        },
        stylus: {
            compile: {
                options: {
                    paths: ['src/styl'],
                    urlfunc: 'embedurl',
                    'include css': true
                },
                files: {
                    '<%= dirs.compile %>/<%= dirs.ressource %>/css/main.css': 'src/styl/main.styl'
                }
            }
        },
        mustache_render: {
            compile: {
                files: [{
                    data: {
                        css_dir: dirs.ressource + '/css',
                        img_dir: dirs.ressource + '/img',
                        js_dir: dirs.ressource
                    },
                    template: 'src/main.mustache',
                    dest: dirs.compile + '/main.html'
                }]
            }
        },
        uglify: {
            minify: {
                files: {
                    '<%= dirs.minify %>/<%= dirs.ressource %>/main.js': dirs.compile + '/' + dirs.ressource + '/main.js'
                }
            }
        },
        cssmin: {
            minify: {
                expand: false,
                src: dirs.compile + '/' + dirs.ressource + '/css/main.css',
                dest: dirs.minify + '/' + dirs.ressource + '/css/main.css'
            }
        },
        htmlmin: {
            minify: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                files: {
                    '<%= dirs.minify %>/main.html': dirs.compile + '/main.html',
                }
            }
        },
        copy: {
            compile: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: 'img/**',
                    dest: dirs.compile + '/' + dirs.ressource
                }]

            },
            minify: {
                expand: true,
                cwd: dirs.compile + '/' + dirs.ressource,
                src: 'img/**',
                dest: dirs.minify + '/' + dirs.ressource
            }
        },
        compress: {
            dist: {
                options: {
                    archive: dirs.dist + '/' + pkg.name + '_' + pkg.version + '.zip'
                },
                files: [{
                    expand: true,
                    cwd: dirs.minify,
                    src: '**'
                }]
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        }
    });

    // All
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Compile
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-webmake');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-mustache-render');

    // Test
    grunt.loadNpmTasks('grunt-mocha-test');

    // Minify
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Dist
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('compile', ['clean:compile', 'jshint:src', 'webmake', 'stylus', 'mustache_render', 'copy:compile']);
    grunt.registerTask('minify', ['compile', 'clean:minify', 'uglify', 'cssmin', 'htmlmin', 'copy:minify']);
    grunt.registerTask('test', ['compile', 'jshint:test', 'mochaTest']);
    grunt.registerTask('dist', ['test', 'minify', 'compress:dist']);
    grunt.registerTask('default', ['jshint:gruntfile', 'test', 'minify']);
};