var yaml = require('js-yaml');
var cssparse = require('css-parse');

var COMMENT_BLOCK = /^\*\*[\s\S]*\*\*$/;

/**
 * parse a yaml string
 * @param source
 * @returns {*}
 */
function parseYaml(source) {
    try {
        return yaml.safeLoad(source, {
            schema: yaml.FAILSAFE_SCHEMA
        });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * get yaml from css
 * @param source
 * @returns {Array}
 */
module.exports.parse = function (source) {
    var css = new cssparse(source);
    var yamlData = [];

    css.stylesheet.rules.forEach(function (rule) {
        if (rule.comment && COMMENT_BLOCK.test(rule.comment)) {
            yamlData.push("\n- "+ rule.comment.substr(2).slice(0, -2));
        }
    });
    return parseYaml(yamlData.join(""));
};
