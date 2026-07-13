;(function () {
  'use strict'

  const entityState = {
    meta: null,
    members: { page: 1, pageSize: 20, q: '', status: 'active', type: 'all', result: null, loading: false, error: '', requestId: 0 },
    reviews: { page: 1, pageSize: 20, q: '', type: 'ALL', status: 'active', result: null, loading: false, error: '', requestId: 0 },
    doctors: { page: 1, pageSize: 20, q: '', status: 'active', result: null, loading: false, error: '', requestId: 0 },
  }

  const LABELS = {
    GENERAL: '일반회원', NAVER: '네이버', KAKAO: '카카오', GOOGLE: '구글',
    ALL: '전체', BASIC: '일반후기', STAR: '스타후기', MEDICAL: '의료후기', OVERSEA: '해외후기', OTHER: '미분류', SNS: 'SNS 후기',
    active: '정상·공개', withdrawn: '탈퇴', inactive: '비공개', deleted: '삭제', all: '전체',
  }

  function admin() { return window.BNVIIT_ADMIN }
  function escape(value) { return admin().escapeHtml(String(value ?? '')) }
  function badge(label, tone = 'badge-live') { return `<span class="badge ${tone}">${escape(label)}</span>` }
  function current(view) { return entityState[view] }

  function tabButton(view, value, label, count, active) {
    return `<button class="collection-tab${active ? ' is-active' : ''}" type="button" data-entity-tab="${view}" data-entity-value="${escape(value)}"><span>${escape(label)}</span><span class="collection-tab-count">${count == null ? '…' : Number(count).toLocaleString()}</span></button>`
  }

  function renderTabs(view) {
    const state = current(view)
    if (view === 'members') {
      const meta = entityState.meta?.members
      return `<div class="collection-tabs legacy-entity-tabs">${tabButton(view, 'active', '정상 회원', meta?.active, state.status === 'active')}${tabButton(view, 'withdrawn', '탈퇴 회원', meta?.withdrawn, state.status === 'withdrawn')}${tabButton(view, 'all', '전체 회원', meta?.total, state.status === 'all')}</div>`
    }
    if (view === 'doctors') {
      const meta = entityState.meta?.doctors
      return `<div class="collection-tabs legacy-entity-tabs">${tabButton(view, 'active', '공개 의료진', meta?.active, state.status === 'active')}${tabButton(view, 'inactive', '비공개 의료진', meta?.inactive, state.status === 'inactive')}${tabButton(view, 'deleted', '삭제 의료진', meta?.deleted, state.status === 'deleted')}${tabButton(view, 'all', '전체 의료진', meta?.total, state.status === 'all')}</div>`
    }
    const metaTypes = Object.fromEntries((entityState.meta?.reviews?.types || []).map((item) => [item.type, item.total]))
    const snsCount = window.BNVIIT_CMS_COLLECTIONS?.collections?.sns?.rows?.length || 0
    return `<div class="collection-tabs legacy-entity-tabs">${['ALL','BASIC','STAR','MEDICAL','OVERSEA','OTHER','SNS'].map((type) => tabButton(view, type, LABELS[type], type === 'ALL' ? entityState.meta?.reviews?.total : type === 'SNS' ? snsCount : metaTypes[type] || 0, state.type === type)).join('')}</div>`
  }

  function filterOptions(view) {
    const state = current(view)
    if (view === 'members') return `<div class="field"><label for="legacyEntityType">가입유형</label><select id="legacyEntityType" name="type"><option value="all">전체</option>${['GENERAL','NAVER','KAKAO','GOOGLE'].map((type) => `<option value="${type}"${state.type === type ? ' selected' : ''}>${LABELS[type]}</option>`).join('')}</select></div>`
    if (view === 'reviews' && state.type !== 'SNS') return `<div class="field"><label for="legacyEntityStatus">삭제 상태</label><select id="legacyEntityStatus" name="status"><option value="all"${state.status === 'all' ? ' selected' : ''}>전체</option><option value="active"${state.status === 'active' ? ' selected' : ''}>정상</option><option value="deleted"${state.status === 'deleted' ? ' selected' : ''}>삭제</option></select></div>`
    return ''
  }

  function headers(view) {
    if (view === 'members') return ['가입일','회원번호','이름','아이디','가입유형','연락처','이메일','인증','CRM','상태','관리']
    if (view === 'reviews') return ['등록일','후기번호','유형','제목','작성자','수술명','회원','노출','상태','조회','관리']
    return ['순서','의료진번호','이름','직급','구분','프로필 URL','메인','사용','상태','수정일','관리']
  }

  function memberRow(row) {
    return `<tr><td class="col-date">${escape(String(row.registeredAt).slice(0, 10) || '-')}</td><td>#${row.id}</td><td>${escape(row.name)}</td><td>${escape(row.loginId)}</td><td>${badge(row.type === '일반' ? '일반' : row.type, 'badge-new')}</td><td>${escape(row.phone)}</td><td>${escape(row.email)}</td><td>${badge(row.hpVerified ? '휴대폰' : '미인증', row.hpVerified ? 'badge-live' : 'badge-draft')}</td><td>${badge(row.crmLinked ? '연결' : '-', row.crmLinked ? 'badge-live' : 'badge-draft')}</td><td>${row.withdrawn ? badge('탈퇴','badge-off') : badge('정상')}</td><td><button class="button button-small" data-entity-detail="members" data-entity-id="${row.id}">상세</button></td></tr>`
  }

  function reviewRow(row) {
    return `<tr><td class="col-date">${escape(String(row.registeredAt).slice(0, 10) || '-')}</td><td>#${row.id}</td><td>${badge(LABELS[row.type] || row.type, 'badge-new')}</td><td class="legacy-entity-title">${escape(row.title)}</td><td>${escape(row.name)}</td><td>${escape(row.operationName || '-')}</td><td>${escape(row.memberId)}</td><td>${badge(row.visible ? '노출' : '숨김', row.visible ? 'badge-live' : 'badge-draft')}</td><td>${row.deleted ? badge('삭제','badge-off') : badge('정상')}</td><td>${Number(row.hitCount || 0).toLocaleString()}</td><td><button class="button button-small" data-entity-detail="reviews" data-entity-id="${row.id}">상세</button></td></tr>`
  }

  function snsRow(row) {
    return `<tr><td class="col-date">${escape(row.date || '-')}</td><td>${escape(row.id)}</td><td>${badge('SNS','badge-new')}</td><td class="legacy-entity-title">${escape(row.title)}</td><td>${escape(row.writer)}</td><td>-</td><td>${escape(row.handle || '-')}</td><td>${badge(row.use ? '노출' : '숨김', row.use ? 'badge-live' : 'badge-draft')}</td><td>${badge('정상')}</td><td>-</td><td><button class="button button-small" data-sns-detail="${escape(row.id)}">상세</button></td></tr>`
  }

  function doctorRow(row) {
    const status = row.deleted ? badge('삭제','badge-off') : row.active ? badge('공개') : badge('비공개','badge-draft')
    return `<tr><td>${row.displaySequence}</td><td>#${row.id}</td><td>${escape(row.name)}</td><td>${escape(row.position)}</td><td>${escape(row.group)}</td><td>${escape(row.urlName || '-')}</td><td>${badge(row.main ? '메인' : '-', row.main ? 'badge-live' : 'badge-draft')}</td><td>${badge(row.active ? '사용' : '미사용', row.active ? 'badge-live' : 'badge-draft')}</td><td>${status}</td><td class="col-date">${escape(String(row.updatedAt).slice(0, 10) || '-')}</td><td><button class="button button-small" data-entity-detail="doctors" data-entity-id="${row.id}">상세</button></td></tr>`
  }

  function body(view) {
    const state = current(view)
    if (state.loading) return `<tr><td colspan="11"><div class="empty-state"><strong>백업 ${view === 'members' ? '회원' : view === 'reviews' ? '후기' : '의료진'} 데이터를 불러오는 중입니다.</strong></div></td></tr>`
    if (state.error) return `<tr><td colspan="11"><div class="empty-state"><strong>조회할 수 없습니다.</strong><span>${escape(state.error)}</span><button class="button button-secondary" data-entity-retry="${view}">다시 시도</button></div></td></tr>`
    const rows = state.result?.rows || []
    if (!rows.length) return '<tr><td colspan="11"><div class="empty-state"><strong>조건에 맞는 기록이 없습니다.</strong></div></td></tr>'
    if (view === 'members') return rows.map(memberRow).join('')
    if (view === 'reviews') return rows.map((row) => state.type === 'SNS' ? snsRow(row) : reviewRow(row)).join('')
    return rows.map(doctorRow).join('')
  }

  function footer(view) {
    const state = current(view), result = state.result
    if (!result) return ''
    return `<div class="table-footer"><div class="table-footer-count">총 <b>${Number(result.total).toLocaleString()}</b>건 · ${result.page} / ${result.totalPages} 페이지 · 목록 개인정보 마스킹</div><nav class="pagination" aria-label="목록 페이지"><button class="page-button page-nav" type="button" data-entity-page="${view}" data-page="${result.page - 1}"${result.page <= 1 ? ' disabled' : ''} aria-label="이전 페이지">이전</button><span class="legacy-page-current">${result.page}</span><button class="page-button page-nav" type="button" data-entity-page="${view}" data-page="${result.page + 1}"${result.page >= result.totalPages ? ' disabled' : ''} aria-label="다음 페이지">다음</button></nav><label class="page-size-control"><span>페이지당</span><select data-entity-page-size="${view}" aria-label="페이지당 표시 개수">${[20,60,100].map((size) => `<option value="${size}"${state.pageSize === size ? ' selected' : ''}>${size}</option>`).join('')}</select></label></div>`
  }

  function renderLegacyEntityView(view) {
    const state = current(view)
    const titles = { members: '회원 관리', reviews: '후기 관리', doctors: '의료진 관리' }
    const totals = entityState.meta?.[view]?.total
    const note = totals == null ? '로컬 백업 DB 전수 데이터를 API로 조회합니다.' : `백업일 ${escape(entityState.meta?.source?.backupDate || '2026-07-10')} · 전체 ${Number(totals).toLocaleString()}건 · 서버 페이지네이션 조회`
    return `${admin().pageHead(titles[view], note)}${renderTabs(view)}<form class="toolbar legacy-entity-toolbar" data-entity-form="${view}"><div class="filters"><div class="field grow"><label>검색</label><input name="q" type="search" value="${escape(state.q)}" placeholder="${view === 'members' ? '이름 · 아이디 · 연락처 · 이메일 · 회원번호' : view === 'reviews' ? '제목 · 작성자 · 내용 · 수술명 · 후기번호' : '이름 · 직급 · 구분 · 의료진번호'}"></div>${filterOptions(view)}</div><div class="toolbar-actions"><button class="button button-secondary" type="button" data-entity-reset="${view}">초기화</button><button class="button button-primary" type="submit">조회</button></div></form><section class="panel"><div class="table-wrap"><table class="data-table legacy-entity-table"><thead><tr>${headers(view).map((item) => `<th>${item}</th>`).join('')}</tr></thead><tbody>${body(view)}</tbody></table></div>${footer(view)}</section>`
  }

  function rerender(view) {
    if (admin().state.currentView === view) admin().content.innerHTML = renderLegacyEntityView(view)
  }

  async function fetchJson(url) {
    // 데모 폴백: ?demo=1·file:// 이면 즉시 더미, 정적 배포(API 부재·404) 시에도 더미로 대체
    const demo = window.BNVIIT_DEMO_LEGACY
    if (demo?.enabled()) return demo.handle(url)
    let response
    try {
      response = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' })
    } catch (error) {
      if (demo) return demo.handle(url)
      throw error
    }
    if (response.status === 404 && demo) return demo.handle(url)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error || `API 오류 ${response.status}`)
    return payload
  }

  function snsResult(state) {
    const all = window.BNVIIT_CMS_COLLECTIONS?.collections?.sns?.rows || []
    const q = state.q.toLowerCase()
    const filtered = q ? all.filter((row) => `${row.title} ${row.writer} ${row.handle}`.toLowerCase().includes(q)) : all
    const totalPages = Math.max(Math.ceil(filtered.length / state.pageSize), 1)
    const page = Math.min(state.page, totalPages)
    return { total: filtered.length, totalPages, page, pageSize: state.pageSize, rows: filtered.slice((page - 1) * state.pageSize, page * state.pageSize) }
  }

  async function load(view) {
    const state = current(view), requestId = ++state.requestId
    state.loading = true; state.error = ''; rerender(view)
    try {
      if (!entityState.meta) {
        entityState.meta = await fetchJson('/api/legacy-data/meta')
        admin().legacyEntityTotals = { members: entityState.meta.members.total, reviews: entityState.meta.reviews.total, doctors: entityState.meta.doctors.total }
        admin().renderSidebar?.()
      }
      let result
      if (view === 'reviews' && state.type === 'SNS') result = snsResult(state)
      else {
        const params = new URLSearchParams({ page: state.page, pageSize: state.pageSize, q: state.q })
        if (view === 'members') { params.set('status', state.status); params.set('type', state.type) }
        if (view === 'reviews') { params.set('status', state.status); params.set('type', state.type) }
        if (view === 'doctors') params.set('status', state.status)
        result = await fetchJson(`/api/legacy-data/${view}?${params}`)
      }
      if (requestId === state.requestId) state.result = result
    } catch (error) {
      if (requestId === state.requestId) { state.error = error.message; state.result = null }
    } finally {
      if (requestId === state.requestId) { state.loading = false; rerender(view) }
    }
  }

  function hydrateLegacyEntityView(view) { const state = current(view); if (!state.result && !state.loading) load(view) }

  function detailItems(payload) {
    return Object.entries(payload).filter(([, value]) => value != null && String(value) !== '').map(([key, value]) => `<div class="legacy-detail-item"><dt>${escape(key)}</dt><dd>${escape(value)}</dd></div>`).join('')
  }

  async function openDetail(view, id) {
    const a = admin(), label = view === 'members' ? '회원' : view === 'reviews' ? '후기' : '의료진'
    a.editorEyebrow.textContent = `백업 ${label} 데이터 · 상세 조회`; a.editorTitle.textContent = `${label} #${id}`
    a.editorBody.innerHTML = '<div class="empty-state"><strong>상세정보를 불러오는 중입니다.</strong></div>'
    document.getElementById('saveEditor').hidden = true; a.editorDialog.querySelector('.save-note').textContent = '읽기 전용 · 개인정보 상세 열람'; a.editorDialog.showModal()
    try {
      const row = await fetchJson(`/api/legacy-data/${view}/${id}`)
      a.editorBody.innerHTML = `<div class="legacy-detail-warning">${view === 'members' ? '비밀번호 해시·소셜 고유 ID·접속 IP는 API에서 제외했습니다.' : view === 'reviews' ? '작성 비밀번호와 접속 IP는 API에서 제외했습니다.' : '레거시 의료진 원본 필드를 읽기 전용으로 표시합니다.'}</div><section class="legacy-detail-section legacy-detail-full"><h3>원본 필드</h3><dl>${detailItems(row.payload)}</dl></section>`
    } catch (error) { a.editorBody.innerHTML = `<div class="empty-state"><strong>상세정보를 불러오지 못했습니다.</strong><span>${escape(error.message)}</span></div>` }
  }

  function openSnsDetail(id) {
    const row = (window.BNVIIT_CMS_COLLECTIONS?.collections?.sns?.rows || []).find((item) => item.id === id)
    if (!row) return
    const a = admin(); a.editorEyebrow.textContent = 'SNS 후기 · 상세 조회'; a.editorTitle.textContent = row.title
    a.editorBody.innerHTML = `<section class="legacy-detail-section legacy-detail-full"><dl>${detailItems(row)}</dl></section>`
    document.getElementById('saveEditor').hidden = true; a.editorDialog.querySelector('.save-note').textContent = '읽기 전용 · 기존 SNS 실데이터'; a.editorDialog.showModal()
  }

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-entity-form]'); if (!form) return
    event.preventDefault(); const view = form.dataset.entityForm, state = current(view), data = new FormData(form)
    state.q = String(data.get('q') || '').trim(); if (view === 'members') state.type = String(data.get('type') || 'all'); if (view === 'reviews' && state.type !== 'SNS') state.status = String(data.get('status') || 'active'); state.page = 1; load(view)
  })

  document.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-entity-tab]')
    if (tab) { const view = tab.dataset.entityTab, state = current(view), value = tab.dataset.entityValue; if (view === 'reviews') state.type = value; else state.status = value; state.page = 1; state.result = null; load(view); return }
    const pager = event.target.closest('[data-entity-page]')
    if (pager && !pager.disabled) { const view = pager.dataset.entityPage; current(view).page = Number(pager.dataset.page); load(view); return }
    const detail = event.target.closest('[data-entity-detail]')
    if (detail) { openDetail(detail.dataset.entityDetail, detail.dataset.entityId); return }
    const sns = event.target.closest('[data-sns-detail]')
    if (sns) { openSnsDetail(sns.dataset.snsDetail); return }
    const reset = event.target.closest('[data-entity-reset]')
    if (reset) { const view = reset.dataset.entityReset, state = current(view); state.q = ''; state.page = 1; if (view === 'members') state.type = 'all'; if (view === 'reviews') state.status = 'active'; load(view); return }
    const retry = event.target.closest('[data-entity-retry]'); if (retry) load(retry.dataset.entityRetry)
  })

  document.addEventListener('change', (event) => {
    if (!event.target.matches('[data-entity-page-size]')) return
    const view = event.target.dataset.entityPageSize, state = current(view); state.pageSize = Number(event.target.value) || 20; state.page = 1; load(view)
  })

  document.getElementById('editorDialog').addEventListener('close', () => {
    document.getElementById('saveEditor').hidden = false
    document.querySelector('#editorDialog .save-note').textContent = '프로토타입 저장값은 이 브라우저에만 보관됩니다.'
  })

  Object.assign(window.BNVIIT_ADMIN, { renderLegacyEntityView, hydrateLegacyEntityView })
})()
