(function() {
  var Guide, all_frames, guide, scaleIframes, source_css, source_js, _i, _len, _ref;

  source_css = document.querySelector('textarea.source_css').textContent;

  source_js = document.querySelector('textarea.source_js').textContent;

  Guide = function(guide) {
    var d, guide_source, iframe, preview, script, source, stylesheet;
    preview = guide.querySelector('.preview');
    source = guide.querySelector('.source');
    iframe = guide.querySelector('.preview iframe');
    if (!source) {
      return false;
    }
    guide_source = source.textContent;
    d = iframe.contentWindow.document;
    d.open();
    d.write("<!DOCTYPE html><html><head></head><body style='padding: 20px'>" + guide_source + "</body></html>");
    stylesheet = d.createElement('style');
    stylesheet.innerHTML = source_css;
    d.querySelector('head').appendChild(stylesheet);
    script = d.createElement('script');
    script.innerHTML = source_js;
    d.querySelector('head').appendChild(script);
    d.close();
    return guide.querySelector("a.toggle").addEventListener("click", function(ev) {
      preview.classList.toggle('hidden');
      source.classList.toggle('hidden');
      return ev.preventDefault();
    });
  };

  _ref = document.querySelectorAll('.guide');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    guide = _ref[_i];
    Guide(guide);
  }

  all_frames = document.querySelectorAll('.preview iframe');

  scaleIframes = function() {
    var frame, _j, _len1, _results;
    _results = [];
    for (_j = 0, _len1 = all_frames.length; _j < _len1; _j++) {
      frame = all_frames[_j];
      _results.push(frame.height = frame.contentWindow.document.querySelector('html').scrollHeight);
    }
    return _results;
  };

  scaleIframes();

  setInterval(scaleIframes, 500);

}).call(this);
