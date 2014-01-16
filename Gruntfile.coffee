
module.exports = (grunt) ->

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-coffee')

  grunt.registerTask('default', ['watch'])
  grunt.registerTask('test', ['clean', 'nodeunit'])


  grunt.initConfig

    watch:
      coffee:
        files: ['src/**/*.coffee']
        tasks: ['coffee']

    coffee:
      compile: 
        files:
          'main.js': 'src/index.coffee'
          'template/styleguide.js': 'src/template/styleguide.coffee'

    # ---
    # clean up folders
    clean:
      tests: ['test/tmp']
    

    # ---
    # run tests
    nodeunit:
      styleguidejs: ['test/styleguide_test.js'],

  