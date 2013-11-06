styleguide.js
=============

Generate a styleguide from your CSS, by adding [YAML](http://en.wikipedia.org/wiki/YAML) data in the comments. 
It generates a [self-contained html](test/index.html) file. Works great for component based CSS.


### Install
Styleguide.js runs on node, and is written in coffeescript. Just run `npm install styleguidejs`.


### How to use
You can add comments to your css. When it has three asterisks, it will be parsed as YAML data.
The properties `title`, `section` and `example` are required by the default template, but when using your own you can add all the things you would like. (like browser support, media query etc...). Example can be a string or an array.

````css
body {
  font: 18px Verdana;
}

/***
  title: Test
  section: Misc
  example:
    <div class="test">This is a test</div>
    <div class="test">This is another test</div>
***/
.test,
.test2,
.test2[fancy=true] {
  background: blue;
  color: #fff;
}


/***
  title: Another test
  section: Forms - Common
  example: <input type="text" class="test">
***/
input.test {
  background: green;
}


/***
  title: Labels
  section: Forms - Common
  description: |
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ac diam
    interdum augue blandit eleifend. Donec egestas, augue nec malesuada ullamcorper,
     sapien urna sollicitudin tellus, vel **mattis ligula** leo id mi. In sodales ante
     sollicitudin, varius metus id, varius nunc. Aenean rhoncus nisl a quam eleifend,
     vitae volutpat erat vulputate. Nullam scelerisque elit sit amet massa egestas,
      eu adipiscing lorem porttitor.
  example:
    <label class="test">This is a test</label>
***/
label.test {
  background: yellow;
}



/***
  title: Lists
  section: Misc
  description: |
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ac diam
    interdum augue blandit eleifend. Donec egestas, augue nec malesuada ullamcorper,
     sapien urna sollicitudin tellus, vel **mattis ligula** leo id mi. In sodales ante
     sollicitudin, varius metus id, varius nunc. Aenean rhoncus nisl a quam eleifend,
     vitae volutpat erat vulputate. Nullam scelerisque elit sit amet massa egestas,
      eu adipiscing lorem porttitor.
  example:
    - <ul class="list">
    - &li <li class="list-item">listitem</li>
    - *li
    - *li
    - *li
    - *li
    - *li
    - </ul>
***/
.list{
  border: 1px solid red;
}
.list-item {
  color: red;
}
````


````js
var StyleGuide = require('styleguidejs');
sg = new StyleGuide('My Styleguide');
sg.parseFile("mystyle.css");
sg.includeJS("modernizr.js");
sg.includeJS("jquery.js");
sg.customCSS("custom.css");
sg.renderToFile("test/index.html");
````

See /test for a demo implementation, and demo export file (index.html). You can add your own properties in the Yaml data,
and parse them in your custom template.


### API
`constructor( title='', engine='jade' )`

Create instance, and set the title for your guide. By default the [Jade](http://jade-lang.com/) template engine is used to generate the output. 
See the docs of [Consolidate.js](https://github.com/visionmedia/consolidate.js) for available options.

`parseFile( css_file )` and `parseCSS( css_source )`

Read the given css file/source and parse all styleguide comments. The file is also used in the export.
Can only be called once per instance.

`includeJS( js_file )`

Adds this file to the export. You can use this to load scripts like Modernizr and jQuery into the page. Also accepts an array of files.

`collectYaml( source )`

Collect the Yaml data comments in the given source. Is used internally, but can be used for your own magic.

`renderToFile( dest_file, template='template/index.jade' )`

Render the styleguide to this file, with the given template. 

`sg.customCSS( css_file )`
Use your own stylesheet for the styleguide page.


### Grunt task
See [grunt-styleguidejs](https://github.com/EightMedia/grunt-styleguidejs) for using styleguide.js inside your gruntfile.


### Screenshot ([source](test/index.html))
![Screenshot](screenshot.png)
