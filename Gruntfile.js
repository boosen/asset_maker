module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      js:['.tmp/*.js', 'dist/js/*.js', "!.tmp/*.min.js"],
      css:['.tmp/*.css', 'dist/style/*.css', "!.tmp/*.min.js"]
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
          '.tmp/js/main.js': 'app/coffee/*.coffee' // 1:1 compile
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
      js: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          },
        },
        src: ['bower_components/jquery/dist/jquery.min.js', 'bower_components/jquery/distbootstrap.min.js'],
        dest: '.tmp/lib.js'
      },
      css: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
          banner: "/*<%= pkg.name > lib css*/"
          // process: function(src, filepath) {
          //   return '// Source: ' + filepath + '\n' +
          //     src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          // },
        },
        src: ['bower_components/bootstrap/dist/css/bootstrap.min.css'],
        dest: '.tmp/lib.css'
      }
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
        files: [{'dist/js/main.min.js': '.tmp/js/main.js'}, {'dist/js/lib.min.js': '.tmp/lib.js'}]
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
    },
    copy: {
      fonts: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'bower_components/bootstrap/dist',
          dest: 'dist',
          src: 'fonts/*'
        }]
      }
    },
    compass: {
      dist: {                   // Target
        options: {              // Target options
          outputStyle: 'expanded',
          sassDir: 'app/sass/',
          cssDir: '.tmp/css',
          environment: 'production'
        }
      }
    },
    cssmin: {
      withbanner: {
        options: {
          banner: '/* My minified css file */'
        },
        files: [
          {'dist/style/main.min.css': ['.tmp/css/*.css']},
          {'dist/style/lib.min.css': ['.tmp/lib.css']}
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.registerTask('default', ['jade']);
  grunt.registerTask('jsbuild', ['clean:js', 'coffee:default', 'concat:js', 'jshint', 'uglify:build']);
  grunt.registerTask('cssbuild', ['clean:css', 'concat:css', 'compass', 'cssmin:withbanner']);
}