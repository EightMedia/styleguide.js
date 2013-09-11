fs = require 'fs'
path = require 'path'
slug = require 'slug'
Yaml = require 'js-yaml'
Jade = require 'jade'
Marked = require 'marked'
CssParse = require 'css-parse'


class StyleGuide
  constructor: (@title)->
    @sections = []
    @source = ''
    @js = ''

    
  parseFile: (src_file)->
    @parseCSS(fs.readFileSync src_file, encoding:'utf8')
    

  parseCSS: (@source)->
    cssparser = new CssParse(@source)

    # find special block comments,
    # /*** YAML ***/
    guides = []
    for rule in cssparser.stylesheet.rules
      if rule.comment and rule.comment.match(/^\*\*/) and rule.comment.match(/\*\*$/)
        content = rule.comment.substr(2).slice(0,-2)

        try
          props = Yaml.safeLoad(content, schema: Yaml.FAILSAFE_SCHEMA)
          guides.push props
        catch err
          console.log err



    # get all sections
    sections = {}
    guides.forEach (guide)->
      section = guide.section || 'Index'

      if not sections[section]
        sections[section] =
          title: section
          slug: section.replace(/[^a-z0-9]/ig, "")
          guides: []

      sections[section].guides.push(guide)
      return


    # convert to array
    Object.keys(sections).forEach (name)=>
      @sections.push(sections[name])

    # sort by section title
    @sections.sort (a,b)->
      return (a.title > b.title)


  includeJS: (file)->
    @js = fs.readFileSync file, encoding:'utf8'
      
      
  renderToFile: (dest_file, src_template="#{__dirname}/template/index.jade")->
    # jade template
    template = fs.readFileSync src_template, encoding:'utf8'
    fn = Jade.compile template,
      filename: src_template

    fs.writeFileSync(dest_file, fn(
      sections: @sections
      source_css: @source
      source_js: @js
      title: @title
      markdown: Marked
    ), encoding:'utf8')

module.exports = StyleGuide