/* 자동 생성 — 로컬 레거시 DB 백업의 글로벌 공지(TBL_NOTICE_FR) 실데이터.
   원본: 로컬 백업 DB · TBL_NOTICE_FR / 백업일 2026-07-10. 공지(news) 뷰에 '글로벌 공지' 탭으로 등록. */
(function () {
  'use strict'
  var C = window.BNVIIT_CMS_COLLECTIONS
  if (!C || !C.collections || !C.views) return
  var snapshot = {
  "formatVersion": 1,
  "dataset": "bnviit-notice-fr",
  "dataVersion": "legacy-tbl-notice-fr-20260710-v1",
  "generatedAt": "2026-07-11T23:15:05.402Z",
  "source": {
    "label": "로컬 백업 DB · TBL_NOTICE_FR",
    "kind": "local-backup",
    "database": "bseyecom_db",
    "table": "TBL_NOTICE_FR",
    "backupDate": "2026-07-10",
    "dumpFile": "db/bseyecom_full_20260710.sql.gz",
    "serverAccess": false,
    "imageSupplement": "백업에 없는 썸네일은 www.bnviit.com/upload_data/notice_fr/ 에서 내려받아 로컬 복사본으로 보관",
    "rowFilter": "DEL_TF = 'N'",
    "orderBy": "DISP_SEQ ASC, REG_DATE DESC",
    "phpReferences": [
      "글로벌 사이트(english/chinese/japanese.bnviit.com) 공지 화면 — 국문 홈페이지에는 노출되지 않음",
      "www/manager/notice_fr/notice_write.php (작성자·제목·본문·썸네일·메인/상단 노출·공개여부·언어)"
    ]
  },
  "schema": {
    "legacyColumns": [
      {
        "name": "N_NO",
        "definition": "`N_NO` int(10) NOT NULL AUTO_INCREMENT COMMENT '뉴스 번호'"
      },
      {
        "name": "LANG",
        "definition": "`LANG` varchar(20) DEFAULT NULL COMMENT '언어'"
      },
      {
        "name": "N_NAME",
        "definition": "`N_NAME` varchar(30) NOT NULL DEFAULT '' COMMENT '뉴스 이름'"
      },
      {
        "name": "N_TITLE",
        "definition": "`N_TITLE` varchar(300) NOT NULL DEFAULT '' COMMENT '뉴스 제목'"
      },
      {
        "name": "N_CONTENTS",
        "definition": "`N_CONTENTS` longtext DEFAULT NULL COMMENT '내용'"
      },
      {
        "name": "HIT_CNT",
        "definition": "`HIT_CNT` int(11) DEFAULT 0 COMMENT '조회수'"
      },
      {
        "name": "THUMB_IMG",
        "definition": "`THUMB_IMG` varchar(150) DEFAULT NULL COMMENT '이미지 썸네일'"
      },
      {
        "name": "DISP_SEQ",
        "definition": "`DISP_SEQ` int(11) DEFAULT 10"
      },
      {
        "name": "MAIN_TF",
        "definition": "`MAIN_TF` varchar(20) DEFAULT 'Y' COMMENT '메인노출'"
      },
      {
        "name": "TOP_TF",
        "definition": "`TOP_TF` varchar(2) NOT NULL DEFAULT 'N'"
      },
      {
        "name": "REF_TF",
        "definition": "`REF_TF` varchar(1) DEFAULT 'B' COMMENT '관련 컨텐츠'"
      },
      {
        "name": "USE_TF",
        "definition": "`USE_TF` char(1) NOT NULL DEFAULT 'Y' COMMENT '사용\t여부 사용(Y),사용안함(N)'"
      },
      {
        "name": "DEL_TF",
        "definition": "`DEL_TF` char(1) NOT NULL DEFAULT 'N' COMMENT '삭제\t여부 삭제(Y),사용(N)'"
      },
      {
        "name": "REG_ADM",
        "definition": "`REG_ADM` int(11) unsigned DEFAULT NULL COMMENT '등록\t관리자 일련번호 TBL_ADMIN ADM_NO'"
      },
      {
        "name": "REG_DATE",
        "definition": "`REG_DATE` datetime DEFAULT NULL COMMENT '등록일'"
      },
      {
        "name": "UP_ADM",
        "definition": "`UP_ADM` varchar(30) DEFAULT NULL COMMENT '수정\t관리자 일련번호 TBL_ADMIN ADM_NO'"
      },
      {
        "name": "UP_DATE",
        "definition": "`UP_DATE` datetime DEFAULT NULL COMMENT '수정일'"
      },
      {
        "name": "DEL_ADM",
        "definition": "`DEL_ADM` varchar(30) DEFAULT NULL COMMENT '삭제\t관리자 일련번호 TBL_ADMIN ADM_NO'"
      },
      {
        "name": "DEL_DATE",
        "definition": "`DEL_DATE` datetime DEFAULT NULL COMMENT '삭제일'"
      }
    ],
    "fieldMap": [
      {
        "legacy": "N_NO",
        "json": "legacyNo",
        "type": "integer",
        "purpose": "레거시 식별자"
      },
      {
        "legacy": "LANG",
        "json": "lang",
        "type": "string",
        "purpose": "노출 언어(라벨 변환, 원본은 legacyLang)"
      },
      {
        "legacy": "N_NAME",
        "json": "writer",
        "type": "string",
        "purpose": "작성자 표시명"
      },
      {
        "legacy": "N_TITLE",
        "json": "title",
        "type": "string",
        "purpose": "제목"
      },
      {
        "legacy": "N_CONTENTS",
        "json": "body",
        "type": "html",
        "purpose": "본문"
      },
      {
        "legacy": "THUMB_IMG",
        "json": "photo",
        "type": "asset-path",
        "purpose": "썸네일의 로컬 복사본"
      },
      {
        "legacy": "MAIN_TF/TOP_TF",
        "json": "main/top",
        "type": "boolean",
        "purpose": "메인 노출/상단 고정"
      },
      {
        "legacy": "REF_TF",
        "json": null,
        "type": "excluded",
        "purpose": "관련 컨텐츠 플래그 — 화면 미사용"
      },
      {
        "legacy": "HIT_CNT",
        "json": "hit",
        "type": "integer",
        "purpose": "조회수"
      },
      {
        "legacy": "DISP_SEQ",
        "json": "legacyDispSeq",
        "type": "integer",
        "purpose": "노출 순서"
      },
      {
        "legacy": "USE_TF",
        "json": "use",
        "type": "boolean",
        "purpose": "공개 여부"
      },
      {
        "legacy": "REG_DATE",
        "json": "reg",
        "type": "date",
        "purpose": "등록일"
      },
      {
        "legacy": "UP_DATE",
        "json": "upd",
        "type": "date",
        "purpose": "수정일"
      },
      {
        "legacy": "DEL_TF",
        "json": null,
        "type": "filter",
        "purpose": "N인 행만 포함"
      }
    ],
    "langLabels": {
      "ENG": "영어",
      "CHN": "중국어",
      "JPN": "일본어",
      "VTN": "베트남어"
    },
    "note": "글로벌 사이트 전용 공지입니다."
  },
  "stats": {
    "totalCount": 16,
    "activeCount": 12,
    "deletedCount": 4,
    "publicCount": 12,
    "imageCount": 12,
    "imageFromBackup": 6,
    "imageFromCache": 0,
    "imageFromLive": 6,
    "imageUnresolved": []
  },
  "langs": [
    "베트남어",
    "일본어",
    "중국어",
    "영어"
  ],
  "rows": [
    {
      "id": "legacy-ntcfr-28",
      "seq": 1,
      "photo": "data/notice-fr/images/ntcfr-28.png",
      "legacyNo": 28,
      "legacyLang": "VTN",
      "legacyDispSeq": 1,
      "lang": "베트남어",
      "writer": "안세영(닝티테아잉)",
      "title": "Hệ thống dự đoán điều chỉnh thị lực bằng AI tại B&VIIT",
      "body": "Dựa trên 31 năm kinh nghiệm phẫu thuật và dữ liệu từ hơn 600,000 ca phẫu thuật điều chỉnh thị lực, hệ thống sẽ đề xuất phương pháp điều chỉnh tối ưu phù hợp với từng cá nhân.",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2026-03-13",
      "upd": "2026-03-18",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-26",
      "seq": 2,
      "photo": "data/notice-fr/images/ntcfr-26.png",
      "legacyNo": 26,
      "legacyLang": "JPN",
      "legacyDispSeq": 1,
      "lang": "일본어",
      "writer": "수퍼관리자",
      "title": "B&VIIT A.I. 視力矯正予測システム",
      "body": "31年にわたる手術のノウハウと、累計60万件の視力矯正データに基づき、\r\nお一人おひとりに最適な矯正方法を導き出します。",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2025-08-08",
      "upd": "2025-11-05",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-20",
      "seq": 3,
      "photo": "data/notice-fr/images/ntcfr-20.jpg",
      "legacyNo": 20,
      "legacyLang": "CHN",
      "legacyDispSeq": 1,
      "lang": "중국어",
      "writer": "테스트_유컴패니온",
      "title": "B&VIIT A.I. 视力矫正预测系统",
      "body": "基于31年的手术经验和通过600,000例手术获得的累积视\r\n力矫正资料，我们可得出结果并为每个人提供视力矫正最\r\n优之选",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2020-08-12",
      "upd": "2025-11-05",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-17",
      "seq": 4,
      "photo": "data/notice-fr/images/ntcfr-17.png",
      "legacyNo": 17,
      "legacyLang": "ENG",
      "legacyDispSeq": 1,
      "lang": "영어",
      "writer": "테스트_유컴패니온",
      "title": "B&VIIT A.I. Vision Correction Prediction System",
      "body": "Based on 31 years of surgical know-how and accumulated vision correction data of 600,000 eyes, we derive the result value and propose an optimized vision correction method for the individual.",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2020-08-10",
      "upd": "2025-11-05",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-27",
      "seq": 5,
      "photo": "data/notice-fr/images/ntcfr-27.png",
      "legacyNo": 27,
      "legacyLang": "VTN",
      "legacyDispSeq": 2,
      "lang": "베트남어",
      "writer": "안세영(닝티테아잉)",
      "title": "Các bài giảng về y học và tư vấn y tế",
      "body": "Chuyên môn và kinh nghiệm của B&VIIT đã được công nhận thông qua hơn 50 bài giảng y khoa trên toàn thế giới từ năm 2011.",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2026-03-13",
      "upd": "2026-03-18",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-25",
      "seq": 6,
      "photo": "data/notice-fr/images/ntcfr-25.png",
      "legacyNo": 25,
      "legacyLang": "JPN",
      "legacyDispSeq": 2,
      "lang": "일본어",
      "writer": "수퍼관리자",
      "title": "医学講演および医療アドバイス",
      "body": "2011年以降、B&VIITの専門性と経験は、\r\n世界各地で50回以上にわたる医療講演の中心となってきました。",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2025-08-08",
      "upd": "-",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-22",
      "seq": 7,
      "photo": "data/notice-fr/images/ntcfr-22.jpg",
      "legacyNo": 22,
      "legacyLang": "CHN",
      "legacyDispSeq": 2,
      "lang": "중국어",
      "writer": "테스트_유컴패니온",
      "title": "最近的研究和成果",
      "body": "作为韩国的领军眼科中心，我们有责任不断努力。我们的目标是制定视力矫正的最佳方案，朝着这个目标，我们不断研究，目前已发表120份研究报告。B&VIIT的医术以由众多奖项和证书证明。",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2020-08-25",
      "upd": "2020-08-25",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-19",
      "seq": 8,
      "photo": "data/notice-fr/images/ntcfr-19.png",
      "legacyNo": 19,
      "legacyLang": "ENG",
      "legacyDispSeq": 2,
      "lang": "영어",
      "writer": "테스트_유컴패니온",
      "title": "Medical Advice and Lectures",
      "body": "B&VIIT's expertise and experience has been the cornerstone of medical lectures all over the world more than 50 times since 2011.",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2020-08-10",
      "upd": "2020-09-04",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-29",
      "seq": 9,
      "photo": "data/notice-fr/images/ntcfr-29.png",
      "legacyNo": 29,
      "legacyLang": "VTN",
      "legacyDispSeq": 3,
      "lang": "베트남어",
      "writer": "안세영(닝티테아잉)",
      "title": "Thành tựu gần đây",
      "body": "Là viện mắt hàng đầu Hàn Quốc, chúng tôi luôn nỗ lực để cải thiện chất lượng dịch vụ y tế.\r\nChúng tôi liên tục tiến hành nghiên cứu để tìm ra các hướng dẫn điều chỉnh thị lực tối ưu và đã công bố tổng cộng 120 bài báo nghiên cứu cho đến nay.\r\nChuyên môn y tế của B&VIIT được chứng minh bằng nhiều giải thưởng và chứng nhận.",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2026-03-18",
      "upd": "2026-03-18",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-24",
      "seq": 10,
      "photo": "data/notice-fr/images/ntcfr-24.png",
      "legacyNo": 24,
      "legacyLang": "JPN",
      "legacyDispSeq": 3,
      "lang": "일본어",
      "writer": "수퍼관리자",
      "title": "最近の実績",
      "body": "韓国を代表する眼科として、常に医療サービスの向上に努めております。\r\n最適な視力矯正の指針を追求するため、継続的に研究を行っており、\r\nこれまでに120本の研究論文を発表してまいりました。\r\nまた、B&VIITの医療的専門性は、数々の受賞歴や認証を通じて証明されています。",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2025-08-08",
      "upd": "-",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-23",
      "seq": 11,
      "photo": "data/notice-fr/images/ntcfr-23.jpg",
      "legacyNo": 23,
      "legacyLang": "CHN",
      "legacyDispSeq": 3,
      "lang": "중국어",
      "writer": "테스트_유컴패니온",
      "title": "医疗指导和课程",
      "body": "自2011年起，B&VIIT的专业知识和经验已经通过医疗指导和课程的方式向世界分享了50余次。",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2020-08-25",
      "upd": "2020-08-25",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    },
    {
      "id": "legacy-ntcfr-18",
      "seq": 12,
      "photo": "data/notice-fr/images/ntcfr-18.png",
      "legacyNo": 18,
      "legacyLang": "ENG",
      "legacyDispSeq": 3,
      "lang": "영어",
      "writer": "테스트_유컴패니온",
      "title": "Recent Achievements",
      "body": "As a leading eye center of Korea, it is our duty to constantly improve our services. In our effort to find the best vision correction guidelines, we are consistently conducting research into vision correction and so B&VIIT has released 120 research papers to date. B&VIIT's medical expertise has been proven by receiving numerous awards and certifications.",
      "main": false,
      "top": false,
      "hit": 0,
      "use": true,
      "reg": "2020-08-10",
      "upd": "2020-09-18",
      "sourceVersion": "legacy-tbl-notice-fr-20260710-v1"
    }
  ]
}
  var def = {
  "tab": "글로벌 공지",
  "title": "글로벌 공지 관리",
  "singular": "글로벌 공지",
  "legacy": "manager/notice_fr · TBL_NOTICE_FR",
  "description": "",
  "searchPlaceholder": "제목 또는 본문 검색",
  "searchKeys": [
    "title",
    "body"
  ],
  "filters": [
    {
      "id": "lang",
      "label": "언어",
      "field": "lang",
      "kind": "text",
      "options": [
        "전체",
        "베트남어",
        "일본어",
        "중국어",
        "영어"
      ]
    },
    {
      "id": "use",
      "label": "공개여부",
      "field": "use",
      "kind": "bool",
      "options": [
        "전체",
        "공개",
        "숨김"
      ]
    }
  ],
  "columns": [
    {
      "key": "seq",
      "label": "순서",
      "type": "order"
    },
    {
      "key": "photo",
      "label": "썸네일",
      "type": "thumb"
    },
    {
      "key": "title",
      "label": "제목",
      "type": "title"
    },
    {
      "key": "lang",
      "label": "언어",
      "type": "tag"
    },
    {
      "key": "writer",
      "label": "작성자",
      "type": "text"
    },
    {
      "key": "main",
      "label": "메인",
      "type": "toggle",
      "on": "노출",
      "off": "-"
    },
    {
      "key": "use",
      "label": "공개",
      "type": "toggle",
      "on": "공개",
      "off": "숨김"
    },
    {
      "key": "reg",
      "label": "등록일",
      "type": "date"
    }
  ],
  "fields": [
    {
      "key": "photo",
      "label": "썸네일",
      "type": "image",
      "full": true,
      "code": "thumb_img"
    },
    {
      "key": "lang",
      "label": "노출 언어",
      "type": "select",
      "options": [
        "베트남어",
        "일본어",
        "중국어",
        "영어"
      ],
      "code": "lang"
    },
    {
      "key": "title",
      "label": "제목",
      "type": "text",
      "full": true,
      "code": "n_title",
      "required": true
    },
    {
      "key": "writer",
      "label": "작성자",
      "type": "text",
      "code": "n_name"
    },
    {
      "key": "body",
      "label": "본문",
      "type": "textarea",
      "full": true,
      "code": "n_contents"
    },
    {
      "key": "main",
      "label": "메인 노출",
      "type": "toggle",
      "on": "노출",
      "off": "사용안함",
      "code": "main_tf"
    },
    {
      "key": "top",
      "label": "상단 고정",
      "type": "toggle",
      "on": "고정",
      "off": "-",
      "code": "top_tf"
    },
    {
      "key": "use",
      "label": "공개여부",
      "type": "toggle",
      "on": "공개",
      "off": "숨김",
      "code": "use_tf"
    },
    {
      "key": "reg",
      "label": "등록일",
      "type": "readonly",
      "code": "reg_date"
    },
    {
      "key": "upd",
      "label": "수정일",
      "type": "readonly",
      "code": "up_date"
    }
  ],
  "rows": []
}
  def.dataVersion = snapshot.dataVersion
  def.description = '글로벌 사이트(english/chinese/japanese.bnviit.com)에 노출되는 공지 ' + snapshot.stats.activeCount + '건입니다(언어 4종 · 공개 ' + snapshot.stats.publicCount + '건). 국문 홈페이지에는 노출되지 않으며 백업일은 ' + snapshot.source.backupDate + '입니다.'
  def.rows = snapshot.rows
  def.snapshotMeta = { source: snapshot.source.label, backupDate: snapshot.source.backupDate, activeCount: snapshot.stats.activeCount }
  C.collections.globalNotices = def
  if (Array.isArray(C.views.news) && C.views.news.indexOf('globalNotices') < 0) C.views.news.push('globalNotices')
})()
