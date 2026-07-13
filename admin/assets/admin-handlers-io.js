;(function () {
  'use strict'
  const {
    FLOATING_CHANNEL_PRESETS, state, persist, getPages, getFloatingActionSettings, findFloatingAction, formatNumber, paginateRows, getSeoData, visibleCollectionRows, render,
    renderPreservingFocus,
  } = window.BNVIIT_ADMIN

  function handleInput(event) {
    if (event.target.dataset?.floatingAction && event.target.dataset?.floatingField) {
      const key = event.target.dataset.floatingAction
      const field = event.target.dataset.floatingField
      const item = findFloatingAction(getFloatingActionSettings(), key)
      if (item && ['label', 'target'].includes(field)) {
        item[field] = event.target.value
        if (field === 'label' && typeof document.querySelector === 'function') {
          const preview = document.querySelector(`[data-floating-preview="${key}"] b`)
          if (preview) preview.textContent = event.target.value
        }
      }
    }
    if (event.target.dataset?.recordValue !== undefined) {
      const digits = event.target.value.replace(/[^0-9]/g, '')
      event.target.value = digits ? formatNumber(digits) : ''
    }
    if (event.target.id === 'pageSearch') {
      state.pageSearch = event.target.value
      state.listPages.pages = 1
      renderPreservingFocus('pageSearch', state.pageSearch.length)
    }
    if (event.target.id === 'mediaSearch') {
      state.mediaSearch = event.target.value
      state.listPages['media-library'] = 1
      renderPreservingFocus('mediaSearch', state.mediaSearch.length)
    }
    if (event.target.id === 'moduleSearch') {
      const query = event.target.value.trim().toLowerCase()
      document.querySelectorAll('[data-search-row]').forEach((row) => {
        row.hidden = query && !row.dataset.searchRow.includes(query)
      })
    }
    if (event.target.id === 'seoSearch') {
      state.seoSearch = event.target.value
      state.listPages.seo = 1
      renderPreservingFocus('seoSearch', state.seoSearch.length)
    }
    if (event.target.id === 'languageMenuSearch') {
      state.languageMenuSearch = event.target.value
      state.listPages['language-matrix'] = 1
      renderPreservingFocus('languageMenuSearch', state.languageMenuSearch.length)
    }
    if (event.target.id === 'seoTitleEdit') {
      const count = document.getElementById('seoTitleCount')
      const preview = document.getElementById('seoPreviewTitle')
      if (count) count.textContent = event.target.value.length
      if (preview) preview.textContent = event.target.value
    }
    if (event.target.id === 'seoDescriptionEdit') {
      const count = document.getElementById('seoDescriptionCount')
      const preview = document.getElementById('seoPreviewDescription')
      if (count) count.textContent = event.target.value.length
      if (preview) preview.textContent = event.target.value
    }
    if (event.target.dataset?.collectionSearch) {
      const key = event.target.dataset.collectionSearch
      state.collectionSearch[key] = event.target.value
      state.listPages[`collection-${key}`] = 1
      renderPreservingFocus(`cs-${key}`, event.target.value.length)
    }
  }

  function handleChange(event) {
    if (event.target.id === 'floatingChannelTypeEdit') {
      const preset = FLOATING_CHANNEL_PRESETS.find((item) => item.id === event.target.value)
      const label = document.getElementById('floatingChannelLabelEdit')
      const color = document.getElementById('floatingChannelColorEdit')
      if (preset) {
        const presetLabels = new Set(FLOATING_CHANNEL_PRESETS.map((item) => item.label))
        if (label && (!label.value.trim() || presetLabels.has(label.value.trim()))) label.value = preset.label
        if (color) color.value = preset.color
      }
      return
    }
    if (event.target.dataset?.pageSize) {
      const key = event.target.dataset.pageSize
      state.pageSizes[key] = Number(event.target.value) || 20
      state.listPages[key] = 1
      persist()
      render()
      return
    }
    if (event.target.dataset?.pageCheck) {
      const set = new Set(state.pageSelected)
      if (event.target.checked) set.add(event.target.dataset.id)
      else set.delete(event.target.dataset.id)
      state.pageSelected = [...set]
      render()
      return
    }
    if (event.target.dataset?.pageAll) {
      const filteredPages = getPages().filter((page) => {
        const search = state.pageSearch.trim().toLowerCase()
        return (state.pageDomain === '전체' || page.domain === state.pageDomain)
          && (state.pageStatus === '전체' || page.workflow === state.pageStatus)
          && (state.pageVisibility === '전체' || String(page.visible) === state.pageVisibility)
          && (!search || `${page.title} ${page.path} ${page.domain}`.toLowerCase().includes(search))
      })
      const currentIds = (state.pageDisplay === 'hierarchy' ? filteredPages : paginateRows('pages', filteredPages).rows).map((page) => page.id)
      const set = new Set(state.pageSelected)
      currentIds.forEach((pageId) => event.target.checked ? set.add(pageId) : set.delete(pageId))
      state.pageSelected = [...set]
      render()
      return
    }
    if (event.target.dataset?.seoCheck) {
      const set = new Set(state.seoSelected)
      if (event.target.checked) set.add(event.target.dataset.id)
      else set.delete(event.target.dataset.id)
      state.seoSelected = [...set]
      render()
      return
    }
    if (event.target.dataset?.seoAll) {
      const rows = getPages().map((page, index) => ({ page, seo: getSeoData(page, index) })).filter(({ page, seo }) => {
        const query = state.seoSearch.trim().toLowerCase()
        const matchesSearch = !query || `${page.title} ${page.path} ${seo.title}`.toLowerCase().includes(query)
        const matchesStatus = state.seoStatus === '전체' || (state.seoStatus === '완료' ? seo.complete : !seo.complete)
        return matchesSearch && matchesStatus
      })
      const currentIds = paginateRows('seo', rows).rows.map(({ page }) => page.id)
      const set = new Set(state.seoSelected)
      currentIds.forEach((pageId) => event.target.checked ? set.add(pageId) : set.delete(pageId))
      state.seoSelected = [...set]
      render()
      return
    }
    if (event.target.dataset?.mediaCheck) {
      const set = new Set(state.mediaSelected)
      if (event.target.checked) set.add(event.target.dataset.id)
      else set.delete(event.target.dataset.id)
      state.mediaSelected = [...set]
      render()
      return
    }
    if (event.target.dataset?.mediaAll) {
      const rows = state.mediaAssets.filter((item) => {
        const query = state.mediaSearch.trim().toLowerCase()
        return (state.mediaCategory === '전체' || item.category === state.mediaCategory)
          && (state.mediaStatus === '전체' || item.status === state.mediaStatus)
          && (!query || `${item.name} ${item.fileName} ${item.alt} ${item.usage}`.toLowerCase().includes(query))
      })
      const currentIds = paginateRows('media-library', rows).rows.map((item) => item.id)
      const set = new Set(state.mediaSelected)
      currentIds.forEach((itemId) => event.target.checked ? set.add(itemId) : set.delete(itemId))
      state.mediaSelected = [...set]
      render()
      return
    }
    if (event.target.dataset?.collectionFilter) {
      const key = event.target.dataset.collectionFilter
      state.collectionFilters[key] = { ...(state.collectionFilters[key] || {}), [event.target.dataset.filterId]: event.target.value }
      state.collectionSelected[key] = []
      state.listPages[`collection-${key}`] = 1
      render()
      return
    }
    if (event.target.dataset?.collectionCheck) {
      const key = event.target.dataset.collectionCheck
      const set = new Set(state.collectionSelected[key] || [])
      if (event.target.checked) set.add(event.target.dataset.id)
      else set.delete(event.target.dataset.id)
      state.collectionSelected[key] = [...set]
      render()
      return
    }
    if (event.target.dataset?.collectionAll) {
      const key = event.target.dataset.collectionAll
      state.collectionSelected[key] = event.target.checked ? visibleCollectionRows(key).map((row) => row.id) : []
      render()
      return
    }
    if (event.target.matches && event.target.matches('.form-toggle input')) {
      const wrap = event.target.closest('.form-toggle')
      const badge = wrap.querySelector('b')
      if (badge) badge.textContent = event.target.checked ? wrap.dataset.on : wrap.dataset.off
      wrap.classList.toggle('is-on', event.target.checked)
    }
    if (event.target.id === 'pageDomain') {
      state.pageDomain = event.target.value
      state.listPages.pages = 1
      render()
    }
    if (event.target.id === 'pageStatus') {
      state.pageStatus = event.target.value
      state.listPages.pages = 1
      render()
    }
    if (event.target.id === 'pageVisibility') {
      state.pageVisibility = event.target.value
      state.listPages.pages = 1
      render()
    }
    if (event.target.id === 'mediaCategory') {
      state.mediaCategory = event.target.value
      state.listPages['media-library'] = 1
      render()
    }
    if (event.target.id === 'mediaStatus') {
      state.mediaStatus = event.target.value
      state.listPages['media-library'] = 1
      render()
    }
    if (event.target.id === 'moduleStatus') {
      const mode = event.target.value
      document.querySelectorAll('#moduleRows tr').forEach((row) => {
        const text = row.textContent
        row.hidden = mode === '운영·정상' ? !/(운영|노출|승인|완료|확정|정상|활성)/.test(text)
          : mode === '검토·대기' ? !/(검토|점검|대기|상담 중|예정|예약)/.test(text)
            : mode === '연결·추가 필요' ? !/(연결 필요|추가 필요)/.test(text)
              : mode === '종료·탈퇴' ? !/(종료|탈퇴)/.test(text) : false
      })
    }
    if (event.target.id === 'seoStatus') {
      state.seoStatus = event.target.value
      state.listPages.seo = 1
      render()
    }
  }

  Object.assign(window.BNVIIT_ADMIN, { handleInput, handleChange })
})()
