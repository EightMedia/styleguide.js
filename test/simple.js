var StyleGuide = require('../main.js');

var sg = new StyleGuide();
sg.addFile("test/tmp/main.css");
sg.addFile("test/fixtures/references/style.css");
sg.addFile("test/fixtures/template/style.css");
sg.addFile("test/fixtures/includes/style2.css");
sg.render({ outputFile: 'test/expected/includes.html'}, function() {
        //console.log(arguments);
    }
);
