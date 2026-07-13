/* 시력교정 · 전문분야 그룹 컬렉션 — window.BNVIIT_CMS_COLLECTIONS.collections 에 병합 */
(function () {
  'use strict'

  const C = window.BNVIIT_CMS_COLLECTIONS = window.BNVIIT_CMS_COLLECTIONS || { views: {}, collections: {} }
  C.collections = C.collections || {}

  Object.assign(C.collections, {
      /* ================= 시력교정 콘텐츠 (9개 페이지) ================= */
      visionPages: {
        tab: '시력교정 페이지',
        title: '시력교정 콘텐츠',
        singular: '페이지',
        legacy: '',
        description: '9개 시력교정 페이지의 대표 문구·통계·특징·추천 대상·CTA와 노출을 관리합니다.',
        searchPlaceholder: '페이지명 또는 대표 문구 검색',
        searchKeys: ['name', 'desc', 'group'],
        filters: [
          { id: 'group', label: '분류', field: 'group', kind: 'text', options: ['전체', '비교', '스마일', '라식·라섹', '렌즈삽입술', '노안교정'] },
          { id: 'use', label: '노출여부', field: 'use', kind: 'bool', options: ['전체', '노출', '숨김'] },
        ],
        columns: [
          { key: 'seq', label: '순서', type: 'order' },
          { key: 'name', label: '페이지', type: 'title' },
          { key: 'group', label: '분류', type: 'tag' },
          { key: 'desc', label: '대표 문구', type: 'text' },
          { key: 'stat', label: '핵심 통계', type: 'text' },
          { key: 'use', label: '노출', type: 'toggle', on: '노출', off: '숨김' },
          { key: 'status', label: '상태', type: 'badge' },
        ],
        fields: [
          { key: 'name', label: '페이지명', type: 'text', full: true, code: 'page_title', required: true },
          { key: 'group', label: '분류', type: 'select', options: ['비교', '스마일', '라식·라섹', '렌즈삽입술', '노안교정'], code: 'group' },
          { key: 'route', label: '연결 경로', type: 'text', code: 'route' },
          { key: 'desc', label: '대표 문구', type: 'textarea', full: true, code: 'hero_desc' },
          { key: 'stat', label: '핵심 통계 요약', type: 'text', full: true, code: 'stats' },
          { key: 'features', label: '특징 요약', type: 'textarea', full: true, code: 'features' },
          { key: 'fits', label: '추천 대상', type: 'textarea', full: true, code: 'fits' },
          { key: 'ctaLabel', label: 'CTA 버튼', type: 'text', code: 'cta_label' },
          { key: 'ctaRoute', label: 'CTA 연결', type: 'text', code: 'cta_route' },
          { key: 'status', label: '콘텐츠 상태', type: 'select', options: ['운영', '검토'], code: 'status' },
          { key: 'use', label: '노출여부', type: 'toggle', on: '노출', off: '숨김', code: 'use_yn' },
          { key: 'upd', label: '수정일', type: 'readonly', code: 'mod_date' },
        ],
        rows: [
          { id: 'v1', seq: 1, name: '시력교정술 비교', group: '비교', route: '/vision-correction/compare', desc: '수술 방식별 특징을 한눈에 비교하고 나에게 맞는 방법을 찾아보세요.', stat: '스마일프로·라식·라섹·렌즈삽입술 4종', features: '비교표 · 추천 CTA · AI 자가검사', fits: '수술 방식을 비교하고 싶은 모든 분', ctaLabel: '검사 예약', ctaRoute: '/booking/exam', status: '운영', use: true, upd: '2026-06-20' },
          { id: 'v2', seq: 2, name: '스마일프로', group: '스마일', route: '/vision-correction/smilepro', desc: '10초대 레이저, 최소 절개 — 3세대 스마일 시력교정.', stat: '통계 4 · 특징 3 · 추천대상 4', features: '10초대 레이저 · 최소 절개 · AI 수술 설계', fits: '활동량이 많은 분 · 안구건조가 걱정되는 분', ctaLabel: '검사 예약', ctaRoute: '/booking/exam', status: '운영', use: true, upd: '2026-06-11' },
          { id: 'v3', seq: 3, name: '스마일라식', group: '스마일', route: '/vision-correction/smilelasik', desc: '각막절편 없이 절개창을 최소화한 스마일 방식 시력교정.', stat: '시력회복 다음날 · 수술 약 15분', features: '각막절편 없음 · 작은 절개창 · 안정적 회복', fits: '신체 활동이 많은 분 · 안구건조를 줄이고 싶은 분', ctaLabel: '검사 예약', ctaRoute: '/booking/exam', status: '운영', use: true, upd: '2026-05-30' },
          { id: 'v4', seq: 4, name: '렌즈삽입술', group: '렌즈삽입술', route: '/vision-correction/icl', desc: '각막을 깎지 않고 시력을 교정하는 안내렌즈 수술.', stat: '각막 절삭 없음 · 고도근시까지', features: '각막 보존 · 가역적 수술 · 넓은 교정 범위', fits: '고도근시·고도난시 · 각막이 얇은 분', ctaLabel: '검사 예약', ctaRoute: '/booking/exam', status: '운영', use: true, upd: '2026-05-30' },
          { id: 'v5', seq: 5, name: '퍼스널아이즈', group: '라식·라섹', route: '/vision-correction/personaleyes', desc: '내 각막 지형에 맞춘 개인화 레이저 시력교정.', stat: '각막 지형도 맞춤 · 야간 빛번짐 개선', features: '각막 지형도 맞춤 · 수차 최소화 · 방식 선택', fits: '야간 빛번짐이 걱정되는 분 · 동공이 큰 분', ctaLabel: '검사 예약', ctaRoute: '/booking/exam', status: '운영', use: true, upd: '2026-04-18' },
          { id: 'v6', seq: 6, name: '라식 · 라섹', group: '라식·라섹', route: '/vision-correction/lasik', desc: '오랜 임상 데이터의 표준 레이저 시력교정 — 각막 상태에 맞게 선택.', stat: '라식 다음날 · 라섹 3~5일', features: '라식 · 라섹 · 맞춤 옵션(베이직~프리미엄)', fits: '표준 근시·난시 교정 · 비용 부담을 줄이고 싶은 분', ctaLabel: '검사 예약', ctaRoute: '/booking/exam', status: '운영', use: true, upd: '2026-04-18' },
          { id: 'v7', seq: 7, name: '각막강화술', group: '라식·라섹', route: '/vision-correction/xtra', desc: '레이저 교정과 병행해 각막 강도를 보강하는 시술.', stat: '추가 약 3분 · 각막 강도 보강', features: '콜라겐 교차결합 · 각막확장증 예방 · 동시 진행', fits: '각막이 얇은 분 · 고도근시로 교정량이 많은 분', ctaLabel: '상담 신청', ctaRoute: '/booking/consult', status: '검토', use: false, upd: '-' },
          { id: 'v8', seq: 8, name: '모노비전', group: '노안교정', route: '/vision-correction/mono', desc: '두 눈의 초점을 나누어 노안에 대응하는 교정법.', stat: '양안 초점 분담 · 노안 초기', features: '주시안 원거리 · 비주시안 근거리 · 사전 시뮬레이션', fits: '노안이 시작된 40~50대 · 체험 후 결정하고 싶은 분', ctaLabel: '상담 신청', ctaRoute: '/booking/consult', status: '검토', use: false, upd: '-' },
          { id: 'v9', seq: 9, name: '노안교정', group: '노안교정', route: '/vision-correction/presby', desc: '가까운 곳이 흐려지기 시작했다면 — 노안교정 옵션을 확인하세요.', stat: '40대 이후 노안 · 레이저·렌즈', features: '노안 정밀 진단 · 맞춤 방식 제안 · 백내장 연계', fits: '근거리가 흐려지기 시작한 분 · 돋보기가 번거로운 분', ctaLabel: '상담 신청', ctaRoute: '/booking/consult', status: '운영', use: true, upd: '2026-06-02' },
        ],
      },

      /* ================= 시력교정 비교표 ================= */
      compareTable: {
        tab: '비교표',
        title: '시력교정 비교표',
        singular: '비교 항목',
        legacy: '',
        description: '스마일프로·라식·라섹·렌즈삽입술의 비교 기준과 값을 관리합니다. 비교표에 표시되는 행 단위로 편집합니다.',
        searchPlaceholder: '비교 항목 검색',
        searchKeys: ['item'],
        filters: [
          { id: 'use', label: '노출여부', field: 'use', kind: 'bool', options: ['전체', '노출', '숨김'] },
        ],
        columns: [
          { key: 'seq', label: '순서', type: 'order' },
          { key: 'item', label: '비교 항목', type: 'title' },
          { key: 'smilepro', label: '스마일프로', type: 'text' },
          { key: 'lasik', label: '라식', type: 'text' },
          { key: 'lasek', label: '라섹', type: 'text' },
          { key: 'icl', label: '렌즈삽입술', type: 'text' },
          { key: 'use', label: '노출', type: 'toggle', on: '노출', off: '숨김' },
        ],
        fields: [
          { key: 'item', label: '비교 항목', type: 'text', full: true, code: 'row_label', required: true },
          { key: 'smilepro', label: '스마일프로', type: 'text', code: 'col_smilepro' },
          { key: 'lasik', label: '라식', type: 'text', code: 'col_lasik' },
          { key: 'lasek', label: '라섹', type: 'text', code: 'col_lasek' },
          { key: 'icl', label: '렌즈삽입술', type: 'text', code: 'col_icl' },
          { key: 'use', label: '노출여부', type: 'toggle', on: '노출', off: '숨김', code: 'use_yn' },
          { key: 'upd', label: '수정일', type: 'readonly', code: 'mod_date' },
        ],
        rows: [
          { id: 'cp1', seq: 1, item: '수술 방식', smilepro: '2mm 최소 절개 후 실질 분리', lasik: '각막절편 생성 후 레이저 조사', lasek: '상피 제거 후 레이저 조사', icl: '안내렌즈 삽입 (비절삭)', use: true, upd: '2026-05-30' },
          { id: 'cp2', seq: 2, item: '시력 회복', smilepro: '다음날', lasik: '다음날', lasek: '3~5일', icl: '1~2일', use: true, upd: '2026-05-30' },
          { id: 'cp3', seq: 3, item: '통증 · 이물감', smilepro: '적음', lasik: '적음', lasek: '초기 다소 있음', icl: '적음', use: true, upd: '2026-05-30' },
          { id: 'cp4', seq: 4, item: '각막 보존', smilepro: '높음', lasik: '보통', lasek: '보통', icl: '매우 높음', use: true, upd: '2026-05-30' },
          { id: 'cp5', seq: 5, item: '이런 분께', smilepro: '활동량 많은 분, 안구건조 걱정', lasik: '빠른 회복을 원하는 분', lasek: '각막이 얇은 분', icl: '고도근시 · 레이저 부적합', use: true, upd: '2026-05-30' },
        ],
      },

      /* ================= 전문분야 콘텐츠 (카드) ================= */
      specialtyCards: {
        tab: '전문분야 카드',
        title: '전문분야 콘텐츠',
        singular: '카드',
        legacy: '',
        description: '백내장·드림렌즈·안질환·안종합검진 전문분야의 세부 카드와 설명, 배지, 노출을 관리합니다.',
        searchPlaceholder: '카드명 또는 설명 검색',
        searchKeys: ['label', 'desc', 'field'],
        filters: [
          { id: 'field', label: '전문분야', field: 'field', kind: 'text', options: ['전체', '백내장', '드림렌즈', '안질환', '안종합검진'] },
          { id: 'use', label: '노출여부', field: 'use', kind: 'bool', options: ['전체', '노출', '숨김'] },
        ],
        columns: [
          { key: 'seq', label: '순서', type: 'order' },
          { key: 'field', label: '전문분야', type: 'tag' },
          { key: 'label', label: '카드명', type: 'title' },
          { key: 'desc', label: '설명', type: 'text' },
          { key: 'badges', label: '배지', type: 'text' },
          { key: 'use', label: '노출', type: 'toggle', on: '노출', off: '숨김' },
        ],
        fields: [
          { key: 'field', label: '전문분야', type: 'select', options: ['백내장', '드림렌즈', '안질환', '안종합검진'], code: 'section' },
          { key: 'label', label: '카드명', type: 'text', full: true, code: 'card_label', required: true },
          { key: 'desc', label: '설명', type: 'textarea', full: true, code: 'card_desc' },
          { key: 'badges', label: '배지 (콤마 구분)', type: 'text', full: true, code: 'badges' },
          { key: 'more', label: '상세 페이지 링크', type: 'toggle', on: '연결', off: '없음', code: 'more_yn' },
          { key: 'use', label: '노출여부', type: 'toggle', on: '노출', off: '숨김', code: 'use_yn' },
          { key: 'upd', label: '수정일', type: 'readonly', code: 'mod_date' },
        ],
        rows: [
          { id: 'sp1', seq: 1, field: '백내장', label: 'LAL 백내장 수술', desc: '수술 후 빛으로 도수를 미세 조정하는 조절형 인공수정체(RxSight LAL) 백내장 수술.', badges: '', more: true, use: true, upd: '2026-06-05' },
          { id: 'sp2', seq: 2, field: '백내장', label: '레이저 백내장 수술', desc: '주요 절개와 수정체 분할을 레이저로 정밀하게 진행하는 백내장 수술.', badges: '', more: true, use: true, upd: '2026-06-05' },
          { id: 'sp3', seq: 3, field: '백내장', label: '인공수정체 4종', desc: '생활 패턴에 맞춰 선택하는 인공수정체 옵션.', badges: '프리미엄, 다초점, 연속초점, 단초점', more: false, use: true, upd: '2026-06-05' },
          { id: 'sp4', seq: 4, field: '드림렌즈', label: '드림렌즈 · 하드렌즈', desc: '수면 중 착용하는 각막교정렌즈로, 성장기 근시 진행 관리에도 활용됩니다.', badges: '', more: true, use: true, upd: '2026-04-12' },
          { id: 'sp5', seq: 5, field: '드림렌즈', label: '렌즈 종류', desc: '눈 상태에 맞춰 선택하는 하드렌즈 옵션.', badges: 'PARAGON, LK, PRGP', more: false, use: true, upd: '2026-04-12' },
          { id: 'sp6', seq: 6, field: '안질환', label: '안구건조증', desc: '눈물막 · 마이봄샘 정밀 검사로 원인을 진단합니다.', badges: '', more: true, use: true, upd: '2026-03-20' },
          { id: 'sp7', seq: 7, field: '안질환', label: '안구건조 치료', desc: '약물 외 IPL · 리피플로우 등 장비 치료를 병행합니다.', badges: 'IPL, 리피플로우', more: false, use: true, upd: '2026-03-20' },
          { id: 'sp8', seq: 8, field: '안질환', label: '망막질환', desc: '황반변성 · 당뇨망막병증 등 5종 망막질환을 질환별로 진료합니다.', badges: '', more: true, use: true, upd: '2026-03-20' },
          { id: 'sp9', seq: 9, field: '안질환', label: '녹내장', desc: '시신경 손상을 늦추기 위한 안압 관리와 치료를 진행합니다.', badges: '', more: true, use: true, upd: '2026-03-20' },
          { id: 'sp10', seq: 10, field: '안종합검진', label: '기본 프로그램', desc: '시력 · 안압 · 안저 등 기본적인 눈 건강 검진.', badges: '', more: true, use: true, upd: '2026-02-28' },
          { id: 'sp11', seq: 11, field: '안종합검진', label: '프리미엄 프로그램', desc: '정밀 장비 기반의 종합 안(眼) 검진 프로그램.', badges: '', more: true, use: true, upd: '2026-02-28' },
        ],
      },

      /* ================= 수술 전후 주의사항 ================= */
      precautions: {
        tab: '주의사항',
        title: '수술 전후 주의사항',
        singular: '주의사항',
        legacy: '',
        description: '수술·시술별 전후 주의사항 문서를 예약·마이페이지와 연결하고 노출을 관리합니다.',
        searchPlaceholder: '주의사항명 또는 연결 대상 검색',
        searchKeys: ['title', 'target'],
        filters: [
          { id: 'status', label: '상태', field: 'status', kind: 'text', options: ['전체', '운영', '연결 필요', '점검 필요'] },
          { id: 'use', label: '노출여부', field: 'use', kind: 'bool', options: ['전체', '노출', '숨김'] },
        ],
        columns: [
          { key: 'seq', label: '순서', type: 'order' },
          { key: 'title', label: '주의사항', type: 'title' },
          { key: 'target', label: '연결 대상', type: 'text' },
          { key: 'url', label: '현재 경로', type: 'text' },
          { key: 'use', label: '노출', type: 'toggle', on: '노출', off: '숨김' },
          { key: 'status', label: '상태', type: 'badge' },
        ],
        fields: [
          { key: 'title', label: '주의사항명', type: 'text', full: true, code: 'title', required: true },
          { key: 'target', label: '연결 대상', type: 'text', full: true, code: 'link_target' },
          { key: 'url', label: '현재 경로(URL)', type: 'text', full: true, code: 'legacy_url' },
          { key: 'body', label: '본문 요약', type: 'textarea', full: true, code: 'content' },
          { key: 'status', label: '연결 상태', type: 'select', options: ['운영', '연결 필요', '점검 필요'], code: 'status' },
          { key: 'use', label: '노출여부', type: 'toggle', on: '노출', off: '숨김', code: 'use_yn' },
          { key: 'upd', label: '수정일', type: 'readonly', code: 'mod_date' },
        ],
        rows: [
          { id: 'pc1', seq: 1, title: '스마일라식 주의사항', target: '스마일라식 · 예약정보', url: '/smile/smilelasik-precautions', body: '', status: '연결 필요', use: true, upd: '-' },
          { id: 'pc2', seq: 2, title: '퍼스널아이즈 주의사항', target: '퍼스널아이즈 · 예약정보', url: '/personaleyes/personaleyes-precautions', body: '', status: '연결 필요', use: true, upd: '-' },
          { id: 'pc3', seq: 3, title: '라식·라섹 주의사항', target: '라식·라섹 · 예약정보', url: '/lasereye/lasik-and-lasek-precautions', body: '', status: '연결 필요', use: true, upd: '-' },
          { id: 'pc4', seq: 4, title: '렌즈삽입술 주의사항', target: 'ICL · 예약정보', url: '/lasereye/icl-precautions', body: '', status: '연결 필요', use: true, upd: '-' },
          { id: 'pc5', seq: 5, title: '드림렌즈 주의사항', target: '드림렌즈 · 예약정보', url: '/lasereye/dreamlens-precautions', body: '', status: '연결 필요', use: true, upd: '-' },
          { id: 'pc6', seq: 6, title: '백내장 주의사항', target: '백내장 · 예약정보', url: '/eye-diseases/cataract-precautions', body: '', status: '연결 필요', use: true, upd: '-' },
          { id: 'pc7', seq: 7, title: '노안 주의사항', target: '노안 · 예약정보', url: '/eye-diseases/presbyopia-precautions', body: '', status: '연결 필요', use: true, upd: '-' },
          { id: 'pc8', seq: 8, title: 'VIVA ICL 주의사항', target: '노안교정 · 예약정보', url: '/early-onset-presbyopia/viva-icl-precautions', body: '', status: '연결 필요', use: true, upd: '-' },
        ],
      },
  })
})()
