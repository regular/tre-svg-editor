const ace = require('brace')

module.exports = function makeEditor(pre, mode, onChange, onError, opts)  {
  const editor = ace.edit(pre)
  if (opts.ace_theme) editor.setTheme(opts.ace_theme)
  editor.session.setMode(`ace/mode/${mode}`)

  editor.session.on('change', Changes(editor, 20, (err, value) => {
    onChange(value)
  }))

  editor.session.on('changeAnnotation', () => {
    const ans = editor.session.getAnnotations()
    if (ans.length !== 0) {
      onError(ans[0].text)
    } else {
      onError(null)
    }
  })

  function setText(newContent) {
    const old = editor.session.getValue()
    if (newContent == old) return

    const currentPosition = editor.selection.getCursor()
    const scrollTop = editor.session.getScrollTop()
    editor.session.setValue(newContent || '')
    editor.clearSelection()
    editor.gotoLine(currentPosition.row + 1, currentPosition.column)
    editor.session.setScrollTop(scrollTop)
  }
  return {
    setText
  }
}

function Changes(editor, ms, cb) {
  return debounce(ms, ()=>{
    const value = editor.session.getValue() 
    cb(null, value)
  })
}

function debounce(ms, f) {
  let timerId

  return function() {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(()=>{
      timerid = null
      f()
    }, ms)
  }
}

