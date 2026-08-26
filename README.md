

# liaison-web

## 📚 컨벤션

작업 전에 아래 문서를 확인해주세요.

- [커밋 컨벤션](COMMIT_CONVENTION.md)
- [브랜치 컨벤션](BRANCH_CONVENTION.md)
- [PR 템플릿](.github/PULL_REQUEST_TEMPLATE.md)

> 학원 숙제 공지와 학생별 진도를 함께 관리하는 알림장 서비스, `liaision`의 프론트엔드 레포지토리입니다.

**배포 링크** · [Production](https://) | [Preview](https://)

---

## 📑 목차

- [liaision](#liaision)
  - [📑 목차](#-목차)
  - [✨ 주요 기능](#-주요-기능)
    - [👥 사용자 역할](#-사용자-역할)
  - [🛠 기술 스택](#-기술-스택)
  - [📁 폴더 구조](#-폴더-구조)
    - [📌 폴더 사용 기준](#-폴더-사용-기준)
  - [🌿 Git 브랜치 전략](#-git-브랜치-전략)
  - [📝 커밋 컨벤션](#-커밋-컨벤션)
  - [🔀 PR 규칙](#-pr-규칙)
  - [🧩 코드 컨벤션](#-코드-컨벤션)
    - [도메인 용어](#도메인-용어)
    - [네이밍 규칙](#네이밍-규칙)
    - [컴포넌트 작성 규칙](#컴포넌트-작성-규칙)
    - [import 순서](#import-순서)
    - [⚠️ 구현 시 유의사항](#️-구현-시-유의사항)
  - [⚙️ 개발환경 세팅](#️-개발환경-세팅)
    - [요구 사항](#요구-사항)
    - [설치 및 실행](#설치-및-실행)
    - [스크립트](#스크립트)
    - [환경 변수](#환경-변수)

---

## ✨ 주요 기능

| 기능 | 설명 |
| --- | --- |
| 숙제 부여 · 진도 자동 생성 | `현재 교재 + 마지막 진도 페이지` 기반 다음 분량 자동 생성, 결과는 수정 가능한 초안 |
| 공유 교재 DB | 위키 방식 등록·보완, 전 계정 공유 (필수 필드: 교재명 · 출판사 · 총 페이지 수) |
| 과제 제출 · 현황 확인 | 학생 → 선생님 단방향 제출, 촬영 가이드 프레임으로 판독 실패 사전 차단 |
| 알림 | 숙제 부여·수정·취소, 마감 1시간 전 리마인드, 미제출 통보 (FCM) |
| 반 그룹핑 · 일괄 부여 | 반은 묶음 수단, 과목별 · 선생님별 등 다중 기준 지원 |
| 휴일 · 휴강일 스케줄러 | 원장 등록, 전 사용자 열람 |
| 패널티 정책 | 학원 단위 사전 등록 후 부여 |
| 학부모 열람 | 숙제 / 제출 여부 / 제출 시각 / 현재 진도 단원 |

### 👥 사용자 역할

| 역할 | 접근 경로 | 권한 |
| --- | --- | --- |
| 원장 | 웹 | 계정 발급, 강사 배정, 학원 설정, 휴강일 등록, 패널티 정책 |
| 선생님 | 앱 + 웹 | 숙제 부여, 제출 확인, 채점 피드백 |
| 학생 | 앱 | 숙제 확인, 과제 제출 |
| 학부모 | 앱 (선택 설치) | 열람 전용 |

- 웹은 하나의 관리 사이트에서 **권한으로 화면·수정 범위 분기**
- 랜딩 페이지는 SEO 노출, 관리자 영역은 비노출

---

## 🛠 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | Next.js `x.x` (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Server State | TanStack Query |
| Client State | Zustand |
| HTTP Client | Axios |
| Push | Firebase Cloud Messaging |
| Lint / Format | ESLint, Prettier |
| Package Manager | pnpm `x.x.x` |

**선택 이유**

| 기술 | 이유 |
| --- | --- |
| Next.js | 랜딩은 SEO 노출, 관리자 영역은 비노출 — 라우트 단위로 렌더링 방식 분리 |
| FCM | 백그라운드 푸시 + **포그라운드 알림** 모두 필요 (숙제 수정·취소 즉시 전달) |
| Zustand + TanStack Query | 서버 데이터는 Query, 다단계 입력 플로우 상태는 Zustand로 역할 분리 |

---

## 📁 폴더 구조

```
liaision/
├── public/
│   └── firebase-messaging-sw.js  # FCM 백그라운드 수신 서비스 워커
├── docs/                         # 화면·기능 설계 문서
├── src/
│   ├── app/                      # App Router — 라우팅 · 레이아웃 진입점
│   │   ├── layout.tsx            # 루트 레이아웃 (Provider 등록)
│   │   ├── (landing)/            # 랜딩 페이지 — SEO 노출 대상
│   │   ├── (auth)/               # 로그인 (계정은 원장이 발급)
│   │   ├── (console)/            # 관리 사이트 — 권한으로 화면 분기, 비노출
│   │   │   ├── homework/         # 숙제 부여 · 진도 자동 생성
│   │   │   ├── submissions/      # 제출 현황 확인
│   │   │   ├── textbooks/        # 교재 검색 · 등록 (위키)
│   │   │   ├── students/         # 학생 · 반 그룹핑
│   │   │   ├── schedule/         # 휴일 · 휴강일
│   │   │   ├── penalty/          # 패널티 정책 · 부여
│   │   │   └── academy/          # 학원 설정 · 계정 발급 (원장 전용)
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/                   # Button, Input, Badge, Modal, LoadingScreen, ErrorScreen
│   │   └── layout/               # Header, SideNav, PageLayout
│   │
│   ├── features/                 # 도메인 단위 모듈 (components / hooks / api)
│   │   ├── auth/
│   │   ├── homework/
│   │   ├── submission/
│   │   ├── textbook/
│   │   ├── student/
│   │   ├── schedule/
│   │   ├── penalty/
│   │   └── academy/
│   │
│   ├── lib/
│   │   ├── axios.ts              # axios 인스턴스 + 토큰/에러 인터셉터
│   │   ├── apiError.ts           # 서버 공통 에러 래퍼 → ApiError 변환
│   │   ├── queryClient.ts        # TanStack Query 클라이언트
│   │   └── firebase.ts           # FCM 초기화 · 토큰 발급 · 포그라운드 수신
│   │
│   ├── store/                    # Zustand 전역 상태
│   │   ├── authStore.ts          # 인증 · 현재 소속(Membership) 상태
│   │   └── homeworkStore.ts      # 숙제 부여 플로우 상태
│   │
│   ├── styles/
│   │   └── globals.css           # Tailwind 진입점 + 전역 스타일
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── middleware.ts             # 로그인 가드 + 역할 기반 접근 제어
│
├── .env.example
├── eslint.config.mjs
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 📌 폴더 사용 기준

| 폴더 | 기준 |
| --- | --- |
| `app/` | 라우팅 · 레이아웃만 담당, 화면 로직은 `features/`에 |
| 라우트 그룹 | `(landing)` SEO 노출 / `(console)` 비노출 — 새 페이지는 반드시 둘 중 하나에 소속 |
| `features/` | 도메인 단위로 `components` / `hooks` / `api` 배치, 공유 시점에 승격 |
| `components/ui` | 도메인 지식 없는 순수 UI만, 특정 화면 전용은 `features/`에 |
| `store/` | 화면 간 유지되는 플로우 상태만, 서버 데이터는 TanStack Query |

---

## 🌿 Git 브랜치 전략

| 브랜치 | 용도 |
| --- | --- |
| `main` | 배포 |
| `develop` | 개발 통합 |
| `feat/*` | 기능 개발 |
| `fix/*` | 버그 수정 |
| `design/*` | 화면 UI · CSS 작업 |
| `refactor/*` | 동작 변화 없는 구조 개선 |
| `style/*` | 포맷터 적용 등 코드 의미가 바뀌지 않는 변경 |
| `docs/*` | 문서 작업 |
| `test/*` | 테스트 코드 작성 |
| `chore/*` | 패키지 설치, 설정 파일, 빌드 스크립트 |

- 브랜치명은 `type/작업-내용` 형태, 소문자와 하이픈 사용 (예: `feat/homework-create`)
- 접두사는 **커밋 type과 동일한 기준**을 따름
- 한 브랜치 안에 다른 type의 커밋이 섞이는 것은 허용, 접두사는 작업의 주된 성격으로 결정

---

## 📝 커밋 컨벤션

| type | 사용 시점 |
| --- | --- |
| `feat` | 사용자가 쓸 수 있는 기능이 새로 생겼을 때 |
| `fix` | 의도대로 동작하지 않던 것을 고쳤을 때 |
| `refactor` | 동작은 그대로인데 코드 구조·이름을 바꿨을 때 |
| `style` | 들여쓰기, 세미콜론, 포맷터 적용 등 코드 의미가 바뀌지 않는 변경 |
| `design` | 화면에 보이는 UI·CSS를 수정했을 때 |
| `docs` | README, 주석, 설계 문서 등 문서만 수정했을 때 |
| `test` | 테스트 코드를 추가·수정했을 때 |
| `chore` | 패키지 설치, 설정 파일, 빌드 스크립트 등 그 외 잡무 |

- 한 커밋에 여러 type이 섞이면 커밋을 분리

---

## 🔀 PR 규칙

<!-- 추가 예정 -->

---

## 🧩 코드 컨벤션

### 도메인 용어

한글 개념과 코드 표기를 1:1로 고정합니다. 같은 대상을 다르게 부르면 API·타입·폴더명이 전부 어긋납니다.

| 개념 | 표기 | 비고 |
| --- | --- | --- |
| 숙제 | `homework` | `assignment` 혼용 금지 |
| 과제 제출물 | `submission` | |
| 교재 | `textbook` | |
| 학습지 | `worksheet` | 교재 DB에 포함하지 않음 |
| 진도 | `progress` | |
| 반 | `classGroup` | `class`는 JS 예약어라 사용 불가 |
| 학원 | `academy` | |
| 소속 관계 | `membership` | 계정(`user`)과 학원의 연결 |
| 원장 | `director` | |
| 선생님 | `teacher` | |
| 학생 | `student` | |
| 학부모 | `parent` | |
| 패널티 | `penalty` | |
| 휴강일 | `closedDay` | |

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트 파일 | PascalCase | `HomeworkCard.tsx` |
| 훅 파일 | camelCase | `useHomeworkList.ts` |
| 유틸 파일 | camelCase | `formatDueDate.ts` |
| 타입/인터페이스 | PascalCase | `HomeworkItem`, `StudentProfile` |
| 변수/함수 | camelCase | `isSubmitted`, `fetchHomework` |
| 불리언 | `is` / `has` / `can` 접두 | `isOverdue`, `hasSubmission` |
| 상수 | UPPER_SNAKE_CASE | `MAX_PAGE_PER_DAY` |
| 라우트 폴더 | kebab-case | `app/(console)/homework/` |
| CSS 클래스 | Tailwind 유틸 우선 | — |

### 컴포넌트 작성 규칙

- 함수형 컴포넌트 + 화살표 함수 사용
- `export default`는 파일 하단에
- Props 타입은 `interface`로 별도 선언
- 한 파일에 하나의 컴포넌트 원칙
- `"use client"`는 상태 · 이벤트 핸들러 · 브라우저 API가 필요할 때만, **파일 최상단**에 선언
- 도메인 전용 타입은 `features/` 내부, 공유 타입만 `types/`에

```tsx
// ✅ 올바른 예시
interface HomeworkCardProps {
  textbookName: string;
  pageRange: string;
  dueDate: string;
  isSubmitted?: boolean;
  onSelect: (id: string) => void;
}

const HomeworkCard = ({
  textbookName,
  pageRange,
  dueDate,
  isSubmitted = false,
  onSelect,
}: HomeworkCardProps) => {
  return (
    <article onClick={() => onSelect(textbookName)}>
      <h3>{textbookName}</h3>
      <p>{pageRange}</p>
      <time>{dueDate}</time>
      <Badge variant={isSubmitted ? 'done' : 'pending'} />
    </article>
  );
};

export default HomeworkCard;
```

### import 순서

```tsx
'use client';

// 1. React 관련
import { useState } from 'react';

// 2. 외부 라이브러리
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

// 3. 내부 절대경로 (features, components, store, ...)
import HomeworkCard from '@/features/homework/components/HomeworkCard';
import { fetchHomeworkList } from '@/features/homework/api';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

// 4. 타입
import type { HomeworkItem } from '@/types';
```

- `'use client'`는 **모든 import보다 위**에 위치해야 동작
- 절대경로 별칭 `@/` 사용, 상위 폴더 접근(`../../`) 금지

### ⚠️ 구현 시 유의사항

기획 단계에서 확정된 제약입니다.

| 항목 | 제약 |
| --- | --- |
| 교재 표지 | 업로드 필드를 만들지 않음 (저작물) |
| 제출물 | 학생 → 선생님 단방향, 타 학생 제출물 비노출 |
| 알림 | 학생용 끄기 토글 없음 |
| 연락 | 앱 내 학부모–선생님 통로 없음, 선생님 연락처 비노출 |
| 자동 생성 진도 | 항상 수정 가능한 초안 |
| 목차 단원 표시 | 학부모 · 선생님 · 원장만, 학생 화면 제외 |

---

## ⚙️ 개발환경 세팅

### 요구 사항

| 항목 | 버전 |
| --- | --- |
| Node.js | `20.x` 이상 (LTS 권장) |
| pnpm | `x.x.x` — 미설치 시 `corepack enable pnpm` |

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd liaision

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버 실행
pnpm dev
```

- 기본 접속 주소: `http://localhost:3000`

### 스크립트

| 명령어 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 빌드 결과물 실행 (`build` 선행 필요) |
| `pnpm lint` | 린트 검사 |
| `pnpm format` | 코드 포맷팅 |

### 환경 변수

- `.env.example`을 복사해 `.env.local`로 사용
- **실제 값은 커밋 금지**
- `NEXT_PUBLIC_` 접두사는 클라이언트 번들에 포함되어 **브라우저에 노출** → 시크릿 키는 접두사 없이 서버 전용으로 관리

| 변수명 | 필수 | 노출 범위 | 설명 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | ✅ | Client | API 서버 주소 |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Client | Firebase 웹 앱 설정 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Client | Firebase 프로젝트 ID |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Client | FCM 발신자 ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Client | Firebase 앱 ID |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | ✅ | Client | 웹 푸시 인증 키 |