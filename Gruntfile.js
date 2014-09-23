module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower_file: grunt.file.readJSON('bower.json'),

    jshint: {
      all: ['src/**/*']
    },

    jslint: {
      all: ['src/**/*']
    },

    concat: {
  	  options: {
  	    separator: '\n'
  	  },
  	  dist: {
  	    src: [
          'src/wrap/begin.js', 
          'src/main.js', 
          'src/Event.js', 
          'src/EventHandler.js', 
          'src/MosApplication.js', 
          'src/MosPage.js', 
          'src/MosScrollApp.js', 
          'src/MosSlideApp.js', 
          'src/wrap/end.js'
        ],
  	    dest: 'dist/mospa.js'
  	  }
    },

  	uglify: {
  	  dist: {
  	    files: {
  	      'dist/mospa.min.js': ['<%= concat.dist.dest %>']
  	    }
  	  }
  	},

  	watch: {
        scripts: {
            files: 'src/**/*',
            tasks: ['concat','uglify']
        }
    },

    yuidoc: {
      compile: {
        name: '<%= bower_file.name %>',
        description: '<%= bower_file.description %>',
        version: '<%= bower_file.version %>',
        url: '<%= bower_file.homepage %>',
        nocode: 'true',
        themedir: 'yuidoc-theme',
        options: {
          paths: 'src/',
          outdir: '../mospa-docs'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
 
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('lint', ['jslint']);
  grunt.registerTask('docs', ['yuidoc']);
};
