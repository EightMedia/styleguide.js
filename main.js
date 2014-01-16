(function() {
  var StyleGuide, cons, cssparse, fs, marked, mkdirp, path, util, yaml;

  fs = require('fs');

  util = require('util');

  cons = require('consolidate');

  yaml = require('js-yaml');

  cssparse = require('css-parse');

  mkdirp = require('mkdirp');

  path = require('path');

  marked = require('marked');

  StyleGuide = (function() {
    function StyleGuide(title, engine) {
      this.title = title != null ? title : '';
      this.engine = engine != null ? engine : 'jade';
      this.sections = [];
      this.source = '';
      this.js = [];
      this.yamldoc = 'doc: ';
      this.stylesheets = ["" + __dirname + "/template/styleguide.css"];
    }

    StyleGuide.prototype.parseFile = function(src_file) {
      return this.parseCSS(fs.readFileSync(src_file, {
        encoding: 'utf8'
      }));
    };

    StyleGuide.prototype.parseCSS = function(source) {
      var guides, parsedYaml, sections,
        _this = this;
      this.source = source;
      this.collectYamlDoc(this.source);
      parsedYaml = this.parseYaml(this.yamldoc);
      if (!(parsedYaml != null ? parsedYaml.doc : void 0)) {
        return false;
      }
      guides = parsedYaml.doc;
      sections = {};
      guides.forEach(function(guide) {
        var section;
        section = guide.section || 'Index';
        if (!sections[section]) {
          sections[section] = {
            title: section,
            slug: section.replace(/[^a-z0-9]/ig, ""),
            guides: []
          };
        }
        sections[section].guides.push(guide);
      });
      Object.keys(sections).forEach(function(name) {
        return _this.sections.push(sections[name]);
      });
      return this.sections.sort(function(a, b) {
        return a.title > b.title;
      });
    };

    StyleGuide.prototype.collectYamlDoc = function(source) {
      var content, css, regex, rule, _i, _len, _ref, _results;
      css = new cssparse(source);
      regex = /^\*\*[\s\S]*\*\*$/;
      _ref = css.stylesheet.rules;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        if (rule.comment && rule.comment.match(regex)) {
          content = rule.comment.substr(2).slice(0, -2);
          _results.push(this.yamldoc += "\n- " + content);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    StyleGuide.prototype.parseYaml = function(source) {
      var err;
      try {
        return yaml.safeLoad(source, {
          schema: yaml.FAILSAFE_SCHEMA
        });
      } catch (_error) {
        err = _error;
        console.log(err.message);
        throw err;
      }
    };

    StyleGuide.prototype.collectYaml = function(source) {
      var content, css, err, regex, results, rule, _i, _len, _ref;
      css = new cssparse(source);
      regex = /^\*\*[\s\S]*\*\*$/;
      results = [];
      _ref = css.stylesheet.rules;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        if (rule.comment && rule.comment.match(regex)) {
          content = rule.comment.substr(2).slice(0, -2);
          try {
            results.push(yaml.safeLoad(content, {
              schema: yaml.FAILSAFE_SCHEMA
            }));
          } catch (_error) {
            err = _error;
            throw err;
          }
          this.yamldoc += content;
        }
      }
      return results;
    };

    StyleGuide.prototype.includeJS = function(files) {
      var file, _i, _len, _results;
      if (!util.isArray(files)) {
        files = [files];
      }
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.js.push(fs.readFileSync(file, {
          encoding: 'utf8'
        })));
      }
      return _results;
    };

    StyleGuide.prototype.customCSS = function(filepath) {
      return this.stylesheets = [filepath];
    };

    StyleGuide.prototype.appendCustomCSS = function(filepath) {
      return this.stylesheets.push(filepath);
    };

    StyleGuide.prototype.renderToFile = function(dest_file, src_template) {
      var data, file, stylesheets, _i, _len, _ref;
      if (src_template == null) {
        src_template = "" + __dirname + "/template/index.jade";
      }
      stylesheets = '';
      _ref = this.stylesheets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        stylesheets += fs.readFileSync(file, {
          encoding: 'utf8'
        });
      }
      data = {
        title: this.title,
        sections: this.sections,
        source_css: this.source,
        source_js: this.js.join(";"),
        marked: marked,
        styleguide_css: stylesheets
      };
      return cons[this.engine](src_template, data, function(err, html) {
        var dir;
        if (err) {
          throw err;
        }
        dir = path.dirname(dest_file);
        if (!fs.exists(dir)) {
          mkdirp.sync(dir);
        }
        return fs.writeFileSync(dest_file, html, {
          encoding: 'utf8'
        });
      });
    };

    return StyleGuide;

  })();

  module.exports = StyleGuide;

}).call(this);
