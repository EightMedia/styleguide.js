var fs = require('fs');
var cons = require('consolidate');
var path = require('path');
var marked = require('marked');
var _ = require('lodash');
var cssyaml = require('./cssyaml.js');

function merge(dest, src) {
    for(var key in src) {
        if(src.hasOwnProperty(key) && typeof dest[key] == 'undefined') {
            dest[key] = src[key];
        }
    }
    return dest;
}

function StyleGuide() {
    this.source = [];
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
        this.source.push(source);
    },

    parseSource: function() {
        return cssyaml.getData(this.source.join(" "));
    },

    groupBy: function(docs, key) {
        return _.groupBy(docs, key);
    },

    render: function(options, callback) {
        options = merge(options || {}, StyleGuide.defaults);


        // fetch the extra js files
        var extraJs = [];
        options.extraJs.forEach(function(file) {
            extraJs.push(fs.readFileSync(file, {encoding:'utf8'}));
        });


        // append the extra stylesheets to the source
        options.extraCss.forEach(function(file) {
            this.addFile(file);
        }, this);


        // data to send to the template
        var data = {
            options: options,
            docs: this.groupBy(this.parseSource(), options.groupBy),
            marked: marked,
            css: this.source.join(" "),
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
                fs.writeFileSync(options.outputFile, html, {encoding:'utf8'});
            }
        });
    }
};

module.exports = StyleGuide;
