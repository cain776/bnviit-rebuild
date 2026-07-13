;(function () {
  'use strict'
  const {
    COLLECTIONS, HOME_SECTIONS, COUNTRY_OPTIONS, FLOATING_CHANNEL_PRESETS, state, content, editorDialog, editorBody, editorTitle, editorEyebrow,
    persist, getPages, isLockedMenuDomain, getModuleRows, countryFlagUrl, today, escapeHtml, selectOptions, toast,
    getSeoData, render, collectionFilterActive,
  } = window.BNVIIT_ADMIN

  function openMenuEditor(mode, domainIndex = 'new', childIndex = 'new') {
    const isDomain = mode === 'menu-domain'
    if (domainIndex !== 'new' && isLockedMenuDomain(state.menuDomains[Number(domainIndex)])) {
      toast('홈 대메뉴는 시스템 고정 항목이라 수정할 수 없습니다.')
      return
    }
    const item = isDomain
      ? (domainIndex === 'new' ? { name: '', path: '/', status: 'draft' } : state.menuDomains[Number(domainIndex)])
      : (childIndex === 'new' ? { title: '', path: '/', status: 'draft' } : state.menuDomains[Number(domainIndex)].children[Number(childIndex)])
    state.currentEditor = { mode, domainIndex, childIndex }
    editorEyebrow.textContent = `홈페이지 공통 · ${isDomain ? '상위 도메인' : state.menuDomains[Number(domainIndex)].name}`
    editorTitle.textContent = (isDomain ? item.name : item.title) || (isDomain ? '도메인 추가' : '하위 메뉴 추가')
    editorBody.innerHTML = `<div class="form-grid">
      <div class="form-field full"><label for="menuNameEdit">${isDomain ? '도메인명' : '메뉴명'}</label><input id="menuNameEdit" name="name" required value="${escapeHtml(isDomain ? item.name : item.title)}"></div>
      <div class="form-field full"><label for="menuPathEdit">연결 경로</label><input id="menuPathEdit" name="path" required value="${escapeHtml(item.path)}" placeholder="/bnviit 또는 https://..."></div>
      <div class="form-field"><label for="menuStatusEdit">노출 상태</label><select id="menuStatusEdit" name="status">${selectOptions([['live', '운영'], ['draft', '검토 중'], ['off', '비노출']], item.status || 'live')}</select></div>
      <div class="form-field"><label for="menuTargetEdit">링크 방식</label><select id="menuTargetEdit" name="target">${selectOptions([['_self', '현재 창'], ['_blank', '새 창']], item.target || '_self')}</select></div>
      <div class="form-field"><label for="menuBadgeEdit">배지</label><input id="menuBadgeEdit" name="badge" value="${escapeHtml(item.badge || '')}" placeholder="NEW"></div>
      <div class="form-field"><label for="menuAuthEdit">접근 대상</label><select id="menuAuthEdit" name="auth">${selectOptions([['all', '전체'], ['guest', '비회원'], ['member', '회원']], item.auth || 'all')}</select></div>
    </div>`
    editorDialog.showModal()
  }

  function openLanguagePackEditor(packId = 'new', source = 'languages') {
    const isNew = packId === 'new'
    const pack = isNew
      ? { countryCode: '', country: '', name: '', locale: '', displayCode: '', scope: '', enabled: false, base: false }
      : state.languagePacks.find((entry) => entry.id === packId)
    if (!pack) return
    const fromFloating = source === 'floating-actions'
    state.currentEditor = { mode: 'language-pack', id: packId, source }
    editorEyebrow.textContent = fromFloating ? '홈페이지 공통 · 국가별 플로팅 메뉴' : '시스템 관리 · 언어별 메뉴 노출 관리'
    editorTitle.textContent = isNew ? (fromFloating ? '국가·언어 추가' : '언어팩 추가') : `${pack.country || pack.name} · ${pack.name} 수정`
    editorBody.innerHTML = `<div class="form-grid">
      <div class="form-field full"><label id="languageCountryLabel">국가 · 국기</label>
        <div class="country-picker">
          <button class="country-picker-trigger" type="button" data-action="toggle-language-country-picker" aria-expanded="false" aria-labelledby="languageCountryLabel countryPickerText">
            <span class="country-picker-flag" id="countryPickerFlag">${pack.countryCode ? `<img src="${countryFlagUrl(pack.countryCode)}" alt="">` : '<span aria-hidden="true">◎</span>'}</span>
            <span id="countryPickerText">${escapeHtml(pack.country || '국가를 선택하세요')}</span><small id="countryPickerCode">${escapeHtml(String(pack.countryCode || '').toUpperCase())}</small><i aria-hidden="true"></i>
          </button>
          <div class="country-picker-menu" id="languageCountryMenu" role="listbox" aria-labelledby="languageCountryLabel" hidden>
            ${COUNTRY_OPTIONS.map((country) => `<button type="button" role="option" aria-selected="${country.code === pack.countryCode}" data-action="select-language-country" data-code="${escapeHtml(country.code)}" data-country="${escapeHtml(country.name)}"><img src="${countryFlagUrl(country.code)}" alt=""><span>${escapeHtml(country.name)}</span><small>${escapeHtml(country.code.toUpperCase())}</small></button>`).join('')}
          </div>
          <input id="languageCountryCodeEdit" name="languageCountryCode" type="hidden" value="${escapeHtml(pack.countryCode || '')}">
          <input id="languageCountryEdit" name="languageCountry" type="hidden" value="${escapeHtml(pack.country || '')}">
        </div>
        <small>국기와 현지어 국가명을 확인한 뒤 선택합니다.</small>
      </div>
      <div class="form-field"><label for="languageNameEdit">언어명</label><input id="languageNameEdit" name="languageName" required value="${escapeHtml(pack.name)}" placeholder="예: Español"><small>언어명도 현지어로 입력합니다.</small></div>
      <div class="form-field"><label for="languageLocaleEdit">Locale 코드</label><input id="languageLocaleEdit" name="languageLocale" required value="${escapeHtml(pack.locale)}" placeholder="예: es-ES"${pack.base ? ' readonly' : ''}><small>국제 표준 BCP 47 형식으로 입력합니다.</small></div>
      <div class="form-field"><label for="languageDisplayCodeEdit">표시 코드</label><input id="languageDisplayCodeEdit" name="languageDisplayCode" required maxlength="5" value="${escapeHtml(pack.displayCode)}" placeholder="예: ESP"></div>
      <div class="form-field"><label for="languageEnabledEdit">운영 상태</label><select id="languageEnabledEdit" name="languageEnabled"${pack.base ? ' disabled' : ''}>${selectOptions([['true', '사용'], ['false', '준비 중']], String(pack.base || pack.enabled))}</select>${pack.base ? '<input type="hidden" name="languageEnabled" value="true"><small>기준 언어는 항상 사용 상태입니다.</small>' : ''}</div>
      <div class="form-field full"><label for="languageScopeEdit">번역·운영 범위</label><textarea id="languageScopeEdit" name="languageScope" required placeholder="예: 전체 페이지, 예약·상담 우선">${escapeHtml(pack.scope)}</textarea></div>
    </div>`
    editorDialog.showModal()
  }

  function openFloatingChannelEditor() {
    const pack = state.languagePacks.find((entry) => entry.id === state.floatingLocale) || state.languagePacks[0]
    const initial = FLOATING_CHANNEL_PRESETS.find((preset) => preset.id === 'message') || FLOATING_CHANNEL_PRESETS[0]
    state.currentEditor = { mode: 'floating-channel', localeId: pack?.id || 'ko' }
    editorEyebrow.textContent = '홈페이지 공통 · 국가별 플로팅 메뉴'
    editorTitle.textContent = `${pack?.country || '대한민국'} 채널 추가`
    editorBody.innerHTML = `<div class="form-grid">
      <div class="form-field"><label for="floatingChannelTypeEdit">채널 유형</label><select id="floatingChannelTypeEdit" name="floatingChannelType">${selectOptions(FLOATING_CHANNEL_PRESETS.map((preset) => [preset.id, preset.label]), initial.id)}</select><small>예약·메신저·SNS 아이콘을 선택합니다.</small></div>
      <div class="form-field"><label for="floatingChannelLabelEdit">표시명</label><input id="floatingChannelLabelEdit" name="floatingChannelLabel" required maxlength="24" value="${escapeHtml(initial.label)}" placeholder="예: WhatsApp 상담"></div>
      <div class="form-field full"><label for="floatingChannelTargetEdit">연결 경로·URL</label><input id="floatingChannelTargetEdit" name="floatingChannelTarget" required placeholder="https://..., tel:..., reqexam"><small>홈페이지 내부 경로 또는 https://, tel:, mailto: 주소를 입력합니다.</small></div>
      <div class="form-field"><label for="floatingChannelColorEdit">버튼 색상</label><input id="floatingChannelColorEdit" name="floatingChannelColor" type="color" value="${escapeHtml(initial.color)}"></div>
      <div class="form-field"><label for="floatingChannelVisibleEdit">노출 상태</label><select id="floatingChannelVisibleEdit" name="floatingChannelVisible">${selectOptions([['true', '노출'], ['false', '숨김']], 'true')}</select></div>
    </div>`
    editorDialog.showModal()
  }

  function openCommonItemEditor(index = 'new') {
    const row = index === 'new' ? ['', '', '', '운영', []] : getModuleRows('common-layout')[Number(index)]
    state.currentEditor = { mode: 'common-item', index }
    editorEyebrow.textContent = '홈페이지 공통 · 공통 영역 관리'
    editorTitle.textContent = index === 'new' ? '구성요소 추가' : row[0]
    editorBody.innerHTML = `<div class="form-grid">
      <div class="form-field full"><label for="commonName">구성요소명</label><input id="commonName" name="name" required value="${escapeHtml(row[0])}"></div>
      <div class="form-field full"><label for="commonScope">적용 위치</label><input id="commonScope" name="scope" required value="${escapeHtml(row[1])}" placeholder="전체 페이지 상단"></div>
      <div class="form-field full"><label for="commonItems">관리 항목</label><textarea id="commonItems" name="items" required>${escapeHtml(row[2])}</textarea></div>
      <div class="form-field"><label for="commonStatus">운영 상태</label><select id="commonStatus" name="status">${selectOptions([['운영', '운영'], ['점검 필요', '점검 필요'], ['비노출', '비노출']], row[3])}</select></div>
      <div class="form-field"><label for="commonScr">기존 SCR</label><input id="commonScr" name="scr" value="${escapeHtml(Array.isArray(row[4]) ? row[4].join(', ') : row[4])}" placeholder="SCR-21, SCR-22"></div>
    </div>`
    editorDialog.showModal()
  }

  function openMediaEditor(mediaId = 'new') {
    const item = state.mediaAssets.find((entry) => entry.id === mediaId) || { name: '', category: '키비주얼', fileName: '', fileType: 'WebP', size: '', dimensions: '', alt: '', usage: '', url: '', status: 'draft' }
    state.currentEditor = { mode: 'media', id: mediaId }
    editorEyebrow.textContent = '홈페이지 공통 · 미디어 라이브러리'
    editorTitle.textContent = mediaId === 'new' ? '미디어 등록' : item.name
    editorBody.innerHTML = `<div class="form-grid">
      <div class="form-field full"><label for="mediaNameEdit">관리명</label><input id="mediaNameEdit" name="name" required value="${escapeHtml(item.name)}"></div>
      <div class="form-field"><label for="mediaCategoryEdit">분류</label><select id="mediaCategoryEdit" name="category">${selectOptions([['키비주얼', '키비주얼'], ['의료진', '의료진'], ['이벤트·배너', '이벤트·배너'], ['ON AIR', 'ON AIR'], ['SEO', 'SEO'], ['기타', '기타']], item.category)}</select></div>
      <div class="form-field"><label for="mediaStatusEdit">상태</label><select id="mediaStatusEdit" name="status">${selectOptions([['live', '운영'], ['draft', '검토 중'], ['off', '비노출']], item.status)}</select></div>
      <div class="form-field full"><label for="mediaUploadEdit">파일 선택</label><input id="mediaUploadEdit" name="upload" type="file" accept="image/*,video/*"></div>
      <div class="form-field"><label for="mediaFileNameEdit">파일명</label><input id="mediaFileNameEdit" name="fileName" required value="${escapeHtml(item.fileName)}"></div>
      <div class="form-field"><label for="mediaTypeEdit">파일 형식</label><input id="mediaTypeEdit" name="fileType" value="${escapeHtml(item.fileType)}" placeholder="WebP"></div>
      <div class="form-field"><label for="mediaSizeEdit">파일 크기</label><input id="mediaSizeEdit" name="size" value="${escapeHtml(item.size)}" placeholder="428 KB"></div>
      <div class="form-field"><label for="mediaDimensionsEdit">해상도</label><input id="mediaDimensionsEdit" name="dimensions" value="${escapeHtml(item.dimensions)}" placeholder="1600×640"></div>
      <div class="form-field full"><label for="mediaUrlEdit">파일 URL</label><input id="mediaUrlEdit" name="url" value="${escapeHtml(item.url)}" placeholder="/assets/media/image.webp"></div>
      <div class="form-field full"><label for="mediaAltEdit">대체텍스트</label><input id="mediaAltEdit" name="alt" value="${escapeHtml(item.alt)}"></div>
      <div class="form-field full"><label for="mediaUsageEdit">사용처</label><input id="mediaUsageEdit" name="usage" value="${escapeHtml(item.usage)}" placeholder="홈 키비주얼 · 이벤트"></div>
    </div>`
    editorDialog.showModal()
  }

  function openPageEditor(pageId, mode = 'page') {
    const page = getPages().find((item) => item.id === pageId) || { id: 'new', domain: '신규', title: '', path: '/', type: '정적 콘텐츠', workflow: 'draft', visible: false, menuVisible: false, scr: [], updated: '2026-07-10' }
    state.currentEditor = { mode, id: page.id }
    editorEyebrow.textContent = mode === 'seo' ? 'SEO · 메타태그' : '페이지 콘텐츠'
    editorTitle.textContent = page.id === 'new' ? '신규 페이지 등록' : page.title
    editorBody.innerHTML = mode === 'seo' ? seoEditorFields(page) : pageEditorFields(page)
    editorDialog.showModal()
  }

  function pageEditorFields(page) {
    return `<div class="form-grid">
      <div class="form-field"><label for="editDomain">도메인</label><input id="editDomain" name="domain" value="${escapeHtml(page.domain)}"></div>
      <div class="form-field"><label for="editType">페이지 유형</label><select id="editType" name="type">${['정적 콘텐츠', '운영 콘텐츠', '게시판', '미디어', '업무 기능', '인증 기능', '통합 콘텐츠', '외부 연계'].map((type) => `<option${type === page.type ? ' selected' : ''}>${type}</option>`).join('')}</select></div>
      <div class="form-field"><label for="editPageKey">페이지 키</label><input id="editPageKey" value="${escapeHtml(page.id)}" readonly></div>
      <div class="form-field"><label for="editTemplate">화면 템플릿</label><select id="editTemplate" name="template">${selectOptions([['content', '일반 콘텐츠'], ['listing', '목록·게시판'], ['form', '신청·예약'], ['account', '회원·마이페이지'], ['landing', '허브·랜딩']], page.template || 'content')}</select></div>
      <div class="form-field"><label for="editTitle">페이지명</label><input id="editTitle" name="title" required value="${escapeHtml(page.title)}"></div>
      <div class="form-field"><label for="editPath">리빌드 경로</label><input id="editPath" name="path" required value="${escapeHtml(page.path)}"><small>routes.js의 경로와 일치해야 합니다.</small></div>
      <div class="form-field"><label for="editWorkflow">콘텐츠 상태</label><select id="editWorkflow" name="workflow">${selectOptions([['approved', '승인'], ['review', '검토 중'], ['draft', '초안']], page.workflow)}</select></div>
      <div class="form-field"><label for="editVisible">홈페이지 노출</label><select id="editVisible" name="visible">${selectOptions([['true', '노출'], ['false', '숨김']], String(page.visible))}</select></div>
      <div class="form-field"><label for="editMenuVisible">메뉴 노출</label><select id="editMenuVisible" name="menuVisible">${selectOptions([['true', '노출'], ['false', '숨김']], String(page.menuVisible !== false))}</select></div>
      <div class="form-field"><label for="editScr">기존 SCR</label><input id="editScr" name="scr" value="${escapeHtml(page.scr.join(', '))}" placeholder="SCR-04, SCR-05"></div>
      <div class="form-field"><label for="editPublishStart">게시 시작</label><input id="editPublishStart" name="publishStart" type="datetime-local" value="${escapeHtml(page.publishStart || '')}"></div>
      <div class="form-field"><label for="editPublishEnd">게시 종료</label><input id="editPublishEnd" name="publishEnd" type="datetime-local" value="${escapeHtml(page.publishEnd || '')}"></div>
      <h3 class="form-section-title">대표 콘텐츠</h3>
      <div class="form-field full"><label for="editHeading">페이지 제목</label><input id="editHeading" name="heading" value="${escapeHtml(page.heading || page.title)}"></div>
      <div class="form-field full"><label for="editDescription">소개 문구</label><textarea id="editDescription" name="description">${escapeHtml(page.description || `${page.title} 페이지의 대표 소개 문구입니다.`)}</textarea></div>
    </div>`
  }

  function seoEditorFields(page) {
    const seo = getSeoData(page, getPages().findIndex((item) => item.id === page.id))
    return `<div class="form-grid">
      <div class="form-field full"><label>대상 경로</label><input value="${escapeHtml(page.path)}" readonly></div>
      <div class="form-field full"><label for="seoTitleEdit">Meta title</label><input id="seoTitleEdit" name="seoTitle" maxlength="60" required value="${escapeHtml(seo.title)}"><small><span id="seoTitleCount">${seo.title.length}</span>/60자</small></div>
      <div class="form-field full"><label for="seoDescriptionEdit">Meta description</label><textarea id="seoDescriptionEdit" name="seoDescription" maxlength="160" required>${escapeHtml(seo.description)}</textarea><small><span id="seoDescriptionCount">${seo.description.length}</span>/160자 · 권장 80자 이상</small></div>
      <div class="form-field full"><label for="seoCanonicalEdit">Canonical URL</label><input id="seoCanonicalEdit" name="canonical" value="${escapeHtml(seo.canonical)}"></div>
      <div class="form-field"><label for="seoOgType">OG type</label><select id="seoOgType" name="ogType">${['website', 'article'].map((option) => `<option${seo.ogType === option ? ' selected' : ''}>${option}</option>`).join('')}</select></div>
      <div class="form-field"><label for="seoIndex">검색 노출</label><select id="seoIndex" name="indexRule">${['index, follow', 'noindex, follow', 'noindex, nofollow'].map((option) => `<option${seo.indexRule === option ? ' selected' : ''}>${option}</option>`).join('')}</select></div>
      <h3 class="form-section-title">소셜 공유</h3>
      <div class="form-field full"><label for="seoOgTitle">OG title</label><input id="seoOgTitle" name="ogTitle" maxlength="60" value="${escapeHtml(seo.ogTitle)}"></div>
      <div class="form-field full"><label for="seoOgDescription">OG description</label><textarea id="seoOgDescription" name="ogDescription" maxlength="160">${escapeHtml(seo.ogDescription)}</textarea></div>
      <div class="form-field full"><label for="seoImage">OG 이미지</label><input id="seoImage" name="ogImage" value="${escapeHtml(seo.ogImage)}" placeholder="이미지 파일 선택 또는 URL"></div>
      <div class="form-field full"><div class="search-preview"><small>www.bnviit.com${escapeHtml(page.path)}</small><strong id="seoPreviewTitle">${escapeHtml(seo.title)}</strong><p id="seoPreviewDescription">${escapeHtml(seo.description)}</p></div></div>
    </div>`
  }

  function openHomeItemEditor(sectionId, itemId = 'new') {
    const items = state.homeContent[sectionId] || []
    const item = items.find((entry) => entry.id === itemId) || homeItemDefault(sectionId)
    const section = HOME_SECTIONS.find((entry) => entry.id === sectionId)
    if (!section) return
    state.currentEditor = { mode: 'home-item', sectionId, id: itemId }
    editorEyebrow.textContent = `홈 화면 관리 · ${section.name}`
    editorTitle.textContent = itemId === 'new' ? '새 항목 등록' : (item.title || item.eyebrow || section.name)
    editorBody.innerHTML = homeItemEditorFields(sectionId, item)
    editorDialog.showModal()
  }

  function homeItemDefault(sectionId) {
    if (sectionId === 'hero') return { eyebrow: '', title: '', description: '', mediaType: 'image', mediaUrl: '', primaryLabel: '', primaryRoute: '', secondaryLabel: '', secondaryRoute: '', theme: 'blue', startsAt: '', endsAt: '', visible: true }
    if (sectionId === 'quick') return { title: '', description: '', route: '', icon: 'link', tone: 'blue', visible: true }
    if (sectionId === 'ticker') return { kind: 'notice', label: '', title: '', actionLabel: '', route: '', tone: 'gray', startsAt: '', endsAt: '', visible: true }
    return { kind: 'link', title: '', description: '', route: '', tone: 'blue', phone: '', note: '', visible: true }
  }

  function homeItemEditorFields(sectionId, item) {
    const visibility = `<div class="form-field"><label for="homeItemVisible">노출 상태</label><select id="homeItemVisible" name="visible">${selectOptions([['true', '노출'], ['false', '숨김']], String(item.visible !== false))}</select></div>`
    if (sectionId === 'hero') {
      return `<div class="form-grid">
        <div class="form-field full"><label for="homeEyebrow">상단 라벨</label><input id="homeEyebrow" name="eyebrow" value="${escapeHtml(item.eyebrow)}"></div>
        <div class="form-field full"><label for="homeTitle">대표 문구</label><textarea id="homeTitle" name="title" required>${escapeHtml(item.title)}</textarea><small>줄바꿈이 필요한 위치에서 Enter를 사용합니다.</small></div>
        <div class="form-field full"><label for="homeDescription">설명</label><textarea id="homeDescription" name="description">${escapeHtml(item.description)}</textarea></div>
        <h3 class="form-section-title">미디어</h3>
        <div class="form-field"><label for="homeMediaType">미디어 유형</label><select id="homeMediaType" name="mediaType">${selectOptions([['color', '컬러 배경'], ['image', '이미지'], ['video', '영상']], item.mediaType)}</select></div>
        <div class="form-field"><label for="homeTheme">컬러 테마</label><select id="homeTheme" name="theme">${selectOptions([['blue', '블루'], ['dark', '다크'], ['orange', '오렌지'], ['neutral', '뉴트럴']], item.theme)}</select></div>
        <div class="form-field full"><label for="homeMediaUrl">이미지·영상 URL</label><input id="homeMediaUrl" name="mediaUrl" value="${escapeHtml(item.mediaUrl)}" placeholder="/assets/home/hero.jpg 또는 https://..."></div>
        <h3 class="form-section-title">연결 버튼</h3>
        <div class="form-field"><label for="homePrimaryLabel">주 버튼명</label><input id="homePrimaryLabel" name="primaryLabel" value="${escapeHtml(item.primaryLabel)}"></div>
        <div class="form-field"><label for="homePrimaryRoute">주 버튼 경로</label><input id="homePrimaryRoute" name="primaryRoute" value="${escapeHtml(item.primaryRoute)}"></div>
        <div class="form-field"><label for="homeSecondaryLabel">보조 버튼명</label><input id="homeSecondaryLabel" name="secondaryLabel" value="${escapeHtml(item.secondaryLabel)}"></div>
        <div class="form-field"><label for="homeSecondaryRoute">보조 버튼 경로</label><input id="homeSecondaryRoute" name="secondaryRoute" value="${escapeHtml(item.secondaryRoute)}"></div>
        <h3 class="form-section-title">노출 설정</h3>
        <div class="form-field"><label for="homeStartsAt">노출 시작</label><input id="homeStartsAt" name="startsAt" type="datetime-local" value="${escapeHtml(item.startsAt)}"></div>
        <div class="form-field"><label for="homeEndsAt">노출 종료</label><input id="homeEndsAt" name="endsAt" type="datetime-local" value="${escapeHtml(item.endsAt)}"></div>
        ${visibility}
      </div>`
    }
    if (sectionId === 'quick') {
      return `<div class="form-grid">
        <div class="form-field full"><label for="homeTitle">서비스명</label><input id="homeTitle" name="title" required value="${escapeHtml(item.title)}"></div>
        <div class="form-field full"><label for="homeDescription">설명</label><textarea id="homeDescription" name="description">${escapeHtml(item.description)}</textarea></div>
        <div class="form-field full"><label for="homeRoute">연결 경로</label><input id="homeRoute" name="route" value="${escapeHtml(item.route)}" placeholder="reqconsult 또는 https://..."></div>
        <div class="form-field"><label for="homeIcon">아이콘</label><select id="homeIcon" name="icon">${selectOptions([['chat', '상담'], ['calendar', '달력'], ['eye', '눈'], ['document', '문서'], ['link', '링크']], item.icon)}</select></div>
        <div class="form-field"><label for="homeTone">컬러</label><select id="homeTone" name="tone">${selectOptions([['blue', '블루'], ['teal', '그린'], ['orange', '오렌지'], ['purple', '퍼플']], item.tone)}</select></div>
        ${visibility}
      </div>`
    }
    if (sectionId === 'ticker') {
      return `<div class="form-grid">
        <div class="form-field"><label for="homeKind">배너 유형</label><select id="homeKind" name="kind">${selectOptions([['record', 'BNVIIT RECORD'], ['event', '이벤트'], ['notice', '공지']], item.kind)}</select></div>
        <div class="form-field"><label for="homeLabel">라벨</label><input id="homeLabel" name="label" value="${escapeHtml(item.label)}"></div>
        <div class="form-field full"><label for="homeTitle">노출 문구</label><textarea id="homeTitle" name="title" required>${escapeHtml(item.title)}</textarea></div>
        <div class="form-field"><label for="homeActionLabel">링크명</label><input id="homeActionLabel" name="actionLabel" value="${escapeHtml(item.actionLabel)}"></div>
        <div class="form-field"><label for="homeRoute">연결 경로</label><input id="homeRoute" name="route" value="${escapeHtml(item.route)}"></div>
        <div class="form-field"><label for="homeTone">컬러</label><select id="homeTone" name="tone">${selectOptions([['blue', '블루'], ['orange', '오렌지'], ['gray', '그레이']], item.tone)}</select></div>
        ${visibility}
        <div class="form-field"><label for="homeStartsAt">노출 시작</label><input id="homeStartsAt" name="startsAt" type="datetime-local" value="${escapeHtml(item.startsAt)}"></div>
        <div class="form-field"><label for="homeEndsAt">노출 종료</label><input id="homeEndsAt" name="endsAt" type="datetime-local" value="${escapeHtml(item.endsAt)}"></div>
      </div>`
    }
    return `<div class="form-grid">
      <div class="form-field"><label for="homeKind">카드 유형</label><select id="homeKind" name="kind">${selectOptions([['link', '페이지 링크'], ['contact', '상담 안내']], item.kind)}</select></div>
      ${visibility}
      <div class="form-field full"><label for="homeTitle">카드명</label><input id="homeTitle" name="title" required value="${escapeHtml(item.title)}"></div>
      <div class="form-field full"><label for="homeDescription">설명</label><textarea id="homeDescription" name="description">${escapeHtml(item.description)}</textarea></div>
      <div class="form-field"><label for="homeRoute">연결 경로</label><input id="homeRoute" name="route" value="${escapeHtml(item.route)}"></div>
      <div class="form-field"><label for="homeTone">컬러</label><select id="homeTone" name="tone">${selectOptions([['blue', '블루'], ['teal', '그린'], ['orange', '오렌지'], ['purple', '퍼플']], item.tone)}</select></div>
      <div class="form-field"><label for="homePhone">대표 전화</label><input id="homePhone" name="phone" value="${escapeHtml(item.phone)}"></div>
      <div class="form-field"><label for="homeNote">운영 안내</label><input id="homeNote" name="note" value="${escapeHtml(item.note)}"></div>
    </div>`
  }

  function openGenericEditor(title, eyebrow, values, context = { mode: 'generic', id: title }) {
    state.currentEditor = context
    editorEyebrow.textContent = eyebrow
    editorTitle.textContent = title
    editorBody.innerHTML = `<div class="form-grid">${values.map(([label, value], index) => `<div class="form-field${index === 0 ? ' full' : ''}"><label>${escapeHtml(label)}</label><input name="field-${index}" value="${escapeHtml(Array.isArray(value) ? value.join(', ') : value || '')}"></div>`).join('')}<div class="form-field full"><label>관리 메모</label><textarea name="memo" placeholder="처리 내용 또는 메모"></textarea></div></div>`
    editorDialog.showModal()
  }

  function openCollectionEditor(key, id) {
    const def = COLLECTIONS[key]
    const isNew = id === 'new'
    const row = isNew ? defaultCollectionRow(def) : (state.collections[key].find((entry) => entry.id === id) || defaultCollectionRow(def))
    state.currentEditor = { mode: 'collection', key, id }
    editorEyebrow.textContent = `${def.title}${def.legacy ? ` · ${def.legacy}` : ''}`
    editorTitle.textContent = isNew ? `${def.singular} 등록` : `${def.singular} 상세 · 수정`
    editorBody.innerHTML = `<div class="form-grid">${def.fields.map((field) => collectionField(field, row)).join('')}</div>`
    editorDialog.showModal()
  }

  function defaultCollectionRow(def) {
    const row = {}
    def.fields.forEach((field) => {
      row[field.key] = field.type === 'toggle' ? true : (field.type === 'number' || field.type === 'stars') ? (field.type === 'stars' ? 5 : 0) : ''
    })
    return row
  }

  function collectionField(field, row) {
    const value = row[field.key]
    const cls = `form-field${field.full ? ' full' : ''}`
    const label = `<label for="cf-${field.key}">${escapeHtml(field.label)}${field.code ? `<span class="field-code">${escapeHtml(field.code)}</span>` : ''}</label>`
    let control
    switch (field.type) {
      case 'textarea':
        control = `<textarea id="cf-${field.key}" name="${field.key}">${escapeHtml(value || '')}</textarea>`
        break
      case 'select':
        control = `<select id="cf-${field.key}" name="${field.key}">${field.options.map((option) => `<option${String(value) === String(option) ? ' selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select>`
        break
      case 'toggle':
        control = `<label class="form-toggle${value ? ' is-on' : ''}" data-on="${escapeHtml(field.on)}" data-off="${escapeHtml(field.off)}"><input type="checkbox" name="${field.key}"${value ? ' checked' : ''}><span class="form-toggle-track"><span class="form-toggle-thumb"></span></span><b>${escapeHtml(value ? field.on : field.off)}</b></label>`
        break
      case 'number':
        control = `<input id="cf-${field.key}" name="${field.key}" type="number" value="${escapeHtml(value ?? '')}">`
        break
      case 'stars':
        control = `<select id="cf-${field.key}" name="${field.key}">${[5, 4, 3, 2, 1].map((n) => `<option value="${n}"${Number(value) === n ? ' selected' : ''}>${'★'.repeat(n)}${'☆'.repeat(5 - n)}  ${n}.0</option>`).join('')}</select>`
        break
      case 'image':
        control = `<div class="image-field">${value
          ? `<img class="image-field-preview-img" src="${escapeHtml(value)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'image-field-preview',textContent:'IMG'}))">`
          : `<span class="image-field-preview" aria-hidden="true">IMG</span>`}<div class="image-field-copy"><button type="button" class="button button-small" data-action="noop-upload">이미지 선택</button><small>${value ? '서버 원본 매칭됨 · ' : '업로드 연동은 실제 구현 시 처리됩니다 · '}${field.code ? escapeHtml(field.code) : ''}</small></div></div>`
        break
      case 'readonly':
        control = `<div class="readonly-value">${escapeHtml(value || '-')}</div>`
        break
      default:
        control = `<input id="cf-${field.key}" name="${field.key}" value="${escapeHtml(value ?? '')}"${field.required ? ' required' : ''}>`
    }
    return `<div class="${cls}">${label}${control}</div>`
  }

  function saveCollectionEditor(formData) {
    const { key, id } = state.currentEditor
    const def = COLLECTIONS[key]
    const list = state.collections[key]
    const isNew = id === 'new'
    const existing = isNew ? {} : (list.find((row) => row.id === id) || {})
    const next = { ...existing }
    def.fields.forEach((field) => {
      if (field.type === 'readonly' || field.type === 'image') return
      if (field.type === 'toggle') next[field.key] = formData.get(field.key) === 'on'
      else if (field.type === 'number' || field.type === 'stars') next[field.key] = Number(formData.get(field.key)) || 0
      else next[field.key] = String(formData.get(field.key) ?? '')
    })
    if (collectionHasKey(def, 'upd')) next.upd = today()
    if (isNew) {
      next.id = `${key}-${Date.now()}`
      next.seq = list.length ? Math.max(...list.map((row) => Number(row.seq) || 0)) + 1 : 1
      ;['reg', 'date'].forEach((stampKey) => { if (collectionHasKey(def, stampKey)) next[stampKey] = next[stampKey] || today() })
      list.push(next)
    } else {
      state.collections[key] = list.map((row) => (row.id === id ? next : row))
    }
  }

  function collectionHasKey(def, key) {
    return def.columns.some((col) => col.key === key) || def.fields.some((field) => field.key === key)
  }

  function moveCollectionRow(key, id, direction) {
    if (collectionFilterActive(key)) { toast('검색·필터 적용 중에는 순서를 변경할 수 없습니다.'); return }
    const list = state.collections[key]
    const index = list.findIndex((row) => row.id === id)
    const target = direction === 'up' ? index - 1 : index + 1
    if (index < 0 || target < 0 || target >= list.length) return
    ;[list[index], list[target]] = [list[target], list[index]]
    list.forEach((row, idx) => { row.seq = idx + 1 })
    persist()
    render()
    toast('노출 순서를 변경했습니다.')
  }

  function bulkToggleCollection(key, value) {
    const selected = state.collectionSelected[key] || []
    if (!selected.length) return
    const def = COLLECTIONS[key]
    const field = def.columns.some((col) => col.key === 'use') ? 'use' : (def.columns.find((col) => col.type === 'toggle') || {}).key
    if (!field) return
    state.collections[key].forEach((row) => { if (selected.includes(row.id)) { row[field] = value; if (collectionHasKey(def, 'upd')) row.upd = today() } })
    persist()
    render()
    toast(`${selected.length}건을 ${value ? '노출' : '숨김'} 처리했습니다.`)
  }

  function bulkDeleteCollection(key) {
    const selected = state.collectionSelected[key] || []
    if (!selected.length) return
    const canDelete = typeof window.confirm !== 'function' || window.confirm(`선택한 ${selected.length}건을 삭제하시겠습니까?`)
    if (!canDelete) return
    state.collections[key] = state.collections[key].filter((row) => !selected.includes(row.id))
    state.collectionSelected[key] = []
    persist()
    render()
    toast('선택한 항목을 삭제했습니다.')
  }

  Object.assign(window.BNVIIT_ADMIN, { openMenuEditor, openLanguagePackEditor, openFloatingChannelEditor, openCommonItemEditor, openMediaEditor, openPageEditor, pageEditorFields, seoEditorFields, openHomeItemEditor, homeItemDefault, homeItemEditorFields, openGenericEditor, openCollectionEditor, defaultCollectionRow, collectionField, saveCollectionEditor, collectionHasKey, moveCollectionRow, bulkToggleCollection, bulkDeleteCollection })
})()
