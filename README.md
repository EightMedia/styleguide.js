styleguide.js
=============

Generate a styleguide from your CSS, by adding [YAML](http://en.wikipedia.org/wiki/YAML) data in the comments.
It generates a [self-contained html](https://rawgithub.com/EightMedia/styleguide.js/master/test/expected/index.html) file. Works great for component based CSS.

#### [View the example generated styleguide](https://rawgithub.com/EightMedia/styleguide.js/master/test/expected/index.html)


### Install
Styleguide.js runs on node. Just run `npm install styleguidejs`.


### How to use
You can add comments to your css. When it has three asterisks, it will be parsed as YAML data.
The properties `title`, `section` and `example` are required by the default template, but when using your own template you can add all the things you would like. (like browser support, media query etc...). Example can be a string or an array.

````css
body {
  font: 16px Verdana;
}

/***
  title: Square buttons
  section: Buttons
  description: Very pretty square buttons
  example: |
    <a href="" class="btn btn-small">button</a>
    <a href="" class="btn btn-medium">button</a>
    <a href="" class="btn btn-large">button</a>
***/

.btn{
  display: inline-block;
  padding: .3em .6em;
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  background-color: darkslateblue;
}
.btn:hover{
  background-color: #38306E;
}
.btn-small{
  font-size: .8em;
}
.btn-medium{
  font-size: 1em;
}
.btn-large{
  font-size: 1.3em;
}


/***
  title: Round buttons
  section: Buttons
  description: Very pretty rounded buttons
  example: |
    <a href="" class="btn btn-small btn-round">button</a>
    <a href="" class="btn btn-medium btn-round">button</a>
    <a href="" class="btn btn-large btn-round">button</a>
***/

.btn-round{
  border-radius: 20px;
}


/***
  title: Links
  section: Buttons
  id: btn-link
  description: Very pretty rounded buttons
  example:
    <a href="" class="btn-link">button</a>
***/

.btn-link{
  background: none;
  color: darkslateblue;
}
.btn-link:hover{
  text-decoration: none;
}

/***
  title: Includes
  section: Includes
  description: Include example code from other items. You can refer to any attribute(set), like 'id'
  example: |
    <div class="btn-group">
        <include title="Links" section="Buttons">
        <include title="Links" section="Buttons">
        <include id="btn-link">
    </div>
***/
.btn-group .btn-link {
    background: green;
}

````


````js
var StyleGuide = require('styleguidejs');
sg = new StyleGuide();
sg.addFile("mystyle.css");
sg.render({
    extraCss: ['append-custom.css'],
    extraJs: ['jquery.js'],
    outputFile: "test/index.html"
});
````

See /test for a demo implementation, and demo export file (index.html). You can add your own properties in the Yaml data,
and parse them in your custom template.

### Customize look and feel
Feel free to use your own look and feel. Include your own css, js or use your own Jade-template.

````js
var StyleGuide = require('styleguidejs');
var sg = new StyleGuide();
sg.addFile("mystyle.css");
sg.render({
    templateCss: "styleguide/style.css",
    templateJs: "styleguide/script.js",
    template: "styleguide/template.jade",
    beautifyHtml: {
      preserve_newlines: false // see https://www.npmjs.com/package/js-beautify
    },
    outputFile: "test/index.html"
});
````


### Hide items
If you set `visible: false` in your YAML, it won't show up in your styleguide. This is mostly useful when working with includes.

```css
/***
  title: My title
  section: My Section
  visible: false
  example:
    <div class="invisible">I won't show up inside your styleguide</div>
***/
```


### Micro template
When using includes you can use template strings inside your example. Use `{attribute}="attribute data"` inside your include tag. Anything in the include template matching exactly `{attribute}` will be replaced by its value.

```css
/***
  title: Override classnames
  section: Whatever
  id: includeId
  visible: false
  example:
    <div class="{templateVars}">
      {templateVars}
    </a>
***/

/***
  title: Override classnames
  section: Whatever
  example:
    <include id="includeId" {templateVars}="template-data" />
***/
```

will render

```html
  <div class="template-data">
    template-data
  </a>
```


### Grunt task
See [grunt-styleguidejs](https://github.com/EightMedia/grunt-styleguidejs) for using styleguide.js inside your gruntfile.

### Gulp task
See [gulp-styleguidejs](https://github.com/aptkf/gulp-styleguidejs) for using styleguide.js as a gulp plugin.
