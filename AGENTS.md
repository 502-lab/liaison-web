# AGENTS.md — liaison-web

AI 도구(Claude Code, Cursor, Copilot, Codex 등)와 사람 모두 작업 전에 읽습니다.

## 1. 공통 문서 (반드시 먼저)
`docs/common/`은 공통 문서 저장소 [502-lab/liaison-docs](https://github.com/502-lab/liaison-docs)를 연결한 git submodule입니다. 비어 있으면 `git submodule update --init`을 실행합니다.

- `docs/common/AI_RULES.md` — 절대 하지 않는 것, 반드시 하는 것
- `docs/common/GLOSSARY.md` — 표준어와 코드 이름
- `docs/common/CODE_CONVENTIONS.md` — 이름·API·시간·로그·테스트 규칙
- `docs/common/GIT_CONVENTIONS.md` — 커밋·브랜치·PR 규칙
- `docs/common/DOMAIN.md` — 도메인 모델 요약
- `docs/common/PRIVACY_RULES.md` — 개인정보 규칙

공통 문서를 고칠 때는 이 저장소가 아니라 liaison-docs에 PR을 올립니다.

## 2. 이 저장소
- **역할:** 원장·선생님 관리자 웹과 랜딩 페이지(처리방침·계정 삭제 요청 페이지 포함)
- **스택:** Next.js(App Router) — 프로젝트 셋팅(WBS 0.2) 전입니다
- **화면 기준:** 1920×1080 디자인, 브레이크포인트 1280·1536(1536 미만은 오른쪽 서랍이 겹쳐 뜸, 1280 미만은 사이드바 아이콘만). 표는 가로 스크롤 + 첫 열 고정
- **원장·선생님 세션:** 30분 미사용 시 서버 세션이 끊기고 다시 로그인합니다. 토큰은 HttpOnly 쿠키로 다루고 자바스크립트 저장소에 두지 않습니다. 학생 정보 응답은 캐시하지 않습니다(no-store).
- **분석·광고·추적 쿠키를 넣지 않습니다.** 로그인 세션용 필수 쿠키만 씁니다.
- **커밋 전 비밀키 검사:** `git config core.hooksPath .githooks` (gitleaks 필요: `brew install gitleaks`). CI(Secret Scan)도 검사합니다.
- **공개 저장소입니다.** 실제 데이터·비밀값·법무 원문을 올리지 않습니다.
