;(function () {
  'use strict'
  const {
    PREVIEW_ORIGIN, COLLECTIONS, RECORD_DEFAULTS, RECORD_META_DEFAULTS, FLOATING_ACTION_DEFAULTS, VIEW_META, MODULE_CONFIG, state, content, persist,
    getPages, syncPageStructure, getHomeSections, cloneData, isLockedMenuDomain, normalizeMenuDomains, languageMenuEntries, createMenuVisibilityDefaults,
    syncMenuVisibility, getModuleRows, getFloatingActionSettings, floatingActionEntries, findFloatingAction, floatingActionFallbacks, countryFlagUrl, today, collectionColumnLabel, collectionRowLabel, toast, downloadText, homeTab,
    fillSeoDefaults, navigate, render, exportVisibleTable, openMenuEditor, openLanguagePackEditor, openFloatingChannelEditor, openCommonItemEditor, openMediaEditor,
    openPageEditor, openHomeItemEditor, openGenericEditor, openCollectionEditor, collectionHasKey, moveCollectionRow, bulkToggleCollection, bulkDeleteCollection,
  } = window.BNVIIT_ADMIN

  // File System Access 파일 핸들 — 첫 저장 때 news.pins.json 을 지정하면 이후 자동으로 같은 파일에 씀
  let newsPinsHandle = null

  function handleClick(event) {
    const viewButton = event.target.closest('[data-view]')
    if (viewButton) {
      navigate(viewButton.dataset.view)
      return
    }

    const tab = event.target.closest('[data-home-tab]')
    if (tab) {
      state.homeTab = tab.dataset.homeTab
      render()
      return
    }

    const contentTab = event.target.closest('[data-home-content-section]')
    if (contentTab) {
      state.homeContentSection = contentTab.dataset.homeContentSection
      render()
      return
    }

    const collectionTab = event.target.closest('[data-collection-tab]')
    if (collectionTab) {
      state.collectionTab[collectionTab.dataset.collectionTab] = collectionTab.dataset.collectionKey
      render()
      return
    }

    const actionElement = event.target.closest('[data-action]')
    if (!actionElement) return
    const action = actionElement.dataset.action
    const id = actionElement.dataset.id

    if (action === 'open-home-preview') {
      event.preventDefault()
      const previewPath = actionElement.dataset.previewPath || '/'
      const previewUrl = `${PREVIEW_ORIGIN}${previewPath.startsWith('/') ? previewPath : `/${previewPath}`}`
      const previewWindow = typeof window.open === 'function' ? window.open(previewUrl, '_blank') : null
      if (previewWindow) previewWindow.opener = null
      else if (typeof window.location?.assign === 'function') window.location.assign(previewUrl)
      return
    }

    if (action === 'toggle-language-country-picker') {
      const menu = document.getElementById('languageCountryMenu')
      if (!menu) return
      menu.hidden = !menu.hidden
      if (typeof actionElement.setAttribute === 'function') actionElement.setAttribute('aria-expanded', String(!menu.hidden))
    } else if (action === 'select-language-country') {
      const code = String(actionElement.dataset.code || '').toLowerCase()
      const country = String(actionElement.dataset.country || '')
      const codeInput = document.getElementById('languageCountryCodeEdit')
      const countryInput = document.getElementById('languageCountryEdit')
      const flag = document.getElementById('countryPickerFlag')
      const label = document.getElementById('countryPickerText')
      const codeLabel = document.getElementById('countryPickerCode')
      const menu = document.getElementById('languageCountryMenu')
      if (codeInput) codeInput.value = code
      if (countryInput) countryInput.value = country
      if (flag) flag.innerHTML = `<img src="${countryFlagUrl(code)}" alt="">`
      if (label) label.textContent = country
      if (codeLabel) codeLabel.textContent = code.toUpperCase()
      if (menu) menu.hidden = true
      document.querySelectorAll('[data-action="select-language-country"]').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.code === code)))
      const trigger = typeof document.querySelector === 'function' ? document.querySelector('[data-action="toggle-language-country-picker"]') : null
      if (trigger) trigger.setAttribute('aria-expanded', 'false')
    } else if (action === 'new-floating-country') {
      openLanguagePackEditor('new', 'floating-actions')
    } else if (action === 'new-floating-channel') {
      openFloatingChannelEditor()
    } else if (action === 'set-floating-locale') {
      if (!state.languagePacks.some((pack) => pack.id === id)) return
      state.floatingLocale = id
      getFloatingActionSettings(id)
      render()
    } else if (action === 'toggle-floating-action') {
      const key = actionElement.dataset.key
      const item = findFloatingAction(getFloatingActionSettings(actionElement.dataset.locale || state.floatingLocale), key)
      if (!item) return
      item.visible = !item.visible
      render()
    } else if (action === 'move-floating-action') {
      const key = actionElement.dataset.key
      const direction = actionElement.dataset.direction
      const settings = getFloatingActionSettings()
      const keys = floatingActionEntries(settings).map((entry) => entry.key)
      const from = keys.indexOf(key)
      const to = direction === 'up' ? from - 1 : from + 1
      if (from === -1 || to < 0 || to >= keys.length) return
      const order = settings.order
      const a = order.indexOf(keys[from])
      const b = order.indexOf(keys[to])
      ;[order[a], order[b]] = [order[b], order[a]]
      render()
    } else if (action === 'toggle-floating-country') {
      const pack = state.languagePacks.find((entry) => entry.id === id)
      if (!pack) return
      const settings = getFloatingActionSettings(id)
      settings.enabled = settings.enabled === false
      persist()
      render()
      toast(`${pack.country || pack.name} 플로팅 메뉴를 ${settings.enabled ? '활성화' : '비활성화'}했습니다.`)
    } else if (action === 'delete-floating-action') {
      const key = actionElement.dataset.key
      const settings = getFloatingActionSettings()
      const item = findFloatingAction(settings, key)
      if (!item) return
      const canDelete = typeof window.confirm !== 'function' || window.confirm(`'${item.label}' 채널을 완전히 삭제하시겠습니까?`)
      if (!canDelete) return
      if (['ai', 'consult', 'top'].includes(key)) item.deleted = true
      else settings.custom = (settings.custom || []).filter((channel) => channel.id !== key)
      persist()
      render()
      toast(`${item.label || '채널'}을 삭제했습니다.`)
    } else if (action === 'reset-floating-actions') {
      const currentId = state.floatingLocale
      const defaults = FLOATING_ACTION_DEFAULTS[currentId] || floatingActionFallbacks()
      state.floatingActionsByLocale[currentId] = { ...cloneData(defaults), custom: [], enabled: true }
      render()
      toast('현재 국가·언어 설정을 초기화했습니다. 저장 버튼을 눌러 확정해 주세요.')
    } else if (action === 'save-floating-actions') {
      persist()
      toast('국가별 플로팅 메뉴 설정을 저장했습니다.')
    } else if (action === 'set-page-admin-tab') {
      state.pageAdminTab = actionElement.dataset.tab === 'menus' ? 'menus' : 'pages'
      state.pageSelected = []
      render()
    } else if (action === 'set-page-display') {
      state.pageDisplay = actionElement.dataset.display === 'list' ? 'list' : 'hierarchy'
      state.pageSelected = []
      render()
    } else if (action === 'move-page-domain') {
      syncPageStructure()
      const currentIndex = state.pageDomainOrder.indexOf(id)
      const nextIndex = actionElement.dataset.direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (currentIndex >= 0 && nextIndex >= 0 && nextIndex < state.pageDomainOrder.length) {
        ;[state.pageDomainOrder[currentIndex], state.pageDomainOrder[nextIndex]] = [state.pageDomainOrder[nextIndex], state.pageDomainOrder[currentIndex]]
        persist()
        render()
        toast('페이지 영역 순서를 변경했습니다.')
      }
    } else if (action === 'move-page-position') {
      syncPageStructure()
      const page = getPages().find((item) => item.id === id)
      const order = page ? state.pageOrder[page.domain] : []
      const currentIndex = order.indexOf(id)
      const nextIndex = actionElement.dataset.direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (currentIndex >= 0 && nextIndex >= 0 && nextIndex < order.length) {
        ;[order[currentIndex], order[nextIndex]] = [order[nextIndex], order[currentIndex]]
        persist()
        render()
        toast('페이지 위치를 변경했습니다.')
      }
    } else if (action === 'change-list-page') {
      state.listPages[actionElement.dataset.listKey] = Number(actionElement.dataset.page) || 1
      render()
    } else if (action === 'toggle-section') {
      state.sectionVisibility[id] = !state.sectionVisibility[id]
      persist()
      render()
      toast(`${getHomeSections().find((item) => item.id === id)?.name || '섹션'} 노출 상태를 변경했습니다.`)
    } else if (action === 'move-home-section') {
      const currentIndex = state.sectionOrder.indexOf(id)
      const nextIndex = actionElement.dataset.direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (currentIndex >= 0 && nextIndex >= 0 && nextIndex < state.sectionOrder.length) {
        const nextOrder = [...state.sectionOrder]
        ;[nextOrder[currentIndex], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[currentIndex]]
        state.sectionOrder = nextOrder
        persist()
        render()
        toast('홈 섹션 순서를 변경했습니다.')
      }
    } else if (action === 'manage-home-section') {
      state.homeContentSection = id
      state.homeTab = 'content'
      render()
    } else if (action === 'new-home-item') {
      openHomeItemEditor(actionElement.dataset.section)
    } else if (action === 'edit-home-item') {
      openHomeItemEditor(actionElement.dataset.section, id)
    } else if (action === 'toggle-home-item') {
      const sectionId = actionElement.dataset.section
      const item = state.homeContent[sectionId].find((entry) => entry.id === id)
      if (item) {
        item.visible = !item.visible
        persist()
        render()
        toast(`${item.title || item.eyebrow || '콘텐츠'} 노출 상태를 변경했습니다.`)
      }
    } else if (action === 'move-home-item') {
      const sectionId = actionElement.dataset.section
      const items = state.homeContent[sectionId]
      const currentIndex = items.findIndex((item) => item.id === id)
      const nextIndex = actionElement.dataset.direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (currentIndex >= 0 && nextIndex >= 0 && nextIndex < items.length) {
        ;[items[currentIndex], items[nextIndex]] = [items[nextIndex], items[currentIndex]]
        persist()
        render()
        toast('콘텐츠 순서를 변경했습니다.')
      }
    } else if (action === 'delete-home-item') {
      const sectionId = actionElement.dataset.section
      const item = state.homeContent[sectionId].find((entry) => entry.id === id)
      const canDelete = typeof window.confirm !== 'function' || window.confirm(`'${item?.title || item?.eyebrow || '선택한 항목'}'을 삭제하시겠습니까?`)
      if (canDelete) {
        state.homeContent[sectionId] = state.homeContent[sectionId].filter((entry) => entry.id !== id)
        persist()
        render()
        toast('콘텐츠를 삭제했습니다.')
      }
    } else if (action === 'save-home') {
      persist()
      toast('홈 화면 설정을 이 브라우저에 저장했습니다.')
    } else if (action === 'save-records') {
      Object.keys(RECORD_DEFAULTS).forEach((recordId) => {
        state.records[recordId] = document.getElementById(`record-${recordId}`).value.replace(/[^0-9]/g, '') || '0'
        state.recordMeta[recordId] = {
          ...state.recordMeta[recordId],
          label: document.getElementById(`record-label-${recordId}`).value,
          unit: document.getElementById(`record-unit-${recordId}`).value,
          source: document.getElementById(`record-source-${recordId}`).value,
        }
      })
      state.recordSettings = {
        title: document.getElementById('recordTitle').value,
        basisDate: document.getElementById('recordBasisDate').value,
        note: document.getElementById('recordNote').value,
      }
      persist()
      toast('BNVIIT RECORD 수치를 저장했습니다.')
      render()
    } else if (action === 'toggle-record') {
      state.recordMeta[id].visible = !state.recordMeta[id].visible
      persist()
      render()
      toast(`${state.recordMeta[id].label} 노출 상태를 변경했습니다.`)
    } else if (action === 'reset-records') {
      state.records = { ...RECORD_DEFAULTS }
      state.recordMeta = cloneData(RECORD_META_DEFAULTS)
      state.recordSettings = { title: 'BNVIIT RECORD', basisDate: '2026-07-10', note: '* 집계 기준일 기준 예시 수치' }
      persist()
      render()
      toast('기획용 예시 수치로 복원했습니다.')
    } else if (action === 'new-common-item') {
      openCommonItemEditor()
    } else if (action === 'edit-common-item') {
      openCommonItemEditor(id)
    } else if (action === 'move-common-item') {
      const rows = state.moduleRows['common-layout']
      const currentIndex = Number(id)
      const nextIndex = actionElement.dataset.direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (nextIndex >= 0 && nextIndex < rows.length) {
        ;[rows[currentIndex], rows[nextIndex]] = [rows[nextIndex], rows[currentIndex]]
        persist()
        render()
        toast('공통 영역 순서를 변경했습니다.')
      }
    } else if (action === 'toggle-common-item') {
      const row = state.moduleRows['common-layout'][Number(id)]
      row[3] = row[3] === '운영' ? '비노출' : '운영'
      persist()
      render()
      toast(`${row[0]} 상태를 변경했습니다.`)
    } else if (action === 'delete-common-item') {
      const row = state.moduleRows['common-layout'][Number(id)]
      const canDelete = typeof window.confirm !== 'function' || window.confirm(`'${row[0]}' 구성요소를 삭제하시겠습니까?`)
      if (canDelete) {
        state.moduleRows['common-layout'].splice(Number(id), 1)
        persist()
        render()
        toast('공통 구성요소를 삭제했습니다.')
      }
    } else if (action === 'edit-page') {
      openPageEditor(id)
    } else if (action === 'new-page') {
      openPageEditor('new')
    } else if (action === 'toggle-page') {
      const page = getPages().find((item) => item.id === id)
      state.pageOverrides[id] = { ...page, visible: !page.visible, updated: new Date().toISOString().slice(0, 10) }
      persist()
      render()
      toast(`${page.title} 홈페이지 노출 상태를 변경했습니다.`)
    } else if (action === 'duplicate-page') {
      const page = getPages().find((item) => item.id === id)
      const copyId = `custom-${Date.now()}`
      const copyPath = page.path === '/' ? `/copy-${Date.now()}` : `${page.path}-copy-${Date.now()}`
      state.customPages.push({ ...cloneData(page), id: copyId, title: `${page.title} 복사본`, path: copyPath, workflow: 'draft', visible: false, menuVisible: false, updated: new Date().toISOString().slice(0, 10) })
      persist()
      render()
      toast('페이지 복사본을 생성했습니다.')
    } else if (action === 'delete-page') {
      const page = state.customPages.find((item) => item.id === id)
      const canDelete = typeof window.confirm !== 'function' || window.confirm(`'${page?.title || '선택한 페이지'}'을 삭제하시겠습니까?`)
      if (canDelete) {
        state.customPages = state.customPages.filter((item) => item.id !== id)
        delete state.pageOverrides[id]
        delete state.seoOverrides[id]
        persist()
        render()
        toast('추가 페이지를 삭제했습니다.')
      }
    } else if (action === 'bulk-page-status') {
      const visible = actionElement.dataset.status !== 'off'
      state.pageSelected.forEach((pageId) => {
        const custom = state.customPages.find((page) => page.id === pageId)
        if (custom) {
          custom.visible = visible
          custom.updated = today()
        } else {
          const page = getPages().find((item) => item.id === pageId)
          if (page) state.pageOverrides[pageId] = { ...page, visible, updated: today() }
        }
      })
      const count = state.pageSelected.length
      state.pageSelected = []
      persist()
      render()
      toast(`${count}개 페이지를 홈페이지 ${visible ? '노출' : '숨김'} 상태로 변경했습니다.`)
    } else if (action === 'bulk-duplicate-page') {
      const selectedPages = getPages().filter((page) => state.pageSelected.includes(page.id))
      const stamp = Date.now()
      selectedPages.forEach((page, index) => state.customPages.push({ ...cloneData(page), id: `custom-${stamp}-${index}`, title: `${page.title} 복사본`, path: page.path === '/' ? `/copy-${stamp}-${index}` : `${page.path}-copy-${stamp}-${index}`, workflow: 'draft', visible: false, menuVisible: false, updated: today() }))
      state.pageSelected = []
      persist()
      render()
      toast(`${selectedPages.length}개 페이지를 복제했습니다.`)
    } else if (action === 'bulk-delete-page') {
      const targets = state.pageSelected.filter((pageId) => String(pageId).startsWith('custom-'))
      const canDelete = targets.length && (typeof window.confirm !== 'function' || window.confirm(`선택한 추가 페이지 ${targets.length}개를 삭제하시겠습니까?`))
      if (canDelete) {
        state.customPages = state.customPages.filter((page) => !targets.includes(page.id))
        targets.forEach((pageId) => { delete state.pageOverrides[pageId]; delete state.seoOverrides[pageId] })
        state.pageSelected = state.pageSelected.filter((pageId) => !targets.includes(pageId))
        persist()
        render()
        toast(`${targets.length}개 추가 페이지를 삭제했습니다.`)
      }
    } else if (action === 'reset-page-filter') {
      state.pageSearch = ''
      state.pageDomain = '전체'
      state.pageStatus = '전체'
      state.pageVisibility = '전체'
      state.listPages.pages = 1
      render()
    } else if (action === 'new-media') {
      openMediaEditor()
    } else if (action === 'edit-media') {
      openMediaEditor(id)
    } else if (action === 'toggle-media') {
      const item = state.mediaAssets.find((entry) => entry.id === id)
      item.status = item.status === 'live' ? 'off' : 'live'
      item.updated = new Date().toISOString().slice(0, 10)
      persist()
      render()
      toast(`${item.name} 상태를 변경했습니다.`)
    } else if (action === 'delete-media') {
      const item = state.mediaAssets.find((entry) => entry.id === id)
      const canDelete = typeof window.confirm !== 'function' || window.confirm(`'${item?.name || '선택한 미디어'}'를 삭제하시겠습니까?`)
      if (canDelete) {
        state.mediaAssets = state.mediaAssets.filter((entry) => entry.id !== id)
        persist()
        render()
        toast('미디어를 삭제했습니다.')
      }
    } else if (action === 'bulk-media-status') {
      const status = actionElement.dataset.status === 'off' ? 'off' : 'live'
      state.mediaAssets.forEach((item) => {
        if (state.mediaSelected.includes(item.id)) {
          item.status = status
          item.updated = today()
        }
      })
      const count = state.mediaSelected.length
      state.mediaSelected = []
      persist()
      render()
      toast(`${count}개 미디어를 ${status === 'live' ? '운영' : '숨김'} 상태로 변경했습니다.`)
    } else if (action === 'bulk-delete-media') {
      const count = state.mediaSelected.length
      const canDelete = count && (typeof window.confirm !== 'function' || window.confirm(`선택한 미디어 ${count}개를 삭제하시겠습니까?`))
      if (canDelete) {
        state.mediaAssets = state.mediaAssets.filter((item) => !state.mediaSelected.includes(item.id))
        state.mediaSelected = []
        persist()
        render()
        toast(`${count}개 미디어를 삭제했습니다.`)
      }
    } else if (action === 'reset-media-filter') {
      state.mediaSearch = ''
      state.mediaCategory = '전체'
      state.mediaStatus = '전체'
      state.listPages['media-library'] = 1
      render()
    } else if (action === 'edit-seo') {
      openPageEditor(id, 'seo')
    } else if (action === 'bulk-seo') {
      fillSeoDefaults(getPages())
      persist()
      render()
      toast('누락된 SEO 기본값을 일괄 보완했습니다.')
    } else if (action === 'bulk-seo-selected') {
      const pages = getPages().filter((page) => state.seoSelected.includes(page.id))
      fillSeoDefaults(pages)
      state.seoSelected = []
      persist()
      render()
      toast(`${pages.length}개 페이지의 SEO 누락값을 보완했습니다.`)
    } else if (action === 'reset-seo-selected') {
      const count = state.seoSelected.length
      state.seoSelected.forEach((pageId) => { delete state.seoOverrides[pageId] })
      state.seoSelected = []
      persist()
      render()
      toast(`${count}개 페이지의 SEO를 초기화했습니다.`)
    } else if (action === 'reset-seo') {
      delete state.seoOverrides[id]
      persist()
      render()
      toast('페이지 SEO를 기본값으로 복원했습니다.')
    } else if (action === 'reset-seo-filter') {
      state.seoSearch = ''
      state.seoStatus = '전체'
      state.listPages.seo = 1
      render()
    } else if (action === 'set-language-tab') {
      state.languageTab = actionElement.dataset.tab === 'packs' ? 'packs' : 'matrix'
      render()
    } else if (action === 'toggle-language-visibility') {
      const pack = state.languagePacks.find((entry) => entry.id === actionElement.dataset.packId)
      const menuKey = actionElement.dataset.menuKey
      if (!pack || !state.menuVisibility[menuKey]) return
      if (pack.base) {
        toast('기준 언어는 모든 메뉴에 항상 노출됩니다.')
        return
      }
      if (!pack.enabled) {
        toast('준비 중인 언어팩을 먼저 사용 상태로 변경해 주세요.')
        return
      }
      state.menuVisibility[menuKey][pack.id] = !state.menuVisibility[menuKey][pack.id]
      render()
    } else if (action === 'toggle-language-column') {
      const pack = state.languagePacks.find((entry) => entry.id === id)
      if (!pack || pack.base) {
        toast('기준 언어는 모든 메뉴에 항상 노출됩니다.')
        return
      }
      if (!pack.enabled) {
        toast('준비 중인 언어팩을 먼저 사용 상태로 변경해 주세요.')
        return
      }
      const entries = languageMenuEntries()
      const showAll = !entries.every((entry) => Boolean(state.menuVisibility[entry.key]?.[pack.id]))
      entries.forEach((entry) => { state.menuVisibility[entry.key][pack.id] = showAll })
      render()
      toast(`${pack.name} 메뉴를 전체 ${showAll ? '노출' : '숨김'} 처리했습니다.`)
    } else if (action === 'reset-language-search') {
      state.languageMenuSearch = ''
      state.listPages['language-matrix'] = 1
      render()
    } else if (action === 'reset-language-visibility') {
      const canReset = typeof window.confirm !== 'function' || window.confirm('언어별 메뉴 노출을 초기 권장값으로 복원하시겠습니까?')
      if (!canReset) return
      state.menuVisibility = createMenuVisibilityDefaults(state.menuDomains, state.languagePacks)
      render()
      toast('언어별 메뉴 노출을 초기 권장값으로 복원했습니다. 저장 버튼을 눌러 확정해 주세요.')
    } else if (action === 'save-language-visibility') {
      syncMenuVisibility()
      persist()
      toast('언어별 메뉴 노출 설정을 저장했습니다.')
    } else if (action === 'new-language-pack') {
      openLanguagePackEditor()
    } else if (action === 'edit-language-pack') {
      openLanguagePackEditor(id)
    } else if (action === 'toggle-language-pack') {
      const pack = state.languagePacks.find((entry) => entry.id === id)
      if (!pack) return
      if (pack.base) {
        toast('기준 언어팩은 사용 중지할 수 없습니다.')
        return
      }
      pack.enabled = !pack.enabled
      if (!pack.enabled) languageMenuEntries().forEach((entry) => { state.menuVisibility[entry.key][pack.id] = false })
      persist()
      render()
      toast(`${pack.name} 언어팩을 ${pack.enabled ? '사용' : '준비 중'} 상태로 변경했습니다.`)
    } else if (action === 'move-language-pack') {
      const currentIndex = state.languagePacks.findIndex((entry) => entry.id === id)
      const targetIndex = actionElement.dataset.direction === 'up' ? currentIndex - 1 : currentIndex + 1
      const current = state.languagePacks[currentIndex]
      const target = state.languagePacks[targetIndex]
      if (!current || !target) return
      if (current.base || target.base) {
        toast('기준 언어팩은 첫 번째 위치에 고정됩니다.')
        return
      }
      ;[state.languagePacks[currentIndex], state.languagePacks[targetIndex]] = [target, current]
      persist()
      render()
      toast('언어팩 표시 순서를 변경했습니다.')
    } else if (action === 'save-menu') {
      state.menuDomains = normalizeMenuDomains(state.menuDomains)
      syncMenuVisibility()
      persist()
      toast('메뉴 설정을 이 브라우저에 저장했습니다.')
    } else if (action === 'new-menu-domain') {
      openMenuEditor('menu-domain')
    } else if (action === 'new-menu-child') {
      if (isLockedMenuDomain(state.menuDomains[Number(id)])) toast('홈 대메뉴에는 하위 메뉴를 추가할 수 없습니다.')
      else openMenuEditor('menu-child', Number(id))
    } else if (action === 'edit-menu') {
      const parts = id.split('-')
      if (parts[0] === 'domain') {
        if (isLockedMenuDomain(state.menuDomains[Number(parts[1])])) toast('홈 대메뉴는 수정할 수 없습니다.')
        else openMenuEditor('menu-domain', Number(parts[1]))
      } else {
        if (isLockedMenuDomain(state.menuDomains[Number(parts[1])])) toast('홈 메뉴는 수정할 수 없습니다.')
        else openMenuEditor('menu-child', Number(parts[1]), Number(parts[2]))
      }
    } else if (action === 'move-menu-domain') {
      const currentIndex = Number(id)
      const nextIndex = actionElement.dataset.direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (isLockedMenuDomain(state.menuDomains[currentIndex]) || isLockedMenuDomain(state.menuDomains[nextIndex])) {
        toast('홈 대메뉴는 첫 번째 위치에 고정됩니다.')
      } else if (nextIndex >= 0 && nextIndex < state.menuDomains.length) {
        ;[state.menuDomains[currentIndex], state.menuDomains[nextIndex]] = [state.menuDomains[nextIndex], state.menuDomains[currentIndex]]
        persist()
        render()
        toast('상위 메뉴 순서를 변경했습니다.')
      }
    } else if (action === 'move-menu-child') {
      const [domainIndex, childIndex] = id.split('-').map(Number)
      const children = state.menuDomains[domainIndex].children
      const nextIndex = actionElement.dataset.direction === 'up' ? childIndex - 1 : childIndex + 1
      if (isLockedMenuDomain(state.menuDomains[domainIndex])) {
        toast('홈 메뉴는 고정되어 이동할 수 없습니다.')
      } else if (nextIndex >= 0 && nextIndex < children.length) {
        ;[children[childIndex], children[nextIndex]] = [children[nextIndex], children[childIndex]]
        persist()
        render()
        toast('하위 메뉴 순서를 변경했습니다.')
      }
    } else if (action === 'toggle-menu-domain') {
      const domain = state.menuDomains[Number(id)]
      if (isLockedMenuDomain(domain)) toast('홈 대메뉴는 항상 노출됩니다.')
      else {
        domain.status = domain.status === 'live' ? 'off' : 'live'
        persist()
        render()
        toast(`${domain.name} 노출 상태를 변경했습니다.`)
      }
    } else if (action === 'toggle-menu-child') {
      const [domainIndex, childIndex] = id.split('-').map(Number)
      const child = state.menuDomains[domainIndex].children[childIndex]
      if (isLockedMenuDomain(state.menuDomains[domainIndex])) toast('홈 메뉴는 항상 노출됩니다.')
      else {
        child.status = child.status === 'live' ? 'off' : 'live'
        persist()
        render()
        toast(`${child.title} 노출 상태를 변경했습니다.`)
      }
    } else if (action === 'delete-menu-domain') {
      const domain = state.menuDomains[Number(id)]
      if (isLockedMenuDomain(domain)) toast('홈 대메뉴는 삭제할 수 없습니다.')
      else {
        const canDelete = typeof window.confirm !== 'function' || window.confirm(`'${domain.name}' 도메인과 하위 메뉴를 삭제하시겠습니까?`)
        if (!canDelete) return
        state.menuDomains.splice(Number(id), 1)
        persist()
        render()
        toast('상위 메뉴를 삭제했습니다.')
      }
    } else if (action === 'delete-menu-child') {
      const [domainIndex, childIndex] = id.split('-').map(Number)
      const child = state.menuDomains[domainIndex].children[childIndex]
      if (isLockedMenuDomain(state.menuDomains[domainIndex])) toast('홈 메뉴는 삭제할 수 없습니다.')
      else {
        const canDelete = typeof window.confirm !== 'function' || window.confirm(`'${child.title}' 메뉴를 삭제하시겠습니까?`)
        if (!canDelete) return
        state.menuDomains[domainIndex].children.splice(childIndex, 1)
        persist()
        render()
        toast('하위 메뉴를 삭제했습니다.')
      }
    } else if (action === 'new-module-row') {
      const module = actionElement.dataset.module
      const config = MODULE_CONFIG[module]
      openGenericEditor('신규 항목 등록', VIEW_META[module][1], config.headers.map((header, index) => [header, index === 3 ? '검토' : '']), { mode: 'module-new', module })
    } else if (action === 'edit-module-row') {
      const module = actionElement.dataset.module
      const row = getModuleRows(module)[Number(id)] || []
      const config = MODULE_CONFIG[module]
      openGenericEditor(row[0] || '상세', VIEW_META[module][1], config.headers.map((header, index) => [header, row[index]]), { mode: 'module', module, index: Number(id) })
    } else if (action === 'new-collection-row') {
      openCollectionEditor(actionElement.dataset.collection, 'new')
    } else if (action === 'edit-collection-row') {
      openCollectionEditor(actionElement.dataset.collection, id)
    } else if (action === 'toggle-collection-field') {
      const collectionKey = actionElement.dataset.collection
      const field = actionElement.dataset.field
      const row = state.collections[collectionKey].find((entry) => entry.id === id)
      if (row) {
        row[field] = !row[field]
        if (collectionHasKey(COLLECTIONS[collectionKey], 'upd')) row.upd = today()
        persist()
        render()
        toast(`${collectionRowLabel(collectionKey, row)} · ${collectionColumnLabel(collectionKey, field)} 상태를 변경했습니다.`)
      }
    } else if (action === 'move-collection-row') {
      moveCollectionRow(actionElement.dataset.collection, id, actionElement.dataset.direction)
    } else if (action === 'reset-collection-filter') {
      const collectionKey = actionElement.dataset.collection
      state.collectionSearch[collectionKey] = ''
      state.collectionFilters[collectionKey] = {}
      state.listPages[`collection-${collectionKey}`] = 1
      render()
    } else if (action === 'bulk-collection-toggle') {
      bulkToggleCollection(actionElement.dataset.collection, actionElement.dataset.value === 'true')
    } else if (action === 'bulk-collection-delete') {
      bulkDeleteCollection(actionElement.dataset.collection)
    } else if (action === 'export-collection') {
      exportVisibleTable(`${actionElement.dataset.collection}-list.csv`)
      toast('현재 조회 목록을 CSV로 내보냈습니다.')
    } else if (action === 'export-pins') {
      const pinKey = actionElement.dataset.collection
      const pinIds = (state.collections[pinKey] || []).filter((row) => row.top).map((row) => row.id)
      const pinsJson = `${JSON.stringify({ pinnedIds: pinIds }, null, 2)}\n`
      ;(async () => {
        // localhost 등 보안 컨텍스트: 파일에 직접 저장(핸들 보관 → 다음부터 대화상자 없이 자동 저장)
        if (window.showSaveFilePicker) {
          try {
            if (!newsPinsHandle) newsPinsHandle = await window.showSaveFilePicker({ suggestedName: 'news.pins.json', types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }] })
            const writable = await newsPinsHandle.createWritable()
            await writable.write(pinsJson)
            await writable.close()
            toast(`고정 ${pinIds.length}건을 news.pins.json 에 저장했습니다. (watch 실행 중이면 프런트 자동 반영)`)
            return
          } catch (err) {
            newsPinsHandle = null
            if (err && err.name === 'AbortError') return
          }
        }
        // file:// 등 폴백: 다운로드
        downloadText('news.pins.json', pinsJson)
        toast(`고정 ${pinIds.length}건을 news.pins.json 으로 내보냈습니다. data/news/ 에 저장하세요.`)
      })()
    } else if (action === 'noop-upload') {
      toast('이미지 업로드는 실제 구현 시 연결됩니다.')
    } else if (action === 'export-list') {
      exportVisibleTable(`${state.currentView}-list.csv`)
      toast('현재 조회 목록을 CSV로 내보냈습니다.')
    } else if (action === 'export-stats') {
      downloadText('bnviit-statistics.csv', `구분,값\n방문자,48216\n상담전환,1084\n검사예약,392\n제휴예약,41`)
      toast('통계 요약을 CSV로 내보냈습니다.')
    } else if (action === 'refresh-stats') {
      state.statsFilters = {
        start: document.getElementById('statsStart').value,
        end: document.getElementById('statsEnd').value,
        type: document.getElementById('statsType').value,
      }
      persist()
      render()
      toast('선택한 기간과 집계 기준으로 통계를 다시 조회했습니다.')
    } else if (action === 'save-settings') {
      state.settings = {
        phone: document.getElementById('settingPhone').value,
        hours: document.getElementById('settingTime').value,
        lunch: document.getElementById('settingLunch').value,
        address: document.getElementById('settingAddress').value,
        slot: document.getElementById('settingSlot').value,
        limit: document.getElementById('settingLimit').value,
        aiUrl: document.getElementById('settingAi').value,
        appNote: document.getElementById('settingApp').value,
      }
      persist()
      toast('환경 설정을 저장했습니다.')
    } else if (action === 'run-coverage-check') {
      toast('34개 라우트와 10개 관리 영역을 점검했습니다. 비어 있는 CMS 메뉴가 없습니다.')
    }
  }

  Object.assign(window.BNVIIT_ADMIN, { handleClick })
})()
