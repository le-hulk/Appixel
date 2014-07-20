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
                }]
            }
        },

        // Compila jade para html

        jade: {
          build: {
            options: {
              pretty: true,
              data: {
                  debug: true
              }
            },
            files: [{
              expand: true,
              cwd: '<%= meta.development.raiz %>',
              src: ['**/*.jade'],
              dest: '<%= meta.build.raiz %>',
              ext: '.html'
            }]
          },
          test: {
            options: {
              pretty: true,
              data: {
                  debug: true
              }
            },
            files: [{
              expand: true,
              cwd: '<%= meta.development.raiz %>',
              src: ['**/*.jade'],
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
          test: {
            src: ['<%= meta.development.raiz %>assets/scripts/*.js'],
            dest: '<%= meta.test.raiz %>assets/scripts/script.js'
          },
          build: {
              src: ['<%= meta.development.raiz %>assets/scripts/*.js'],
              dest: '<%= meta.build.raiz %>assets/scripts/script.js'
          }
        },

        // Compila sass para o css

        compass: {
          test: {
            options: {
              force: true,
              environment: "development",
              outputStyle: "expanded",
              cssDir: "<%= meta.test.raiz %>assets/css/",
              sassDir: "<%= meta.development.raiz %>assets/scss/"
            }
          },
          build: {
            options: {
              force: true,
              environment: "production",
              outputStyle: "expanded",
              cssDir: "<%= meta.build.raiz %>assets/css/",
              sassDir: "<%= meta.development.raiz %>assets/scss/"
            }
          }
        }
    });

    /**
     * Comandos
     */

     // COMANDOS

      // Inicialização do imagemin para desenvolvimento
      grunt.registerTask('minificarImagem', ['clean:images', 'imagemin']);

      // Teste
      grunt.registerTask('test', [
        'clean:test',
        'copy:test',
        'compass:test',
        'uglify:test',
        'jade:test'
      ]);

    // Build
};