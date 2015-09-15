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

    extraCss: function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/default/style.css");
        sg.render({
            extraCss: ["test/fixtures/extra-css/style1.css"],
            outputFile: "test/tmp/extra-css.html"
        });

        var actual = readFile('test/tmp/extra-css.html');
        var expected = readFile('test/expected/extra-css.html');

        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should be able to use custom css');
        test.done();
    },

    // change look and feel of the styleguide itself
    template: function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/default/style.css");
        sg.render({
            template: "test/fixtures/template/index.jade",
            templateCss: "test/fixtures/template/style.css",
            templateJs: "test/fixtures/template/script.js",
            outputFile: "test/tmp/template.html"
        });

        var actual = readFile('test/tmp/template.html');
        var expected = readFile('test/expected/template.html');

        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should be able to use styles for the styleguide itself');
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

    attributes: function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/attributes/style.css");
        sg.render({
            outputFile: "test/tmp/attributes.html"
        });

        var actual = readFile('test/tmp/attributes.html');
        var expected = readFile('test/expected/attributes.html');

        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should be able to use custom yaml attributes');
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
    },


    // test for files with no styleguide available at all
    beautifyHtml: function (test) {
        test.expect(1);

        var sg = new StyleGuide();
        sg.addFile("test/fixtures/default/style.css");
        sg.render({
            outputFile: "test/tmp/beautify-html.html",
            beautifyHtml: {
                indent_char: '–'
            },
        });

        var actual = readFile('test/tmp/beautify-html.html');
        var expected = readFile('test/expected/beautify-html.html');

        $ = cheerio.load(expected);
        $('time').remove();
        expected = $.html();

        $ = cheerio.load(actual);
        $('time').remove();
        actual = $.html();

        test.equal(actual, expected, 'should indent html');
        test.done();
    }
};
