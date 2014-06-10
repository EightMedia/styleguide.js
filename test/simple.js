var StyleGuide = require('../main.js');

var sg = new StyleGuide();
sg.addFile("test/fixtures/includes/style1.css");
sg.addFile("test/fixtures/includes/style2.css");
sg.render({ outputFile: 'test/expected/includes.html'}, function() {
        //console.log(arguments);
    }
);
