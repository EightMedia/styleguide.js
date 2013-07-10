StyleGuide = require '../index'

sg = new StyleGuide('Styleguide Demo')
sg.parseFile("test/fixtures/style.css")
sg.renderToFile("test/index.html")