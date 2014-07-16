var sourceCss = document.querySelector('textarea.sourceCss').textContent;
var sourceJs = document.querySelector('textarea.sourceJs').textContent;

var guides = document.querySelectorAll('.guide');
var iframes = document.querySelectorAll('.preview iframe');

// forEach for nodelists...
NodeList.prototype.forEach = Array.prototype.forEach;


/**
 * create new guide element that contains a preview in a iframe
 * and toggle to view the source
 * @param element
 */
function createGuideElement(element) {
    // already setup
    if(element.__hasGuide) {
        return;
    }

    var preview = element.querySelector('.preview');
    var source = element.querySelector('.source');
    var iframe = element.querySelector('.preview iframe');

    if(!source) {
        return;
    }

    // write the preview html to the iframe
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

    element.__hasGuide = true;
}

/**
 * load the visible guide element
 */
function loadVisibleGuides() {
    guides.forEach(function(guide) {
        if(guide.offsetHeight && guide.offsetWidth) {
            createGuideElement(guide);
        }
    });
    scaleIframes();
}

/**
 * scale the iframes to contain their content
 */
function scaleIframes() {
    iframes.forEach(function(frame) {
        frame.height = frame.contentWindow.document.querySelector('html').scrollHeight;
    });
}


window.addEventListener('hashchange', loadVisibleGuides);
window.addEventListener('load', function() {
    setTimeout(function() {
        loadVisibleGuides();
        setInterval(scaleIframes, 500);
    }, 100)
}, false);

