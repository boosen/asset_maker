module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      js:['.tmp/*.js', 'dist/js/*.js', "!.tmp/*.min.js"]
    },
    jade: {
      compile: {
        options: {
          pretty:true,
          data: {
            debug: true
          }
        },
        files: [
          {dest:'dist/test.html', src: 'app/jade/test.jade'},
          {dest:'dist/index.html', src: 'app/jade/index.jade'}
        ]
      }
    },
    coffee: {
      default: {
        files: {
          '.tmp/main.js': 'app/coffee/*.coffee' // 1:1 compile
        }
      },
      glob_to_multiple: {
        expand: true,
        flatten: true,
        cwd: 'app/coffee',
        src: ['*.coffee'],
        dest: '.tmp',
        ext: '.js'
      }
    },
    concat: {
      dist: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          },
        },
        src: ['bower_components/jquery/dist/jquery.min.js', 'bower_components/jquery/dist/bootstrap.min.js'],
        dest: '.tmp/lib.js'
      },
    },
    jshint: {
      options: {
        "curly": true,
        "eqnull": true,
        "eqeqeq": true,
        "undef": true,
        "globals": {
          "jQuery": true
        }
      },
      uses_defaults: ['Grentfile.js']
    },
    uglify: {
      build: {
        options: {
          beautify: {
            width: 80,
            beautify: true
          }
        },
        files: [{'dist/js/main.min.js': '.tmp/main.js'}, {'dist/js/lib.min.js': '.tmp/lib.js'}]
      },
      coffee: {
        files: {'dist/js/main.min.js': '.tmp/main.js'}
      }
    },
    watch: {
      js: {
        files: ['app/coffee/*.coffee'],
        tasks: ['coffee:default', 'uglify:coffee']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.registerTask('default', ['jade']);
  grunt.registerTask('jsmin', ['clean', 'coffee:default', 'concat', 'jshint', 'uglify:build']);
}