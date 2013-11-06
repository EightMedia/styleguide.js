'use strict';

var grunt = require('grunt');
var cheerio = require('cheerio');
var StyleGuide = require('../index');
var $;

exports.styleguide = {

  setUp: function(done) {
    done();
  },

  default: function(test) {
    test.expect(1);

    var sg = new StyleGuide('Styleguide Demo')
    sg.parseFile("test/fixtures/style.css")
    sg.includeJS("test/fixtures/script.js")
    sg.renderToFile("test/tmp/index.html")

    var actual = grunt.file.read('test/tmp/index.html');
    var expected = grunt.file.read('test/expected/index.html');

    $ = cheerio.load(expected);
    $('time').remove();
    expected = $.html();

    $ = cheerio.load(actual);
    $('time').remove();
    actual = $.html();

    test.equal(actual, expected, 'files should match');
    test.done();
  }
};
