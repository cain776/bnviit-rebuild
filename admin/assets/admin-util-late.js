;(function () {
  'use strict'
  const {
    state, downloadText, render,
  } = window.BNVIIT_ADMIN

  // render() rebuilds the whole view via innerHTML, which destroys the focused
  // search <input>. Doing that on every keystroke aborts Korean IME composition
  // (스마일 → ㅅㅡㅁㅏㅇㅣㄹ) and can drop characters typed during the rebuild.
  // So we debounce: state is updated synchronously by the caller, but the DOM is
  // only rebuilt after typing pauses, and never while a composition is live.
  let pendingId = null
  let pendingCaret = null
  let pendingTimer = null

  function fireRender() {
    // A composition may still be open if the user paused mid-syllable — wait it out.
    if (state.imeComposing) {
      pendingTimer = setTimeout(fireRender, 60)
      return
    }
    pendingTimer = null
    const before = document.getElementById(pendingId)
    const livePos = before && typeof before.selectionStart === 'number' ? before.selectionStart : null
    render()
    const after = document.getElementById(pendingId)
    if (after) {
      after.focus()
      const pos = livePos != null ? livePos : (after.value ? after.value.length : (pendingCaret || 0))
      if (typeof after.setSelectionRange === 'function') after.setSelectionRange(pos, pos)
    }
  }

  function renderPreservingFocus(id, caret) {
    pendingId = id
    pendingCaret = caret
    if (pendingTimer) clearTimeout(pendingTimer)
    pendingTimer = setTimeout(fireRender, 160)
  }

  function exportVisibleTable(filename) {
    const rows = Array.from(document.querySelectorAll('.data-table tr')).filter((row) => !row.hidden)
    const csv = rows.map((row) => Array.from(row.querySelectorAll('th, td')).slice(0, -1).map((cell) => `"${cell.textContent.trim().replaceAll('"', '""')}"`).join(',')).join('\n')
    downloadText(filename, csv)
  }

  Object.assign(window.BNVIIT_ADMIN, { renderPreservingFocus, exportVisibleTable })
})()
