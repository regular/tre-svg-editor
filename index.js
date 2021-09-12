const h = require('mutant/html-element')
const Value = require('mutant/value')
const computed = require('mutant/computed')
const watch = require('mutant/watch')
const setStyle = require('module-styles')('tre-svg-editor')
const Str = require('tre-string')
const Editor = require('./editor')
const prettify = require('./prettify')
require('brace/mode/xml')

setStyle(`
  .tre-svg-editor .tre-editor-with-preview {
    display: grid;
    grid-rows: 1fr 64px;
  }
  .tre-svg-editor pre.editor {
    min-height: 200px;
    grid-row: 1/3;
    grid-column: 1/2;
    z-index: 0;
  }
  .tre-svg-editor .tre-svg-thumbnail {
    grid-row: 2/3;
    grid-column: 1/2;
    z-index: 1;
    align-self: start;
    pointer-events: none;
  }
`)


module.exports = function(ssb, opts) {
  opts = opts || {}

  return function render(kv, ctx) {
    ctx = ctx || {}
    const content = kv && kv.value && kv.value.content
    if (content.type !== 'svg') return

    const contentObs = ctx.contentObs || Value({})

    const previewObs = ctx.previewObs || Value(kv)
    const svgObs = computed(previewObs, kv => kv && kv.value.content.svg || '')
    const cssObs = computed(svgObs, svg =>{
      return `/*\n${svg}\n*/` // TODO
    })

    if (ctx.where == 'thumbnail' || ctx.where == 'tile') {
      return renderThumbnail()
    } else if (ctx.where == 'editor' || ctx.where == 'compact-editor') {
      return renderEditor()
    }
    return renderCSS()

    function renderThumbnail() {
      return h('.tre-svg-thumbnail', {
        innerHTML: svgObs
      })
    }

    function renderCSS() {
      return h('style', {
        attributes: {
          'data-key': kv.key
        }
      }, cssObs)
    }

    function renderEditor() {
      const nameObs = computed(previewObs, kv => kv && kv.value.content.name)

      const syntaxErrorObs = ctx.syntaxErrorObs || Value()
      const contentLengthObs = computed(contentObs, c => JSON.stringify(c).length)
      const compact = ctx.where == 'compact-editor'

      function set(o) {
        contentObs.set(Object.assign({}, contentObs(), o))
      }

      const renderStr = Str({
        save: name => set({name})
      })

      const pre = h('pre.editor', svgObs())

      function onError(a) {
        syntaxErrorObs.set(a)
      }
      function onChange(svg) {
        set({svg})
      }
      const editor = Editor(pre, 'xml', onChange, onError, opts)

      const abort = watch(contentObs, newContent => {
        editor.setText(newContent.svg)
      })

      return h(`.tre-svg-editor${compact ? '.compact': ''}`, {
        hooks: [el => abort]
      }, [
        h('h1', renderStr(computed(nameObs, n => n ? n : 'No Name'))),
        h('.tre-editor-with-preview', [
          pre,
          renderThumbnail(),
        ]),
        h('.tre-editor-button-bar', [
          h('button', {
            'ev-click':()=>{
              editor.setText(prettify(svgObs()))
            }
          }, 'Prettify')
        ]),
        ctx.where == 'compact-editor' ? renderCSS(kv, ctx) : [],
        h('div', [
          // move to editor shell
          h('span.bytesLeft', computed(contentLengthObs, len => `${8192 - 512 - len} characters left`)),
          h('span.error', syntaxErrorObs)
        ])
      ])
    }

  }
}

