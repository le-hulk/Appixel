module.exports = function(grunt) {

    // Autoload modules do package.json
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        // Pastas Padronizadas

        meta: {
            development: {
                raiz: 'development/',
                fonts: 'development/assets/fonts/',
                images: 'development/assets/images/'
            },
            test: {
                raiz: 'test/',
                fonts: '<%= meta.test.raiz %>/assets/fonts/',
                images: '<%= meta.test.raiz %>/assets/images/'
            },
            build: {
                raiz: 'build/',
                fonts: '<%= meta.build.raiz %>/assets/fonts/',
                images: '<%= meta.build.raiz %>/assets/images/'
            },
            resources: {
                raiz: 'resources/',
                images: 'resources/images/'
            }
        },

        // Limpando Pastas

        clean: {
            images: {
                src: ["<%= meta.development.images %>"]
            },
            test: {
                src: ["<%= meta.test.raiz %>"]
            },
            build: {
                src: ["<%= meta.build.raiz %>"]
            }
        },

        // Criação das Imagens Minificadas para inicialização do Desenvolvimento

        imagemin: {
            options: {
                optimizationLevel: 7,
                progressive: true
            },
            development: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.resources.images %>',
                    src: ['**/*.{png,jpg,jpeg}'],
                    dest: '<%= meta.development.images %>'
                }]
            }
        },

        /**
         * Copiar alguns arquivos necessários
         */
        copy: {
            // Copiando arquivos da Build de Teste
            test: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.development.fonts %>',
                    src: ['**'],
                    dest: '<%= meta.test.fonts %>'
                }, {
                    expand: true,
                    cwd: '<%= meta.development.images %>',
                    src: ['**'],
                    dest: '<%= meta.test.images %>'
                }, {
                    expand: true,
                    cwd: '<%= meta.development.raiz %>assets/scripts/',
                    src: ['**'],
                    dest: '<%= meta.test.raiz %>assets/scripts/'
                }, {
                    expand: true,
                    cwd: '<%= meta.resources.raiz %>ico/',
                    src: ['*.ico'],
                    dest: '<%= meta.test.raiz %>'
                }]
            },

            // Copiando arquivos da Build de Produção
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.development.fonts %>',
                    src: ['**'],
                    dest: '<%= meta.build.fonts %>'
                }, {
                    expand: true,
                    cwd: '<%= meta.development.images %>',
                    src: ['**'],
                    dest: '<%= meta.build.images %>'
                }, {
                    expand: true,
                    cwd: '<%= meta.resources.raiz %>ico/',
                    src: ['*.ico'],
                    dest: '<%= meta.build.raiz %>'
                }, {
                    expand: true,
                    cwd: '<%= meta.development.raiz %>php/',
                    src: ['**'],
                    dest: '<%= meta.build.raiz %>php/'
                }]
            }
        },

        // Compila jade para html

        jade: {
          build: {
            options: {
              pretty: true,
              data: function(dest, src) { return require('./development/assets/scripts/textos.json'); },
              
            },
            files: [{
              expand: true,
              cwd: '<%= meta.development.raiz %>',
              src: ['*.jade'],
              dest: '<%= meta.build.raiz %>',
              ext: '.html'
            }]
          },
          test: {
            options: {
              pretty: true
              // data: function(dest, src) { return require('./development/assets/scripts/textos.json'); },
              
            },
            files: [{
              expand: true,
              cwd: '<%= meta.development.raiz %>',
              src: ['*.jade'],
              dest: '<%= meta.test.raiz %>',
              ext: '.html'
            }]
          }
        },

        // Minifica o Javascript

        uglify: {
          options: {
            banner: '// <%= grunt.template.today("dd-mm-yyyy") %> \n'
          },
          build: {
              src: ['<%= meta.development.raiz %>assets/scripts/*.js'],
              dest: '<%= meta.build.raiz %>assets/scripts/main.js'
          }
        },

        // Stylus CSS
        stylus: {
          test: {
            options: {
                compress: false,
                paths: ['stylus']
            },
            files: {
                '<%= meta.test.raiz %>assets/css/style.css': ['<%= meta.development.raiz %>assets/styl/**/*.styl']
            }
          },
          build: {
            options: {
                compress: true,
                paths: ['stylus']
            },
            files: {
                '<%= meta.build.raiz %>assets/css/style.css': ['<%= meta.development.raiz %>assets/styl/**/*.styl']
            }
          }
        },

        watch: {
            css: {
                files: '<%= meta.development.raiz %>**/*.styl',
                tasks: ['stylus:test']
            },
            js: {
                files: '<%= meta.development.raiz %>**/*.js',
                tasks: ['uglify:test']
            },
            html: {
                files: '<%= meta.development.raiz %>**/*.jade',
                tasks: ['jade:test']
            }
        },

        htmlcompressor: {
            options: {
                preserveServerScript: true,
                removeIntertagSpaces: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.build.raiz %>',
                    src: ['**/*.html'],
                    dest: '<%= meta.build.raiz %>'
                }]
            }
        },

        rsync: {
            options: {
                recursive: true
            },
            dist: {
                options: {
                    src: "build/",
                    dest: "./",
                    host: "root@104.131.184.196",
                    syncDestIgnoreExcl: false /* NAO ALTERAR */
                }
            },
        }
        
    });

    /**
     * Comandos
     */


      // Inicialização do imagemin para desenvolvimento
      grunt.registerTask('minificarImagem', ['clean:images', 'imagemin']);

      // Teste
      grunt.registerTask('test', [
        'clean:test',
        'copy:test',
        'stylus:test',
        'jade:test',
        'watch'
      ]);

    // Build
    grunt.registerTask('build', [
        'clean:build',
        'copy:build',
        'stylus:build',
        'uglify:build',
        'jade:build',
        'htmlcompressor'
      ]);

    // Deploy
    // grunt.registerTask('deploy', ['rsync']);
};