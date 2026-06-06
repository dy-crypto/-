# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint

npm run db:push      # 스키마를 Supabase DB에 반영 (마이그레이션 없이 즉시 적용)
npm run db:generate  # 마이그레이션 파일 생성
npm run db:migrate   # 마이그레이션 실행
npm run db:studio    # Drizzle Studio (DB GUI)
```

## Architecture

리드(이름·이메일·전화번호) 수집용 단일 페이지 앱.

- **`src/app/page.tsx`** — 서버 컴포넌트. 레이아웃(로고, 카드)만 담당.
- **`src/app/LeadForm.tsx`** — 클라이언트 컴포넌트. `useActionState`로 제출 상태(pending, error, success) 관리.
- **`src/app/actions.ts`** — Server Action (`'use server'`). 유효성 검사 후 Drizzle로 DB에 insert.
- **`src/lib/schema.ts`** — Drizzle 스키마. `leads` 테이블(id, name, email unique, phone, created_at).
- **`src/lib/db.ts`** — postgres.js + Drizzle 클라이언트 (Transaction mode pooler, `prepare: false` 필수).
- **`src/lib/supabase.ts`** — Supabase JS 클라이언트 (현재 미사용, 필요 시 auth 등에 활용).

## Environment Variables

`.env.local` 필요 (`.env.example` 참고):

```
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

- `drizzle.config.ts`가 `dotenv`로 `.env.local`을 직접 로드하므로 `db:*` 스크립트는 별도 env 설정 불필요.
- Supabase Transaction mode pooler는 `prepare: false` 없이는 연결 오류 발생.
- 전화번호는 DB 저장 전 하이픈 제거 처리됨 (`actions.ts`).
