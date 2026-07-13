;(function () {
  'use strict'
  const {
    state, validView, openSidebar, closeSidebar, navigate, render, saveEditor, handleClick,
    handleInput, handleChange,
  } = window.BNVIIT_ADMIN

  document.addEventListener('click', handleClick)
  document.addEventListener('input', handleInput)
  document.addEventListener('change', handleChange)
  // Track IME composition so search inputs don't re-render mid-composition,
  // which would split Hangul into jamo (see renderPreservingFocus).
  document.addEventListener('compositionstart', () => { state.imeComposing = true })
  document.addEventListener('compositionend', (event) => {
    state.imeComposing = false
    handleInput(event)
  })
  // Safety net: if focus leaves a field mid-composition and the browser skips
  // compositionend, clear the flag so deferred renders don't stall forever.
  document.addEventListener('focusout', () => { state.imeComposing = false })
  document.getElementById('saveEditor').addEventListener('click', saveEditor)
  document.getElementById('menuToggle').addEventListener('click', openSidebar)
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar)
  document.getElementById('globalSearch').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return
    state.pageSearch = event.currentTarget.value
    navigate('pages')
  })
  window.addEventListener('hashchange', () => {
    const next = validView(location.hash.slice(1))
    if (next && next !== state.currentView) {
      state.currentView = next
      render()
    }
  })

  render()
})()
