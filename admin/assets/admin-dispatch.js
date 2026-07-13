;(function () {
  'use strict'
  const {
    COLLECTION_VIEWS, NAV_GROUPS, VIEW_META, state, content, sideNav, breadcrumb, pageTitle,
    validView, getPages, getModuleRows, collectionViewCount, escapeHtml, closeSidebar, renderDashboard, renderCoverage,
    renderHomeManager, renderCommonLayoutManager, renderPageMenuWorkspace, renderMediaManager, renderSeoManager, renderLanguageManager, renderModuleList, renderCollectionView,
    renderFloatingActionsManager,
    renderAnalytics, renderSettings, renderMigration,
  } = window.BNVIIT_ADMIN
  const renderLegacyConsultations = window.BNVIIT_ADMIN.renderLegacyConsultations || (() => renderCollectionView('consultations'))
  const hydrateLegacyConsultations = window.BNVIIT_ADMIN.hydrateLegacyConsultations || (() => {})
  const renderLegacyEntityView = window.BNVIIT_ADMIN.renderLegacyEntityView || ((view) => renderCollectionView(view))
  const hydrateLegacyEntityView = window.BNVIIT_ADMIN.hydrateLegacyEntityView || (() => {})

  function renderSidebar() {
    // 배지는 약어 대신 사이드바 전체를 관통하는 연속 번호(01, 02, …)로 표시한다.
    let navSeq = 0
    sideNav.innerHTML = NAV_GROUPS.map((group) => `
      <section class="nav-group">
        <h2 class="nav-group-title">${escapeHtml(group.label)}</h2>
        ${group.items.map((item) => {
          navSeq += 1
          const navNo = String(navSeq).padStart(2, '0')
          return `
          <button class="nav-item${item.id === state.currentView ? ' is-active' : ''}" type="button" data-view="${item.id}">
            <span class="nav-icon" aria-hidden="true">${navNo}</span>
            <span>${escapeHtml(item.label)}</span>
            ${navCount(item) ? `<span class="nav-count">${navCount(item)}</span>` : ''}
          </button>
        `}).join('')}
      </section>
    `).join('')
  }

  function navCount(item) {
    if (item.id === 'consultations' && Number(window.BNVIIT_ADMIN.legacyConsultationTotal)) return Number(window.BNVIIT_ADMIN.legacyConsultationTotal)
    if (['members', 'reviews', 'doctors'].includes(item.id) && Number(window.BNVIIT_ADMIN.legacyEntityTotals?.[item.id])) return Number(window.BNVIIT_ADMIN.legacyEntityTotals[item.id])
    if (item.id === 'pages' || item.id === 'seo') return getPages().length
    if (item.id === 'common-layout') return getModuleRows('common-layout').length
    if (item.id === 'floating-actions') return state.languagePacks.length
    if (item.id === 'menus') return state.menuDomains.length
    if (item.id === 'media-library') return state.mediaAssets.length
    if (item.id === 'languages') return state.languagePacks.length
    return COLLECTION_VIEWS[item.id] ? collectionViewCount(item.id) : item.count
  }

  function navigate(view) {
    if (!validView(view)) return
    state.currentView = view
    location.hash = view
    render()
    closeSidebar()
    document.getElementById('content').focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function render() {
    renderSidebar()
    const [group, title] = VIEW_META[state.currentView]
    breadcrumb.textContent = group
    pageTitle.textContent = title

    switch (state.currentView) {
      case 'dashboard': content.innerHTML = renderDashboard(); break
      case 'coverage': content.innerHTML = renderCoverage(); break
      case 'home': content.innerHTML = renderHomeManager(); break
      case 'common-layout': content.innerHTML = renderCommonLayoutManager(); break
      case 'floating-actions': content.innerHTML = renderFloatingActionsManager(); break
      case 'pages': content.innerHTML = renderPageMenuWorkspace(); break
      case 'menus': content.innerHTML = renderPageMenuWorkspace('menus'); break
      case 'media-library': content.innerHTML = renderMediaManager(); break
      case 'seo': content.innerHTML = renderSeoManager(); break
      case 'languages': content.innerHTML = renderLanguageManager(); break
      case 'analytics': content.innerHTML = renderAnalytics(); break
      case 'settings': content.innerHTML = renderSettings(); break
      case 'migration': content.innerHTML = renderMigration(); break
      case 'consultations':
        content.innerHTML = renderLegacyConsultations()
        queueMicrotask(hydrateLegacyConsultations)
        break
      case 'members':
      case 'reviews':
      case 'doctors':
        content.innerHTML = renderLegacyEntityView(state.currentView)
        queueMicrotask(() => hydrateLegacyEntityView(state.currentView))
        break
      default:
        content.innerHTML = COLLECTION_VIEWS[state.currentView]
          ? renderCollectionView(state.currentView)
          : renderModuleList(state.currentView)
    }
  }

  Object.assign(window.BNVIIT_ADMIN, { renderSidebar, navCount, navigate, render })
})()
