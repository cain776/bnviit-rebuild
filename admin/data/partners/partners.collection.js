/* 레거시 제휴·협력 페이지(www/other/partner.php · TBL_PAGES p=109 "제휴·협력")의 협력기관 실데이터.
   레거시는 이 목록을 DB가 아닌 정적 PHP 템플릿에 하드코딩했으므로 임포터 없이 템플릿에서 옮겨 적음.
   원본 백업: bnviit-legacy-backup/2026-07-10/www/other/partner.php (백업일 2026-07-10) */
(function () {
  'use strict'
  var C = window.BNVIIT_CMS_COLLECTIONS
  if (!C || !C.collections || !C.collections.partners) return
  var def = C.collections.partners
  def.dataVersion = 'legacy-partner-php-20260710-v1'
  def.description = '레거시 제휴·협력 페이지(other/partner.php)에서 이관한 실제 협력기관 10곳입니다. 레거시는 이 목록을 DB 없이 정적 페이지로 관리했으며(로고 이미지 없음), 백업일은 2026-07-10입니다.'
  def.rows = [
    {
      id: 'legacy-partner-1', seq: 1, photo: '',
      name: 'London Place Eye Center', eng: 'London Place Eye Center',
      detail: '약 20년 동안 시력교정 전문센터로서 굴절교정 수술방법의 연구와 더불어 수술장비 및 시력교정의 전반적인 연구발전에 지원을 아끼지 않는 세계적인 아이센터. 독창적인 시술방법인 노터치(No touch)와 관련하여 2002년 교류를 시작해 현재까지 첨단시스템 및 수술방법에 관한 공동 연구를 진행.',
      link: '', tel: '', use: true, reg: '-', upd: '-',
    },
    {
      id: 'legacy-partner-2', seq: 2, photo: '',
      name: 'Jerry Tan Eye Surgery (싱가포르)', eng: 'Jerry Tan Eye Surgery, Singapore',
      detail: 'Dr. Jerry Tan Tiang Hin은 세계적인 안과 의사만이 인정받는 Global Ambassador Group의 멤버로 토포 가이드 라식의 세계적인 권위자. 협력 관계를 통해 최신의 수술을 진행.',
      link: '', tel: '', use: true, reg: '-', upd: '-',
    },
    {
      id: 'legacy-partner-3', seq: 3, photo: '',
      name: '강남세브란스병원', eng: 'GangNam Severance Hospital',
      detail: '진료 협력 병원.',
      link: 'https://gs.iseverance.com', tel: '1599-6114', use: true, reg: '-', upd: '-',
    },
    {
      id: 'legacy-partner-4', seq: 4, photo: '',
      name: '순천향대학교병원', eng: 'Soonchunhyang University Hospital',
      detail: '진료 협력 병원.',
      link: 'https://www.schmc.ac.kr/seoul/index.do', tel: '02-709-9114', use: true, reg: '-', upd: '-',
    },
    {
      id: 'legacy-partner-5', seq: 5, photo: '',
      name: '중앙대학교병원', eng: 'Chung Ang University Medical Center',
      detail: '진료 협력 병원.',
      link: 'https://ch.caumc.or.kr/index.asp', tel: '02-6299-1114', use: true, reg: '-', upd: '-',
    },
    {
      id: 'legacy-partner-6', seq: 6, photo: '',
      name: '서울성모병원', eng: "Seoul St. Mary's Hospital",
      detail: '진료 협력 병원.',
      link: 'https://www.cmcseoul.or.kr', tel: '1588-1511', use: true, reg: '-', upd: '-',
    },
    {
      id: 'legacy-partner-7', seq: 7, photo: '',
      name: '아벨리노 (주)', eng: 'Avellino Company',
      detail: '안과 질환을 연구하는 생명공학 전문 바이오 기업. DNA 아벨리노 유전자 분석으로 각막이상증을 근본적으로 찾아내 안전한 수술을 진행하며, 현재까지 분석결과를 통해 8명을 실명 위기로부터 보호.',
      link: 'https://avellino-dna.com/kr/', tel: '02-322-1687', use: true, reg: '-', upd: '-',
    },
    {
      id: 'legacy-partner-8', seq: 8, photo: '',
      name: '바이오랜드 (주)', eng: 'Bioland Korea Company',
      detail: '안과적 질환에 쓰이는 양막을 연구 개발하는 생명공학 회사. 긴밀한 협력을 통해 보다 안전한 수술로 고객의 삶의 질 향상에 기여.',
      link: '', tel: '', use: true, reg: '-', upd: '-',
    },
    {
      id: 'legacy-partner-9', seq: 9, photo: '',
      name: '아이진 (주)', eng: 'EyeGene Company',
      detail: '양막을 이용해 부작용을 최소화하는 프로젝트를 성공적으로 수행한 안과 전문 생명공학회사. 단백질체학 기반 기술로 치료제·진단제를 개발하며, 빠른 회복과 합병증 예방을 위한 AMT(양막) 수술에 협력.',
      link: 'http://eyegene.co.kr/kor/', tel: '02-322-1687', use: true, reg: '-', upd: '-',
    },
    {
      id: 'legacy-partner-10', seq: 10, photo: '',
      name: '테고사이언스 (주)', eng: 'Tego Science',
      detail: '세계 수준의 세포배양 기술로 상처치유용 피부와 각막을 연구·생산하는 세포배양 전문 생명공학기업. 각막 손상치료용 생물학적 드레싱제 칼로아이(KALOEYE)를 제공.',
      link: 'https://www.tegoscience.com', tel: '', use: true, reg: '-', upd: '-',
    },
  ]
  def.snapshotMeta = { source: '레거시 정적 페이지 · other/partner.php (TBL_PAGES p=109)', backupDate: '2026-07-10', activeCount: def.rows.length }
})()
