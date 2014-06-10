sourceCss = document.querySelector('textarea.sourceCss').textContent;
sourceJs = document.querySelector('textarea.sourceJs').textContent;

// forEach for nodelists...
NodeList.prototype.forEach = Array.prototype.forEach;

function GuideElement(element) {
    var preview = element.querySelector('.preview');
    var source = element.querySelector('.source');
    var iframe = element.querySelector('.preview iframe');

    if(!source) {
        return;
    }

    var d = iframe.contentWindow.document;
    d.open();
    d.write("<!DOCTYPE html><html><head></head><body style='padding: 20px'>"+ source.textContent +"</body></html>");

    // append stylesheet
    var stylesheet = d.createElement('style');
    stylesheet.innerHTML = sourceCss;
    d.querySelector('head').appendChild(stylesheet);

    // append js
    var script = d.createElement('script');
    script.innerHTML = sourceJs;
    d.querySelector('head').appendChild(script);

    d.close();

    // toggle link
    element.querySelector("a.toggle").addEventListener("click", function(ev) {
        preview.classList.toggle('hidden');
        source.classList.toggle('hidden');
        ev.preventDefault();
    });
}

document.querySelectorAll('.guide').forEach(function(guide) {
    GuideElement(guide);
});

var iframes = document.querySelectorAll('.preview iframe');
function scaleIframes() {
    iframes.forEach(function(frame) {
        frame.height = frame.contentWindow.document.querySelector('html').scrollHeight;
    });
}

scaleIframes();
setInterval(scaleIframes, 500);
