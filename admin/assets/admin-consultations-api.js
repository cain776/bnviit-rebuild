;(function () {
  'use strict'

  const apiState = {
    category: 'COUNSELPHONE', page: 1, pageSize: 20, q: '', from: '', to: '', deleted: 'all',
    meta: null, result: null, loading: false, error: '', requestId: 0,
  }

  function escape(value) { return window.BNVIIT_ADMIN.escapeHtml(String(value ?? '')) }
  function statusChip(on, yes, no) { return `<span class="badge ${on ? 'badge-live' : 'badge-draft'}">${on ? yes : no}</span>` }

  function renderTabs() {
    const categories = apiState.meta?.categories || [
      ['COUNSELPHONE', '전화상담'], ['COUNSELONLINE', '온라인 예약'], ['COUNSELEVENT', '이벤트 상담'],
      ['COUNSELKAKAO', '카카오 상담'], ['COUNSELNAVER', '네이버 유입'], ['COUNSELQNA', '고객 Q&A'], ['COUNSELPARTNER', '제휴문의'],
    ].map(([category, label]) => ({ category, label, total: null }))
    return `<div class="collection-tabs legacy-consultation-tabs" role="tablist" aria-label="상담 유형">
      ${categories.map((item) => `<button class="collection-tab${item.category === apiState.category ? ' is-active' : ''}" type="button" role="tab" data-legacy-category="${item.category}">
        <span>${escape(item.label)}</span><span class="collection-tab-count">${item.total == null ? '…' : Number(item.total).toLocaleString()}</span>
      </button>`).join('')}
    </div>`
  }

  function pagination() {
    const result = apiState.result
    if (!result) return ''
    return `<div class="table-footer">
      <div class="table-footer-count">총 <b>${result.total.toLocaleString()}</b>건 · ${result.page.toLocaleString()} / ${result.totalPages.toLocaleString()} 페이지 · 목록 개인정보 마스킹</div>
      <nav class="pagination" aria-label="상담 목록 페이지">
        <button class="page-button" type="button" data-legacy-page="${result.page - 1}"${result.page <= 1 ? ' disabled' : ''}>이전</button>
        <span class="legacy-page-current">${result.page.toLocaleString()}</span>
        <button class="page-button" type="button" data-legacy-page="${result.page + 1}"${result.page >= result.totalPages ? ' disabled' : ''}>다음</button>
      </nav>
      <label class="page-size-control"><span>페이지당</span><select data-legacy-page-size aria-label="페이지당 표시 개수">${[20, 60, 100].map((size) => `<option value="${size}"${size === apiState.pageSize ? ' selected' : ''}>${size}</option>`).join('')}</select></label>
    </div>`
  }

  function tableBody() {
    if (apiState.loading) return '<tr><td colspan="11"><div class="empty-state"><strong>백업 상담 데이터를 불러오는 중입니다.</strong></div></td></tr>'
    if (apiState.error) return `<tr><td colspan="11"><div class="empty-state"><strong>조회할 수 없습니다.</strong><span>${escape(apiState.error)}</span><button class="button button-secondary" type="button" data-legacy-retry>다시 시도</button></div></td></tr>`
    const rows = apiState.result?.rows || []
    if (!rows.length) return '<tr><td colspan="11"><div class="empty-state"><strong>조건에 맞는 상담 기록이 없습니다.</strong><span>검색어나 기간 조건을 변경해 주세요.</span></div></td></tr>'
    return rows.map((row) => `<tr>
      <td class="col-date">${escape(String(row.regDate || '').slice(0, 10) || '-')}</td>
      <td><button class="cell-title-btn" type="button" data-legacy-detail="${row.id}">#${row.id}</button></td>
      <td><span class="cell-tag">${escape(row.channel)}</span></td>
      <td>${escape(row.name)}</td><td>${escape(row.phone)}</td>
      <td class="legacy-consultation-summary"><strong>${escape(row.title)}</strong>${row.reserveDate && row.reserveDate !== '예약일' ? `<small>${escape(row.reserveDate)} ${escape(row.reserveTime)}</small>` : ''}</td>
      <td>${statusChip(row.memberLinked, '연결', '미연결')}</td>
      <td>${statusChip(row.callStatus || row.confirmStatus, '처리', '대기')}</td>
      <td>${statusChip(row.reserveStatus || row.hasCrm, '예약', '-')}</td>
      <td>${row.deleted ? '<span class="badge badge-off">삭제</span>' : '<span class="badge badge-live">정상</span>'}</td>
      <td><button class="button button-small" type="button" data-legacy-detail="${row.id}">상세</button></td>
    </tr>`).join('')
  }

  function renderLegacyConsultations() {
    const { pageHead } = window.BNVIIT_ADMIN
    const note = apiState.meta
      ? `백업일 ${escape(apiState.meta.source.backupDate)} · 7개 유형 총 ${apiState.meta.total.toLocaleString()}건 · 서버 페이지네이션 조회`
      : '로컬 백업 DB를 안전하게 색인하여 서버 페이지네이션으로 조회합니다.'
    return `${pageHead('상담 관리', note)}${renderTabs()}
      <form class="toolbar legacy-consultation-toolbar" id="legacyConsultationSearch">
        <div class="filters">
          <div class="field grow"><label for="legacyConsultationQuery">검색</label><input id="legacyConsultationQuery" name="q" type="search" value="${escape(apiState.q)}" placeholder="이름 · 연락처 · 이메일 · 제목 · 내용 · 접수번호"></div>
          <div class="field"><label for="legacyConsultationFrom">시작일</label><input id="legacyConsultationFrom" name="from" type="date" value="${escape(apiState.from)}"></div>
          <div class="field"><label for="legacyConsultationTo">종료일</label><input id="legacyConsultationTo" name="to" type="date" value="${escape(apiState.to)}"></div>
          <div class="field"><label for="legacyConsultationDeleted">삭제 상태</label><select id="legacyConsultationDeleted" name="deleted"><option value="all"${apiState.deleted === 'all' ? ' selected' : ''}>전체</option><option value="active"${apiState.deleted === 'active' ? ' selected' : ''}>정상</option><option value="deleted"${apiState.deleted === 'deleted' ? ' selected' : ''}>삭제</option></select></div>
        </div>
        <div class="toolbar-actions"><button class="button button-secondary" type="button" data-legacy-reset>초기화</button><button class="button button-primary" type="submit">조회</button></div>
      </form>
      ${apiState.category === 'COUNSELNAVER' ? '<div class="legacy-consultation-warning"><strong>네이버 유입 기록</strong><span>실제 상담이 아닌 유입·추적 데이터가 포함될 수 있어 읽기 전용으로 확인합니다.</span></div>' : ''}
      <section class="panel"><div class="table-wrap"><table class="data-table legacy-consultation-table"><thead><tr><th>접수일</th><th>접수번호</th><th>유형</th><th>이름</th><th>연락처</th><th>문의·예약 요약</th><th>회원</th><th>처리</th><th>예약</th><th>상태</th><th>관리</th></tr></thead><tbody>${tableBody()}</tbody></table></div>${pagination()}</section>`
  }

  function rerender() {
    const admin = window.BNVIIT_ADMIN
    if (admin.state.currentView === 'consultations') admin.content.innerHTML = renderLegacyConsultations()
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

  async function loadRows() {
    const requestId = ++apiState.requestId
    apiState.loading = true; apiState.error = ''; rerender()
    try {
      if (!apiState.meta) {
        apiState.meta = await fetchJson('/api/legacy-consultations/meta')
        window.BNVIIT_ADMIN.legacyConsultationTotal = apiState.meta.total
        window.BNVIIT_ADMIN.renderSidebar?.()
      }
      const params = new URLSearchParams({ category: apiState.category, page: apiState.page, pageSize: apiState.pageSize, deleted: apiState.deleted })
      if (apiState.q) params.set('q', apiState.q)
      if (apiState.from) params.set('from', apiState.from)
      if (apiState.to) params.set('to', apiState.to)
      const result = await fetchJson(`/api/legacy-consultations?${params}`)
      if (requestId === apiState.requestId) apiState.result = result
    } catch (error) {
      if (requestId === apiState.requestId) { apiState.error = error.message; apiState.result = null }
    } finally {
      if (requestId === apiState.requestId) { apiState.loading = false; rerender() }
    }
  }

  function hydrateLegacyConsultations() { if (!apiState.result && !apiState.loading) loadRows() }

  function detailLine(label, value) {
    const display = value === true ? '예' : value === false ? '아니오' : (value || '-')
    return `<div class="legacy-detail-item"><dt>${escape(label)}</dt><dd>${escape(display)}</dd></div>`
  }
  function detailSection(title, object) { return `<section class="legacy-detail-section"><h3>${escape(title)}</h3><dl>${Object.entries(object).map(([label, value]) => detailLine(label, value)).join('')}</dl></section>` }

  async function openDetail(id) {
    const admin = window.BNVIIT_ADMIN
    admin.editorEyebrow.textContent = '백업 상담 데이터 · 상세 조회'
    admin.editorTitle.textContent = `상담 #${id}`
    admin.editorBody.innerHTML = '<div class="empty-state"><strong>상세정보를 불러오는 중입니다.</strong></div>'
    const saveButton = document.getElementById('saveEditor')
    const saveNote = admin.editorDialog.querySelector('.save-note')
    saveButton.hidden = true; saveNote.textContent = '읽기 전용 · 개인정보 상세 열람'
    admin.editorDialog.showModal()
    try {
      const row = await fetchJson(`/api/legacy-consultations/${id}`)
      admin.editorTitle.textContent = `${row.channel} #${row.id}`
      admin.editorBody.innerHTML = `<div class="legacy-detail-warning">${escape(row.warning)}</div><div class="legacy-detail-grid">
        ${detailSection('회원 연결', { '회원번호': row.member.no, '회원아이디': row.member.id, '연결 여부': row.member.linked })}
        ${detailSection('고객정보', { '이름': row.customer.name, '휴대전화': row.customer.phone, '이메일': row.customer.email, '생년월일': row.customer.birth, '성별': row.customer.gender, '주소': row.customer.address, '직업': row.customer.job, '국적': row.customer.nationality })}
        ${detailSection('문의정보', { '제목': row.inquiry.title, '내용': row.inquiry.contents, '상담분야': row.inquiry.examType, '접속기기': row.inquiry.deviceType, '지점': row.inquiry.branchName, '원본 링크': row.inquiry.linkUrl, '이벤트번호': row.inquiry.eventNo, '페이지번호': row.inquiry.pageNo, '페이지유형': row.inquiry.pageType })}
        ${detailSection('예약정보', { '예약일': row.reservation.date, '예약시간': row.reservation.time, 'CRM 웹인덱스': row.reservation.crmIndex, '예약번호': row.reservation.number, '예약 여부': row.reservation.isReserved, '수술 여부': row.reservation.surgery, '렌즈 유형': row.reservation.lensType, '렌즈 최종착용일': row.reservation.lensLastDate })}
        ${detailSection('처리정보', { '통화 여부': row.processing.isCalled, '확인 여부': row.processing.isConfirmed, '사용 여부': row.processing.use, '삭제 여부': row.processing.deleted, '메모 제목': row.processing.memoTitle, '메모/답변': row.processing.memo, '담당자': row.processing.adminName })}
        ${detailSection('유입정보', { 'UTM Source': row.attribution.utmSource, 'UTM Medium': row.attribution.utmMedium, 'UTM Campaign': row.attribution.utmCampaign, 'UTM Content': row.attribution.utmContent, 'UTM Term': row.attribution.utmTerm, '추천코드': row.attribution.referralCode, '유입경로': row.attribution.howService })}
        ${detailSection('추가정보', { '추가정보 1': row.extra.addInfo01, '추가정보 2': row.extra.addInfo02, '추가설명 1': row.extra.addInfo01Text, '추가설명 2': row.extra.addInfo02Text, '첨부이미지': row.extra.imageName, '동의항목': row.extra.agreeInfo, '통역언어': row.extra.interpreterLanguage, '인종': row.extra.race })}
        ${detailSection('원본정보', { '구 레코드번호': row.source.oldSequenceNo, '등록일시': row.source.registeredAt, '수정일시': row.source.updatedAt, '삭제일시': row.source.deletedAt, '데이터 버전': row.source.dataVersion })}
      </div>`
    } catch (error) { admin.editorBody.innerHTML = `<div class="empty-state"><strong>상세정보를 불러오지 못했습니다.</strong><span>${escape(error.message)}</span></div>` }
  }

  document.addEventListener('submit', (event) => {
    if (event.target.id !== 'legacyConsultationSearch') return
    event.preventDefault()
    const form = new FormData(event.target)
    apiState.q = String(form.get('q') || '').trim(); apiState.from = String(form.get('from') || ''); apiState.to = String(form.get('to') || ''); apiState.deleted = String(form.get('deleted') || 'all'); apiState.page = 1
    loadRows()
  })
  document.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-legacy-category]')
    if (tab) { apiState.category = tab.dataset.legacyCategory; apiState.page = 1; apiState.result = null; loadRows(); return }
    const pager = event.target.closest('[data-legacy-page]')
    if (pager && !pager.disabled) { apiState.page = Number(pager.dataset.legacyPage); loadRows(); return }
    const detail = event.target.closest('[data-legacy-detail]')
    if (detail) { openDetail(detail.dataset.legacyDetail); return }
    if (event.target.closest('[data-legacy-reset]')) { Object.assign(apiState, { q: '', from: '', to: '', deleted: 'all', page: 1 }); loadRows(); return }
    if (event.target.closest('[data-legacy-retry]')) loadRows()
  })
  document.addEventListener('change', (event) => {
    if (!event.target.matches('[data-legacy-page-size]')) return
    apiState.pageSize = Number(event.target.value) || 20; apiState.page = 1; loadRows()
  })
  document.getElementById('editorDialog').addEventListener('close', () => {
    document.getElementById('saveEditor').hidden = false
    document.querySelector('#editorDialog .save-note').textContent = '프로토타입 저장값은 이 브라우저에만 보관됩니다.'
  })

  Object.assign(window.BNVIIT_ADMIN, { renderLegacyConsultations, hydrateLegacyConsultations })
})()
