'use strict';

var grunt = require('grunt');
var cheerio = require('cheerio');
var StyleGuide = require('../index');

var $, sg;

exports.styleguide = {

  setUp: function(done) {
    done();
  },


  // default
  default: function(test) {
    test.expect(1);

    sg = new StyleGuide('Styleguide Demo')
    sg.parseFile("test/fixtures/default/style.css")
    sg.includeJS("test/fixtures/default/script.js")
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

    sg = new StyleGuide('Styleguide Demo')
    sg.parseFile("test/fixtures/default/style.css")
    sg.customCSS("test/fixtures/custom-css/styleguide.css")
    sg.renderToFile("test/tmp/custom-css.html")

    var actual = grunt.file.read('test/tmp/custom-css.html');
    var expected = grunt.file.read('test/expected/custom-css.html');

    $ = cheerio.load(expected);
    $('time').remove();
    expected = $.html();

    $ = cheerio.load(actual);
    $('time').remove();
    actual = $.html();

    test.equal(actual, expected, 'should be able to insert custom css');
    test.done();
  },


  // references
  references: function(test) {
    test.expect(1);

    sg = new StyleGuide('Styleguide Demo')
    sg.parseFile("test/fixtures/references/style.css")
    sg.renderToFile("test/tmp/references.html")

    var actual = grunt.file.read('test/tmp/references.html');
    var expected = grunt.file.read('test/expected/references.html');

    $ = cheerio.load(expected);
    $('time').remove();
    expected = $.html();

    $ = cheerio.load(actual);
    $('time').remove();
    actual = $.html();

    test.equal(actual, expected, 'should be able to use references');
    test.done();
  }
};
