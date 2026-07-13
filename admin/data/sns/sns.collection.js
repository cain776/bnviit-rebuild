/* 자동 생성 파일 — 레거시 SNS 후기(B_1_10) 실데이터.
   생성: scratchpad/gen_sns_collection.js · 원본: TBL_BOARD(B_1_10) + 서버 이미지 HTTP 매칭.
   후기(reviews) 뷰에 'SNS 후기' 탭으로 등록됩니다. */
(function () {
  'use strict'
  var C = window.BNVIIT_CMS_COLLECTIONS
  if (!C || !C.collections || !C.views) return
  C.collections.sns = {
  "tab": "SNS 후기",
  "title": "SNS 후기 관리",
  "singular": "SNS 게시물",
  "legacy": "B_1_10",
  "description": "레거시 SNS 후기 게시판(B_1_10)에서 이관한 실제 데이터입니다. 이미지는 서버 원본을 HTTP로 매칭했습니다.",
  "searchPlaceholder": "제목 또는 작성자 검색",
  "searchKeys": [
    "title",
    "writer"
  ],
  "previewGrid": true,
  "previewHeading": "비앤빛의 소중하고 생생한 후기를 한 자리에서 만나보세요.",
  "filters": [
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
      "label": "이미지",
      "type": "thumb"
    },
    {
      "key": "title",
      "label": "제목",
      "type": "title"
    },
    {
      "key": "writer",
      "label": "작성자",
      "type": "text"
    },
    {
      "key": "date",
      "label": "등록일",
      "type": "date"
    },
    {
      "key": "use",
      "label": "공개",
      "type": "toggle",
      "on": "공개",
      "off": "숨김"
    }
  ],
  "fields": [
    {
      "key": "photo",
      "label": "대표 이미지",
      "type": "image",
      "full": true,
      "code": "file_nm"
    },
    {
      "key": "title",
      "label": "제목",
      "type": "text",
      "full": true,
      "code": "title",
      "required": true
    },
    {
      "key": "writer",
      "label": "작성자",
      "type": "text",
      "code": "writer_nm"
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
      "key": "date",
      "label": "등록일",
      "type": "readonly",
      "code": "reg_date"
    }
  ],
  "rows": [
    {
      "id": "sns470",
      "seq": 1,
      "photo": "data/sns/images/470.jpg",
      "title": "# 라섹 5년차, 곧 6년차",
      "writer": "수퍼관리자",
      "date": "2022-02-25",
      "use": true,
      "badge": "blog",
      "handle": "asunflower07",
      "link": "https://m.blog.naver.com/asunflower07/222645568087"
    },
    {
      "id": "sns399",
      "seq": 2,
      "photo": "data/sns/images/399.jpg",
      "title": "# 스마일라식, QnA",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "sunrise961",
      "link": "http://blog.naver.com/sunrise961/222222871745"
    },
    {
      "id": "sns398",
      "seq": 3,
      "photo": "data/sns/images/398.jpg",
      "title": "# 라섹수술, 고도난시",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "cdjy28",
      "link": "https://blog.naver.com/cdjy28/222172292114"
    },
    {
      "id": "sns397",
      "seq": 4,
      "photo": "data/sns/images/397.jpg",
      "title": "# 스마일라식, 가상체험영상",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "seungg18",
      "link": "https://blog.naver.com/seungg18/222282268971"
    },
    {
      "id": "sns396",
      "seq": 5,
      "photo": "data/sns/images/396.jpg",
      "title": "# 비쥬라식, EX500, 렌즈안녕",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "instagram",
      "handle": "miwoom76",
      "link": "https://www.instagram.com/p/BtqOAnJHmRl/?utm_source=ig_web_copy_link"
    },
    {
      "id": "sns395",
      "seq": 6,
      "photo": "data/sns/images/395.jpg",
      "title": "# 렌즈삽입술, 한달후기",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "wn7060",
      "link": "https://blog.naver.com/wn7060/222092050764"
    },
    {
      "id": "sns394",
      "seq": 7,
      "photo": "data/sns/images/394.jpg",
      "title": "# 올레이저라섹, 유용꿀팁",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "uilharu",
      "link": "https://blog.naver.com/uilharu/222267650754"
    },
    {
      "id": "sns393",
      "seq": 8,
      "photo": "data/sns/images/393.jpg",
      "title": "# 렌즈삽입술, 5일째",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "instagram",
      "handle": "comma_dress",
      "link": "https://www.instagram.com/p/CLis2n_lR3F/"
    },
    {
      "id": "sns392",
      "seq": 9,
      "photo": "data/sns/images/392.jpg",
      "title": "# 렌즈삽입술, 3일차",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "minah2058",
      "link": "https://blog.naver.com/minah2058/220810907571"
    },
    {
      "id": "sns391",
      "seq": 10,
      "photo": "data/sns/images/391.jpg",
      "title": "# 라식수술, 안경탈출",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "instagram",
      "handle": "yeah_mouse",
      "link": "https://www.instagram.com/p/BkSFazrnm4j/?utm_source=ig_web_copy_link"
    },
    {
      "id": "sns390",
      "seq": 11,
      "photo": "data/sns/images/390.png",
      "title": "# 렌즈삽입술, 2일차, 9일차",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "seobong",
      "link": "https://blog.naver.com/seobong2/221466951321"
    },
    {
      "id": "sns389",
      "seq": 12,
      "photo": "data/sns/images/389.jpg",
      "title": "# 라섹수술, 비앤빛앱케어",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "kimnaeun3301",
      "link": "https://blog.naver.com/kimnaeun3301/222126718177"
    },
    {
      "id": "sns388",
      "seq": 13,
      "photo": "data/sns/images/388.jpg",
      "title": "# 스마일라식, 관리방법",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "kkh4585",
      "link": "https://blog.naver.com/kkh4585/222130456897"
    },
    {
      "id": "sns387",
      "seq": 14,
      "photo": "data/sns/images/387.jpg",
      "title": "# 렌즈삽입술, EVO+ICL",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "ericmoonligh",
      "link": "https://blog.naver.com/ericmoonligh/222265579744"
    },
    {
      "id": "sns386",
      "seq": 15,
      "photo": "data/sns/images/386.jpg",
      "title": "# 렌즈삽입술, 안경안녕",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "instagram",
      "handle": "hwa__hwa_",
      "link": "https://www.instagram.com/p/CGysgHLluQu/"
    },
    {
      "id": "sns385",
      "seq": 16,
      "photo": "data/sns/images/385.jpg",
      "title": "# 라섹수술, 회복후일상",
      "writer": "비앤빛",
      "date": "2020-03-10",
      "use": true,
      "badge": "blog",
      "handle": "silverwater1221",
      "link": "https://blog.naver.com/silverwater1221/222218762949"
    }
  ]
}
  if (Array.isArray(C.views.reviews) && C.views.reviews.indexOf('sns') < 0) C.views.reviews.push('sns')
})()
