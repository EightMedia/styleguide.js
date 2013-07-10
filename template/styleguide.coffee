source_css = document.querySelector('textarea.source_css').textContent

for guide in document.querySelectorAll('.guide')
  iframe = guide.querySelector('.preview iframe')
  guide_source = guide.querySelector('.source textarea').textContent

  # write guide html
  d = iframe.contentWindow.document
  d.open()
  d.write("<!DOCTYPE html><html><head></head><body>#{guide_source}</body></html>")

  # append stylesheet
  stylesheet = d.createElement('style')
  stylesheet.innerHTML = source_css
  d.querySelector('head').appendChild(stylesheet)

  d.close()

scaleIframes = ->
  for frame in document.querySelectorAll('.preview iframe')
    frame.height = frame.contentWindow.document.querySelector('html').offsetHeight

scaleIframes()
window.addEventListener('resize', scaleIframes)