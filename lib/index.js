var fs = require('fs');
var cons = require('consolidate');
var path = require('path');
var marked = require('marked');
var _ = require('lodash');
var cssYaml = require('./cssyaml.js');
var htmlIncludes = require('./htmlincludes.js');

function merge(dest, src) {
    for(var key in src) {
        if(src.hasOwnProperty(key) && typeof dest[key] == 'undefined') {
            dest[key] = src[key];
        }
    }
    return dest;
}

function StyleGuide() {
    this.sources = [];
}

StyleGuide.defaults = {
    groupBy: 'section',

    engine: 'jade',
    template: __dirname + '/template/index.jade',

    extraJs: [],
    extraCss: [],

    outputFile: null
};

StyleGuide.prototype = {
    addFile: function(file) {
        this.addSource(fs.readFileSync(file, {encoding:'utf8'}));
    },

    addSource: function(source) {
        this.sources.push(source);
    },

    groupBy: function(docs, key) {
        return _.groupBy(docs, key);
    },

    parseSource: function() {
        return cssYaml.parse(this.sources.join(" "));
    },

    parseHtmlIncludes: function(docBlocks) {
        return htmlIncludes.parse(docBlocks, {
            html: 'example'
        });
    },

    render: function(options, callback) {
        options = merge(options || {}, StyleGuide.defaults);

        // fetch the extra js files
        var extraJs = [];
        options.extraJs.forEach(function(file) {
            extraJs.push(fs.readFileSync(file, { encoding:'utf8' }));
        });

        // append the extra stylesheets to the source
        options.extraCss.forEach(function(file) {
            this.addFile(file);
        }, this);

        var source = this.parseSource();
        source = this.parseHtmlIncludes(source);

        // data to send to the template
        var data = {
            options: options,
            docs: this.groupBy(source, options.groupBy),
            marked: marked,
            css: this.sources.join(" "),
            js: extraJs.join("; ")
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
                fs.writeFileSync(options.outputFile, html, { encoding:'utf8' });
            }
        });
    }
};

module.exports = StyleGuide;
