'use strict';
var fs = require('fs');
var cheerio = require('cheerio');
var StyleGuide = require('../main.js');
var $;

function readFile(file) {
    return fs.readFileSync(file, {encoding: 'utf8'}).trim();
}


exports.styleguide = {
    'default': function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/default/style.css");
        sg.render({
            outputFile: "test/tmp/index.html",
            extraJs: ["test/fixtures/default/script.js"]
        });

        var actual = readFile('test/tmp/index.html');
        var expected = readFile('test/expected/index.html');

        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should behave normally');
        test.done();
    },

    customCss: function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/default/style.css");
        sg.render({
            extraCss: ["test/fixtures/custom-css/styleguide.css"],
            outputFile: "test/tmp/custom-css.html"
        });

        var actual = readFile('test/tmp/custom-css.html');
        var expected = readFile('test/expected/custom-css.html');

        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should be able to use custom css');
        test.done();
    },

    appendCss: function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/default/style.css");
        sg.render({
            extraCss: ["test/fixtures/custom-css/styleguide.css"],
            outputFile: "test/tmp/append-custom-css.html"
        });

        var actual = readFile('test/tmp/append-custom-css.html');
        var expected = readFile('test/expected/append-custom-css.html');

        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should be able to append custom css');
        test.done();
    },

    references: function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/references/style.css");
        sg.render({
            outputFile: "test/tmp/references.html"
        });

        var actual = readFile('test/tmp/references.html');
        var expected = readFile('test/expected/references.html');

        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should be able to use references');
        test.done();
    },

    includes: function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/includes/style1.css");
        sg.addFile("test/fixtures/includes/style2.css");
        sg.render({
            outputFile: "test/tmp/includes.html"
        });

        var actual = readFile('test/tmp/includes.html');
        var expected = readFile('test/expected/includes.html');
        
        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should be able to use includes');
        test.done();
    },


    // test for files with no styleguide available at all
    missingStyleguide: function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/missing-styleguide/style1.css");
        sg.addFile("test/fixtures/missing-styleguide/style2.css");
        sg.render({
            outputFile: "test/tmp/missing-styleguide.html"
        });

        var actual = readFile('test/tmp/missing-styleguide.html');
        var expected = readFile('test/expected/missing-styleguide.html');
        
        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should not run aground when no styleguide is available');
        test.done();
    }
};
