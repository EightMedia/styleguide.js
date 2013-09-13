StyleGuide = require '../index'

sg = new StyleGuide 'Styleguide Demo'
sg.parseFile "test/fixtures/style.css"
sg.includeJS "test/fixtures/script.js"
sg.renderToFile "test/index.html"