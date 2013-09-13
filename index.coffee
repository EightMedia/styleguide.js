fs = require 'fs'
util = require 'util'

cons = require 'consolidate'
yaml = require 'js-yaml'
cssparse = require 'css-parse'


class StyleGuide
  constructor: (@title='', @engine='jade')->
    @sections = []
    @source = ''
    @js = []

    
  parseFile: (src_file)->
    @parseCSS(fs.readFileSync src_file, encoding:'utf8')
    

  parseCSS: (@source)->
    guides = @collectYaml(@source)

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

      
  collectYaml: (source)->
    css = new cssparse(source)
    regex = /^\*\*[\s\S]*\*\*$/

    # find special block comments,
    # /*** YAML ***/
    results = []
    for rule in css.stylesheet.rules
      if rule.comment and rule.comment.match(regex)
        content = rule.comment.substr(2).slice(0,-2)

        try
          results.push yaml.safeLoad(content, schema: yaml.FAILSAFE_SCHEMA)
        catch err then throw err    
    return results
    

  includeJS: (files)->
    if not util.isArray files
      files = [files]
      
    for file in files
      @js.push fs.readFileSync(file, encoding:'utf8')
      
      
  renderToFile: (dest_file, src_template="#{__dirname}/template/index.jade")->
    data = 
      title: @title
      sections: @sections
      source_css: @source
      source_js: @js.join(";")
      marked: require 'marked'
      
    cons[@engine] src_template, data, (err, html)->
      if err then throw err
      fs.writeFileSync(dest_file, html, encoding:'utf8')
    

module.exports = StyleGuide