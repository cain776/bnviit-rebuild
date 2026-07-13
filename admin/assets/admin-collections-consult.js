/* 상담 · 예약 · 회원 그룹 컬렉션 — window.BNVIIT_CMS_COLLECTIONS.collections 에 병합 */
(function () {
  'use strict'

  const C = window.BNVIIT_CMS_COLLECTIONS = window.BNVIIT_CMS_COLLECTIONS || { views: {}, collections: {} }
  C.collections = C.collections || {}

  Object.assign(C.collections, {
      /* ===================================================================
         상담 관리 · 전 채널 상담 신청 통합 (SCR-02 / 36 / 37 · 리빌드 상담 신청 폼)
         =================================================================== */
      consultAll: {
        tab: '상담 신청',
        title: '상담 관리',
        singular: '상담',
        legacy: 'SCR-02 · 36 · 37',
        description: '온라인·전화·카카오·이벤트 등 전 채널 상담 신청을 통합 조회하고 처리여부·콜여부·예약전환과 답변을 관리합니다. 상담 내용은 민감정보로 열람 시 감사로그에 기록됩니다. (counsel/all_list)',
        searchPlaceholder: '이름 · 연락처 · 상담내용 검색',
        searchKeys: ['name', 'phone', 'memo'],
        filters: [
          { id: 'channel', label: '구분', field: 'channel', kind: 'text', options: ['전체', '온라인', '전화', '카카오', '이벤트'] },
          { id: 'field', label: '상담분야', field: 'field', kind: 'text', options: ['전체', '시력교정', '백내장·노안', '렌즈삽입술', '드림렌즈', '안질환·기타'] },
          { id: 'confirm', label: '처리여부', field: 'confirm', kind: 'bool', options: ['전체', '완료', '대기'] },
        ],
        columns: [
          { key: 'channel', label: '구분', type: 'tag' },
          { key: 'field', label: '상담분야', type: 'text' },
          { key: 'name', label: '이름', type: 'title' },
          { key: 'phone', label: '연락처', type: 'text' },
          { key: 'time', label: '희망시간', type: 'text' },
          { key: 'confirm', label: '처리', type: 'toggle', on: '완료', off: '대기' },
          { key: 'call', label: '콜', type: 'toggle', on: '통화완료', off: '미통화' },
          { key: 'reserve', label: '예약전환', type: 'toggle', on: '예약', off: '미예약' },
          { key: 'reg', label: '등록일', type: 'date' },
        ],
        fields: [
          { key: 'name', label: '이름', type: 'text', code: 'con_nm', required: true },
          { key: 'phone', label: '휴대폰번호', type: 'text', code: 'con_hp' },
          { key: 'birth', label: '생년월일', type: 'text', code: 'con_birth' },
          { key: 'channel', label: '구분(채널)', type: 'select', options: ['온라인', '전화', '카카오', '이벤트'], code: 'category' },
          { key: 'field', label: '상담분야', type: 'select', options: ['시력교정', '백내장·노안', '렌즈삽입술', '드림렌즈', '안질환·기타'], code: 'counsel_type' },
          { key: 'time', label: '희망 상담시간', type: 'select', options: ['평일 오전', '평일 오후', '평일 저녁', '주말'], code: 'wish_time' },
          { key: 'memo', label: '상담 내용', type: 'textarea', full: true, code: 'contents' },
          { key: 'referer', label: '유입 경로', type: 'text', code: 'referer' },
          { key: 'confirm', label: '처리여부', type: 'toggle', on: '완료', off: '대기', code: 'con_isconfirm' },
          { key: 'call', label: '콜여부', type: 'toggle', on: '통화완료', off: '미통화', code: 'con_iscall' },
          { key: 'reserve', label: '예약전환', type: 'toggle', on: '예약', off: '미예약', code: 'con_isreserve' },
          { key: 'answer', label: '답변 · 상담 메모', type: 'textarea', full: true, code: 'answer' },
          { key: 'reg', label: '등록일', type: 'readonly', code: 'reg_date' },
        ],
        rows: [
          { id: 'cs1', channel: '온라인', field: '시력교정', name: '최지우', phone: '010-****-****', birth: '1994-02-11', time: '평일 오후', memo: '고도근시(-8.0D)에 각막이 얇은 편이라고 들었는데, 스마일프로가 가능한지 렌즈삽입술이 더 맞는지 궁금합니다.', referer: '네이버 검색', confirm: true, call: true, reserve: true, answer: '정밀검사 후 각막 두께·교정량을 함께 검토하도록 안내. 고도근시·얇은 각막은 렌즈삽입술(ICL) 우선 검토 대상.', reg: '2026-07-05' },
          { id: 'cs2', channel: '전화', field: '시력교정', name: '박도윤', phone: '010-****-****', birth: '1990-08-03', time: '평일 오전', memo: '스마일프로 수술 비용과 검사 비용이 궁금해 전화 상담을 신청했습니다.', referer: '지인 소개', confirm: true, call: true, reserve: false, answer: '비급여 진료비 항목 안내 · 정밀검사 후 확정 견적 안내 완료.', reg: '2026-06-28' },
          { id: 'cs3', channel: '카카오', field: '시력교정', name: '홍길동', phone: '010-****-****', birth: '1988-11-20', time: '평일 저녁', memo: '-10.0D 정도 고도근시인데 시력교정 수술이 가능한지 문의드립니다.', referer: '카카오 채널', confirm: false, call: false, reserve: false, answer: '', reg: '2026-06-15' },
          { id: 'cs4', channel: '전화', field: '백내장·노안', name: '김영희', phone: '010-****-****', birth: '1968-05-14', time: '평일 오전', memo: '노안과 백내장을 동시에 교정할 수 있는지 상담 원합니다.', referer: '홈페이지', confirm: false, call: false, reserve: false, answer: '', reg: '2026-07-06' },
          { id: 'cs5', channel: '이벤트', field: '렌즈삽입술', name: '이철수', phone: '010-****-****', birth: '1996-01-09', time: '주말', memo: '여름 이벤트를 보고 렌즈삽입술(ICL) 상담을 신청합니다.', referer: '이벤트 페이지', confirm: true, call: true, reserve: false, answer: '이벤트 대상 확인 · 방문 상담 예약 안내.', reg: '2026-07-02' },
          { id: 'cs6', channel: '온라인', field: '드림렌즈', name: '윤가은', phone: '010-****-****', birth: '2014-03-22', time: '평일 오후', memo: '초등학생 자녀의 근시 진행 억제를 위해 드림렌즈 상담을 원합니다.', referer: '네이버 블로그', confirm: false, call: false, reserve: false, answer: '', reg: '2026-07-08' },
          { id: 'cs7', channel: '전화', field: '안질환·기타', name: '정하람', phone: '010-****-****', birth: '1979-09-30', time: '평일 저녁', memo: '눈 건조와 충혈이 잦아 정밀 검사를 받고 싶습니다.', referer: '검색', confirm: true, call: false, reserve: false, answer: '', reg: '2026-06-30' },
          { id: 'cs8', channel: '카카오', field: '시력교정', name: '한도현', phone: '010-****-****', birth: '1992-07-07', time: '평일 오전', memo: '스마일라식 야간 빛번짐이 걱정되는데 상담이 가능할까요?', referer: '카카오 채널', confirm: false, call: false, reserve: false, answer: '', reg: '2026-07-09' },
        ],
      },

      /* ================= 고객의 소리 (SCR-44 · 리빌드 마이페이지 Q&A) ================= */
      voicePosts: {
        tab: '고객의 소리',
        title: '고객의 소리',
        singular: '문의',
        legacy: 'SCR-44',
        description: '마이페이지 고객의 소리(Q&A) 문의를 접수하고 답변을 등록합니다. 답변 완료 시 작성 회원의 마이페이지에 노출됩니다. (counsel/qna_list)',
        searchPlaceholder: '제목 · 작성자 · 내용 검색',
        searchKeys: ['title', 'writer', 'content'],
        filters: [
          { id: 'type', label: '유형', field: 'type', kind: 'text', options: ['전체', '예약·수술 문의', '검사 결과', '시설·편의', '기타'] },
          { id: 'answered', label: '처리여부', field: 'answered', kind: 'bool', options: ['전체', '답변완료', '답변대기'] },
        ],
        columns: [
          { key: 'reg', label: '접수일', type: 'date' },
          { key: 'type', label: '유형', type: 'tag' },
          { key: 'title', label: '제목', type: 'title' },
          { key: 'writer', label: '작성자', type: 'text' },
          { key: 'answered', label: '답변', type: 'toggle', on: '답변완료', off: '답변대기' },
        ],
        fields: [
          { key: 'type', label: '문의 유형', type: 'select', options: ['예약·수술 문의', '검사 결과', '시설·편의', '기타'], code: 'qna_type' },
          { key: 'title', label: '제목', type: 'text', full: true, code: 'title', required: true },
          { key: 'writer', label: '작성자', type: 'text', code: 'm_nm' },
          { key: 'content', label: '문의 내용', type: 'textarea', full: true, code: 'contents' },
          { key: 'answer', label: '답변 내용', type: 'textarea', full: true, code: 'answer' },
          { key: 'answerer', label: '답변자', type: 'text', code: 'answer_adm' },
          { key: 'answered', label: '처리여부', type: 'toggle', on: '답변완료', off: '답변대기', code: 'is_answer' },
          { key: 'reg', label: '접수일', type: 'readonly', code: 'reg_date' },
          { key: 'answerDate', label: '답변일', type: 'readonly', code: 'answer_date' },
        ],
        rows: [
          { id: 'vo1', type: '시설·편의', title: '주차장 이용 관련 문의', writer: '김비앤', content: '평일 오전 방문 시 주차 공간이 부족한 경우가 있어 문의드립니다. 혼잡 시간대 이용 방법이 궁금합니다.', answer: '지하 2~4층 주차장을 이용하실 수 있으며, 오전 10~11시 혼잡 시간대에는 인근 공영주차장 제휴가 가능합니다. 방문 시 데스크에서 주차권을 안내해드리겠습니다.', answerer: '고객지원팀', answered: true, reg: '2026-07-02', answerDate: '2026-07-03' },
          { id: 'vo2', type: '검사 결과', title: '검사 결과지 재발급 요청', writer: '이서연', content: '이전에 받은 정밀검사 결과지를 분실했는데 재발급이 가능한지 궁금합니다.', answer: '', answerer: '', answered: false, reg: '2026-06-18', answerDate: '-' },
          { id: 'vo3', type: '예약·수술 문의', title: '예약 시간 변경이 가능한가요?', writer: '박도윤', content: '검사 예약 시간을 오후로 변경하고 싶습니다.', answer: '예약 변경은 방문 1일 전까지 가능하며, 상담팀에서 유선으로 조정해드렸습니다.', answerer: '상담팀', answered: true, reg: '2026-06-15', answerDate: '2026-06-16' },
          { id: 'vo4', type: '기타', title: '수술 후 관리 안내 자료를 받고 싶어요', writer: '홍길동', content: '수술 후 주의사항과 관리 방법을 정리된 자료로 받고 싶습니다.', answer: '', answerer: '', answered: false, reg: '2026-07-06', answerDate: '-' },
          { id: 'vo5', type: '예약·수술 문의', title: '렌즈삽입술 비용 안내 부탁드립니다', writer: '최지우', content: '렌즈삽입술(ICL) 수술 비용 범위가 궁금합니다.', answer: '렌즈 종류·도수에 따라 상이하여 정밀검사 후 확정 견적을 안내드립니다.', answerer: '상담팀', answered: true, reg: '2026-06-10', answerDate: '2026-06-11' },
        ],
      },

      /* ===================================================================
         예약 관리 · 검사/수술 예약 (SCR-39 · 리빌드 검사 예약 폼)
         =================================================================== */
      examBookings: {
        tab: '검사·수술 예약',
        title: '예약 관리',
        singular: '예약',
        legacy: 'SCR-39',
        description: '홈페이지 검사 예약(100% 사전예약제) 신청을 조회하고 예약 상태·콜 처리·방문 결과를 관리합니다. (counsel/online_list)',
        searchPlaceholder: '이름 · 연락처 · 검사종류 검색',
        searchKeys: ['name', 'phone', 'type'],
        filters: [
          { id: 'status', label: '예약상태', field: 'status', kind: 'text', options: ['전체', '예약대기', '예약확정', '방문완료', '취소', '노쇼'] },
          { id: 'type', label: '검사종류', field: 'type', kind: 'text', options: ['전체', '정밀 시력교정 검사', '백내장·노안 검사', '렌즈삽입술 상담검사', '안질환·정밀 안검진'] },
        ],
        columns: [
          { key: 'wish', label: '예약일시', type: 'date' },
          { key: 'type', label: '검사종류', type: 'tag' },
          { key: 'name', label: '이름', type: 'title' },
          { key: 'phone', label: '연락처', type: 'text' },
          { key: 'ref', label: '접수번호', type: 'text' },
          { key: 'call', label: '콜', type: 'toggle', on: '통화완료', off: '미통화' },
          { key: 'status', label: '상태', type: 'badge' },
          { key: 'reg', label: '신청일', type: 'date' },
        ],
        fields: [
          { key: 'name', label: '이름', type: 'text', code: 'con_nm', required: true },
          { key: 'phone', label: '휴대폰번호', type: 'text', code: 'con_hp' },
          { key: 'birth', label: '생년월일', type: 'text', code: 'con_birth' },
          { key: 'type', label: '검사종류', type: 'select', options: ['정밀 시력교정 검사', '백내장·노안 검사', '렌즈삽입술 상담검사', '안질환·정밀 안검진'], code: 'surgery_nm' },
          { key: 'wish', label: '희망 예약일시', type: 'text', code: 'wish_datetime' },
          { key: 'status', label: '예약상태', type: 'select', options: ['예약대기', '예약확정', '방문완료', '취소', '노쇼'], code: 'rev_status' },
          { key: 'call', label: '콜여부', type: 'toggle', on: '통화완료', off: '미통화', code: 'con_iscall' },
          { key: 'memo', label: '상담 · 처리 메모', type: 'textarea', full: true, code: 'memo' },
          { key: 'ref', label: '접수번호', type: 'readonly', code: 'ref_no' },
          { key: 'reg', label: '신청일', type: 'readonly', code: 'reg_date' },
        ],
        rows: [
          { id: 'ex1', wish: '2026-07-15 10:00', type: '정밀 시력교정 검사', name: '김비앤', phone: '010-****-****', birth: '1993-04-18', status: '예약확정', call: true, memo: 'D-7 · 스마일프로 상담 연계', ref: 'E20360715', reg: '2026-07-05' },
          { id: 'ex2', wish: '2026-07-10 15:00', type: '렌즈삽입술 상담검사', name: '박민수', phone: '010-****-****', birth: '1991-02-02', status: '방문완료', call: true, memo: '', ref: 'E20360710', reg: '2026-07-03' },
          { id: 'ex3', wish: '2026-07-09 11:00', type: '정밀 시력교정 검사', name: '홍길동', phone: '010-****-****', birth: '1988-11-20', status: '예약대기', call: false, memo: '', ref: 'E20360709', reg: '2026-07-06' },
          { id: 'ex4', wish: '2026-07-12 14:30', type: '안질환·정밀 안검진', name: '이철수', phone: '010-****-****', birth: '1975-11-03', status: '예약확정', call: false, memo: '', ref: 'E20360712', reg: '2026-07-04' },
          { id: 'ex5', wish: '2026-07-08 09:30', type: '백내장·노안 검사', name: '김영희', phone: '010-****-****', birth: '1968-05-14', status: '취소', call: true, memo: '개인 사정으로 취소 요청', ref: 'E20360708', reg: '2026-07-01' },
          { id: 'ex6', wish: '2026-07-11 16:00', type: '정밀 시력교정 검사', name: '한도현', phone: '010-****-****', birth: '1992-07-07', status: '노쇼', call: true, memo: '방문 미도래 · 재예약 안내 발송', ref: 'E20360711', reg: '2026-07-02' },
        ],
      },

      /* ================= 제휴고객 예약 (SCR-46 · 리빌드 제휴고객 예약 폼) ================= */
      partnerBookings: {
        tab: '제휴고객 예약',
        title: '제휴고객 예약',
        singular: '제휴예약',
        legacy: 'SCR-46',
        description: '제휴처를 통해 접수된 고객 예약을 조회하고 예약 상태·시술·방문 결과를 관리합니다. (counsel/all_cevent_list)',
        searchPlaceholder: '제휴처 · 고객명 · 연락처 검색',
        searchKeys: ['partner', 'name', 'phone'],
        filters: [
          { id: 'partner', label: '제휴처', field: 'partner', kind: 'text', options: ['전체', '롯데면세점 제휴', '삼성카드 멤버십', '현대백화점 VIP', '임직원 복지몰'] },
          { id: 'status', label: '상태', field: 'status', kind: 'text', options: ['전체', '예약', '완료', '취소'] },
        ],
        columns: [
          { key: 'reg', label: '신청일', type: 'date' },
          { key: 'partner', label: '제휴처', type: 'tag' },
          { key: 'name', label: '고객명', type: 'title' },
          { key: 'phone', label: '연락처', type: 'text' },
          { key: 'rev', label: '예약일시', type: 'date' },
          { key: 'surgery', label: '시술명', type: 'text' },
          { key: 'status', label: '상태', type: 'badge' },
        ],
        fields: [
          { key: 'partner', label: '제휴처명', type: 'select', options: ['롯데면세점 제휴', '삼성카드 멤버십', '현대백화점 VIP', '임직원 복지몰'], code: 'partner_nm', required: true },
          { key: 'name', label: '고객명', type: 'text', code: 'm_nm', required: true },
          { key: 'phone', label: '연락처', type: 'text', code: 'con_hp' },
          { key: 'rev', label: '예약일시', type: 'text', code: 'rev_dt' },
          { key: 'surgery', label: '시술명', type: 'select', options: ['스마일라식', '스마일프로', '노안교정 라식', '렌즈삽입술(ICL)', '백내장 다초점'], code: 'op_nm' },
          { key: 'status', label: '예약 상태', type: 'select', options: ['예약', '완료', '취소'], code: 'status' },
          { key: 'memo', label: '상담 메모', type: 'textarea', full: true, code: 'memo' },
          { key: 'reg', label: '신청일', type: 'readonly', code: 'reg_dt' },
        ],
        rows: [
          { id: 'pb1', partner: '롯데면세점 제휴', name: '홍서동', phone: '010-****-****', rev: '2026-07-10 14:00', surgery: '스마일라식', status: '완료', memo: '제휴 할인 적용', reg: '2026-06-30' },
          { id: 'pb2', partner: '삼성카드 멤버십', name: '김서희', phone: '010-****-****', rev: '2026-07-14 11:00', surgery: '노안교정 라식', status: '예약', memo: '', reg: '2026-07-02' },
          { id: 'pb3', partner: '현대백화점 VIP', name: '이수민', phone: '010-****-****', rev: '2026-07-09 15:30', surgery: '렌즈삽입술(ICL)', status: '취소', memo: '일정 변경으로 취소', reg: '2026-06-28' },
          { id: 'pb4', partner: '임직원 복지몰', name: '정가온', phone: '010-****-****', rev: '2026-07-16 10:30', surgery: '스마일프로', status: '예약', memo: '단체 제휴 3인 중 1인', reg: '2026-07-05' },
        ],
      },

      /* ===================================================================
         예약 운영 설정 · 예약 유형/슬롯 (리빌드 검사 예약 폼 · 100% 사전예약제)
         =================================================================== */
      bookingTypes: {
        tab: '예약 유형·슬롯',
        title: '예약 운영 설정',
        singular: '예약 유형',
        legacy: 'SCR-39 연계',
        description: '홈페이지 예약 폼에 노출되는 상담·검사·수술 유형별 소요시간, 1일 정원, 운영 요일·시간, 예약 간격과 사용 여부를 관리합니다. (booking_config)',
        searchPlaceholder: '예약 유형명 검색',
        searchKeys: ['name', 'kind'],
        filters: [
          { id: 'kind', label: '구분', field: 'kind', kind: 'text', options: ['전체', '상담', '검사', '수술'] },
          { id: 'use', label: '사용여부', field: 'use', kind: 'bool', options: ['전체', '사용', '미사용'] },
        ],
        columns: [
          { key: 'seq', label: '순서', type: 'order' },
          { key: 'name', label: '예약 유형', type: 'title' },
          { key: 'kind', label: '구분', type: 'tag' },
          { key: 'duration', label: '소요시간', type: 'text' },
          { key: 'capacity', label: '1일 정원', type: 'num' },
          { key: 'days', label: '운영 요일', type: 'text' },
          { key: 'use', label: '사용', type: 'toggle', on: '사용', off: '미사용' },
        ],
        fields: [
          { key: 'name', label: '예약 유형명', type: 'text', full: true, code: 'type_name', required: true },
          { key: 'kind', label: '구분', type: 'select', options: ['상담', '검사', '수술'], code: 'type_kind' },
          { key: 'duration', label: '소요시간', type: 'text', code: 'duration' },
          { key: 'capacity', label: '1일 정원', type: 'number', code: 'day_capacity' },
          { key: 'days', label: '운영 요일', type: 'text', code: 'open_days' },
          { key: 'timeRange', label: '운영 시간', type: 'text', code: 'open_time' },
          { key: 'slot', label: '예약 간격(분)', type: 'number', code: 'slot_min' },
          { key: 'guide', label: '예약 안내 문구', type: 'textarea', full: true, code: 'guide' },
          { key: 'use', label: '사용여부', type: 'toggle', on: '사용', off: '미사용', code: 'use_yn' },
          { key: 'upd', label: '수정일', type: 'readonly', code: 'mod_date' },
        ],
        rows: [
          { id: 'bt1', seq: 1, name: '시력교정 상담', kind: '상담', duration: '30분', capacity: 24, days: '월~토', timeRange: '09:30~17:30', slot: 30, guide: '상담 후 정밀검사 일정을 함께 안내합니다.', use: true, upd: '2026-07-08' },
          { id: 'bt2', seq: 2, name: '노안·백내장 상담', kind: '상담', duration: '30분', capacity: 16, days: '월~금', timeRange: '09:30~16:30', slot: 30, guide: '', use: true, upd: '2026-06-20' },
          { id: 'bt3', seq: 3, name: '정밀 시력교정 검사', kind: '검사', duration: '90분', capacity: 12, days: '월~토', timeRange: '09:30~16:00', slot: 20, guide: '검사 약 2시간 소요 · 콘택트렌즈 착용 중단 안내가 필요합니다.', use: true, upd: '2026-07-08' },
          { id: 'bt4', seq: 4, name: '렌즈삽입술 상담검사', kind: '검사', duration: '120분', capacity: 8, days: '월~금', timeRange: '09:30~15:00', slot: 30, guide: '', use: true, upd: '2026-05-02' },
          { id: 'bt5', seq: 5, name: '안질환·정밀 안검진', kind: '검사', duration: '60분', capacity: 10, days: '월~토', timeRange: '09:30~16:30', slot: 20, guide: '', use: true, upd: '2026-04-11' },
          { id: 'bt6', seq: 6, name: '수술(스마일·라식·라섹)', kind: '수술', duration: '반일', capacity: 6, days: '화·목·토', timeRange: '오전 지정', slot: 60, guide: '수술 전 정밀검사를 완료한 고객만 예약 가능합니다.', use: false, upd: '2026-03-18' },
        ],
      },

      /* ===================================================================
         회원 관리 · 가입 회원 (SCR-01 · 리빌드 로그인/회원가입/마이페이지)
         =================================================================== */
      members: {
        tab: '회원',
        title: '회원 관리',
        singular: '회원',
        legacy: 'SCR-01 · TBL_MEMBER',
        description: '홈페이지 가입 회원의 계정·연락처·가입경로·본인인증·마케팅 수신 동의를 관리합니다. 목록은 개인정보 마스킹 표본이며, 시력 등 민감정보 열람은 감사로그에 기록됩니다. (manager/member/member_list.php)',
        searchPlaceholder: '이름 · 아이디 · 연락처 · 이메일 검색',
        searchKeys: ['name', 'loginId', 'phone', 'email'],
        filters: [
          { id: 'join', label: '회원구분', field: 'join', kind: 'text', options: ['전체', '일반', '네이버', '카카오', '구글'] },
          { id: 'hpVerify', label: '휴대폰인증', field: 'hpVerify', kind: 'bool', options: ['전체', '인증', '미인증'] },
          { id: 'marketing', label: '이메일수신', field: 'marketing', kind: 'bool', options: ['전체', '동의', '거부'] },
        ],
        columns: [
          { key: 'loginId', label: '아이디', type: 'text' },
          { key: 'name', label: '이름', type: 'title' },
          { key: 'gender', label: '성별', type: 'tag' },
          { key: 'birth', label: '생년월일', type: 'text' },
          { key: 'phone', label: '연락처', type: 'text' },
          { key: 'email', label: '이메일', type: 'text' },
          { key: 'join', label: '회원구분', type: 'tag' },
          { key: 'hpVerify', label: '휴대폰인증', type: 'toggle', on: '인증', off: '미인증' },
          { key: 'marketing', label: '이메일수신', type: 'toggle', on: '동의', off: '거부' },
          { key: 'reg', label: '가입일', type: 'date' },
        ],
        fields: [
          { key: 'loginId', label: '아이디 (마스킹)', type: 'readonly', code: 'm_id' },
          { key: 'name', label: '이름 (마스킹)', type: 'readonly', code: 'm_name' },
          { key: 'gender', label: '성별', type: 'select', options: ['남', '여', '-'], code: 'm_gender' },
          { key: 'birth', label: '생년월일 (연도만)', type: 'readonly', code: 'm_birth' },
          { key: 'phone', label: '휴대폰 (마스킹)', type: 'readonly', code: 'm_hp' },
          { key: 'email', label: '이메일 (마스킹)', type: 'readonly', code: 'm_email' },
          { key: 'join', label: '회원구분(가입경로)', type: 'select', options: ['일반', '네이버', '카카오', '구글'], code: 'm_type' },
          { key: 'hpVerify', label: '휴대폰 본인인증', type: 'toggle', on: '인증', off: '미인증', code: 'hp_verify_yn' },
          { key: 'marketing', label: '이메일 수신동의', type: 'toggle', on: '동의', off: '거부', code: 'email_agree' },
          { key: 'snsLinked', label: '소셜 계정 연동', type: 'toggle', on: '연동', off: '-', code: 'm_sns_id' },
          { key: 'crmLinked', label: 'CRM 연동', type: 'toggle', on: '연동', off: '-', code: 'crm_idx' },
          { key: 'reg', label: '가입일', type: 'readonly', code: 'm_datetime' },
          { key: 'last', label: '최근 접속', type: 'readonly', code: 'm_today_login' },
        ],
        rows: [
          { id: 'mb1', loginId: 'bnviit_kim', name: '김비앤', gender: '여', birth: '1993-04-18', phone: '010-****-****', email: 'bn***@gmail.com', join: '카카오', marketing: true, status: '정상', memo: '카카오 연동 회원 · 스마일프로 상담 진행 중', reg: '2024-11-02', last: '2026-07-08' },
          { id: 'mb2', loginId: 'hong123', name: '홍길동', gender: '남', birth: '1990-01-01', phone: '010-****-****', email: 'h***@mail.com', join: '이메일', marketing: true, status: '정상', memo: '', reg: '2019-03-11', last: '2026-07-05' },
          { id: 'mb3', loginId: 'NAVER_a1b2c3', name: '김영희', gender: '여', birth: '1988-05-20', phone: '010-****-****', email: 'y***@naver.com', join: '네이버', marketing: false, status: '정상', memo: '', reg: '2022-06-14', last: '2026-06-30' },
          { id: 'mb4', loginId: 'KAKAO_e5f6g7', name: '이철수', gender: '남', birth: '1975-11-03', phone: '010-****-****', email: '', join: '카카오', marketing: true, status: '정상', memo: '', reg: '2023-09-04', last: '2026-07-02' },
          { id: 'mb5', loginId: 'seoyeon94', name: '이서연', gender: '여', birth: '1994-02-11', phone: '010-****-****', email: 's***@gmail.com', join: '구글', marketing: true, status: '정상', memo: '후기 작성 회원', reg: '2025-05-14', last: '2026-07-06' },
          { id: 'mb6', loginId: 'doyoon_p', name: '박도윤', gender: '남', birth: '1990-08-03', phone: '010-****-****', email: 'd***@naver.com', join: '네이버', marketing: false, status: '휴면', memo: '1년 이상 미접속 · 휴면 전환', reg: '2021-02-15', last: '2025-03-02' },
          { id: 'mb7', loginId: 'gaeun_y', name: '윤가은', gender: '여', birth: '2014-03-22', phone: '010-****-****', email: 'g***@gmail.com', join: '이메일', marketing: true, status: '정상', memo: '드림렌즈 · 미성년 보호자 동의 등록', reg: '2026-01-08', last: '2026-07-08' },
          { id: 'mb8', loginId: 'apple_h9', name: '한도현', gender: '남', birth: '1992-07-07', phone: '010-****-****', email: 'privaterelay***@icloud.com', join: '애플', marketing: false, status: '정상', memo: '', reg: '2025-12-04', last: '2026-07-09' },
        ],
      },

      /* ================= 탈퇴 회원 조회 (SCR-43 · 읽기 전용) ================= */
      withdrawnMembers: {
        tab: '탈퇴 회원',
        title: '탈퇴 회원 조회',
        singular: '탈퇴 회원',
        legacy: 'SCR-43 · TBL_MEMBER(M_LEAVE_DATE)',
        readOnly: true,
        description: '탈퇴한 회원(M_LEAVE_DATE 존재)의 가입·탈퇴 이력을 조회합니다. 레거시에는 탈퇴사유 컬럼이 없습니다. 개인정보는 관계 법령 보존기간 경과 후 파기됩니다. (읽기 전용 · manager/member/quit_list.php)',
        searchPlaceholder: '아이디 · 이름 검색',
        searchKeys: ['loginId', 'name'],
        filters: [
          { id: 'join', label: '회원구분', field: 'join', kind: 'text', options: ['전체', '일반', '네이버', '카카오', '구글'] },
        ],
        columns: [
          { key: 'loginId', label: '아이디', type: 'text' },
          { key: 'name', label: '이름', type: 'title' },
          { key: 'gender', label: '성별', type: 'tag' },
          { key: 'join', label: '회원구분', type: 'tag' },
          { key: 'reg', label: '가입일', type: 'date' },
          { key: 'quit', label: '탈퇴일', type: 'date' },
        ],
        fields: [],
        rows: [
          { id: 'wm1', loginId: 'hong***', name: '홍*동', gender: '남', reg: '2019-03-11', quit: '2026-06-28', reason: '개인정보 삭제를 원함', quitType: '본인 탈퇴', rejoin: true },
          { id: 'wm2', loginId: 'kim***', name: '김*희', gender: '여', reg: '2020-07-02', quit: '2026-06-25', reason: '마케팅 알림이 부담됨', quitType: '본인 탈퇴', rejoin: true },
          { id: 'wm3', loginId: 'lee***', name: '이*수', gender: '남', reg: '2021-05-19', quit: '2026-06-21', reason: '타 병원 이용 예정', quitType: '본인 탈퇴', rejoin: false },
          { id: 'wm4', loginId: 'park**', name: '박*철', gender: '남', reg: '2022-01-10', quit: '2026-05-30', reason: '장기 미이용 · 관리자 정리', quitType: '관리자 처리', rejoin: true },
        ],
      },

      /* ===================================================================
         마이페이지 구성 · 메뉴 카드 (리빌드 MypageContent 5개 카드)
         =================================================================== */
      mypageCards: {
        tab: '마이페이지 카드',
        title: '마이페이지 구성',
        singular: '카드',
        legacy: 'SCR-01 연계',
        description: '로그인 후 마이페이지에 노출되는 메뉴 카드의 제목·설명·배지·연결 페이지와 노출 순서, 공개 여부를 관리합니다. (리빌드 MypageContent)',
        searchPlaceholder: '카드명 또는 설명 검색',
        searchKeys: ['title', 'desc'],
        filters: [
          { id: 'theme', label: '아이콘 테마', field: 'theme', kind: 'text', options: ['전체', '계정', '예약', '후기', '문의', '상담'] },
          { id: 'use', label: '노출여부', field: 'use', kind: 'bool', options: ['전체', '노출', '숨김'] },
        ],
        columns: [
          { key: 'seq', label: '순서', type: 'order' },
          { key: 'title', label: '카드명', type: 'title' },
          { key: 'theme', label: '테마', type: 'tag' },
          { key: 'desc', label: '설명', type: 'text' },
          { key: 'badge', label: '배지', type: 'text' },
          { key: 'link', label: '연결', type: 'text' },
          { key: 'use', label: '노출', type: 'toggle', on: '노출', off: '숨김' },
        ],
        fields: [
          { key: 'title', label: '카드 제목', type: 'text', full: true, code: 'card_title', required: true },
          { key: 'desc', label: '설명', type: 'textarea', full: true, code: 'card_desc' },
          { key: 'theme', label: '아이콘 테마', type: 'select', options: ['계정', '예약', '후기', '문의', '상담'], code: 'icon_theme' },
          { key: 'badge', label: '배지 문구', type: 'text', code: 'badge_text' },
          { key: 'link', label: '연결 페이지', type: 'select', options: ['계정 정보(acct)', '예약·주의사항(reserve)', '후기 작성(review)', '고객의 소리(voice)', '상담 내역(consult)'], code: 'link_page' },
          { key: 'wide', label: '와이드(전체 너비)', type: 'toggle', on: '와이드', off: '기본', code: 'is_wide' },
          { key: 'use', label: '노출여부', type: 'toggle', on: '노출', off: '숨김', code: 'use_yn' },
          { key: 'upd', label: '수정일', type: 'readonly', code: 'mod_date' },
        ],
        rows: [
          { id: 'mp1', seq: 1, title: '로그인 정보', theme: '계정', desc: '이름 · 연락처, 비밀번호, 소셜 계정 연동을 관리합니다.', badge: '카카오 연동됨', link: '계정 정보(acct)', wide: false, use: true, upd: '2026-07-08' },
          { id: 'mp2', seq: 2, title: '예약 정보 및 주의사항', theme: '예약', desc: '다가오는 예약을 확인하고 수술 전·후 주의사항을 챙기세요.', badge: 'D-7 예약 1건', link: '예약·주의사항(reserve)', wide: false, use: true, upd: '2026-07-08' },
          { id: 'mp3', seq: 3, title: '후기 등록', theme: '후기', desc: '수술 경험을 후기로 남겨 다른 분들의 선택을 도와주세요.', badge: '작성 가능한 후기 1건', link: '후기 작성(review)', wide: false, use: true, upd: '2026-06-20' },
          { id: 'mp4', seq: 4, title: '고객의 소리', theme: '문의', desc: '이용 중 불편이나 제안을 접수하고 답변을 확인합니다.', badge: '답변 완료 1건', link: '고객의 소리(voice)', wide: false, use: true, upd: '2026-07-03' },
          { id: 'mp5', seq: 5, title: '상담 내역', theme: '상담', desc: '온라인 · 전화 · 카카오 상담 신청 내역과 답변을 확인합니다.', badge: '전체 3건 · 대기 1건', link: '상담 내역(consult)', wide: true, use: true, upd: '2026-07-05' },
        ],
      },
  })
})()
