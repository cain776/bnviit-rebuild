# BNVIIT 리빌드 데모 (시연 전용)

비앤빛 강남밝은세상안과 홈페이지·관리자 리빌드의 **시연용 정적 데모**입니다.

> ⚠️ **이 저장소에는 개인정보·실데이터가 없습니다.**
> - 홈페이지: 이미 공개 게시됐던 콘텐츠의 빌드 산출물만 포함 (기사 본문의 연락처·이메일은 추가 마스킹)
> - 관리자: 회원·상담·후기·의료진 화면은 **시드 고정 무작위 생성 더미 데이터**로 동작 (화면 하단 데모 배너 표시)
> - 소스코드·기획 문서·백엔드·DB는 이 저장소에 포함되지 않음 (별도 채널로만 전달)

## 보기

| 데모 | URL |
|---|---|
| 신규 홈 와이어프레임 | https://cain776.github.io/bnviit-rebuild/ |
| 홈페이지 프로토타입 | https://cain776.github.io/bnviit-rebuild/?spa |
| 관리자 | https://cain776.github.io/bnviit-rebuild/admin/?demo=1 |

- 검색엔진 수집 차단(`noindex`) 상태입니다.
- 관리자 데모의 전화번호는 전 레코드 `010-0000-0000`(더미 표준값)이며, 목록은 실서비스와 동일한 마스킹 UI를 시연합니다.

## 구조

```
index.html      진입 디스패처 (수기 관리 — 아래 주의 참고)
frontpage.html  신규 홈 와이어프레임 (단일 HTML 번들, 폰트·런타임 인라인)
/admin/         관리자 프로토타입 (정적 · 더미 폴백 모드)
/shared/        홈페이지·관리자 공용 메뉴 정의
assets/         홈페이지 Vite 정적 빌드 (base=/bnviit-rebuild/)
404.html        SPA 딥링크 지원
.nojekyll       GitHub Pages Jekyll 비활성화 (data/_demo 폴더 보존)
```

이 저장소는 빌드 산출물 전용입니다 — 직접 수정하지 말고, 원본 작업공간에서 재생성해 갱신합니다.

### ⚠️ `index.html` 은 예외 — 재배포 때마다 복원해야 합니다

SPA 라우터는 `basename="/bnviit-rebuild"` 로 고정돼 있어서 **프로토타입 홈은 pathname 이
정확히 `/bnviit-rebuild/` 일 때만 매칭**됩니다. 신규 와이어프레임을 같은 주소에 올려야 하므로,
경로를 나누는 대신 `index.html` 이 쿼리로 분기하는 디스패처 역할을 합니다.

| 요청 | 결과 |
|---|---|
| `/bnviit-rebuild/` | `frontpage.html` 을 전체화면 iframe 으로 로드 |
| `/bnviit-rebuild/?spa` | 기존 React 프로토타입 홈 부팅 |
| `/bnviit-rebuild/booking` 등 딥링크 | `404.html` 폴백 경유 → 기존 프로토타입 (변경 없음) |

iframe 래퍼는 장식이 아니라 필수입니다. `frontpage.html` 은 로드 시
`document.documentElement.replaceWith(...)` 로 문서를 통째로 교체하기 때문에, 번들을 그대로
`index.html` 로 쓰면 `<title>` · `description` · `robots noindex` 가 런타임에 전부 사라집니다.

**따라서 원본 작업공간에서 Vite 빌드를 다시 배포하면 `index.html` 이 빌드 산출물로 덮어써지고
와이어프레임 진입이 사라집니다.** 배포 후 이 디스패처를 다시 적용하세요. 자산 해시가 바뀌므로
`index.html` 안의 `SPA_JS` / `SPA_CSS` 상수도 새 빌드의 파일명으로 맞춰야 합니다.
