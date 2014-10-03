module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json');
    var dirs = {
        compile: 'build/compile',
        minify: 'build/minify',
        resource: 'resource_' + pkg.version,
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
            js: {
                options: {
                    jshintrc: 'src/js/.jshintrc'
                },
                src: 'src/js/**/*.js'
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
            js: {
                files: 'src/js/**',
                tasks: ['jshint:js', 'webmake', 'uglify']
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
                    '<%= dirs.compile %>/<%= dirs.resource %>/main.js': 'src/js/main.js'
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
                    '<%= dirs.compile %>/<%= dirs.resource %>/css/main.css': 'src/styl/main.styl'
                }
            }
        },
        mustache_render: {
            compile: {
                files: [{
                    data: {
                        css_dir: dirs.resource + '/css',
                        img_dir: dirs.resource + '/img',
                        js_dir: dirs.resource
                    },
                    template: 'src/main.mustache',
                    dest: dirs.compile + '/main.html'
                }]
            }
        },
        uglify: {
            minify: {
                files: {
                    '<%= dirs.minify %>/<%= dirs.resource %>/main.js': dirs.compile + '/' + dirs.resource + '/main.js'
                }
            }
        },
        cssmin: {
            minify: {
                expand: false,
                src: dirs.compile + '/' + dirs.resource + '/css/main.css',
                dest: dirs.minify + '/' + dirs.resource + '/css/main.css'
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
                    dest: dirs.compile + '/' + dirs.resource
                }]

            },
            minify: {
                expand: true,
                cwd: dirs.compile + '/' + dirs.resource,
                src: 'img/**',
                dest: dirs.minify + '/' + dirs.resource
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

    // Minify
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Dist
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('compile', ['clean:compile', 'jshint:js', 'webmake', 'stylus', 'mustache_render', 'copy:compile']);
    grunt.registerTask('minify', ['compile', 'clean:minify', 'uglify', 'cssmin', 'htmlmin', 'copy:minify']);
    grunt.registerTask('dist', ['minify', 'compress:dist']);
    grunt.registerTask('default', ['jshint:gruntfile', 'minify']);
};