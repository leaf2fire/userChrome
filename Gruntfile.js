module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'userChrome.css': 'src/scss/userChrome.scss',
          'css/userAgentStyle.uc.css': 'src/scss/userAgentStyle.scss'
        }
      }
    },
    watch: {
      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass']);
};
