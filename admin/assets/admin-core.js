;(function () {
  'use strict'

  const PREVIEW_ORIGIN = 'http://localhost:5173'
  const STORAGE_KEY = 'bnviit-renewal-admin-v1'
  const CMS_CATALOG = window.BNVIIT_CMS_CATALOG || { viewMeta: {}, moduleConfig: {}, moduleRows: {}, coverageRows: [] }
  const CMS_COLLECTIONS = window.BNVIIT_CMS_COLLECTIONS || { views: {}, collections: {} }
  const SITE_MENU_MANIFEST = globalThis.BNVIIT_SITE_MENU || { sections: [] }
  const COLLECTION_VIEWS = CMS_COLLECTIONS.views || {}
  const COLLECTIONS = CMS_COLLECTIONS.collections || {}

  const {
    NAV_GROUPS,
    PAGE_DATA,
    HOME_SECTIONS,
    LANGUAGE_PACK_DEFAULTS,
    COUNTRY_OPTIONS,
    FLOATING_CHANNEL_PRESETS,
    FLOATING_ACTION_DEFAULTS,
    RECORD_DEFAULTS,
    RECORD_META_DEFAULTS,
    HOME_CONTENT_DEFAULTS,
    MEDIA_ASSET_DEFAULTS,
    VIEW_GUIDES,
  } = window.BNVIIT_ADMIN_DATA

  const MENU_DOMAINS = SITE_MENU_MANIFEST.sections.length
    ? SITE_MENU_MANIFEST.sections
      .filter((section) => section.placements.includes('structure'))
      .map((section) => ({
        name: section.label,
        path: section.path,
        systemKey: section.id,
        locked: Boolean(section.locked),
        status: 'live',
        placements: section.placements,
        children: section.adminPages.map((pageId) => PAGE_DATA.find((page) => page.id === pageId)).filter(Boolean).map(menuChild),
      }))
    : [
        { name: '홈', path: '/', systemKey: 'home', locked: true, status: 'live', children: [{ title: '메인 화면', path: '/', status: 'live', locked: true }] },
        { name: '비앤빛안과', path: '/bnviit', children: PAGE_DATA.filter((page) => page.domain === '비앤빛안과').map(menuChild) },
        { name: '시력교정', path: '/vision-correction', children: PAGE_DATA.filter((page) => page.domain === '시력교정').map(menuChild) },
        { name: '전문분야', path: '/specialty', children: PAGE_DATA.filter((page) => page.domain === '전문분야').map(menuChild) },
        { name: '상담 · 예약', path: '/booking', children: PAGE_DATA.filter((page) => page.domain === '상담/예약').map(menuChild) },
        { name: '이벤트', path: '/events', children: PAGE_DATA.filter((page) => page.domain === '이벤트').map(menuChild) },
        { name: '마이페이지', path: '/mypage', children: PAGE_DATA.filter((page) => ['회원', '마이페이지'].includes(page.domain)).map(menuChild) },
      ]

  const MODULE_ROWS = { ...window.BNVIIT_ADMIN_DATA.MODULE_ROWS }
  Object.assign(MODULE_ROWS, CMS_CATALOG.moduleRows)

  const VIEW_META = { ...window.BNVIIT_ADMIN_DATA.VIEW_META }
  Object.assign(VIEW_META, CMS_CATALOG.viewMeta)

  const MODULE_CONFIG = { ...window.BNVIIT_ADMIN_DATA.MODULE_CONFIG, ...CMS_CATALOG.moduleConfig }

  const state = loadState()
  state.currentView = validView(location.hash.slice(1)) || 'dashboard'
  state.pageAdminTab = state.currentView === 'menus' ? 'menus' : 'pages'
  if (state.currentView === 'menus') state.currentView = 'pages'
  state.pageSearch = ''
  state.pageDomain = '전체'
  state.pageStatus = '전체'
  state.pageVisibility = '전체'
  state.mediaSearch = ''
  state.mediaCategory = '전체'
  state.mediaStatus = '전체'
  state.seoSearch = ''
  state.seoStatus = '전체'
  state.listPages = {}
  state.pageSelected = []
  state.seoSelected = []
  state.mediaSelected = []
  state.pageDisplay = 'hierarchy'
  state.languageTab = 'matrix'
  state.languageMenuSearch = ''
  state.floatingLocale = state.languagePacks.some((pack) => pack.id === state.floatingLocale) ? state.floatingLocale : 'ko'
  state.homeTab = 'sections'
  state.homeContentSection = 'hero'
  state.currentEditor = null
  state.collectionSearch = {}
  state.collectionFilters = {}
  state.collectionSelected = {}

  const content = document.getElementById('content')
  const sideNav = document.getElementById('sideNav')
  const breadcrumb = document.getElementById('breadcrumb')
  const pageTitle = document.getElementById('pageTitle')
  const editorDialog = document.getElementById('editorDialog')
  const editorBody = document.getElementById('editorBody')
  const editorTitle = document.getElementById('editorTitle')
  const editorEyebrow = document.getElementById('editorEyebrow')
  const toastElement = document.getElementById('toast')
  let toastTimer

  function menuChild(page) {
    const normalized = normalizePageState(page)
    return { id: page.id, title: normalized.title, path: normalized.path, status: normalized.visible && normalized.menuVisible ? 'live' : 'off' }
  }

  function loadState() {
    const initial = {
      records: { ...RECORD_DEFAULTS },
      recordMeta: cloneData(RECORD_META_DEFAULTS),
      recordSettings: { title: 'BNVIIT RECORD', basisDate: '2026-07-10', note: '* 집계 기준일 기준 예시 수치' },
      sectionVisibility: Object.fromEntries(HOME_SECTIONS.map((item) => [item.id, item.status])),
      sectionOrder: HOME_SECTIONS.map((item) => item.id),
      sectionOverrides: {},
      homeContent: cloneData(HOME_CONTENT_DEFAULTS),
      mediaAssets: cloneData(MEDIA_ASSET_DEFAULTS),
      pageOverrides: {},
      customPages: [],
      pageDomainOrder: [...new Set(PAGE_DATA.map((page) => page.domain))],
      pageOrder: Object.fromEntries([...new Set(PAGE_DATA.map((page) => page.domain))].map((domain) => [domain, PAGE_DATA.filter((page) => page.domain === domain).map((page) => page.id)])),
      seoOverrides: {},
      pageSizes: {},
      menuDomains: MENU_DOMAINS.map((domain) => ({ ...domain, children: domain.children.map((child) => ({ ...child })) })),
      languagePacks: cloneData(LANGUAGE_PACK_DEFAULTS),
      menuVisibility: createMenuVisibilityDefaults(MENU_DOMAINS, LANGUAGE_PACK_DEFAULTS),
      floatingActionsByLocale: cloneData(FLOATING_ACTION_DEFAULTS),
      moduleRows: Object.fromEntries(Object.entries(MODULE_ROWS).map(([key, rows]) => [key, rows.map((row) => row.map((value) => Array.isArray(value) ? [...value] : value))])),
      collections: cloneCollections(),
      collectionVersions: defaultCollectionVersions(),
      collectionTab: {},
      settings: {
        phone: '1522-6800',
        hours: '평일 09:00 ~ 18:00',
        lunch: '13:30 ~ 14:30',
        address: '서울 서초구 서초대로 411 GT타워 B2층',
        slot: '30분',
        limit: '80',
        aiUrl: 'https://ai.bnviit.com/',
        appNote: 'App Store 및 Google Play 링크를 홈페이지 사후케어 페이지에 노출합니다.',
      },
      statsFilters: { start: '2026-07-01', end: '2026-07-10', type: '일별' },
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (!saved) return initial
      return {
        ...initial,
        ...saved,
        records: { ...initial.records, ...(saved.records || {}) },
        recordMeta: Object.fromEntries(Object.entries(initial.recordMeta).map(([key, value]) => [key, { ...value, ...(saved.recordMeta?.[key] || {}) }])),
        recordSettings: { ...initial.recordSettings, ...(saved.recordSettings || {}) },
        sectionVisibility: { ...initial.sectionVisibility, ...(saved.sectionVisibility || {}) },
        sectionOrder: normalizeSectionOrder(saved.sectionOrder),
        sectionOverrides: saved.sectionOverrides || {},
        homeContent: Object.fromEntries(Object.entries(initial.homeContent).map(([key, items]) => [key, Array.isArray(saved.homeContent?.[key]) ? saved.homeContent[key] : items])),
        mediaAssets: Array.isArray(saved.mediaAssets) ? saved.mediaAssets : initial.mediaAssets,
        pageOverrides: saved.pageOverrides || {},
        customPages: saved.customPages || [],
        pageDomainOrder: Array.isArray(saved.pageDomainOrder) ? saved.pageDomainOrder : initial.pageDomainOrder,
        pageOrder: saved.pageOrder && typeof saved.pageOrder === 'object' ? saved.pageOrder : initial.pageOrder,
        seoOverrides: saved.seoOverrides || {},
        pageSizes: saved.pageSizes || {},
        menuDomains: normalizeMenuDomains(saved.menuDomains || initial.menuDomains),
        languagePacks: mergeLanguagePacks(saved.languagePacks),
        menuVisibility: saved.menuVisibility && typeof saved.menuVisibility === 'object' ? saved.menuVisibility : initial.menuVisibility,
        floatingActionsByLocale: mergeFloatingActions(saved.floatingActionsByLocale),
        moduleRows: Object.fromEntries(Object.entries(initial.moduleRows).map(([key, rows]) => [key, saved.moduleRows?.[key] || rows])),
        collections: mergeCollections(saved.collections, saved.collectionVersions),
        collectionVersions: { ...(saved.collectionVersions || {}), ...initial.collectionVersions },
        collectionTab: saved.collectionTab || {},
        settings: { ...initial.settings, ...(saved.settings || {}) },
        statsFilters: { ...initial.statsFilters, ...(saved.statsFilters || {}) },
      }
    } catch (error) {
      return initial
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      records: state.records,
      recordMeta: state.recordMeta,
      recordSettings: state.recordSettings,
      sectionVisibility: state.sectionVisibility,
      sectionOrder: state.sectionOrder,
      sectionOverrides: state.sectionOverrides,
      homeContent: state.homeContent,
      mediaAssets: state.mediaAssets,
      pageOverrides: state.pageOverrides,
      customPages: state.customPages,
      pageDomainOrder: state.pageDomainOrder,
      pageOrder: state.pageOrder,
      seoOverrides: state.seoOverrides,
      pageSizes: state.pageSizes,
      menuDomains: state.menuDomains,
      languagePacks: state.languagePacks,
      menuVisibility: state.menuVisibility,
      floatingActionsByLocale: state.floatingActionsByLocale,
      moduleRows: state.moduleRows,
      collections: state.collections,
      collectionVersions: state.collectionVersions,
      collectionTab: state.collectionTab,
      settings: state.settings,
      statsFilters: state.statsFilters,
    }))
  }

  function validView(view) {
    return VIEW_META[view] ? view : ''
  }

  function normalizePageState(page) {
    const legacyStatus = page.status || 'live'
    const workflow = page.workflow || (legacyStatus === 'draft' ? 'review' : 'approved')
    const visible = typeof page.visible === 'boolean' ? page.visible : legacyStatus !== 'off'
    return {
      ...page,
      workflow,
      visible,
      menuVisible: typeof page.menuVisible === 'boolean' ? page.menuVisible : true,
    }
  }

  function getPages() {
    return PAGE_DATA
      .map((page) => normalizePageState({ ...page, ...(state.pageOverrides[page.id] || {}) }))
      .concat((state.customPages || []).map(normalizePageState))
  }

  function pageDomains(pages = getPages()) {
    const available = [...new Set(pages.map((page) => page.domain))]
    const saved = Array.isArray(state.pageDomainOrder) ? state.pageDomainOrder.filter((domain) => available.includes(domain)) : []
    return [...new Set([...saved, ...available])]
  }

  function orderedDomainPages(domain, pages = getPages()) {
    const domainPages = pages.filter((page) => page.domain === domain)
    const availableIds = domainPages.map((page) => page.id)
    const savedIds = Array.isArray(state.pageOrder?.[domain]) ? state.pageOrder[domain].filter((id) => availableIds.includes(id)) : []
    const orderedIds = [...new Set([...savedIds, ...availableIds])]
    return orderedIds.map((id) => domainPages.find((page) => page.id === id)).filter(Boolean)
  }

  function syncPageStructure() {
    const pages = getPages()
    state.pageDomainOrder = pageDomains(pages)
    state.pageOrder = Object.fromEntries(state.pageDomainOrder.map((domain) => [domain, orderedDomainPages(domain, pages).map((page) => page.id)]))
  }

  function getHomeSections() {
    const sections = Object.fromEntries(HOME_SECTIONS.map((section) => [section.id, { ...section, ...(state.sectionOverrides[section.id] || {}) }]))
    return state.sectionOrder.map((id) => sections[id]).filter(Boolean)
  }

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value))
  }

  function mergeLanguagePacks(saved) {
    const packs = Array.isArray(saved) ? saved : LANGUAGE_PACK_DEFAULTS
    return packs.map((pack) => {
      const defaults = LANGUAGE_PACK_DEFAULTS.find((item) => item.id === pack.id || item.locale.toLowerCase() === String(pack.locale || '').toLowerCase())
      const countryMatch = COUNTRY_OPTIONS.find((item) => item.name === pack.country)
      return { ...defaults, ...pack, countryCode: pack.countryCode || defaults?.countryCode || countryMatch?.code || '', country: pack.country || defaults?.country || pack.name || '' }
    })
  }

  function countryFlagUrl(code, size = 'w160') {
    const normalized = String(code || '').toLowerCase().replace(/[^a-z]/g, '')
    return normalized ? `https://flags.restcountries.com/v5/${size}/${normalized}.png` : ''
  }

  function floatingActionFallbacks() {
    return {
      ai: { label: 'AI Test', target: 'ai', visible: true },
      consult: { label: 'Consult', target: 'reqconsult', visible: true },
      top: { label: 'Back to top', target: '', visible: true },
    }
  }

  function mergeFloatingActions(saved) {
    const source = saved && typeof saved === 'object' ? saved : {}
    const ids = new Set([...Object.keys(FLOATING_ACTION_DEFAULTS), ...Object.keys(source)])
    return Object.fromEntries([...ids].map((id) => {
      const defaults = FLOATING_ACTION_DEFAULTS[id] || floatingActionFallbacks()
      const custom = source[id] && typeof source[id] === 'object' ? source[id] : {}
      const fixed = Object.fromEntries(['ai', 'consult', 'top'].map((key) => [key, { ...defaults[key], ...(custom[key] || {}) }]))
      const channels = Array.isArray(custom.custom) ? custom.custom.map((channel, index) => ({
        id: channel.id || `channel-${index + 1}`,
        label: channel.label || '추가 채널',
        target: channel.target || '',
        icon: channel.icon || 'message',
        color: channel.color || '#45BEC4',
        visible: channel.visible !== false,
      })) : []
      const merged = { ...fixed, custom: channels, enabled: custom.enabled !== false, order: Array.isArray(custom.order) ? [...custom.order] : [] }
      normalizeFloatingOrder(merged)
      return [id, merged]
    }))
  }

  function normalizeFloatingOrder(settings) {
    const validKeys = ['ai', 'consult', ...(settings.custom || []).map((channel) => channel.id), 'top']
    const saved = Array.isArray(settings.order) ? settings.order.filter((key, index, keys) => validKeys.includes(key) && keys.indexOf(key) === index) : []
    const order = [...saved]
    for (const key of validKeys) {
      if (order.includes(key)) continue
      const topIndex = order.indexOf('top')
      if (key !== 'top' && topIndex !== -1) order.splice(topIndex, 0, key)
      else order.push(key)
    }
    settings.order = order
    return order
  }

  function getFloatingActionSettings(localeId = state.floatingLocale) {
    const id = localeId || 'ko'
    if (!state.floatingActionsByLocale[id]) {
      state.floatingActionsByLocale[id] = mergeFloatingActions({ [id]: FLOATING_ACTION_DEFAULTS[id] || floatingActionFallbacks() })[id]
    }
    return state.floatingActionsByLocale[id]
  }

  function floatingActionEntries(settings, includeDeleted = false) {
    const order = normalizeFloatingOrder(settings)
    const fixed = ['ai', 'consult', 'top'].map((key) => ({ key, item: settings[key], custom: false }))
    const custom = (settings.custom || []).map((item) => ({ key: item.id, item, custom: true }))
    return [...fixed, ...custom]
      .filter((entry) => entry.item && (includeDeleted || !entry.item.deleted))
      .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
  }

  function findFloatingAction(settings, key) {
    return settings[key] || (settings.custom || []).find((item) => item.id === key)
  }

  function normalizeSectionOrder(order) {
    const validIds = HOME_SECTIONS.map((item) => item.id)
    const savedIds = Array.isArray(order) ? order.filter((id) => validIds.includes(id)) : []
    return [...new Set([...savedIds, ...validIds])]
  }

  function isLockedMenuDomain(domain) {
    return Boolean(domain && (domain.locked || domain.systemKey === 'home' || (domain.name === '홈' && domain.path === '/')))
  }

  function normalizeMenuDomains(domains) {
    const list = Array.isArray(domains) ? cloneData(domains) : []
    const defaults = cloneData(MENU_DOMAINS)
    const childIdByPath = new Map()
    defaults.forEach((domain) => (domain.children || []).forEach((child) => { if (child.id) childIdByPath.set(child.path, child.id) }))
    let home = list.find((domain) => isLockedMenuDomain(domain)) || defaults.find((domain) => isLockedMenuDomain(domain))
    home = { ...home, name: '홈', path: '/', status: 'live', systemKey: 'home', locked: true, children: [{ title: '메인 화면', path: '/', status: 'live', locked: true }] }
    const matched = new Set()
    const managed = defaults.filter((domain) => !isLockedMenuDomain(domain)).map((domain) => {
      const saved = list.find((item) => item.systemKey === domain.systemKey || item.path === domain.path)
      if (saved) matched.add(saved)
      return { ...domain, ...(saved || {}), name: domain.name, path: domain.path, systemKey: domain.systemKey, placements: domain.placements, locked: false }
    })
    const custom = list.filter((domain) => domain !== home && !isLockedMenuDomain(domain) && !matched.has(domain)).map((domain) => ({ ...domain, locked: false }))
    const result = [home, ...managed, ...custom]
    // 라벨·경로를 수정해도 언어별 노출 설정이 유지되도록 안정 id 를 보강한다(키가 id 기반이므로).
    result.forEach((domain) => {
      if (!domain.systemKey && !domain.id) domain.id = `domain-${domain.path}`
      ;(domain.children || []).forEach((child) => { if (!child.id) child.id = childIdByPath.get(child.path) || `menu-${child.path}` })
    })
    return result
  }

  function languageMenuEntries(domains = state?.menuDomains || MENU_DOMAINS) {
    return domains.flatMap((domain, domainIndex) => {
      const domainId = domain.systemKey || domain.id || domain.path
      const parent = { key: `domain:${domainId}`, name: domain.name, path: domain.path, level: 0, domain: domain.name, order: domainIndex }
      const children = (domain.children || []).map((child, childIndex) => ({ key: `menu:${domainId}:${child.id || child.path}`, name: child.title, path: child.path, level: 1, domain: domain.name, order: childIndex }))
      return [parent, ...children]
    })
  }

  function defaultMenuVisible(entry, pack) {
    if (pack.base || pack.locale === 'ko') return true
    if (!pack.enabled) return false
    if (['회원', '마이페이지'].includes(entry.domain)) return pack.locale === 'en'
    if (['en', 'ja', 'zh-CN', 'vi'].includes(pack.locale)) return true
    return entry.level === 0
  }

  function createMenuVisibilityDefaults(domains, packs) {
    return Object.fromEntries(languageMenuEntries(domains).map((entry) => [entry.key, Object.fromEntries(packs.map((pack) => [pack.id, defaultMenuVisible(entry, pack)]))]))
  }

  function syncMenuVisibility() {
    const entries = languageMenuEntries()
    const validKeys = new Set(entries.map((entry) => entry.key))
    const next = {}
    entries.forEach((entry) => {
      next[entry.key] = {}
      state.languagePacks.forEach((pack) => {
        const saved = state.menuVisibility?.[entry.key]?.[pack.id]
        next[entry.key][pack.id] = pack.base ? true : typeof saved === 'boolean' ? saved : defaultMenuVisible(entry, pack)
      })
    })
    state.menuVisibility = next
    return validKeys
  }

  function getModuleRows(view) {
    return state.moduleRows[view] || []
  }

  function cloneCollections() {
    return Object.fromEntries(Object.entries(COLLECTIONS).map(([key, def]) => [key, (def.rows || []).map((row) => ({ ...row }))]))
  }

  function defaultCollectionVersions() {
    return Object.fromEntries(Object.entries(COLLECTIONS)
      .filter(([, def]) => def.dataVersion)
      .map(([key, def]) => [key, def.dataVersion]))
  }

  function mergeCollections(saved, savedVersions = {}) {
    const base = cloneCollections()
    if (saved && typeof saved === 'object') {
      Object.keys(base).forEach((key) => {
        const currentVersion = COLLECTIONS[key]?.dataVersion
        const isCurrent = !currentVersion || savedVersions?.[key] === currentVersion
        if (isCurrent && Array.isArray(saved[key])) base[key] = saved[key].map((row) => ({ ...row }))
      })
    }
    return base
  }

  function today() {
    try {
      return new Date().toISOString().slice(0, 10)
    } catch (error) {
      return '2026-07-10'
    }
  }

  function collectionViewCount(view) {
    return (COLLECTION_VIEWS[view] || []).reduce((sum, key) => sum + (state.collections[key] ? state.collections[key].length : 0), 0)
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }

  function multiline(value) {
    return escapeHtml(value).replaceAll('\n', '<br>')
  }

  function formatNumber(value) {
    const digits = String(value ?? '').replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
    return digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
  }

  function statusBadge(status) {
    const map = {
      live: ['운영', 'badge-live'],
      draft: ['검토 중', 'badge-draft'],
      new: ['신규 필요', 'badge-new'],
      off: ['비노출', 'badge-off'],
      approved: ['승인', 'badge-live'],
      review: ['검토 중', 'badge-draft'],
      visible: ['홈 노출', 'badge-live'],
      hidden: ['홈 숨김', 'badge-off'],
      '노출': ['노출', 'badge-live'],
      '운영': ['운영', 'badge-live'],
      '승인': ['승인', 'badge-live'],
      '완료': ['완료', 'badge-live'],
      '예약 확정': ['예약 확정', 'badge-live'],
      '정상': ['정상', 'badge-live'],
      '검토': ['검토', 'badge-draft'],
      '예약': ['예약', 'badge-draft'],
      '답변 대기': ['답변 대기', 'badge-draft'],
      '상담 중': ['상담 중', 'badge-new'],
      '확인 대기': ['확인 대기', 'badge-draft'],
      '상담 예정': ['상담 예정', 'badge-new'],
      '휴면 예정': ['휴면 예정', 'badge-draft'],
      '탈퇴': ['탈퇴', 'badge-danger'],
      '활성': ['활성', 'badge-live'],
      '점검 필요': ['점검 필요', 'badge-draft'],
      '연결 필요': ['연결 필요', 'badge-new'],
      '추가 필요': ['추가 필요', 'badge-danger'],
      '민감정보': ['민감정보', 'badge-danger'],
    }
    const item = map[status] || [status, 'badge-off']
    return `<span class="badge ${item[1]}">${escapeHtml(item[0])}</span>`
  }

  function scrBadges(scr, partial) {
    if (!scr || scr.length === 0) return '<span class="scr-badge none">신규 CMS</span>'
    const list = Array.isArray(scr) ? scr : String(scr).split(' · ')
    return list.map((code) => `<span class="scr-badge${partial ? ' partial' : ''}">${partial ? '부분 ' : ''}${escapeHtml(code)}</span>`).join('')
  }

  function pageHead(title, description, actions = '') {
    const detail = VIEW_GUIDES[state.currentView] || '이 메뉴에서 관리하는 데이터와 공개 범위를 확인하고 필요한 운영 작업을 진행합니다.'
    return `<div class="page-head"><div class="page-guide-copy"><div class="page-guide-title"><span>MENU GUIDE</span><strong>${escapeHtml(title)}</strong></div><p class="page-guide-summary">${escapeHtml(description)}</p><p class="page-guide-detail">${escapeHtml(detail)}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>`
  }

  function paginateRows(key, rows) {
    const allowedSizes = [20, 60, 100]
    const requestedSize = Number(state.pageSizes[key])
    const pageSize = allowedSizes.includes(requestedSize) ? requestedSize : 20
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
    const requestedPage = Number(state.listPages[key]) || 1
    const page = Math.min(Math.max(requestedPage, 1), totalPages)
    const offset = (page - 1) * pageSize
    state.listPages[key] = page
    return { rows: rows.slice(offset, offset + pageSize), page, pageSize, totalPages, offset }
  }

  function tableFooter(summary, key, paging) {
    const { page, totalPages } = paging
    const btn = (p, label, opts = {}) => {
      const cls = `page-button${opts.nav ? ' page-nav' : ''}${opts.active ? ' is-active' : ''}`
      const aria = opts.aria ? ` aria-label="${opts.aria}"` : ''
      if (opts.disabled) return `<button class="${cls}" type="button" disabled${aria}>${label}</button>`
      return `<button class="${cls}" type="button" data-action="change-list-page" data-list-key="${escapeHtml(key)}" data-page="${p}"${opts.active ? ' aria-current="page"' : ''}${aria}>${label}</button>`
    }
    // 현재 위치 ±2 + 첫/끝 페이지만 노출하고 사이를 … 로 축약한다.
    const nums = [...new Set([1, page - 2, page - 1, page, page + 1, page + 2, totalPages])].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
    const parts = [btn(page - 1, '‹', { nav: true, disabled: page <= 1, aria: '이전 페이지' })]
    let prev = 0
    nums.forEach((p) => {
      if (p - prev > 1) parts.push('<span class="page-ellipsis" aria-hidden="true">…</span>')
      parts.push(btn(p, p, { active: p === page }))
      prev = p
    })
    parts.push(btn(page + 1, '›', { nav: true, disabled: page >= totalPages, aria: '다음 페이지' }))
    return `<div class="table-footer">
      <div class="table-footer-count">${summary}</div>
      <nav class="pagination" aria-label="목록 페이지">${parts.join('')}</nav>
      <label class="page-size-control"><span>페이지당</span><select data-page-size="${escapeHtml(key)}" aria-label="페이지당 표시 개수">${[20, 60, 100].map((size) => `<option value="${size}"${size === paging.pageSize ? ' selected' : ''}>${size}</option>`).join('')}</select></label>
    </div>`
  }

  function selectOptions(options, selected) {
    return options.map(([value, label]) => `<option value="${value}"${value === selected ? ' selected' : ''}>${label}</option>`).join('')
  }

  function starRating(value) {
    const rounded = Math.max(0, Math.min(5, Math.round(Number(value) || 0)))
    return `<span class="stars" title="${(Number(value) || 0).toFixed(1)}"><span class="stars-on">${'★'.repeat(rounded)}</span><span class="stars-off">${'★'.repeat(5 - rounded)}</span></span>`
  }

  function collectionFilterActive(key) {
    return Boolean((state.collectionSearch[key] || '').trim()) || Object.values(state.collectionFilters[key] || {}).some((value) => value && value !== '전체')
  }

  function orderControl(key, id, index, total) {
    const locked = collectionFilterActive(key)
    const lockTitle = locked ? ' title="검색·필터 적용 중에는 순서를 변경할 수 없습니다"' : ''
    return `<span class="order-buttons">
      <button class="order-button" data-action="move-collection-row" data-collection="${key}" data-id="${escapeHtml(id)}" data-direction="up"${locked || index === 0 ? ' disabled' : ''} aria-label="위로"${lockTitle}>▲</button>
      <button class="order-button" data-action="move-collection-row" data-collection="${key}" data-id="${escapeHtml(id)}" data-direction="down"${locked || index === total - 1 ? ' disabled' : ''} aria-label="아래로"${lockTitle}>▼</button>
    </span>`
  }

  function toggleChip(key, id, col, on) {
    return `<button class="toggle-chip${on ? ' is-on' : ''}" type="button" data-action="toggle-collection-field" data-collection="${key}" data-id="${escapeHtml(id)}" data-field="${col.key}" aria-pressed="${on}">${escapeHtml(on ? col.on : col.off)}</button>`
  }

  function collectionColumnLabel(key, fieldKey) {
    const def = COLLECTIONS[key]
    const match = def.columns.find((col) => col.key === fieldKey) || def.fields.find((field) => field.key === fieldKey)
    return match ? match.label : fieldKey
  }

  function collectionRowLabel(key, row) {
    const def = COLLECTIONS[key]
    const titleCol = def.columns.find((col) => col.type === 'title')
    return String(row[titleCol ? titleCol.key : 'title'] || def.singular)
  }

  function toast(message) {
    toastElement.textContent = message
    toastElement.classList.add('is-visible')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toastElement.classList.remove('is-visible'), 2200)
  }

  function openSidebar() {
    document.getElementById('sidebar').classList.add('is-open')
    document.getElementById('sidebarOverlay').hidden = false
  }

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('is-open')
    document.getElementById('sidebarOverlay').hidden = true
  }

  function downloadText(filename, text) {
    const blob = new Blob([`\ufeff${text}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  window.BNVIIT_ADMIN = {
    PREVIEW_ORIGIN, STORAGE_KEY, CMS_CATALOG, CMS_COLLECTIONS, SITE_MENU_MANIFEST, COLLECTION_VIEWS, COLLECTIONS, NAV_GROUPS,
    PAGE_DATA, HOME_SECTIONS, LANGUAGE_PACK_DEFAULTS, COUNTRY_OPTIONS, FLOATING_CHANNEL_PRESETS, FLOATING_ACTION_DEFAULTS, RECORD_DEFAULTS, RECORD_META_DEFAULTS, HOME_CONTENT_DEFAULTS, MEDIA_ASSET_DEFAULTS, MENU_DOMAINS,
    MODULE_ROWS, VIEW_META, MODULE_CONFIG, VIEW_GUIDES, state, content, sideNav, breadcrumb,
    pageTitle, editorDialog, editorBody, editorTitle, editorEyebrow, toastElement, menuChild, loadState,
    persist, validView, normalizePageState, getPages, pageDomains, orderedDomainPages, syncPageStructure, getHomeSections,
    cloneData, mergeLanguagePacks, countryFlagUrl, floatingActionFallbacks, mergeFloatingActions, normalizeFloatingOrder, getFloatingActionSettings, floatingActionEntries, findFloatingAction, normalizeSectionOrder, isLockedMenuDomain, normalizeMenuDomains, languageMenuEntries, defaultMenuVisible, createMenuVisibilityDefaults, syncMenuVisibility,
    getModuleRows, cloneCollections, mergeCollections, today, collectionViewCount, escapeHtml, multiline, formatNumber,
    statusBadge, scrBadges, pageHead, paginateRows, tableFooter, selectOptions, starRating, orderControl,
    toggleChip, collectionColumnLabel, collectionRowLabel, toast, openSidebar, closeSidebar, downloadText, collectionFilterActive,
  }
})()
