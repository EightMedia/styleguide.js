fs = require 'fs'
path = require 'path'
slug = require 'slug'
Yaml = require 'js-yaml'
Jade = require 'jade'
CssParse = require 'css-parse'


class StyleGuide
  constructor: (@title)->
    @sections = []
    @source = ''

  parseFile: (src_file)->
    @parseCSS(fs.readFileSync path.resolve(__dirname, src_file), encoding:'utf8')

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
      if not guide.section then guide.section = '[Index]'

      if not sections[guide.section]
        sections[guide.section] =
          title: guide.section
          slug: slug(guide.section)
          guides: []

      sections[guide.section].guides.push(guide)


    # convert to array
    Object.keys(sections).forEach (name)=>
      @sections.push(sections[name])

    # sort by section title
    @sections.sort (a,b)->
      return (a.title > b.title)


  renderToFile: (dest_file, src_template='template/index.jade')->
    # jade template
    template = fs.readFileSync src_template, encoding:'utf8'
    fn = Jade.compile template,
      filename: src_template

    fs.writeFileSync(dest_file, fn(
      sections: @sections
      source: @source
      title: @title
    ), encoding:'utf8')

module.exports = StyleGuide