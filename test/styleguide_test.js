'use strict';

var grunt = require('grunt');
var cheerio = require('cheerio');
var StyleGuide = require('../index');

var $, sg;

exports.styleguide = {

  setUp: function(done) {
    sg = new StyleGuide('Styleguide Demo')
    sg.parseFile("test/fixtures/style.css")
    sg.includeJS("test/fixtures/script.js")
    done();
  },


  // default
  default: function(test) {
    test.expect(1);
    sg.renderToFile("test/tmp/index.html")

    var actual = grunt.file.read('test/tmp/index.html');
    var expected = grunt.file.read('test/expected/index.html');

    $ = cheerio.load(expected);
    $('time').remove();
    expected = $.html();

    $ = cheerio.load(actual);
    $('time').remove();
    actual = $.html();

    test.equal(actual, expected, 'should behave normally');
    test.done();
  },


  // custom css
  custom_css: function(test) {
    test.expect(1);

    sg.customCSS("test/fixtures/template/styleguide.css")
    sg.renderToFile("test/tmp/custom.html")

    var actual = grunt.file.read('test/tmp/custom.html');
    var expected = grunt.file.read('test/expected/custom.html');

    $ = cheerio.load(expected);
    $('time').remove();
    expected = $.html();

    $ = cheerio.load(actual);
    $('time').remove();
    actual = $.html();

    test.equal(actual, expected, 'should be able to insert custom css');
    test.done();
  }
};
