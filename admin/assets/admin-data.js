/* 관리자 순수 데이터 상수 — admin.js 에서 분리 (window.BNVIIT_ADMIN_DATA).
   런타임 의존이 있는 MENU_DOMAINS(파생)·CMS_CATALOG 병합은 admin.js 에 남는다. */
(function () {
  'use strict'

  const NAV_GROUPS = [
    {
      label: '운영 현황',
      items: [
        { id: 'dashboard', label: '대시보드', icon: 'DB' },
        { id: 'coverage', label: '전체 관리 커버리지', icon: 'CV', count: 10 },
      ],
    },
    {
      label: '홈페이지 공통',
      items: [
        { id: 'home', label: '홈 화면 관리', icon: 'HM', count: 4 },
        { id: 'common-layout', label: '공통 영역 관리', icon: 'CM', count: 6 },
        { id: 'floating-actions', label: '국가별 플로팅 메뉴', icon: 'FA', count: 10 },
        { id: 'pages', label: '페이지 · 메뉴 관리', icon: 'PG', count: 36 },
        { id: 'media-library', label: '미디어 라이브러리', icon: 'MD', count: 5 },
        { id: 'seo', label: 'SEO · 메타태그', icon: 'SE', count: 36 },
      ],
    },
    {
      label: '비앤빛안과',
      items: [
        { id: 'hospital-info', label: '병원 안내 관리', icon: 'HI', count: 5 },
        { id: 'doctors', label: '원장단 관리', icon: 'DR', count: 12 },
        { id: 'medical-systems', label: '의료시스템 관리', icon: 'MS', count: 4 },
        { id: 'news', label: '소식 관리', icon: 'NW', count: 7 },
        { id: 'onair', label: 'ON AIR', icon: 'OA', count: 6 },
        { id: 'research-content', label: '수상 · 연구 관리', icon: 'RD', count: 3 },
        { id: 'reviews', label: '후기 관리', icon: 'RV', count: 6 },
      ],
    },
    {
      label: '시력교정 · 전문분야',
      items: [
        { id: 'vision-content', label: '시력교정 콘텐츠', icon: 'VC', count: 9 },
        { id: 'compare-data', label: '시력교정 비교표', icon: 'CP', count: 5 },
        { id: 'specialty-content', label: '전문분야 콘텐츠', icon: 'SP', count: 4 },
        { id: 'precautions', label: '수술 전후 주의사항', icon: 'PC', count: 8 },
      ],
    },
    {
      label: '상담 · 예약 · 회원',
      items: [
        { id: 'consultations', label: '상담 관리', icon: 'CS', count: 14 },
        { id: 'bookings', label: '예약 관리', icon: 'BK', count: 9 },
        { id: 'booking-settings', label: '예약 운영 설정', icon: 'BS', count: 6 },
        { id: 'members', label: '회원 관리', icon: 'MB', count: 24 },
        { id: 'mypage-content', label: '마이페이지 구성', icon: 'MY', count: 5 },
      ],
    },
    {
      label: '시스템 관리',
      items: [
        { id: 'events', label: '이벤트 · 배너', icon: 'EV', count: 8 },
        { id: 'board-settings', label: '게시판 · 콘텐츠 분류', icon: 'BD', count: 5 },
        { id: 'prohibited-words', label: '금칙어 관리', icon: 'FW', count: 4 },
        { id: 'common-codes', label: '공통 코드 관리', icon: 'CD', count: 6 },
        { id: 'policy-links', label: '정책 · 외부 링크', icon: 'LK', count: 8 },
        { id: 'languages', label: '언어별 메뉴 · 번역', icon: 'LG', count: 10 },
        { id: 'analytics', label: '통계', icon: 'ST' },
        { id: 'users-permissions', label: '사용자 · 권한 관리', icon: 'AU', count: 5 },
        { id: 'settings', label: '홈페이지 설정', icon: 'CF' },
        { id: 'audit-log', label: '감사로그', icon: 'AL' },
        { id: 'migration', label: 'SCR 활용 점검', icon: 'IA', count: 15 },
      ],
    },
  ]

  const PAGE_DATA = [
    { id: 'home', domain: '홈', title: '홈', path: '/', type: '운영 콘텐츠', status: 'live', scr: ['SCR-03', 'SCR-34', 'SCR-12', 'SCR-15'], updated: '2026-07-10' },
    { id: 'hours', domain: '비앤빛안과', title: '진료시간 · 오시는길', path: '/bnviit/hours', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'doctors', domain: '비앤빛안과', title: '원장단', path: '/bnviit/doctors', type: '운영 콘텐츠', status: 'live', scr: ['SCR-04'], updated: '2026-07-09' },
    { id: 'ai', domain: '비앤빛안과', title: 'AI 검사', path: '/bnviit/ai', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'surgery', domain: '비앤빛안과', title: '수술 시스템', path: '/bnviit/surgery', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'aftercare', domain: '비앤빛안과', title: '사후케어', path: '/bnviit/aftercare', type: '외부 연계', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'history', domain: '비앤빛안과', title: '시작과 성장 · 연혁', path: '/bnviit/history', type: '정적 콘텐츠', status: 'draft', scr: [], updated: '2026-07-08' },
    { id: 'news', domain: '비앤빛안과', title: '공지 · 언론보도', path: '/bnviit/news', type: '게시판', status: 'live', scr: ['SCR-11'], updated: '2026-07-09' },
    { id: 'onair', domain: '비앤빛안과', title: 'ON AIR', path: '/bnviit/onair', type: '미디어', status: 'live', scr: ['SCR-08', 'SCR-13'], updated: '2026-07-09' },
    { id: 'research', domain: '비앤빛안과', title: '수상 · 연구 · 논문', path: '/bnviit/research', type: '운영 콘텐츠', status: 'live', scr: ['SCR-06', 'SCR-07'], updated: '2026-07-09' },
    { id: 'reviews', domain: '비앤빛안과', title: '고객 후기', path: '/bnviit/reviews', type: '게시판', status: 'live', scr: ['SCR-14', 'SCR-15', 'SCR-16'], updated: '2026-07-09' },
    { id: 'starreviews', domain: '비앤빛안과', title: '스타 후기', path: '/bnviit/starreviews', type: '게시판', status: 'live', scr: [], updated: '2026-07-11' },
    { id: 'globalreviews', domain: '비앤빛안과', title: '글로벌 후기', path: '/bnviit/globalreviews', type: '게시판', status: 'live', scr: [], updated: '2026-07-11' },
    { id: 'compare', domain: '시력교정', title: '시력교정술 비교', path: '/vision-correction/compare', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'smilepro', domain: '시력교정', title: '스마일프로', path: '/vision-correction/smilepro', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'smilelasik', domain: '시력교정', title: '스마일라식', path: '/vision-correction/smilelasik', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'icl', domain: '시력교정', title: '렌즈삽입술', path: '/vision-correction/icl', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'personaleyes', domain: '시력교정', title: '퍼스널아이즈', path: '/vision-correction/personaleyes', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'lasik', domain: '시력교정', title: '라식 · 라섹', path: '/vision-correction/lasik', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'xtra', domain: '시력교정', title: '각막강화술', path: '/vision-correction/xtra', type: '정적 콘텐츠', status: 'draft', scr: [], updated: '2026-07-08' },
    { id: 'mono', domain: '시력교정', title: '모노비전', path: '/vision-correction/mono', type: '정적 콘텐츠', status: 'draft', scr: [], updated: '2026-07-08' },
    { id: 'presby', domain: '시력교정', title: '프레스비욘드 · VIVA ICL', path: '/vision-correction/presby', type: '정적 콘텐츠', status: 'live', scr: [], updated: '2026-07-08' },
    { id: 'specialty', domain: '전문분야', title: '전문분야 허브', path: '/specialty', type: '통합 콘텐츠', status: 'draft', scr: [], updated: '2026-07-08' },
    { id: 'events', domain: '이벤트', title: '이벤트', path: '/events', type: '게시판', status: 'live', scr: ['SCR-12', 'SCR-34'], updated: '2026-07-10' },
    { id: 'booking', domain: '상담/예약', title: '상담 · 예약 허브', path: '/booking', type: '업무 기능', status: 'live', scr: ['SCR-21', 'SCR-39'], partial: true, updated: '2026-07-10' },
    { id: 'reqconsult', domain: '상담/예약', title: '상담 신청', path: '/booking/consult', type: '업무 기능', status: 'live', scr: ['SCR-02', 'SCR-36', 'SCR-37'], updated: '2026-07-10' },
    { id: 'reqexam', domain: '상담/예약', title: '검사 예약', path: '/booking/exam', type: '업무 기능', status: 'live', scr: ['SCR-39'], updated: '2026-07-10' },
    { id: 'reqpartner', domain: '상담/예약', title: '제휴고객 예약', path: '/booking/partner', type: '업무 기능', status: 'live', scr: ['SCR-18', 'SCR-45', 'SCR-46'], updated: '2026-07-10' },
    { id: 'login', domain: '회원', title: '로그인', path: '/login', type: '인증 기능', status: 'live', scr: ['SCR-01', 'SCR-43'], partial: true, updated: '2026-07-08' },
    { id: 'signup', domain: '회원', title: '회원가입', path: '/signup', type: '인증 기능', status: 'live', scr: ['SCR-01'], partial: true, updated: '2026-07-08' },
    { id: 'mypage', domain: '마이페이지', title: '마이페이지 홈', path: '/mypage', type: '업무 기능', status: 'live', scr: ['SCR-01', 'SCR-39'], partial: true, updated: '2026-07-08' },
    { id: 'acct', domain: '마이페이지', title: '계정 정보', path: '/mypage/acct', type: '업무 기능', status: 'live', scr: ['SCR-01'], updated: '2026-07-08' },
    { id: 'reserve', domain: '마이페이지', title: '예약 정보 · 주의사항', path: '/mypage/reserve', type: '업무 기능', status: 'live', scr: ['SCR-39'], updated: '2026-07-08' },
    { id: 'review', domain: '마이페이지', title: '후기 작성', path: '/mypage/review', type: '업무 기능', status: 'live', scr: ['SCR-14'], updated: '2026-07-08' },
    { id: 'voice', domain: '마이페이지', title: '고객의 소리', path: '/mypage/voice', type: '업무 기능', status: 'live', scr: ['SCR-44'], updated: '2026-07-08' },
    { id: 'consult', domain: '마이페이지', title: '상담 내역', path: '/mypage/consult', type: '업무 기능', status: 'live', scr: ['SCR-02'], updated: '2026-07-08' },
  ]

  const HOME_SECTIONS = [
    { id: 'hero', mark: 'KV', name: '키비주얼', detail: 'AI 검사 · ON AIR · 이벤트 · 소식 4개 슬라이드', source: 'HeroCarousel.jsx', sourcePath: 'src/features/home/HeroCarousel.jsx', status: true, scr: ['SCR-03', 'SCR-34'] },
    { id: 'quick', mark: 'QL', name: '주요 서비스', detail: '상담 신청 · 검사 예약 · AI 검사 · 나의 예약', source: 'QuickLinks.jsx', sourcePath: 'src/features/home/QuickLinks.jsx', status: true, scr: [] },
    { id: 'ticker', mark: 'BN', name: '띠 배너 · 기록', detail: 'BNVIIT RECORD · 이벤트 · 공지 3개 롤링', source: 'BannerTicker.jsx', sourcePath: 'src/features/home/BannerTicker.jsx', status: true, scr: ['SCR-03', 'SCR-12'] },
    { id: 'info', mark: 'IF', name: '병원 안내 카드', detail: '오시는길 · 원장단 · 비급여 · 상담센터', source: 'InfoCards.jsx', sourcePath: 'src/features/home/InfoCards.jsx', status: true, scr: ['SCR-04', 'SCR-21'] },
  ]

  const LANGUAGE_PACK_DEFAULTS = [
    { id: 'ko', countryCode: 'kr', country: '대한민국', name: '한국어', locale: 'ko', displayCode: 'KOR', base: true, enabled: true, scope: '기준 콘텐츠 · 전체 메뉴' },
    { id: 'en', countryCode: 'us', country: 'United States', name: 'English', locale: 'en', displayCode: 'ENG', base: false, enabled: true, scope: '메뉴 · 주요 페이지 · 상담예약' },
    { id: 'zh-cn', countryCode: 'cn', country: '中国', name: '中文(简体)', locale: 'zh-CN', displayCode: 'CHN', base: false, enabled: true, scope: '메뉴 · 주요 페이지 · 상담예약' },
    { id: 'zh-tw', countryCode: 'tw', country: '台灣', name: '中文(繁體)', locale: 'zh-TW', displayCode: 'TWN', base: false, enabled: false, scope: '메뉴 · 공통 문구' },
    { id: 'ja', countryCode: 'jp', country: '日本', name: '日本語', locale: 'ja', displayCode: 'JPN', base: false, enabled: true, scope: '메뉴 · 주요 페이지 · 상담예약' },
    { id: 'vi', countryCode: 'vn', country: 'Việt Nam', name: 'Tiếng Việt', locale: 'vi', displayCode: 'VNM', base: false, enabled: true, scope: '메뉴 · 주요 페이지 · 상담예약' },
    { id: 'th', countryCode: 'th', country: 'ประเทศไทย', name: 'ภาษาไทย', locale: 'th', displayCode: 'THA', base: false, enabled: false, scope: '메뉴 · 공통 문구' },
    { id: 'id', countryCode: 'id', country: 'Indonesia', name: 'Bahasa Indonesia', locale: 'id', displayCode: 'IDN', base: false, enabled: false, scope: '메뉴 · 공통 문구' },
    { id: 'ru', countryCode: 'ru', country: 'Россия', name: 'Русский', locale: 'ru', displayCode: 'RUS', base: false, enabled: false, scope: '메뉴 · 공통 문구' },
    { id: 'mn', countryCode: 'mn', country: 'Монгол Улс', name: 'Монгол', locale: 'mn', displayCode: 'MON', base: false, enabled: false, scope: '메뉴 · 공통 문구' },
  ]

  const COUNTRY_OPTIONS = [
    ['kr', '대한민국'], ['us', 'United States'], ['cn', '中国'], ['tw', '台灣'], ['jp', '日本'],
    ['vn', 'Việt Nam'], ['th', 'ประเทศไทย'], ['id', 'Indonesia'], ['ru', 'Россия'], ['mn', 'Монгол Улс'],
    ['hk', '香港'], ['sg', 'Singapore'], ['my', 'Malaysia'], ['ph', 'Pilipinas'], ['in', 'भारत'],
    ['au', 'Australia'], ['nz', 'New Zealand'], ['ca', 'Canada'], ['gb', 'United Kingdom'], ['de', 'Deutschland'],
    ['fr', 'France'], ['es', 'España'], ['it', 'Italia'], ['pt', 'Portugal'], ['nl', 'Nederland'],
    ['ch', 'Schweiz'], ['at', 'Österreich'], ['be', 'België'], ['se', 'Sverige'], ['no', 'Norge'],
    ['dk', 'Danmark'], ['fi', 'Suomi'], ['pl', 'Polska'], ['cz', 'Česko'], ['gr', 'Ελλάδα'],
    ['tr', 'Türkiye'], ['ua', 'Україна'], ['kz', 'Қазақстан'], ['uz', 'Oʻzbekiston'], ['ae', 'الإمارات'],
    ['sa', 'السعودية'], ['il', 'ישראל'], ['eg', 'مصر'], ['za', 'South Africa'], ['br', 'Brasil'],
    ['mx', 'México'], ['ar', 'Argentina'], ['cl', 'Chile'], ['co', 'Colombia'], ['pe', 'Perú'],
  ].map(([code, name]) => ({ code, name }))

  const FLOATING_CHANNEL_PRESETS = [
    { id: 'calendar', label: '예약', color: '#45BEC4' },
    { id: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
    { id: 'kakao', label: '카카오톡', color: '#FEE500' },
    { id: 'zalo', label: 'Zalo', color: '#0068FF' },
    { id: 'facebook', label: 'Facebook', color: '#1877F2' },
    { id: 'google', label: 'Google+', color: '#DB4437' },
    { id: 'message', label: '메시지', color: '#45BEC4' },
    { id: 'instagram', label: 'Instagram', color: '#E4405F' },
    { id: 'youtube', label: 'YouTube', color: '#FF0000' },
    { id: 'line', label: 'LINE', color: '#06C755' },
    { id: 'wechat', label: 'WeChat', color: '#07C160' },
    { id: 'telegram', label: 'Telegram', color: '#229ED9' },
    { id: 'custom', label: '직접 설정', color: '#667085' },
  ]

  const FLOATING_ACTION_DEFAULTS = {
    ko: { ai: { label: 'AI 검사', target: 'ai', visible: true }, consult: { label: '상담', target: 'reqconsult', visible: true }, top: { label: '맨 위로', target: '', visible: true } },
    en: { ai: { label: 'AI Eye Test', target: 'ai', visible: true }, consult: { label: 'Consult', target: 'reqconsult', visible: true }, top: { label: 'Back to top', target: '', visible: true } },
    'zh-cn': { ai: { label: 'AI检查', target: 'ai', visible: true }, consult: { label: '咨询', target: 'reqconsult', visible: true }, top: { label: '返回顶部', target: '', visible: true } },
    'zh-tw': { ai: { label: 'AI檢查', target: 'ai', visible: true }, consult: { label: '諮詢', target: 'reqconsult', visible: true }, top: { label: '回到頂部', target: '', visible: true } },
    ja: { ai: { label: 'AI検査', target: 'ai', visible: true }, consult: { label: '相談', target: 'reqconsult', visible: true }, top: { label: 'ページ上部へ', target: '', visible: true } },
    vi: { ai: { label: 'Kiểm tra AI', target: 'ai', visible: true }, consult: { label: 'Tư vấn', target: 'reqconsult', visible: true }, top: { label: 'Lên đầu trang', target: '', visible: true } },
    th: { ai: { label: 'ตรวจตา AI', target: 'ai', visible: true }, consult: { label: 'ปรึกษา', target: 'reqconsult', visible: true }, top: { label: 'กลับด้านบน', target: '', visible: true } },
    id: { ai: { label: 'Pemeriksaan AI', target: 'ai', visible: true }, consult: { label: 'Konsultasi', target: 'reqconsult', visible: true }, top: { label: 'Kembali ke atas', target: '', visible: true } },
    ru: { ai: { label: 'AI-диагностика', target: 'ai', visible: true }, consult: { label: 'Консультация', target: 'reqconsult', visible: true }, top: { label: 'Наверх', target: '', visible: true } },
    mn: { ai: { label: 'AI шинжилгээ', target: 'ai', visible: true }, consult: { label: 'Зөвлөгөө', target: 'reqconsult', visible: true }, top: { label: 'Дээш буцах', target: '', visible: true } },
  }

  const RECORD_DEFAULTS = {
    surgery: '740000',
    visits: '15870000',
    counsel: '1080000',
    reviews: '12800',
    doctors: '12',
    papers: '120',
  }

  const RECORD_META_DEFAULTS = {
    surgery: { label: '누적 수술 건수', unit: '건+', source: '수술 통계', visible: true },
    visits: { label: '홈페이지 누적 방문', unit: '회+', source: '웹 분석', visible: true },
    counsel: { label: '상담 · 예약', unit: '건+', source: '상담·예약 통계', visible: true },
    reviews: { label: '수술 후기', unit: '건+', source: '후기 게시판', visible: true },
    doctors: { label: '의료진', unit: '인', source: '원장단 관리', visible: true },
    papers: { label: '연구 · 논문', unit: '편+', source: '연구·논문 관리', visible: true },
  }

  const HOME_CONTENT_DEFAULTS = {
    hero: [
      { id: 'hero-ai', eyebrow: 'BNVIIT AI 정밀검사 시스템', title: '내 눈에 꼭 맞는 시력교정, AI가 함께 찾습니다', description: '검사부터 수술, 사후케어까지 데이터로 설계하는 눈 맞춤 계획', mediaType: 'color', mediaUrl: '', primaryLabel: 'AI 검사 알아보기', primaryRoute: 'ai', secondaryLabel: '시력교정술 비교', secondaryRoute: 'compare', theme: 'blue', startsAt: '', endsAt: '', visible: true },
      { id: 'hero-onair', eyebrow: 'BNVIIT ON AIR', title: '영상으로 만나는 비앤빛', description: '검사실 투어부터 원장 Q&A까지 영상으로 확인하세요', mediaType: 'video', mediaUrl: '', primaryLabel: '영상 전체보기', primaryRoute: 'onair', secondaryLabel: '', secondaryRoute: '', theme: 'dark', startsAt: '', endsAt: '', visible: true },
      { id: 'hero-events', eyebrow: '이벤트', title: '지금 진행 중인 혜택을 확인해보세요', description: '시즌별 시력교정 캠페인과 상담 이벤트', mediaType: 'image', mediaUrl: '', primaryLabel: '이벤트 보기', primaryRoute: 'events', secondaryLabel: '', secondaryRoute: '', theme: 'orange', startsAt: '', endsAt: '', visible: true },
      { id: 'hero-news', eyebrow: '비앤빛 소식', title: '새로운 소식과 언론보도를 만나보세요', description: '공지사항·언론보도와 연구 소식을 한눈에', mediaType: 'image', mediaUrl: '', primaryLabel: '소식 보기', primaryRoute: 'news', secondaryLabel: '', secondaryRoute: '', theme: 'blue', startsAt: '', endsAt: '', visible: true },
    ],
    quick: [
      { id: 'quick-consult', title: '상담 신청', description: '비용·수술 궁금증, 1:1로 답해드려요', route: 'reqconsult', icon: 'chat', tone: 'blue', visible: true },
      { id: 'quick-exam', title: '검사 예약', description: '정밀검사 일정을 간편하게 예약하세요', route: 'reqexam', icon: 'calendar', tone: 'teal', visible: true },
      { id: 'quick-ai', title: 'AI 검사', description: '정밀 장비와 AI 진단 시스템', route: 'ai', icon: 'eye', tone: 'orange', visible: true },
      { id: 'quick-reserve', title: '나의 예약', description: '예약 확인과 수술 전후 주의사항', route: 'reserve', icon: 'document', tone: 'purple', visible: true },
    ],
    ticker: [
      { id: 'ticker-record', kind: 'record', label: 'BNVIIT RECORD', title: '누적 수술·방문·상담·후기 주요 지표', actionLabel: '', route: '', tone: 'blue', startsAt: '', endsAt: '', visible: true },
      { id: 'ticker-event', kind: 'event', label: '이벤트', title: '여름 시력교정 캠페인 진행 중', actionLabel: '이벤트 보기', route: 'events', tone: 'orange', startsAt: '', endsAt: '', visible: true },
      { id: 'ticker-notice', kind: 'notice', label: '공지', title: '8월 진료 일정 및 여름 휴가철 예약 안내', actionLabel: '공지 보기', route: 'news', tone: 'gray', startsAt: '', endsAt: '', visible: true },
    ],
    info: [
      { id: 'info-hours', kind: 'link', title: '진료시간 · 오시는길', description: '강남역 9번 출구 GT타워 B2층\n분과별 진료시간을 확인하세요', route: 'hours', tone: 'blue', phone: '', note: '', visible: true },
      { id: 'info-doctors', kind: 'link', title: '원장단', description: '대표원장 5인 · 원장 7인\n검사부터 수술까지 집도의가 함께', route: 'doctors', tone: 'purple', phone: '', note: '', visible: true },
      { id: 'info-cost', kind: 'link', title: '비급여 진료비', description: '수술·검사 비용을 투명하게 공개합니다', route: 'stub', tone: 'orange', phone: '', note: '', visible: true },
      { id: 'info-contact', kind: 'contact', title: '비앤빛 상담센터', description: '상담 신청부터 검사 예약까지 한 번에', route: 'reqconsult', tone: 'teal', phone: '1522-6800', note: '100% 사전 예약제 · 점심시간 13:30 ~ 14:30', visible: true },
    ],
  }

  const MEDIA_ASSET_DEFAULTS = [
    { id: 'media-home-ai', name: '홈 AI 키비주얼', category: '키비주얼', fileName: 'home-ai-hero.webp', fileType: 'WebP', size: '428 KB', dimensions: '1600×640', alt: 'AI 정밀검사 시스템 메인 이미지', usage: '홈 키비주얼', url: '/assets/home/home-ai-hero.webp', status: 'live', updated: '2026-07-10' },
    { id: 'media-doctor-kim', name: '김진국 대표원장 프로필', category: '의료진', fileName: 'doctor-kim-jinkook.webp', fileType: 'WebP', size: '186 KB', dimensions: '800×1000', alt: '김진국 대표원장', usage: '원장단 목록·상세', url: '/assets/doctors/doctor-kim-jinkook.webp', status: 'live', updated: '2026-07-09' },
    { id: 'media-event-summer', name: '여름 시력교정 캠페인', category: '이벤트·배너', fileName: 'event-summer-2026.webp', fileType: 'WebP', size: '352 KB', dimensions: '1600×640', alt: '2026 여름 시력교정 캠페인', usage: '홈·이벤트', url: '/assets/events/event-summer-2026.webp', status: 'live', updated: '2026-07-10' },
    { id: 'media-onair-tour', name: '검사실 투어 썸네일', category: 'ON AIR', fileName: 'onair-clinic-tour.jpg', fileType: 'JPG', size: '244 KB', dimensions: '1280×720', alt: '비앤빛 검사실 영상 썸네일', usage: '홈·ON AIR', url: '/assets/onair/onair-clinic-tour.jpg', status: 'draft', updated: '2026-07-08' },
    { id: 'media-og-default', name: '기본 공유 이미지', category: 'SEO', fileName: 'og-default.png', fileType: 'PNG', size: '196 KB', dimensions: '1200×630', alt: '비앤빛 강남밝은세상안과', usage: '전체 페이지 기본 OG', url: '/assets/seo/og-default.png', status: 'live', updated: '2026-07-08' },
  ]

  const MODULE_ROWS = {
    doctors: [
      ['김진국', '대표원장', '시력교정 · 렌즈삽입술', '노출', 'SCR-04'],
      ['이인식', '대표원장', '노안 · 백내장', '노출', 'SCR-04'],
      ['류익희', '대표원장', '시력교정', '노출', 'SCR-04'],
      ['김희선', '대표원장', '렌즈삽입술', '노출', 'SCR-04'],
      ['최한뉘', '대표원장', '백내장', '노출', 'SCR-04'],
      ['강은민', '원장', '외래진료', '노출', 'SCR-04'],
      ['김욱겸', '원장', '드림렌즈', '노출', 'SCR-04'],
    ],
    'hospital-content': [
      ['공지 · 언론보도', '게시판', '7건', '운영', 'SCR-11'],
      ['ON AIR', '영상 콘텐츠', '6건', '운영', 'SCR-08 · SCR-13'],
    ],
    reviews: [
      ['스마일프로 수술 다음날부터 일상생활이 가능했어요', '스마일프로', '5.0', '승인', 'SCR-14'],
      ['고도근시 렌즈 종류 비교가 자세했어요', '렌즈삽입술', '5.0', '승인', 'SCR-14'],
      ['회복 기간 안내와 앱 알림이 편했습니다', '라식 · 라섹', '4.0', '승인', 'SCR-14'],
      ['부모님 백내장 수술 설명이 쉬웠습니다', '노안 · 백내장', '5.0', '검토', 'SCR-14'],
    ],
    events: [
      ['여름 시력교정 캠페인', '메인 이벤트', '2026-07-01 ~ 2026-08-31', '노출', 'SCR-12 · SCR-34'],
      ['8월 진료 일정 안내', '띠 배너', '2026-07-25 ~ 2026-08-31', '예약', 'SCR-03'],
      ['정밀검사 상담 이벤트', '서브 배너', '2026-07-10 ~ 2026-09-30', '노출', 'SCR-35'],
    ],
    consultations: [
      ['CS-260710-0142', '온라인', '스마일프로 비용 문의', '답변 대기', 'SCR-02 · SCR-36'],
      ['CS-260710-0141', '카카오', '고도근시 수술 가능 여부', '상담 중', 'SCR-37'],
      ['CS-260710-0140', '전화', '검사 전 렌즈 미착용 기간', '완료', 'SCR-36'],
      ['CS-260709-0139', '이벤트', '정밀검사 혜택 문의', '완료', 'SCR-38'],
    ],
    bookings: [
      ['RS-260710-0093', '검사 예약', '2026-07-15 10:30', '예약 확정', 'SCR-39'],
      ['RS-260710-0092', '제휴고객 예약', '2026-07-16 14:00', '확인 대기', 'SCR-46'],
      ['RS-260710-0091', '검사 예약', '2026-07-16 15:30', '예약 확정', 'SCR-39'],
      ['RS-260709-0090', '제휴 상담', '2026-07-17 11:00', '상담 예정', 'SCR-45'],
    ],
    members: [
      ['MB-70668', '홍길동', '일반 회원', '정상', 'SCR-01'],
      ['MB-70667', '김은지', '카카오 회원', '정상', 'SCR-01'],
      ['MB-70666', '박준호', '네이버 회원', '휴면 예정', 'SCR-01'],
      ['MB-70665', '이수민', '일반 회원', '탈퇴', 'SCR-43'],
    ],
  }

  const VIEW_META = {
    dashboard: ['운영 현황', '대시보드'],
    home: ['홈페이지 공통', '홈 화면 관리'],
    'floating-actions': ['홈페이지 공통', '국가별 플로팅 메뉴'],
    pages: ['홈페이지 공통', '페이지 · 메뉴 관리'],
    menus: ['홈페이지 공통', '페이지 · 메뉴 관리'],
    seo: ['홈페이지 공통', 'SEO · 메타태그'],
    doctors: ['비앤빛안과', '원장단 관리'],
    news: ['비앤빛안과', '소식 관리'],
    onair: ['비앤빛안과', 'ON AIR'],
    reviews: ['비앤빛안과', '후기 관리'],
    events: ['시스템 관리', '이벤트 · 배너'],
    consultations: ['상담 · 예약 · 회원', '상담 관리'],
    bookings: ['상담 · 예약 · 회원', '예약 관리'],
    members: ['상담 · 예약 · 회원', '회원 관리'],
    analytics: ['시스템 관리', '통계'],
    settings: ['시스템 관리', '홈페이지 설정'],
    migration: ['시스템 관리', 'SCR 활용 점검'],
  }

  const VIEW_GUIDES = {
    dashboard: '콘텐츠 운영 상태와 당일 상담·예약 현황, 기존 관리자 기능 연계 수준을 한눈에 확인하는 시작 화면입니다.',
    coverage: '홈페이지 화면과 CMS 관리 기능의 연결 여부를 점검하고 누락되거나 추가 구현이 필요한 영역을 확인합니다.',
    home: '메인 화면의 섹션 순서와 노출 콘텐츠, 주요 수치와 홈페이지 미리보기를 한 흐름에서 관리합니다.',
    'common-layout': '헤더·전체메뉴·푸터·언어 선택처럼 모든 페이지에 공통 적용되는 구성요소를 관리합니다.',
    'floating-actions': '국가·언어별로 AI 검사·상담·맨 위로 버튼의 노출, 표시 문구와 이동 경로를 관리합니다.',
    pages: '페이지의 URL·콘텐츠·CMS 계층과 실제 GNB·전체메뉴 노출 구조를 두 탭으로 구분해 관리합니다.',
    menus: '페이지 원본과 메뉴 노출 책임을 분리하면서 GNB·전체메뉴의 순서와 링크를 관리합니다.',
    'media-library': '홈페이지에서 사용하는 이미지와 영상의 파일 정보·사용처·대체텍스트·공개 상태를 관리합니다.',
    seo: '페이지별 검색 노출 정보와 canonical·OG 이미지를 점검하고 누락된 메타데이터를 보완합니다.',
    'hospital-info': '진료시간·오시는길·병원 소개·연혁 등 병원 기본 안내 콘텐츠를 일관되게 관리합니다.',
    doctors: '의료진 프로필과 직책·전문분야·노출 순서를 관리하고 홈페이지 원장단 화면과 연결합니다.',
    'medical-systems': 'AI 검사·정밀 장비·수술 시스템·사후관리 서비스의 설명과 노출 구성을 관리합니다.',
    news: '공지·언론보도 등 비앤빛 소식 게시물의 게시 상태·노출 순서·연결 정보를 관리합니다.',
    onair: 'ON AIR 영상(YouTube 등) 콘텐츠의 노출 순서·연결 정보와 공개 상태를 관리합니다.',
    'research-content': '수상·논문·연구 협력 정보를 연도와 노출 순서에 맞춰 관리하고 공개 콘텐츠에 반영합니다.',
    reviews: '등록된 고객 후기를 검수하고 수술 구분·평점·승인 상태와 홈페이지 노출 여부를 관리합니다.',
    'vision-content': '시력교정 페이지별 통계·특징·추천 대상·CTA 등 핵심 설명 콘텐츠를 관리합니다.',
    'compare-data': '시력교정술 비교 기준과 수술별 값을 관리해 사용자 비교표가 동일한 기준으로 표시되게 합니다.',
    'specialty-content': '백내장·드림렌즈·안질환 등 전문분야의 카드와 상세 연결 콘텐츠를 관리합니다.',
    precautions: '수술 전후 주의사항을 시술과 예약·마이페이지 흐름에 연결하고 공개 상태를 관리합니다.',
    consultations: '온라인·전화·카카오·이벤트 상담을 통합 조회하고 담당 배정과 처리 상태를 관리합니다.',
    bookings: '일반 검사와 제휴 예약을 함께 조회하며 예약 일시·확정·변경·취소 상태를 관리합니다.',
    'booking-settings': '검사 종류와 예약 가능 시간·차단일·마감 기준 등 예약 운영 규칙을 설정합니다.',
    members: '일반·소셜 회원의 상태와 동의·탈퇴 정보를 조회하며 개인정보 접근 이력을 안전하게 관리합니다.',
    'mypage-content': '계정·예약·후기·문의·상담 내역 등 마이페이지 메뉴의 화면 구성과 안내 문구를 관리합니다.',
    events: '메인·서브 배너와 이벤트 게시물의 노출 기간·링크·신청 연결 상태를 통합 관리합니다.',
    'board-settings': '게시판 유형·권한·기능 옵션과 배너이벤트 분류를 통합해 콘텐츠 생성 기준을 관리합니다.',
    'prohibited-words': '게시글·후기·상담 입력에 적용할 금칙어와 차단·검토 처리 방식을 관리합니다.',
    'common-codes': '상담·예약·콘텐츠에서 공통으로 사용하는 상위·하위 코드와 표시 순서를 관리합니다.',
    'policy-links': '정책 문서·비급여 안내·앱·외부몰 등 공통 링크의 URL과 노출 위치를 관리합니다.',
    languages: '지원 언어와 표시코드·메뉴 노출·번역 진행 상태를 확인하고 언어별 공개 범위를 관리합니다.',
    analytics: '방문·상담·예약 전환 데이터를 기간과 집계 기준별로 확인하고 운영 보고서로 활용합니다.',
    'users-permissions': '관리자 계정과 역할별 조회·등록·승인 권한을 관리해 업무 범위에 맞는 접근만 허용합니다.',
    settings: '대표 연락처·운영시간·예약 기본값·외부 서비스 등 사이트 전역 설정을 관리합니다.',
    'audit-log': '콘텐츠 변경과 고객정보 열람·설정 수정 이력을 조회해 관리자 작업을 추적합니다.',
    migration: '레거시 SCR 기능의 재사용 가능 여부와 신규 CMS 구현 범위를 기능 단위로 점검합니다.',
  }

  const MODULE_CONFIG = {
    doctors: {
      title: '원장단 관리',
      description: '리빌드 원장단 페이지와 연결되는 프로필, 전문분야, 노출 순서를 관리합니다.',
      headers: ['의료진', '직책', '전문분야', '상태', '기존 기능'],
    },
    'hospital-content': {
      title: '소식 · ON AIR',
      description: '공지·언론보도와 YouTube 영상 콘텐츠를 관리합니다.',
      headers: ['콘텐츠', '유형', '등록 건수', '상태', '기존 기능'],
    },
    reviews: {
      title: '후기 관리',
      description: '홈페이지 및 마이페이지에서 등록된 후기를 검수하고 노출합니다.',
      headers: ['후기', '수술 구분', '평점', '상태', '기존 기능'],
    },
    events: {
      title: '이벤트 · 배너',
      description: '메인·서브 배너와 이벤트 게시 및 노출 기간을 관리합니다.',
      headers: ['제목', '구분', '노출 기간', '상태', '기존 기능'],
    },
    consultations: {
      title: '상담 관리',
      description: '온라인, 전화, 카카오, 이벤트 상담을 하나의 접수함에서 관리합니다.',
      headers: ['접수번호', '채널', '문의 요약', '상태', '기존 기능'],
    },
    bookings: {
      title: '예약 관리',
      description: '일반 검사 예약과 제휴고객 예약을 구분해 확인합니다.',
      headers: ['예약번호', '구분', '예약 일시', '상태', '기존 기능'],
    },
    members: {
      title: '회원 관리',
      description: '일반·소셜 회원과 탈퇴 상태를 조회합니다. 민감정보는 실제 구현 시 마스킹해야 합니다.',
      headers: ['회원번호', '이름', '가입 유형', '상태', '기존 기능'],
    },
  }

  window.BNVIIT_ADMIN_DATA = {
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
    MODULE_ROWS,
    VIEW_META,
    VIEW_GUIDES,
    MODULE_CONFIG,
  }
})()
