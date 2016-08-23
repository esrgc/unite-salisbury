module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        seperator: ':'
      },
      multi: {
        files: {
          './public/build/whatsUpAdmin.js': [
            './public/js/admin/views/*.js',
            './public/js/admin/models/*.js',
            './public/js/admin/collections/*.js',
            './public/js/admin/router/*.js',
            './public/js/admin/*.js'

          ],
          './public/build/whatsUpMap.js': [
            './public/js/map/views/*.js',
            './public/js/map/models/*.js',
            './public/js/map/collections/*.js',
            './public/js/map/router/*.js',
            './public/js/map/*.js'
          ]
        }
      },
    },
    watch: {
      js: {
        files: [
          './public/js/index.js',
          './public/js/*.js',
          './public/js/**/*.js',
          './public/js/**/**/*.js'
        ],
        tasks: ['concat']
      },
      css: {
        files: './public/style/*.less',
        tasks: ['less']
      }
    },
    less: {
      dev: {
        options: {
          paths: ['./public/style']
        },
        files: {
          './public/build/style.css': './public/style/style.less',
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['concat', 'watch', 'less']);


};
