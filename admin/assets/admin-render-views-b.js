;(function () {
  'use strict'
  const {
    PREVIEW_ORIGIN, CMS_CATALOG, COLLECTION_VIEWS, COLLECTIONS, VIEW_META, MODULE_CONFIG, state, content,
    getPages, languageMenuEntries, syncMenuVisibility, getModuleRows, getFloatingActionSettings, floatingActionEntries, countryFlagUrl, escapeHtml, formatNumber, statusBadge, scrBadges,
    pageHead, paginateRows, tableFooter, metricCard, activity, homeTab, renderHomeSections, renderHomeContent,
    renderRecords, renderHomeMapping, renderPageManager, renderMenuManager, getSeoData, renderLanguageMatrix, renderLanguagePacks, moduleRow,
    activeCollectionKey, renderCollection,
  } = window.BNVIIT_ADMIN

  function renderDashboard() {
    const pages = getPages()
    const liveCount = pages.filter((page) => page.visible).length
    const draftCount = pages.filter((page) => page.workflow !== 'approved').length
    const linkedCount = pages.filter((page) => page.scr.length).length
    const coverage = Math.round((linkedCount / pages.length) * 100)
    return `
      ${pageHead('운영 대시보드', '리빌드 홈페이지 콘텐츠, 고객 접수, 기존 SCR 재사용 상태를 한눈에 확인합니다.', '<button class="button button-primary" data-view="home">홈 화면 편집</button>')}
      <section class="metrics-grid" aria-label="주요 지표">
        ${metricCard('홈페이지 노출', `${liveCount} / ${pages.length}`, `검토 중 ${draftCount}개 · 리빌드 라우트 기준`, '노출 중', 'up')}
        ${metricCard('오늘 상담 접수', '14', '온라인 · 전화 · 카카오', '전일 대비 +3', 'up')}
        ${metricCard('오늘 검사 예약', '9', '확정 6 · 확인 대기 3', '대기 3건', 'warn')}
        ${metricCard('SCR 기능 연계', `${coverage}%`, `${linkedCount}개 페이지에 기존 기능 활용`, '신규 CMS 병행', 'warn')}
      </section>

      <div class="dashboard-grid">
        <div>
          <section class="panel">
            <header class="panel-header"><div><h3>리뉴얼 준비 상태</h3><p>페이지와 관리자 기능의 현재 구성 기준</p></div><button class="button button-small" data-view="migration">상세 점검</button></header>
            <div class="panel-body">
              <div class="status-summary">
                <div class="status-summary-item is-live"><span>운영 가능</span><strong>${liveCount}</strong></div>
                <div class="status-summary-item is-draft"><span>내용 검토</span><strong>${draftCount}</strong></div>
                <div class="status-summary-item is-new"><span>신규 CMS 대상</span><strong>${pages.length - linkedCount}</strong></div>
              </div>
              <div class="progress-row">
                <div class="progress-copy"><span>전체 페이지 구성률</span><b>${Math.round((liveCount / pages.length) * 100)}%</b></div>
                <div class="progress-track"><div class="progress-bar" style="width:${Math.round((liveCount / pages.length) * 100)}%"></div></div>
              </div>
            </div>
          </section>

          <section class="panel">
            <header class="panel-header"><div><h3>최근 운영 변경</h3><p>콘텐츠 관리자 작업 이력 예시</p></div></header>
            <div class="panel-body flush">
              <ul class="activity-list">
                ${activity('오늘 14:32', '홈 키비주얼 문구 수정', '콘텐츠 관리자 · HeroCarousel', '검토 중', 'draft')}
                ${activity('오늘 11:08', '김진국 대표원장 프로필 갱신', '병원운영팀 · SCR-04 연계', '반영', 'live')}
                ${activity('어제 17:20', '8월 진료 일정 공지 예약', '콘텐츠 관리자 · SCR-11', '예약', 'draft')}
                ${activity('어제 15:04', 'SEO 설명문 누락 3건 보완', '마케팅팀 · 신규 SEO CMS', '반영', 'live')}
              </ul>
            </div>
          </section>
        </div>

        <div>
          <section class="panel">
            <header class="panel-header"><div><h3>오늘 확인할 항목</h3><p>업무 우선순위 예시</p></div></header>
            <div class="panel-body">
              <ul class="check-list">
                <li><span class="check-mark is-warn">!</span><span><b>상담 답변 대기 5건</b><small>2시간 이상 대기 1건</small></span><button class="button button-small" data-view="consultations">열기</button></li>
                <li><span class="check-mark is-warn">!</span><span><b>예약 확인 대기 3건</b><small>제휴고객 예약 포함</small></span><button class="button button-small" data-view="bookings">열기</button></li>
                <li><span class="check-mark">✓</span><span><b>금일 게시 예약 정상</b><small>공지 1건 · 이벤트 1건</small></span><button class="button button-small" data-view="events">열기</button></li>
                <li><span class="check-mark is-warn">!</span><span><b>전문분야 URL 세분화 필요</b><small>현재 /specialty 단일 경로</small></span><button class="button button-small" data-view="pages">열기</button></li>
              </ul>
            </div>
          </section>

          <section class="panel">
            <header class="panel-header"><div><h3>사이트 기록</h3><p>홈 BNVIIT RECORD 노출값</p></div><button class="button button-small" data-view="home">편집</button></header>
            <div class="panel-body">
              <ul class="check-list">
                <li><span class="check-mark">•</span><span>누적 수술 건수</span><b>${formatNumber(state.records.surgery)}+</b></li>
                <li><span class="check-mark">•</span><span>누적 후기</span><b>${formatNumber(state.records.reviews)}+</b></li>
                <li><span class="check-mark">•</span><span>의료진</span><b>${formatNumber(state.records.doctors)}인</b></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    `
  }

  function renderCoverage() {
    const targets = ['home', 'common-layout', 'hospital-info', 'vision-content', 'specialty-content', 'booking-settings', 'mypage-content', 'media-library', 'policy-links', 'settings']
    const rows = CMS_CATALOG.coverageRows || []
    return `
      ${pageHead('전체 관리 커버리지', '리빌드 홈페이지의 화면·콘텐츠·업무 기능이 어떤 CMS 메뉴에서 관리되는지 확인합니다.', '<button class="button button-primary" data-action="run-coverage-check">누락 항목 다시 점검</button>')}
      <section class="metrics-grid">
        ${metricCard('관리 도메인', `${rows.length} / ${rows.length}`, '공통 · 콘텐츠 · 업무 · 시스템', '전체 구성', 'up')}
        ${metricCard('리빌드 라우트', '34 / 34', 'routes.js 기준 관리 경로', '누락 없음', 'up')}
        ${metricCard('공통 컴포넌트', '5 / 5', '헤더 · 메뉴 · 푸터 · 플로팅 · 언어', '관리 연결', 'up')}
        ${metricCard('세부 관리 메뉴', `${Object.keys(MODULE_CONFIG).length + 9}`, '목록 · 설정 · 편집 화면', '확장 완료', 'up')}
      </section>
      <section class="panel coverage-panel">
        <header class="panel-header"><div><h3>홈페이지 제어 범위</h3><p>관리 화면이 비어 있지 않은지 기능 단위로 대조한 결과</p></div><span class="badge badge-live">관리 UI 구성 완료</span></header>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>관리 영역</th><th>리빌드 대상</th><th>CMS 세부 메뉴</th><th>상태</th><th>바로가기</th></tr></thead><tbody>
          ${rows.map((row, index) => `<tr><td class="title-cell">${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td><td>${statusBadge('live').replace('운영', escapeHtml(row[3]))}</td><td><button class="button button-small" data-view="${targets[index] || 'pages'}">관리 열기</button></td></tr>`).join('')}
        </tbody></table></div>
      </section>
      <section class="control-boundary">
        <strong>실제 홈페이지 반영 경계</strong>
        <span>현재 화면은 완성된 CMS 운영 프로토타입이며 저장값은 브라우저에 보관됩니다. 운영 홈페이지에 즉시 반영하려면 이 관리 모델을 Java API와 DB에 연결하고, React의 하드코딩 데이터를 API 조회로 전환해야 합니다.</span>
      </section>
    `
  }

  function renderHomeManager() {
    const tabLabels = { sections: '섹션 구성', content: '콘텐츠 편집', records: '자랑할 숫자', mapping: '소스 · SCR 연계' }
    const contextActions = state.homeTab === 'content'
      ? `<button class="button button-primary" type="button" data-action="new-home-item" data-section="${state.homeContentSection}">항목 추가</button>`
      : state.homeTab === 'records'
        ? '<button class="button button-secondary" data-action="reset-records">예시값 복원</button><button class="button button-primary" data-action="save-records">기록 저장</button>'
        : ''
    return `
      ${pageHead('홈 화면 관리', '메인 화면의 4개 구성 영역과 노출 콘텐츠를 관리합니다.')}
      <div class="toolbar common-management-toolbar">
        <div class="toolbar-note"><strong>${tabLabels[state.homeTab]}</strong><span>현재 탭의 조회·관리 기능</span></div>
        <div class="toolbar-actions">${contextActions}<a class="button button-secondary" href="${PREVIEW_ORIGIN}/" data-action="open-home-preview">홈페이지 열기</a><button class="button button-primary" data-action="save-home">로컬 저장</button></div>
      </div>
      <div class="tabs" role="tablist" aria-label="홈 관리 탭">
        ${homeTab('sections', '섹션 구성')}
        ${homeTab('content', '콘텐츠 편집')}
        ${homeTab('records', '자랑할 숫자')}
        ${homeTab('mapping', '소스 · SCR 연계')}
      </div>
      ${state.homeTab === 'sections' ? renderHomeSections() : state.homeTab === 'content' ? renderHomeContent() : state.homeTab === 'records' ? renderRecords() : renderHomeMapping()}
    `
  }

  function renderCommonLayoutManager() {
    const rows = getModuleRows('common-layout')
    const liveCount = rows.filter((row) => row[3] === '운영').length
    const reviewCount = rows.filter((row) => row[3] !== '운영').length
    return `
      ${pageHead('공통 영역 관리', '전체 페이지에 공통 적용되는 레이아웃과 바로가기 구성을 관리합니다.')}
      <div class="compact-summary">
        <span><small>전체 구성</small><strong>${rows.length}</strong></span>
        <span><small>운영</small><strong>${liveCount}</strong></span>
        <span><small>점검·비노출</small><strong>${reviewCount}</strong></span>
        <span><small>적용 범위</small><strong>전체 페이지</strong></span>
      </div>
      <div class="toolbar common-management-toolbar"><div class="toolbar-note"><strong>공통 구성 조회</strong><span>헤더·메뉴·푸터·플로팅 영역</span></div><div class="toolbar-actions"><button class="button button-primary" data-action="new-common-item">구성요소 추가</button></div></div>
      <section class="common-layout-list">
        ${rows.map((row, index) => `
          <article class="common-layout-row">
            <div class="item-order-control">
              <b>${String(index + 1).padStart(2, '0')}</b>
              <span class="order-buttons">
                <button class="order-button" type="button" data-action="move-common-item" data-id="${index}" data-direction="up" aria-label="${escapeHtml(row[0])} 위로 이동" title="위로 이동"${index === 0 ? ' disabled' : ''}>↑</button>
                <button class="order-button" type="button" data-action="move-common-item" data-id="${index}" data-direction="down" aria-label="${escapeHtml(row[0])} 아래로 이동" title="아래로 이동"${index === rows.length - 1 ? ' disabled' : ''}>↓</button>
              </span>
            </div>
            <span class="section-symbol common-symbol" aria-hidden="true">CM</span>
            <div class="common-layout-copy"><strong>${escapeHtml(row[0])}</strong><small>${escapeHtml(row[1])}</small></div>
            <div class="common-layout-scope"><span>관리 항목</span><p>${escapeHtml(row[2])}</p></div>
            <div class="common-layout-scr">${scrBadges(row[4])}</div>
            <button class="mini-switch" type="button" data-action="toggle-common-item" data-id="${index}" aria-pressed="${row[3] === '운영'}"><span aria-hidden="true"></span><b>${row[3]}</b></button>
            <div class="home-item-actions"><button class="button button-small" data-action="edit-common-item" data-id="${index}">편집</button><button class="button button-small button-danger" data-action="delete-common-item" data-id="${index}">삭제</button></div>
          </article>
        `).join('')}
      </section>
    `
  }

  function floatingActionIcon(key, icon = key) {
    if (icon === 'ai') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 13.6 8.4 19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m18.5 15.5.6 1.9L21 18l-1.9.6-.6 1.9-.6-1.9L16 18l1.9-.6.6-1.9Z"/></svg>'
    if (icon === 'consult' || icon === 'message') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5V14a2.5 2.5 0 0 1-2.5 2.5H9L5 20V6.5Z"/></svg>'
    if (icon === 'top') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m0 0-6 6m6-6 6 6"/></svg>'
    if (icon === 'calendar') return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8 3v4m8-4v4"/><circle cx="16.5" cy="16.5" r="3.5"/><path d="M16.5 14.5v2.2l1.5 1"/></svg>'
    if (icon === 'whatsapp') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z"/><path d="M9 8.2c.5 3 2.2 4.8 5.5 5.8l1.2-1.4 2 .8c-.3 1.9-1.7 2.8-3.6 2.4-4.4-1-7-3.8-7.8-7.3C6 7.1 7 6 8.4 6l.6 2.2Z"/></svg>'
    const glyphs = { kakao: 'TALK', zalo: 'Zalo', facebook: 'f', google: 'g+', instagram: '◎', youtube: '▶', line: 'LINE', wechat: 'We', telegram: '➤', custom: '•••' }
    return `<b class="floating-channel-glyph is-${escapeHtml(icon)}">${escapeHtml(glyphs[icon] || '•••')}</b>`
  }

  function safeChannelColor(value) {
    return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? value : '#667085'
  }

  function renderFloatingActionsManager() {
    const selectedPack = state.languagePacks.find((pack) => pack.id === state.floatingLocale) || state.languagePacks[0]
    state.floatingLocale = selectedPack?.id || 'ko'
    const settings = getFloatingActionSettings(state.floatingLocale)
    const fixedMeta = {
      ai: { key: 'ai', name: 'AI 검사', help: '방문자를 AI 검사 안내 페이지로 이동시킵니다.', icon: 'ai' },
      consult: { key: 'consult', name: '상담', help: '상담 신청 페이지 또는 국가별 외부 상담 채널로 연결합니다.', icon: 'consult' },
      top: { key: 'top', name: '맨 위로', help: '현재 페이지 상단으로 부드럽게 스크롤합니다.', icon: 'top' },
    }
    const entries = floatingActionEntries(settings)
    const actions = entries.map((entry) => entry.custom
      ? { key: entry.key, name: entry.item.label, help: `${entry.item.icon} 채널 · 직접 추가된 바로가기`, icon: entry.item.icon, custom: true }
      : fixedMeta[entry.key])
    const selectedEnabled = settings.enabled !== false
    const detailRows = actions.map((meta, index) => {
      const item = settings[meta.key] || settings.custom.find((channel) => channel.id === meta.key)
      const customStyle = meta.custom ? ` style="background:${safeChannelColor(item.color)};border-color:${safeChannelColor(item.color)};color:${item.icon === 'kakao' ? '#2C1A00' : '#fff'}"` : ''
      return `
        <tr class="${item.visible ? '' : 'is-off'}">
          <td class="floating-order-no">${index + 1}</td>
          <td class="title-cell"><span class="floating-action-cell"><span class="floating-action-sample is-${meta.custom ? 'channel' : meta.key}"${customStyle}>${floatingActionIcon(meta.key, meta.icon)}</span><span class="floating-action-cell-text"><strong>${meta.name}</strong><p>${meta.help}</p></span></span></td>
          <td><input value="${escapeHtml(item.label)}" data-floating-action="${meta.key}" data-floating-field="label" maxlength="18" aria-label="${meta.name} 표시 문구"></td>
          <td>${meta.key === 'top'
            ? '<input value="현재 페이지 상단으로 스크롤" readonly aria-label="맨 위로 동작">'
            : `<input value="${escapeHtml(item.target)}" data-floating-action="${meta.key}" data-floating-field="target" placeholder="ai, reqconsult 또는 https://..." aria-label="${meta.name} 이동 경로">`}</td>
          <td><button class="mini-switch" type="button" data-action="toggle-floating-action" data-key="${meta.key}" aria-pressed="${item.visible}"><span aria-hidden="true"></span><b>${item.visible ? '노출' : '숨김'}</b></button></td>
          <td><span class="order-buttons">
            <button class="order-button" type="button" data-action="move-floating-action" data-key="${meta.key}" data-direction="up"${index === 0 ? ' disabled' : ''} aria-label="${meta.name} 위로">▲</button>
            <button class="order-button" type="button" data-action="move-floating-action" data-key="${meta.key}" data-direction="down"${index === actions.length - 1 ? ' disabled' : ''} aria-label="${meta.name} 아래로">▼</button>
          </span></td>
          <td><button class="button button-small button-danger" type="button" data-action="delete-floating-action" data-key="${meta.key}">삭제</button></td>
        </tr>`
    }).join('')
    return `
      ${pageHead('국가별 플로팅 메뉴', '홈페이지 우측 하단 바로가기를 국가·언어별로 관리합니다.')}
      <div class="toolbar common-management-toolbar floating-actions-toolbar">
        <div class="toolbar-note"><strong>${escapeHtml(selectedPack?.country || '')} · ${escapeHtml(selectedPack?.name || '한국어')}</strong><span>${escapeHtml(selectedPack?.locale || 'ko')} · ${selectedEnabled ? '플로팅 메뉴 사용 중' : '플로팅 메뉴 사용 중지'}</span></div>
        <div class="toolbar-actions"><button class="button ${selectedEnabled ? 'button-danger' : 'button-success'}" type="button" data-action="toggle-floating-country" data-id="${escapeHtml(selectedPack?.id || 'ko')}">${selectedEnabled ? '비활성화' : '활성화'}</button><button class="button button-secondary" type="button" data-action="new-floating-country">+ 국가 추가</button><button class="button button-secondary" type="button" data-action="new-floating-channel">+ 채널 추가</button><button class="button button-secondary" type="button" data-action="reset-floating-actions">현재 국가 초기화</button><button class="button button-primary" type="button" data-action="save-floating-actions">설정 저장</button></div>
      </div>
      <nav class="floating-country-tabs" aria-label="플로팅 메뉴 관리 국가·언어">
        ${state.languagePacks.map((pack) => { const packSettings = getFloatingActionSettings(pack.id); const packEnabled = packSettings.enabled !== false; const packEntries = floatingActionEntries(packSettings); const visible = packEntries.filter((entry) => entry.item.visible).length; return `<button type="button" class="floating-country-tab${pack.id === state.floatingLocale ? ' is-active' : ''}${packEnabled ? '' : ' is-disabled'}" data-action="set-floating-locale" data-id="${escapeHtml(pack.id)}"><span class="floating-country-tab-flag">${pack.countryCode ? `<img src="${countryFlagUrl(pack.countryCode)}" alt="" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><i hidden aria-hidden="true">◎</i>` : '<i aria-hidden="true">◎</i>'}</span><span>${escapeHtml(pack.country || pack.name)} · ${escapeHtml(pack.name)}</span><small>${packEnabled ? `${visible}/${packEntries.length} 노출` : '사용 중지'}</small></button>` }).join('')}
      </nav>
      <div class="floating-manager-grid">
        <section class="floating-action-settings" aria-label="${escapeHtml(selectedPack?.name || '')} 플로팅 버튼 설정">
          ${selectedEnabled ? '' : '<div class="floating-disabled-note">이 국가는 플로팅 메뉴 사용 중지 상태입니다. 상단의 사용 스위치를 켜면 홈페이지에 노출됩니다.</div>'}
          <div class="panel"><div class="table-wrap"><table class="data-table floating-actions-table">
            <thead><tr><th>No</th><th>버튼</th><th>표시 문구</th><th>이동 경로</th><th>노출</th><th>순서</th><th>관리</th></tr></thead>
            <tbody>${detailRows}</tbody>
          </table></div></div>
        </section>
        <aside class="panel floating-actions-preview">
          <header><span>LIVE PREVIEW</span><strong>${escapeHtml(selectedPack?.country || '대한민국')} 플로팅 메뉴</strong><p>저장 전에 노출 여부와 표시 문구를 확인하세요.</p></header>
          <div class="floating-preview-screen">
            <span class="floating-preview-page-line"></span><span class="floating-preview-page-line short"></span>
            <div class="floating-preview-stack">
              ${actions.map((meta) => { const item = settings[meta.key] || settings.custom.find((channel) => channel.id === meta.key); const customStyle = meta.custom ? ` style="background:${safeChannelColor(item.color)};border-color:${safeChannelColor(item.color)};color:${item.icon === 'kakao' ? '#2C1A00' : '#fff'}"` : ''; return `<div class="floating-preview-button is-${meta.custom ? 'channel' : meta.key}${item.visible && selectedEnabled ? '' : ' is-hidden'}" data-floating-preview="${meta.key}"${customStyle}>${floatingActionIcon(meta.key, meta.icon)}${meta.key === 'top' || meta.custom ? '' : `<b>${escapeHtml(item.label)}</b>`}<small>${!selectedEnabled ? '사용 중지' : item.visible ? '노출' : '숨김'}</small></div>` }).join('')}
            </div>
          </div>
          <div class="floating-preview-note"><strong>반영 기준</strong><span>홈페이지에서 방문자가 선택한 언어 코드를 기준으로 설정을 적용합니다.</span></div>
        </aside>
      </div>
    `
  }

  function renderPageMenuWorkspace(forcedTab = '') {
    const activeTab = forcedTab || state.pageAdminTab
    if (forcedTab) state.pageAdminTab = forcedTab
    return `
      ${pageHead('페이지 · 메뉴 관리', '페이지의 구조와 콘텐츠, 실제 사이트 메뉴 노출을 한 곳에서 구분해 관리합니다.')}
      <div class="tabs page-admin-tabs" role="tablist" aria-label="페이지와 메뉴 관리 탭">
        <button class="tab-button${activeTab === 'pages' ? ' is-active' : ''}" type="button" data-action="set-page-admin-tab" data-tab="pages"><span>페이지 구조 · 콘텐츠</span><b>${getPages().length}</b></button>
        <button class="tab-button${activeTab === 'menus' ? ' is-active' : ''}" type="button" data-action="set-page-admin-tab" data-tab="menus"><span>사이트 메뉴 · 링크</span><b>${state.menuDomains.length}</b></button>
      </div>
      <div class="page-admin-boundary"><strong>${activeTab === 'pages' ? '페이지 책임' : '메뉴 책임'}</strong><span>${activeTab === 'pages' ? 'URL, 콘텐츠, CMS 분류와 관리 순서를 설정합니다.' : 'GNB, 전체메뉴, 노출 여부와 사용자에게 보이는 링크 순서를 설정합니다.'}</span></div>
      ${activeTab === 'pages' ? renderPageManager(false) : renderMenuManager(false)}
    `
  }

  function renderMediaManager() {
    const categories = ['전체', ...new Set(state.mediaAssets.map((item) => item.category))]
    const filtered = state.mediaAssets.filter((item) => {
      const query = state.mediaSearch.trim().toLowerCase()
      return (state.mediaCategory === '전체' || item.category === state.mediaCategory)
        && (state.mediaStatus === '전체' || item.status === state.mediaStatus)
        && (!query || `${item.name} ${item.fileName} ${item.alt} ${item.usage}`.toLowerCase().includes(query))
    })
    const missingAlt = state.mediaAssets.filter((item) => !item.alt.trim()).length
    const paging = paginateRows('media-library', filtered)
    const currentPageIds = paging.rows.map((item) => item.id)
    const allChecked = currentPageIds.length > 0 && currentPageIds.every((id) => state.mediaSelected.includes(id))
    return `
      ${pageHead('미디어 라이브러리', '홈페이지와 SEO에서 사용하는 이미지·영상 파일의 정보와 사용처를 관리합니다.')}
      <div class="compact-summary">
        <span><small>전체 파일</small><strong>${state.mediaAssets.length}</strong></span>
        <span><small>운영</small><strong>${state.mediaAssets.filter((item) => item.status === 'live').length}</strong></span>
        <span><small>검토 중</small><strong>${state.mediaAssets.filter((item) => item.status === 'draft').length}</strong></span>
        <span><small>대체텍스트 누락</small><strong>${missingAlt}</strong></span>
      </div>
      <div class="toolbar">
        <div class="filters">
          <div class="field grow"><label for="mediaSearch">미디어 검색</label><input id="mediaSearch" type="search" value="${escapeHtml(state.mediaSearch)}" placeholder="파일명, 대체텍스트 또는 사용처"></div>
          <div class="field"><label for="mediaCategory">분류</label><select id="mediaCategory">${categories.map((category) => `<option${category === state.mediaCategory ? ' selected' : ''}>${escapeHtml(category)}</option>`).join('')}</select></div>
          <div class="field"><label for="mediaStatus">상태</label><select id="mediaStatus"><option value="전체">전체</option><option value="live"${state.mediaStatus === 'live' ? ' selected' : ''}>운영</option><option value="draft"${state.mediaStatus === 'draft' ? ' selected' : ''}>검토 중</option><option value="off"${state.mediaStatus === 'off' ? ' selected' : ''}>비노출</option></select></div>
        </div>
        <div class="toolbar-actions">
          <button class="button button-secondary" data-action="reset-media-filter">🔄 초기화</button>
          <span class="toolbar-divider" aria-hidden="true"></span>
          <button class="button button-secondary" data-action="bulk-media-status" data-status="live"${state.mediaSelected.length ? '' : ' disabled'}>운영</button>
          <button class="button button-secondary" data-action="bulk-media-status" data-status="off"${state.mediaSelected.length ? '' : ' disabled'}>숨김</button>
          <button class="button button-danger" data-action="bulk-delete-media"${state.mediaSelected.length ? '' : ' disabled'}>선택 삭제</button>
          <span class="toolbar-divider" aria-hidden="true"></span>
          <button class="button button-primary" data-action="new-media">미디어 등록</button>
        </div>
      </div>
      <section class="panel"><div class="table-wrap"><table class="data-table media-table"><thead><tr><th class="col-check"><input type="checkbox" class="chk-all" data-media-all="true"${allChecked ? ' checked' : ''} aria-label="현재 페이지 전체 선택"></th><th>미리보기</th><th>분류</th><th>미디어 · 파일</th><th>사용처</th><th>대체텍스트</th><th>상태</th><th>수정일</th><th>관리</th></tr></thead><tbody>
        ${filtered.length ? paging.rows.map((item) => `<tr${state.mediaSelected.includes(item.id) ? ' data-selected="1"' : ''}><td class="col-check"><input type="checkbox" class="row-check" data-media-check="true" data-id="${escapeHtml(item.id)}"${state.mediaSelected.includes(item.id) ? ' checked' : ''}></td><td class="col-thumb"><span class="cell-thumb" aria-hidden="true">${escapeHtml(item.fileType)}</span></td><td><span class="cell-tag">${escapeHtml(item.category)}</span></td><td class="title-cell"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.fileName)} · ${escapeHtml(item.size)} · ${escapeHtml(item.dimensions)}</small></td><td>${escapeHtml(item.usage)}</td><td>${item.alt ? escapeHtml(item.alt) : '<span class="badge badge-danger">입력 필요</span>'}</td><td><button class="status-button" data-action="toggle-media" data-id="${item.id}">${statusBadge(item.status)}</button></td><td>${escapeHtml(item.updated)}</td><td class="actions-cell"><div class="table-row-actions"><button class="button button-small" data-action="edit-media" data-id="${item.id}">수정</button><button class="button button-small button-danger" data-action="delete-media" data-id="${item.id}">삭제</button></div></td></tr>`).join('') : '<tr><td colspan="9"><div class="empty-state"><strong>검색 결과가 없습니다.</strong><span>필터 조건을 변경해 주세요.</span></div></td></tr>'}
      </tbody></table></div>${tableFooter(`표시 ${filtered.length}개 / 전체 ${state.mediaAssets.length}개${state.mediaSelected.length ? ` · 선택 <b>${state.mediaSelected.length}</b>건` : ''}`, 'media-library', paging)}</section>
    `
  }

  function renderSeoManager() {
    const allPages = getPages()
    const rows = allPages.map((page, index) => ({ page, seo: getSeoData(page, index) }))
    const filtered = rows.filter(({ page, seo }) => {
      const query = state.seoSearch.trim().toLowerCase()
      const matchesSearch = !query || `${page.title} ${page.path} ${seo.title}`.toLowerCase().includes(query)
      const matchesStatus = state.seoStatus === '전체' || (state.seoStatus === '완료' ? seo.complete : !seo.complete)
      return matchesSearch && matchesStatus
    })
    const completeCount = rows.filter(({ seo }) => seo.complete).length
    const missingDescription = rows.filter(({ seo }) => seo.description.length < 80).length
    const missingCanonical = rows.filter(({ seo }) => !seo.canonical).length
    const missingOg = rows.filter(({ seo }) => !seo.ogImage).length
    const paging = paginateRows('seo', filtered)
    const currentPageIds = paging.rows.map(({ page }) => page.id)
    const allChecked = currentPageIds.length > 0 && currentPageIds.every((id) => state.seoSelected.includes(id))
    return `
      ${pageHead('SEO · 메타태그', '페이지별 검색 제목, 설명, canonical과 소셜 공유 정보를 관리합니다.')}
      <div class="compact-summary">
        <span><small>완료</small><strong>${completeCount}/${rows.length}</strong></span>
        <span><small>설명 보완</small><strong>${missingDescription}</strong></span>
        <span><small>Canonical 누락</small><strong>${missingCanonical}</strong></span>
        <span><small>OG 이미지 누락</small><strong>${missingOg}</strong></span>
      </div>
      <div class="toolbar"><div class="filters"><div class="field grow"><label for="seoSearch">페이지 검색</label><input id="seoSearch" type="search" value="${escapeHtml(state.seoSearch)}" placeholder="페이지명 또는 경로"></div><div class="field"><label for="seoStatus">메타 상태</label><select id="seoStatus"><option${state.seoStatus === '전체' ? ' selected' : ''}>전체</option><option${state.seoStatus === '완료' ? ' selected' : ''}>완료</option><option${state.seoStatus === '보완 필요' ? ' selected' : ''}>보완 필요</option></select></div></div><div class="toolbar-actions">
        <button class="button button-secondary" data-action="reset-seo-filter">🔄 초기화</button>
        <span class="toolbar-divider" aria-hidden="true"></span>
        <button class="button button-secondary" data-action="bulk-seo-selected"${state.seoSelected.length ? '' : ' disabled'}>선택 항목 보완</button>
        <button class="button button-secondary" data-action="reset-seo-selected"${state.seoSelected.length ? '' : ' disabled'}>선택 초기화</button>
        <span class="toolbar-divider" aria-hidden="true"></span>
        <button class="button button-primary" data-action="bulk-seo">누락값 일괄 보완</button>
      </div></div>
      <section class="panel"><div class="table-wrap"><table class="data-table seo-table"><thead><tr><th class="col-check"><input type="checkbox" class="chk-all" data-seo-all="true"${allChecked ? ' checked' : ''} aria-label="현재 페이지 전체 선택"></th><th>도메인</th><th>페이지 · 경로</th><th>검색 제목</th><th>설명</th><th>Canonical</th><th>OG 이미지</th><th>상태</th><th>관리</th></tr></thead><tbody>
        ${filtered.length ? paging.rows.map(({ page, seo }) => `<tr class="seo-row"${state.seoSelected.includes(page.id) ? ' data-selected="1"' : ''}><td class="col-check"><input type="checkbox" class="row-check" data-seo-check="true" data-id="${escapeHtml(page.id)}"${state.seoSelected.includes(page.id) ? ' checked' : ''}></td><td>${escapeHtml(page.domain)}</td><td class="title-cell"><strong>${escapeHtml(page.title)}</strong><code>${escapeHtml(page.path)}</code></td><td><span class="seo-copy">${escapeHtml(seo.title)}</span><small>${seo.title.length}/60자</small></td><td>${seo.description.length < 80 ? '<span class="badge badge-draft">보완 필요</span>' : `<span>${seo.description.length}/160자</span>`}</td><td>${seo.canonical ? '<span class="badge badge-live">설정</span>' : '<span class="badge badge-draft">누락</span>'}</td><td>${seo.ogImage ? '<span class="badge badge-live">설정</span>' : '<span class="badge badge-draft">누락</span>'}</td><td>${seo.complete ? statusBadge('live') : statusBadge('draft')}</td><td class="actions-cell"><button class="button button-small" data-action="edit-seo" data-id="${page.id}">편집</button><button class="button button-small" data-action="reset-seo" data-id="${page.id}">초기화</button></td></tr>`).join('') : '<tr><td colspan="9"><div class="empty-state"><strong>검색 결과가 없습니다.</strong><span>필터 조건을 변경해 주세요.</span></div></td></tr>'}
      </tbody></table></div>${tableFooter(`표시 ${filtered.length}개 / 전체 ${rows.length}개${state.seoSelected.length ? ` · 선택 <b>${state.seoSelected.length}</b>건` : ''}`, 'seo', paging)}</section>
    `
  }

  function renderLanguageManager() {
    syncMenuVisibility()
    const packs = state.languagePacks
    const entries = languageMenuEntries()
    const search = state.languageMenuSearch.trim().toLowerCase()
    const filtered = entries.filter((entry) => !search || `${entry.name} ${entry.path} ${entry.domain}`.toLowerCase().includes(search))
    const paging = paginateRows('language-matrix', filtered)
    return `
      ${pageHead('언어별 메뉴 · 번역', '언어팩별 메뉴 노출과 번역 운영 상태를 중앙에서 관리합니다.')}
      <div class="compact-summary"><span><small>언어팩</small><strong>${packs.length}</strong></span><span><small>사용 중</small><strong>${packs.filter((pack) => pack.enabled).length}</strong></span><span><small>메뉴 항목</small><strong>${entries.length}</strong></span><span><small>기본 언어</small><strong>${escapeHtml(packs.find((pack) => pack.base)?.displayCode || 'KOR')}</strong></span></div>
      <div class="tabs language-tabs" role="tablist" aria-label="다국어 관리 탭"><button class="tab-button${state.languageTab === 'matrix' ? ' is-active' : ''}" type="button" data-action="set-language-tab" data-tab="matrix">언어별 메뉴 노출</button><button class="tab-button${state.languageTab === 'packs' ? ' is-active' : ''}" type="button" data-action="set-language-tab" data-tab="packs">언어팩 관리</button></div>
      ${state.languageTab === 'matrix' ? renderLanguageMatrix(packs, filtered, paging) : renderLanguagePacks(packs, entries)}
    `
  }

  function renderModuleList(view) {
    const config = MODULE_CONFIG[view]
    const rows = getModuleRows(view)
    if (!config) return `<div class="empty-state"><strong>관리 구성을 찾을 수 없습니다.</strong>메뉴 데이터 연결을 확인해 주세요.</div>`
    const isReadOnly = ['audit-log', 'members', 'consultations', 'bookings'].includes(view)
    const actions = isReadOnly ? '' : `<button class="button button-primary" data-action="new-module-row" data-module="${view}">신규 등록</button>`
    const pagingKey = `module-${view}`
    const paging = paginateRows(pagingKey, rows)
    return `
      ${pageHead(config.title, config.description, actions)}
      <div class="toolbar"><div class="filters"><div class="field grow"><label for="moduleSearch">검색</label><input id="moduleSearch" type="search" placeholder="제목, 이름 또는 접수번호"></div><div class="field"><label for="moduleStatus">상태</label><select id="moduleStatus"><option>전체</option><option>운영·정상</option><option>검토·대기</option><option>연결·추가 필요</option><option>종료·탈퇴</option></select></div></div><button class="button button-secondary" data-action="export-list">목록 내보내기</button></div>
      <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr>${config.headers.map((head) => `<th>${head}</th>`).join('')}<th>관리</th></tr></thead><tbody id="moduleRows">
        ${paging.rows.map((row, index) => moduleRow(view, row, paging.offset + index)).join('')}
      </tbody></table></div>${tableFooter(`표시 ${rows.length}건 · 리빌드 관리 기준`, pagingKey, paging)}</section>
    `
  }

  function renderCollectionView(view) {
    const keys = (COLLECTION_VIEWS[view] || []).filter((key) => COLLECTIONS[key])
    if (!keys.length) return renderModuleList(view)
    const key = activeCollectionKey(view)
    const def = COLLECTIONS[key]
    const meta = VIEW_META[view] || ['비앤빛안과', def.title]
    const head = pageHead(meta[1], def.description)
    const tabs = keys.length > 1
      ? `<div class="collection-tabs" role="tablist">${keys.map((collectionKey) => {
          const tabDef = COLLECTIONS[collectionKey]
          const count = state.collections[collectionKey].length
          return `<button class="collection-tab${collectionKey === key ? ' is-active' : ''}" type="button" role="tab" data-collection-tab="${view}" data-collection-key="${collectionKey}"><span>${escapeHtml(tabDef.tab || tabDef.title)}</span><span class="collection-tab-count">${count}</span>${tabDef.legacy ? `<span class="collection-tab-scr">${escapeHtml(tabDef.legacy)}</span>` : ''}</button>`
        }).join('')}</div>`
      : ''
    return `${head}${tabs}${renderCollection(key)}`
  }

  function renderAnalytics() {
    const filters = state.statsFilters
    return `
      ${pageHead('통계', 'SCR-19·20의 접속 및 예약 통계를 리빌드 도메인 기준으로 재구성한 예시입니다.', '<button class="button button-secondary" data-action="export-stats">보고서 내보내기</button>')}
      <div class="toolbar"><div class="filters"><div class="field"><label>시작일</label><input id="statsStart" type="date" value="${escapeHtml(filters.start)}"></div><div class="field"><label>종료일</label><input id="statsEnd" type="date" value="${escapeHtml(filters.end)}"></div><div class="field"><label>집계 기준</label><select id="statsType">${['일별', '요일별', '시간별', '메뉴별'].map((option) => `<option${filters.type === option ? ' selected' : ''}>${option}</option>`).join('')}</select></div></div><button class="button button-primary" data-action="refresh-stats">조회</button></div>
      <section class="metrics-grid">
        ${metricCard('방문자', '48,216', '선택 기간 합계', '+12.4%', 'up')}
        ${metricCard('상담 전환', '1,084', '방문 대비 2.25%', '+0.3%p', 'up')}
        ${metricCard('검사 예약', '392', '상담 대비 36.2%', '목표 95%', 'warn')}
        ${metricCard('제휴 예약', '41', '제휴 신청 포함', '+8건', 'up')}
      </section>
      <div class="dashboard-grid">
        <section class="panel"><header class="panel-header"><div><h3>${escapeHtml(filters.type)} 유입 · 전환</h3><p>${escapeHtml(filters.start)} ~ ${escapeHtml(filters.end)}</p></div></header><div class="panel-body"><div style="height:260px;display:flex;align-items:flex-end;gap:9px;border-bottom:1px solid var(--line);padding:0 8px">${[58,72,64,83,77,91,68,88,74,96].map((height, index) => `<div title="집계 ${index + 1}" style="flex:1;height:${height}%;background:${index === 9 ? '#165dca' : '#9dbce8'};border-radius:4px 4px 0 0;min-width:14px"></div>`).join('')}</div></div></section>
        <section class="panel"><header class="panel-header"><div><h3>예약 유입 페이지</h3><p>상위 5개 경로</p></div></header><div class="panel-body"><ul class="check-list"><li><span>1</span><span>/vision-correction/smilepro</span><b>28%</b></li><li><span>2</span><span>/</span><b>24%</b></li><li><span>3</span><span>/bnviit/ai</span><b>18%</b></li><li><span>4</span><span>/vision-correction/icl</span><b>17%</b></li><li><span>5</span><span>/specialty</span><b>13%</b></li></ul></div></section>
      </div>
    `
  }

  function renderSettings() {
    const settings = state.settings
    return `
      ${pageHead('홈페이지 설정', '홈페이지 공통 연락처, 예약 운영, 외부 서비스와 관리자 권한 기준을 관리합니다.', '<button class="button button-primary" data-action="save-settings">설정 저장</button>')}
      <section class="panel"><header class="panel-header"><div><h3>기본 운영 정보</h3><p>SCR-21 홈페이지 설정 기능 활용</p></div></header><div class="panel-body"><div class="form-grid">
        <div class="form-field"><label for="settingPhone">대표 상담전화</label><input id="settingPhone" value="${escapeHtml(settings.phone)}"></div>
        <div class="form-field"><label for="settingTime">대표 운영시간</label><input id="settingTime" value="${escapeHtml(settings.hours)}"></div>
        <div class="form-field"><label for="settingLunch">점심시간</label><input id="settingLunch" value="${escapeHtml(settings.lunch)}"></div>
        <div class="form-field"><label for="settingAddress">주소</label><input id="settingAddress" value="${escapeHtml(settings.address)}"></div>
        <h3 class="form-section-title">예약 · 외부 연동</h3>
        <div class="form-field"><label for="settingSlot">예약 슬롯 단위</label><select id="settingSlot">${['30분', '20분', '60분'].map((option) => `<option${settings.slot === option ? ' selected' : ''}>${option}</option>`).join('')}</select></div>
        <div class="form-field"><label for="settingLimit">일일 온라인 예약 상한</label><input id="settingLimit" type="number" value="${escapeHtml(settings.limit)}"></div>
        <div class="form-field full"><label for="settingAi">AI 검사 외부 URL</label><input id="settingAi" value="${escapeHtml(settings.aiUrl)}"></div>
        <div class="form-field full"><label for="settingApp">사후케어 앱 안내</label><textarea id="settingApp">${escapeHtml(settings.appNote)}</textarea></div>
      </div></div></section>
    `
  }

  function renderMigration() {
    const rows = [
      ['홈 키비주얼 · 배너', '부분 재사용', ['SCR-03', 'SCR-34', 'SCR-35'], '배너 데이터 통합 + 홈 섹션 신규 CMS'],
      ['홈 기록 숫자', '신규 필요', [], '집계 기준, 출처, 기준일 필드 필수'],
      ['메뉴 · 다국어 노출', '재사용 가능', ['SCR-22', 'SCR-49'], '리빌드 routes.js와 단일 메뉴 모델로 이관'],
      ['의료진', '재사용 가능', ['SCR-04', 'SCR-05'], '프로필·전문분야·노출순서 통합'],
      ['뉴스 · ON AIR', '재사용 가능', ['SCR-08', 'SCR-11', 'SCR-13'], '게시판/미디어 유형으로 통합'],
      ['수상 · 연구 · 논문', '재사용 가능', ['SCR-06', 'SCR-07'], '다국어 필드 추가'],
      ['고객 후기', '재사용 가능', ['SCR-14', 'SCR-15', 'SCR-16'], '등록·승인·홈/서브 노출 통합'],
      ['시력교정 · 전문분야 본문', '신규 필요', [], '구성형 페이지 콘텐츠 CMS 필요'],
      ['이벤트', '재사용 가능', ['SCR-12', 'SCR-38', 'SCR-40', 'SCR-41', 'SCR-42'], '게시·배너·상담 전환 연결'],
      ['상담', '재사용 가능', ['SCR-02', 'SCR-36', 'SCR-37'], '채널 통합 접수함'],
      ['온라인 · 제휴 예약', '재사용 가능', ['SCR-18', 'SCR-39', 'SCR-45', 'SCR-46'], '예약 유형 파라미터화'],
      ['회원 · 마이페이지', '부분 재사용', ['SCR-01', 'SCR-43', 'SCR-44'], '회원 조회 + 예약/후기/문의 통합'],
      ['SEO · 메타태그', '신규 필수', [], 'title, description, OG, canonical, lang'],
      ['통계', '재사용 가능', ['SCR-19', 'SCR-20'], '리빌드 도메인별 유입·전환 지표 추가'],
      ['환경 · 권한', '재사용 가능', ['SCR-21', 'SCR-23', 'SCR-24', 'SCR-25', 'SCR-50'], '역할 기반 권한과 감사로그 보강'],
    ]
    const paging = paginateRows('migration', rows)
    return `
      ${pageHead('SCR 활용 점검', '레거시 관리자 기능을 리빌드 홈페이지에 그대로 쓸 수 있는지 기능 단위로 판단한 표입니다.', '<a class="button button-secondary" href="../기획서/rebuild/bnviit-renewal-tabs-ia.html" target="_blank" rel="noreferrer">리뉴얼 IA 열기</a>')}
      <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>리뉴얼 관리 기능</th><th>판정</th><th>활용 SCR</th><th>리빌드 관리자 반영 방향</th></tr></thead><tbody>
        ${paging.rows.map(([name, result, scr, direction]) => `<tr><td class="title-cell">${name}</td><td>${result.includes('신규') ? statusBadge('new').replace('신규 필요', result) : result.includes('부분') ? '<span class="badge badge-draft">부분 재사용</span>' : '<span class="badge badge-live">재사용 가능</span>'}</td><td>${scrBadges(scr, result.includes('부분'))}</td><td>${direction}</td></tr>`).join('')}
      </tbody></table></div>${tableFooter('기준: bnviit-renewal-tabs-ia.html + 리빌드 실제 라우트', 'migration', paging)}</section>
    `
  }

  Object.assign(window.BNVIIT_ADMIN, { renderDashboard, renderCoverage, renderHomeManager, renderCommonLayoutManager, renderFloatingActionsManager, renderPageMenuWorkspace, renderMediaManager, renderSeoManager, renderLanguageManager, renderModuleList, renderCollectionView, renderAnalytics, renderSettings, renderMigration })
})()
