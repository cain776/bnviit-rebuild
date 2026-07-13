/* ===========================================================
   비앤빛안과 관리 컬렉션 정의 · 데이터
   레거시 관리자(SCR-04/06/07/11/13/14) 화면 구조를 리빌드 CMS
   기준으로 재구성한 스키마 + 예시 데이터입니다.
   - views : 사이드바 뷰 → 컬렉션 탭 구성
   - collections : 컬렉션별 목록 컬럼 / 상세 필드 / 예시 행
   컬럼 type  : order | thumb | title | tag | text | toggle | num | date | stars | badge
   필드 type  : text | textarea | select | toggle | number | date | image | stars | readonly
   =========================================================== */
(function () {
  'use strict'

  // 컬렉션 정의는 도메인별 admin-collections-*.js 로 분리되어 이 객체에 병합됩니다.
  window.BNVIIT_CMS_COLLECTIONS = {
    views: {
      'hospital-info': ['hospitalInfo'],
      doctors: ['doctors'],
      'medical-systems': ['medicalSystems'],
      news: ['news'],
      onair: ['onair'],
      'research-content': ['awards', 'papers', 'partners'],
      reviews: ['reviews'],
      'vision-content': ['visionPages'],
      'compare-data': ['compareTable'],
      'specialty-content': ['specialtyCards'],
      precautions: ['precautions'],

      /* ===== 상담 · 예약 · 회원 (레거시 SCR-02/36/37/39/44/45/46/01/43 → 리빌드 상담·예약·마이페이지) ===== */
      consultations: ['consultAll', 'voicePosts'],
      bookings: ['examBookings', 'partnerBookings'],
      'booking-settings': ['bookingTypes'],
      members: ['members', 'withdrawnMembers'],
      'mypage-content': ['mypageCards'],

      /* ===== 운영 시스템 (레거시 SCR 재구성) ===== */
      events: ['eventPosts', 'issueBanners', 'subBanners', 'topBanners'],
      languages: ['languagePacks'],
      'users-permissions': ['adminUsers', 'roleGroups'],
      'policy-links': ['policyLinks'],
      'audit-log': ['auditLog'],
    },
    collections: {},
  }
})()
