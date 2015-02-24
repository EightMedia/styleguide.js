var tagRegex = /<include([^>\/]*)\s?\/?>/g;
var attrRegex = /([a-z]+)=('([^']*)'|"([^"]*)"|([^\s]*))/g;

function parseIncludeTags(docs, html, htmlAttribute) {
    // find include tags
    if (typeof html === 'string') {
        html = [].concat([html]);
    }
    return html.map(function (snippet) {
        return snippet.replace(tagRegex, function(tag, tagAttrs) {
            var attributes = {};

            // find attributes
            var groups = tagAttrs.match(attrRegex);
            for(var i = 0; i < groups.length; i++) {
                var p = groups[i].split(/=/);
                if(p[1]) {
                    attributes[p[0]] = p[1].replace(/^["']/, '').replace(/["']$/, '');
                }
            }

            // find the included document for these attributes
            return findDocByAttributes(docs, attributes, htmlAttribute);
        });
    });
}


/**
 * parse a yaml string
 * @param source
 * @returns {*}
 */
function findDocByAttributes(docs, attributes, htmlAttribute) {
    var attrKeys = Object.keys(attributes);
    if(attrKeys.length === 0) {
        return "";
    }

    for(var i = 0; i < docs.length; i++) {
        // all attributes must match
        var matches = 0;
        for(var k = 0; k < attrKeys.length; k++) {
            var attr = attrKeys[k];
            if(docs[i][attr] == attributes[attr]) {
                matches++;
            }
        }
        if(matches === attrKeys.length) {
            // also parse this, for nested includes...
            return parseIncludeTags(docs, docs[i][htmlAttribute], htmlAttribute);
        }
    }
    return "";
}

/**
 * @param docs
 * @param options
 * @returns {Array}
 */
module.exports.parse = function (docs, options) {
    // walk each doc and parse the include tags
    if(docs){
        for(var i = 0; i < docs.length; i++) {
            docs[i][options.html] = parseIncludeTags(docs, docs[i][options.html], options.html);
        }
    }
    return docs;
};
