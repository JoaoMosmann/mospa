module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['src/**/*']
    },

    jslint: {
      all: ['src/**/*']
    },

    concat: {
  	  options: {
  	    separator: ';\n'
  	  },
  	  dist: {
  	    src: ['src/**/*'],
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
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jslint');
 
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('lint', ['jslint']);
};
