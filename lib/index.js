var fs = require('fs');
var cons = require('consolidate');
var path = require('path');
var marked = require('marked');
var _ = require('lodash');
var cssYaml = require('./cssyaml.js');
var htmlIncludes = require('./htmlincludes.js');
var beautifyHtml = require('js-beautify').html;
var hljs = require('highlight.js');


function readFileSync(file) {
    return fs.readFileSync(file, {encoding:'utf8'})
}

function StyleGuide() {
    this.options = {};
    this.sources = [];
}

StyleGuide.defaults = {
    groupBy: 'section',
    sortBy: ['section', 'title'],

    engine: 'jade',

    extraJs: [],
    extraCss: [],

    outputFile: null,

    template: __dirname + '/template/index.jade',
    templateCss: __dirname + '/template/styleguide.css',
    templateJs: __dirname + '/template/styleguide.js'
};

StyleGuide.prototype = {
    addFile: function(file) {
        this.addSource(readFileSync(file));
    },

    addSource: function(source) {
        this.sources.push(source);
    },

    groupSort: function(docs) {
        docs = _.sortBy(docs, this.options.sortBy);
        return _.groupBy(docs, this.options.groupBy);
    },

    parseSource: function() {
        return cssYaml.parse(this.sources.join(" "));
    },

    parseHtmlIncludes: function(docBlocks) {
        return htmlIncludes.parse(docBlocks, {
            html: 'example'
        });
    },

    beautifyHtml: function(sources) {
        var options = {
            "indent_size": 4,
            "wrap_line_length": 60,
            "unformatted": [],
            "preserve_newlines": false
        };
        return sources.map(function(source) {
            source.example = beautifyHtml(source.example, options);
            source.example = hljs.highlightAuto(source.example, ['html']).value;
            return source;
        });
    },

    render: function(options, callback) {
        options = this.options = _.defaults(options || {}, StyleGuide.defaults);

        // fetch the extra js files
        var extraJs = [];
        options.extraJs.forEach(function(file) {
            extraJs.push(readFileSync(file));
        });

        // append the extra stylesheets to the source
        options.extraCss.forEach(function(file) {
            this.addFile(file);
        }, this);

        var source = this.parseSource();
        source = this.parseHtmlIncludes(source);

        // beautify the html
        source = this.beautifyHtml(source);

        // data to send to the template
        var data = {
            marked: marked,
            options: options,

            docs: this.groupSort(source),
            css: this.sources.join(" "),
            js: extraJs.join("; "),

            templateCss: readFileSync(options.templateCss),
            templateJs: readFileSync(options.templateJs)
        };

        // template
        cons[options.engine](options.template, data, function(err, html) {
            if(callback) {
                callback(err, html);
            }
            if(err) {
                throw err;
            }
            if(options.outputFile) {
                fs.writeFileSync(options.outputFile, html, {encoding:'utf8'});
            }
        });
    }
};

module.exports = StyleGuide;
