# 브랜치 컨벤션

## 브랜치 이름 형식

```
type/작업-요약
```

- 작업 요약은 **영문 소문자 + 하이픈(-)** 으로 작성합니다
- 무슨 작업인지 이름만 보고 알 수 있게 짓습니다

```
feat/login-screen
fix/duplicate-notification
refactor/api-client
docs/readme-update
```

## Type 종류

커밋 컨벤션과 동일한 type을 사용합니다. ([커밋 컨벤션](COMMIT_CONVENTION.md) 참고)

| type | 언제 사용하나요 |
|------|----------------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변화 없는 코드 구조 개선 |
| `style` | 코드 포맷팅 등 (동작 변화 없음) |
| `docs` | 문서 추가/수정 |
| `test` | 테스트 코드 추가/수정 |
| `chore` | 빌드 설정, 패키지 관리 등 잡무 |
| `ci` | CI/CD 워크플로우 관련 변경 |

## 브랜치 전략

- **`main`**: 기본 브랜치. 직접 푸시하지 않고 **PR을 통해서만** 변경합니다 (브랜치 보호 규칙 적용 중)
- **작업 브랜치**: 항상 최신 `main`에서 분기해서 작업합니다

```
main ──┬──────────────────────┬── (merge) ──
       └── feat/login-screen ─┘
```

## 작업 흐름

1. 최신 `main`에서 작업 브랜치를 생성합니다
   ```bash
   git switch main
   git pull
   git switch -c feat/login-screen
   ```
2. 작업 후 커밋하고 푸시합니다 ([커밋 컨벤션](COMMIT_CONVENTION.md) 준수)
3. PR을 올립니다 (PR 템플릿에 맞춰 작성)
4. 리뷰/승인 후 `main`에 머지합니다
5. **머지된 브랜치는 삭제합니다** (GitHub 머지 화면의 Delete branch 버튼)

## 주의사항

- 하나의 브랜치에는 **하나의 작업**만 담습니다 (브랜치가 오래 살아있을수록 충돌이 커집니다)
- 브랜치를 오래 유지해야 한다면 주기적으로 `main`을 머지해서 최신 상태를 유지합니다
