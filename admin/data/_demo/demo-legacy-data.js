;(function () {
  'use strict'
  // 데모 폴백 데이터 — 전부 무작위 생성(시드 고정). 실데이터에서 유도·마스킹한 값이 아니다.
  // 활성 조건: ?demo=1 · file:// 열람 · API 서버 부재(fetch 실패/404 폴백).
  // 전화번호는 PII 스캔 오탐 방지를 위해 전 레코드 '010-0000-0000' 고정.

  const DEMO_PHONE = '010-0000-0000'
  const SURNAMES = ['홍', '김', '이', '박', '최', '정', '한', '오', '서', '문', '류', '임', '신', '장']
  const GIVEN = ['길동', '데모', '체험', '샘플', '미리', '가상', '시연', '예시', '검토', '안내', '소개', '연습']
  const OPERATIONS = ['스마일라식', '라섹', '렌즈삽입술', '스마일프로', '노안수술', '백내장수술']
  const BRANCHES = ['강남본원', '강남밝은세상안과']

  function mulberry32(seed) {
    let a = seed >>> 0
    return function () {
      a = (a + 0x6d2b79f5) >>> 0
      let t = a
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }
  const rand = mulberry32(20260712)
  const pick = (list) => list[Math.floor(rand() * list.length)]
  const fakeName = (index) => SURNAMES[index % SURNAMES.length] + GIVEN[Math.floor(rand() * GIVEN.length)]
  const fakeDate = () => {
    const year = 2019 + Math.floor(rand() * 8)
    const month = String(1 + Math.floor(rand() * 12)).padStart(2, '0')
    const day = String(1 + Math.floor(rand() * 28)).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const maskName = (name) => name.slice(0, 1) + '**'
  const maskPhone = () => '010-****-0000'
  const maskEmail = (email) => email.slice(0, 2) + '***@example.com'

  // ── 회원 28명 (탈퇴 4 · 유형 GENERAL/NAVER/KAKAO/GOOGLE) ──
  const MEMBER_TYPES = { GENERAL: '일반', NAVER: '네이버', KAKAO: '카카오', GOOGLE: '구글' }
  const memberTypeCodes = []
  for (let i = 0; i < 16; i++) memberTypeCodes.push('GENERAL')
  for (let i = 0; i < 5; i++) memberTypeCodes.push('NAVER')
  for (let i = 0; i < 5; i++) memberTypeCodes.push('KAKAO')
  for (let i = 0; i < 2; i++) memberTypeCodes.push('GOOGLE')
  const members = memberTypeCodes.map((typeCode, index) => {
    const name = fakeName(index)
    const hasPhone = rand() > 0.15
    const hasEmail = rand() > 0.25
    return {
      id: 9001 + index, name, typeCode,
      loginId: `demo_user${String(index + 1).padStart(2, '0')}`,
      email: hasEmail ? `demo${String(index + 1).padStart(2, '0')}@example.com` : '',
      phone: hasPhone ? DEMO_PHONE : '',
      registeredAt: `${fakeDate()} 10:${String(index % 60).padStart(2, '0')}:00`,
      hpVerified: hasPhone, crmLinked: rand() > 0.6, withdrawn: index >= 24,
    }
  })

  // ── 후기 12건 (BASIC 5 · STAR 3 · MEDICAL 2 · OVERSEA 1 · OTHER 1, 삭제 1) ──
  const REVIEW_TITLES = {
    BASIC: '수술 후 일주일, 시력이 선명해졌어요 (데모)', STAR: '방송에서 소개된 그 수술 받았습니다 (데모)',
    MEDICAL: '의료진이 자세히 설명해 주셨어요 (데모)', OVERSEA: '해외에서 방문했는데 만족합니다 (데모)', OTHER: '상담부터 검사까지 후기 (데모)',
  }
  const reviewTypeCodes = ['BASIC', 'BASIC', 'BASIC', 'BASIC', 'BASIC', 'STAR', 'STAR', 'STAR', 'MEDICAL', 'MEDICAL', 'OVERSEA', 'OTHER']
  const reviews = reviewTypeCodes.map((type, index) => {
    const name = fakeName(index + 3)
    return {
      id: 8101 + index, type, title: REVIEW_TITLES[type], name,
      operationName: pick(OPERATIONS), memberId: `90***`,
      registeredAt: `${fakeDate()} 14:0${index % 10}:00`,
      visible: index !== 4, deleted: index === 4, hitCount: Math.floor(rand() * 900),
    }
  })

  // ── 의료진 5명 (공개 3 · 비공개 1 · 삭제 1) ──
  const DOCTOR_POSITIONS = ['대표원장', '원장', '원장', '원장', '원장']
  const DOCTOR_GROUPS = ['시력교정', '노안·백내장', '각막', '시력교정', '망막']
  const doctors = DOCTOR_POSITIONS.map((position, index) => ({
    id: 501 + index, displaySequence: index, name: fakeName(index + 7) + ' (데모)',
    position, group: DOCTOR_GROUPS[index], urlName: `demo-doctor-${index + 1}`,
    main: index === 0, active: index < 3, deleted: index === 4,
    updatedAt: fakeDate(),
  }))

  // ── 상담 42건 (7개 유형 × 6건, 유형별 삭제 1) ──
  const CONSULT_CATEGORIES = [
    ['COUNSELPHONE', '전화상담'], ['COUNSELONLINE', '온라인 예약'], ['COUNSELEVENT', '이벤트 상담'],
    ['COUNSELKAKAO', '카카오 상담'], ['COUNSELNAVER', '네이버 유입'], ['COUNSELQNA', '고객 Q&A'], ['COUNSELPARTNER', '제휴문의'],
  ]
  const CONSULT_TITLES = {
    COUNSELPHONE: '수술 비용 전화 문의 (데모)', COUNSELONLINE: '검사 예약 신청합니다 (데모)', COUNSELEVENT: '이벤트 상담 신청 (데모)',
    COUNSELKAKAO: '카카오로 문의드려요 (데모)', COUNSELNAVER: '네이버 검색으로 방문 (데모)', COUNSELQNA: '수술 가능 여부 질문 (데모)', COUNSELPARTNER: '제휴 제안드립니다 (데모)',
  }
  const consultations = []
  CONSULT_CATEGORIES.forEach(([category, label]) => {
    for (let i = 0; i < 6; i++) {
      const index = consultations.length
      const name = fakeName(index)
      const isReserved = category === 'COUNSELONLINE' || rand() > 0.7
      consultations.push({
        id: 700001 + index, category, channel: label, name,
        regDate: `${fakeDate()} 0${i + 1}:30:00`,
        title: CONSULT_TITLES[category],
        reserveDate: isReserved ? fakeDate() : '', reserveTime: isReserved ? `${10 + i}:00` : '',
        memberLinked: rand() > 0.5, callStatus: rand() > 0.4, confirmStatus: rand() > 0.5,
        reserveStatus: isReserved, hasCrm: rand() > 0.6, deleted: i === 5,
        email: `demo${String(index + 1).padStart(2, '0')}@example.com`,
        branchName: pick(BRANCHES), operationName: pick(OPERATIONS),
      })
    }
  })

  // ── 응답 조립 ──
  const paginate = (rows, params) => {
    const page = Math.max(Number(params.get('page')) || 1, 1)
    const pageSize = Number(params.get('pageSize')) || 20
    const totalPages = Math.max(Math.ceil(rows.length / pageSize), 1)
    const current = Math.min(page, totalPages)
    return { total: rows.length, totalPages, page: current, pageSize, rows: rows.slice((current - 1) * pageSize, current * pageSize) }
  }
  const matchQ = (params, ...fields) => {
    const q = String(params.get('q') || '').trim().toLowerCase()
    return !q || fields.some((field) => String(field ?? '').toLowerCase().includes(q))
  }

  const meta = () => ({
    source: { backupDate: '데모 데이터(무작위 생성)' },
    members: { total: members.length, active: members.filter((m) => !m.withdrawn).length, withdrawn: members.filter((m) => m.withdrawn).length },
    reviews: { total: reviews.length, types: ['BASIC', 'STAR', 'MEDICAL', 'OVERSEA', 'OTHER'].map((type) => ({ type, total: reviews.filter((r) => r.type === type).length })) },
    doctors: { total: doctors.length, active: doctors.filter((d) => d.active && !d.deleted).length, inactive: doctors.filter((d) => !d.active && !d.deleted).length, deleted: doctors.filter((d) => d.deleted).length },
  })

  const memberList = (params) => {
    const status = params.get('status') || 'active'
    const type = params.get('type') || 'all'
    const rows = members
      .filter((m) => status === 'all' || (status === 'withdrawn' ? m.withdrawn : !m.withdrawn))
      .filter((m) => type === 'all' || m.typeCode === type)
      .filter((m) => matchQ(params, m.name, m.loginId, m.email, m.id))
      .map((m) => ({ id: m.id, registeredAt: m.registeredAt, name: maskName(m.name), loginId: m.loginId.slice(0, 4) + '***', type: MEMBER_TYPES[m.typeCode], phone: m.phone ? maskPhone() : '-', email: m.email ? maskEmail(m.email) : '-', hpVerified: m.hpVerified, crmLinked: m.crmLinked, withdrawn: m.withdrawn }))
    return paginate(rows, params)
  }

  const reviewList = (params) => {
    const status = params.get('status') || 'active'
    const type = params.get('type') || 'ALL'
    const rows = reviews
      .filter((r) => type === 'ALL' || r.type === type)
      .filter((r) => status === 'all' || (status === 'deleted' ? r.deleted : !r.deleted))
      .filter((r) => matchQ(params, r.title, r.name, r.operationName, r.id))
      .map((r) => ({ ...r, name: maskName(r.name) }))
    return paginate(rows, params)
  }

  const doctorList = (params) => {
    const status = params.get('status') || 'active'
    const rows = doctors
      .filter((d) => status === 'all' || (status === 'deleted' ? d.deleted : status === 'inactive' ? !d.active && !d.deleted : d.active && !d.deleted))
      .filter((d) => matchQ(params, d.name, d.position, d.group, d.id))
    return paginate(rows, params)
  }

  const entityDetail = (view, id) => {
    const numericId = Number(id)
    if (view === 'members') {
      const m = members.find((row) => row.id === numericId)
      if (!m) return { payload: {} }
      return { payload: { '데이터 출처': '데모 무작위 생성 (실데이터 아님)', '회원번호': m.id, '아이디': m.loginId, '이름': m.name, '가입유형': MEMBER_TYPES[m.typeCode], '휴대폰': m.phone || '-', '이메일': m.email || '-', '가입일': m.registeredAt, '인증': m.hpVerified ? '휴대폰 인증' : '미인증', 'CRM 연결': m.crmLinked ? '연결' : '-', '상태': m.withdrawn ? '탈퇴' : '정상' } }
    }
    if (view === 'reviews') {
      const r = reviews.find((row) => row.id === numericId)
      if (!r) return { payload: {} }
      return { payload: { '데이터 출처': '데모 무작위 생성 (실데이터 아님)', '후기번호': r.id, '유형': r.type, '제목': r.title, '작성자': r.name, '수술명': r.operationName, '내용': '데모 본문입니다. 실제 후기 내용이 아닌 무작위 생성 텍스트입니다.', '등록일': r.registeredAt, '노출': r.visible ? '노출' : '숨김', '조회수': r.hitCount } }
    }
    const d = doctors.find((row) => row.id === numericId)
    if (!d) return { payload: {} }
    return { payload: { '데이터 출처': '데모 무작위 생성 (실데이터 아님)', '의료진번호': d.id, '이름': d.name, '직급': d.position, '구분': d.group, '프로필 URL': d.urlName, '메인 노출': d.main ? '메인' : '-', '사용': d.active ? '사용' : '미사용', '수정일': d.updatedAt } }
  }

  const consultationList = (params) => {
    const category = params.get('category') || 'COUNSELPHONE'
    const deleted = params.get('deleted') || 'all'
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const rows = consultations
      .filter((c) => c.category === category)
      .filter((c) => deleted === 'all' || (deleted === 'deleted' ? c.deleted : !c.deleted))
      .filter((c) => { const day = c.regDate.slice(0, 10); return (!from || day >= from) && (!to || day <= to) })
      .filter((c) => matchQ(params, c.name, c.title, c.email, c.id))
      .map((c) => ({ ...c, name: maskName(c.name), phone: maskPhone() }))
    return paginate(rows, params)
  }

  const consultationMeta = () => ({
    total: consultations.length,
    source: { backupDate: '데모 데이터(무작위 생성)' },
    categories: CONSULT_CATEGORIES.map(([category, label]) => ({ category, label, total: consultations.filter((c) => c.category === category).length })),
  })

  const consultationDetail = (id) => {
    const c = consultations.find((row) => row.id === Number(id))
    if (!c) return null
    return {
      id: c.id, channel: c.channel,
      warning: '데모 모드 — 아래 값은 전부 무작위 생성된 가짜 데이터입니다.',
      member: { no: c.memberLinked ? String(9001 + (c.id % 20)) : '-', id: c.memberLinked ? `demo_user${String((c.id % 20) + 1).padStart(2, '0')}` : '-', linked: c.memberLinked },
      customer: { name: c.name, phone: DEMO_PHONE, email: c.email, birth: '1990-01-01', gender: '여', address: '서울특별시 강남구 (데모 주소)', job: '회사원', nationality: '대한민국' },
      inquiry: { title: c.title, contents: '데모 문의 본문입니다. 실제 고객 문의가 아닙니다.', examType: c.operationName, deviceType: 'PC', branchName: c.branchName, linkUrl: '', eventNo: '', pageNo: '', pageType: '' },
      reservation: { date: c.reserveDate || '-', time: c.reserveTime || '-', crmIndex: c.hasCrm ? 'DEMO-CRM-0000' : '-', number: '-', isReserved: c.reserveStatus, surgery: false, lensType: '-', lensLastDate: '-' },
      processing: { isCalled: c.callStatus, isConfirmed: c.confirmStatus, use: true, deleted: c.deleted, memoTitle: '-', memo: '데모 메모', adminName: '데모관리자' },
      attribution: { utmSource: 'demo', utmMedium: 'demo', utmCampaign: '-', utmContent: '-', utmTerm: '-', referralCode: '-', howService: '검색' },
      extra: { addInfo01: '-', addInfo02: '-', addInfo01Text: '-', addInfo02Text: '-', imageName: '-', agreeInfo: '개인정보 수집 동의(데모)', interpreterLanguage: '-', race: '-' },
      source: { oldSequenceNo: '-', registeredAt: c.regDate, updatedAt: c.regDate, deletedAt: c.deleted ? c.regDate : '-', dataVersion: 'demo-v1' },
    }
  }

  // ── 라우팅 ──
  function handle(url) {
    markActive()
    const [path, query] = String(url).split('?')
    const params = new URLSearchParams(query || '')
    const segments = path.split('/').filter(Boolean) // ['api','legacy-data','members'] 등
    const root = segments[1]
    const tail = segments[2]
    if (root === 'legacy-data') {
      if (tail === 'meta') return clone(meta())
      if (segments.length === 4) return clone(entityDetail(tail, segments[3]))
      if (tail === 'members') return clone(memberList(params))
      if (tail === 'reviews') return clone(reviewList(params))
      if (tail === 'doctors') return clone(doctorList(params))
    }
    if (root === 'legacy-consultations') {
      if (tail === 'meta') return clone(consultationMeta())
      if (tail) { const detail = consultationDetail(tail); if (detail) return clone(detail); throw new Error('데모 데이터에 없는 접수번호입니다.') }
      return clone(consultationList(params))
    }
    throw new Error(`데모 모드가 지원하지 않는 API입니다: ${path}`)
  }
  const clone = (value) => JSON.parse(JSON.stringify(value))

  function enabled() {
    if (typeof location === 'undefined') return false
    if (location.protocol === 'file:') return true
    try { return new URLSearchParams(location.search).get('demo') === '1' } catch { return false }
  }

  let bannerShown = false
  function markActive() {
    window.BNVIIT_DEMO_LEGACY.active = true
    if (bannerShown || typeof document === 'undefined' || !document.body || !document.createElement) return
    bannerShown = true
    const banner = document.createElement('div')
    banner.setAttribute('data-demo-banner', '1')
    banner.textContent = '데모 모드 — 회원·상담·후기·의료진 데이터는 전부 무작위 생성된 가짜입니다.'
    banner.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#b45309;color:#fff;text-align:center;font-size:13px;padding:6px 12px;'
    document.body.appendChild(banner)
  }

  window.BNVIIT_DEMO_LEGACY = { enabled, handle, active: false }
})()
