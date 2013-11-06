
module.exports = (grunt) ->

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.registerTask('default', ['clean','nodeunit'])


  grunt.initConfig

    # ---
    # clean up folders
    clean:
      tests: ['test/tmp']
    

    # ---
    # run tests
    nodeunit:
      styleguidejs: ['test/styleguide_test.js'],

  