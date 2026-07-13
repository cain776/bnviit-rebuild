;(function () {
  'use strict'
  const {
    PREVIEW_ORIGIN, COLLECTION_VIEWS, COLLECTIONS, HOME_SECTIONS, RECORD_DEFAULTS, state, content, getPages,
    pageDomains, orderedDomainPages, getHomeSections, isLockedMenuDomain, today, escapeHtml, multiline, formatNumber,
    statusBadge, scrBadges, pageHead, paginateRows, tableFooter, starRating, orderControl, toggleChip,
  } = window.BNVIIT_ADMIN

  function metricCard(label, value, help, trend, trendClass) {
    return `<article class="metric-card"><div class="metric-card-top"><span class="metric-label">${label}</span><span class="trend ${trendClass}">${trend}</span></div><div class="metric-value">${value}</div><div class="metric-help">${help}</div></article>`
  }

  function activity(time, title, meta, status, badgeStatus) {
    return `<li class="activity-item"><span class="activity-time">${time}</span><span><span class="activity-title">${title}</span><span class="activity-meta">${meta}</span></span>${statusBadge(badgeStatus).replace(/>[^<]+</, `>${status}<`)}</li>`
  }

  function homeTab(id, label) {
    return `<button class="tab-button${state.homeTab === id ? ' is-active' : ''}" type="button" data-home-tab="${id}">${label}</button>`
  }

  function renderHomeSections() {
    const sections = getHomeSections()
    return `
      <div class="home-layout">
        <section class="section-config" aria-label="홈 섹션 목록">
          <div class="section-list-head" aria-hidden="true">
            <span>순서</span><span>홈 섹션</span><span>연계 관리자</span><span>노출 상태</span><span>관리</span>
          </div>
          <div class="section-list">
          ${sections.map((item, index) => {
            const items = state.homeContent[item.id] || []
            const visibleCount = items.filter((contentItem) => contentItem.visible).length
            return `
            <article class="section-row" data-home-section="${item.id}">
              <span class="section-order-control">
                <b>${String(index + 1).padStart(2, '0')}</b>
                <span class="order-buttons">
                  <button class="order-button" type="button" data-action="move-home-section" data-id="${item.id}" data-direction="up" aria-label="${item.name} 위로 이동" title="위로 이동"${index === 0 ? ' disabled' : ''}>↑</button>
                  <button class="order-button" type="button" data-action="move-home-section" data-id="${item.id}" data-direction="down" aria-label="${item.name} 아래로 이동" title="아래로 이동"${index === sections.length - 1 ? ' disabled' : ''}>↓</button>
                </span>
              </span>
              <span class="section-primary">
                <span class="section-symbol section-symbol-${item.id}" aria-hidden="true">${item.mark}</span>
                <span class="section-copy"><strong>${item.name}</strong><small>${visibleCount}/${items.length}개 노출 · ${item.detail}</small><code>${item.source}</code></span>
              </span>
              <span class="section-integration">${scrBadges(item.scr)}<small>${item.scr.length ? '기존 기능 연계' : '신규 CMS 구성'}</small></span>
              <button class="switch-control" type="button" data-action="toggle-section" data-id="${item.id}" aria-label="${item.name} 노출 전환" aria-pressed="${Boolean(state.sectionVisibility[item.id])}">
                <span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span>
                <span class="switch-copy"><strong>${state.sectionVisibility[item.id] ? '노출 중' : '숨김'}</strong><small>${state.sectionVisibility[item.id] ? '홈에 표시' : '홈에서 제외'}</small></span>
              </button>
              <button class="button button-small section-edit-button" data-action="manage-home-section" data-id="${item.id}">콘텐츠 관리</button>
            </article>
          `}).join('')}
          </div>
        </section>
        ${renderHomePreview()}
      </div>
    `
  }

  function renderHomeContent() {
    const section = getHomeSections().find((item) => item.id === state.homeContentSection) || getHomeSections()[0]
    const items = state.homeContent[section.id] || []
    return `
      <div class="home-layout">
        <section class="home-content-panel">
          <div class="home-content-tabs" role="tablist" aria-label="홈 콘텐츠 영역">
            ${getHomeSections().map((item) => `<button type="button" class="home-content-tab${item.id === section.id ? ' is-active' : ''}" data-home-content-section="${item.id}"><span class="section-symbol section-symbol-${item.id}" aria-hidden="true">${item.mark}</span><span><strong>${item.name}</strong><small>${(state.homeContent[item.id] || []).length}개 항목</small></span></button>`).join('')}
          </div>
          <div class="home-content-head">
            <div><h3>${section.name}</h3><p>${section.detail}</p></div>
          </div>
          <div class="home-item-list">
            ${items.length ? items.map((item, index) => renderHomeItemRow(section.id, item, index, items.length)).join('') : '<div class="empty-state"><strong>등록된 항목이 없습니다.</strong><span>항목 추가 버튼으로 첫 콘텐츠를 등록하세요.</span></div>'}
          </div>
        </section>
        ${renderHomePreview()}
      </div>
    `
  }

  function renderHomeItemRow(sectionId, item, index, total) {
    const kindLabels = { record: '기록', event: '이벤트', notice: '공지', link: '링크 카드', contact: '상담 카드' }
    const title = item.title || item.eyebrow || '제목 없음'
    const description = item.description || item.label || ''
    const route = item.primaryRoute || item.route || '연결 없음'
    const schedule = item.startsAt || item.endsAt ? `${item.startsAt || '즉시'} ~ ${item.endsAt || '종료 없음'}` : '상시 노출'
    return `
      <article class="home-item-row" data-home-item="${item.id}">
        <div class="item-order-control">
          <b>${String(index + 1).padStart(2, '0')}</b>
          <span class="order-buttons">
            <button class="order-button" type="button" data-action="move-home-item" data-section="${sectionId}" data-id="${item.id}" data-direction="up" aria-label="${escapeHtml(title)} 위로 이동" title="위로 이동"${index === 0 ? ' disabled' : ''}>↑</button>
            <button class="order-button" type="button" data-action="move-home-item" data-section="${sectionId}" data-id="${item.id}" data-direction="down" aria-label="${escapeHtml(title)} 아래로 이동" title="아래로 이동"${index === total - 1 ? ' disabled' : ''}>↓</button>
          </span>
        </div>
        <div class="home-item-copy">
          <span class="item-type">${kindLabels[item.kind] || (sectionId === 'hero' ? '슬라이드' : sectionId === 'quick' ? '바로가기' : '콘텐츠')}</span>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(description)}</small>
        </div>
        <div class="home-item-meta"><span>연결</span><code>${escapeHtml(route)}</code><small>${escapeHtml(schedule)}</small></div>
        <button class="mini-switch" type="button" data-action="toggle-home-item" data-section="${sectionId}" data-id="${item.id}" aria-pressed="${Boolean(item.visible)}"><span aria-hidden="true"></span><b>${item.visible ? '노출' : '숨김'}</b></button>
        <div class="home-item-actions">
          <button class="button button-small" type="button" data-action="edit-home-item" data-section="${sectionId}" data-id="${item.id}">편집</button>
          <button class="button button-small button-danger" type="button" data-action="delete-home-item" data-section="${sectionId}" data-id="${item.id}">삭제</button>
        </div>
      </article>
    `
  }

  function renderHomePreview() {
    const sections = getHomeSections().filter((item) => state.sectionVisibility[item.id])
    return `
      <aside class="preview-frame preview-frame-desktop" aria-label="홈 데스크톱 미리보기">
        <div class="preview-toolbar"><span><b class="preview-live-dot" aria-hidden="true"></b>데스크톱 미리보기</span><span>1440px 기준 · 로컬 데이터</span></div>
        <div class="preview-screen">
          <header class="preview-site-header">
            <strong class="preview-site-logo">BNVIIT</strong>
            <nav class="preview-site-nav" aria-label="미리보기 주 메뉴"><span>비앤빛안과</span><span>시력교정</span><span>전문분야</span><span>상담 · 예약</span></nav>
            <span class="preview-site-tools">KO　상담신청</span>
          </header>
          ${sections.length ? sections.map((section) => renderHomePreviewSection(section.id)).join('') : '<div class="preview-empty">노출 중인 홈 섹션이 없습니다.</div>'}
        </div>
      </aside>
    `
  }

  function renderHomePreviewSection(sectionId) {
    const items = (state.homeContent[sectionId] || []).filter((item) => item.visible)
    if (!items.length) return `<div class="preview-empty">${escapeHtml(HOME_SECTIONS.find((item) => item.id === sectionId)?.name || sectionId)} 콘텐츠 없음</div>`
    if (sectionId === 'hero') {
      const item = items[0]
      return `<div class="preview-hero preview-theme-${escapeHtml(item.theme || 'blue')}"><div class="preview-hero-copy"><span class="preview-kicker">${escapeHtml(item.eyebrow)}</span><h3 class="preview-title">${multiline(item.title)}</h3><p class="preview-copy">${multiline(item.description)}</p><span class="preview-cta">${escapeHtml(item.primaryLabel || '자세히 보기')}</span></div><div class="preview-hero-visual" aria-hidden="true"><span>AI VISION</span><b>맞춤 시력교정</b><i></i></div></div>`
    }
    if (sectionId === 'quick') {
      return `<div class="preview-quick">${items.slice(0, 4).map((item) => `<div class="preview-tile"><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.description)}</small></div>`).join('')}</div>`
    }
    if (sectionId === 'ticker') {
      const item = items[0]
      const recordText = Object.keys(state.records).filter((id) => state.recordMeta[id]?.visible).slice(0, 3).map((id) => `${state.recordMeta[id].label} ${formatNumber(state.records[id])}${state.recordMeta[id].unit}`).join(' · ')
      return `<div class="preview-record"><small>${escapeHtml(item.label)}</small><strong>${escapeHtml(item.kind === 'record' ? recordText : item.title)}</strong></div>`
    }
    return `<div class="preview-info">${items.slice(0, 4).map((item) => `<div class="preview-tile"><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.kind === 'contact' ? item.phone : item.description)}</small></div>`).join('')}</div>`
  }

  function renderRecords() {
    return `
      <div class="home-layout">
        <section class="record-card">
          <div class="record-settings">
            <div class="form-field"><label for="recordTitle">영역명</label><input id="recordTitle" value="${escapeHtml(state.recordSettings.title)}"></div>
            <div class="form-field"><label for="recordBasisDate">기준일</label><input id="recordBasisDate" type="date" value="${escapeHtml(state.recordSettings.basisDate)}"></div>
            <div class="form-field record-note"><label for="recordNote">표시 문구</label><input id="recordNote" value="${escapeHtml(state.recordSettings.note)}"></div>
          </div>
          <div class="record-admin-list">
            ${Object.keys(RECORD_DEFAULTS).map((id) => {
              const meta = state.recordMeta[id]
              return `<div class="record-admin-row">
                <div class="form-field"><label for="record-label-${id}">항목명</label><input id="record-label-${id}" value="${escapeHtml(meta.label)}"></div>
                <div class="form-field"><label for="record-${id}">표시값</label><input id="record-${id}" data-record-value="${id}" type="text" inputmode="numeric" maxlength="20" value="${formatNumber(state.records[id])}"></div>
                <div class="form-field"><label for="record-unit-${id}">단위</label><input id="record-unit-${id}" value="${escapeHtml(meta.unit)}"></div>
                <div class="form-field"><label for="record-source-${id}">집계 출처</label><input id="record-source-${id}" value="${escapeHtml(meta.source)}"></div>
                <button class="mini-switch" type="button" data-action="toggle-record" data-id="${id}" aria-pressed="${Boolean(meta.visible)}"><span aria-hidden="true"></span><b>${meta.visible ? '노출' : '숨김'}</b></button>
              </div>`
            }).join('')}
          </div>
        </section>
        ${renderHomePreview()}
      </div>
    `
  }

  function renderHomeMapping() {
    const sections = getHomeSections()
    return `
      <section class="panel">
        <header class="panel-header"><div><h3>홈 섹션 구현 · 관리자 연계</h3><p>리빌드 소스와 기존 SCR 활용 범위</p></div></header>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>섹션</th><th>리빌드 소스</th><th>기존 SCR</th><th>판정</th><th>관리 방향</th></tr></thead><tbody>
          ${sections.map((item) => `<tr><td class="title-cell">${item.name}</td><td class="path-cell">${item.sourcePath}</td><td>${scrBadges(item.scr)}</td><td>${item.scr.length ? statusBadge('live') : statusBadge('new')}</td><td>${item.scr.length ? '기존 데이터 구조를 통합 API로 이관' : '페이지 구성형 신규 CMS 필요'}</td></tr>`).join('')}
        </tbody></table></div>
      </section>
    `
  }

  function renderPageManager(showHead = true) {
    const domains = ['전체', ...new Set(getPages().map((page) => page.domain))]
    const filtered = getPages().filter((page) => {
      const search = state.pageSearch.trim().toLowerCase()
      return (state.pageDomain === '전체' || page.domain === state.pageDomain)
        && (state.pageStatus === '전체' || page.workflow === state.pageStatus)
        && (state.pageVisibility === '전체' || String(page.visible) === state.pageVisibility)
        && (!search || `${page.title} ${page.path} ${page.domain}`.toLowerCase().includes(search))
    })
    const pages = getPages()
    const paging = paginateRows('pages', filtered)
    const selected = state.pageSelected
    const currentPageIds = (state.pageDisplay === 'hierarchy' ? filtered : paging.rows).map((page) => page.id)
    const allChecked = currentPageIds.length > 0 && currentPageIds.every((id) => selected.includes(id))
    const deletableCount = selected.filter((id) => String(id).startsWith('custom-')).length
    const hasFilters = Boolean(state.pageSearch.trim() || state.pageDomain !== '전체' || state.pageStatus !== '전체' || state.pageVisibility !== '전체')
    const bulkBar = `<div class="collection-bulk page-selection-bar">
      <label class="bulk-check"><input type="checkbox" data-page-all="true"${allChecked ? ' checked' : ''}><span>${state.pageDisplay === 'hierarchy' ? '조회 결과 전체 선택' : '현재 페이지 전체 선택'}</span></label>
      <span class="bulk-count">${selected.length ? `선택 <b>${selected.length}</b>건` : '페이지를 선택해 일괄 처리'}</span>
      <div class="bulk-actions"><button class="button button-small" data-action="bulk-page-status" data-status="live"${selected.length ? '' : ' disabled'}>홈페이지 노출</button><button class="button button-small" data-action="bulk-page-status" data-status="off"${selected.length ? '' : ' disabled'}>홈페이지 숨김</button><button class="button button-small" data-action="bulk-duplicate-page"${selected.length ? '' : ' disabled'}>선택 복제</button><button class="button button-small button-danger" data-action="bulk-delete-page"${deletableCount ? '' : ' disabled'}>추가 페이지 삭제</button></div>
    </div>`
    return `
      ${showHead ? pageHead('페이지 콘텐츠', '리빌드 홈페이지의 34개 실제 경로와 대표 콘텐츠를 관리합니다.') : ''}
      <div class="compact-summary">
        <span><small>전체 페이지</small><strong>${pages.length}</strong></span>
        <span><small>콘텐츠 승인</small><strong>${pages.filter((page) => page.workflow === 'approved').length}</strong></span>
        <span><small>콘텐츠 검토 중</small><strong>${pages.filter((page) => page.workflow !== 'approved').length}</strong></span>
        <span><small>홈페이지 숨김</small><strong>${pages.filter((page) => !page.visible).length}</strong></span>
      </div>
      <div class="toolbar">
        <div class="filters">
          <div class="field grow"><label for="pageSearch">페이지 검색</label><input id="pageSearch" type="search" value="${escapeHtml(state.pageSearch)}" placeholder="페이지명 또는 URL"></div>
          <div class="field"><label for="pageDomain">도메인</label><select id="pageDomain">${domains.map((domain) => `<option${domain === state.pageDomain ? ' selected' : ''}>${domain}</option>`).join('')}</select></div>
          <div class="field"><label for="pageStatus">콘텐츠 상태</label><select id="pageStatus"><option value="전체">전체</option><option value="approved"${state.pageStatus === 'approved' ? ' selected' : ''}>승인</option><option value="review"${state.pageStatus === 'review' ? ' selected' : ''}>검토 중</option><option value="draft"${state.pageStatus === 'draft' ? ' selected' : ''}>초안</option></select></div>
          <div class="field"><label for="pageVisibility">홈페이지 노출</label><select id="pageVisibility"><option value="전체">전체</option><option value="true"${state.pageVisibility === 'true' ? ' selected' : ''}>노출</option><option value="false"${state.pageVisibility === 'false' ? ' selected' : ''}>숨김</option></select></div>
        </div>
        <div class="toolbar-actions"><div class="view-switch" aria-label="페이지 표시 방식"><button class="button button-small${state.pageDisplay === 'hierarchy' ? ' is-active' : ''}" data-action="set-page-display" data-display="hierarchy">계층 보기</button><button class="button button-small${state.pageDisplay === 'list' ? ' is-active' : ''}" data-action="set-page-display" data-display="list">목록 보기</button></div><button class="button button-secondary" data-action="reset-page-filter">초기화</button><button class="button button-primary" data-action="new-page">페이지 등록</button></div>
      </div>
      <div class="page-structure-note"><strong>페이지 구조</strong><span>여기서는 CMS 콘텐츠 분류와 관리 순서를 설정합니다. 실제 GNB·전체메뉴 노출 위치는 <button data-action="set-page-admin-tab" data-tab="menus">사이트 메뉴 · 링크</button> 탭에서 설정합니다.</span>${hasFilters && state.pageDisplay === 'hierarchy' ? '<small>검색·필터 적용 중에는 숨겨진 항목과의 순서 충돌을 막기 위해 위치 이동이 잠깁니다.</small>' : ''}</div>
      ${state.pageDisplay === 'hierarchy'
        ? `<section class="panel page-hierarchy-panel">${bulkBar}${renderPageHierarchy(filtered, hasFilters)}<div class="table-footer hierarchy-footer"><div class="table-footer-count">총 ${filtered.length}개 / 전체 ${pages.length}개</div></div></section>`
        : `<section class="panel">${bulkBar}<div class="table-wrap"><table class="data-table page-table"><thead><tr><th class="col-check"><span class="sr-only">선택</span></th><th>도메인</th><th>페이지</th><th>리빌드 경로</th><th>유형</th><th>기존 기능</th><th>콘텐츠 상태</th><th>홈페이지 노출</th><th>수정일</th><th>관리</th></tr></thead><tbody>${filtered.length ? paging.rows.map(pageRow).join('') : '<tr><td colspan="10"><div class="empty-state"><strong>검색 결과가 없습니다.</strong>필터 조건을 변경해 주세요.</div></td></tr>'}</tbody></table></div>${tableFooter(`총 ${filtered.length}개 / 전체 ${pages.length}개`, 'pages', paging)}</section>`}
    `
  }

  function renderPageHierarchy(filtered, movementLocked) {
    const filteredIds = new Set(filtered.map((page) => page.id))
    const allPages = getPages()
    const domains = pageDomains(allPages)
    const visibleGroups = domains.map((domain) => ({ domain, pages: orderedDomainPages(domain, allPages).filter((page) => filteredIds.has(page.id)) })).filter((group) => group.pages.length)
    if (!visibleGroups.length) return '<div class="empty-state"><strong>검색 결과가 없습니다.</strong><span>필터 조건을 변경해 주세요.</span></div>'
    return `<div class="page-hierarchy">${visibleGroups.map(({ domain, pages }) => {
      const fullDomainPages = orderedDomainPages(domain, allPages)
      return `<section class="page-domain-group">
        <header class="page-domain-header"><div class="page-domain-order"><b>${String(domains.indexOf(domain) + 1).padStart(2, '0')}</b><span class="order-buttons"><button class="order-button" data-action="move-page-domain" data-id="${escapeHtml(domain)}" data-direction="up" aria-label="${escapeHtml(domain)} 영역 위로 이동"${movementLocked || domains.indexOf(domain) === 0 ? ' disabled' : ''}>↑</button><button class="order-button" data-action="move-page-domain" data-id="${escapeHtml(domain)}" data-direction="down" aria-label="${escapeHtml(domain)} 영역 아래로 이동"${movementLocked || domains.indexOf(domain) === domains.length - 1 ? ' disabled' : ''}>↓</button></span></div><div><strong>${escapeHtml(domain)}</strong><small>${pages.length}${pages.length !== fullDomainPages.length ? ` / ${fullDomainPages.length}` : ''}개 페이지</small></div><span class="page-domain-path">${escapeHtml(domain === '홈' ? '/' : fullDomainPages[0]?.path.split('/').slice(0, 2).join('/') || '/')}</span></header>
        <div class="page-tree-list">${pages.map((page) => pageTreeRow(page, fullDomainPages.indexOf(page), fullDomainPages.length, movementLocked)).join('')}</div>
      </section>`
    }).join('')}</div>`
  }

  function pageTreeRow(page, index, total, movementLocked) {
    const selected = state.pageSelected.includes(page.id)
    const canDelete = String(page.id).startsWith('custom-')
    return `<article class="page-tree-row"${selected ? ' data-selected="1"' : ''}><label class="page-tree-check"><input type="checkbox" data-page-check="true" data-id="${escapeHtml(page.id)}"${selected ? ' checked' : ''}><span class="sr-only">${escapeHtml(page.title)} 선택</span></label><div class="page-tree-order"><b>${String(index + 1).padStart(2, '0')}</b><span class="order-buttons"><button class="order-button" data-action="move-page-position" data-id="${escapeHtml(page.id)}" data-direction="up" aria-label="${escapeHtml(page.title)} 위로 이동"${movementLocked || index === 0 ? ' disabled' : ''}>↑</button><button class="order-button" data-action="move-page-position" data-id="${escapeHtml(page.id)}" data-direction="down" aria-label="${escapeHtml(page.title)} 아래로 이동"${movementLocked || index === total - 1 ? ' disabled' : ''}>↓</button></span></div><div class="page-tree-copy"><strong>${escapeHtml(page.title)}</strong><code>${escapeHtml(page.path)}</code><small>${escapeHtml(page.type)} · ${page.workflow === 'approved' ? '승인' : page.workflow === 'review' ? '검토 중' : '초안'} · 수정 ${escapeHtml(page.updated)}</small></div><div class="page-tree-scr">${scrBadges(page.scr, page.partial)}</div><button class="status-button" data-action="toggle-page" data-id="${page.id}">${statusBadge(page.visible ? 'visible' : 'hidden')}</button><div class="page-tree-actions"><button class="button button-small" data-action="edit-page" data-id="${page.id}">수정</button><a class="button button-small page-preview-button" href="${PREVIEW_ORIGIN}${page.path}" data-action="open-home-preview" data-preview-path="${escapeHtml(page.path)}">미리보기</a>${canDelete ? `<button class="button button-small button-danger" data-action="delete-page" data-id="${page.id}">삭제</button>` : ''}</div></article>`
  }

  function pageRow(page) {
    const canDelete = String(page.id).startsWith('custom-')
    const selected = state.pageSelected.includes(page.id)
    return `<tr${selected ? ' data-selected="1"' : ''}><td class="col-check"><input type="checkbox" class="row-check" data-page-check="true" data-id="${escapeHtml(page.id)}"${selected ? ' checked' : ''}></td><td>${escapeHtml(page.domain)}</td><td class="title-cell"><strong>${escapeHtml(page.title)}</strong><small>${escapeHtml(page.heading || '')}</small></td><td class="path-cell">${escapeHtml(page.path)}</td><td>${escapeHtml(page.type)}</td><td>${scrBadges(page.scr, page.partial)}</td><td>${statusBadge(page.workflow)}</td><td><button class="status-button" data-action="toggle-page" data-id="${page.id}">${statusBadge(page.visible ? 'visible' : 'hidden')}</button></td><td>${escapeHtml(page.updated)}</td><td class="actions-cell wide-actions page-actions-cell"><div class="page-row-actions${canDelete ? ' has-delete' : ''}"><button class="button button-small" data-action="edit-page" data-id="${page.id}">수정</button><button class="button button-small" data-action="duplicate-page" data-id="${page.id}">복제</button><a class="button button-small page-preview-button" href="${PREVIEW_ORIGIN}${page.path}" data-action="open-home-preview" data-preview-path="${escapeHtml(page.path)}">미리보기</a>${canDelete ? `<button class="button button-small button-danger page-delete-button" data-action="delete-page" data-id="${page.id}">삭제</button>` : ''}</div></td></tr>`
  }

  function renderMenuManager(showHead = true) {
    const menuDomains = state.menuDomains
    const childCount = menuDomains.reduce((count, domain) => count + domain.children.length, 0)
    const liveCount = menuDomains.reduce((count, domain) => count + domain.children.filter((child) => child.status === 'live').length, 0)
    return `
      ${showHead ? pageHead('메뉴 · 링크 관리', '홈을 포함한 사이트 구조와 실제 GNB·전체메뉴의 명칭, 경로, 노출 순서를 관리합니다.') : ''}
      <div class="compact-summary">
        <span><small>상위 도메인</small><strong>${menuDomains.length}</strong></span>
        <span><small>하위 메뉴</small><strong>${childCount}</strong></span>
        <span><small>운영 메뉴</small><strong>${liveCount}</strong></span>
        <span><small>검토·비노출</small><strong>${childCount - liveCount}</strong></span>
      </div>
      <div class="toolbar common-management-toolbar"><div class="toolbar-note"><strong>GNB·전체메뉴 구성</strong><span>상위 도메인과 하위 링크를 순서대로 조회합니다.</span></div><div class="toolbar-actions"><button class="button button-secondary" data-action="new-menu-domain">도메인 추가</button><button class="button button-primary" data-action="save-menu">메뉴 설정 저장</button></div></div>
      <section class="menu-tree">
        ${menuDomains.map((domain, index) => {
          const locked = isLockedMenuDomain(domain)
          return `
          <article class="menu-domain${locked ? ' is-locked' : ''}">
            <div class="menu-domain-head">
              <div class="menu-order"><span class="menu-index">${String(index + 1).padStart(2, '0')}</span><span class="order-buttons"><button class="order-button" data-action="move-menu-domain" data-id="${index}" data-direction="up" aria-label="${escapeHtml(domain.name)} 위로 이동" title="위로 이동"${locked || index === 0 || isLockedMenuDomain(menuDomains[index - 1]) ? ' disabled' : ''}>↑</button><button class="order-button" data-action="move-menu-domain" data-id="${index}" data-direction="down" aria-label="${escapeHtml(domain.name)} 아래로 이동" title="아래로 이동"${locked || index === menuDomains.length - 1 ? ' disabled' : ''}>↓</button></span></div>
              <strong>${escapeHtml(domain.name)}${locked ? '<span class="menu-fixed-badge">필수</span>' : ''}</strong><code>${escapeHtml(domain.path)}</code>
              ${locked ? statusBadge('live') : `<button class="status-button" data-action="toggle-menu-domain" data-id="${index}">${statusBadge(domain.status || 'live')}</button>`}
              <div class="menu-actions">${locked ? '<span class="menu-lock-label">🔒 시스템 고정</span>' : `<button class="button button-small" data-action="new-menu-child" data-id="${index}">하위 추가</button><button class="button button-small" data-action="edit-menu" data-id="domain-${index}">편집</button><button class="button button-small button-danger" data-action="delete-menu-domain" data-id="${index}">삭제</button>`}</div>
            </div>
            <div class="menu-children">${domain.children.length ? domain.children.map((child, childIndex) => `<div class="menu-child">
              <div class="menu-child-order"><span>${String(childIndex + 1).padStart(2, '0')}</span><span class="order-buttons"><button class="order-button" data-action="move-menu-child" data-id="${index}-${childIndex}" data-direction="up" aria-label="${escapeHtml(child.title)} 위로 이동" title="위로 이동"${locked || childIndex === 0 ? ' disabled' : ''}>↑</button><button class="order-button" data-action="move-menu-child" data-id="${index}-${childIndex}" data-direction="down" aria-label="${escapeHtml(child.title)} 아래로 이동" title="아래로 이동"${locked || childIndex === domain.children.length - 1 ? ' disabled' : ''}>↓</button></span></div>
              <span>${escapeHtml(child.title)}</span><code>${escapeHtml(child.path)}</code>${locked ? statusBadge('live') : `<button class="status-button" data-action="toggle-menu-child" data-id="${index}-${childIndex}">${statusBadge(child.status)}</button>`}<div class="menu-actions">${locked ? '<span class="menu-lock-label">고정 페이지</span>' : `<button class="button button-small" data-action="edit-menu" data-id="child-${index}-${childIndex}">편집</button><button class="button button-small button-danger" data-action="delete-menu-child" data-id="${index}-${childIndex}">삭제</button>`}</div>
            </div>`).join('') : '<div class="menu-empty">등록된 하위 메뉴가 없습니다.</div>'}</div>
          </article>
        `}).join('')}
      </section>
    `
  }

  function getSeoData(page, index = 0) {
    const defaultDescription = `${page.title} 관련 진료와 검사 정보를 비앤빛 강남밝은세상안과에서 자세히 확인하세요. 개인별 눈 상태에 맞는 검사와 상담을 안내합니다.`
    const data = {
      title: `${page.title} | 비앤빛 강남밝은세상안과`,
      description: index % 7 === 0 ? `${page.title} 정보를 확인하세요.` : defaultDescription,
      canonical: index % 9 === 0 ? '' : `https://www.bnviit.com${page.path}`,
      ogType: 'website',
      ogTitle: `${page.title} | 비앤빛 강남밝은세상안과`,
      ogDescription: defaultDescription,
      indexRule: 'index, follow',
      ogImage: index % 5 === 0 ? '' : '/assets/seo/og-default.png',
      ...(state.seoOverrides[page.id] || {}),
    }
    data.complete = Boolean(data.title && data.title.length <= 60 && data.description.length >= 80 && data.description.length <= 160 && data.canonical)
    return data
  }

  function fillSeoDefaults(pages) {
    pages.forEach((page) => {
      const index = getPages().findIndex((item) => item.id === page.id)
      const seo = getSeoData(page, Math.max(index, 0))
      const defaultDescription = `${page.title} 관련 진료와 검사 정보를 비앤빛 강남밝은세상안과에서 자세히 확인하세요. 개인별 눈 상태에 맞는 검사와 상담을 안내합니다.`
      state.seoOverrides[page.id] = {
        ...seo,
        title: seo.title || `${page.title} | 비앤빛 강남밝은세상안과`,
        description: seo.description.length >= 80 ? seo.description : defaultDescription,
        canonical: seo.canonical || `https://www.bnviit.com${page.path}`,
        ogTitle: seo.ogTitle || seo.title || page.title,
        ogDescription: seo.ogDescription || defaultDescription,
        ogImage: seo.ogImage || '/assets/seo/og-default.png',
        updated: today(),
      }
    })
  }

  function renderLanguageMatrix(packs, filtered, paging) {
    return `
      <div class="toolbar"><div class="filters"><div class="field grow"><label for="languageMenuSearch">메뉴명 검색</label><input id="languageMenuSearch" type="search" value="${escapeHtml(state.languageMenuSearch)}" placeholder="메뉴명 또는 경로"></div></div><div class="toolbar-actions"><button class="button button-secondary" data-action="reset-language-search">검색 초기화</button><button class="button button-secondary" data-action="reset-language-visibility">노출 설정 초기화</button><button class="button button-primary" data-action="save-language-visibility">노출 설정 저장</button></div></div>
      <div class="language-matrix-help"><span><b class="visibility-dot is-on"></b> 노출</span><span><b class="visibility-dot"></b> 숨김</span><span>언어 헤더를 누르면 해당 언어 열 전체를 변경합니다.</span><strong>기본 언어 KO는 항상 노출됩니다.</strong></div>
      <section class="panel language-matrix-panel"><div class="table-wrap"><table class="language-matrix"><thead><tr><th class="language-menu-column">메뉴명 · 경로</th>${packs.map((pack) => `<th class="${pack.enabled ? '' : 'is-disabled'}"><button type="button" data-action="toggle-language-column" data-id="${escapeHtml(pack.id)}"${pack.base ? ' disabled' : ''}><strong>${escapeHtml(pack.displayCode)}</strong><small>${escapeHtml(pack.locale)}</small></button></th>`).join('')}</tr></thead><tbody>${paging.rows.length ? paging.rows.map((entry) => `<tr class="${entry.level ? 'is-child' : 'is-domain'}"><td class="language-menu-column"><strong>${entry.level ? '└ ' : ''}${escapeHtml(entry.name)}</strong><code>${escapeHtml(entry.path)}</code></td>${packs.map((pack) => { const visible = Boolean(state.menuVisibility[entry.key]?.[pack.id]); return `<td class="${pack.enabled ? '' : 'is-disabled'}"><button class="language-visibility-toggle${visible ? ' is-on' : ''}" type="button" data-action="toggle-language-visibility" data-menu-key="${escapeHtml(entry.key)}" data-pack-id="${escapeHtml(pack.id)}" aria-pressed="${visible}" aria-label="${escapeHtml(entry.name)} ${escapeHtml(pack.name)} ${visible ? '노출' : '숨김'}"${pack.base ? ' disabled' : ''}><span></span></button></td>` }).join('')}</tr>`).join('') : `<tr><td colspan="${packs.length + 1}"><div class="empty-state"><strong>검색 결과가 없습니다.</strong><span>메뉴명 또는 경로를 다시 확인해 주세요.</span></div></td></tr>`}</tbody></table></div>${tableFooter(`총 ${filtered.length}개 메뉴 × ${packs.length}개 언어팩`, 'language-matrix', paging)}</section>
    `
  }

  function renderLanguagePacks(packs, entries) {
    const paging = paginateRows('language-packs', packs)
    return `
      <div class="toolbar common-management-toolbar"><div class="toolbar-note"><strong>언어팩 운영</strong><span>기본 언어, 사용 여부와 언어 선택 노출 순서를 관리합니다.</span></div><div class="toolbar-actions"><button class="button button-primary" data-action="new-language-pack">언어 추가</button></div></div>
      <section class="panel"><div class="table-wrap"><table class="data-table language-pack-table"><thead><tr><th>순서</th><th>언어명</th><th>Locale</th><th>표시코드</th><th>번역 범위</th><th>노출 메뉴</th><th>사용</th><th>관리</th></tr></thead><tbody>${paging.rows.map((pack, localIndex) => { const index = paging.offset + localIndex; const visibleCount = entries.filter((entry) => state.menuVisibility[entry.key]?.[pack.id]).length; return `<tr><td><div class="item-order-control"><b>${String(index + 1).padStart(2, '0')}</b><span class="order-buttons"><button class="order-button" data-action="move-language-pack" data-id="${escapeHtml(pack.id)}" data-direction="up"${pack.base || index === 0 ? ' disabled' : ''}>↑</button><button class="order-button" data-action="move-language-pack" data-id="${escapeHtml(pack.id)}" data-direction="down"${pack.base || index === packs.length - 1 ? ' disabled' : ''}>↓</button></span></div></td><td class="title-cell"><strong>${escapeHtml(pack.name)}</strong>${pack.base ? '<small>기본 언어 · 변경 불가</small>' : ''}</td><td class="path-cell">${escapeHtml(pack.locale)}</td><td><span class="cell-tag">${escapeHtml(pack.displayCode)}</span></td><td>${escapeHtml(pack.scope)}</td><td>${visibleCount} / ${entries.length}</td><td>${pack.base ? '<span class="badge badge-live">필수 사용</span>' : `<button class="mini-switch" data-action="toggle-language-pack" data-id="${escapeHtml(pack.id)}" aria-pressed="${pack.enabled}"><span aria-hidden="true"></span><b>${pack.enabled ? '사용' : '미사용'}</b></button>`}</td><td><button class="button button-small" data-action="edit-language-pack" data-id="${escapeHtml(pack.id)}">수정</button></td></tr>` }).join('')}</tbody></table></div>${tableFooter(`총 ${packs.length}개 언어팩`, 'language-packs', paging)}</section>
    `
  }

  function moduleRow(view, row, index) {
    return `<tr data-search-row="${escapeHtml(row.join(' ').toLowerCase())}">${row.map((value, col) => {
      if (col === 3) return `<td>${statusBadge(value)}</td>`
      if (col === 4) return `<td>${scrBadges(value)}</td>`
      return `<td${col === 0 ? ' class="title-cell"' : ''}>${escapeHtml(value)}</td>`
    }).join('')}<td><button class="button button-small" data-action="edit-module-row" data-module="${view}" data-id="${index}">상세</button></td></tr>`
  }

  function activeCollectionKey(view) {
    const keys = (COLLECTION_VIEWS[view] || []).filter((key) => COLLECTIONS[key])
    const chosen = state.collectionTab[view]
    return keys.includes(chosen) ? chosen : keys[0]
  }

  function visibleCollectionRows(key) {
    const def = COLLECTIONS[key]
    const search = (state.collectionSearch[key] || '').trim().toLowerCase()
    const filters = state.collectionFilters[key] || {}
    return state.collections[key].filter((row) => matchesCollectionSearch(def, row, search) && matchesCollectionFilters(def, row, filters))
  }

  function matchesCollectionSearch(def, row, query) {
    if (!query) return true
    return (def.searchKeys || []).some((key) => String(row[key] ?? '').toLowerCase().includes(query))
  }

  function matchesCollectionFilters(def, row, filters) {
    return (def.filters || []).every((filter) => {
      const value = filters[filter.id]
      if (!value || value === '전체') return true
      if (filter.kind === 'bool') {
        // 옵션 배열은 [전체, on라벨, off라벨] 구조 — 두 번째(on) 선택 시 참으로 판정
        const truthy = value === filter.options[1]
        return Boolean(row[filter.field]) === truthy
      }
      return String(row[filter.field] ?? '') === value
    })
  }

  function snsBadge(kind) {
    if (kind === 'instagram') {
      return `<span class="sns-badge sns-badge-insta" title="Instagram" aria-label="Instagram"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="#fff" stroke="none"/></svg></span>`
    }
    return `<span class="sns-badge sns-badge-blog" title="Blog">blog</span>`
  }

  function renderCollectionPreview(def, rows) {
    const items = rows.filter((row) => row.photo)
    if (!items.length) return ''
    const cards = items.map((row) => `<figure class="sns-card">
        <img class="sns-card-img" src="${escapeHtml(row.photo)}" alt="${escapeHtml(row.title || '')}" loading="lazy">
        ${snsBadge(row.badge)}
        <figcaption class="sns-card-meta"><b>${escapeHtml(row.title || '')}</b>${row.handle ? `<span>@${escapeHtml(row.handle)}</span>` : ''}</figcaption>
      </figure>`).join('')
    return `<section class="panel sns-preview">
        <div class="sns-preview-head"><span class="sns-preview-eyebrow">홈페이지 노출 미리보기</span><h3 class="sns-preview-title">${escapeHtml(def.previewHeading || '')}</h3><span class="sns-preview-count">${items.length}개 노출</span></div>
        <div class="sns-grid">${cards}</div>
      </section>`
  }

  function renderCollection(key) {
    const def = COLLECTIONS[key]
    const all = state.collections[key]
    const hasTop = def.columns.some((col) => col.key === 'top')
    const rows = visibleCollectionRows(key)
    const pagingKey = `collection-${key}`
    const paging = paginateRows(pagingKey, rows)
    const selected = state.collectionSelected[key] || []
    const allChecked = rows.length > 0 && rows.every((row) => selected.includes(row.id))
    const filterFields = (def.filters || []).map((filter) => {
      const current = (state.collectionFilters[key] || {})[filter.id] || '전체'
      return `<div class="field"><label>${escapeHtml(filter.label)}</label><select data-collection-filter="${key}" data-filter-id="${filter.id}">${filter.options.map((option) => `<option${current === option ? ' selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select></div>`
    }).join('')
    const hasSelection = selected.length > 0
    const readOnly = Boolean(def.readOnly)
    const bulkButtons = readOnly ? '' : `
        <span class="toolbar-divider" aria-hidden="true"></span>
        <button class="button button-secondary" data-action="bulk-collection-toggle" data-collection="${key}" data-value="true"${hasSelection ? '' : ' disabled'}>노출</button>
        <button class="button button-secondary" data-action="bulk-collection-toggle" data-collection="${key}" data-value="false"${hasSelection ? '' : ' disabled'}>숨김</button>
        <button class="button button-danger" data-action="bulk-collection-delete" data-collection="${key}"${hasSelection ? '' : ' disabled'}>선택 삭제</button>`
    const addButton = readOnly ? '' : `<button class="button button-primary" data-action="new-collection-row" data-collection="${key}">＋ ${escapeHtml(def.singular)} 등록</button>`
    const toolbar = `<div class="toolbar collection-toolbar"><div class="filters">
        <div class="field grow"><label for="cs-${key}">검색어</label><input id="cs-${key}" type="search" data-collection-search="${key}" value="${escapeHtml(state.collectionSearch[key] || '')}" placeholder="${escapeHtml(def.searchPlaceholder || '검색')}"></div>
        ${filterFields}
      </div>
      <div class="toolbar-actions">
        <button class="button button-secondary" data-action="reset-collection-filter" data-collection="${key}">🔄 초기화</button>${bulkButtons}
        <span class="toolbar-divider" aria-hidden="true"></span>
        <button class="button button-secondary" data-action="export-collection" data-collection="${key}">목록 내보내기</button>
        ${hasTop ? `<button class="button button-secondary" data-action="export-pins" data-collection="${key}">📌 고정 목록 내보내기</button>` : ''}
        ${addButton}
      </div>
    </div>`
    const cols = def.columns
    const checkTh = readOnly ? '' : `<th class="col-check"><input type="checkbox" class="chk-all" data-collection-all="${key}"${allChecked ? ' checked' : ''} aria-label="현재 목록 전체 선택"></th>`
    const manageTh = readOnly ? '' : '<th class="col-manage">관리</th>'
    const thead = `<tr>${checkTh}<th class="col-no">No</th>${cols.map((col) => `<th class="col-h-${col.type}">${escapeHtml(col.label)}</th>`).join('')}${manageTh}</tr>`
    const emptyCols = cols.length + 1 + (readOnly ? 0 : 2)
    const body = rows.length
      ? paging.rows.map((row, index) => collectionRow(def, key, row, paging.offset + index, rows.length)).join('')
      : `<tr><td class="collection-empty" colspan="${emptyCols}">조건에 맞는 ${escapeHtml(def.singular)}이(가) 없습니다.</td></tr>`
    return `${def.previewGrid ? renderCollectionPreview(def, rows) : ''}${toolbar}<section class="panel collection-panel"><div class="table-wrap"><table class="data-table collection-table"><thead>${thead}</thead><tbody>${body}</tbody></table></div>
      ${tableFooter(`총 <b>${rows.length}</b>건${rows.length !== all.length ? ` · 전체 ${all.length}건` : ''}${hasSelection ? ` · 선택 <b>${selected.length}</b>건` : ''}${def.legacy ? ` · 기존 기능 <span class="scr-badge">${escapeHtml(def.legacy)}</span>` : ''}`, pagingKey, paging)}</section>`
  }

  function collectionRow(def, key, row, index, total) {
    const selected = (state.collectionSelected[key] || []).includes(row.id)
    const cells = def.columns.map((col) => collectionCell(def, key, col, row, index, total)).join('')
    const checkTd = def.readOnly ? '' : `<td class="col-check"><input type="checkbox" class="row-check" data-collection-check="${key}" data-id="${escapeHtml(row.id)}"${selected ? ' checked' : ''}></td>`
    const manageTd = def.readOnly ? '' : `<td class="col-manage"><button class="button button-small" data-action="edit-collection-row" data-collection="${key}" data-id="${escapeHtml(row.id)}">수정</button></td>`
    return `<tr class="collection-row"${selected ? ' data-selected="1"' : ''}>${checkTd}
      <td class="col-no">${index + 1}</td>${cells}${manageTd}
    </tr>`
  }

  function collectionCell(def, key, col, row, index, total) {
    const value = row[col.key]
    const readOnly = Boolean(def.readOnly)
    switch (col.type) {
      case 'order':
        return readOnly
          ? `<td class="col-order"><span class="order-seq order-seq-static">${escapeHtml(value)}</span></td>`
          : `<td class="col-order">${orderControl(key, row.id, index, total)}<span class="order-seq">${escapeHtml(value)}</span></td>`
      case 'thumb':
        return value
          ? `<td class="col-thumb"><img class="cell-thumb-img" src="${escapeHtml(value)}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'cell-thumb',textContent:'IMG'}))"></td>`
          : `<td class="col-thumb"><span class="cell-thumb" aria-hidden="true">IMG</span></td>`
      case 'title':
        return readOnly
          ? `<td class="col-title"><strong>${escapeHtml(value)}</strong></td>`
          : `<td class="col-title"><button class="cell-title-btn" data-action="edit-collection-row" data-collection="${key}" data-id="${escapeHtml(row.id)}">${escapeHtml(value)}</button></td>`
      case 'tag':
        return `<td><span class="cell-tag">${escapeHtml(value)}</span></td>`
      case 'toggle':
        return readOnly
          ? `<td class="col-toggle"><span class="badge ${value ? 'badge-live' : 'badge-off'}">${escapeHtml(value ? col.on : col.off)}</span></td>`
          : `<td class="col-toggle">${toggleChip(key, row.id, col, Boolean(value))}</td>`
      case 'num':
        return `<td class="col-num">${formatNumber(value)}</td>`
      case 'date':
        return `<td class="col-date">${escapeHtml(value || '-')}</td>`
      case 'stars':
        return `<td class="col-stars">${starRating(value)}</td>`
      case 'badge':
        return `<td>${statusBadge(value)}</td>`
      default:
        return `<td>${escapeHtml(value ?? '')}</td>`
    }
  }

  Object.assign(window.BNVIIT_ADMIN, { metricCard, activity, homeTab, renderHomeSections, renderHomeContent, renderHomeItemRow, renderHomePreview, renderHomePreviewSection, renderRecords, renderHomeMapping, renderPageManager, renderPageHierarchy, pageTreeRow, pageRow, renderMenuManager, getSeoData, fillSeoDefaults, renderLanguageMatrix, renderLanguagePacks, moduleRow, activeCollectionKey, visibleCollectionRows, matchesCollectionSearch, matchesCollectionFilters, renderCollection, collectionRow, collectionCell })
})()
